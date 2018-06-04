// import { webURL, initUrl } from "../../service/constant"
// import { Dimensions } from 'react-native';
const { initUrl } = require('../utils/basicurl')
const winObj = {
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
}

function changeEm(str) {
    if (str.indexOf("em") >= 0) {
        str = str.replace("em", "")
        return Number(str) * 20
    }
    if (str.indexOf('auto') >= 0) {
        return 'auto'
    }
    return str
}
class OptionController {
    //获取url
    static _handleImageURL(content) {
        var re2 = /\/.*?\.(?:png|jpg)/gm;
        let suffixUrl = re2.exec(content)
        let sufUrl = suffixUrl[0]
        if (sufUrl.indexOf("shuatiapp.cn") >= 0) {
            if (sufUrl.indexOf("https:") == -1) {
                return "https:" + sufUrl
            }
            return sufUrl
        }
        return initUrl + sufUrl
    }

    //获取属性中的wdith 和 height
    static getAttr(str) {
        let widthReg = /width=[\'\"]?([^\'\"]*)[\'\"]?/i,
            heightReg = /height=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let widthStr = str.match(widthReg),
            heightStr = str.match(heightReg);
        let obj = {}
        if (!!widthStr) {
            obj['width'] = changeEm(widthStr[1])

        }
        if (!!heightStr) {
            obj['height'] = changeEm(heightStr[1])

        }
        return obj

    }

    //获取style 属性
    static getStyle = (str) => {
        let styleReg = /style=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let styleStr = str.match(styleReg);
        let obj = {}
        if (!!styleStr) {
            //可能在style里
            let styleArr = styleStr[1].split(';')
            styleArr.forEach(res => {
                let arr = ([], res.split(':'))
                if (arr[0].indexOf('width') >= 0) {
                    obj['width'] = changeEm(arr[1])

                }
                if (arr[0].indexOf('height') >= 0) {
                    obj['height'] = changeEm(arr[1])

                }
            })
        }
        return obj
    }

    static setStyle(attr, style, size, scale) {
        let obj = {}
        obj.height = parseInt(attr['height'] || style['height'] || size[3] * scale, 10)

        if (attr['width'] === 'auto' || style['width'] === 'auto') {
            obj.width = obj.height / size[3] * size[2]
            return obj
        }
        obj.width = parseInt(attr['width'] || style['width'] || size[2] * scale, 10)
        return obj
    }

    static setStyleForAnalysis({ width, height }) {
        const window = winObj
        let returnWidth = width,
            returnHeight = height;

        if (width > (window.width - 60)) {
            returnWidth = window.width - 60
            returnHeight = returnWidth / width * height
        }

        return {
            width: returnWidth,
            height: returnHeight
        }
    }
}

module.exports = OptionController