import { ToastPlugin } from 'vux'

const MyToastPlugin = Object.create(null)

MyToastPlugin.install = function (Vue) {
  Vue.use(ToastPlugin)
  // 此方法基于vux的ToastPlugin，需确保注册ToastPlugin插件,否则以alert进行提示。
  Vue.prototype.$toast = function (msg) {
    if (this.$vux.toast) {
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        position: 'middle'
      })
    } else {
      alert(msg)
    }
  }
}

export default MyToastPlugin