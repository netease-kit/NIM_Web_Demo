let startX = 0
Component({
  /**
   * 组件的初始数据
   */
  data: {
    translateX: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    deleteItem: function (e) {
      this.setData({
        translateX: 0
      })
      this.triggerEvent('deleteChatItem', {}, {bubbles: true})
    },
    /**
     * 滑动删除事件-滑动开始
     */
    touchStartHandler: function(e) {
      startX = e.touches[0].pageX
    },
    /**
     * 滑动删除事件-滑动
     */
    touchMoveHandler: function(e) {
      let pageX = e.touches[0].pageX
      let moveX = pageX - startX
      if(Math.abs(moveX) < 40) {
        return
      }
      // e.target.style.WebkitTransform = `translateX(${moveX}px)`
      if (moveX > 0) { // 右滑 隐藏删除
        if (Math.abs(this.data.translateX) == 0) {
          return
        } else {
          this.setData({
            translateX: 0
          })
        }
      } else { // 左滑 显示删除
        if (Math.abs(this.data.translateX) >= 80) {
          return
        } else {
          this.setData({
            translateX: -80
          })
        }
      }
    }
  }
})
