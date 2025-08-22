var e = getApp(),
  a = require("../../../siteinfo.js");
const app = getApp();
const WxParse = require("../../../wxParse/wxParse.js")
Page({
  data: {
    avatarUrl: "",
    phone:"",
    member:"",
    userInfo:"",
    num: '',
    cooling: "",
    codeRequest: !0,
    nickName: "",
    res:{},
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    
    avatarUrl2:'',
    nickname:'',
  },
  onLoad: function (e) {
    if (e.showErrorToast) {
      setTimeout(() => {
        wx.showToast({
          title: '请先绑定手机号',
          icon: 'none',
          mask: true,
        });
      }, 1000)
    }

    var that=this;
    let res = {};
    app.mlib.login(
      function (response) {
        console.log(11111);
      console.log(response);
      res = response;
      that.inite();
    });
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo:  userInfo,
      res:res
    })
  },

  intChange: function (t) {
    console.log(t)
    
   
    var e = t.detail.value
     

    console.log(e)
      
      this.setData({
        phone: e
      
      })
   
  },
  user_code: function (e) {
    var t = e.detail.value;
    t != this.data.num ? wx.showToast({
      title: "验证码错误",
      icon: "",
      image: "",
      duration: 2e3,
      mask: !0,
      success: function (e) {},
      fail: function (e) {},
      complete: function (e) {}
    }) : this.setData({
     
     code: t
    })
   
  },
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
        that.setData({
          member: res.data.data.member,
          fenxiao: res.data.data.fenxiao,
          user: res.data.data.user,
          setting:res.data.data.setting,
          goumai_info:res.data.data.buyinfo,
         
          avatarUrl2:res.data.data.member.avatar,
          nickname: res.data.data.member.nickname,
        })
        if(res.data.data.member.avatar ){
          that.setData({
            avatarUrl:res.data.data.member.avatar,
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  getCapcha: function () {
    var a = this,
      i=this.data.phone;
    if (!/^1[3456789]\d{9}$/.test(i)) return wx.showToast({
      title: "手机号格式错误",
      icon: "none"
    }), !1;
    a.data.codeRequest && (
      a.setData({
      codeRequest: !1
    }),
  
    getApp().util.request({
      'url': 'entry/wxapp/getcode',
      data: {
       mobile: a.data.phone,
       openid: a.data.userInfo.memberInfo.openid
      },
      'cachetime': '0',
      success(t) {

        console.log(t)
      if (console.log(t, "获取验证码"), 0 == t.data.data.length) {
        a.setData({
          num:t.data.data.num,
          cooling: 60
        });
        
        var e = setInterval((function () {
          a.data.cooling > 0 ? a.setData({
            cooling: a.data.cooling - 1
          }) : (
            a.setData({
            codeRequest: !0
          }), 
          clearInterval(e))
        }),
         1e3)

 
        

        
        
      }
    }
    })
    )
  },
  



  getUserInfoFiles: function (a) {
    var t = this;
   
  },
  login: function () {
    var a = this;
    let res = a.data.res;
    if(!a.data.userInfo.memberInfo.uid){
      app.mlib.login(
        function (response) {
          console.log(11111);
        console.log(response);
        res = response;
        // that.inite();
      });
      var userInfo = wx.getStorageSync('userInfo')
      this.setData({
        userInfo:  userInfo
      })
    }
    getApp().util.request({
      'url': 'entry/wxapp/getorder',
      data: {
       mobile: a.data.phone,
       uid: a.data.userInfo.memberInfo.uid ?? a.data.userInfo.uid,
       openid: a.data.userInfo.memberInfo.openid ?? a.data.userInfo.openid,
       res:res,
       avatarUrl:a.data.avatarUrl2,
       nickname:a.data.nickname,
      },
      'cachetime': '0',
      success(t) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        });
        
        // 返回上一页面
        wx.navigateBack({
          delta: 1 // 返回的页面数，如果需要返回上一页，delta 设为 1
        });
        


      }
    })
   
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onInput(e){
    let value = e.detail.value
    this.setData({
        nickname:value,
      })
},
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    console.log(avatarUrl)
    this.arrayBufferToBase64(avatarUrl);
    
  },
  
  arrayBufferToBase64: function(url) {
      let that = this;
    wx.getFileSystemManager().readFile({
        filePath: url, // 选择图片返回的临时文件路径
        encoding: 'base64', // 编码格式
        success (res) {
            const imgBase64 = 'data:image/jpeg;base64,' + res.data;
            console.log('Base64 String:', imgBase64);
            that.setData({
                avatarUrl:imgBase64,
                avatarUrl2:imgBase64,
              })
             
            // 您现在可以使用imgBase64字符串进行进一步操作
        },
        fail (err) {
            console.error('读取文件失败', err);
        }
        
    });
  },
});