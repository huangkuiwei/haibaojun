const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sousuo_setting:null,
    sousuo_jilu:[],
  },
  /**
   * 删除搜索记录
   */
  del_sousuo: function (e) {
    console.log(e.currentTarget.dataset.key);
    var that = this;
    var data = new Object();
    data.apiname = 'delsousuo';
    data.keyword = e.currentTarget.dataset.key;
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          sousuo_jilu: res.data.data.d
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  go_sousuo_2: function (e) {
    var key = e.currentTarget.dataset.key;
    if ((key == '') || (key == ' ')) {
      return;
    }
    wx.navigateTo({
      url: '../wenanssjg/wenanssjg?key=' + key,
    })
  },
  /**
   * 前往搜索界面
   */
  go_sousuo:function(e){
    console.log(e);
    console.log(e.detail.value);
    var key = e.detail.value;
    if ((key == '') || (key == ' '))
    {
      return;
    }
    wx.navigateTo({
      url: '../wenanssjg/wenanssjg?key=' + key,
    })
  },
  /**
   * 取消返回上一个界面
   */
  quxiao:function(){
    wx.navigateBack({
      
    })
  },
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'sousuologin';
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': 0,
      success(res) {
        console.log(res);
        that.setData({
          sousuo_setting: res.data.data.tj,
          sousuo_jilu: res.data.data.jilu,
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
    var that = this;
    app.mlib.login(function (response) {
      that.inite();
    });
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
})