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
            appkey: '4632c2096f11c7027f5c3a5aef4bda31'
        }
    };
    window.CONFIG = configMap[envir];
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true;
}())
