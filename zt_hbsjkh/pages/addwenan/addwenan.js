const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_leixing:0,
    cur_fenlei:0,
    fenlei:[],
    setting:null,
    uid:0,
    pics:[],
    video_url:'',
    cur_select_hb:null,
  },
  go_upsm:function(){
    app.mlib.wenan_setting=this.data.setting;
    wx.navigateTo({
      url: '../upsm/upsm',
    })
  },
  /**
   * 支付
   */
  tijiao: function (e) {
    var formdata = e.detail.value;
    console.log(formdata);
    if(formdata.content=='')
    {
      wx.showToast({
        title: '请填写文案内容',
        icon:'none'
      })
      return;
    }
    formdata.fenlei=this.data.fenlei[this.data.cur_fenlei].id;
    var pic=[];
    if(this.data.cur_select_hb==null)
    {
      wx.showToast({
        title: '请选择海报',
        icon:'none'
      })
      return;
    }
    formdata.hbid=this.data.cur_select_hb.hbid;
    var that=this;
    app.mlib.getUserInfo(this,function (response) {
      console.log('开始提交');
      that._tijiao(formdata);
    })
  },
  _tijiao:function(formdata){
    console.log(formdata);
    var that=this;
    formdata.apiname = 'addshenhe';
    app.mlib.request({
      'model': 'wenan',
      'data': formdata,
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
        wx.showModal({
          title: '提示',
          content: '您制作的文案已经提交后台审核，审核通过后即可赚取积分',
          showCancel: false,
          confirmText: '确定',
          success: function (res) {
            wx.navigateBack()
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  del_pic:function(e){
    var index=e.currentTarget.dataset.index;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否要删除该图片？',
      success: function (res) {
        if (res.confirm) {
          that.data.pics.splice(index,1);
          that.setData({
            pics:that.data.pics
          })
        }
      }
    })
  },
  /**
   * 获取本地视频
   */
  getLocalVideo:function(){
    var that=this;
    var setting=this.data.setting;
    var max_size=setting.videosize*1024*1024;
    wx.chooseVideo({
      sourceType: ['album'],
      // camera: 'back',
      success(res) {
        console.log(res)
        if((res.duration>setting.videolong)||(res.size>max_size))
        {
          wx.showModal({
            title: '提示',
            confirmText:"重新上传",
            content: '视频素材大小应小于'+setting.videosize+"M,视频长度应小于"+setting.videolong+"秒",
            success: function (res) {
              if (res.confirm) {
                that.getLocalVideo();
              }
            }
          })
          return;
        }
        that.setData({
          video_url: res.tempFilePath
        })
      }
    })
  },
  /**
   * 添加图片到服务器
   */
  add_pic: function () {
    wx.navigateTo({
      url: '../fenleic/fenleic',
    })
  },
  /**
   * 选择分类
   */
  bindStarttimeChange: function (e) {
    console.log(e);
    var cur_fenlei = e.detail.value
    this.setData({
      cur_fenlei: cur_fenlei
    })
  },
  select_leixing:function(e){
    var status=e.currentTarget.dataset.status;
    this.setData({
      cur_leixing:status
    })
  },
  inite:function(){
    var that=this;
    var data = new Object();
    data.apiname = 'wenan_add_login';
    app.mlib.request({
      'model': 'wenan',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          fenlei:res.data.data.fenlei,
          setting:res.data.data.setting,
          uid:res.data.data.uid,
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
    var that = this;
    app.mlib.login(function (response) {
      that.inite();
    }, function () {
      wx.showToast({
        title: 'failed',
      })
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
    if(app.mlib.cur_select_hb!=null)
    {
      this.setData({
        cur_select_hb:app.mlib.cur_select_hb
      })
      app.mlib.cur_select_hb=null;
    }
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