// pages/answer_detail/answer_detail.js
const ItemStatus = {
  NORMAL: 'normal',
  SELECTED: 'selected',
  RIGHT: 'right',
  ERROR: 'error',
};
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
    if (questionPaper.subject == "不定项" ||
      questionPaper.question.indexOf("不定项选择") !== -1 ||
      questionPaper.subject.indexOf("多选") !== -1) {

      this.multipleChoiceQuestions(option)
      this._doneSelect()
      return;
    }

    this.singleChoiceQuestion(option)
    /// 如果是多选
    this._doneSelect();
  },

  singleChoiceQuestion: function (option) {

    console.log("singleChoiceQuestion option", option, "this.data.questionPaper.answer", this.data.questionPaper.answer)


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
        selectedIsRight: isRight
      })
    }
    if (option == "B") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        B_Status: itemStatus,
        selectedIsRight: isRight
      })
    }
    if (option == "C") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        C_Status: itemStatus,
        selectedIsRight: isRight
      })
    }
    if (option == "D") {
      this.setData({
        isSelected: true,
        selectedOption: [option],
        D_Status: itemStatus,
        selectedIsRight: isRight
      })
    }
  },

  multipleChoiceQuestions: function (option) {

    const array = this.state.selectedOption;

    let itemStatus = null;

    if (this.state.selectedOption.includes(option)) {
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

  _doneSelect: function () {

    this.setData({
      isSelected: true
    });
  },

  renderAnswerTopView: function () {
    
  },
})