var util = require('../we7/resource/js/util.js');
var mlib = {};
mlib.name = 'zt_hbsjkh';
mlib.uid=0;
mlib.dzinfo=null
mlib.tailor_img=null,
// mlib.fenleiinfo={
//   'pid':0,
//   'cid':0
// };
mlib.fenleiinfo=null;
mlib.webview_url='';
mlib.cur_select_hb=null;
/**
 * 获取连接中文件名
 */
mlib.urlfilename=function(url){
  var pos=url.lastIndexOf("\/");
  var strFileName=url.substring(pos+1);
  return strFileName;
}
/**
 * 样式信息
 */
mlib.style={
  'jiage_color':'#CE0000',
  'color': '#000000',//主题色调
  'btn_txt_color': '#ffffff',//按钮文字
  'main_txt_color':'#333333',//一级文字标题
  'secend_txt_color':'#999999',//二级标题
  'tabbar_color': '#AFA6A9',
  'tabbar_selected_color': '#FF667A',
}
/**
 * 获取邀请二维码
 */
mlib.erweima='',
mlib.geterweima=function(cb){
  if (mlib.erweima!='')
  {
    cb(mlib.erweima);
    return;
  }
  var data = new Object();
  data.apiname = 'get';
  mlib.request({
    'model': 'erweima',
    'data': data,
    'cachetime': '0',
    success(res) {
      console.log(res);
      mlib.erweima = res.data.data.d;
      cb(mlib.erweima);
    },
    fail(res) {
      console.log(res);
    }
  })
},
mlib.mypics=null,
/**
 * 获取我的图片
 */
mlib.getMyPics=function(cb,refresh){
  if ((mlib.mypics != null) && (!refresh))
  {
    cb(mlib.mypics);
    return;
  }
  var data = new Object();
  data.apiname = 'get';
  mlib.request({
    'model': 'mypics',
    'data': data,
    'cachetime': '0',
    success(res) {
      console.log(res);
      var temp_arr = res.data.data.d;
      mlib.mypics = temp_arr;
      cb(temp_arr);
    },
    fail(res) {
      console.log(res);
    }
  })
}
/**
 * 全局变量
 */
mlib.globaldata={
  has_shouquan: false,
  userInfo: null,
  login_info: null,
},
/**分享数据 */
mlib.fenxiang={},
/**
 * 批量上传文件
 * dir希望存储的目录
 * files要上传的文件和在服务器的存储名字
 * cb上传完成调用的函数
 */
mlib.upLoads = function (dir,files,_formdata,cb)
{
  if (files.length == 0) 
  {
    return;
  }
  var _url = mlib.url('myupload');
  if (_formdata == null) 
  {
    _formdata = new Object();
    _formdata.model = 'upload';
    _formdata.dir = dir;
    _formdata.times = files.length;
    _formdata.maxtimes = files.length;
  }
  _formdata.file = files[_formdata.maxtimes - _formdata.times][1];
  console.log(files);
  console.log('当前上传文件' + _formdata.times+ files[_formdata.maxtimes - _formdata.times][0]);
  
  wx.uploadFile({
    url: _url,
    filePath: files[_formdata.maxtimes - _formdata.times][0],
    name: 'myFile',
    header: {
      'content-type': 'multipart/form-data'
    },
    formData: _formdata,
    success: function (res) {
      console.log(res);
      _formdata.times--;
      //传图完毕
      if (_formdata.times == 0) {
        cb(res);
      }
      else {
        mlib.upLoads(dir, files, _formdata, cb);
      }
    },
    fail: function (e) {
      console.log(e);
    }
  })
},
/**
 * 批量上传图片
 */
mlib.upLoadUrl = "";
//参数
mlib.upLoadpics = function (pics, formData,cb)
{
  if (mlib.upLoadUrl == "")
  {
    return;
  }
  var _formdata=null;
  if (formData != null)
  {
    _formdata = formData;
  }
  else
  {
    _formdata = new Object();
  }
  //还没赋值表示第一次上传
  if (_formdata.times == null) 
  {
    _formdata.times = pics.length;
    _formdata.files='';
  }
  _formdata.maxtimes = pics.length;
  _formdata.file = mlib.globaldata.userInfo.memberInfo.uid + '_' + formData.tid + '_' + _formdata.times + '.' + mlib.suffix(pics[_formdata.times - 1]);
  _formdata.files += _formdata.file+',';
  wx.uploadFile({
    url: mlib.upLoadUrl, 
    filePath: pics[_formdata.times-1],
    name: 'myFile',
    header: {
      'content-type': 'multipart/form-data'
    },
    formData: _formdata,
    success: function (res) {
      console.log(res.data);
      _formdata.times--;
      //传图完毕
      if (_formdata.times==0)      
      {
        cb(res);
      }
      else
      {
        mlib.upLoadpics(pics, _formdata,cb);
      }      
    },
    fail: function (e) {
      console.log(e.errMsg);
    },
    complete: function () {
    }
  }) 
}
/**
 * 上传单个文件
 */
mlib.upLoad = function (pic, todo,formdata,cb) {
  var m_url = mlib.url(todo);
  wx.uploadFile({
    url: m_url, //仅为示例，非真实的接口地址
    filePath: pic,
    name: 'myFile',
    header: {
      'content-type': 'multipart/form-data'
    },
    formData: formdata,
    success: function (res) {
      if(cb!=null)
      {
        cb();
      }
    },
    fail: function (e) {
      console.log(e.errMsg);
    },
    complete: function () {
    }
  })
}
/**
 * 微擎url转换
 */
