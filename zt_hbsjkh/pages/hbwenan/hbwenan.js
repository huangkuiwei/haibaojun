const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hbid:71,
    wenan_info:[],
    setting:null,
    uid:0,
    wenan_user_info:null,
    wenan_show_status:0,
    shouye_info:null,
  },
  btn_tougao:function(){
    wx.navigateTo({
      url: '../addwenan/addwenan',
    })
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
    data.apiname='getmore';
    data.hbid=this.data.hbid;
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
  preview_img:function(e){
    var url = e.currentTarget.dataset.url;
    console.log(url);
    wx.previewImage({
      urls: [url],
      showmenu:false,
    })
  },
  wanna_dingzhi:function(e){
    var index = e.currentTarget.dataset.index;
    var cur_down_muban=this.data.wenan_info.d[index];
    this.data.cur_down_muban=cur_down_muban;
    if(cur_down_muban.zuopin==null)
    {
      wx.navigateTo({
        url: '../dingzhi/dingzhi?id=' + cur_down_muban.hbid+'&wenanid='+cur_down_muban.id,
      })
    }
    else
    {
      wx.navigateTo({
        url: '../dingzhi/dingzhi?id=' + cur_down_muban.hbid+'&wenanid='+cur_down_muban.id+'&zuopinid='+cur_down_muban.zuopin.id,
      })
    }
  },
  refresh:function(){
    var timestamp=new Date().getTime();
    this.data.cur_down_muban.hbicon=this.data.cur_down_muban.hbicon+"&test="+timestamp
    this.setData({
      wenan_info:this.data.wenan_info
    })
  },
  wanna_down:function(e){
    var index = e.currentTarget.dataset.index;
    this.data.cur_down_muban=this.data.wenan_info.d[index];
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
    var muban=this.data.cur_down_muban;
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
  wenan_jieguo_content_close:function(){
    this.setData({
      wenan_show_status:0,
    })
  },
  go_mianze:function(){
    app.mlib.mianze=this.data.setting.mianze;
    wx.navigateTo({
      url: '../mianze/mianze',
    })
  },
  /**
   * 初始化
   */
  inite:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'gethbwenan';
    data.hbid = this.data.hbid;
    console.log(data);
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          wenan_info: res.data.data.wenan,
          setting:res.data.data.wenansetting,
          uid:res.data.data.uid,
          wenan_user_info:res.data.data.user,
          shouye_info:res.data.data.shouye,
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
    if (options.hbid != null) {
      this.data.hbid = options.hbid;
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
})