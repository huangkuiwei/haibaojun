Page({
  data: {
    redPacket: false,
    sign_order_no: null,
  },

  onLoad() {
    this.setData({
      sign_order_no: wx.getStorageSync('sign_order_no')
    })
  },

  confirmReceive() {
    wx.showLoading({
      title: '正在抽取红包',
      mask: true,
    });

    wx.request({
      url: 'https://tfapi.csruij.cn/api/open/order/cashgift/v3',
      method: 'POST',
      data: {
        external_agreement_no: this.data.sign_order_no,
      },
      success: (response) => {
        wx.hideLoading()
        let res = response.data
        console.log('res', res)

        if (res.code === 0 || res.Code === 0) {
          let mchId = res.data.mch_id
          let package1 = res.data.package
          let appid = res.data.appid

          wx.requestMerchantTransfer({
            mchId: mchId,
            appId: appid,
            package: package1,
            success: (res1) => {
              console.log('res1:', res1);

              // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
              if (res1.errMsg === 'requestMerchantTransfer:ok') {
                this.setData({
                  redPacket: false
                })

                wx.removeStorageSync("sign_order_no");

                wx.showModal({
                  title: '温馨提示',
                  content: '红包领取成功',
                  showCancel: false,
                  confirmText: '进入首页',
                  closable: false,
                  success: (res2) => {
                    if (res2.confirm) {
                      wx.switchTab({
                        url: '/zt_hbsjkh/pages/index/index',
                      })
                    }
                  }
                })
              }
            },
            fail: (error) => {
              console.log('error:', error);
              wx.showModal({
                title: '温馨提示',
                content: error.errMsg || '领取失败',
              })
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
})