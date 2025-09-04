// zt_hbsjkh/pages/auorder/auorder.js
const util = require('../../../we7/resource/js/util')
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryO: null,
    pt: null,
    mobile: null,
    shurl: null,
    openId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      queryO: options && options.o ? options.o : null,
      pt: options.pt,
      mobile: options.mobile,
      shurl: options.shurl,
    })

    // 获取 openid
    if (this.data.pt) {
      wx.login({
        success: (res) => {
          util.request({
            url: 'auth/session/openid',
            data: {
              code: res.code ? res.code : ''
            },
            cachetime: 0,
            showLoading: false,
            success: (session) => {
              if (!session.data.errno) {
                this.setData({
                  openId: session.data.data.openid,
                })
              }
            }
          });
        },
      });
    }
  },

  //点击确认领取
  confirmReceive() {
    // 小程序支付
    if (this.data.pt) {
      this.createOrderNew()
    }
    // 签约支付
    else if (this.data.queryO) {
      this.getQuery();
    }
  },

  createOrderNew() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });

    wx.request({
      url: 'https://tfapi.csruij.cn/api/microapp/order/we_h5/createordernew',
      method: 'POST',
      data: {
        mobile: this.data.mobile,
        url: decodeURIComponent(this.data.shurl),
        openid: this.data.openId,
        appid: wx.getAccountInfoSync().miniProgram.appId,
        user_agent: 'Mozilla/5.0 (Linux; Android 8.1.0; vivo Y85A Build/OPM1.171019.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/106 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
      },
      success: (response) => {
        wx.hideLoading()
        let res = response.data

        if (res.code === 0 || res.Code === 0) {
          let payParams = JSON.parse(res.data);
          console.log(payParams, 'payParams');

          wx.requestPayment({
            ...payParams,
            success: (res1) => {
              // 支付成功处理逻辑，res.errMsg=requestPayment:ok时，才表示支付成功
              if (res1.errMsg === 'requestPayment:ok') {
                wx.navigateTo({
                  url: '/zt_hbsjkh/pages/success/success',
                });
              } else {
                wx.showModal({
                  content: '支付失败',
                  showCancel: false,
                });
              }
            },
            fail: () => {
              wx.showModal({
                content: '支付失败',
                showCancel: false,
              });
            },
          });
        } else {
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
  },

  getQuery() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });

    wx.request({
      method: 'GET',
      withCredentials: true,
      url: `https://tfapi.csruij.cn/api/business/ali_sign/au_order/${this.queryO}`,
      dataType: 'json',
      success: (response) => {
        wx.hideLoading()
        let res = response.data

        if (res.code === 0 || res.Code === 0) {
          let sign_order_no = response.header.sign_order_no

          if (sign_order_no) {
            wx.setStorageSync("sign_order_no", sign_order_no);
          }

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
})