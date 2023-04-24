// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'

// // 添加Fastclick移除移动端点击延迟
// import FastClick from 'fastclick'
// FastClick.attach(document.body)

// 添加手势触摸事件，使用方法如 v-touch:swipeleft
import VueTouch from './plugins/touchEvent'
Vue.use(VueTouch)

// import VueRecyclerviewNew from 'vue-recyclerview'
// Vue.use(VueRecyclerviewNew)

// 同步单页路由与数据中心
import store from './store'
import router from './router'

require('./utils/polyfill')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
