const app = getApp();
Page({
  data:{
    show_type:0,
    cur_fenlei_index:-1,
    all_fenlei:[],
    shouye_info:null,
    tuijian_fenlei_info:[],
    qiandao_info:null,
    pid:0,
    show_vip:0,
    sys_ios:1,//1代表是苹果系统
    show_tips:0,
    show_kefu_tips:0,
    entrance:[],
    zhuanti:[],
    //一键下载相关参数
    dzsetting:null,
    cur_down_muban:null,
    cur_down_muban_index:0,
    cur_down_muban_pindex:0,
    cur_down_muban_type:0,
    show_status:0,
    videoAd:null,
    jili:null,
    user_info:null,
    lbt:[],
    //文案相关
    cur_select_index:0,
    fenlei_selected:[],
    fenlei_selected_num:0,
    fenlei_selected_cache:[],
    setting:null,
    wenan_lbt:[],
    cur_down_wenan:null,
    wenan_show_status:0,
    wenan_user_info:null,
    cur_show_wenan:null,
    wenan_fenleiinfo:[],
    wenan_info:[],
    show_all_fenlei:0,
    rpx_to_px:1,
    fenlei_guding:0,
    has_inite_wenan:0,
    showProtocolDialog: false,
  },

  refuse() {
    wx.exitMiniProgram()
  },

  argee() {
    wx.setStorageSync('hasArgeeProtocol', true)

    this.setData({
      showProtocolDialog: false
    })
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
      console.log('固定位置');
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
  go_wenan_sousuo:function(){
    wx.navigateTo({
      url: '../wenansousuo/wenansousuo',
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
    this.data.cur_down_wenan=cur_down_wenan;
    console.log(cur_down_wenan);
    if(cur_down_wenan.zuopin==null)
    {
      wx.navigateTo({
        url: '../dingzhi/dingzhi?id=' + cur_down_wenan.hbid+'&wenanid='+cur_down_wenan.id,
      })
    }
    else
    {
      wx.navigateTo({
        url: '../dingzhi/dingzhi?id=' + cur_down_wenan.hbid+'&wenanid='+cur_down_wenan.id+'&zuopinid='+cur_down_wenan.zuopin.id,
      })
    }
  },
  refresh:function(){
    var timestamp=new Date().getTime();
    this.data.cur_down_wenan.hbicon=this.data.cur_down_wenan.hbicon+"&test="+timestamp
    this.setData({
      wenan_info:this.data.wenan_info
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
        wx.getImageInfo({
          src: muban.hbicon,
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
  wenan_lunbotu_go_fenlei:function(e){
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
   * 初始化文案
   */
  inite_wenan:function(){
    if(this.data.has_inite_wenan==1)
    {
      return;
    }
    console.log('初始化文案');
    var that=this;
    app.mlib.login(function(response){
      that._inite_wenan();
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
   * 初始化界面
   */
  _inite_wenan:function(){
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
        wx.stopPullDownRefresh()
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
          wenan_fenleiinfo:res.data.data.fenlei,
          has_inite_wenan:1,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  has_buy_muban:function(id){
    console.log(id);
    console.log(this.data.all_fenlei);
    for(var i=0;i<this.data.all_fenlei.length;++i)
    {
      for(var j=0;j<this.data.all_fenlei[i].muban.length;++j)
      {
        if(this.data.all_fenlei[i].muban[j].id==id)
        {
          this.data.all_fenlei[i].muban[j].hasgoumai=1;
        }
      }
    }
    for(var i=0;i<this.data.tuijian_fenlei_info.length;++i)
    {
      var hash=0;
      for(var j=0;j<this.data.tuijian_fenlei_info[i].muban.length;++j)
      {
        if(this.data.tuijian_fenlei_info[i].muban[j].id==id)
        {
          console.log('推荐分类初始化成功');
          this.data.tuijian_fenlei_info[i].muban[j].hasgoumai=1;
          hash=1;
          break;
        }
      }
      if(hash==1)
      {
        break;
      }
    }
    this.setData({
      all_fenlei:this.data.all_fenlei,
      tuijian_fenlei_info:this.data.tuijian_fenlei_info
    })
    console.log(this.data.all_fenlei);
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
      cur_down_muban_index:e.currentTarget.dataset.index,
      cur_down_muban_pindex:e.currentTarget.dataset.pindex,
      cur_down_muban_type:e.currentTarget.dataset.type,
      cur_down_muban:e.currentTarget.dataset.muban
    })
  },
  pics_error:function(e){
    console.log('图片加载错误');
    console.log(e);
  },
  /**
   * 定制提示
   */
  show_tishi:function(){
    this.setData({
      show_kefu_tips:1
    })
  },
  /**
   * 前往会员中心
   */
  go_vip:function(e){
    wx.navigateTo({
      url: '../vip/vip',
    })
  },
  /**
   * 前往定制
   */
  go_zhuanti:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../zhuanti/zhuanti?id='+id,
    })
  },
  /**
   * 前往定制
   */
  go_dingzhi:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id='+id,
    })
  },
  /**
   * 换一批
   */
  huanyipi:function(e){
    var index = e.currentTarget.dataset.index;
    var cur_fenlei = this.data.shouye_info.tjfenleiinfo[index];
    var tuijian_fenlei_info = this.data.tuijian_fenlei_info;
    console.log(index);
    console.log(tuijian_fenlei_info[index]);
    if (tuijian_fenlei_info[index].muban.length >= tuijian_fenlei_info[index].total)
    {
      wx.showToast({
        icon:'none',
        title: '已展示全部模板',
      })
      return;
    }
    if (6 * tuijian_fenlei_info[index].pindex >= tuijian_fenlei_info[index].total)
    {
      tuijian_fenlei_info[index].pindex=1;
    }
    else
    {
      tuijian_fenlei_info[index].pindex++;
    }
    var that = this;
    var data = new Object();
    data.apiname = 'huanyipi';
    data.pid = cur_fenlei.pid;
    data.cid = cur_fenlei.cid;
    data.pindex = tuijian_fenlei_info[index].pindex;
    console.log(data);
    app.mlib.request({
      'model': 'index',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 0) {
          wx.showToast({
            title: res.data.data.msg,
          })
        }
        else {
          tuijian_fenlei_info[index].muban=res.data.data.d;
          that.setData({
            tuijian_fenlei_info: tuijian_fenlei_info
          })
        }
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
    var entrance=this.data.lbt[index];
    if(entrance.type==0)//跳转小程序
    {
      wx.navigateToMiniProgram({
        appId: entrance.val,
      })
    }
    else if(entrance.type==1)//跳转网页
    {
      app.mlib.webview_url=entrance.val;
      wx.navigateTo({
        url: '../webview/webview',
      })
    }
    else if(entrance.type==2)//分类
    {
      app.mlib.fenleiinfo = entrance.val;
      console.log(app.mlib.fenleiinfo);
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
    else if(entrance.type==8)//个人信息
    {
      wx.navigateTo({
        url: '../pinfo/pinfo',
      })
    }
    return;
  },
  /**
   * 展示分类跳转
   */
  go_entrance: function (e) {
    var index = e.currentTarget.dataset.index;
    var entrance=this.data.entrance[index];
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
      app.mlib.fenleiinfo = entrance.val;
      console.log(app.mlib.fenleiinfo);
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
    else if(entrance.type==8)//网页
    {
      app.mlib.webview_url=entrance.val;
      wx.navigateTo({
        url: '../webview/webview',
      })
    }
    return;
  },
  /**
   * 推荐分类跳转
   */
  tuijian_go_fenlei: function (e) {
    var index = e.currentTarget.dataset.index;
    app.mlib.fenleiinfo = this.data.shouye_info.tjfenleiinfo[index];
    wx.switchTab({
      url: '../fenlei/fenlei',
    })
  },
  /**
   * 加载更多模板
   */
  get_more_muban:function(id,pindex){
    console.log(id);
    console.log(pindex);
    var that = this;
    var data = new Object();
    data.apiname = 'getmoremuabn';
    data.id = id;
    data.pindex = pindex;
    console.log(data);
    app.mlib.request({
      'model': 'index',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if(res.data.data.r==0)
        {
          wx.showToast({
            title: res.data.data.msg,
          })
        }
        else
        {
          var index=that.data.cur_fenlei_index;
          var mubans = that.data.all_fenlei[index].muban
          that.data.all_fenlei[index].muban = mubans.concat(res.data.data.d)
          that.setData({
            all_fenlei: that.data.all_fenlei
          })
          console.log(that.data.all_fenlei);
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 前往搜索界面
   */
  go_sousuo:function(){
    wx.navigateTo({
      url: '../sousuo/sousuo',
    })
  },
  switchFenlei:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      cur_fenlei_index:index,
    })
  },  
  switchShow:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      show_type:index,
    })
    if(index==1)
    {
      this.inite_wenan();
    }
  },  
  /**
   * 关闭签到界面
   */
  close_qiandao:function(){
    this.setData({
      qiandao_info:null,
    })
  },
  /**
   * 初始化界面
   */
  inite:function(){
    var that = this;
    var data=new Object();
    data.apiname='login';
    data.pid=this.data.pid;
    console.log(data);
    app.mlib.request({
      'model': 'index',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        res.data.data.shouye.tjfenleiinfo.forEach(item => {
          if (item.name === '教育培训') {
            item.hot = true
          } else if (item.name === '节日促销') {
            item.sale = true
          }
        })

        that.setData({
          all_fenlei:res.data.data.allfenlei,
          shouye_info: res.data.data.shouye,
          tuijian_fenlei_info: res.data.data.tuijianfenlei,
          qiandao_info:res.data.data.qiandao,
          entrance:res.data.data.entrance,
          zhuanti:res.data.data.zhuanti,
          dzsetting:res.data.data.dzsetting,
          user_info:res.data.data.member,
          jili:res.data.data.jili,
          lbt:res.data.data.lbt
        })
        app.mlib.uid=res.data.data.uid;
        if(app.mlib.uid==null)
        {
          app.mlib.uid=0;
        }
        wx.setNavigationBarTitle({
          title: res.data.data.shouye.title,
        })
        if((that.data.shouye_info.imgM!='')&&(that.data.shouye_info.imgM!=null))//设置了中部会员
        {
          if(that.data.sys_ios==0)//安卓系统
          {
            that.setData({
              show_vip:1
            })
          }
          else//苹果系统
          {
            if(that.data.shouye_info.version*1!=app.version*1)//不是审核版本
            {
              if(that.data.shouye_info.showvip==1)
              {
                that.setData({
                  show_vip:1
                })
              }
            }
          }
        }
        app.mlib.fenxiang = res.data.data.fenxiang
        if((res.data.data.dzsetting.downset==1)&&(res.data.data.jili!=null)&&(res.data.data.jili.adid!=''))
        {
          that.inite_ad();
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    if(this.data.show_type==0)
    {
      this.inite();
    }
    else
    {
      var that=this;
      app.mlib.login(function(response){
        that._inite_wenan();
      });
    }
    wx.stopPullDownRefresh()
  },
  onLoad:function(options){
    console.log("onLoad");
    var yulan=0;
    if(options.yulan!=null)
    {
      yulan=options.yulan;
    }
    //扫二维码进入
    if (options.scene!=null)
    {
      console.log('场景值');
      console.log(options.scene);
      if (options.scene.indexOf("pid") != -1)
      {
        var pid = options.scene.slice(3);
        console.log(pid);
        this.data.pid = pid;
      }
    }
    //小程序分享进入
    if(options.pid!=null)
    {
      this.data.pid = options.pid;
    }
    var that = this;
    wx.getSystemInfo({
      success (res) {
        console.log(res.system)
        if(res.system.indexOf("iOS") != -1)
        {
          console.log('苹果系统');
        }
        else
        {
          that.setData({
            sys_ios:0
          })
          console.log('安卓系统');
        }
        if(yulan==0)
        {
          app.mlib.login(function(response){
            that.inite();
          });
          console.log('非预览模式');
        }
        else
        {
          wx.login({
            success (res) {
              console.log('非预览模式');
              app.mlib.login(function(response){
                that.inite();
              });
            },
            fail (res) {
              console.log('预览模式');
              that.inite();
            },
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
    if (this.data.show_type==1)
    {
      this.scroll_bottom();
    }
    else
    {
      console.log('推荐');
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
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
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onShareTimeline:app.mlib.fxpyq_go_shouye,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: app.mlib.fx_go_shouye
})