mlib.url=function(todo){
  var m_url = util.url('entry/wxapp/' + todo);
  m_url = m_url + '&m='+mlib.name;
  return m_url;
}
mlib.login=function(cb)
{
  var login = function()
  {
    console.log('重新登录');
    wx.login({
      success: function (res) {
        util.getWe7User(function(userInfo) {
          console.log('用户信息');
          console.log(userInfo);
          mlib.memberInfo=userInfo.memberInfo;
          typeof cb == "function" && cb(userInfo);
        }, res.code)
      },
      fail: function () {
      }
    });
  }
  var userInfo = wx.getStorageSync('userInfo') || {};
	if (userInfo.sessionid) {
    console.log('登录缓存');
		util.checkSession({
			success: function(){
        mlib.memberInfo=userInfo.memberInfo;
        typeof cb == "function" && cb(userInfo);
			},
			fail: function(){
				userInfo.sessionid = '';
				console.log('relogin');
				wx.removeStorageSync('userInfo');
				login();
			}
		})
	} else {
		//调用登录接口
		login();
	}
}
mlib.upadteUser = function (wxInfo, cb) {	
  var data = new Object();
  data.apiname = 'updateuser';
  data.avatar=wxInfo.userInfo.avatarUrl;
  data.nickname=wxInfo.userInfo.nickName;
  console.log(data);
  mlib.request({
    'model': 'user',
    'data': data,
    'cachetime': '0',
    success(res) {
      console.log(res);
			typeof cb == "function" && cb(wxInfo);
    },
    fail(res) {
			typeof cb == "function" && cb(wxInfo);
    }
  })
}
/*
* 获取用户信息
*/
mlib.getUserInfo = function (obj,cb,failed) {
  console.log('获取用户信息');
  console.log(mlib.userInfo);
  var mlib_userInfo = wx.getStorageSync('mlib_userInfo')
  if (mlib_userInfo)
  {
    console.log('使用用户信息缓存');
    mlib.login(cb);
    return;
  }
  mlib.login(function(res){
    wx.showModal({
      title: '登录提示',
      content: '登录将获取您的昵称和头像',
      success (res) {
        if (res.confirm) {
          wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用于登陆',
            success: function(wxInfo){
              console.log(wxInfo);
              wx.setStorageSync('mlib_userInfo', wxInfo)
              mlib.upadteUser(wxInfo, function(userInfo) {
                typeof cb == "function" && cb(userInfo);
              })
            },
            fail: function(res) {
              console.log(res)
              typeof cb == "function" && cb(userInfo);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  });
}
/**
 * 获取用户信息回调函数
 */
mlib.getUserInfoCallback = function (e) {
  console.log('回调');
  if (e.detail.rawData == null) 
  {
    if (this.data.infocallbackfailed!=null)
    {
      this.data.infocallbackfailed();
    }
    return;
  }
  this.setData({
    need_shouquan: false,
  });
  //执行一些必须授权才能执行的函数
  mlib.getUserInfo(this, this.data.infocallback);
},
/**
 * 关掉授权窗口
 */
mlib.closeShouquan=function(e){
  console.log('关闭授权');
  this.setData({
    need_shouquan: false,
  })
}
/**
 * 获取毫秒事件
 */
mlib.getTimeHaomiao=function(){
  var timestamp1 = Date.parse(new Date());
  return timestamp1;
}
/**
 * 随机字符串
 */
mlib.randomStr = function (len){
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) 
  {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
/**
 * 获取文件扩展名
 */
mlib.suffix=function(file_name){
  var index1 = file_name.lastIndexOf(".");
  var index2 = file_name.length;
  var suffix = file_name.substring(index1 + 1, index2);
  return suffix;
}
/**
 * 跳转到首页的分享
 */
mlib.fx_go_shouye = function () {
  return {
    title: mlib.fenxiang.title,
    path: '/' + mlib.name + '/pages/index/index?pid='+mlib.uid,
    imageUrl: mlib.fenxiang.icon,
    success: function (res) {
      wx.showToast({
        title: '转发成功',
      })
      console.log('转发成功');
    },
    fail: function (res) {
      wx.showToast({
        title: '转发失败',
      })
      console.log('转发失败');
    },
  }
}
/**
 * 朋友圈跳转到首页的分享
 */
mlib.fxpyq_go_shouye = function () {
  var r=new Object();
  r.title=mlib.fenxiang.pyqtitle;
  r.query='pid='+mlib.uid+'&yulan=1';
  r.imageUrl=mlib.fenxiang.pyqicon
  return r;
}
/**
 * 请求函数
 * obj:{
 * model:'',请求处理的模块
 * data:{},请求附带的数据
 * cachetime：0，请求缓存事件
 * }
 */
mlib.request=function(obj){
  if (obj.data==null)
  {
    obj.data=new Object();
  }
  obj.data.model=obj.model;
  util.request({
    'url': 'entry/wxapp/wxapi',
    'data': obj.data,
    'cachetime': obj.cachetime,
    'method': obj.method,
    success: obj.success,
    fail:obj.fail,
    showLoading:obj.showLoading,
  })
}
module.exports = mlib;