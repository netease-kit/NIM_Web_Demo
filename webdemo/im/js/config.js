(function() {
    // 配置
    var envir = 'test';
    var configMap = {
        dev: {
            appkey: '39ce20c26fef2fe1d28cfe65dd9fe576',
            url:'https://apptest.netease.im'
        },
        test: {
            appkey: '39ce20c26fef2fe1d28cfe65dd9fe576',
            url:'https://apptest.netease.im'
        },
        pre:{
            appkey: '45c6af3c98409b18a84451215d0bdd6e',
    		url:'http://preapp.netease.im:8184'
        },
        online: {
            appkey: '45c6af3c98409b18a84451215d0bdd6e',
            url:'https://app.netease.im'
        }
    };
    window.CONFIG = configMap[envir];
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true
}())