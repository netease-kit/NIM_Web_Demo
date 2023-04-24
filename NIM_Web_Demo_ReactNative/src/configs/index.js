const env = 'online';

const appConfig = {
  // 用户的appkey
  // 用于在web demo中注册账号异步请求demo 服务器中使用
  test: {
    appkey: 'fe416640c8e8a72734219e1847ad2547',
    postUrl: 'https://apptest.netease.im',
  },
  online: {
    appkey: '45c6af3c98409b18a84451215d0bdd6e',
    postUrl: 'https://app.netease.im',
  },
};

const base = {
  // SDK 在store/actions中被引入
  // 资源路径根目录，为了方便用户部署在二级以上URL路径上
  resourceUrl: 'https://yx-web.nos-hz.163yun.com/webdoc/h5',
  // 用户logo地址
  logo: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/logo.png',
  // 默认用户头像
  defaultUserIcon: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/default-icon.png',
  // 默认普通群头像
  defaultGroupIcon: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/default-group.png',
  // 默认高级群头像
  defaultAdvancedIcon: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/default-advanced.png',
  // 系统通知图标
  noticeIcon: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/notice-icon.png',
  // 我的手机图标
  myPhoneIcon: 'https://yx-web.nos-hz.163yun.com/webdoc/h5/im/my-phone.png',
  // 本地消息显示数量，会影响性能
  localMsglimit: 36,
};

export default Object.assign(base, appConfig[env]);

