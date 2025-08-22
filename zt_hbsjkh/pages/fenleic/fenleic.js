const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_fenlei:0,
    cur_erji_fenlei:0,
    fenlei_info:[],
    cur_fenlei_id: 0,
    cur_erji_fenlei_id: 0,
    loading:0,
    has_inite:0,
    show_kefu_tips:0,
    //一键下载相关参数
    dzsetting:null,
    cur_down_muban:null,
    show_status:0,
    videoAd:null,
    jili:null,
    user_info:null,
    cur_down_muban_index:0,
    scroll_top:0,
  },
  has_buy_muban:function(id){
    console.log(this.data.fenlei_info);
    for(var i=0;i<this.data.fenlei_info.length;++i)
    {
      for(var j=0;j<this.data.fenlei_info[i].muban.length;++j)
      {
        for(var k=0;k<this.data.fenlei_info[i].muban[j].length;++k)
        {
          if(this.data.fenlei_info[i].muban[j][k].id==id)
          {
            this.data.fenlei_info[i].muban[j][k].hasgoumai=1;
          }
        }
      }
    }
    this.setData({
      fenlei_info:this.data.fenlei_info,
    })
  },
  /**
   * 支付
   */
  pay: function () {
    var data = new Object();
    data.type = 3;
    data.mbid = this.data.cur_down_muban.id;
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/pay',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 2)//余额足够，不需要支付
        {
          that.data.cur_down_muban.hasgoumai=1;
          that.data.user_info.can=1;
          that.has_buy_muban(that.data.cur_down_muban.id);
          that.setData({
            fenlei_info:that.data.fenlei_info
          })
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
            that.data.cur_down_muban.hasgoumai=1;
            that.data.user_info.can=1;
            that.has_buy_muban(that.data.cur_down_muban.id);
            that.setData({
              fenlei_info:that.data.fenlei_info
            })
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
  /**
   * 下载作品
   */
  download_zuopin:function(e){
    if((this.data.user_info.can==0)&&(this.data.cur_down_muban.hasgoumai==0))
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
    data.id = this.data.cur_down_muban.id;
    console.log(data);

    app.mlib.request({
      'model': 'muban',
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
        if(that.data.cur_down_muban.hasgoumai==0)
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
    console.log(e);
    this.setData({
      show_status:1,
      cur_down_muban:e.currentTarget.dataset.muban,
      cur_down_muban_index:e.currentTarget.dataset.index,
    })
  },
  /**
   * 定制提示
   */
  show_tishi:function(){
    this.setData({
      show_kefu_tips:1
    })
  },
  video_start:function(e){
    console.log('视频开始播放');
    console.log(e);
  },
  video_end:function(e){
    console.log('视频结束播放');
    console.log(e);
  },
  /**
   * 视频点击
   */
  video_clicked:function(e){
    console.log('视频点击了');
    console.log(e);
  },
  /**
   * 前往定制
   */
  go_dingzhi: function (e) {
    var id = e.currentTarget.dataset.id;
    var icon = e.currentTarget.dataset.icon;
    var cur_select_hb=new Object();
    cur_select_hb.hbid=id;
    cur_select_hb.hbicon=icon
    app.mlib.cur_select_hb=cur_select_hb;
    wx.navigateBack();
  },
  /**
   * 前往搜索界面
   */
  go_sousuo: function () {
    wx.navigateTo({
      url: '../sousuo/sousuo',
    })
  },
  /**
   * 滚动到底部更新分类
   */
  refresh_fenlei:function(e){
    console.log('到底了');
    console.log(this.data.cur_fenlei);
    console.log(this.data.cur_erji_fenlei);
    var fenlei_info=this.data.fenlei_info;
    var cur_fenlei=this.data.cur_fenlei;
    var cur_erji_fenlei=this.data.cur_erji_fenlei;
    if(fenlei_info[cur_fenlei].total[cur_erji_fenlei]<=fenlei_info[cur_fenlei].muban[cur_erji_fenlei].length)
    {
      console.log('不需要更新');
    }
    else
    {
      console.log('需要更新');
      if(this.data.loading==1)
      {
        return;
      }
      this.data.loading=1;
      var that = this;
    var data = new Object();
    data.apiname = 'getmore';
    data.yiji = fenlei_info[cur_fenlei].info.id;
    data.erji = fenlei_info[cur_fenlei].erji[cur_erji_fenlei].id;  
    fenlei_info[cur_fenlei].page[cur_erji_fenlei]+=1;
    data.page=fenlei_info[cur_fenlei].page[cur_erji_fenlei];
    console.log(data);
    app.mlib.request({
      'model': 'fenlei',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.data.loading=0;
        if(res.data.data.r==0)
        {
          wx.showToast({
            title: '加载错误',
          })
          return;
        }
        var temp=fenlei_info[cur_fenlei].muban[cur_erji_fenlei].concat(res.data.data.d);
        fenlei_info[cur_fenlei].muban[cur_erji_fenlei]=temp;
        that.setData({
          fenlei_info:fenlei_info
        })
      },
      fail(res) {
        console.log(res);
      }
    })
    }
  },
  /**
   * 切换二级分类
   */
  change_erji_fenlei:function(e){
    console.log(e.currentTarget.dataset.index);
    var index=e.currentTarget.dataset.index;
    this.setData({
      cur_erji_fenlei:index,
      scroll_top:0,
    })
  },
  /**
   * 切换一级分类
   */
  change_fenlei:function(e){
    console.log(e.currentTarget.dataset.index);
    var index=e.currentTarget.dataset.index;
    this.setData({
      cur_fenlei:index,
      cur_erji_fenlei:0,
      scroll_top:0,
    })
  },  
  /**
   * 初始化
   */
  inite:function(){
    if(this.data.has_inite==1)
    {
      console.log('分类信息已经初始化过了');
      return;
    }
    this.data.has_inite=1;
    var fenlei_id=this.data.cur_fenlei_id;
    var erji_fenlei_id=this.data.cur_erji_fenlei_id;
    var that = this;
    var data = new Object();
    data.apiname = 'get';
    data.pid = this.data.pid;
    console.log(data);
    app.mlib.request({
      'model': 'fenlei',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        var fenlei_info = res.data.data.d;
        that.setData({
          fenlei_info: fenlei_info,
          dzsetting:res.data.data.dzsetting,
          user_info:res.data.data.member,
          jili:res.data.data.jili
        })
        if((res.data.data.dzsetting.downset==1)&&(res.data.data.jili!=null)&&(res.data.data.jili.adid!=''))
        {
          that.inite_ad();
        }
        if (erji_fenlei_id != 0)
        {
          for (var i = 0; i < fenlei_info.length; ++i) {
            for (var j = 0; j < fenlei_info[i].erji.length;++j)
            {
              if (fenlei_info[i].erji[j].id == erji_fenlei_id)
              {
                that.setData({
                  cur_fenlei:i,
                  cur_erji_fenlei:j
                })
              }
            }
          }
        }
        else if (fenlei_id != 0)
        {
          for (var i = 0; i < fenlei_info.length; ++i) {
            if (fenlei_info[i].info.id == fenlei_id) {
              that.setData({
                cur_fenlei: i,
                cur_erji_fenlei: 0
              })
            }
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
    console.log('onload');
    if((app.mlib.fenleiinfo!=null))
    {
      this.data.cur_fenlei_id = app.mlib.fenleiinfo.pid;
      this.data.cur_erji_fenlei_id = app.mlib.fenleiinfo.cid;
      app.mlib.fenleiinfo = null;
      this.data.has_inite=0;
    }
    this.inite();
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
    console.log('onShow');
    if(app.mlib.fenleiinfo!=null)
    {
      this.data.cur_fenlei_id = app.mlib.fenleiinfo.pid;
      this.data.cur_erji_fenlei_id = app.mlib.fenleiinfo.cid;
      app.mlib.fenleiinfo = null;
      this.data.has_inite=0;
    }
    this.inite();
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
    console.log('onReachBottom');
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: app.mlib.fx_go_shouye
})