const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_select_index:0,
    fenlei_selected:[],
    fenlei_selected_num:0,
    fenlei_selected_cache:[],
    setting:null,
    uid:0,
    wenan_lbt:[],
    //下载图片临时参数
    cur_down_wenan:null,
    wenan_show_status:0,
    wenan_user_info:null,
    cur_show_wenan:null,
    wenan_fenleiinfo:[],
    wenan_info:[],
    show_all_fenlei:0,
    rpx_to_px:1,
    fenlei_guding:0,
  },
  btn_gongxian:function(){
    wx.navigateTo({
      url: '../paihang/paihang',
    })
  },
  on_change_fenlei: function (e) {
    var cur_pos = e.detail.scrollTop / this.data.rpx_to_px;
    if(cur_pos>379)
    {
      this.setData({
        fenlei_guding:1,
      })
    }
    else
    {
      this.setData({
        fenlei_guding:0,
      })
    }
  },
  show_fenlei:function(){
    if(this.data.show_all_fenlei==1)
    {
      var fenlei_selected_num=0;
      var fenlei_selected=this.data.fenlei_selected_cache;
      for(var i=0;i<fenlei_selected.length;++i)
      {
        if(fenlei_selected[i]==1)
        {
          fenlei_selected_num++;
        }
      }
      this.setData({
        show_all_fenlei:0,
        fenlei_selected:this.data.fenlei_selected_cache,
        fenlei_selected_num:fenlei_selected_num,
      })
    }
    else
    {
      var fenlei_selected_cache=[];
      var fenlei_selected=this.data.fenlei_selected;
      for(var i=0;i<fenlei_selected.length;++i)
      {
        fenlei_selected_cache.push(fenlei_selected[i]);
      }
      this.data.fenlei_selected_cache=fenlei_selected_cache;
      this.setData({
        show_all_fenlei:1,
      })
    }
  },
  clear_select:function(){
    var fenlei_selected=this.data.fenlei_selected;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      fenlei_selected[i]=0;
    }
    this.setData({
      fenlei_selected:fenlei_selected,
      cur_select_index:0,
      fenlei_selected_num:0,
      show_all_fenlei:0,
    })
    var has_change=0;
    var fenlei_selected_cache=this.data.fenlei_selected_cache;
    var fenlei_selected=this.data.fenlei_selected;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      if(fenlei_selected[i]!=fenlei_selected_cache[i])
      {
        has_change=1;
        break;
      }
    }
    if(has_change==1)
    {
      this.setData({        
        wenan_info:[],
      })
      console.log('更新');
      this.get_wenan();
    }
  },
  wancheng:function(){
    this.setData({
      show_all_fenlei:0,
    })
    var has_change=0;
    var fenlei_selected_cache=this.data.fenlei_selected_cache;
    var fenlei_selected=this.data.fenlei_selected;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      if(fenlei_selected[i]!=fenlei_selected_cache[i])
      {
        has_change=1;
        break;
      }
    }
    if(has_change==1)
    {
      console.log('更新');
      this.get_wenan();
    }
  },
  scroll_bottom:function(){    
    console.log('onReachBottom');
    var muban_ll=this.data.wenan_info.d.length;
    var total=this.data.wenan_info.total;
    var pindex=this.data.wenan_info.pindex;
    if(muban_ll>=total)
    {
      console.log('无需加载');
    }
    else
    {
      this.get_more_wenan(pindex);
    }
  },
  get_more_wenan:function(pindex){
    var that = this;
    var data=new Object();
    data.type=this.data.cur_select_index;
    var fenlei_ids=[];
    var fenlei_selected=this.data.fenlei_selected;
    var wenan_fenleiinfo=this.data.wenan_fenleiinfo;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      if(fenlei_selected[i]==1)
      {
        fenlei_ids.push(wenan_fenleiinfo[i].id);
      }
    }
    data.fenleiid=JSON.stringify(fenlei_ids);
    data.apiname='getwenan';
    data.pindex = pindex*1+1;
    console.log(data);
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        var wenans = that.data.wenan_info.d
        that.data.wenan_info.d = wenans.concat(res.data.data.d)
        that.data.wenan_info.pindex=that.data.wenan_info.pindex*1+1;
        that.setData({
          wenan_info: that.data.wenan_info
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  get_wenan:function(){
    var that = this;
    var data=new Object();
    data.type=this.data.cur_select_index;
    var fenlei_ids=[];
    var fenlei_selected=this.data.fenlei_selected;
    var wenan_fenleiinfo=this.data.wenan_fenleiinfo;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      if(fenlei_selected[i]==1)
      {
        fenlei_ids.push(wenan_fenleiinfo[i].id);
      }
    }
    data.fenleiid=JSON.stringify(fenlei_ids);
    data.apiname='getwenan';
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': 0,
      success(res) {
        console.log(res);
        that.setData({
          wenan_info:res.data.data,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  select_fenlei:function(e){
    var index = e.currentTarget.dataset.index;
    if(this.data.fenlei_selected[index]==0)
    {
      this.data.fenlei_selected[index]=1;
    }
    else
    {
      this.data.fenlei_selected[index]=0;
    }
    var fenlei_selected_num=0;
    var fenlei_selected=this.data.fenlei_selected;
    for(var i=0;i<fenlei_selected.length;++i)
    {
      if(fenlei_selected[i]==1)
      {
        fenlei_selected_num++;
      }
    }
    this.setData({
      fenlei_selected:this.data.fenlei_selected,
      fenlei_selected_num:fenlei_selected_num
    })
  },
  select:function(e){
    var index = e.currentTarget.dataset.index;
    if(index==this.data.cur_select_index)
    {
      return;
    }
    this.setData({
      cur_select_index:index,
    })
    this.get_wenan();
  },
  wenan_jieguo_content_close:function(){
    this.setData({
      wenan_show_status:0,
    })
  },
  btn_tougao:function(){
    wx.navigateTo({
      url: '../addwenan/addwenan',
    })
  },
  go_mianze:function(){
    app.mlib.mianze=this.data.setting.mianze;
    wx.navigateTo({
      url: '../mianze/mianze',
    })
  },
  go_sousuo:function(){
    wx.navigateTo({
      url: '../wenansousuo/wenansousuo',
    })
  },
  inite_ad:function(){
    console.log('初始化广告');
    var that=this;
    if (wx.createRewardedVideoAd) {
      wx.showLoading({
        title: '广告载入中',
      })
      that.setData({
        wenan_show_status:0,
      })
      console.log('激励视频广告可以调用');
      var videoAd = wx.createRewardedVideoAd({
        adUnitId: that.data.setting.ad
      })
      videoAd.onLoad(() => {
        wx.hideLoading();
        if(that.data.videoAd==null)
        {
          that.setData({
            videoAd:videoAd
          })
          videoAd.show().catch(() => {
            console.log('展示失败');
            wx.showToast({
              title: 'title',
              icon:'广告载入失败'
            })
          })
        }
        // that.data.videoAd=videoAd;
        console.log('广告初始化成功');
      })
      videoAd.onError((err) => {
        wx.hideLoading();
        console.log(err);
        console.log('广告初始化失败');
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          console.log('激励广告加载完成')
          that.add_jifen();
        } else {
        console.log('激励广告被强制关闭')
        }
      })
      // videoAd.load();
    }
    else
    {
      console.log('激励视频广告不能调用');
    }
  },
  add_jifen:function(){
    var that = this;
    var data=new Object();
    data.apiname='addjifen';
    console.log(data);
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': 0,
      success(res) {
        console.log(res.data.data.r);
        if(res.data.data.r==1)
        {
          wx.showToast({
            title: '获取积分成功',
          })
        }
        else
        {
          wx.showToast({
            title: res.data.data.msg,
            icon:'none'
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  go_add_wenan:function(){
    this.setData({
      wenan_show_status:0,
    })
    wx.navigateTo({
      url: '../addwenan/addwenan',
    })
  },
  wanna_dingzhi:function(e){
    var index = e.currentTarget.dataset.index;
    var cur_down_wenan=this.data.wenan_info.d[index];
    console.log(cur_down_wenan);
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id=' + cur_down_wenan.hbid,
    })
  },
  wanna_down:function(e){
    var index = e.currentTarget.dataset.index;
    this.data.cur_down_wenan=this.data.wenan_info.d[index];
    var that=this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum']);
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum'] == true) {
                that.setData({
                  wenan_show_status:1,
                })            
              }
            }
          })
        }
        else if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              that.setData({
                wenan_show_status:1,
              })
            }
          })

        }
        else {
          that.setData({
            wenan_show_status:1,
          })
        }
      }
    })
  },
  /**
   * 下载文案
   */
  down_wenan:function(){
    var that = this;
    var muban=this.data.cur_down_wenan;
    var content=muban.content;
    var data = new Object();
    data.apiname = 'download';
    data.id = muban.id;
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 0) {
          wx.showToast({
            title: res.data.data.msg,
          })
          return;
        }
        if ((that.data.wenan_user_info.vip != 0) && (that.data.wenan_user_info.left == 0)) {
          that.data.wenan_user_info.dleft--;
        }
        else {
          that.data.wenan_user_info.left--;
        }
        that.setData({
          wenan_user_info: that.data.wenan_user_info
        })
        wx.getImageInfo({
          src: res.data.data.url,
          success(res) {
            that.setData({
              wenan_show_status: 0,
            })
            console.log(res)
            console.log(res.path);
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success(res) {
                wx.setClipboardData({
                  data: content,
                })
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
   * 轮播图跳转分类
   */
  lunbotu_go_fenlei:function(e){
    var index = e.currentTarget.dataset.index;
    var entrance=this.data.wenan_lbt[index];
    if(entrance.type==0)//跳转小程序
    {
      wx.navigateToMiniProgram({
        appId: entrance.val,
      })
    }
    else if(entrance.type==1)//客服
    {
    }
    else if(entrance.type==2)//分类
    {
      app.mlib.wenan_fenleiinfo = entrance.val;
      console.log(app.mlib.wenan_fenleiinfo);
      wx.switchTab({
        url: '../fenlei/fenlei',
      })
    }
    else if(entrance.type==3)//邀请海报
    {
      wx.navigateTo({
        url: '../haibao/haibao',
      })
    }
    else if(entrance.type==4)//具体海报
    {
      wx.navigateTo({
      url: '../dingzhi/dingzhi?id='+entrance.val,
    })
    }
    else if(entrance.type==5)//取现
    {
      wx.navigateTo({
        url: '../quxian/quxian',
      })
    }
    else if(entrance.type==6)//收藏
    {
      wx.navigateTo({
        url: '../shoucang/shoucang',
      })
    }
    else if(entrance.type==7)//团队
    {
      wx.navigateTo({
        url: '../tuandui/tuandui',
      })
    }
    else if(entrance.type==8)
    {      
      wx.navigateTo({
        url: '../pinfo/pinfo',
      })
    }
    return;
  },
  preview_img:function(e){
    var url = e.currentTarget.dataset.url;
    console.log(url);
    wx.previewImage({
      urls: [url],
      showmenu:false,
    })
  },
  /**
   * 初始化界面
   */
  inite:function(){
    var that = this;
    var data=new Object();
    data.apiname='login';
    console.log(data);
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': 0,
      success(res) {
        console.log(res);
        var fenlei_selected=[];
        var wenan_fenleiinfo=res.data.data.fenlei;
        for(var i=0;i<wenan_fenleiinfo.length;++i)
        {
          fenlei_selected.push(0);
        }
        that.setData({
          wenan_info:res.data.data.showwenan,
          setting:res.data.data.wenansetting,
          uid:res.data.data.uid,
          wenan_lbt:res.data.data.lbt,
          wenan_user_info:res.data.data.user,
          fenlei_selected:fenlei_selected,
          wenan_fenleiinfo:res.data.data.fenlei
        })
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
    app.mlib.login(function(response){
      that.inite();
    });
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          rpx_to_px: res.windowWidth / 750,
        });
      }
    });
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

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
    var index_path='/' + app.mlib.name + '/pages/index/index?pid='+this.data.uid
    return {
      title: this.data.setting.fxtitle,
      path: index_path,
      imageUrl: this.data.setting.fxicon,
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
})