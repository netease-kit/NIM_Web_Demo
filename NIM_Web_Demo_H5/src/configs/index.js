let config = {
  sdk: 'NIM_Web_SDK_v6.1.0',
  // 用户自定义的登录注册地址
  loginUrl: '/webdemo/h5/login.html',
  registUrl: '/webdemo/h5/regist.html',
  homeUrl: '/webdemo/h5/index.html#/session',

  // 资源路径根目录，为了方便用户部署在二级以上URL路径上
  resourceUrl: 'http://yx-web-nosdn.netease.im/webdoc/h5',
  // 用户logo地址
  logo: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/logo.png',
  // 默认用户头像
  defaultUserIcon: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/default-icon.png',
  // 默认普通群头像
  defaultGroupIcon: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/default-group.png',
  // 默认高级群头像
  defaultAdvancedIcon: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/default-advanced.png',
  // 系统通知图标
  noticeIcon: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/notice-icon.png',
  // 我的手机图标
  myPhoneIcon: 'http://yx-web-nosdn.netease.im/webdoc/h5/im/my-phone.png',
  // 本地消息显示数量，会影响性能
  localMsglimit: 36,
  useDb: false
}

const env = 'online'

let appConfig = {
  // 用户的appkey
  // 用于在web demo中注册账号异步请求demo 服务器中使用
  test: {
    appkey: 'fe416640c8e8a72734219e1847ad2547',
    postUrl: 'https://apptest.netease.im'
  },
  online: {
    appkey: '45c6af3c98409b18a84451215d0bdd6e',
    postUrl: 'https://app.netease.im'
  }
}

config = Object.assign(config, appConfig[env])

export default config
