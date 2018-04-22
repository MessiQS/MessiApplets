// pages/paper_selection/paper_selection.js
const questionManager = require('../../service/question_manager')
const loginManager = require('../../service/login_manager')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("option", options.data)
    var papers = JSON.parse(options.data)
    var list = papers.data
    var title = papers.title

    this.setData({
      list:list
    })

    wx.setNavigationBarTitle({
      title: title
    })

    this.prepareData()
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

  prepareData: function() {
    
  },

  itemTap: function(e) {
    var item = e.currentTarget.dataset.item
    console.log("item tap", item)

    questionManager.downloadPaper(item.id, function(success, response, error) {
      if (success) {

      }
      
    })

    questionManager.getSpecialRecordByPaperId(item.id, function(success, response, error) {

    })
  }
})