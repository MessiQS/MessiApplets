// pages/secondary_category/secondary_category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    categories:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = JSON.parse(options.param)
    wx.setNavigationBarTitle({
      title: param.secondType//页面标题为路由参数
    })

    console.log("secondary category", options)
    this.setData({
      title:param.secondType,
      categories:param.content
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

  secondaryCagegoryButtonClick: function(e) {

    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../final_category/final_category?sendType=' + this.data.title + "&province=" + item
    })
  }
})