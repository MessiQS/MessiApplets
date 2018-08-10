//index.js
//获取应用实例
const app = getApp();
var loginManager = require("../../service/login_manager.js");
const questionMananger = require("../../service/question_manager.js")
const paperManager = require("../../service/paper_manager")

import { newPaper, pieOption, rememberPaper } from '.././../configuration/echart_options.js';
import * as echarts from '../../vendor/ec-canvas/echarts';

let chartCache = {} //存储chart
let callbackCache = {
  'ec1': ec1Deal,
  'ec2': ec2Deal,
  'pie': peiDeal
}
function initChartModel(callback, key) {
  return function initChart(canvas, width, height) {
    let option = callback(getQuesObj())
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    chartCache[key] = chart
    return chart;
  }
}
function getQuesObj() {
  return {
    chartInfo: questionMananger.getChartInfo(),
    weekday: questionMananger.getChartBeforeWeekday()
  }
}
function ec1Deal({ chartInfo, weekday }) {
  newPaper.option.series[0].data = chartInfo.beforeArray.map((value) => {
    return value.length
  })
  newPaper.option.xAxis[0].data = weekday
  return newPaper.option
}

function ec2Deal({ chartInfo, weekday }) {
  rememberPaper.option.series[0].data = chartInfo.futureArray
  rememberPaper.option.xAxis[0].data = weekday
  return rememberPaper.option
}

function peiDeal({ chartInfo, weekday }) {
  pieOption.option.series[0].data = chartInfo.pieArray
  return pieOption.option
}

function renderChart() {
  let chartArr = Object.keys(chartCache)
  chartArr.forEach(res => {
    let chart = chartCache[res]
    let callback = callbackCache[res]
    let option = callback(getQuesObj())
    chart.setOption(option)
  })
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ec: {
      onInit: initChartModel(callbackCache['ec1'], 'ec1')
    },
    ec2: {
      onInit: initChartModel(callbackCache['ec2'], 'ec2')
    },
    pie: {
      onInit: initChartModel(callbackCache['pie'], 'pie')
    },
    chartInfo: {},
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
    let title = "当前暂无题库信息"

    if (paper.title != null && paper.title.length != 0) {
      title = paper.title
    }
    //刷新chart
    renderChart()

    let spaceTotal = wx.getSystemInfoSync().windowHeight - 78 - 600
    let space = Math.max(spaceTotal/3, 10)

    let marginTop = space.toString()+"px"
    this.setData({
      chartInfo,
      title,
      marginTop
    })
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
  goAnswerButtonClick: function (e) {
    if (questionMananger.hasQuestions()) {
      this.navigateToAnswerDetail(e)
    } else {
      this.navigateToPaper(e)
    }
  },
  /// 去答题
  navigateToAnswerDetail: function (e) {
    let type = e.currentTarget.dataset.type
    if (questionMananger.hasQuestionWithType(type) == false) {
      wx.showToast({
        title: '当前没有可刷题目',
        icon: 'none',
        duration: 2000
      })
      return
    }
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
    // //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
