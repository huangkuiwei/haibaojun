// zt_hbsjkh/pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    
    avatarUrl2:'',
    nickname:'',
},
onInput(e){
    let value = e.detail.value
    this.setData({
        nickname:value,
      })
},
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    console.log(avatarUrl)
    this.arrayBufferToBase64(avatarUrl);
    
  },
  
  arrayBufferToBase64: function(url) {
      let that = this;
    wx.getFileSystemManager().readFile({
        filePath: url, // 选择图片返回的临时文件路径
        encoding: 'base64', // 编码格式
        success (res) {
            const imgBase64 = 'data:image/jpeg;base64,' + res.data;
            console.log('Base64 String:', imgBase64);
            that.setData({
                avatarUrl:imgBase64,
                avatarUrl2:imgBase64,
              })
             
            // 您现在可以使用imgBase64字符串进行进一步操作
        },
        fail (err) {
            console.error('读取文件失败', err);
        }
        
    });
  },
  loginSbumit(){
      let a = this;
      app.mlib.login(
        function (response) {
          console.log(11111);
          console.log(response.memberInfo.uid);
       
        a.edituser(response.memberInfo.uid);
        // that.inite();
        
      });
    
  },
  edituser(uid){
      let a = this;
    getApp().util.request({
        'url': 'entry/wxapp/edituser',
        data: {
         avatarUrl: a.data.avatarUrl2,
         nickname: a.data.nickname,
         uid:uid,
        //  openid: a.data.userInfo.memberInfo.openid,
        //  res:res,
        },
        'cachetime': '0',
        success(t) {
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1,
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad(); // 刷新数据
            }
          });
          
          // 返回上一页面
        //   wx.navigateBack({
        //     delta: 1 // 返回的页面数，如果需要返回上一页，delta 设为 1
        //   });
        }
      })
  },

  getuser(uid){
    let that = this;
    getApp().util.request({
      'url': 'entry/wxapp/getuser',
      data: {
       uid:uid,
      },
      'cachetime': '0',
      success(t) {
        // console.log(t.data.data.row);
        let row = t.data.data.row;
        that.setData({
          avatarUrl:row.avatar,
          avatarUrl2:row.avatar,
          nickname:row.nickname,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    app.mlib.login(
      function (response) {
        // console.log(11111);
        // console.log(response.memberInfo);
        that.getuser(response.memberInfo.uid);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})