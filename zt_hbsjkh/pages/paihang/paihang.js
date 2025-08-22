const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_yue:'2021年10月',
    ceshi:['','','','','','',''],
    setting:null,
    mynum:0,
    cur_show_paihang:[],
    cur_show_index:0,
    allpaihang:[],
  },
  /**
   * 选择分类
   */
  bindStarttimeChange: function (e) {
    console.log(e);
    var cur_show_index = e.detail.value
    this.setData({
      cur_show_index: cur_show_index,
      cur_show_paihang:this.data.allpaihang[cur_show_index]
    })
  },
  inite:function(){
    var that=this;
    var data = new Object();
    data.apiname = 'paihang';
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          setting:res.data.data.setting,
          mynum:res.data.data.num,
          cur_show_paihang:res.data.data.paihang[0],
          cur_show_index:0,
          allpaihang:res.data.data.paihang,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inite();
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

  }
})