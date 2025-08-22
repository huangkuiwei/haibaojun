const app = getApp();
const WxParse = require("../../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',

    cur_select: 0,
    member: null,
    user: null,
    fenxiao: null,
    nianka_msg: ['会议类需求免费咨询', '免费匹配活动场地', '200元印刷品抵用券(50元*4,每次消费满200可抵1张)', '舞美搭建抵用券5000元,500元*10张(每次消费满5000可抵1张)', '定制精美名片1盒(100张)', '视频制作抵用券5000元,500元*10张(每次消费满5000可抵1张)', '成功推荐年费会员奖励200元储值余额(可提现)'],
    setting: null,
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    start_animation: 0,
    //顶部购买信息数据
    goumai_info: [],
    cur_show_goumai: 0,
    height_px: 0,
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
          if (res.data.data.d.is_auth != 1) {
            wx.navigateTo({
              url: '/zt_hbsjkh/pages/login/login',
            })
            return;
          }
          that.setData({
            member: res.data.data.d.member
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
  change_select: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      cur_select: index
    })
  },

  renewManage() {
    if (!this.data.member.tel) {
      wx.navigateTo({
        url: "../authorization/authorization?showErrorToast=true",
      })

      return
    }

    wx.navigateTo({
      url: "/zt_hbsjkh/pages/renewal/renewal",
    })
  },

  pay: function () {
    if (!this.data.member.tel) {
      wx.navigateTo({
        url: "../authorization/authorization?showErrorToast=true",
        success: function (t) {},
        fail: function (t) {},
        complete: function (t) {}
      })

      return
    }

    let that = this

    let data = {
      mobile: this.data.member.tel,
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    }

    if (this.data.cur_select === '1') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlhbts/06031?vcid=23872'
      data.pt = 12
      data.business_version = 2
    } else if (this.data.cur_select === '2') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlhbts/06031?vcid=23872'
      data.pt = 15
    } else if (this.data.cur_select === '3') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlts/09263?vcid=25486'
      data.pt = 12
      data.business_version = 2
    } else if (this.data.cur_select === '4') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlts/09263?vcid=25486'
      data.pt = 15
    } else if (this.data.cur_select === '5') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlhbts/06031?vcid=23872'
      data.pt = 12
      data.business_version = 4
    } else if (this.data.cur_select === '6') {
      data.url = 'https://ad51c.ardila.cn/#/pages/adllq/adlzg/411131?vcid=28753'
      data.pt = 12
      data.business_version = 0
    }

    if (this.data.cur_select === '2' || this.data.cur_select === '4') {
      wx.request({
        method: 'POST',
        withCredentials: true,
        url: `https://weapi.ardila.cn/api/business/ali_sign/create_sign`,
        data: data,
        dataType: 'json',
        success: (response) => {
          let res = response.data

          if (res.code === 0 || res.Code === 0) {
            let params = this.getParams(res.data)
            let odataParams = this.getParams(params.odata)

            if (odataParams) {
              let signno = odataParams.signno

              wx.request({
                method: 'GET',
                withCredentials: true,
                url: `https://weapi.ardila.cn/api/business/ali_sign/au_order/${signno}`,
                dataType: 'json',
                success: (response1) => {
                  let res = response1.data

                  if (res.code === 0 || res.Code === 0) {
                    if (res.data.startsWith('http')) {
                      app.mlib.webview_url = res.data;

                      wx.navigateTo({
                        url: '../webview/webview',
                      })
                    } else {
                      let params = JSON.parse(res.data);
                      console.log(params, 'params');
                      this.navigateToMiniProgram(params);
                    }
                  } else {
                    wx.hideLoading()

                    wx.showToast({
                      title: res.msg || res.Msg,
                      icon: 'none',
                      mask: true,
                    });
                  }

                },
                fail: () => {
                  wx.hideLoading()
                }
              })
            }
          } else {
            wx.hideLoading()

            wx.showToast({
              title: res.msg || res.Msg,
              icon: 'none',
              mask: true,
            });
          }

        },
        fail: () => {
          wx.hideLoading()
        }
      })
    } else {
      data.appid = wx.getAccountInfoSync().miniProgram.appId
      data.openid = this.data.member.openid

      if (!data.openid) {
        this.login()
        return
      }

      wx.request({
        method: 'POST',
        withCredentials: true,
        url: `https://weapi.ardila.cn/api/open/order/create`,
        data: data,
        dataType: 'json',
        success: (response) => {
          let res = response.data

          if (res.code === 0 || res.Code === 0) {
            let params = JSON.parse(res.data)

            wx.requestPayment({
              'timeStamp': params.timeStamp,
              'nonceStr': params.nonceStr,
              'package': params.package,
              'signType': 'MD5',
              'paySign': params.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                })

                setTimeout(() => {
                  that.inite();
                }, 500)
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'error'
                })
              }
            })
          } else {
            wx.hideLoading()

            wx.showToast({
              title: res.msg || res.Msg,
              icon: 'none',
              mask: true,
            });
          }

        },
        fail: () => {
          wx.hideLoading()
        }
      })
    }


    // app.mlib.getUserInfo(this, function (response) {
    //   that._pay();
    // }, function () {
    //   wx.showToast({
    //     title: 'failed',
    //   })
    // });
  },

  navigateToMiniProgram(params) {
    // 使用wx.navigateToMiniProgram跳转到小程序，拉起签约
    wx.navigateToMiniProgram({
      appId: 'wxbd687630cd02ce1d',
      path: 'pages/index/index',
      extraData: {
        appid: params.appid,
        contract_code: params.contract_code,
        contract_display_account: params.contract_display_account,
        mch_id: params.mch_id,
        notify_url: params.notify_url,
        plan_id: params.plan_id,
        request_serial: params.request_serial,
        timestamp: Number(params.timestamp),
        sign: params.sign,
        // return_web: params.return_web,
        // version: params.version,
      },

      success(res) {
        // 成功跳转到签约小程序
        console.log(res, 'success');
      },

      fail(res) {
        // 未成功跳转到签约小程序
        console.log(res, 'fail');
      },
    });
  },


  getParams(url) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;
    while (match = regex.exec(url)) {
      params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return params;
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
        if (res.data.data.r == 2) //余额足够，不需要支付
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
  inite_data: function () {
    var fenxiao = this.data.fenxiao;
    //会员
    if (fenxiao.yuekalogos == '') {
      fenxiao.yuekalogos = "../../resource/img/icon_vip_yueka.png";
    }
    if (fenxiao.jikalogos == '') {
      fenxiao.jikalogos = "../../resource/img/icon_vip_jika1.jpeg";
    }
    if (fenxiao.niankalogos == '') {
      fenxiao.niankalogos = "../../resource/img/icon_vip_nianka.png";
    }
    if (!fenxiao.daylogos) {
      fenxiao.daylogos = "../../resource/img/icon_vip_day.jpg";
    }
    //    
    if (fenxiao.yuekalogo == '') {
      fenxiao.yuekalogo = "../../resource/img/vip-icon.png";
    }
    if (fenxiao.jikalogo == '') {
      fenxiao.jikalogo = "../../resource/img/vip-icon.png";
    }
    if (fenxiao.niankalogo == '') {
      fenxiao.niankalogo = "../../resource/img/vip-icon.png";
    }
    this.setData({
      fenxiao: fenxiao
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
        res.data.data.fenxiao.yuekajiage = Number(res.data.data.fenxiao.yuekajiage)
        res.data.data.fenxiao.jikajiage = Number(res.data.data.fenxiao.jikajiage)
        res.data.data.fenxiao.niankajiage = Number(res.data.data.fenxiao.niankajiage)

        that.setData({
          member: res.data.data.member,
          fenxiao: res.data.data.fenxiao,
          user: res.data.data.user,
          setting: res.data.data.setting,
          goumai_info: res.data.data.buyinfo
        })
        WxParse.wxParse('article', 'html', res.data.data.setting.info, that, 5);
        that.inite_data();
        setTimeout(() => {
          that.initAnimation();
        }, 1000)
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
      console.log(response);
      that.inite();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow() {
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
          height_px: res.windowWidth * 80 / 750,
        })
      },
    })
    this.startAnimation()
  },
  startAnimation() {
    this.data.cur_show_goumai++;
    if (this.data.cur_show_goumai >= this.data.goumai_info.length) {
      this.data.cur_show_goumai = 0;
    }
    const resetAnimation = this.data.animation.translateY(0).step({
      duration: 0
    }).export()
    const bottomAnimation = this.data.animation.translateY(this.data.height_px).step({
      duration: 0
    }).export()
    this.setData({
      animationData: bottomAnimation,
      cur_show_goumai: this.data.cur_show_goumai
    })
    var top_px = 0 - this.data.height_px;
    const animationData = this.data.animation.translateY(0).step({
      duration: 300
    }).translateY(0).step({
      duration: 900
    }).translateY(top_px).step({
      duration: 300
    }).export()
    setTimeout(() => {
      this.setData({
        animationData: animationData,
        start_animation: 1,
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