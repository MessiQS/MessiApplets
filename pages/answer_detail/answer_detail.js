// pages/answer_detail/answer_detail.js
const ItemStatus = {
  NORMAL: 'normal',
  SELECTED: 'selected',
  RIGHT: 'right',
  ERROR: 'error',
};
const questionManager = require("../../service/question_manager")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    questionPaper: {
      id: "",
      analysis: "受伤者无法自行下车，就说明伤者行动不便，这时应设法将其移出，以免汽车发生突发状况，造成二次伤害。",
      answer: "A",
      category: "判断",
      created_at: "1521977933121",
      option_A: "对",
      option_B: "错",
      option_C: "",
      option_D: "",
      province: "科目四",
      question: "受伤者在车内无法自行下车时，可设法将其从车内移出，尽量避免二次受伤。",
      question_material: "",
      question_number: 7,
      question_point: "单选",
      subject: "subject",
      title: "交通事故救护及常见危化品处置常识试题",
      updated_at: "000",
    },
    isSelected: false,
    selectedOption: [],
    A_Status: ItemStatus.NORMAL,
    B_Status: ItemStatus.NORMAL,
    C_Status: ItemStatus.NORMAL,
    D_Status: ItemStatus.NORMAL,
    showImageDetail: false,
    selectedIsRight: false,
    isMultipleChoiceQuestion: false,
    y: 400,
    question_contents: [],
    option_A_contents: [],
    option_B_contents: [],
    option_C_contents: [],
    option_D_contents: [],
    hasFeedBack: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    
    this.nextQuestion();
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

  answerClick: function (event) {

    console.log("event", event);

    var questionPaper = this.data.questionPaper;
    var option = event.currentTarget.dataset.option;

    /// 如果是多选题
    if (this.isMultipleChoiceQuestion(questionPaper)) {

      this.multipleChoiceQuestions(option)
      return;
    }

    this.singleChoiceQuestion(option)
  },

  isMultipleChoiceQuestion: function(questionPaper) {
    
    if (questionPaper.subject == "不定项") {
      return true
    }
    if (questionPaper.question.indexOf("不定项选择") !== -1) {
      return true
    }
    if (questionPaper.subject.indexOf("多选") !== -1) {
      return true
    }

    let splitedArray = questionPaper.answer.split(",")
    if (splitedArray.length > 1) {
      return true
    }
    return false;
  },

  singleChoiceQuestion: function (option) {

    console.log("singleChoiceQuestion option", option, "this.data.questionPaper.answer", this.data.questionPaper.answer)

    questionManager.select(option, this.model)

    var isRight = option == this.data.questionPaper.answer ? true : false;

    let itemStatus = ItemStatus.NORMAL;
    if (isRight) {
      itemStatus = ItemStatus.RIGHT;
    } else {
      itemStatus = ItemStatus.ERROR;
    }

    if (option == "A") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        A_Status: itemStatus,
        selectedIsRight: isRight,
        y:0,        
      })
    }
    if (option == "B") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        B_Status: itemStatus,
        selectedIsRight: isRight,
        y:0,
      })
    }
    if (option == "C") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        C_Status: itemStatus,
        selectedIsRight: isRight,
        y:0,        
      })
    }
    if (option == "D") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        D_Status: itemStatus,
        selectedIsRight: isRight,
        y:0,        
      })
    }
  },

  multipleChoiceQuestions: function (option) {

    const array = this.data.selectedOption;
    let itemStatus = null;

    if (this.data.selectedOption.includes(option)) {
      array.splice(array, 1);
      itemStatus = ItemStatus.NORMAL;
    } else {
      array.push(option);
      itemStatus = ItemStatus.SELECTED;
    }
    if (option == "A") {
      this.setData({
        selectedOption: array,
        A_Status: itemStatus
      });
    }
    if (option == "B") {
      this.setData({
        selectedOption: array,
        B_Status: itemStatus
      });
    }
    if (option == "C") {
      this.setData({
        selectedOption: array,
        C_Status: itemStatus
      });
    }
    if (option == "D") {
      this.setData({
        selectedOption: array,
        D_Status: itemStatus
      });
    }
  },

  doneSelect: function () {

    this.setData({
      y:0,
      isSelected: true
    });
  },

  renderAnswerTopView: function () {

  },

  nextQuestionButtonClick: function() {
    this.nextQuestion();
  },

  nextQuestion: function() {
    this.model = questionManager.getNewRandomMemoryModel()
    console.log("questionManager.getCurrentMemoryModels ", this.model);
    var isMultipleChoiceQuestion = this.isMultipleChoiceQuestion(this.model.question);
    var contents = questionManager.renderQuestion(this.model.question.question);
    console.log("isMultipleChoiceQuestion", isMultipleChoiceQuestion);

    var option_A_contents = questionManager.renderAnswer(this.model.question.option_A)
    var option_B_contents = questionManager.renderAnswer(this.model.question.option_B)
    var option_C_contents = questionManager.renderAnswer(this.model.question.option_C)
    var option_D_contents = questionManager.renderAnswer(this.model.question.option_D)

    this.setData({
      questionPaper: this.model.question,
      isMultipleChoiceQuestion: isMultipleChoiceQuestion,
      question_contents: contents,
      isSelected: false,
      y:400,
      option_A_contents,
      option_B_contents,
      option_C_contents,
      option_D_contents,
      hasFeedBack: false
    })
  },

  feedbackButtonClick: function() {

    const that = this
    
    wx.showModal({
      title: '错题反馈',
      content: '请确认该题是否内容有误',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          questionManager.feedbackQuestion(that.model, function(success, response, error) {

            if (success) {
              console.log("success, response, error", success, response, error)
            }

            that.setData({
              hasFeedBack: true
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})