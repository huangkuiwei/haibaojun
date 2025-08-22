const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zuopin: [],
    del_ing:0,
    uid:0,
    show_status:0,
    user_info:null,
    cur_zuopinid:0,
    no_need_refresh:0,
    total:0,
    version:0,
    videoAd:null,
    jili:null,
    cur_index:-1,
    showProtocolDialog: false,
  },

  argee() {
    wx.setStorageSync('hasArgeeProtocol', true)

    this.setData({
      showProtocolDialog: false
    })
  },

  /**
   * 支付
   */
  pay: function () {
    var data = new Object();
    data.type = 3;
    data.mbid = this.data.zuopin[this.data.cur_index].mbid.id;
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/pay',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 2)//余额足够，不需要支付
        {
          that.setData({
            has_goumai:1,
          })
          that.data.user_info.can=1;
          that.download_zuopin();
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
            that.setData({
              has_goumai:1,
            })
            that.data.user_info.can=1;
            that.download_zuopin();
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
  add_download_cishu:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'jili';
    app.mlib.request({
      'model': 'fenxiao',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.data.user_info.left=that.data.user_info.left*1+that.data.jili.cishu*1;
        that.setData({
          user_info:that.data.user_info,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  show_ad:function(){
    var videoAd=this.data.videoAd;
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  inite_ad:function(){
    console.log('初始化广告');
    var that=this;
    if (wx.createRewardedVideoAd) {
      var videoAd = wx.createRewardedVideoAd({
        adUnitId: that.data.jili.adid
      })
      videoAd.onLoad(() => {
        that.setData({
          videoAd:videoAd
        })
        // that.data.videoAd=videoAd;
        console.log('广告初始化成功');
      })
      videoAd.onError((err) => {
        console.log('广告初始化失败');
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          that.add_download_cishu();
          console.log('激励广告加载完成')
        } else {
        console.log('激励广告被强制关闭')
        }
      })
    }
  },
  /**
   * 关闭结果窗口
   */
  jieguo_content_close: function () {
    this.setData({
      show_status: 0,
    })
  },
  /**
   * 展示下载窗口
   */
  show_download: function (e) {
    if(this.data.version*1==app.version*1)
    {
      wx.showToast({
        title: '作品审核中',
      })
      return;
    }
    var index = e.currentTarget.dataset.index;
    this.setData({
      show_status:1,
      cur_zuopinid: this.data.zuopin[index].id,
      cur_index:index,
    })
  },
  /**
   * 下载作品
   */
  download_zuopin:function(e){
    if((this.data.user_info.can==0)&&(this.data.zuopin[this.data.cur_index].hasgoumai==0))
    {
      console.log('不能下载');
      return;
    }
    var that=this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum']);
        if (res.authSetting['scope.writePhotosAlbum']==false) {
          that.data.no_need_refresh=1;
          wx.openSetting({
            success(res) {
              that.data.no_need_refresh = 0;
              console.log(res.authSetting['scope.writePhotosAlbum'])
              if (res.authSetting['scope.writePhotosAlbum']==true)
              {
                that._download_zuopin();
              }
            }
          })
        }
        else if (res.authSetting['scope.writePhotosAlbum'] == undefined)
        {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res);
              that._download_zuopin();
            }
          })

        }
        else
        {
          that._download_zuopin();
        }
      }
    })    
  },
  _download_zuopin:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'download';
    data.zuopinid = this.data.cur_zuopinid;
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if(res.data.data.r==0)
        {
          wx.showToast({
            title: res.data.data.msg,
          })
          return;
        }
        if(this.data.has_goumai==1)
        {
          if ((that.data.user_info.vip != 0) && (that.data.user_info.left==0))
          {
            that.data.user_info.dleft--;
          }
          else
          {
            that.data.user_info.left--;
          }
          that.setData({
            user_info: that.data.user_info
          })
        }
        wx.getImageInfo({
          src: res.data.data.url,
          success(res) {
            that.setData({
              show_status:0,
            })
            console.log(res)
            console.log(res.path);
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success(res) { 
                wx.showToast({
                  title: '保存成功',
                })
              }
            })
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 前往编辑作品
   */
  go_edit:function(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.zuopin[index].id;
    var mbid = this.data.zuopin[index].mbid;
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id=' + mbid + '&zuopinid=' + id,
    })
  },
  /**
   * 删除作品
   */
  del_zuopin:function(e){
    if (this.data.del_ing==1)
    {
      return;
    }
    this.data.del_ing=1;
    var index = e.currentTarget.dataset.index;
    var id = this.data.zuopin[index].id
    var that = this;
    var data = new Object();
    data.apiname = 'del';
    data.id = id;
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.data.zuopin.splice(index,1);
        that.setData({
          zuopin: that.data.zuopin
        })
        wx.showToast({
          title: '删除成功',
        })
        that.data.del_ing=0;
      },
      fail(res) {
        console.log(res);
        that.data.del_ing = 0;
      }
    })
  },
  /**
   * 初始化
   */
  inite: function () {
    console.log('我的设计初始化');
    var that = this;
    var data = new Object();
    data.apiname = 'get';
    data.id = this.data.id;
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        var zuopin=res.data.data.d;
        var timestamp=new Date().getTime();
        for(var i=0;i<zuopin.length;++i)
        {
          zuopin[i].icon=zuopin[i].icon+'?test='+timestamp;
        }
        that.setData({
          zuopin:res.data.data.d,
          uid:res.data.data.uid,
          user_info:res.data.data.user,
          total:res.data.data.total,
          version:res.data.data.version,
          jili:res.data.data.jili,
        })
        if(res.data.data.jili!=null)
        {
          if(res.data.data.jili.adid!='')
          {
            that.inite_ad();
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

    if (this.data.no_need_refresh==1)
    {
      return;
    }
    var that=this;
    app.mlib.login(function (response) {
      that.inite();
    });
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
   * 加载更多作品
   */
  get_more:function(){
    var cur_page=parseInt(this.data.zuopin.length/10)+1;
    var that = this;
    var data = new Object();
    data.apiname = 'getmore';
    data.page = cur_page;
    console.log(data);
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if(res.data.data.r==0)
        {
          wx.showToast({
            title: '加载失败',
          })
        }
        else
        {
          that.data.zuopin = that.data.zuopin.concat(res.data.data.d)
          that.setData({
            zuopin: that.data.zuopin
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
    if (this.data.zuopin.length >= this.data.total)
      {
        console.log('不需要加载');
      }
      else
      {
        console.log('需要加载');
        this.get_more();
      }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
    if(e.from=='menu')
    {
      return {
        title: app.mlib.fenxiang.title,
        path: '/' + app.mlib.name + '/pages/index/index',
        imageUrl: app.mlib.fenxiang.icon,
        success: function (res) {
          wx.showToast({
            title: '转发成功',
          })
          console.log('转发成功');
        },
        fail: function (res) {
          wx.showToast({
            title: '转发失败',
          })
          console.log('转发失败');
        },
      }
    }
    else if (e.from == 'button') 
    {
      if (e.target.dataset.id==null)
      {
        return {
          title: app.mlib.fenxiang.title,
          path: '/' + app.mlib.name + '/pages/index/index',
          imageUrl: app.mlib.fenxiang.icon,
          success: function (res) {
            wx.showToast({
              title: '转发成功',
            })
            console.log('转发成功');
          },
          fail: function (res) {
            wx.showToast({
              title: '转发失败',
            })
            console.log('转发失败');
          },
        }
      }
      var zuopinid = e.target.dataset.id;
      var index = e.target.dataset.index;
      var icon = this.data.zuopin[index].icon
      return {
        title: this.data.zuopin[index].name,
        path: '/' + app.mlib.name + '/pages/dingzhi/dingzhi?zuopinid=' + zuopinid+'&pid='+this.data.uid,
        imageUrl: icon,
        success: function (res) {
          wx.showToast({
            title: '转发成功',
          })
          console.log('转发成功');
        },
        fail: function (res) {
          wx.showToast({
            title: '转发失败',
          })
          console.log('转发失败');
        },
      }
    }
  },
})