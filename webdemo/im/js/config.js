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
            appkey: 'bd632f1fc00a5c0a1af35ebf05c7f9e7'
        }
    };
    window.CONFIG = configMap[envir];
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true;
}())
