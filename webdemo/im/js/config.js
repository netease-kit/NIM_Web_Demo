(function() {
    // 配置
    var envir = 'online';
    var configMap = {
        dev: {
            appkey: 'fe416640c8e8a72734219e1847ad2547',
            url: 'https://apptest.netease.im'
        },
        test: {
            appkey: 'fe416640c8e8a72734219e1847ad2547',
            url: 'https://apptest.netease.im'
        },
        pre: {
            appkey: '45c6af3c98409b18a84451215d0bdd6e',
            url: 'http://preapp.netease.im:8184'
        },
        online: {
            appkey: '45c6af3c98409b18a84451215d0bdd6e',
            url: 'https://app.netease.im'
            // lbsUrl:'http://115.238.125.243:38080/lbs/webconf.jsp',
            // secure: false,
            // uploadUrl:'http://115.238.125.243:80',
            // downloadUrl: 'http://115.238.122.62:9000'
        }
    };
    window.CONFIG = configMap[envir];
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true
}())