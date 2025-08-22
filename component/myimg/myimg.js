const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgsrc: {
      type: String,
      value: '',
      observer: function (newval, oldval) {
        if ((newval != oldval) && (this.data.hasinite!=0))
        {
          console.log('强制刷新');
          this.data.need_refresh=1;
        }
        this.initePic(newval);
      }
    },
    imgid: {
      type: String,
      value: ''
    },
    stv: {
      type: Object,
      value: {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotate: 0,
      },
      observer: function (newval, oldval) {
        if (newval==null)
        {
          this.properties.stv = {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            rotate: 0,
          };
        }
        if(this.data.hasinite==1)
        {
        }        
      }
    },
    width: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 0
    }, 
    isfocus: {
      type: Number,
      value: 1,
    },
    s: {
      type: Number,
      value: 1,
      observer: function (newval, oldval) {
        console.log('设置缩放比例'+newval);
      }
    },
    ismoving: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        this.setData({
          ismoving: newval
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    stv: {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotate: 0,
    },
    //图片原始宽高
    originImg: {
      width: 0,
      height: 0,
      path: ''
    },
    need_refresh:0,
    hasinite:0,
    fuhe:1,//是否符合要求的像素比例
    ismoving:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    del: function () {
      console.log('想要添加图片');
      this.triggerEvent("add",this.properties.imgid);
    },
    want_focus: function () {
      console.log('获取焦点');
      this.triggerEvent("focus");
    },
    want_add: function () {
      this.triggerEvent("add",this.properties.imgid);
    },
    /**
     * 裁边
     */
    caibian: function () {
      console.log('裁边');
      this.setData({
        stv: {
          offsetX: 0,
          offsetY: 0,
          scale: 1,
          rotate: 0,
        }
      })
      var res = this.data.originImg;
      this.data.stv.scale = this.properties.height / res.height;
      console.log(this.properties.height);
      if (res.width * this.data.stv.scale < this.properties.width) {
        console.log(this.properties.width);
        this.data.stv.scale = this.properties.width / res.width;
      }
      this.data.stv.offsetX = (res.width * this.data.stv.scale - res.width) / 2;
      this.data.stv.offsetY = (res.height * this.data.stv.scale - res.height) / 2;
      this.setData({
        stv: this.data.stv,
      })
      var event = new Object();
      event.stv = this.data.stv;
      event.imgid = this.properties.imgid;
      this.triggerEvent("caibian", event)
    },
    /**
     * 初始化图片
     */
    initePic: function (path) {
      if (path == '') {
        console.log('图片路径为空');
        return false;
      }
      var that = this;
      this.data.hasinite=1;
      wx.getImageInfo({
        src: path,
        success(res) {
          console.log('获取图片信息');
          wx.hideLoading();
          var temp_pic=new Object();
          temp_pic.url=path;
          temp_pic.res=res;
          that.data.originImg = res;
          //小程序，最开始不是/开头，会转换路径
          if (that.data.originImg.path.indexOf('pages/') != -1) {
            that.data.originImg.path = '/' + that.data.originImg.path;
          }
          that.setData({
            originImg: that.data.originImg
          })
          that.data.stv = {
            offsetX: that.properties.stv.offsetX,
            offsetY: that.properties.stv.offsetY,
            scale: that.properties.stv.scale,
            rotate: that.properties.stv.rotate,
          }
          that.setData({
            stv: that.data.stv
          })
          if ((that.properties.stv.offsetX == 0) && (that.properties.stv.offsetY == 0) && (that.properties.stv.scale == 1)) {
            that.caibian();
          }
          else 
          {
            if (that.data.need_refresh==1)
            {
              console.log('!!!!!!!!!!!!强制裁边');
              that.caibian();
              that.data.need_refresh=0;
            }
            else//载入的作品
            {
              console.log('载入作品***********' + that.properties.s);
              var s = that.properties.s;
              that.data.stv.offsetX = that.data.stv.offsetX * s + that.data.originImg.width * (s - 1) / 2;
              that.data.stv.offsetY = that.data.stv.offsetY * s + that.data.originImg.height * (s - 1) / 2;
              that.data.stv.scale = that.data.stv.scale * s;
              that.setData({
                stv: that.data.stv
              })
              var event = new Object();
              event.stv = that.data.stv;
              event.imgid = that.properties.imgid;
              that.triggerEvent("caibian", event)
            }
            //that.caibian();
          }
        }
      })
    },

  }
})
