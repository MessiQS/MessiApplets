const basic = require('./basicurl.js')
const token = "f5174bc39daf4912fd7b638b9201f0fc"
const webUrl = basic.initUrl

const post = (api, data, callback) => {
  let url = webUrl + api,
  params = {
    url,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: token,
    },
    data,
    success: callback,
    fail: callback,
  }
  wx.request(params)
}

const get = (api, data, callback) => {
  let url = webUrl + api,
    params = {
      url,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
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