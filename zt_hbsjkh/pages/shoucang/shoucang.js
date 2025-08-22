const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoucang_info:[],
  },
  /**
   * 前往定制
   */
  go_dingzhi:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id='+id,
    })
  },
  /**
   * 移出收藏夹
   */
  del_shoucang: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var data = new Object();
    data.apiname = 'del';
    data.id = id;
    app.mlib.request({
      'model': 'shoucang',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        wx.showToast({
          title: res.data.data.msg,
        })
        that.data.shoucang_info.splice(index,1);
        that.setData({
          shoucang_info: that.data.shoucang_info
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'get';
    app.mlib.request({
      'model': 'shoucang',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          shoucang_info: res.data.data.d
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