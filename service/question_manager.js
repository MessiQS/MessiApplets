
const HTTP = require("../utils/http")
const URLManager = require("./url_manager")
const moment = require('../utils/moment.min.js')
const loginManager = require("../service/login_manager")
const paperManager = require("../service/paper_manager")
const OptionController = require("./option.controller")

var daysTransfer = {
    'Sunday': '周日',
    'Monday': '周一',
    'Tuesday': '周二',
    'Wednesday': '周三',
    'Thursday': '周四',
    'Friday': '周五',
    'Saturday': '周六'
}

class QuestionManager {

    constructor() {

        this.currentExams = []
        this.currentMemoryModelsIndex = 0
    }

    hasQuestions() {
        var memorys = this.getCurrentMemoryModels()
        if (Array.isArray(memorys) && memorys.length === 0) {
            return false
        }
        return true
    }

    hasWrongQuestion() {
        var memorys = this.getCurrentMemoryModels()
        if (Array.isArray(memorys) && memorys.length === 0) {
            return false
        }
        var models = memorys.filter(value => value.appearedServeralTime > 0 && value.weighting < 7)
        if (Array.isArray(models) && models.length === 0) {
            return false
        }
        return true
    }

    hasNewQuestion() {
        var memorys = this.getCurrentMemoryModels()
        if (Array.isArray(memorys) && memorys.length === 0) {
            return false
        }
        var models = memorys.filter(value => value.appearedServeralTime == 0)
        if (Array.isArray(models) && models.length === 0) {
            return false
        }
        return true
    }

    hasQuestionWithType(type) {
        if (type == "new") {
            return this.hasNewQuestion()
        }
        if (type == "wrong") {
            return this.hasWrongQuestion()
        }
    }

    setCurrentMemoryModels(newValue) {

        const that = this
        /// 过滤 </br> 标签
        newValue.forEach(function (item) {
            Object.keys(item.question).forEach(function (key) {
                let value = item.question[key]
                if (that.isString(value)) {
                    item.question[key] = that.filterTag(value)
                }
            })
        })

        this.saveToCurrentMemoryModels(newValue)
    }

    handleMemoryModels(callback) {
        const that = this
        that.getSpecialRecordByPaperId(paperManager.getPaperId(), function(success, data, error) {
            if (success) {
                let keys = Object.keys(data)
                var memorys = that.getCurrentMemoryModels()
                let key = keys[0]
                let records = data[key]
                for (let key in records) {
                    let record = records[key]
                    for (let memory of memorys) {
                        if (record.question_id == memory.question.id) {
                            that.saveRecordToMemory(memory, record)
                        }
                    }
                }
                that.saveToCurrentMemoryModels(memorys)
                callback(success, memorys, null)
                return 
            }
            callback(success, null, error)
        })
    }

    saveRecordToMemory(memory, record) {
        memory.firstBySelectedTime = record.firstDateTime
        memory.lastBySelectedTime = record.lastDateTime
        memory.records = JSON.parse(record.record)
        memory.weighted = record.weighted
        memory.correct = record.correct
    }

    saveToCurrentMemoryModels(value) {

        try {
            wx.setStorageSync('currentMemoryModels', value)
        } catch (e) {
            console.log("saveToCurrentMemoryModels error", e)
        }
    }

    getCurrentMemoryModels() {
        let models = []
        try {
            var value = wx.getStorageSync('currentMemoryModels')
            if (value) {
                // Do something with return value
                models = value
            }
        } catch (e) {
            // Do something when catch error
        }

        return models
    }

    getRandomMemoryModel(type) {

        if (type == "new") {
            var newModels = this.getCurrentMemoryModels().filter(value => value.appearedServeralTime == 0)
            this.currentMemoryModelsIndex = Math.floor(Math.random() * newModels.length)
            var model = newModels[this.currentMemoryModelsIndex]
            return model
        }

        if (type == "wrong") {
            var models = this.getCurrentMemoryModels().filter(value => value.appearedServeralTime > 0 && value.weighting < 7)
            this.currentMemoryModelsIndex = Math.floor(Math.random() * models.length)
            var model = models[this.currentMemoryModelsIndex]
            return model
        }
    }

