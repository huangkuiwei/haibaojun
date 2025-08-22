const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parent: null,
    totalall: 0,
    totaltoday: 0,
    totalyesterday: 0,
    totalbenyue: 0,
    totalshangyue: 0,
    show_huiyuan:[],
  },
  /**
   * 初始化
   */
  inite:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'tuandui';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '60',
      success(res) {
        console.log(res);
        that.setData({
          parent: res.data.data.recommendmember,
          totalall: res.data.data.totalall,
          totaltoday: res.data.data.totaltoday,
          totalyesterday: res.data.data.totalyesterday,
          totalbenyue: res.data.data.totalbenyue,
          totalshangyue: res.data.data.totalshangyue,
          show_huiyuan: res.data.data.huiyuan
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
    var that = this;
    app.mlib.login(function (response) {
      that.inite();
    });
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
  onShareAppMessage: app.mlib.fx_go_shouye
})