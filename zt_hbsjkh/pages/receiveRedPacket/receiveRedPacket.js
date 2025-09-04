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
      success: async (response) => {
        let res = response.data
        console.log('res', res)

        if (res.code === 0 || res.Code === 0) {
          let packages = res.data.packages || []
          console.log('packages', packages)

          if (!packages.length) {
            wx.showToast({
              title: '暂无红包可领取',
              icon: 'none',
            })

            return
          }

          let mchId = res.data.mch_id
          let appid = res.data.appid

          for (let i = 0; i < packages.length; i++) {
            await this.merchantTransfer(mchId, appid, packages[i]).catch(() => {})
          }

          wx.hideLoading()
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

  async merchantTransfer(mchId, appid, package1) {
    return new Promise((resolve, reject) => {
      wx.requestMerchantTransfer({
        mchId: mchId,
        appId: appid,
        package: package1,
        success: (res1) => {
          console.log('res1:', res1);

          // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
          if (res1.errMsg === 'requestMerchantTransfer:ok') {
          }
          resolve(res1)
        },
        fail: (error) => {
          console.log('error', error, mchId, appid, package1)
          wx.showToast({
            title: error.errMsg,
            icon: 'none',
          })

          reject(error)
        },
      });
    })
  }
})