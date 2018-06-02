const HTTP = require("../utils/http")
const URLManager = require("./url_manager")


class PaperManager {

    constructor() {

    }

    getMainCategory(callback) {

        HTTP.get("/api/getSecondType", {}, function (res) {
            console.log("api/getSecondType", res.data)
            callback(res.data.type, res.data.data, null)
        })
    }

    getFinalCategories(paramDic, callback) {

        HTTP.get("/api/getTitleByProvince", paramDic, function (res) {
            console.log("api/getTitleByProvince", res.data)
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
        console.log("currentPaperItem ", value)

        return currentPaperItem
    }
}


module.exports = new PaperManager()