    getMemoryModel(number) {

        var models = this.getCurrentMemoryModels().filter(value => value.question.question_number == number)

        return models[0]
    }

    select(option, memoryModel) {

        var score = 0
        var isRight = false
        if (option == memoryModel.question.answer) {

            score = 7 - memoryModel.appearedServeralTime
            score = Math.max(1, score)
            isRight = true
        }
        var record = {
            select: option,
            isRight: isRight
        }
        var time = new Date()
        memoryModel.weighting = memoryModel.weighting + score
        if (memoryModel.firstBySelectedTime == 0) {
            memoryModel.firstBySelectedTime = time.getTime()
        }
        memoryModel.appearedServeralTime += 1
        memoryModel.lastBySelectedTime = time.getTime()
        memoryModel.records.push(record)

        var currentModels = this.getCurrentMemoryModels()

        // for (var value in this.currentExams) {
        //     if (value.question.id ==  memoryModel.question.id) {
        //         value = memoryModel
        //     }
        // }

        for (var i = 0; i < currentModels.length; i++) {
            if (currentModels[i].question.id == memoryModel.question.id) {
                console.log("currentModels[i]", currentModels[i], "memoryModel", memoryModel)

                currentModels[i] = memoryModel
            }
        }
        
        this.saveToCurrentMemoryModels(currentModels)
        this.sendToService(isRight, memoryModel)
    }

    isEmpty(value) {
        return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
    }

    filterTag(str) {
        return str.replace(/<\/br>/g, "\n\n").replace(/<br\/>/g, "\n\n").replace(/<br/g, "\n\n").replace(/<!--StartFragment -->/g, "")
    }

    isString(str) {
        return (typeof str == 'string') && str.constructor == String;
    }

