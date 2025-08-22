var util = require('we7/resource/js/util.js');
var mlib = require('mlib/mlib.js');
var imgfunc = require('mlib/imgfunc.js');
App({
    onLaunch: function (res) {
    },
    onShow: function (res) {
      // 场景值1038：从被打开的小程序返回
      if (res.scene === 1038) {
        const { appId, extraData } = res.referrerInfo

        // appId为wxbd687630cd02ce1d：从签约小程序跳转回来
        if (appId === 'wxbd687630cd02ce1d') {
          if(extraData.return_code === 'SUCCESS') {
            // 跳转到订购成功页面
            wx.navigateTo({
              url: '/zt_hbsjkh/pages/success/success',
            })
          } else {
            wx.showToast({
              title: '签约失败',
              icon:'none',
            })
          }
        }
      }
    },
    onHide: function () {
    },
    onError: function (msg) {
        console.log(msg)
  },
  version:20210903,
  global_data: {
    tuandui: null,
  },
    //加载微擎工具类
    util: util,
    mlib: mlib,
    imgfunc:imgfunc,
    //导航菜单，微擎将会自己实现一个导航菜单，结构与小程序导航菜单相同
    //用户信息，sessionid是用户是否登录的凭证
    userInfo: {
        sessionid: null,
    },
    siteInfo: require('siteinfo.js')
});