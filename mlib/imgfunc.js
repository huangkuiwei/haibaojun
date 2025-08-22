var mlib = require('./mlib.js');
var imgfunc = {};
imgfunc.koutuing=0;
imgfunc.koutu=function(url,cb){
  if(url.indexOf("/images/mypics") == -1)
  {
    console.log('不是用户传图');
    return false;
  }
  var file_name=mlib.urlfilename(url);
  console.log(file_name);
  var koutu_url=wx.getStorageSync(file_name);
  console.log(koutu_url);
  if(koutu_url!='')
  {
    console.log('使用缓存');
    if(koutu_url=='-1')
    {
      wx.showToast({
        title: '该图片无法抠图',
        icon:'none',
      })
    }
    else
    {
      cb(koutu_url);
    }
    return;
  }
  if(imgfunc.koutuing==1)
  {
    return;
  }
  imgfunc.koutuing=1;
  var that = this;
  var data = new Object();
  data.filename=file_name;
  data.apiname = 'koutu';
  mlib.request({
    'model': 'imgfunc',
    'data': data,
    'cachetime': 0,
    success(res) {
      console.log(res);
      imgfunc.koutuing=0;
      if(res.data.data.r==1)
      {
        wx.setStorageSync(file_name, res.data.data.url)
        cb(res.data.data.url);        
      }
      else if(res.data.data.r==0)
      {
        wx.showToast({
          title: res.data.data.msg,
          icon:'none',
        })
      }
      else if(res.data.data.r==2)
      {
        wx.setStorageSync(file_name, '-1')
        wx.showToast({
          title: '该图片无法抠图',
          icon:'none',
        })
      }
      else if(res.data.data.r==3)
      {
        wx.showToast({
          title: '服务器忙',
          icon:'none',
        })
      }
      else if(res.data.data.r==4)
      {
        wx.showToast({
          title:res.data.data.errorCode,
          icon:'none',
        })
      }
    },
    fail(res) {
      console.log(res);
      imgfunc.koutuing=0;
    }
  })
},
/**
 * 扣头像
 */
imgfunc.kouhead=function(url,cb){
  var file_name=mlib.urlfilename(url);
  console.log(file_name);
  var koutu_url=wx.getStorageSync("head_"+file_name);
  console.log(koutu_url);
  if(koutu_url!='')
  {
    console.log('使用缓存');
    if(koutu_url=='-1')
    {
      wx.showToast({
        title: '该图片无法抠图',
        icon:'none',
      })
    }
    else
    {
      cb(koutu_url);
    }
    return;
  }
  if(imgfunc.koutuing==1)
  {
    return;
  }
  imgfunc.koutuing=1;
  var that = this;
  var data = new Object();
  data.filename=file_name;
  data.apiname = 'kouhead';
  mlib.request({
    'model': 'imgfunc',
    'data': data,
    'cachetime': 0,
    success(res) {
      console.log(res);
      imgfunc.koutuing=0;
      if(res.data.data.r==1)
      {
        wx.setStorageSync("head_"+file_name, res.data.data.url)
        cb(res.data.data.url);        
      }
      else if(res.data.data.r==0)
      {
        wx.showToast({
          title: res.data.data.msg,
          icon:'none',
        })
      }
      else if(res.data.data.r==2)
      {
        wx.setStorageSync("head_"+file_name, '-1')
        wx.showToast({
          title: '该图片无法抠图',
          icon:'none',
        })
      }
      else if(res.data.data.r==3)
      {
        wx.showToast({
          title: '服务器忙',
          icon:'none',
        })
      }
      else if(res.data.data.r==4)
      {
        wx.showToast({
          title:res.data.data.errorCode,
          icon:'none',
        })
      }
    },
    fail(res) {
      console.log(res);
      imgfunc.koutuing=0;
    }
  })
},
module.exports = imgfunc;