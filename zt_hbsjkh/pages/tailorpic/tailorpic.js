const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    window_height_rpx:0,
    mb_pic_pos: [], 
    stv: {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotate: 0,
    },    
    scale:1,    
    img_url:'',
    container_size:[100,100],
    img_pos:[0,0,100,100],
    //触屏相关
    start_touch: 0,
    touch_start_pos: [0, 0],
    touch_status: 0,
    is_move: 0,
  },
  /**
   * 取消
   */
  go_back:function(){
    wx.navigateBack({
      
    })
  },
  /**
   * 确定
   */
  queding: function () {
    console.log('queding');
    var stv = this.data.stv;
    stv.offsetX = stv.offsetX / this.data.scale;
    stv.offsetY = stv.offsetY / this.data.scale;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    prevPage.finish_tailor(stv);
    wx.navigateBack({
      delta: 1
    })
  },
  inite_pos: function () {
    var muban_width = this.data.container_size[0];
    var muban_height = this.data.container_size[1];
    var max_width = 690;
    var max_heght = this.data.window_height_rpx - 320;
    console.log(muban_width / max_width);
    console.log(muban_height / max_heght);
    if ((muban_width / max_width) <= (muban_height / max_heght)) {
      this.data.mb_pic_pos[2] = max_heght * muban_width / muban_height;
      this.data.mb_pic_pos[3] = max_heght;
      this.data.mb_pic_pos[0] = (max_width - this.data.mb_pic_pos[2]) / 2;
      this.data.mb_pic_pos[1] = 0;
    }
    else {
      this.data.mb_pic_pos[0] = 0;
      this.data.mb_pic_pos[2] = max_width;
      this.data.mb_pic_pos[3] = max_width * muban_height / muban_width;
      this.data.mb_pic_pos[1] = (max_heght - this.data.mb_pic_pos[3]) / 2;
    }
    var scale = this.data.mb_pic_pos[2] / muban_width;
    //stv处理
    this.data.stv.offsetX = scale * this.data.stv.offsetX;
    this.data.stv.offsetY = scale * this.data.stv.offsetY;
    // this.data.stv.scale = scale * this.data.stv.scale;
    this.setData({
      mb_pic_pos: this.data.mb_pic_pos,
      scale: scale,
      stv: this.data.stv,
    })
    console.log(this.data.mb_pic_pos);
    console.log('缩放'+scale);
    console.log(this.data.img_pos[2] * scale);
    console.log(this.data.stv);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    if (app.mlib.tailor_img!=null)
    {
      this.data.stv = app.mlib.tailor_img.imgStv;
      this.data.container_size = [app.mlib.tailor_img.container[2], app.mlib.tailor_img.container[3]],
        this.data.img_url = app.mlib.tailor_img.img;
      //初始化图片位置
      this.data.img_pos = [0, 0, this.data.container_size[0], this.data.container_size[1]];
      this.setData({
        img_pos: this.data.img_pos,
        img_url: this.data.img_url,
      })
    }
    console.log(this.data.stv);
    console.log(this.data.container_size);
    console.log(this.data.img_pos);
    app.mlib.tailor_stv = null;
    app.mlib.cPos = [0, 0];
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var window_height_rpx = res.windowHeight * 750 / res.windowWidth;
        console.log(window_height_rpx);
        that.setData({
          rpx_to_px: res.windowWidth / 750,
          window_height_rpx: window_height_rpx
        })
        that.inite_pos();
      },
    })
  },
  /**
     * 触摸开始
     */
  touchstart: function (e) {
    console.log('触屏开始');
    console.log(e);
    //单点触摸
    if (e.touches.length == 1) {
      this.data.is_move = 0;
      this.data.touch_status = 0;
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
    }
    else//多点触摸
    {
      this.data.is_move = -1;
      this.data.touch_status = 1;
      var diff_x = e.touches[0].clientX - e.touches[1].clientX;
      var diff_y = e.touches[0].clientY - e.touches[1].clientY;
      let x = Math.pow(diff_x, 2)
      let y = Math.pow(diff_y, 2)
      this.data.start_distance = Math.sqrt(x + y);
      this.data.start_scale = this.data.stv.scale;
      this.data.start_angle = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI) - this.data.stv.rotate;
    }
  },
  /**
   * 触摸移动
   */
  touchmove: function (e) {
    //单点触摸
    if (this.data.touch_status == 0) 
    {
      var rpx_to_px = this.data.rpx_to_px;
      this.data.is_move = 1;
      var change_x = e.touches[0].pageX - this.data.touch_start_pos[0];
      var change_y = e.touches[0].pageY - this.data.touch_start_pos[1];
      this.data.stv.offsetX += change_x / rpx_to_px;
      this.data.stv.offsetY += change_y / rpx_to_px;
      this.setData({
        stv:this.data.stv
      })
      console.log(this.data.stv);
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
    }
    else//多点触摸
    {
      if (e.touches.length == 1) {
        return;
      }
      var diff_x = e.touches[0].clientX - e.touches[1].clientX;
      var diff_y = e.touches[0].clientY - e.touches[1].clientY;
      let x = Math.pow(diff_x, 2)
      let y = Math.pow(diff_y, 2)
      //缩放
      var dis = Math.sqrt(x + y);
      //旋转
      var angle = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      this.data.stv.scale = this.data.start_scale + this.data.start_scale * (dis - this.data.start_distance) / this.data.start_distance;
      if (Math.abs(this.data.stv.rotate - angle + this.data.start_angle) <= 90) {
        this.data.stv.rotate = angle - this.data.start_angle;
      }
      this.setData({
        stv: this.data.stv
      });
    }
  },
  /**
   * 触摸结束
   */
  touchend: function (e) {
    console.log('触摸结束');
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
  onShareAppMessage: app.mlib.fx_go_shouye
})