// component/ztimg/ztimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgsrc: {
      type: String,
      value: '',
      observer: function (newval, oldval) {
        this.initePic();
      }
    },
    pPos: {
      type: Array,
      value: [],
      observer: function (newval, oldval) {
        // if (this.data.has_inite != 1) {
        //   this.initePic();
        // }
      }
    },
    status: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        this.setData({
          status: newval
        })
      }
    },
    zindex: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
      }
    },
    toumingdu: {
      type: Number,
      value: 100,
      observer: function (newval, oldval) {
        console.log('透明度'+newval);
        var toumingdu=newval;
        this.setData({
          toumingdu:toumingdu
        })
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
    rpxTopx: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        this.setData({
          rpxTopx: newval
        })
      }
    },
    cStv: {
      type: Object,
      value: {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotate: 0,
      },
      observer: function (newval, oldval) {
        if (newval = null) {
          this.setData({
            cStv: this.properties.cStv
          })
        }
      }
    },
    imgStv: {
      type: Object,
      value: {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotate: 0,
      },
      observer: function (newval, oldval) {
        if (newval = null) {
          this.setData({
            imgStv: this.properties.imgStv
          })
        }
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    //固定尺寸，方便修改
    yuanhuan_pian:-6,
    ismoving:0,
    has_inite:0,
    pos_inited:[],
    originImg:null,
    cStv: {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotate: 0,
    },
    imgStv: {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotate: 0,
    },
    rpxTopx:1,
    //触屏相关
    type: 0,
    touch_start_pos: [0, 0],
    r:0,
    center_pos:[0,0],//初始化的
    cur_center_pos: [0, 0],//平移后的
    toumingdu:100
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart:function(e){
      var type = e.currentTarget.dataset.type;
      console.log('触摸类型'+type);
      this.data.type = type;
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
      if (type==0)//旋转
      {
        var center_pos = [];
        center_pos[0] = this.data.center_pos[0] + this.data.cStv.offsetX;
        center_pos[1] = this.data.center_pos[1] + this.data.cStv.offsetY;
        this.data.cur_center_pos = center_pos;
        //计算起始角度
        var rpx_to_px = this.data.rpxTopx;
        var diff_x = e.touches[0].pageX / rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].pageY / rpx_to_px - center_pos[1];
        console.log(e.touches[0].pageX / rpx_to_px);
        console.log(diff_x);
        console.log(diff_y);
        let x = Math.pow(diff_x, 2)
        let y = Math.pow(diff_y, 2)
        var dis = Math.sqrt(x + y);
        if (diff_y >= 0) {
          this.data.start_angle = 360 * Math.asin(diff_x / dis) / (2 * Math.PI) + this.data.cStv.rotate;
        }
        else if (diff_x >= 0) {
          this.data.start_angle = 360 * Math.acos(diff_y / dis) / (2 * Math.PI) + this.data.cStv.rotate;
        }
        else {
          this.data.start_angle = 180 - 180 * Math.asin(diff_x / dis)/Math.PI + this.data.cStv.rotate;
        }
      }
      else if(type==3)
      {
        var center_pos = [];
        center_pos[0] = this.data.center_pos[0] + this.data.cStv.offsetX;
        center_pos[1] = this.data.center_pos[1] + this.data.cStv.offsetY;
        this.data.cur_center_pos = center_pos;
        var rpx_to_px=this.data.rpxTopx;
        var diff_x = e.touches[0].clientX/rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].clientY/rpx_to_px - center_pos[1];
        let x = Math.pow(diff_x, 2)
        let y = Math.pow(diff_y, 2)
        this.data.start_distance = Math.sqrt(x + y);
        this.data.start_scale = this.data.cStv.scale;  
      }
    },
    touchmove:function(e){
      var type = e.currentTarget.dataset.type;
      console.log('滑动类型'+type);
      if(type==0)
      {
        var center_pos = this.data.cur_center_pos;
        var rpx_to_px=this.data.rpxTopx;
        var diff_x = e.touches[0].pageX / rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].pageY / rpx_to_px - center_pos[1];
        let x = Math.pow(diff_x, 2)
        let y = Math.pow(diff_y, 2)
        var dis = Math.sqrt(x + y);
        if (diff_y>=0)
        {
          var angle = 180 * Math.asin(diff_x / dis) / Math.PI;
        }
        else if (diff_x>=0)
        {
          var angle = 180 * Math.acos(diff_y / dis) / Math.PI;
        }
        else
        {
          var angle =180- 180 * Math.asin(diff_x / dis) / Math.PI;
        }
        var rotate=this.data.start_angle - angle;
        var xifu_jindu=5;
        if((rotate>(0-xifu_jindu))&&(rotate<(0+xifu_jindu)))
        {
          console.log('吸附');
          rotate=0
        }
        else if(((rotate>(-90-xifu_jindu)))&&(rotate<(-90+xifu_jindu)))
        {
          console.log('吸附');
          rotate=-90
        }
        else if(((rotate>(-180-xifu_jindu)))&&(rotate<(-180+xifu_jindu)))
        {
          console.log('吸附');
          rotate=-180
        }
        else if(((rotate>(-270)))&&(rotate<(-270+xifu_jindu)))
        {
          console.log('吸附');
          rotate=-270
        }
        else if(((rotate>(90-xifu_jindu)))&&(rotate<(90)))
        {
          console.log('吸附');
          rotate=90
        }
        this.data.cStv.rotate = rotate
        this.setData({
          cStv:this.data.cStv
        })
        this.data.touch_start_pos[0] = e.touches[0].pageX;
        this.data.touch_start_pos[1] = e.touches[0].pageY;
      }
      else if(type==3)
      {
        var center_pos = this.data.cur_center_pos;
        var rpx_to_px=this.data.rpxTopx;
        var diff_x = e.touches[0].clientX/ rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].clientY/ rpx_to_px - center_pos[1];
        let x = Math.pow(diff_x, 2)
        let y = Math.pow(diff_y, 2)
        var cur_distance = Math.sqrt(x + y);
        console.log(cur_distance);
        console.log(this.data.start_distance);
        this.data.cStv.scale=this.data.start_scale*(cur_distance)/this.data.start_distance;
        console.log(this.data.cStv.scale);
        this.setData({
          cStv:this.data.cStv
        })
      }
    },
    /**
     * 触屏结束
     */
    touchend:function(e){
      console.log('触屏结束');
      this.triggerEvent("stvChanged",this.data.cStv);
    },
    /**
     * 选中编辑
     */
    selected:function(){
      if(this.data.status==0)
      {
        this.setData({
          status: 1,
        })
        this.triggerEvent("focus");
      }
      else
      {
        this.triggerEvent("showedit");
      }
    },
    go_down:function(){
      this.triggerEvent("down");
    },
    go_up:function(){
      this.triggerEvent("up");
    },
    /**
     * 初始化大小位置
     */
    inite_pos: function (res) {
      var pic_width = res.width;
      var pic_height = res.height;
      var max_width = this.properties.pPos[2]/2;
      var max_heght = this.properties.pPos[3]/2;
      var pos_inited=[];
      if ((pic_width / max_width) <= (pic_height / max_heght)) {
        pos_inited[2] = max_heght * pic_width / pic_height;
        pos_inited[3] = max_heght;
        pos_inited[0] = (max_width - pos_inited[2]) / 2 + max_width / 2;
        pos_inited[1] = max_heght/2;
      }
      else {
        pos_inited[0] = max_width / 2;
        pos_inited[2] = max_width;
        pos_inited[3] = max_width * pic_height / pic_width;
        pos_inited[1] = (max_heght - pos_inited[3]) / 2 + max_heght / 2;
      }
      //计算中心点
      var center_pos = [];
      center_pos[0] = 375;
      center_pos[1] = 120 + max_heght;
      this.setData({
        pos_inited: pos_inited,
        center_pos: center_pos
      })
      this.triggerEvent("posInited", pos_inited);
      wx.hideLoading();
    },
    /**
     * 初始化图片
     */
    initePic: function () {
      var path = this.properties.imgsrc;
      if ((this.properties.imgsrc == '') || (this.properties.pPos.length == 0))
      {
        return;
      }
      wx.showLoading({
        title: '初始化中',
      });
      console.log('初始化图片');
      var that = this;
      wx.getImageInfo({
        src: path,
        success(res) {
          that.data.originImg = res;
          console.log(res);
          that.setData({
            originImg: that.data.originImg,
            has_inite:1,
          })
          that.inite_pos(res);
        },
        fail:function(res){
          that.triggerEvent("del");
        },
      })
    },

  }
})
