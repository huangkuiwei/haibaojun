const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_fenlei_index: -1,
    cur_show_status:0,
    keys:'测试',
    keys_arr:[],
    all_muban:[],
    fenlei_muban:[],
    cur_show_mubans:[],
    setting:null,
    //下载图片临时参数
    cur_down_index:0,
    pics_down:[],
    downing:0,
    cur_down_index:0,
    //
    cur_down_muban:null,
    wenan_show_status:0,
    wenan_user_info:null,
  },
  wanna_dingzhi:function(e){
    var index = e.currentTarget.dataset.index;
    var cur_down_wenan=this.data.cur_show_mubans[index];
    this.data.cur_down_muban=cur_down_wenan;
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
  wenan_jieguo_content_close:function(){
    this.setData({
      wenan_show_status:0,
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
  wanna_down:function(e){
    var index = e.currentTarget.dataset.index;
    this.data.cur_down_muban=this.data.cur_show_mubans[index];
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
  preview_img:function(e){
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },  
  go_mianze:function(){
    app.mlib.mianze=this.data.setting.mianze;
    wx.navigateTo({
      url: '../mianze/mianze',
    })
  },
  /**
   * 前往定制
   */
  go_dingzhi: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dingzhi/dingzhi?id=' + id,
    })
  },
  change_show_status:function(e){
    var status = e.currentTarget.dataset.status;
    this.setData({
      cur_show_status: status
    })
    if (status==1)
    {
      let cur_show_mubans_temp = this.data.cur_show_mubans;
      cur_show_mubans_temp.sort(function (a, b) {
        return b.download - a.download;
      })
      this.setData({
        cur_show_mubans: cur_show_mubans_temp
      })
    }
    else
    {
      let cur_show_mubans_temp = this.data.cur_show_mubans;
      cur_show_mubans_temp.sort(function (a, b) {
        return b.id - a.id;
      })
      this.setData({
        cur_show_mubans: cur_show_mubans_temp
      })
    }
  },
  /**
   * 删除搜索关键字
   */
  del_key:function(e){
    var key = e.currentTarget.dataset.key;
    console.log(key);
    var keys_arr=this.data.keys_arr;
    var has_shanchu=0;
    for(var i=0;i<keys_arr.length;++i)
    {
      if (keys_arr[i] == key)
      {
        has_shanchu=1;
        keys_arr.splice(i, 1);
        break;
      }
    }
    if (has_shanchu==1)
    {
      if (keys_arr.length==0)
      {
        wx.navigateBack({
          
        })
        return;
      }
      if (keys_arr.length == 1) {
        this.data.keys = keys_arr[0];
      }
      else
      {
        var keys = keys_arr[0];
        for (var i = 1; i < keys_arr.length;++i)
        {
          keys += ' ' + keys_arr[i];
        }
        this.data.keys=keys;
      }
      this.setData({
        keys_arr: keys_arr
      })
      this.inite();
    }    
  },
  /**
   * 切换分类
   */
  switchFenlei: function (e) {
    var index = e.currentTarget.dataset.index;
    if(index==-1)
    {
      this.setData({
        cur_fenlei_index: index,
        cur_show_mubans:this.data.all_muban,
        cur_show_status:0,
      })
    }
    else
    {
      this.setData({
        cur_fenlei_index: index,
        cur_show_mubans: this.data.fenlei_muban[index].mubans,
        cur_show_status: 0,
      })
    }    
    let cur_show_mubans_temp = this.data.cur_show_mubans;
    cur_show_mubans_temp.sort(function (a, b) {
      return b.id - a.id;
    })
    this.setData({
      cur_show_mubans: cur_show_mubans_temp
    })
  },
  inite:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'search';
    data.keyword = this.data.keys;
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          all_muban: res.data.data.all,
          fenlei_muban: res.data.data.fenlei,
          cur_show_mubans: res.data.data.all,
          cur_fenlei_index: -1,
          cur_show_status: 0,
          setting:res.data.data.setting,
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
  refresh:function(){
    var timestamp=new Date().getTime();
    console.log(this.data.cur_down_muban);
    this.data.cur_down_muban.hbicon=this.data.cur_down_muban.hbicon+"&test="+timestamp
    this.setData({
      cur_show_mubans:this.data.cur_show_mubans
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.key!=null)
    {
      options.key.replace(/(^\s*)|(\s*$)/g, "");
      this.data.keys = options.key;
      console.log(options.key);
    }
    this.data.keys_arr=this.data.keys.split(" ");
    console.log(this.data.keys_arr);
    this.setData({
      keys_arr: this.data.keys_arr
    })
    var that = this;
    app.mlib.login(function (response) {
      that.inite();
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
    console.log('onReachBottom');
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
    var index_path='/' + app.mlib.name + '/pages/wenan/wenan?pid='+this.data.uid
    return {
      title: this.data.setting.fxtitle,
      path: index_path,
      imageUrl: this.data.setting.fxicon,
    }
  },
})