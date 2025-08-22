// zt_hbsjkh/pages/auorder/auorder.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryO: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryO = options && options.o ? options.o : null;
  },

  //点击确认领取
  confirmReceive() {
    if (this.queryO) {
      this.getQuery();
    }
  },

  getQuery() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });

    wx.request({
      method: 'GET',
      withCredentials: true,
      url: `https://weapi.ardila.cn/api/business/ali_sign/au_order/${this.queryO}`,
      dataType: 'json',
      success: (response) => {
        let res = response.data

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