(function() {
    // 配置
    var envir = 'online';
    var configMap = {
        dev: {
            appkey: ''
        },
        test: {
            appkey: ''
        },
        pre:{
            appkey: ''
        },
        online: {
            appkey: ''
        }
    };
    window.CONFIG = configMap[envir];
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true;
}())
