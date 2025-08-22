const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haibao_pic: [],
    cur_pic_id: 0,
    window_width: 0,
    window_height: 0,
    lang: app.lang,
    uid:0,
    appid:'',
  },
  copy:function(e){
    var content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
    })
  },
  /**
   * 轮播图改变事件
   */
  swiperChange: function (e) {
    console.log(e.detail.current);
    this.data.cur_pic_id = e.detail.current;
  },
  /**
   * 生成二维码
   */
  shengcheng: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'get';
    app.mlib.request({
      'model': 'erweima',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        const ctx = wx.createCanvasContext('canvas');
        var bg_path = that.data.haibao_pic[that.data.cur_pic_id];
        var erweima = res.data.data.d;
        wx.getImageInfo({
          src: bg_path,
          success(res) {
            bg_path = res.path;
            ctx.drawImage(bg_path, 0, 0, 486, 800, 0, 0, 486, 800);
            wx.getImageInfo({
              src: erweima,
              success(res) {
                erweima = res.path;
                ctx.drawImage(erweima, 380, 694, 100, 100);
                ctx.draw(false, function () {
                  console.log("绘制完成");
                  wx.canvasToTempFilePath({
                    canvasId: 'canvas',
                    success: function (res) {
                      console.log(res.tempFilePath)
                      wx.previewImage({
                        current: '', // 当前显示图片的http链接
                        urls: [res.tempFilePath] // 需要预览的图片http链接列表
                      })
                    }
                  })
                });
              },
              fail(res) {
                console.log('下载二维码失败');
                console.log(res);
              }
            })
          },
          fail(res) {
            console.log('下载背景图失败');
            console.log(that.data.haibao_pic[that.data.cur_pic_id]);
            console.log(res);
          }
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
      var data = new Object();
      data.apiname = 'haibao';
      app.mlib.request({
        'model': 'info',
        'data': data,
        'cachetime': '0',
        success(res) {
          console.log(res);
          that.setData({
            haibao_pic: res.data.data.haibao,
            uid:res.data.data.uid,
            appid:res.data.data.appid,
          })
        },
        fail(res) {
          console.log(res);
        }
      })
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
  onShareAppMessage: app.mlib.fx_go_shouye,
})