// component/ztimg/ztimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    txt: {
      type: String,
      value: null,
      observer: function (newval, oldval) {
        console.log('旧文字'+oldval);
        var that = this;
        this.setData({
          txt: newval
        },function(){
          console.log('文字改变'+oldval);
          that.inite();
        })        
      }
    },
    font: {
      type: String,
      value: '',
      observer: function (newval, oldval) {
        this.setData({
          font: newval
        })
      }
    },
    color: {
      type: String,
      value: '',
      observer: function (newval, oldval) {
        this.setData({
          color: newval
        })
      }
    },
    toumingdu: {
      type: Number,
      value: 1,
      observer: function (newval, oldval) {
        var toumingdu=newval;
        this.setData({
          toumingdu:toumingdu
        })
      }
    },
    //对齐方式
    duiqi: {
      type: String,
      value: 'left',
      observer: function (newval, oldval) {
        this.setData({
          duiqi: newval,
        })
      }
    },
    zindex: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
      }
    },
    yushe: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
      }
    },
    hasninitefont: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        if((this.properties.yushe==1)&&(newval==1))
        {
          this.inite_yushe();
          this.properties.yushe=0;
        }
      }
    },
    pPos: {
      type: Array,
      value: [],
      observer: function (newval, oldval) {
      }
    },
    container: {
      type: Array,
      value: [],
      observer: function (newval, oldval) {
        console.log('设置container');
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
    ismoving: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        this.setData({
          ismoving: newval
        })
      }
    },
    lineheight: {
      type: Number,
      value: 40,
      observer: function (newval, oldval) {
        console.log('设置行间距为'+newval);
        this.setData({
          line_height: newval
        })
      }
    },
    letterspacing: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        console.log('设置字间距为'+newval);
        this.setData({
          letterspacing: newval
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
    weight: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        this.setData({
          weight: newval
        })
      }
    },
    direction: {
      type: Number,
      value: -1,
      observer: function (newval, oldval) {
        var that=this;
        this.setData({
          direction: newval
        },function(){
          if(oldval!=-1)
          {
            console.log('方向改变'+oldval);
            that.inite();
          }
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
  },
  /**
   * 组件的初始数据
   */
  data: {
    line_height:40,//
    letterspacing:0,
    weight:0,//0不加粗，1加粗
    direction:0,//0横版，1竖版
    line_num:1,
    ismoving:0,
    txt:'',
    color:'',
    font:'',
    duiqi:'',
    status:0,
    //固定尺寸，方便修改
    yuanhuan_pian: -6,
    pos_inited: [],
    originImg: null,
    cStv: {
      offsetX: 0,
      offsetY: 0,
      scale: 3,
      rotate: 0,
    },
    rpxTopx: 1,
    //触屏相关
    type: 0,
    touch_start_pos: [0, 0],
    r: 0,
    center_pos: [0, 0],//初始化的
    cur_center_pos: [0, 0],//平移后的
    start_pos: [0, 0],//起始坐标
    has_inite:0,
    toumingdu:100
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 删除元素
     */
    del:function(){
      this.triggerEvent("del");
    },
    inite_yushe:function(){
      console.log('初始化预设文字');
      var txt_arr=this.data.txt.split('\n');
      var line_num=0;
      for(var i=0;i<txt_arr.length;++i)
      {
        if((txt_arr[i]=='')&&(i==(txt_arr.length-1)))
        {
          continue;
        }
        line_num++;
      }
      var width=10*1+line_num*this.data.line_height;
      this.setData({
        line_num:line_num
      })
      var that=this;
      var max_width = that.properties.pPos[2];
      var max_heght = that.properties.pPos[3];
      this.properties.yushe=0;
      var temp_container=this.properties.container;
      console.log('##########查询坐标');
      //创建节点选择器
      var query = this.createSelectorQuery();
      //选择id
      query.select('#myText2').boundingClientRect()
      query.exec(function (res) {
        //res就是 所有标签为myText的元素的信息 的数组
        console.log('查询到文字坐标');
        console.log(res);
        that.data.has_inite=1;
        //取高度
        if(that.data.direction==0)
        {
          var txt_height = line_num*that.data.line_height;
        }
        else
        {
          var txt_height = res[0].height / that.data.rpxTopx;
        }        
        var txt_width = res[0].width / that.data.rpxTopx;
        console.log('文字宽度'+txt_width);
        console.log('rpx'+that.data.rpxTopx);
        console.log('文字高度'+res[0].height / that.data.rpxTopx);
        var center_pos = [];
        center_pos[0] = 375;
        center_pos[1] = 120 + max_heght / 2;
        that.data.pos_inited[0] = (max_width - txt_width) / 2;
        that.data.pos_inited[1] = (max_heght - txt_height) / 2;
        that.data.pos_inited[2] = txt_width;
        that.data.pos_inited[3] = txt_height;
        that.setData({
          center_pos: center_pos,
          pos_inited: that.data.pos_inited,
        })
        console.log(that.data.pos_inited);
        that.triggerEvent("posInited", that.data.pos_inited);
        that.triggerEvent("centerInited",center_pos);
        console.log(that.data.cStv.offsetX);
        that.data.cStv.offsetX=that.data.cStv.offsetX+(that.data.pos_inited[2]-temp_container[2])*that.data.cStv.scale/2;
        that.data.cStv.offsetY=that.data.cStv.offsetY+(that.data.pos_inited[3]-temp_container[3])*that.data.cStv.scale/2;
        console.log(that.data.cStv.offsetX);
        that.setData({
          cStv:that.data.cStv
        })
        that.triggerEvent("stvChanged", that.data.cStv);
      })
    },
    /**
     * 初始化图片
     */
    inite: function () {
      console.log('$$$$初始化文字'+this.data.txt);
      var txt_arr=this.data.txt.split('\n');
      var line_num=0;
      for(var i=0;i<txt_arr.length;++i)
      {
        if((txt_arr[i]=='')&&(i==(txt_arr.length-1)))
        {
          continue;
        }
        line_num++;
      }
      var width=10*1+line_num*this.data.line_height;
      this.setData({
        line_num:line_num
      })
      var that=this;
      var max_width = that.properties.pPos[2];
      var max_heght = that.properties.pPos[3];
      if(this.properties.yushe==1)//修改预设的文字
      {
      }
      if((this.data.has_inite==0)&&(this.properties.container[2]!=0))//作品载入
      {
        console.log('##########载入作品');
        that.data.has_inite=1;
        var center_pos = [];
        center_pos[0] = 375;
        center_pos[1] = 120 + max_heght / 2;
        that.data.pos_inited[0] = (max_width - this.properties.container[2]) / 2;
        that.data.pos_inited[1] = (max_heght - this.properties.container[3]) / 2;
        that.data.pos_inited[2] = this.properties.container[2];
        that.data.pos_inited[3] = this.properties.container[3];
        console.log(that.data.pos_inited);
        that.setData({
          center_pos: center_pos,
          pos_inited: that.data.pos_inited,
        })
        // that.triggerEvent("posInited", that.data.pos_inited);
        that.triggerEvent("centerInited",center_pos);
      }
      else
      {
        console.log('##########查询坐标');
        //创建节点选择器
        var query = this.createSelectorQuery();
        //选择id
        query.select('#myText2').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为myText的元素的信息 的数组
          console.log('查询到文字坐标');
          console.log(res);
          that.data.has_inite=1;
          //取高度
          if(that.data.direction==0)
          {
            var txt_height = line_num*that.data.line_height;
          }
          else
          {
            var txt_height = res[0].height / that.data.rpxTopx;
          }        
          var txt_width = res[0].width / that.data.rpxTopx;
          console.log('文字宽度'+txt_width);
          console.log('rpx'+that.data.rpxTopx);
          console.log('文字高度'+res[0].height / that.data.rpxTopx);
          var center_pos = [];
          center_pos[0] = 375;
          center_pos[1] = 120 + max_heght / 2;
          that.data.pos_inited[0] = (max_width - txt_width) / 2;
          that.data.pos_inited[1] = (max_heght - txt_height) / 2;
          that.data.pos_inited[2] = txt_width;
          that.data.pos_inited[3] = txt_height;
          that.setData({
            center_pos: center_pos,
            pos_inited: that.data.pos_inited,
          })
          console.log(that.data.pos_inited);
          that.triggerEvent("posInited", that.data.pos_inited);
          that.triggerEvent("centerInited",center_pos);
        })
      }      
    },
    touchstart: function (e) {
      var type = e.currentTarget.dataset.type;
      console.log("滑动类型" + type);
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
      if (type == 0)//旋转
      {
        var center_pos = [];
        center_pos[0] = this.data.center_pos[0] + this.data.cStv.offsetX;
        center_pos[1] = this.data.center_pos[1] + this.data.cStv.offsetY;
        this.data.cur_center_pos = center_pos;
        //计算起始角度
        var rpx_to_px = this.data.rpxTopx;
        var diff_x = e.touches[0].pageX / rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].pageY / rpx_to_px - center_pos[1];
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
          this.data.start_angle = 180 - 180 * Math.asin(diff_x / dis) / Math.PI + this.data.cStv.rotate;
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
      else if (type == 2){
        this.data.start_pos = [e.touches[0].pageX, e.touches[0].pageY];
        this.data.startwidth = this.data.pos_inited[2];
        this.data.startoffsetX = this.data.cStv.offsetX;
        this.data.startoffsetY = this.data.cStv.offsetY;
        this.data.startX = this.data.pos_inited[0];
        this.data.startY = this.data.pos_inited[1];
        this.data.angle_cos = Math.cos(this.data.cStv.rotate * Math.PI / 180);
        this.data.angle_sin = Math.sin(this.data.cStv.rotate * Math.PI / 180);
      }
    },
    /**
     * 开始滑动
     */
    touchmove: function (e) {
      var type = e.currentTarget.dataset.type;
      if (type == 0) {
        var center_pos = this.data.cur_center_pos;
        var rpx_to_px = this.data.rpxTopx;
        var diff_x = e.touches[0].pageX / rpx_to_px - center_pos[0];
        var diff_y = e.touches[0].pageY / rpx_to_px - center_pos[1];
        let x = Math.pow(diff_x, 2)
        let y = Math.pow(diff_y, 2)
        var dis = Math.sqrt(x + y);
        if (diff_y >= 0) {
          var angle = 180 * Math.asin(diff_x / dis) / Math.PI;
        }
        else if (diff_x >= 0) {
          var angle = 180 * Math.acos(diff_y / dis) / Math.PI;
        }
        else {
          var angle = 180 - 180 * Math.asin(diff_x / dis) / Math.PI;
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
          cStv: this.data.cStv
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
        this.data.cStv.scale=this.data.start_scale*(cur_distance)/this.data.start_distance;
        this.setData({
          cStv:this.data.cStv
        })
      }
    },
    /**
     * 触屏结束
     */
    touchend: function (e) {
      var type = e.currentTarget.dataset.type;
      if ((type==0)||(type==3))
      {
        this.triggerEvent("stvChanged", this.data.cStv);
      }   
    },
    /**
     * 选中编辑
     */
    selected: function () {
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
    change_pos:function(){

    },
  }
})
