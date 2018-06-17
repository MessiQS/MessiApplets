// pages/final_category/final_category.js

const paperManager = require("../../service/paper_manager")
const questionManager = require("../../service/question_manager")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected_paper_id: "",
    items: [],
    unlock:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: options.province//页面标题为路由参数
    })
    
    let item = paperManager.getCurrentPaperItem()
    paperManager.getFinalCategories(options, (success, data, error) => {
      if (success) {
        //console.log("success, data", success, data)

        data.sort((a, b) => {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }
          // a 必须等于 b
          return 0;
        })

        let paperId = data[0].paper_id
        let paperIds = paperManager.getUnlockPaperIds()
        let unlock = paperIds.includes(paperId)
        that.setData({
          items: data,
          selected_paper_id:item.paper_id,
          unlock
        })
      }
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
  onShareAppMessage: function (res) {
    console.log("res", res)
  
    let unlockPaperId = this.data.items[0].paper_id
    paperManager.unlockPaper(unlockPaperId)

    return {
      title: '自定义转发标题',
      path: '../../index/index'
    }
  },

  unlock: function() {
    const that = this
    wx.showModal({
      title: '一起刷题',
      content: '邀请一位同学即可解锁当前',
      confirmText: "去邀请",
      success: function (res) {
        if (res.confirm) {
          
        } else if (res.cancel) {
          
        }
      }
    })
  },

  chooseExam: function(e) {
    const that = this

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    var item = e.currentTarget.dataset.item

    paperManager.setCurrentPaperItem(item)
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
        that.setData({
          selected_paper_id:item.paper_id
        })
        wx.hideLoading()
        wx.navigateBack({
          delta: 3
        })
      }
    })
  }
})
