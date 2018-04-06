
function NetWorkManager() {


}

NetWorkManager.prototype.post = function (api, paramObj, hasToken) {

  var webURL = "https://shuatiapp.cn/" + api;

  wx.request({
    url: webURL, //仅为示例，并非真实的接口地址
    data: {
      x: '',
      y: ''
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res.data)
    }
  })
}
