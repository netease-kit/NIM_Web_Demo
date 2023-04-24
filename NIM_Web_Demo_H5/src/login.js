import Vue from 'vue'

// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
FastClick.attach(document.body)

// 添加手势触摸事件，使用方法如 v-touch:swipeleft
import VueTouch from './plugins/touchEvent'
Vue.use(VueTouch)

import md5 from './utils/md5'
import cookie from './utils/cookie'

import config from './configs'

var formData = new Vue({
  el: '#form-data',
  data: {
    logo: config.logo,
    account: '',
    password: '',
    errorMsg: ''
  },
  mounted () {
    this.$el.style.display = ""
  },
  methods: {
    login () {
      if (this.account === '') {
        this.errorMsg = '帐号不能为空'
        return
      } else if (this.password === '') {
        this.errorMsg = '密码不能为空'
        return
      } else if (this.password.length < 6) {
        this.errorMsg = '密码至少需要6位'
        return
      }
      this.errorMsg = ''
      // 本demo做一次假登录
      // 真实场景应在此向服务器发起ajax请求
      let sdktoken = md5(this.password)
      // 服务端帐号均为小写
      cookie.setCookie('uid', this.account.toLowerCase())
      cookie.setCookie('sdktoken', sdktoken)
      location.href = config.homeUrl
    },
    regist () {
      location.href = config.registUrl
    }
  },
})