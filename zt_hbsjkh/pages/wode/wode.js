const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yue:"0.00",
    member:null,
    info:null,
    show_vip:0,
    sys_ios:1,//1代表是苹果系统
    show_tips:0,
    shouye_info:null,
    show_shouyi:0,
    shoucang: 0,
    wenan: 0,
    zuopin:0,
    is_login:0,
    showProtocolDialog: false,
  },

  argee() {
    wx.setStorageSync('hasArgeeProtocol', true)

    this.setData({
      showProtocolDialog: false
    })
  },

  show_shouyi_view:function(){
    if(this.data.show_shouyi==0)
    {
      this.setData({
        show_shouyi:1,
      })
    }
    else
    {      
      this.setData({
        show_shouyi:0,
      })
    }
  },
  copy:function(){
    wx.setClipboardData({
      data: this.data.member.uid,
    })
  },
  go_pinfo:function(){
    wx.navigateTo({
      url: '../pinfo/pinfo',
    })
  },
  /**
   * 前往会员中心
   */
  onUser: function (t) {
    if (!this.data.member) {
      return
    }

    console.log(this.data.member)
    if ( !this.data.member.tel) return wx.navigateTo({
      url: "../authorization/authorization?showErrorToast=true",
      success: function (t) {},
      fail: function (t) {},
      complete: function (t) {}
    }), !1
  },
  go_vip:function(e){
    wx.navigateTo({
      url: '../vip/vip',
    })  
  },
  /**
   * 前往海报界面
   */
  go_haibao:function(){
    wx.navigateTo({
      url: '../haibao/haibao',
    })
  },
  ceshi:function(){
    var that=this;
    var data = new Object();
    data.apiname = 'wxtxt';
    app.mlib.request({
      'model': 'shenhe',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res.data.data.d);
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 打电话
   */
  go_tel:function(){
    // this.ceshi();
    // return;
    wx.makePhoneCall({
      phoneNumber: this.data.info.tel,
    })
  },
  /**
   * 进入我的团队
   */
  go_tuandui:function(){
    wx.navigateTo({
      url: '../tuandui/tuandui',
    })
  },
  /**
   * 进入取现界面
   */
  go_quxian:function(){
    wx.navigateTo({
      url: '../quxian/quxian',
    })
  },
  /**
   * 进入收藏界面
   */
  go_shoucang:function(){
    wx.navigateTo({
      url: '../shoucang/shoucang',
    })
  },
  /**
   * 登录
   */
  login: function () {
    console.log('登录');
    wx.setStorageSync('userInfo', '');
    var that = this;
    app.mlib.getUserInfo(this, function (response) {
      var data = new Object();
      data.apiname = 'wode';
      app.mlib.request({
        'model': 'user',
        'data': data,
        'cachetime': '0',
        success(res) {
          console.log(res);
          that.setData({
            member:res.data.data.d.member
          })
          wx.setStorageSync('is_login', 1);
          that.setData({
            is_login:1
          })
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
  inite_data:function(){
    var fenxiao=this.data.fenxiao;
    //    
    if(fenxiao.yuekalogo=='')
    {
      fenxiao.yuekalogo = "../../resource/img/vip-icon.png";
    }
    if(fenxiao.jikalogo=='')
    {
      fenxiao.jikalogo = "../../resource/img/vip-icon.png";
    }
    if(fenxiao.niankalogo=='')
    {
      fenxiao.niankalogo = "../../resource/img/vip-icon.png";
    }
    this.setData({
      fenxiao:fenxiao
    })
  },
  inite:function(){
    var that=this;
    var data = new Object();
    data.apiname = 'wode';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          yue:res.data.data.d.yue,
          member:res.data.data.d.member,
          info:res.data.data.d.info,
          shouye_info:res.data.data.d.shouye,
          shoucang: res.data.data.d.shoucang,
          wenan: res.data.data.d.wenan,
          zuopin:res.data.data.d.zuopin,
        })
        that.onUser()
        that.data.fenxiao=res.data.data.d.fenxiao;
        that.inite_data();
        if(that.data.member.vip>0)//是会员
        {
          console.log('会员');
          that.setData({
            show_vip:1,
          })
        }
        else//非会员
        {
          if(that.data.sys_ios==0)//安卓系统
          {
            console.log('安卓系统');
            that.setData({
              show_vip:1
            })
          }
          else//苹果系统
          {
            if(res.data.data.d.version*1!=app.version*1)//不是审核版本
            {
              if(that.data.shouye_info.showvip==1)
              {
                console.log('强制展示');
                that.setData({
                  show_vip:1
                })
              }
            }
          }
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  // 退出登录
  logout(){
    let that = this;
    var userInfo = wx.setStorageSync('userInfo')
    wx.setStorageSync('userInfo', '');
    wx.setStorageSync('is_login', 0);
    that.setData({
      is_login:0
    })
    // getApp().util.request({
    //   'url': 'entry/wxapp/logout',
    //   data: {
    //    uid:userInfo.memberInfo.uid,
    //   },
    //   'cachetime': '0',
    //   success(t) {
    //     // console.log(t.data.data.row);
    //     let row = t.data.data.row;
    //     that.setData({
    //       avatarUrl:row.avatar,
    //       avatarUrl2:row.avatar,
    //       nickname:row.nickname,
    //     })
    //   }
    // })
  },

  openCustomerServiceChat() {
    wx.openCustomerServiceChat({
      corpId: 'ww68c519a272af6d46',
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc87b6636d6ca60d54'
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success (res) {
        console.log(res.system)
        if(res.system.indexOf("iOS") != -1)
        {
          console.log('苹果系统');
        }
        else
        {
          that.setData({
            sys_ios:0
          })
          console.log('安卓系统');
        }
        app.mlib.login(function (response) {
          that.inite();
        
        });
      }
    })
   
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
    let that = this

    app.mlib.login(function (response) {
      that.inite();
    });

    let hasArgeeProtocol = wx.getStorageSync('hasArgeeProtocol')

    if (hasArgeeProtocol) {
      this.setData({
        showProtocolDialog: false
      })
    } else {
      this.setData({
        showProtocolDialog: true
      })
    }
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