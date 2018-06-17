const HTTP = require("../utils/http")
const URLManager = require("./url_manager")


class PaperManager {

    constructor() {

    }

    getMainCategory(callback) {

        HTTP.get("/api/getSecondType", {}, function (res) {
            //console.log("api/getSecondType", res.data)
            callback(res.data.type, res.data.data, null)
        })
    }

    getFinalCategories(paramDic, callback) {

        HTTP.get("/api/getTitleByProvince", paramDic, function (res) {
            //console.log("api/getTitleByProvince", res.data)
            callback(res.data.type, res.data.data, null)
        })
    }

    setCurrentPaperItem(item) {
        try {
            wx.setStorageSync('currentPaperItem', item)
        } catch (e) {

        }
    }

    getCurrentPaperItem() {
        let currentPaperItem = {}
        try {
            var value = wx.getStorageSync('currentPaperItem')
            if (value) {
                // Do something with return value
                currentPaperItem = value
            }
        } catch (e) {
            // Do something when catch error
        }
        //console.log("currentPaperItem ", value)

        return currentPaperItem
    }

    getPaperId() {
        let paper = this.getCurrentPaperItem()
        if (paper) {
            return paper.id
        }
        return ""
    }

    getUnlockPaperIds() {
        let unlockPapers = []
        try {
            var value = wx.getStorageSync('UnlockPaper')
            if (!!value) {
                // Do something with return value
                unlockPapers = value
            }
        } catch (e) {

        }
        console.log("UnlockPaper", unlockPapers)
        return unlockPapers
    }

    unlockPaper(paper_id) {

        let papers = this.getUnlockPaperIds()
        papers.push(paper_id)
        try {
            wx.setStorageSync('UnlockPaper', papers)
        } catch (e) {

        }
    }
}


module.exports = new PaperManager()
