/* 此插件的设计仅是因为vue-touch官方还不支持vue 2.0 所做的过渡方案 */
/* 
 * 使用方法：
 * 1. 注册插件
 *  - import VueTouch from './plugins/touchEvent'
 *  - Vue.use(VueTouch)
 * 2. 侦听事件
 *  - <span v-touch:hold="func"></span>
 *  - 触摸方法： hold(长按) tap(短按) swiperight(右划) swipeleft(左划) swipetop swipedown
 *  - 绑定参数： dom节点的data-set属性
 */
import Vue from 'vue'

const TouchEventPlugin = Object.create(null)

TouchEventPlugin.install = function (Vue) {
  // 添加全局资源
  Vue.directive('touch', {
    //传入的模式 hold swiperight swipeleft swipetop swipedown tap
    bind: function (el, binding, vnode) {
      // Vue 编译生成的虚拟节点
      // vnode = (vnode && vnode.data && vnode.data.attrs) || {}
      vnode = vnode || {}
      // 传给指令的参数。例如 v-touch:swipeRight, arg 的值是 "swipeRight"
      let touchType = binding.arg.toLowerCase()
      var timeOutEvent = 0
      var direction = ''
      //滑动处理
      var startX = null
      var startY = null

      //返回角度
      function GetSlideAngle(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI
      }

      //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
      function GetSlideDirection (startX, startY, endX, endY) {
        let dy = startY - endY
        let dx = endX - startX
        let result = 0

        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
          return result
        }

        let angle = GetSlideAngle(dx, dy)
        if (angle >= -45 && angle < 45) {
          result = 'swiperight'
        } else if (angle >= 45 && angle < 135) {
          result = 'swipeup'
        } else if (angle >= -135 && angle < -45) {
          result = 'swipedown'
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 'swipeleft'
        }
        return result
      }


      el.addEventListener('touchstart', function (ev) {
        startX = ev.touches[0].pageX
        startY = ev.touches[0].pageY
          //判断长按
        timeOutEvent = setTimeout(() => {
          timeOutEvent = 0 
          if (touchType === 'hold'){
            binding.value(vnode)
          }
        } , 800)
      }, false)

      el.addEventListener('touchmove' , function (ev) {
        if (timeOutEvent) {
          clearTimeout(timeOutEvent)
          timeOutEvent = 0
        }
      })

      el.addEventListener('touchend', function (ev) {
        if (timeOutEvent) {
          clearTimeout(timeOutEvent)
          timeOutEvent = 0
        }
        let endX = ev.changedTouches[0].pageX
        let endY = ev.changedTouches[0].pageY
        direction = GetSlideDirection(startX, startY, endX, endY)
        switch (direction) {
          case 0:
            if (touchType === 'tap'){
              binding.value(vnode)
            }
            break
          case 'swipeup':
            if (touchType === 'swipeup'){
              binding.value(vnode)
            }
            break
          case 'swipedown':
            if (touchType === 'swipedown'){
              binding.value(vnode)
            }
            break
          case 'swipeleft':
            if (touchType === 'swipeleft'){
              binding.value(vnode)
            }
            break
          case 'swiperight':
            if (touchType === 'swiperight'){
              binding.value(vnode)
            }
            break
          default:
            break
        }
      }, false)
    }
  })
}

export default TouchEventPlugin