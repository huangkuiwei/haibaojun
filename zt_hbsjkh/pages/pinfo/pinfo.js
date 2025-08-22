const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:null,
    tx_has_changed:0,
    logo_has_changed:0,
  },
  /**
   * 返回
   */
  go_back:function(){
    wx.navigateBack({
      
    })
  },
  /**
   * 支付
   */
  tijiao: function (e) {
    var formdata = e.detail.value;
    var member=this.data.member;
    var pic=[];
    var that = this;
    if(this.data.tx_has_changed==1)//二维码需要重新上传
    {
      var file_logo = member.uid + '_' + Date.parse(new Date()) + '_0' + '.' + app.mlib.suffix(member.erweima);
      pic.push([member.erweima, file_logo]);
      formdata.erweima = file_logo;
    }
    if(this.data.logo_has_changed==1)//logo需要重新上传
    {
      var file_logo = member.uid + '_' + Date.parse(new Date()) + '_1' + '.' + app.mlib.suffix(member.logo);
      pic.push([member.logo, file_logo]);
      formdata.logo = file_logo;
    }
    if(pic.length>0)
    {
      wx.showLoading({
        title: '上传中',
      })
      app.mlib.upLoads('/images/info/', pic, null, function (res) {
        console.log('上传成功');
        that._tijiao(formdata);
      });
    }
    else
    {
      formdata.erweima = this.data.member.erweima;
      this._tijiao(formdata);
    }
  },
  _tijiao:function(data){
    var that = this;
    data.apiname = 'editinfo';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if(res.data.data.r==1)
        {
          wx.showToast({
            title: '编辑成功',
          })
        }
        else
        {
          wx.showToast({
            title: '编辑失败',
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  change_tx:function(){
    var that=this;
    wx.chooseImage({
      count: 1,
      success:function(res){
        console.log(res)
        that.data.member.erweima=res.tempFilePaths[0];
        that.setData({
          tx_has_changed:1,
          member:that.data.member
        })
      }
    })
  },
  change_logo:function(){
    var that=this;
    wx.chooseImage({
      count: 1,
      success:function(res){
        console.log(res)
        that.data.member.logo=res.tempFilePaths[0];
        that.setData({
          logo_has_changed:1,
          member:that.data.member
        })
      }
    })
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'info';
    app.mlib.request({
      'model': 'user',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          member:res.data.data.member,
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
  onShareAppMessage: app.mlib.fx_go_shouye
})