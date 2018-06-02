// pages/main_category_selection.js

const paperManager = require("../../service/paper_manager")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      {
        title:"公务员",
        subtitles:["公考"],
        action:"gwy"
      },
      {
        title:"会计",
        subtitles:["初级会计职称", "中级会计职称", "高级会计职称", "注册会计师"],
        action: "kj"         
      },
      {
        title:"会计",
        subtitles:["初级会计职称", "中级会计职称", "高级会计职称", "注册会计师"],
        action: "kj"                 
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const that = this
    paperManager.getMainCategory((success, data, error) => {
      if (success) {
        that.setData({
          categories: data
        })
      }
    })

    wx.setNavigationBarTitle({
      title: "选择题库"//页面标题为路由参数
    })
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

  cagegoryButtonClick: function(e) {

    let content = e.currentTarget.dataset.item
    console.log("content", content)
    let json = JSON.stringify(content)

    wx.navigateTo({
      url: '../secondary_category/secondary_category?param='+json
    })
  }
})