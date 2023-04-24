// components/inputmodal/inputmodal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached: function () {
    // let systemInfo = wx.getSystemInfoSync()
    
    // console.log(systemInfo)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.triggerEvent('inputModalClick', {data: 'cancel'}, {})
    },
    confirm() {
      this.triggerEvent('inputModalClick', { data: 'confirm' }, {})
    }
  }
})
