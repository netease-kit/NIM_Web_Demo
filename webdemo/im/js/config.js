(function() {
  // 配置
  var envir = 'online';
  var configMap = {
    dev: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    test: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    pre: {
      appkey: '45c6af3c98409b18a84451215d0bdd6e',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    online: {
      appkey: '45c6af3c98409b18a84451215d0bdd6e',
      url: 'https://app.netease.im',
      chatroomList: 'https://app.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://app.netease.im/api/chatroom/requestAddress'
    }
  };
  window.CONFIG = configMap[envir];
  // 是否开启订阅服务
  window.CONFIG.openSubscription = true;
  //   window.CONFIG.privateConf = window.privateConf;
})();
