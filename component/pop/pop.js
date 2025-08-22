// component/pop/pop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    ltxt: {
      type: String,
      value: ''
    },
    rtxt: {
      type: String,
      value: ''
    },
    ifshow: {
      type: Number,
      value: 0,
      observer: function (newval, oldval) {
        console.log('是否显示' + newval);
        this.setData({
          show_status: newval
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show_status:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    colse:function(){
      this.setData({
        show_status:0,
      })
      this.properties.ifshow=0;
    },
    /**
     * 左边按钮点击
     */
    l_onclick:function(){
      this.triggerEvent("lclick");
      this.setData({
        show_status: 0,
      })
      this.properties.ifshow = 0;
    },
    /**
     * 右边按钮点击
     */
    r_onclick: function () {
      this.triggerEvent("rclick");
      this.setData({
        show_status: 0,
      })
      this.properties.ifshow = 0;
    },
  }
})
