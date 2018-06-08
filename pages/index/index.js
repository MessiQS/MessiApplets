//index.js
//获取应用实例
const app = getApp();
var loginManager = require("../../service/login_manager.js");
const questionMananger = require("../../service/question_manager.js")
const paperManager = require("../../service/paper_manager")

import { newPaper, pieOption, rememberPaper } from '.././../configuration/echart_options.js';
import * as echarts from '../../vendor/ec-canvas/echarts';

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  let chartInfo = questionMananger.getChartInfo()
  let weekday = questionMananger.getChartBeforeWeekday()
  
  newPaper.option.series[0].data = chartInfo.beforeArray.map ((value) => {
    return value.length
  })
  newPaper.option.xAxis[0].data = weekday

  canvas.setChart(chart);
  chart.setOption(newPaper.option);

  return chart;
}

function initChart2(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  let chartInfo = questionMananger.getChartInfo()
  let weekday = questionMananger.getChartFutureWeekday()

  rememberPaper.option.series[0].data = chartInfo.futureArray
  rememberPaper.option.xAxis[0].data = weekday
  
  canvas.setChart(chart);
  chart.setOption(rememberPaper.option);

  return chart;
}

function initPie(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  let chartInfo = questionMananger.getChartInfo()

  pieOption.option.series[0].data = chartInfo.pieArray
  
  canvas.setChart(chart);
  chart.setOption(pieOption.option);

  return chart;
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    pie: {
      onInit: initPie
    },
    chartInfo:{},
    title: "当前暂无题库信息"

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

    let chartInfo = questionMananger.getChartInfo()
    let paper = paperManager.getCurrentPaperItem()
    let title =  "当前暂无题库信息"

    if (paper.title != null && paper.title.length != 0) {
      title = paper.title
    }
    this.setData({
      chartInfo,
      title,
    })

    console.log("chartInfo", chartInfo)
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //去选题
  navigateToPaper: function () {
    wx.navigateTo({
      url: '../main_category_selection/main_category_selection?id=1'
    })
  },
  goAnswerButtonClick: function(e) {

    let type = e.currentTarget.dataset.type

    if (questionMananger.hasQuestions() == false) {
      this.navigateToPaper(e)
      return
    }
    console.log("hasWrongQuestion", questionMananger.hasWrongQuestion())

    /// 如果没有错题
    if (type == "wrong") {
      if (questionMananger.hasWrongQuestion() == false) {
        wx.showToast({
          title: '当前没有剩余题目',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    this.navigateToAnswerDetail(type)
    return 
    
  },
  /// 去答题
  navigateToAnswerDetail: function (type) {
    console.log("navigateToAnswerDetail", type)
    wx.navigateTo({
      url: '../answer_detail/answer_detail?type='+type
    })
  },
  onLoad: function () {

    loginManager.login();

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
