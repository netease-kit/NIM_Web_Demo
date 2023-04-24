// components/inputclear/inputclear.js
Component({
  /**
     * 组件的属性列表
     */
  properties: {
    type: {
      type: String,
      value: 'text'
    },
    placeholder: {
      type: String,
      value: '请输入内容'
    },
    maxlength: {
      type: Number,
      value: 10
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputVal: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 输入响应
     */
    bindInput(e) {
      this.setData({
        inputVal: e.detail.value
      })
      this.triggerEvent('inputClearChange', { data: this.data.inputVal }, {})
    },
    /**
     * 清除输入框
     */
    clearInput() {
      this.setData({
        inputVal: ''
      })
    },
    /**
     * 确定
     */
    confirmHandler() {
      this.triggerEvent('inputClearFinish', { data: this.data.inputVal }, {})
    }
  }
})
