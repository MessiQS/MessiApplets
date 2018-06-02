
const basic = require('../utils/basicurl')
const webUrl = basic.initUrl

class LoginManager {

  constructor() {


  }

  login() {

    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: webUrl + '/api/wxlogin',
            method: "POST",
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.type === true) {
                //console.log(webUrl + "/api/wxlogin", "res success")
                try {
                  
                  wx.setStorageSync('user_id', res.data.data.user_id);
                  wx.setStorageSync('token', res.data.data.token);

                  that.token = res.data.data.token;
                  that.user_id = res.data.data.user_id

                  //console.log("token", that.token, "user_id", that.user_id)

                } catch (e) {
                  
                }
              }
            }
          })
        } else {
          //console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }

  getUserId() {
    return this.user_id
  }
}

module.exports = new LoginManager()