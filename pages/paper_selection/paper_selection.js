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
    //console.log("option", options.data)
    var papers = JSON.parse(options.data)
    var list = papers.data.sort((a, b) => {
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      // a 必须等于 b
      return 0;
    })

    var title = papers.title

    this.setData({
      list: list
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

  prepareData: function () {

  },

  itemTap: function (e) {
    var item = e.currentTarget.dataset.item
    //console.log("item tap", item)

    questionManager.downloadPaper(item.id, function (success, response, error) {
      if (success) {

        var array = Array();
        for (let question of response) {
          var memoryModel = Object()

          memoryModel.question = question;
          memoryModel.weighting = 0;
          memoryModel.appearedServeralTime = 0;
          memoryModel.lastBySelectedTime = 0;
          memoryModel.firstBySelectedTime = 0;
          memoryModel.records = [];
          memoryModel.examId = item.id;

          array.push(memoryModel); 
        }
        questionManager.setCurrentMemoryModels(array);


        // questionManager.getSpecialRecordByPaperId(item.id, function (success, response, error) {

        //   //console.log("getSpecialRecordByPaperId", response);
        // });
      }
    })
  }
})