const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_status:0,//0初始状态，1显示结果，2显示文字编辑，3显示所有系统图片,4更改字体,5更改文字颜色,6更改对齐方式，7样式选择,8显示修改图片,9修改透明度
    id:71,
    btn_status:[-1,-1],//-1初始界面,0展示添加/换图，1编辑图片,2展示编辑文字
    has_shoucang:0,//该模板是否已经收藏,
    edit_pics_status:1,//0系统图片，1我的图片
    shoucang_handling:0,
    muban_info:null,
    window_height_rpx:0,
    rpx_to_px:1,
    mb_pic_pos:[],//模板底图位置
    moren_pics:[],//系统图
    mpics:[],//我的图片
    cur_selected_xtpics:0,
    element:[],//添加的元素
    initELement:[],//添加的元素
    historyElement: [],
    cur_txt:'',//当前编辑中的文字
    loading_ziti:0,
    colors: [],
    user_info:null,
    all_ziti:[],
    zuopinid:0,
    zuopin_info:null,
    use_font_num:0,
    //触屏相关
    touch_start_pos: [0, 0],
    touch_status: 0,
    is_move:0,    
    pid:0,
    all_xtpics:null,
    cur_xtpics_index:0,
    //是否正在移动元素
    ismoving:0,
    cur_mypic_page:1,
    version:0,
    videoAd:null,
    jili:null,
    has_goumai:0,
    imgshuiyin:'',
    dzsetting:null,
    max_lineheight:100,
    min_lineheight:40,
    yonghu_pics: [],
    stv_yonghu_pics: [],
    bili:1,
    member:null,
    zuopin_has_inite:0,
    gettel:0,
    koutusetting:null,
    can_koutu:0,//是否可以扣人像图
    can_kouhead:0,//是否可以扣头像
    koutu_type:-1,
    myfunc:null,//看完广告执行的函数
    yonghu_can_koutu:[],
    yonghu_can_kouhead:[],
    wenanid:0,
  },

  quash: function () {
    let element = this.data.historyElement.pop()

    this.setData({
      element: element
    })
  },

  reset: function () {
    this.setData({
      element: JSON.parse(JSON.stringify(this.data.initELement))
    })
  },

  go_wenan:function(){
    wx.navigateTo({
      url: '../hbwenan/hbwenan?hbid='+this.data.id,
    })
  },
  onUser: function (t) {
    console.log(this.data.member)
    if ( !this.data.member.tel) return wx.navigateTo({
      url: "../authorization/authorization",
      success: function (t) {},
      fail: function (t) {},
      complete: function (t) {}
    }), !1
  },
  _yonghu_koutu:function(){
    var url=this.data.yonghu_pics[this.data.btn_status[1]];
    var that=this;
    app.imgfunc.koutu(url,function(url){
      that.data.yonghu_pics[that.data.btn_status[1]]=url;
      that.setData({
        yonghu_pics:that.data.yonghu_pics,
      })
      that.inite_cankoutu();
    });
  },
  _yonghu_kouhead:function(){
    var url=this.data.yonghu_pics[this.data.btn_status[1]];
    var that=this;
    app.imgfunc.kouhead(url,function(url){
      that.data.yonghu_pics[that.data.btn_status[1]]=url;
      that.setData({
        yonghu_pics:that.data.yonghu_pics,
      })
      that.inite_cankoutu();
    });
  },
  change_yhpic:function(){
    this.setData({
      show_status:8,
    })
  },
  kouhead:function(e){
    var type = e.currentTarget.dataset.type;
    if(type==0)
    {
      this.data.myfunc=this._kouhead;
    }
    else
    {
      this.data.myfunc=this._yonghu_kouhead;
    }
    if(this.data.can_kouhead==1)//直接抠图
    {
      this.data.myfunc();
    }
    else if(this.data.can_kouhead==2)//广告抠图
    {
      this.data.koutu_type=type;
      this.show_ad();
    }
  },
  _kouhead:function(e){
    var url=this.data.element[this.data.btn_status[1]].img;
    var that=this;
    app.imgfunc.kouhead(url,function(url){
      that.data.element[that.data.btn_status[1]].img=url;
      that.data.historyElement.push(JSON.parse(JSON.stringify(that.data.element)))
      that.setData({
        element:that.data.element
      })
      that.inite_cankoutu();
    });
  },
  koutu:function(e){
    var type = e.currentTarget.dataset.type;
    if(type==0)
    {
      this.data.myfunc=this._koutu;
    }
    else
    {
      this.data.myfunc=this._yonghu_koutu;
    }
    if(this.data.can_koutu==1)//直接抠图
    {
      this.data.myfunc();
    }
    else if(this.data.can_koutu==2)//广告抠图
    {
      this.data.koutu_type=type;
      this.show_ad();
    }
  },
  _koutu:function(){
    var url=this.data.element[this.data.btn_status[1]].img;
    var that=this;
    app.imgfunc.koutu(url,function(url){
      that.data.element[that.data.btn_status[1]].img=url;
      that.data.historyElement.push(JSON.parse(JSON.stringify(that.data.element)))
      that.setData({
        element:that.data.element
      })
      that.inite_cankoutu();
    });
  },
  inite_cankoutu:function(){
    console.log('初始化是否可以抠图');
    var yonghu_pics=this.data.yonghu_pics;
    console.log(yonghu_pics);
    var yonghu_can_koutu=[];
    var yonghu_can_kouhead=[];
    for(var i=0;i<yonghu_pics.length;++i)
    {
      if(yonghu_pics[i].indexOf("/images/mypics") == -1)
      {
        yonghu_can_koutu.push(0);
      }
      else
      {
        yonghu_can_koutu.push(1);
      }
      if((yonghu_pics[i].indexOf("/images/mypics") == -1)&&(yonghu_pics[i].indexOf("/images/koutu/") == -1))
      {
        yonghu_can_kouhead.push(0);
      }
      else
      {
        yonghu_can_kouhead.push(1);
      }
    }
    var element=this.data.element;
    for(var i=0;i<element.length;++i)
    {
      if(element[i].type==0)//图片
      {
        if(element[i].img.indexOf("/images/mypics") == -1)
        {
          element[i].cankoutu=0;
        }
        else
        {
          element[i].cankoutu=1;
        }
        if((element[i].img.indexOf("/images/mypics") == -1)&&(element[i].img.indexOf("/images/koutu/") == -1))
        {
          element[i].cankouhead=0;
        }
        else
        {
          element[i].cankouhead=1;
        }
      }
    }
    console.log(element);
    this.setData({
      yonghu_can_koutu:yonghu_can_koutu,
      element:element,
      yonghu_can_kouhead:yonghu_can_kouhead
    })
  },
  msgSecCheck:function(cb,failed){
    var msg='';
    var element=this.data.element;
    for(var i=0;i<element.length;++i)
    {
      if((element[i].hasdel==0)&&(element[i].type==1))
      {
        var temp=element[i].txt;
        temp=temp.replace("\n",'。');
        msg+=temp;
      }
    }
    console.log(msg);
    var that = this;
    var data = new Object();
    data.apiname = 'msgSecCheck';
    data.msg=msg;
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if(res.data.data.r==0)
        {
        }
        else
        {
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  refresh_txt:function(index){
    console.log('refresh_txt');
    var id="#element"+index;
    var ele=this.selectComponent(id);
    if(ele!=null)
    {
      ele.inite();
    }
  },
  getPhoneNumber (e) {
    console.log('获取手机号结果');
    console.log(e);
    if((e.detail.iv==undefined)||(e.detail.iv==null)||(e.detail.iv==''))
    {
      wx.showToast({
        title: '登录失败',
        icon:'none'
      })
      return;
    }
    var that = this;
    var data = new Object();
    data.iv=e.detail.iv;
    data.encryptedData=e.detail.encryptedData;
    app.mlib.login(function (response) {
      data.apiname = 'phonenum';
      app.mlib.request({
        'model': 'user',
        'data': data,
        'cachetime': '0',
        success(res) {
          console.log(res);
          if(res.data.data.r==0)
          {
            wx.showToast({
              title: res.data.data.msg,
              icon:'none',
            })
          }
          else
          {
            that.data.member.realtel=res.data.data.d;
            that.setData({
              member:that.data.member
            })
            that.tijiao();
          }
        },
        fail(res) {
          console.log(res);
        }
      })
      that.setData({
        has_shouquan: 1
      });
    });
  },
  /**
   * 前往对齐选择界面
   */
  go_select_toumingdu:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:7,
    })
  },
  go_toumingdu:function(){
    if(this.data.show_status==9)
    {
      this.setData({
        show_status:0,
      })
    }
    else
    {
      this.setData({
        show_status:9,
      })
    }
  },
  /**
   * 更改透明度
   */
  change_toumingdu:function(e){
    var toumingdu = e.detail.value;
    if(this.data.element[this.data.btn_status[1]].toumingdu==toumingdu)
    {
      return;
    }
    if(this.data.slider_change_start==0)
    {
      this.data.slider_change_start=1;
      this.data.cur_toumingdu=this.data.element[this.data.btn_status[1]].toumingdu;
    }
    this.data.element[this.data.btn_status[1]].toumingdu = toumingdu;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 透明度调整结束
   */
  end_change_toumingdu:function(e){
    console.log('调整透明度结束');
    console.log(e);
    this.data.slider_change_start=0;
  },
  change_element_mode:function(e){
    console.log(e);
    var model=e.target.dataset.model;
    console.log(e.target.dataset);
    console.log(model);
    this.data.element[this.data.btn_status[1]].model=model;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element:this.data.element
    })
  },
  onCaibian: function (res) {
    console.log('裁边信号');
    console.log(res.detail);
    var index = res.detail.imgid.split(":");
    this.data.stv_yonghu_pics[index[1]] = res.detail.stv
    this.setData({
      stv_yonghu_pics:this.data.stv_yonghu_pics,
    })
  },
  add_download_cishu:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'jili';
    app.mlib.request({
      'model': 'fenxiao',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.data.user_info.left=that.data.user_info.left*1+that.data.jili.cishu*1;
        that.setData({
          user_info:that.data.user_info,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  wana_show_ad:function(){
    this.data.myfunc=null;
    this.show_ad();
  },
  show_ad:function(){
    console.log('展示广告');
    var videoAd=this.data.videoAd;
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
    else
    {
      console.log('展示广告失败，广告未初始化');
    }
  },
  inite_ad:function(){
    console.log('初始化广告');
    var that=this;
    if (wx.createRewardedVideoAd) {
      var videoAd = wx.createRewardedVideoAd({
        adUnitId: that.data.jili.adid
      })
      videoAd.onLoad(() => {
        that.setData({
          videoAd:videoAd
        })
        console.log('广告初始化成功');
      })
      videoAd.onError((err) => {
        console.log('广告初始化失败');
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          if(that.data.myfunc!=null)
          {
            that.data.myfunc();
            that.data.myfunc=null;
          }
          else
          {
            that.add_download_cishu();
          }
          console.log('激励广告加载完成')
        } else {
          console.log('激励广告被强制关闭')
          that.data.myfunc=null;
        }
      })
    }
    else
    {
      console.log('激励视频广告不能调用');
    }
  },
  /**
   * 加载更多我的图片
   */
  load_mypic:function(){
    var has= this.data.cur_mypic_page*5;
    if(has>this.data.mpics.length)
    {
      return;
    }   
    console.log('加载更多我的图片');
    this.data.cur_mypic_page++;
    this.setData({
      cur_mypic_page:this.data.cur_mypic_page
    })
  },
  /**
   * 打开字体选择界面
   */
  go_change_ziti:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:4,
    })
  },
  /**
   * 选择字体
   */
  select_ziti:function(e){
    if (this.data.loading_ziti==1)
    {
      console.log('字体载入中');
      return;
    }
    var index = e.currentTarget.dataset.index;
    var name = this.data.all_ziti[index].name;
    if (this.data.all_ziti[index].inite==0)
    {
      var all_ziti = this.data.all_ziti;
      var that=this;
      this.data.loading_ziti=1;
      wx.showLoading({
        title: '载入字体中',
      })
      console.log(all_ziti[index].url);
      wx.loadFontFace({
        family: all_ziti[index].name,
        source: 'url("' + all_ziti[index].url + '")',
        success: function (res) {
          that.data.all_ziti[index].inite = 1;
          that.data.loading_ziti = 0;
          wx.hideLoading();
          that.data.element[that.data.btn_status[1]].font = name;
          that.data.historyElement.push(JSON.parse(JSON.stringify(that.data.element)))
          that.setData({
            element: that.data.element,
            all_ziti: that.data.all_ziti,
          })
          console.log('载入字体成功，刷新位置');
          that.refresh_txt(that.data.btn_status[1]);
        },
        fail: function (res) {
          console.log('载入字体失败');
          console.log(res);
          that.data.loading_ziti = 0;
          wx.hideLoading();
          that.data.element[that.data.btn_status[1]].font = name;
          that.data.historyElement.push(JSON.parse(JSON.stringify(that.data.element)))
          that.setData({
            element: that.data.element,
            all_ziti: that.data.all_ziti,
          })
          that.refresh_txt(that.data.btn_status[1]);
        }
      });
    }
    else
    {
      console.log('字体已经载入过了');
      this.data.element[this.data.btn_status[1]].font = name;
      this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
      this.setData({
        element: this.data.element,
        all_ziti: this.data.all_ziti,
      })
      this.refresh_txt(this.data.btn_status[1]);
    }    
  },
  /**
   * 关闭文字具体编辑
   */
  close_edit_ziti:function(){
    this.setData({
      show_status:0
    })
  },
  /**
   * 前往颜色选择界面
   */
  go_select_color:function(){
    console.log(this.data.btn_status);
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:5,
    })
  },
  /**
   * 选择颜色
   */
  select_color:function(e){
    var color = e.currentTarget.dataset.color;
    this.data.element[this.data.btn_status[1]].color = color;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 前往对齐选择界面
   */
  go_select_duiqi:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:6,
    })
  },
  /**
   * 选择对齐方式
   */
  select_duiqi:function(e){
    var duiqi = e.currentTarget.dataset.duiqi;
    this.data.element[this.data.btn_status[1]].duiqi = duiqi;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 前往样式选择界面
   */
  go_select_yangshi:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:7,
    })
  },
  /**
   * 选择字体加粗
   */
  select_bold:function(e){
    var weight = e.currentTarget.dataset.weight;
    this.data.element[this.data.btn_status[1]].weight = weight;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 前往修改间距界面
   */
  go_change_jianju:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:8,
    })
  },
  /**
   * 更改字间距
   */
  change_zijianju:function(e){
    console.log(e.detail);
    var letterspacing = e.detail.value;
    if(this.data.element[this.data.btn_status[1]].letterspacing==letterspacing)
    {
      console.log('相等');
      return;
    }
    this.data.element[this.data.btn_status[1]].letterspacing = letterspacing;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 字间距或者行间距调整结束
   */
  end_jianju:function(e){
    console.log(e);
    console.log('间距调整完毕');
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.refresh_txt(this.data.btn_status[1]);
  },
  /**
   * 修改行间距
   */
  change_hangjianju:function(e){
    console.log(e.detail);
    var lineheight = e.detail.value;
    if(this.data.element[this.data.btn_status[1]].lineheight==lineheight)
    {
      console.log('相等');
      return;
    }
    this.data.element[this.data.btn_status[1]].lineheight = lineheight;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 取消所有选中状态
   */
  cancel_all_selected:function(){
    this.setData({
      btn_status:[-1,-1],
      show_status:0
    })
  },
  go_down: function (e) {
    if(this.data.element.length<=1)
    {
      return;
    }
    var index = e.currentTarget.dataset.index;
    var temp=this.data.element[index].zindex;
    if(temp==0)
    {
      console.log('已经在最底层了');
      return;
    }
    var element=this.data.element;
    var max_down=-1;
    var max_down_index=-1;
    for(var i=0;i<element.length;++i)
    {
      if((index!=i)&&(max_down<element[i].zindex)&&(temp>element[i].zindex)&&(element[i].hasdel==0))
      {
        max_down=element[i].zindex;
        max_down_index=i;
      }
    }
    if(max_down_index==-1)
    {
      console.log('已经在最底层了'+temp);
      return;
    }
    this.data.element[index].zindex=max_down;
    this.data.element[max_down_index].zindex=temp;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element:this.data.element
    })
  },
  go_up: function (e) {
    if(this.data.element.length<=1)
    {
      return;
    }
    var index = e.currentTarget.dataset.index;
    var temp=this.data.element[index].zindex;
    var element=this.data.element;
    var min_up=9999999;
    var min_up_index=-1;
    for(var i=0;i<element.length;++i)
    {
      if((index!=i)&&(min_up>element[i].zindex)&&(temp<element[i].zindex)&&(element[i].hasdel==0))
      {
        min_up=element[i].zindex;
        min_up_index=i;
      }
    }
    if(min_up_index==-1)
    {
      console.log('已经在最顶层了'+temp);
      return;
    }
    this.data.element[index].zindex=min_up;
    this.data.element[min_up_index].zindex=temp;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element:this.data.element
    })
  },
  get_max_zindex:function(){
    var element=this.data.element;
    var max_zindex=0;
    for(var i=0;i<element.length;++i)
    {
      if(element[i].zindex>max_zindex)
      {
        max_zindex=element[i].zindex;
      }
    }
    max_zindex++;
    return max_zindex;
  },
  inite_zindex:function(){
    console.log('初始化index');
    var element=this.data.element;
    for(var i=0;i<element.length;++i)
    {
      element[i].zindex=i;
    }
    this.setData({
      element:element
    })
  },
  /**
   * 选择图片
   */
  choose_pics:function(e){
    var url = e.currentTarget.dataset.url;
    console.log(this.data.btn_status);
    if(this.data.btn_status[0]==1)//贴图
    {
      if(this.data.btn_status[1]==-1)//加图
      {
        console.log('加图');
        var img_new = {
          'zindex': this.get_max_zindex(), 
          'hasdel': 0, 
          'toumingdu': 100, 
          'img': url, 
          'cStv': {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            rotate: 0,
          },
          'imgStv': {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            rotate: 0,
          },
          'container':[0,0,0,0],
          'type':0,//代表图片
        }
        this.data.element.push(img_new);
        this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
        console.log(this.data.element);
        var index = this.data.element.length;
        console.log(index);
        this.setData({
          element: this.data.element,
          btn_status: [1, index-1],
          show_status:0,
        })
      }
      else
      {
        console.log('换图');
        var cur_img = this.data.element[this.data.btn_status[1]].img;
        console.log(cur_img);
        if (cur_img != url)
        {
          this.data.element[this.data.btn_status[1]].img = url;
          this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
          this.setData({
            element: this.data.element,
            show_status:0,
          })
        }
      }
    }
    else if(this.data.btn_status[0]==0)//传图区域
    {
      var url = e.currentTarget.dataset.url;
      this.data.yonghu_pics[this.data.btn_status[1]] = url;
      this.setData({
        yonghu_pics: this.data.yonghu_pics,
        show_status:0,
      })
    }
    this.inite_cankoutu();
  },
  select_xtpics_kind:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      cur_xtpics_index:index
    })
  },
  close_xtpics:function(){
    this.setData({
      show_status:0
    })
  },
  show_more_xtpics:function(){
    this.setData({
      show_status:3
    })
    this.inite_all_xtpics();
  },
  /**
   * 初始化系统图片
   */
  inite_all_xtpics:function()
  {
    if(this.data.all_xtpics==null)
    {
      var that = this;
      var data = new Object();
      data.apiname = 'getxtpics';
      app.mlib.request({
        'model': 'muban',
        'data': data,
        'cachetime': '0',
        success(res) {
          console.log(res);
          that.setData({
            all_xtpics:res.data.data
          })
        },
        fail(res) {
          console.log(res);
        }
      })
    }
  },
  payv2: function(){
    wx.redirectTo({
      url: '/zt_hbsjkh/pages/vip/vip'
    })
  },
  /**
   * 支付 
   */
  pay: function () {
    var data = new Object();
    data.type = 3;
    data.mbid = this.data.id;
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/pay',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        if (res.data.data.r == 2)//余额足够，不需要支付
        {
          that.setData({
            has_goumai:1,
          })
          that.data.user_info.can=1;
          that.download_zuopin();
          wx.showToast({
            title: '支付成功',
          })
          return;
        }
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })
            that.setData({
              has_goumai:1,
            })
            that.data.user_info.can=1;
            that.download_zuopin();
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 下载作品
   */
  download_zuopin: function (e) {    
    if((this.data.user_info.can==0)&&(this.data.hasgoumai==0))
    {
      return;
    }
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum']);
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          that.data.no_need_refresh = 1;
          wx.openSetting({
            success(res) {
              that.data.no_need_refresh = 0;
              console.log(res.authSetting['scope.writePhotosAlbum'])
              if (res.authSetting['scope.writePhotosAlbum'] == true) {
                that._download_zuopin();
              }
            }
          })
        }
        else if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res);
              that._download_zuopin();
            }
          })

        }
        else {
          that._download_zuopin();
        }
      }
    })
  },
  _download_zuopin: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'download';
    data.zuopinid = this.data.zuopinid;
    app.mlib.request({
      'model': 'zuopin',
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
        if(this.data.has_goumai==1)
        {
          if ((that.data.user_info.vip != 0) && (that.data.user_info.left == 0)) {
            that.data.user_info.dleft--;
          }
          else {
            that.data.user_info.left--;
          }
          that.setData({
            user_info: that.data.user_info
          })
        }
        wx.getImageInfo({
          src: res.data.data.url,
          success(res) {
            that.setData({
              show_status: 0,
            })
            console.log(res)
            console.log(res.path);
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success(res) {
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
  /**
   * 将作品保存为范例
   */
  save_fanli:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'fanli';
    data.zuopinid=this.data.zuopinid;
    app.mlib.request({
      'model': 'zuopin',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          show_status:0
        })
        wx.showToast({
          title: res.data.data.msg,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 文字编辑结束
   */
  finish_edit_txt:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type != 1)) {
      return;
    }
    if(this.data.cur_txt=='')
    {
      this.setData({
        show_status: 0,
      })
      return;
    }
    var str = this.data.cur_txt.replace(/↵/g, "\n");
    this.data.element[this.data.btn_status[1]].txt=str;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      show_status: 0,
      element: this.data.element
    })
  },
  /**
   * 文字输入中，获取输入内容
   */
  txt_inputing: function (e) {
    console.log(e.detail.value);
    // var str = e.detail.value.replace(/↵/g, "\n");
    this.data.cur_txt = e.detail.value;
  },
  /**
   * 选择字体方向
   */
  select_direction:function(e){
    var direction = e.currentTarget.dataset.direction;
    this.data.element[this.data.btn_status[1]].direction=direction;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 前往编辑文字
   */
  go_edit_txt:function(){
    if ((this.data.btn_status[0] != 2) || (this.data.btn_status[1] < 0) || (this.data.element[this.data.btn_status[1]].type!=1))
    {
      return;
    }
    this.setData({
      show_status:2,
      cur_txt:this.data.element[this.data.btn_status[1]].txt
    })
  },
  /**
   * 加字
   */
  add_txt:function(){
    console.log('添加文字');
    if(this.data.dzsetting.type==0)//中文
    {
      var txt='添加文字';
      var lineheight=40;
    }
    else if(this.data.dzsetting.type==1)//藏文
    {
      var txt='བོད་པར་མཉེན་ཆས།';
      var lineheight=100;
    }
    var txt_new = {
      'zindex': this.get_max_zindex(),
      'hasdel': 0, 
      'toumingdu': 100, 
      'txt': txt,
      'cStv': {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotate: 0,
      },
      'type': 1,//代表文字
      'color':this.data.colors[0],
      'font': this.data.all_ziti[0].name,
      'duiqi': 'left',
      'model': '',
      'container': [0, 0, 0, 0],
      'weight': 0,
      'direction': 0,
      'lineheight':lineheight,
      'letterspacing':0,
    }
    this.data.element.push(txt_new);
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    var index = this.data.element.length-1;
    this.setData({
      element: this.data.element,
      btn_status: [2, index],
    })
    console.log(this.data.btn_status);
  },
  /**
   * 关闭结果窗口
   */
  jieguo_content_close:function(){
    this.setData({
      show_status:0,
    })
  },
  shenhe:function(){
    if(this.data.koutusetting==undefined)
    {
      this.tijiao();
      return;
    }
    wx.showLoading({
      title: '文字审核中',
      mask:true,
    })
    var element=[];
    for(var i=0;i<this.data.element.length;++i)
    {
      var temp = this.data.element[i];
      if ((temp.type==1)&&(temp.hasdel==0))
      {
        element.push(temp);
      }
    }
    var that = this;
    var info={
      'pics': element,
    };
    var data=new Object();
    console.log('提交');
    console.log(info);
    data.apiname = 'txt';
    data.info = JSON.stringify(info);
    app.mlib.request({
      'model': 'shenhe',
      'data': data,
      'cachetime': '0',
      'method': 'POST',
      'showLoading':false,
      success(res) {
        console.log(res);
        wx.hideLoading();
        if(res.data.data.r==2)
        {
          that.tijiao();
        }
        else
        {
          wx.showToast({
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 提交
   */
  tijiao: function () {
    // this.msgSecCheck();
    // return;
    //获取使用的字体\
    if(app.version*1==this.data.version*1)
    {
      wx.showModal({
        title: '提示',
        content: '您制作的图片已经提交后台审核，审核通过后可下载',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.navigateBack()
        }
      })
      return;
    }
    var use_ziti=[];
    this.data.element.sort(function (a, b) {
      return a.zindex - b.zindex;
    })
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    var element=[];
    for(var i=0;i<this.data.element.length;++i)
    {
      var temp = this.data.element[i];
      if(temp.hasdel==0)
      {
        element.push(this.data.element[i]);
      }
      if (temp.type==1)
      {
        if (use_ziti.indexOf(temp.font) > -1)
        {
          continue;
        }
        use_ziti.push(temp.font);
      }
    }
    var that = this;
    var data = new Object();
    data.apiname = 'tijiao';
    data.mbid = this.data.id;
    data.zuopinid=this.data.zuopinid;
    var info={
      'pics': element,
      'rpx2px': this.data.rpx_to_px,
      'width': this.data.mb_pic_pos[2],
      'font': use_ziti,
      'yhpics':this.data.yonghu_pics,
      'yhstv':this.data.stv_yonghu_pics,
    };
    console.log('提交');
    console.log(info);
    data.info = JSON.stringify(info);
    app.mlib.login(function (response) {
      that._tijiao(data);
    });    
  },
  _tijiao: function (data) {
    var model='zuopin';
    if(this.data.wenanid!=0)
    {
      var model='wenan';
      data.wenanid=this.data.wenanid
    }
    var that = this;
    app.mlib.request({
      'model': model,
      'data': data,
      'cachetime': '0',
      'method': 'POST',
      success(res) {
        console.log(res);
        if(res.data.data.r==0)
        {
          wx.showToast({
            title: res.data.data.msg,
          })
          return;
        }
        if(that.data.wenanid==0)
        {
          that.setData({
            show_status:1,
            user_info:res.data.data.user,
            zuopinid:res.data.data.id
          })
        }
        else
        {
          wx.showModal({
            title: '保存成功',
            content: '返回文案界面即可下载',
            confirmText: '确定',
            success: function (res) {
              if(res.confirm)
              {
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                prevPage.refresh();
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 剪裁完成
   */
  finish_tailor:function(stv){
    this.data.element[this.data.btn_status[1]].imgStv=stv;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.setData({
      element: this.data.element
    })
  },
  /**
   * 前往剪裁图片
   */
  go_jiancai:function(){
    app.mlib.tailor_img = this.data.element[this.data.btn_status[1]];
    wx.navigateTo({
      url: '../tailorpic/tailorpic',
    })
  },
  /**
   * 换图
   */
  go_change_pic:function(){
    this.data.btn_status[0]=0;
    console.log(this.data.btn_status);
    this.setData({
      btn_status: this.data.btn_status
    })
  },
  /**
   * 加图/换图
   */
  go_add_pic:function(e){
    var index = e.currentTarget.dataset.index;
    console.log(index);
    if(index==null)
    {
      this.data.btn_status=[1,-1];
    }
    else
    {
      this.data.btn_status = [1, index];
    }
    console.log(this.data.btn_status);
    this.setData({
      btn_status: this.data.btn_status,
      show_status:8,
    })
  },
  /**
   * 编辑结束
   */
  edit_finished:function(){
    this.setData({
      btn_status: [-1, -1]
    })
  },
  /**
   * 焦点改变
   */
  change_focus: function (e) {
    console.log('获取到改变焦点事件');
    var id = e.currentTarget.dataset.id.split(':');
    console.log(id);
    if(id[0]==0)//用户传图区域
    {
      this.setData({
        btn_status: [id[0], id[1]],
        show_status:0
      })
    }
    else
    {
      this.setData({
        btn_status: [id[0], id[1]],
        show_status:0
      })
    }
  },
  txt_center_inite: function (e) {
    console.log('文字中心点初始化');
    var index = e.currentTarget.dataset.index;
    var center = e.detail;
    this.data.element[index].center=[];
    this.data.element[index].center[0] = center[0] - 20 - this.data.mb_pic_pos[0];
    this.data.element[index].center[1] = center[1] - 120 - this.data.mb_pic_pos[1];
    // this.data.element[index].center = center;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
  },
  element_pos_inited: function (e) {
    // console.log(e);
    // console.log(e.detail);
    var index = e.currentTarget.dataset.index;
    // console.log('获取到图片初始化信息'+index);
    var container = e.detail;
    this.data.element[index].container = container;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
  },
  /**
   * 图片stv被改变
   */
  element_stvChanged:function(e){
    console.log(e);
    var index=e.target.dataset.index;
    var stv = e.detail;
    this.data.element[index].cStv = stv;
    this.data.element[index].yushe = 0;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
  },
  del_pic:function(e){
    console.log('删除图片####################');
    console.log(e);
    var ids=e.currentTarget.dataset.id.split(":");
    var element=this.data.element;
    element[ids[1]].hasdel=1;
    this.setData({
      element:element
    })
  },
  /**
   * 删除元素
   */
  del_element:function(e){
    console.log('删除元素');
    console.log(this.data.btn_status);
    var btn_status = this.data.btn_status;
    var element=this.data.element;
    element[btn_status[1]].hasdel=1;
    this.data.element=element;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    var that=this;
    this.setData({
      btn_status: [-1, -1],
    },function(){
      that.setData({
        element: element,      
      })
    })    
    this.cancel_all_selected();
    console.log(this.data.btn_status);
  },
  /**
   * 添加图片到服务器
   */
  add_pic: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original'],
      success: function (res) {
        console.log('选择图片');
        console.log(res);
        var pic = [];
        var files = [];
        for (var i = 0; i < res.tempFilePaths.length; ++i) {
          var file_name = app.mlib.uid + '_' + Date.parse(new Date()) + '_' + i + '.' + app.mlib.suffix(res.tempFilePaths[i]);
          pic.push([res.tempFilePaths[i], file_name]);
          files.push(file_name);
        }
        console.log(files);
        var data = new Object();
        data.apiname = 'add';
        data.files = JSON.stringify(files);
        app.mlib.upLoads('/images/mypics/', pic, null, function (res) {
          console.log('上传成功');
          wx.showLoading({
            title: '图片检测中',
          })
          var shenhe_data=new Object();
          shenhe_data.apiname = 'img';
          shenhe_data.img=files[0];
          app.mlib.request({
            'model': 'shenhe',
            'data': shenhe_data,
            'cachetime': '0',
            'showLoading':false,
            success(res) {
              console.log('添加图片返回消息');
              console.log(res);
              if(res.data.data.r==0)
              {
                wx.showToast({
                  title: res.data.data.msg,
                })
                return;
              }
              else if(res.data.data.r==1)
              {
                wx.showToast({
                  title: res.data.data.msg,
                })
                return;
              }
              else if(res.data.data.r==2)
              {
                app.mlib.request({
                  'model': 'mypics',
                  'data': data,
                  'cachetime': '0',
                  success(res) {
                    console.log('添加图片返回消息');
                    console.log(res);
                    if(res.data.data.r==0)
                    {
                      wx.showToast({
                        title: res.data.data.msg,
                      })
                      return;
                    }
                    app.mlib.getMyPics(function (res) {
                      that.setData({
                        mpics: res
                      })
                    }, true);
                  },
                  fail(res) {
                    console.log(res);
                  }
                })
              }
            },
            fail(res) {
              console.log(res);
            }
          })
        });
      },
    })
  },
  /**
   * 改变查看图片种类
   */
  chang_pics_swith:function(e){
    var status = e.currentTarget.dataset.status;
    if ((status == 1) && (this.data.mpics.length==0))
    {
      var that=this;
      app.mlib.getMyPics(function (res) {
        that.setData({
          mpics: res
        })
      },false);
    }
    this.setData({
      edit_pics_status: status
    })
  },
  /**
   * 改变收藏状态
   */
  change_shoucang_status:function(){
    if (this.data.shoucang_handling == 1)
    {
      return;
    }
    this.data.shoucang_handling=1;
    if(this.data.has_shoucang==0)
    {
      this.add_shoucang();
    }
    else
    {
      this.del_shoucang();
    }
  },
  /**
   * 加入收藏夹
   */
  add_shoucang:function(){
    var that = this;
    var data = new Object();
    data.apiname = 'add';
    data.id = this.data.id;
    app.mlib.request({
      'model': 'shoucang',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        wx.showToast({
          title: res.data.data.msg,
        })
        that.setData({
          has_shoucang: 1
        })
        that.data.shoucang_handling=0;
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 移出收藏夹
   */
  del_shoucang: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'del';
    data.id = this.data.id;
    app.mlib.request({
      'model': 'shoucang',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        wx.showToast({
          title: res.data.data.msg,
        })
        that.setData({
          has_shoucang: 0
        })
        that.data.shoucang_handling = 0;
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 初始化作品信息
   */
  inite_zuopin: function () {
    console.log('初始化作品信息');
    var zuopin_info=this.data.zuopin_info;
    console.log(zuopin_info);
    console.log(this.data.rpx_to_px);
    console.log(this.data.mb_pic_pos);
    var scale = this.data.mb_pic_pos[2] / zuopin_info.width;
    scale=scale.toFixed(2);
    console.log('初始化作品信息'+scale);
    console.log();
    //元素
    var pics = zuopin_info.pics;
    for (var i = 0; i < pics.length;++i)
    {
      pics[i].hasdel=0;
      if((pics[i].toumingdu==null)||(pics[i].toumingdu==undefined)||(pics[i].toumingdu==''))
      {
        pics[i].toumingdu=100;
      }
      if (pics[i].type==0)//图片
      {
        pics[i].cStv.offsetX = scale * pics[i].cStv.offsetX;
        pics[i].cStv.offsetY = scale * pics[i].cStv.offsetY;
        pics[i].imgStv.offsetX = scale * pics[i].imgStv.offsetX;
        pics[i].imgStv.offsetY = scale * pics[i].imgStv.offsetY;
        if((pics[i].model=='')||(pics[i].model==null)||(pics[i].model==undefined))
        {
          pics[i].model='';
        }
        else if(pics[i].model=='erweima')
        {
          if((this.data.member.erweima!='')&&(this.data.member.erweima!=null)&&(this.data.member.erweima!=undefined))
          {
            pics[i].img=this.data.member.erweima;
            // pics[i].yushe=1;
          }
        }
        else if(pics[i].model=='logo')
        {
          if((this.data.member.logo!='')&&(this.data.member.logo!=null)&&(this.data.member.logo!=undefined))
          {
            pics[i].img=this.data.member.logo;
            // pics[i].yushe=1;
          }
        }
      }
      else//文字
      {
        if((pics[i].model=='')||(pics[i].model==null)||(pics[i].model==undefined))
        {
          pics[i].model='';
        }
        else if(pics[i].model=='tel')
        {
          if((this.data.member.tel!='')&&(this.data.member.tel!=null)&&(this.data.member.tel!=undefined))
          {
            pics[i].txt=this.data.member.tel;
            pics[i].yushe=1;
          }
        }
        else if(pics[i].model=='name')
        {
          if((this.data.member.realname!='')&&(this.data.member.realname!=null)&&(this.data.member.realname!=undefined))
          {
            pics[i].txt=this.data.member.realname;
            pics[i].yushe=1;
          }
        }
        else if(pics[i].model=='shopname')
        {
          if((this.data.member.shopname!='')&&(this.data.member.shopname!=null)&&(this.data.member.shopname!=undefined))
          {
            pics[i].txt=this.data.member.shopname;
            pics[i].yushe=1;
          }
        }
        else if(pics[i].model=='addr')
        {
          if((this.data.member.addr!='')&&(this.data.member.addr!=null)&&(this.data.member.addr!=undefined))
          {
            pics[i].txt=this.data.member.addr;
            pics[i].yushe=1;
          }
        }
        pics[i].cStv.offsetX = scale * pics[i].cStv.offsetX;
        pics[i].cStv.offsetY = scale * pics[i].cStv.offsetY;
        pics[i].cStv.scale = scale * pics[i].cStv.scale;
        if((pics[i].weight==null)||(pics[i].weight==undefined)||(pics[i].weight==''))
        {
          pics[i].weight=0;
        }
        if((pics[i].direction==null)||(pics[i].direction==undefined)||(pics[i].direction==''))
        {
          pics[i].direction=0;
        }
        if((pics[i].lineheight==null)||(pics[i].lineheight==undefined)||(pics[i].lineheight==''))
        {
          pics[i].lineheight=this.data.min_lineheight;
        }
        if((pics[i].letterspacing==null)||(pics[i].letterspacing==undefined)||(pics[i].letterspacing==''))
        {
          pics[i].letterspacing=0;
        }
      }
    }
    if((zuopin_info.yhpics==null)||(zuopin_info.yhpics==undefined))
    {
      zuopin_info.yhpics=[];
    }
    if((zuopin_info.yhstv==null)||(zuopin_info.yhstv==undefined))
    {
      zuopin_info.yhstv=[];
    }
    this.setData({
      yonghu_pics: zuopin_info.yhpics,
      stv_yonghu_pics: zuopin_info.yhstv,
      bili:scale,
    })
    this.data.element=pics;
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
    this.inite_zindex();
    this.inite_cankoutu();
    console.log(this.data.element);
  },
  inite_sucai:function(){
    var element=[];
    var muban_info=this.data.muban_info
    var goods_pic_pos=this.data.mb_pic_pos;
    var sucai=muban_info.sucai;
    var moren_pics=this.data.moren_pics;
    var _stv = {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotate: 0,
    };
    if((muban_info.pics!=null)&&(muban_info.pics!=undefined)&&(muban_info.pics!=''))
    {
      var temp_pics = [];
      var temp_stv = [];
      for (var i = 0; i < muban_info.pics.length; ++i) 
      {
        temp_pics.push(muban_info.pics[i][0]);
        temp_stv.push(_stv)
      }
      this.setData({
        yonghu_pics:temp_pics,
        stv_yonghu_pics:temp_stv,
      })
    }
    for(var j=0;j<sucai.length;++j)
    {
      var pic_width = sucai[j][3];
      var pic_height = sucai[j][4];
      var max_width = goods_pic_pos[2]/2;
      var max_heght = goods_pic_pos[3]/2;
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
      var scale=sucai[j][3]*goods_pic_pos[2]/(pos_inited[2]*muban_info.width)
      var want_x=sucai[j][1]*goods_pic_pos[2]/muban_info.width;
      var want_y=sucai[j][2]*goods_pic_pos[3]/muban_info.height;
      var real_x=pos_inited[0]+(1-scale)*pos_inited[2]/2;
      var real_y=pos_inited[1]+(1-scale)*pos_inited[3]/2;
      // var offsetX=
      var img_new = {
        'hasdel': 0, 
        'img': sucai[j][0], 
        'toumingdu': 100, 
        'cStv': {
          offsetX: want_x-real_x,
          offsetY: want_y-real_y,
          scale: scale,
          rotate: 0,
        },
        'imgStv': {
          offsetX: 0,
          offsetY: 0,
          scale: 1,
          rotate: 0,
        },
        'container':[0,0,0,0],
        'type':0,//代表图片
        'model':'',
      }
      element.push(img_new);
    }
    this.data.element=element;
    // this.setData({
    //   element:element
    // })
    this.inite_zindex();
    this.inite_cankoutu();
    console.log('初始化素材');
    console.log(this.data.element);

    this.data.initELement = JSON.parse(JSON.stringify(this.data.element));
    this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
  },
  inite_element:function(){
    console.log('inite_element');
    if(this.data.use_font_num>0)
    {
      console.log('未使用字体');
      return;
    }
    if(this.data.zuopin_has_inite==1)
    {
      console.log('已经初始化作品');
      return;
    }
    wx.hideLoading();
    this.data.zuopin_has_inite=1;
    console.log("############初始化元素");
    var element=this.data.element;
    for(var i=0;i<element.length;++i)
    {
      if(element[i].type==1)//文字
      {
        element[i].hasninitefont=1;
      }
    }
    this.setData({
      element:element
    })
  },
  /**
   * 初始化位置信息
   */
  inite_pos:function(){
    console.log('初始化位置信息');
    var muban_width = this.data.muban_info.width;
    var muban_height = this.data.muban_info.height;
    var max_width=710;
    var max_heght=this.data.window_height_rpx-320;
    console.log([max_width,max_heght]);
    if ((muban_width / max_width) <= (muban_height / max_heght)) {
      this.data.mb_pic_pos[2] = max_heght * muban_width / muban_height;
      this.data.mb_pic_pos[3] = max_heght;
      this.data.mb_pic_pos[0] = (max_width - this.data.mb_pic_pos[2]) / 2;
      this.data.mb_pic_pos[1] = 0;
      this.data.mb_pic_pos[4]=max_heght/muban_height;
    }
    else {
      this.data.mb_pic_pos[0] = 0;
      this.data.mb_pic_pos[2] = max_width;
      this.data.mb_pic_pos[3] = max_width * muban_height / muban_width;
      this.data.mb_pic_pos[1] = (max_heght - this.data.mb_pic_pos[3]) / 2;
      this.data.mb_pic_pos[4]=max_width/muban_width;
    }
    this.setData({
      mb_pic_pos: this.data.mb_pic_pos,
    })
    console.log(this.data.mb_pic_pos);
    this.inite_ziti();
    if(this.data.zuopin_info==null)
    {
      this.inite_sucai();
    }
    else
    {
      this.inite_zuopin();
    }
  },
  inite_ziti:function(){
    var all_ziti = this.data.all_ziti;
    all_ziti[0].index=0;
    var need_inite_font=[all_ziti[0]];
    var use_font=[];
    if (this.data.zuopin_info!=null)
    {
      var use_font = this.data.zuopin_info.font;
    }
    console.log(all_ziti);
    for(var i=1;i<all_ziti.length;++i)
    {
      all_ziti[i].inite = 0;
      if (use_font.indexOf(all_ziti[i].name) > -1)
      {
        all_ziti[i].index=i;
        need_inite_font.push(all_ziti[i]);
      }
    }
    this.data.use_font_num = need_inite_font.length;
    var that=this;
    wx.showLoading({
      title: '载入字体中',
    })
    for(var i=0;i<need_inite_font.length;++i)
    {
      var temp_index=need_inite_font[i].index;
      wx.loadFontFace({
        family: need_inite_font[i].name,
        source: 'url("' + need_inite_font[i].url + '")',
        success: function (res) {
          console.log('载入字体成功');
          that.data.use_font_num--;
          that.inite_element();
          all_ziti[temp_index].inite = 1;
          that.setData({
            all_ziti: all_ziti
          })
        },
        fail: function (res) {
          that.data.use_font_num--;
          console.log('载入字体失败');
          console.log(res);
          that.inite_element();
        }
      });
    }
    console.log('初始化字体');  
  },
  /**
   * 初始化
   */
  inite: function () {
    var that = this;
    var data = new Object();
    data.apiname = 'get';
    data.id = this.data.id;
    data.pid=this.data.pid;
    data.wenanid=this.data.wenanid;
    data.zuopinid = this.data.zuopinid;
    app.mlib.request({
      'model': 'muban',
      'data': data,
      'cachetime': '0',
      success(res) {
        console.log(res);
        that.setData({
          muban_info:res.data.data.muban,
          has_shoucang:res.data.data.shoucang,
          moren_pics: res.data.data.morenpics,
          colors: res.data.data.colors,
          all_ziti:res.data.data.ziti,
          id:res.data.data.mbid,
          version:res.data.data.version,
          imgshuiyin:res.data.data.imgshuiyin,
          jili:res.data.data.jili,
          has_goumai:res.data.data.hasgoumai,
          dzsetting:res.data.data.dzsetting,
          member:res.data.data.member,
          gettel:res.data.data.gettel,
          koutusetting:res.data.data.koutusetting
        })
        that.onUser()
        //判断是否可以抠图
        var koutusetting=res.data.data.koutusetting;
        console.log(koutusetting);
        if(koutusetting==undefined)
        {
          that.setData({
            can_koutu:0,
          })
        }
        else if(koutusetting.type==0)//禁止抠图
        {
          that.setData({
            can_koutu:0,
          })
        }
        else if(koutusetting.type==1)//全部免费抠图
        {
          that.setData({
            can_koutu:1,
          })
        }
        else if(koutusetting.type==2)//看广告抠图
        {
          that.setData({
            can_koutu:2,
          })
        }
        else if(koutusetting.type==3)//会员抠图
        {
          var member=res.data.data.member;
          if(member.vip==0)
          {
            that.setData({
              can_koutu:0,
            })
          }
          else
          {
            that.setData({
              can_koutu:1,
            })
          }
        }
        //判断是否可以扣头像
        if(koutusetting==undefined)
        {
          that.setData({
            can_kouhead:0,
          })
        }
        else if(koutusetting.headtype==0)//禁止抠图
        {
          that.setData({
            can_kouhead:0,
          })
        }
        else if(koutusetting.headtype==1)//全部免费抠图
        {
          that.setData({
            can_kouhead:1,
          })
        }
        else if(koutusetting.headtype==2)//看广告抠图
        {
          if(res.data.data.jili.adid!='')
          {
            that.setData({
              can_kouhead:2,
            })
          }
          else
          {
            that.setData({
              can_kouhead:0,
            })
          }
        }
        else if(koutusetting.headtype==3)//会员抠图
        {
          var member=res.data.data.member;
          if(member.vip==0)
          {
            that.setData({
              can_kouhead:0,
            })
          }
          else
          {
            that.setData({
              can_kouhead:1,
            })
          }
        }
        if(res.data.data.dzsetting.type==0)//中文
        {
          that.setData({
            max_lineheight:100,
            min_lineheight:40
          })
        }
        else if(res.data.data.dzsetting.type==1)//藏文
        {
          that.setData({
            max_lineheight:200,
            min_lineheight:100
          })
        }
        wx.setNavigationBarTitle({
          title: res.data.data.muban.name,
        })
        //初始化广告
        if(res.data.data.jili!=null)
        {
          if(res.data.data.jili.adid!='')
          {
            console.log('可以初始化广告');
            console.log(res.data.data.jili.adid);
            that.inite_ad();
          }
        }
        if(that.data.zuopinid!=0)
        {
          that.data.zuopin_info = res.data.data.zuopin;
        }
        else if (that.data.muban_info.fanli!='')
        {
          that.data.zuopin_info = that.data.muban_info.fanli
        }
        else
        {
          that.data.zuopin_info=null;
        }
        that.inite_pos();
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
    if (options.id != null) {
      this.data.id = options.id;
      console.log(options.id);
    } 
    if (options.wenanid != null) {
      this.data.wenanid = options.wenanid;
    } 
    if (options.zuopinid != null) {
      this.data.zuopinid = options.zuopinid;
      console.log('作品id' + this.data.zuopinid);
    }
    if (options.pid != null) {
      this.data.pid = options.pid;
    } 
    wx.onUserCaptureScreen(function (res) {
      wx.showModal({
        title: '提示',
        content: '定制页面禁止截屏',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.navigateBack()
        }
      })
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        console.log('rpx_to_px' + res.windowWidth / 750);
        var window_height_rpx = res.windowHeight * 750 / res.windowWidth;
        console.log(window_height_rpx);
        that.setData({
          rpx_to_px: res.windowWidth / 750,
          window_height_rpx: window_height_rpx
        })
        app.mlib.getMyPics(function (res) {
          that.setData({
            mpics: res
          })
        },false);
        app.mlib.login(function (response) {
          that.inite();
        });
      },
    })
  },
  /**
     * 触摸开始
     */
  touchstart: function (e) {
    console.log('触摸开始');
    if ((this.data.btn_status[0] != 1) && (this.data.btn_status[0] != 2)&& (this.data.btn_status[0] != 0))
    {
      console.log('无效触摸'+this.data.btn_status[0]);
      return;
    }
    console.log('index' + this.data.btn_status[1]);
    if (e.touches.length == 1)
    {
      console.log('单点触摸');
      this.data.is_move = 0;
      this.data.touch_status = 0;
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
    }
    else
    {
      this.data.is_move = -1;
      this.data.touch_status = 1;
      var diff_x = e.touches[0].clientX - e.touches[1].clientX;
      var diff_y = e.touches[0].clientY - e.touches[1].clientY;
      let x = Math.pow(diff_x, 2)
      let y = Math.pow(diff_y, 2)
      this.data.start_distance = Math.sqrt(x + y);
      if (this.data.btn_status[0] == 0) 
      {
        this.data.start_scale = this.data.stv_yonghu_pics[this.data.btn_status[1]].scale;
        this.data.start_angle = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI) - this.data.stv_yonghu_pics[this.data.btn_status[1]].rotate;
      }
      else
      {
        var stv = this.data.element[this.data.btn_status[1]].cStv;
        this.data.start_scale = stv.scale; 
      }    
    }
  },
  /**
   * 触摸移动
   */
  touchmove: function (e) {
    console.log(e);
    var rpx_to_px=this.data.rpx_to_px;
    console.log(this.data.btn_status);
    if(this.data.btn_status[0]==-1)
    {
      return;
    }
    if(this.data.ismoving==0)
    {
      this.setData({
        ismoving:1
      })
    }
    //单点触摸
    if (this.data.touch_status == 0)
    {
      this.data.is_move = 1;
      var change_x = e.touches[0].pageX - this.data.touch_start_pos[0];
      var change_y = e.touches[0].pageY - this.data.touch_start_pos[1];
      change_x = change_x / rpx_to_px;
      change_y = change_y / rpx_to_px;
      if(this.data.btn_status[0]==0)
      {
        this.data.stv_yonghu_pics[this.data.btn_status[1]].offsetX += change_x;
        this.data.stv_yonghu_pics[this.data.btn_status[1]].offsetY += change_y;
        this.setData({
          stv_yonghu_pics: this.data.stv_yonghu_pics
        });
      }
      else
      {
        var stv = this.data.element[this.data.btn_status[1]].cStv;
        stv.offsetX += change_x;
        stv.offsetY += change_y;
        this.data.element[this.data.btn_status[1]].cStv = stv;

        this.setData({
          element: this.data.element
        })
      }
      this.data.touch_start_pos[0] = e.touches[0].pageX;
      this.data.touch_start_pos[1] = e.touches[0].pageY;
    }
    else//多点触摸
    {
      console.log(e.touches.length);
      if(e.touches.length==1)
      {
        return;
      }
      var diff_x = e.touches[0].clientX - e.touches[1].clientX;
      var diff_y = e.touches[0].clientY - e.touches[1].clientY;
      let x = Math.pow(diff_x, 2)
      let y = Math.pow(diff_y, 2)
      //缩放
      var dis = Math.sqrt(x + y);
      if(this.data.btn_status[0]==0)
      {
        //旋转
        var angle = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
        var stv = this.data.stv_yonghu_pics[this.data.btn_status[1]];
        this.data.stv_yonghu_pics[this.data.btn_status[1]].scale = this.data.start_scale + this.data.start_scale * (dis - this.data.start_distance) / this.data.start_distance;
        if (Math.abs(this.data.stv_yonghu_pics[this.data.btn_status[1]].rotate - angle + this.data.start_angle) <= 90) {
          this.data.stv_yonghu_pics[this.data.btn_status[1]].rotate = angle - this.data.start_angle;
        }
        this.setData({
          stv_yonghu_pics: this.data.stv_yonghu_pics
        });
      }
      else
      {
        var stv = this.data.element[this.data.btn_status[1]].cStv;
        stv.scale = this.data.start_scale + this.data.start_scale * (dis - this.data.start_distance) / this.data.start_distance;
        this.setData({
          element: this.data.element
        })
      }
    }
  },
  /**
   * 触摸结束
   */
  touchend: function (e) {
    console.log('触摸结束');
    //点击未移动
    if (this.data.is_move == 0) {
      console.log('未移动');
      if ((this.data.btn_status[0] == 0) && (this.data.btn_status[1] != -1))//正在换图
      {
        console.log('正在换图');
        console.log(this.data.btn_status);
        // this.setData({
        //   btn_status: [1, this.data.btn_status[1]]
        // })
      }    
    }
    else {
      this.data.historyElement.push(JSON.parse(JSON.stringify(this.data.element)))
      console.log('动了');
      this.setData({
        ismoving:0
      })
    }
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
    console.log('onShow');
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
    wx.offUserCaptureScreen();
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