    renderQuestion(str) {

        let filterStr = this.filterTag(str)
        let regex = /<img/g
        let splits = filterStr.split(regex)
        const scale = 0.9

        //没有图片
        if (splits.length === 1 && filterStr.indexOf('img') < 0) {
            let item = {
                type: "text",
                text: filterStr
            }
            return [item]
        }

        //文字与图嵌套
        let optionArray = [],
            count = 0;

        splits.forEach((result, index) => {
            if (result.indexOf('/>') >= 0) {
                let imgArr = result.split('/>')
                if (!!imgArr[1]) {
                    optionArray[index] = imgArr
                } else {
                    splits[index] = imgArr[0]
                }
            }
        })
        optionArray.forEach((result, index) => {
            splits.splice(index, 1 + count, ...result)
            count++
        })

        let newArray = splits.map((content, index) => {

            let item = {}
            if (content.search(/.\/(.*)png/g) >= 0 || content.search(/.\/(.*)jpg/g) >= 0) {
                let url = URLManager.handleImageURL(content)

                let styleObj = URLManager.getStyle(content)
                let attrObj = URLManager.getAttr(content)

                let expr = /\/(.*)_(.*)x(.*)_/;
                let size = url.match(expr)

                let width = wx.getSystemInfoSync().windowWidth - 40
                let height = 200
                if (Array.isArray(size) && size.length !== 0 && typeof (size) == undefined) {

                    let styleFromCulti = URLManager.setStyle(attrObj, styleObj, size, scale)
                    let size = URLManager.setStyleForAnalysis(styleFromCulti)
                    width = size.width
                    height = size.height
                }

                /// 当图片宽度小于屏幕的0.7倍，不可点击放大
                let disabled = width < (wx.getSystemInfoSync().windowWidth * 0.7) ? true : false
                item.type = "image"
                item.width = width ? `${width}px` : 'auto'
                item.height = height ? `${height}px` : 'auto'
                item.url = url

                return item
            }

            if (content.search(/.\/(.*)gif/g) >= 0) {

                var re2 = /\".*?\"/gm;
                let urlArray = re2.exec(content)
                let url = urlArray[0].replace(/\"/g, "")

                item.type = "gif"
                item.url = url

                return item
            }

            item.type = "text"
            item.text = content

            return item
        })

        //console.log("newArray", newArray)
        return newArray
    }

    renderAnswer(str) {
        let regex = /<img/g
        let splits = str.split(regex)
        const scale = 0.3
        //没有图片
        if (splits.length === 1 && str.indexOf('img') < 0) {
            return [{
                type: "text",
                content: str
            }]
        }
        //单图情况
        if (splits.length === 1 && str.indexOf('img') >= 0 || splits.length === 2 && !splits[0].trim()) {
            let trueStr = splits.length === 1 && str.indexOf('img') >= 0 ? splits[0] : splits[1]
            let url = OptionController._handleImageURL(trueStr)
            let styleObj = OptionController.getStyle(str)
            let attrObj = OptionController.getAttr(str)
            let expr = /\/(.*)_(.*)x(.*)_/;
            let size = url.match(expr)
            if (Array.isArray(size) && size.length !== 0) {
                let { width, height } = OptionController.setStyle(attrObj, styleObj, size, scale)
                return [{
                    url,
                    type: "image",
                    width: width ? `${width}px` : width,
                    height: height ? `${height}px` : height,
                }]
            }
            return [{
                url,
                type: "image",
                width: 'auto',
                height: 'auto'
            }]
        }
        //文字与图嵌套
        let optionArray = [],
            count = 0;
        splits.forEach((result, index) => {
            if (result.indexOf('/>') >= 0) {
                let imgArr = result.split('/>')
                if (!!imgArr[1]) {
                    optionArray[index] = imgArr
                } else {
                    splits[index] = imgArr[0]
                }
            }
        })
        optionArray.forEach((result, index) => {
            splits.splice(index, 1 + count, ...result)
            count++
        })

        return splits.map((content, index) => {
            if (content.search(/.\/(.*)png/g) >= 0 || content.search(/.\/(.*)jpg/g) >= 0) {
                let url = OptionController._handleImageURL(content)
                let styleObj = OptionController.getStyle(content)
                let attrObj = OptionController.getAttr(content)
                let expr = /\/(.*)_(.*)x(.*)_/;
                let size = url.match(expr)
                if (Array.isArray(size) && size.length !== 0) {
                    let { width, height } = OptionController.setStyle(attrObj, styleObj, size, scale)
                    return {
                        url,
                        type: "image",
                        width: width ? `${width}px` : width,
                        height: height ? `${height}px` : height,
                    }
                }
                return {
                    url,
                    type: "image",
                    width: 'auto',
                    height: 'auto'
                }
            } else {
                return {
                    type: "text",
                    content: content
                }
            }
        })
    }

    renderAnswerImage(content) {

        let url = URLManager.handleImageURL(content)
        let expr = /\/(.*)_(.*)x(.*)_/;
        let size = url.match(expr)

        let item = {
            url,
            type: "image"
        }
        if (Array.isArray(size) && size.length !== 0 && typeof (size) == undefined) {
            const scale = 0.3
            let width = size[2] * scale
            let height = size[3] * scale

            if (size[1].search("formula")) {
                width = size[2] * (23 / size[3])
                height = 23
            }
            item.width = width
            item.height = height
        }
        item.width = "auto"
        item.height = "auto"

        return item
    }

    getChartInfo() {

        let object = new Object()

        var timeStamp = parseInt(new Date().setHours(0, 0, 0, 0))

        let memorys = this.getCurrentMemoryModels()

        var finishedModels = []
        var unfinishedModels = []

        memorys.forEach((value, index) => {

            if (value.weighting >= 7 && value.appearedServeralTime > 0) {
                finishedModels.push(value)
            }
            if (value.weighting < 7 && value.appearedServeralTime > 0) {
                unfinishedModels.push(value)
            }
        })

        var x = finishedModels.length
        var y = unfinishedModels.length

        var futureArray = []
        futureArray.push(x + y)
        futureArray.push(Math.round(x + (0.6 * y)))
        futureArray.push(Math.round(x + (0.45 * y)))
        futureArray.push(Math.round(x + (0.36 * y)))
        futureArray.push(Math.round(x + (0.34 * y)))
        futureArray.push(Math.round(x + (0.28 * y)))

        object.futureArray = futureArray

        var beforeArray = []
        var oneDay = 24 * 60 * 60 * 1000

        var before_5 = []
        var before_4 = []
        var before_3 = []
        var before_2 = []
        var before_1 = []
        var todayNumber = []

        memorys.forEach((value, index) => {

            if (value.firstBySelectedTime < timeStamp - 4 * oneDay && value.firstBySelectedTime > timeStamp - 5 * oneDay) {
                before_5.push(value)
            }
            if (value.firstBySelectedTime < timeStamp - 3 * oneDay && value.firstBySelectedTime > timeStamp - 4 * oneDay) {
                before_4.push(value)
            }
            if (value.firstBySelectedTime < timeStamp - 2 * oneDay && value.firstBySelectedTime > timeStamp - 3 * oneDay) {
                before_3.push(value)
            }
            if (value.firstBySelectedTime < timeStamp - 1 * oneDay && value.firstBySelectedTime > timeStamp - 2 * oneDay) {
                before_2.push(value)
            }
            if (value.firstBySelectedTime < timeStamp && value.firstBySelectedTime > timeStamp - 1 * oneDay) {
                before_1.push(value)
            }
            if (value.firstBySelectedTime > timeStamp) {
                todayNumber.push(value)
            }
        })
        beforeArray.push(before_5)
        beforeArray.push(before_4)
        beforeArray.push(before_3)
        beforeArray.push(before_2)
        beforeArray.push(before_1)
        beforeArray.push(todayNumber)

        object.beforeArray = beforeArray

        var a = []
        var b = []
        var c = []

        let wrongQuestions = []
        memorys.forEach(value => {
            if (value.records.length == 0) {
                a.push(value)
            } else if (value.records.length == 1) {
                b.push(value)
            } else {
                c.push(value)
            }

            if (value.weighting < 7 && value.appearedServeralTime > 0) {
                wrongQuestions.push(value)
            }
        })

        object.newQuestionCount = a.length
        /// 剩余次数
        object.wrongQuestionCount = y

        object.newLastSelectDate = "暂无数据"
        object.wrongLastSelectDate = "暂无数据"

        var wrongSum = beforeArray.map(function (value, index) {
            return value.length
        }).reduce(function (a, b) {
            return a + b
        })

        var wrongAvg = wrongSum / beforeArray.length

        object.newAverage = Math.round(wrongAvg)

        //console.log("wrongAvg", wrongAvg, " wrongSum", wrongSum, " newAverage", object.newAverage, " beforeArray", beforeArray)


        var newSum = futureArray.reduce(function (a, b) { return a + b })
        var newAvg = newSum / futureArray.length
        /// 平均错题数
        object.wrongAverage = Math.round(newAvg)

        if (b.length != 0) {
            b.sort((a1, b1) => {
                return b1.firstBySelectedTime - a1.firstBySelectedTime
            })
            var model = b[0]
            var date = new Date(model.firstBySelectedTime)
            object.newLastSelectDate = this.getDateFormat(date)
        }
        if (c.length != 0) {
            c.sort((a1, b1) => {
                return b1.lastBySelectedTime - a1.lastBySelectedTime
            })
            var model = c[0]
            var date = new Date(model.lastBySelectedTime)
            object.wrongLastSelectDate = this.getDateFormat(date)
        }

        object.pieArray = [{ value: x }, { value: object.wrongQuestionCount }, { value: a.length }]

        return object
    }

    getDateFormat(date) {

        return moment(date).calendar(null, {
            sameDay: '今日',
            lastDay: '昨日',
            lastWeek: '1周前',
            sameElse(moment_input) {

                /// 当前年份减输入年份
                var diff = moment().diff(moment_input, 'days')
                if (diff < 7) {
                    return diff + "天前"
                }
                var diff_1 = moment().diff(moment_input, 'weeks')
                if (diff_1 <= 5) {
                    return diff_1 + "周前"
                }
                var diff_2 = moment().diff(moment_input, 'months')
                if (diff_2 <= 12) {
                    return diff_2 + "月前"
                }
                var diff_3 = moment().diff(moment_input, 'months')

                return diff_3 + "年前"
            },
        })
    }

    getChartBeforeWeekday() {

        let weekArray = []
        for (var i = 5; i > 0; i--) {
            let day = moment().subtract(i, 'days').format('dddd')
            let d = {
                value: daysTransfer[day],
                textStyle: {
                    fontSize: 12,
                    color: '#8E9091'
                }
            }
            weekArray.push(d)
        }
        weekArray.push({
            value: '今日',
            textStyle: {
                fontSize: 12,
                color: '#172434'
            }
        })

        return weekArray
    }

    getChartFutureWeekday() {

        let weekArray = [{
            value: '今日',
            textStyle: {
                fontSize: 12,
                color: '#172434'
            }
        }]
        for (var i = 1; i < 6; i++) {
            let day = moment().add(i, 'days').format('dddd')
            let d = {
                value: daysTransfer[day],
                textStyle: {
                    fontSize: 12,
                    color: '#8E9091'
                }
            }
            weekArray.push(d)
        }
        return weekArray
    }

    feedbackQuestion(model, callback) {
        //console.log("feedback ", model)
        let params = {
            title: model.question.title,
            id: model.question.id,
            question_number: model.question.question_number.toString(),
            user_id: loginManager.getUserId(),
        }

        HTTP.post("/api/wrongFeedBack", params, function (res) {
            //console.log("api/wrongFeedBack", res)
            callback(res.data.type, res.data.data, null)
        })
    }

    getPublicOfficialsInfo(callback) {

        HTTP.get("/api/papertype", {}, function (res) {
            //console.log("api/papertype", res.data)
            callback(res.data.type, res.data.data, null)
        })
    }

    getSpecialRecordByPaperId(paper_id, callback) {

        HTTP.get("/api/getQuestionInfoByPaperid", {
            paper_id
        }, function (res) {
            console.log("api/getQuestionInfoByPaperid", res)
            callback(res.data.type, res.data.data, null)
        })
    }

    downloadPaper(paperId, callback) {

        var that = this
        HTTP.get("/api/getpaper", {
            paperId
        }, function (res) {
            //console.log("api/getpaper", res)
            that.currentExams = res.data.data
            callback(res.data.type, res.data.data, null)
        })
    }

    sendToService(isRight, model) {

        let records = []

        model.records.forEach(value => {
            let record = {
                time: value.time,
                isRight: value.isRight,
                select: value.select
            }
            records.push(record)
        })

        var param = {
            user_id: loginManager.getUserId,
            paper_id: paperManager.getPaperId(),
            question_id: model.question.id,
            question_number: model.question.question_number,
            weighted: model.weighting,
            lastDateTime: model.lastBySelectedTime,
            record: JSON.stringify(records),
            firstDateTime: model.firstBySelectedTime,
        }
        if (isRight == true) {
            param.correct = "1"
            param.wrong = "0"
        } else {
            param.correct = "0"
            param.wrong = "1"
        }
        console.log("api/getUpdateInfoCache param", param)
        HTTP.post("/api/getUpdateInfoCache", param, function (res) {
            console.log("api/getUpdateInfoCache", res)
        })
    }
}

module.exports = new QuestionManager()