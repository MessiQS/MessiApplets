// pages/province_selection/province_selection.js
const questionManager = require('../../service/question_manager')
const loginManager = require('../../service/login_manager')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItems: ['历年真题', '专项练习', '申论'],
    currentIndex: 0,
    list:[],
    provinces: []
  },
  selectType: function (event) {
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
  },
  swiperChange: function (event) {
    this.setData({
      currentIndex: event.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.prepareData();


    // let _this = this;
    // Http.get('/api/papertype', {
    //   user_id: "SS00000001"
    // }, function (argu) {
    //   const list = argu.data.data.map(res => ({
    //     title:res.title,
    //     length:res.data.length
    //   }))
    //   //console.log(list)
    //   _this.setData({
    //     list
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * init data
   */
  prepareData: function() {
    var that = this
    questionManager.getPublicOfficialsInfo(function(success, response, error) {
      that.setData ({
        provinces: response
      })
    });
  }, 
  navigateToSelectPaperVC: function(item) {
    var data = item.currentTarget.dataset.item
    wx.navigateTo({
      url: '../paper_selection/paper_selection?data=' + JSON.stringify(data)
    })
  }
})