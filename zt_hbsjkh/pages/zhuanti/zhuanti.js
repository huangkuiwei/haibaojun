const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:2,
    zhuanti:null,
    items:[],
    pid:0,
  },
  go_shouye:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  go_muban:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id='+id,
    })
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.id=this.data.id;
    data.pid=this.data.pid;
    data.apiname = 'get';
    app.mlib.request({
      'model': 'zhuanti',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          zhuanti: res.data.data.zhuanti,
          items: res.data.data.items,
        })
        app.mlib.uid=res.data.data.uid;
        wx.setNavigationBarTitle({
          title: res.data.data.zhuanti.name,
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
    if(options.id!=null)
    {
      this.data.id=options.id;
    }
    if (options.pid != null) {
      this.data.pid = options.pid;
    } 
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
  onShareAppMessage: function () {
    var path = '/' + app.mlib.name + '/pages/zhuanti/zhuanti?id=' + this.data.id + '&pid=' + app.mlib.uid;
    return {
      title: this.data.zhuanti.name,
      path: path,
      imageUrl: this.data.zhuanti.icon,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
        })
        console.log('转发成功');
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
        })
        console.log('转发失败');
      },
    }
  }
})