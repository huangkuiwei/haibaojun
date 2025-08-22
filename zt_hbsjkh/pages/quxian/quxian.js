const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_status:0,
    yue:0,
    quxianjilu: [],
    setting:0,
    quxianing:0,
    show_ali:0,
  },
  close_info_view:function(){
    this.setData({
      show_ali:0,
    })
  },
  quxian:function(){
    if(this.data.yue*1<this.data.setting.confine_credit2*1)
    {
      wx.showToast({
        title: '余额不足',
      })
      return;
    }
    var setting=this.data.setting;
    if(setting.audit==2)//支付宝取现
    {
      this.setData({
        show_ali:1,
      })
    }
    else
    {
      this._quxian();
    }
  },
  aliquxian:function(e){
    var formdata=e.detail.value;
    console.log(formdata);
    if(formdata.aliname=='')
    {
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return;
    }
    if(formdata.aliaccount=='')
    {
      wx.showToast({
        title: '请填写支付宝账号',
        icon:'none'
      })
      return;
    }
    if(this.data.quxianing==1)
    {
      return;
    }
    var that=this;
    this.data.quxianing=1;
    app.mlib.login(function (response) {
      formdata.apiname = 'quxian';
      app.mlib.request({
        'model': 'user',
        'data': formdata,
        'cachetime': '0',
        success(res) {
          console.log(res);
          that.data.quxianing=0;
          if (res.data.data.r == 0)//取现失败
          {
            wx.showModal({
              title: '取现失败',
              content: res.data.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
          }
          else if (res.data.data.r == 1)//取现成功，转入审核
          {
            that.setData({
              yue: 0,
              show_ali:0,
            })
            wx.showModal({
              title: '取现成功',
              content: '取现已提交审核',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
          }
        },
        fail(res) {
          console.log(res);
        }
      })
    }, function () {
      wx.showToast({
        title: 'failed',
      })
    });
  },
  /**
   * 取现
   */
  _quxian:function(){
    if(this.data.quxianing==1)
    {
      return;
    }
    var that=this;
    this.data.quxianing=1;
    app.mlib.login(function (response) {
      var data = new Object();
      data.apiname = 'quxian';
      app.mlib.request({
        'model': 'user',
        'data': data,
        'cachetime': '0',
        success(res) {
          console.log(res);
          that.data.quxianing=0;
          if (res.data.data.r == 0)//取现失败
          {
            wx.showModal({
              title: '取现失败',
              content: res.data.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
          }
          else if (res.data.data.r == 1)//取现成功，转入审核
          {
            that.setData({
              yue: 0
            })
            wx.showModal({
              title: '取现成功',
              content: '取现已提交审核',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
          }
          else if (res.data.data.r == 2) //取现成功，自动转账
          {
            that.setData({
              yue: 0
            })
            wx.showModal({
              title: '取现成功',
              content: '取现将自动转到微信零钱',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
          }
        },
        fail(res) {
          console.log(res);
        }
      })
    }, function () {
      wx.showToast({
        title: 'failed',
      })
    });
  },
  /**
   * 改变显示状态
   */
  change_status: function () {
    if (this.data.show_status == 0) {
      this.setData({
        show_status: 1
      })
    }
    else {
      this.setData({
        show_status: 0
      })
    }
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'quxianinite';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          yue:res.data.data.yue,
          setting: res.data.data.setting,
          quxianjilu: res.data.data.jilu
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