const basic = require('./basicurl.js')
const loginManager = require("../service/login_manager")
const webUrl = basic.initUrl

const post = (api, data, callback) => {
  let url = webUrl + api,
  params = {
    url,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: loginManager.token,
    },
    data,
    success: callback,
    fail: callback,
  }
  wx.request(params)
}

const get = (api, data, callback) => {

  data.user_id = loginManager.user_id;
  let url = webUrl + api,
    params = {
      url,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: loginManager.token,
      },
      data,
      success: callback,
      fail: callback,
    }
  wx.request(params)
}

module.exports = {
  get,
  post
}