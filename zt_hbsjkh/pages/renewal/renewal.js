const app = getApp();
const WxParse = require("../../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    
    cur_select:0,
    member:null,
    user:null,
    fenxiao:null,
    nianka_msg:['会议类需求免费咨询','免费匹配活动场地','200元印刷品抵用券(50元*4,每次消费满200可抵1张)','舞美搭建抵用券5000元,500元*10张(每次消费满5000可抵1张)','定制精美名片1盒(100张)','视频制作抵用券5000元,500元*10张(每次消费满5000可抵1张)','成功推荐年费会员奖励200元储值余额(可提现)'],
    setting:null,
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    start_animation:0,
    //顶部购买信息数据
    goumai_info:[],
    cur_show_goumai:0,
    height_px:0,
    orderInfo: {},
    currentOrderInfo: {},
    showTipDialog: false,
    isUnFlag: 0,
    sms_code: '',
    sms_sign: '',
    result: '',
    times: 0,
    time: Date.now(),
    showLoginDialog: false,
    countdown: 0,
    disabled: false,
    codeTip: '获取验证码'
  },

  getOrderInfo() {
    wx.request({
      method: 'POST',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/microapp/order/query_user_order_sign`,
      dataType: 'json',
      data: {
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      header: {
        token: wx.getStorageSync('kdshToken')
      },
      success: (response) => {
        if (response.data.code === 0) {
          let orderList = response.data.data || []
          orderList = orderList.filter(item => item.status === 'NORMAL' && item.NextAutoPaidTime)

          orderList.forEach(item => {
            if (item.SingleAmount) {
              item.SingleAmount = (item.SingleAmount / 100).toFixed(2)
            }
          })

          this.setData({
            orderInfo: orderList
          })

          return
        }

        if (response.data.Code === -100) {
          this.setData({
            showLoginDialog: true
          })
        }
      }
    })
  },

  sendCode() {
    if (this.data.countdown) {
      return
    }

    wx.showLoading({
      title: '请稍等...',
    })

    wx.request({
      method: 'POST',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/global/sms/send_code`,
      dataType: 'json',
      data: {
        mobile: this.data.member.tel,
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      success: (response) => {
        if (response.data.code === 0) {
          this.setData({
            sms_sign: response.data.data.sign,
            countdown: 10
          })

          let timer = setInterval(() => {
            let countdown = this.data.countdown - 1;

            if (countdown < 0) {
              this.setData({
                countdown: 0,
                codeTip: '获取验证码'
              })

              clearInterval(timer)
            } else {
              this.setData({
                countdown: this.data.countdown - 1,
                codeTip: `${this.data.countdown}S重新获取`
              })
            }
          }, 1000);
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onCodeChange(event) {
    this.setData({
      sms_code: event.detail.value
    })
  },

  phoneLogin() {
    if (!this.data.sms_code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        mask: true,
      });

      return
    }

    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      method: 'POST',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/microapp/auth/we_micro/login`,
      dataType: 'json',
      data: {
        mobile: this.data.member.tel,
        sms_sign: this.data.sms_sign,
        sms_code: this.data.sms_code,
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      success: (response) => {
        if (response.data.code === 0) {
          wx.setStorageSync('kdshToken', response.data.data.token);

          wx.showToast({
            title: '验证成功',
            icon: 'success',
            mask: true,
          });

          this.setData({
            showLoginDialog: false,
          })

          this.getOrderInfo()
        } else {
          wx.showToast({
            title: response.data.msg || response.data.Msg,
            icon: 'error',
            mask: true,
          });
        }
      },

      complete: () => {
        wx.hideLoading()
      }
    })
  },

  closeTipDialog() {
    this.setData({
      showTipDialog: false
    })
  },

  onSmsCodeInput(event) {
    this.setData({
      sms_code: event.detail.value
    })
  },

  confirmUnfirst() {
    this.setData({
      isUnFlag: 1
    })

    wx.request({
      method: 'POST',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/sms/sendcode`,
      data: {
        mobile: this.data.member.tel,
        item_type: this.data.currentOrderInfo.businessType,
      },
      header: {
        token: wx.getStorageSync('kdshToken')
      },
      dataType: 'json',
      success: (response) => {
        if (response.data.code === 0) {
          this.setData({
            sms_sign: response.data.data.sign
          })
        }
      }
    })
  },

  handleUnsubscribe() {
    if (!this.data.sms_code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        mask: true,
      });

      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    wx.request({
      method: 'POST',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/user/order/refund`,
      data: {
        external_agreement_no: this.data.currentOrderInfo.external_agreement_no,
        mobile: this.data.member.tel,
        sms_sign: this.data.sms_sign,
        sms_code: this.data.sms_code,
      },
      header: {
        token: wx.getStorageSync('kdshToken')
      },
      dataType: 'json',
      success: (response) => {
        wx.hideLoading()

        if (response.data.code === 0) {
          this.setData({
            result: response.data.data,
            isUnFlag: 2
          })
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'error'
          })
        }
      }
    })
  },

  submit() {
    this.closeTipDialog()

    wx.showToast({
      title: '操作成功',
      icon: 'success',
      mask: true,
    })

    setTimeout(() => {
      this.getOrderInfo()
    }, 200)
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
          if(res.data.data.d.is_auth != 1){
            wx.navigateTo({
              url: '/zt_hbsjkh/pages/login/login',
            })
            return;
          }
          that.setData({
            member:res.data.data.d.member
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
  change_select:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      cur_select: index
    })
  },
  pay:function(){
    var that=this;
    app.mlib.getUserInfo(this, function (response) {
      that._pay();
    }, function () {
      wx.showToast({
        title: 'failed',
      })
    });
  },
  /**
   * 支付
   */
  _pay: function () {
    var data = new Object();
    data.type = this.data.cur_select;
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/pay',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 2)//余额足够，不需要支付
        {
          that.inite();
          wx.showToast({
            title: '支付成功',
          })
          return;
        }
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })
            that.inite();
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  inite_data:function(){
    var fenxiao=this.data.fenxiao;
    //会员
    if(fenxiao.yuekalogos=='')
    {
      fenxiao.yuekalogos="../../resource/img/icon_vip_yueka.png";
    }
    if(fenxiao.jikalogos=='')
    {
      fenxiao.jikalogos="../../resource/img/icon_vip_jika.png";
    }
    if(fenxiao.niankalogos=='')
    {
      fenxiao.niankalogos="../../resource/img/icon_vip_nianka.png";
    }
    //    
    if(fenxiao.yuekalogo=='')
    {
      fenxiao.yuekalogo="../../resource/img/vip-icon.png";
    }
    if(fenxiao.jikalogo=='')
    {
      fenxiao.jikalogo="../../resource/img/vip-icon.png";
    }
    if(fenxiao.niankalogo=='')
    {
      fenxiao.niankalogo="../../resource/img/vip-icon.png";
    }
    this.setData({
      fenxiao:fenxiao
    })
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'vip';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        // TODO
        res.data.data.fenxiao.yuekajiage = Number(res.data.data.fenxiao.yuekajiage)
        res.data.data.fenxiao.jikajiage = Number(res.data.data.fenxiao.jikajiage)
        res.data.data.fenxiao.niankajiage = Number(res.data.data.fenxiao.niankajiage)

        that.setData({
          member: res.data.data.member,
          fenxiao: res.data.data.fenxiao,
          user: res.data.data.user,
          setting:res.data.data.setting,
          goumai_info:res.data.data.buyinfo
        })
        WxParse.wxParse('article', 'html', res.data.data.setting.info, that, 5);
        that.inite_data();
        setTimeout(() => {
          // that.initAnimation();
        }, 1000)

        if (res.data.data.member.tel) {
          if (that.data.times === 0) {
            that.getOrderInfo()

            that.setData({
              times: that.data.times + 1
            })
          }
        }
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
    var that=this;
    app.mlib.login(function (response) {
      console.log(response);
      that.inite();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow(){
    this.setData({
      time: Date.now()
    })

    this.inite();
  },
  initAnimation() {
    var that = this
    this.data.duration = 1500
    this.data.animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear'
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height_px: res.windowWidth*80 / 750,
        })
      },
    })
    this.startAnimation()
  },
  startAnimation() {
    this.data.cur_show_goumai++;
    if(this.data.cur_show_goumai>=this.data.goumai_info.length)
    {
      this.data.cur_show_goumai=0;
    }
    const resetAnimation = this.data.animation.translateY(0).step({ duration: 0 }).export()
    const bottomAnimation = this.data.animation.translateY(this.data.height_px).step({ duration: 0 }).export()
    this.setData({
      animationData: bottomAnimation,
      cur_show_goumai:this.data.cur_show_goumai
    })
    var top_px=0-this.data.height_px;
    const animationData = this.data.animation.translateY(0).step({ duration: 300 }).translateY(0).step({ duration: 900 }).translateY(top_px).step({ duration: 300 }).export()
    setTimeout(() => {
      this.setData({
        animationData: animationData,
        start_animation:1,
      })
    }, 100)
    const timer = setTimeout(() => {
      // this.setData({
      //   animationData: bottomAnimation
      // },function(){
      //   this.setData({
      //     animationData: animationData,
      //   })
      // })
      this.startAnimation();
    }, this.data.duration)
    this.setData({
      timer
    })
  },

  renewal(event) {
    this.setData({
      showTipDialog: true,
      currentOrderInfo: {
        businessType: event.target.dataset.businessType,
        external_agreement_no: event.target.dataset.external_agreement_no,
      }
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
    clearTimeout();
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