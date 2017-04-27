/*
 * 点对点音视频通话控制逻辑
 */
(function() {

    function NetcallBridge(yx) {
        this.yx = yx;
        this.$msgInput = $("#messageText");
        this.$netcallAudioLink = $("#showNetcallAudioLink");
        this.$netcallVideoLink = $("#showNetcallVideoLink");
        this.$netcallBox = $("#netcallBox");
        this.$chatBox = $("#chatBox");
        this.$callingHangupButton = $("#callingHangupButton"); // 呼叫对方时，挂断按钮
        this.$videoShowBox = $(".netcall-show-video");
        this.$audioShowBox = $(".netcall-show-audio");
        this.$hangupButton = $(".hangupButton");
        this.$callingBox = $(".netcall-calling-box");
        this.$beCallingBox = $(".netcall-becalling-box");
        this.$beCallingAcceptButton = $(".beCallingAcceptButton");
        this.$beCallingRejectButton = $(".beCallingRejectButton");
        this.$beCallingText = $("#becallingText");
        this.$switchToVideoButton = $("#switchToVideo");
        this.$switchToAudioButton = $("#switchToAudio");
        this.$toggleFullScreenButton = $(".toggleFullScreenButton");
        this.$goNetcall = $(".m-goNetcall");
        this.$switchViewPositionButton = $(".switchViewPositionButton");
        this.$videoRemoteBox = this.$netcallBox.find(".netcall-video-remote");
        this.$videoLocalBox = this.$netcallBox.find(".netcall-video-local");
        // 麦克风 扬声器 摄像头 控制按钮
        this.$controlItem = this.$netcallBox.find(".control-item");
        // Netcall 实例
        this.netcall = null;
        // 呼叫超时检查定时器
        this.callTimer = null;
        // 音频或视频通话
        this.type = null;
        // 是否处于通话流程中
        this.netcallActive = false;
        // 通话流程的另一方账户
        this.netcallAccount = "";
        // 通话时长
        this.netcallDuration = 0;
        // 通话正式开始时间戳
        this.netcallStartTime = 0;
        // 通话时长定时器
        this.netcallDurationTimer = null;
        // 音视频流配置
        this.sessionConfig = {
            videoQuality: Netcall.CHAT_VIDEO_QUALITY_480P,
            videoFrameRate: Netcall.CHAT_VIDEO_FRAME_RATE_NORMAL,
            videoBitrate: 0,
            recordVideo: false,
            recordAudio: false,
            highAudio: false
        };
        // 是否开启摄像头输入
        this.deviceVideoInOn = true;
        // 是否开启音频输入
        this.deviceAudioInOn = true;
        // 是否开启扬声器输出
        this.deviceAudioOutOn = true;
        // 是否全屏状态
        this.isFullScreen = false;
        // 本地agent连接状态
        this.signalInited = false;
        // agent程序下载地址
        this.agentDownloadUrl = "http://yx-web.nos.netease.com/package/NIMWebAgent_Setup_V2.0.0.rar";
        // 开始初始化
        this.init();
    }
    NetcallBridge.fn = NetcallBridge.prototype;
    NetcallBridge.fn.init = function() {
        this.initEvent();
        this.initNetcall();
    };
    NetcallBridge.fn.initEvent = function() {
        var that = this;
        // 点击发起音频通话按钮
        this.$netcallAudioLink.on("click", this.onClickNetcallLink.bind(this, Netcall.NETCALL_TYPE_AUDIO));
        // 点击发起视频通话按钮
        this.$netcallVideoLink.on("click", this.onClickNetcallLink.bind(this, Netcall.NETCALL_TYPE_VIDEO));
        // 呼叫中挂断
        this.$callingHangupButton.on("click", this.cancelCalling.bind(this, true));
        // 被呼叫中接受
        this.$beCallingAcceptButton.on("click", this.accept.bind(this));
        // 被呼叫中拒绝
        this.$beCallingRejectButton.on("click", this.reject.bind(this));
        this.$beCallingBox.find("#downloadAgentButton").on("click", this.clickDownloadAgent.bind(this));
        // 通话中挂断
        this.$hangupButton.on("click", this.hangup.bind(this));
        // 切换为视频通话
        this.$switchToVideoButton.on("click", this.requestSwitchToVideo.bind(this));
        // 切换为音频通话
        this.$switchToAudioButton.on("click", this.requestSwitchToAudio.bind(this));
        // 切换全屏状态
        this.$toggleFullScreenButton.on("click", this.toggleFullScreen.bind(this));
        // 点击右上角悬浮框返回到音视频通话聊天界面
        this.$goNetcall.on("click", this.doOpenChatBox.bind(this));
        // 视频通话时，切换自己和对方的画面显示位置
        this.$switchViewPositionButton.on("click", this.switchViewPosition.bind(this));
        // 点击扬声器控制按钮
        this.volumeDebounceState = null;
        this.volumeStateTimeout = null;
        this.$controlItem.find(".icon-volume").click(function(event) {
            if ($(event.target).parent().is(".no-device")) return;
            if(this.volumeDebounceState !== null) {
                this.volumeDebounceState = !this.volumeDebounceState;
            } else {
                this.volumeDebounceState = !this.deviceAudioOutOn;
            }
            if(this.volumeStateTimeout) clearTimeout(this.volumeStateTimeout);
            this.volumeStateTimeout = setTimeout(function() {
                this.volumeStateTimeout = null;
                if(this.volumeDebounceState !== this.deviceAudioOutOn) {
                    var nextState = !this.deviceAudioOutOn
                    that.setDeviceAudioOut(nextState);
                    this.deviceAudioOutOn = nextState;
                }
                this.volumeDebounceState = null;
            }.bind(this), 300)
            $(".icon-volume").toggleClass("icon-disabled", !this.volumeDebounceState);
        }.bind(this));
        // 点击麦克风控制按钮
        this.microDebounceState = null;
        this.microStateTimeout = null;
        this.$controlItem.find(".icon-micro").click(function(event) {
            if ($(event.target).parent().is(".no-device")) return;
            if(this.microDebounceState !== null) {
                this.microDebounceState = !this.microDebounceState;
            } else {
                this.microDebounceState = !this.deviceAudioInOn;
            }
            if(this.microStateTimeout) clearTimeout(this.microStateTimeout);
            this.microStateTimeout = setTimeout(function() {
                this.microStateTimeout = null;
                if(this.microDebounceState !== this.deviceAudioInOn) {
                    var nextState = !this.deviceAudioInOn;
                    this.setDeviceAudioIn(nextState);
                    this.deviceAudioInOn = nextState;
                }
                this.microDebounceState = null;
            }.bind(this), 300)
            $(".icon-micro").toggleClass("icon-disabled", !this.microDebounceState);
        }.bind(this));
        // 点击摄像头控制按钮
        this.cameraDebounceState = null;
        this.cameraStateTimeout = null;
        this.$controlItem.find(".icon-camera").click(function(event) {
            if ($(event.target).parent().is(".no-device")) return;
            if(this.cameraDebounceState !== null) {
                this.cameraDebounceState = !this.cameraDebounceState;
            } else {
                this.cameraDebounceState = !this.deviceVideoInOn;
            }
            if(this.cameraStateTimeout) clearTimeout(this.cameraStateTimeout);
            this.cameraStateTimeout = setTimeout(function() {
                this.cameraStateTimeout = null;
                if(this.cameraDebounceState !== this.deviceVideoInOn) {
                    var nextState = !this.deviceVideoInOn;
                    this.setDeviceVideoIn(nextState);
                    this.deviceVideoInOn = nextState;
                }
                this.cameraDebounceState = null;
            }.bind(this), 300)
            $(".icon-camera").toggleClass("icon-disabled", !this.cameraDebounceState);

        }.bind(this));
        // 麦克风、摄像头按钮在hover的时候显示音量调节的slider
        this.$controlItem.hover(function(){
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }
            $(this).find(".slider").removeClass("hide");
        },function(){
            this.hoverTimer = setTimeout(function(){
                $(this).find(".slider").addClass("hide");
            }.bind(this), 250);
        });
        // 初始化音量调节slider
        function doRangeSliderInit(id, fn){
            $(id).rangeslider({
                polyfill: false,
                onSlide: function(position, value) {
                    $(id).parent().find(".txt").text(value);
                },
                onSlideEnd: function(position, value) {
                    this.netcall[fn](parseInt(255 * value / 10));
                }.bind(this)
            });
        }
        doRangeSliderInit = doRangeSliderInit.bind(this);
        var map = {
            "#microSliderInput": "setCaptureVolume",
            "#microSliderInput1": "setCaptureVolume",
            "#volumeSliderInput": "setPlayVolume",
            "#volumeSliderInput1": "setPlayVolume"
        };
        for (var id in map) {
            doRangeSliderInit(id, map[id]);
        }
        // 无可用设备时，鼠标hover音视频控制按钮，展示tooltip
        $(".netcall-box").tooltip({
            items:".control-item.no-device",
            classes:{"ui-tooltip": "ui-tooltip-netcall"},
            position: {
                my: "center bottom-14",
                at: "center top",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                        .addClass( "arrow" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                }
            }
        });
    };

    NetcallBridge.fn.initNetcall = function() {
        var NIM = window.SDK.NIM;
        var Netcall = window.Netcall;
        NIM.use(Netcall);
        var netcall = this.netcall = Netcall.getInstance({
            nim: window.nim,
            mirror:true,
            mirrorRemote: false,
            /*kickLast: true,*/
            container: $(".netcall-video-local")[0],
            remoteContainer: $(".netcall-video-remote")[0]
        });
        // 相关事件
        // signalClosed devices beCalling callRejected callAccepted deviceStatus streamResize remoteStreamResize
        // callerAckSync hangup control netStatus statistics audioVolumn

        netcall.on("callAccepted", this.onCallAccepted.bind(this)); // 对方接受通话 或者 我方接受通话，都会触发
        netcall.on("callRejected", this.onCallingRejected.bind(this));
        netcall.on('signalClosed', function() {
            console.log("signal closed");
            this.signalInited = false;
                this.showTip("信令断开了", 2000, function(){
                this.beCalling = false;
                this.beCalledInfo = null;
                this.netcall.hangup();
                this.hideAllNetcallUI();
            }.bind(this));
        }.bind(this));
        netcall.on("devices", function(obj){
            console.log("on devices:", obj);
            //this.checkDeviceStateUI();
        }.bind(this));
        netcall.on("deviceStatus", function(obj) {
            console.log("on deviceStatus:", obj);
            this.checkDeviceStateUI();
        }.bind(this));

        netcall.on("beCalling", this.onBeCalling.bind(this));
        netcall.on("control", this.onControl.bind(this));
        netcall.on("hangup", this.onHangup.bind(this));
        netcall.on("heartBeatError", function(obj) {
            console.log("heartBeatError,要重建信令啦");
        });
        netcall.on("callerAckSync", this.onCallerAckSync.bind(this));
        netcall.on("netStatus", function(obj) {
            console.log("on net status:", obj);
        });
        netcall.on("streamResize", function(){
            console.log("stream resize", arguments)
        })
    };

    NetcallBridge.fn.onControl = function(obj) {
        console.log("on control:",obj);
        var netcall = this.netcall;
        // 如果不是当前通话的指令, 直接丢掉
        if (netcall.notCurrentChannelId(obj)) {
            this.log("非当前通话的控制信息");
            return;
        }
        var type = obj.type;
        switch(type) {
            // NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON 通知对方自己打开了音频
            case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON:
                this.log("对方打开了麦克风");
                break;
            // NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF 通知对方自己关闭了音频
            case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF:
                this.log("对方关闭了麦克风");
                break;
            // NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON 通知对方自己打开了视频
            case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON:
                this.log("对方打开了摄像头");
                this.$videoRemoteBox.toggleClass("empty", false).find(".message").text("");
                break;
            // NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF 通知对方自己关闭了视频
            case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF:
                this.log("对方关闭了摄像头");
                this.$videoRemoteBox.toggleClass("empty", true).find(".message").text("对方关闭了摄像头");
                break;
            // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT 拒绝从音频切换到视频
            case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT:
                this.log("对方拒绝从音频切换到视频通话");
                this.requestSwitchToVideoRejected();
                break;
            // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO 请求从音频切换到视频
            case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO:
                this.log("对方请求从音频切换到视频通话");
                if (this.requestSwitchToVideoWaiting) {
                    this.doSwitchToVideo();
                } else {
                    this.beingAskSwitchToVideo();
                }
                break;
            // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE 同意从音频切换到视频
            case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE:
                this.log("对方同意从音频切换到视频通话");
                if (this.requestSwitchToVideoWaiting) {
                    this.doSwitchToVideo();
                }
                break;
            // NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO 从视频切换到音频
            case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO:
                this.log("对方请求从视频切换为音频");
                this.doSwitchToAudio();
                break;
            // NETCALL_CONTROL_COMMAND_BUSY 占线
            case Netcall.NETCALL_CONTROL_COMMAND_BUSY:
                this.log("对方正在通话中");
                this.log("取消通话");
                this.netcall.hangup();
                this.clearCallTimer();
                this.isBusy = true;
                this.sendLocalMessage("对方正在通话中");
                function doEnd(){
                    this.cancelCalling();
                }
                doEnd = doEnd.bind(this);
                if(this.afterPlayRingA) {
                    this.afterPlayRingA = function(){
                        this.playRing("C", 3, function(){
                            this.showTip("对方正在通话中", 2000, doEnd);
                        }.bind(this));
                    }.bind(this);
                } else {
                    this.clearRingPlay();
                    this.playRing("C", 3, function(){
                        this.showTip("对方正在通话中", 2000, doEnd);
                    }.bind(this));
                }
                break;
            // NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID 自己的摄像头不可用
            case Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID:
                this.log("对方摄像头不可用");
                this.$videoRemoteBox.toggleClass("empty", true).find(".message").text("对方摄像头不可用");
                break;
            // NETCALL_CONTROL_COMMAND_SELF_ON_BACKGROUND 自己处于后台
            // NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED 告诉发送方自己已经收到请求了（用于通知发送方开始播放提示音）
            // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_START 通知对方自己开始录制视频了
            // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_STOP 通知对方自己结束录制视频了
        }
    };
    // 对方请求音频切换为视频时
    NetcallBridge.fn.beingAskSwitchToVideo = function() {
        function agree() {
            this.log("同意切换到视频通话");
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE
            });
            this.netcall.switchAudioToVideo();
            this.setDeviceVideoIn(true);
            this.netcall.startLocalStream();
            this.netcall.startRemoteStream();
            this.updateVideoShowSize(true, true);
            this.type = Netcall.NETCALL_TYPE_VIDEO;
            this.showConnectedUI(Netcall.NETCALL_TYPE_VIDEO);
            // 更新右上角悬浮框中的音视频图标
            this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
            this.$videoRemoteBox.find(".message").text("");
            $("#askSwitchToVideoDialog").dialog( "close" );
            this.$switchToAudioButton.toggleClass("disabled", false);
        }
        function reject() {
            this.log("拒绝切换到视频通话");
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT
            });
            $( "#askSwitchToVideoDialog").dialog( "close" );
        }
        // 弹窗提示用户
        $( "#askSwitchToVideoDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-2"
            },
            close: function(e){
                if(e && e.originalEvent) { // 点击 x 关闭时
                    reject.call(this);
                }
            }.bind(this),
            buttons: {
                "开始视频": agree.bind(this),
                "拒绝": reject.bind(this)
            }
        });
    };
    // 我方请求音频切换到视频通话，对方同意时
    NetcallBridge.fn.doSwitchToVideo = function() {
        this.log("切换到视频通话")
        this.requestSwitchToVideoWaiting = false;
        this.type = Netcall.NETCALL_TYPE_VIDEO;
        this.$switchToAudioButton.toggleClass("disabled", false);
        this.netcall.switchAudioToVideo();
        this.setDeviceVideoIn(true);
        this.startLocalStream();
        this.startRemoteStream();
        this.$videoRemoteBox.toggleClass("empty",false).find(".message").text("");
        this.updateVideoShowSize(true, true);
        this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
        this.checkDeviceStateUI();
    };
    NetcallBridge.fn.requestSwitchToVideoRejected = function() {
        this.requestSwitchToVideoWaiting = false;
        $(".netcall-video-remote .message").text("");
        this.showTip("对方拒绝切换为视频聊天", 2000, function() {
            this.showConnectedUI(Netcall.NETCALL_TYPE_AUDIO);
            this.setDeviceVideoIn(false);
            this.stopLocalStream();
        }.bind(this));

    };
    NetcallBridge.fn.requestSwitchToVideo = function() {
        this.log("请求切换到视频通话");
        this.requestSwitchToVideoWaiting = true; // 标志请求中的状态
        this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO
        });
        this.showConnectedUI(Netcall.NETCALL_TYPE_VIDEO);
        this.updateVideoShowSize(true);
        this.$videoRemoteBox.toggleClass("empty",true).find(".message").text("正在等待对方开启摄像头");
        this.setDeviceVideoIn(true);
        this.startLocalStream();
    };
    NetcallBridge.fn.doSwitchToAudio = function() {
        this.log("切换到音频通话");
        this.type = Netcall.NETCALL_TYPE_AUDIO;
        this.netcall.switchVideoToAudio().then(function() {
            this.setDeviceVideoIn(false);
            this.stopLocalStream();
            this.stopRemoteStream();
        }.bind(this));
        this.showConnectedUI(Netcall.NETCALL_TYPE_AUDIO);
        this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
    };
    NetcallBridge.fn.stopLocalStream = function(){
        this.log("停止本地流显示 stopLocalStream");
        try{
            this.netcall.stopLocalStream();
        }catch(e){
            this.log("停止本地流失败");
            console && console.warn && console.warn(e);
        }
    };
    NetcallBridge.fn.stopRemoteStream = function(){
        this.log("停止远端流显示 stopRemoteStream");
        try{
            this.netcall.stopRemoteStream();
        }catch(e){
            this.log("停止远端流失败");
            console && console.warn && console.warn(e);
        }
    };
    NetcallBridge.fn.startLocalStream = function(){
        this.log("开启本地流显示 startLocalStream");
        try{
            this.netcall.startLocalStream();
        }catch(e){
            this.log("开启本地流失败");
            console && console.warn && console.warn(e);
        }
    };
    NetcallBridge.fn.startRemoteStream = function(){
        this.log("开启远断流显示 startRemoteStream");
        try{
            this.netcall.startRemoteStream();
        }catch(e){
            this.log("开启远断流失败");
            console && console.warn && console.warn(e);
        }
    };
    NetcallBridge.fn.requestSwitchToAudio = function() {
        this.log("请求切换到音频流");
        if(this.$switchToAudioButton.is(".disabled")) return;
        this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO
        });
        this.doSwitchToAudio();
    };
    // 同意音视频通话
    NetcallBridge.fn.accept = function() {
        if(this.$beCallingAcceptButton.is(".disabled")) return;
        if(!this.beCalling) return;
        this.log("同意对方音视频请求");
        this.beCalling = false;
        this.$beCallingAcceptButton.toggleClass("loading", true);
        this.netcall.response({
            accepted: true,
            beCalledInfo: this.beCalledInfo,
            sessionConfig: this.sessionConfig
        }).then(function(){
            this.log("同意对方音视频请求成功");
            // 加个定时器 处理点击接听了 实际上对面杀进程了，没有callAccepted回调
            this.acceptAndWait = true;
            setTimeout(function(){
                if (this.acceptAndWait) {
                    this.hideAllNetcallUI();
                    this.hangup()
                    this.acceptAndWait = false;
                }
            }.bind(this), 6000)

        }.bind(this)).catch(function(err) {
            this.log("同意对方音视频通话失败，转为拒绝");
            console.log("error info:", err);
            this.$beCallingAcceptButton.toggleClass("loading", false);
            this.reject();
        }.bind(this));
    };
    // 拒绝音视频通话
    NetcallBridge.fn.reject = function() {
        if (!this.beCalling) return;
        this.log("拒绝对方音视频通话请求");
        var beCalledInfo = this.beCalledInfo;
        this.netcall.response({
            accepted: false,
            beCalledInfo: beCalledInfo
        }).then(function(){
            this.log("拒绝对方音视频通话请求成功");
            this.sendLocalMessage("已拒绝");
            this.beCalledInfo = null;
            this.beCalling = false;
            this.hideAllNetcallUI();
        }.bind(this)).catch(function(err){
            this.log("拒绝对方音视频通话请求失败");
            console.log("error info:", err);
        }.bind(this));

    };

    // 取消呼叫
    NetcallBridge.fn.cancelCalling = function(isClick) {
        if(isClick === true && this.$callingHangupButton.is(".disabled")) return;

        if(!this.isBusy){
            this.log("取消呼叫");
            this.netcall.hangup();
        }
        this.clearCallTimer();
        this.clearRingPlay();
        if(isClick === true && !this.isBusy) this.sendLocalMessage("未接通");
        this.hideAllNetcallUI();
    };
    // 聊天窗口添加本地消息
    NetcallBridge.fn.sendLocalMessage = function(text, to) {
        if(!to) to = this.netcallAccount;
        setTimeout(function(){
            this.yx.mysdk.sendTextMessage("p2p", to, text, true, function(error, msg){
                this.yx.cache.addMsgs(msg);
                this.yx.$chatContent.find('.no-msg').remove();
                var msgHtml = appUI.updateChatContentUI(msg,this.yx.cache);
                this.yx.$chatContent.append(msgHtml).scrollTop(99999);
            }.bind(this));
        }.bind(this), 100);

    };
    // 挂断通话过程
    NetcallBridge.fn.hangup = function() {
        this.netcall.hangup();
        this.beCalledInfo = null;
        this.beCalling = false;
        this.setDeviceAudioIn(false);
        this.setDeviceAudioOut(false);
        this.setDeviceVideoIn(false);
        this.hideAllNetcallUI();
        this.stopRemoteStream();
        this.stopLocalStream();
    };
    // 其它端已处理
    NetcallBridge.fn.onCallerAckSync = function(obj) {
        this.log("其它端已处理");
        if (this.beCalledInfo && obj.channelId === this.beCalledInfo.channelId) {

            console.log("on caller ack async:", obj);
            this.showTip("其它端已处理", 2000, function(){
                this.sendLocalMessage("其它端已处理");
                this.beCalledInfo = false;
                this.beCalling = false;
                this.hideAllNetcallUI();
            }.bind(this));

        }
    };
    // 对方挂断通话过程
    // 1. 通话中挂断
    // 2. 请求通话中挂断
    NetcallBridge.fn.onHangup = function(obj) {
        this.log("收到对方挂断通话消息");
        console.log("on hange up", obj);
        console.log(this.beCalling, this.beCalledInfo, this.netcallDurationTimer);
        if(this.netcallDurationTimer !== null && this.netcall.notCurrentChannelId(obj)){
            return this.log("挂断消息不属于当前活动通话，忽略1");
        }
        if(this.netcallDurationTimer === null && this.beCalling && this.beCalledInfo.channelId !== obj.channelId) {
            return this.log("挂断消息不属于当前活动通话，忽略2");
        }
        if(this.netcallDurationTimer === null && !this.beCalling) {
            return this.log("挂断消息不属于当前活动通话，忽略3，当前无通话活动");
        }
        try{
            $("#askSwitchToVideoDialog").dialog( "close" );
        }catch(e){}

        /* var tipText;
        if(this.netcallDurationTimer !== null) {
            // this.sendLocalMessage("通话拨打时长" + this.getDurationText(this.netcallDuration));
            tipText = "对方已挂断";
        } else {
            // var to = obj.account;
            tipText = "对方已挂断";
            // this.sendLocalMessage("未接听", to);
        } */
        this.showTip("对方已挂断", 2000, function(){
            this.beCalling = false;
            this.beCalledInfo = null;
            this.hideAllNetcallUI();
            this.setDeviceVideoIn(false);
            this.setDeviceAudioIn(false);
            this.setDeviceAudioOut(false);
        }.bind(this));


    };
    // 打开当前音视频通话对象的聊天窗口
    NetcallBridge.fn.doOpenChatBox = function() {
        var account = this.netcallAccount;
        this.yx.openChatBox(account, 'p2p');
    };
    // 被呼叫
    NetcallBridge.fn.onBeCalling = function(obj) {
        this.log("收到音视频呼叫");
        console.log("on be calling:", obj);
        var channelId = obj.channelId;
        var netcall = this.netcall;
        var that = this;
        netcall.control({
            channelId: channelId,
            command: Netcall.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
        });
        // 只有在没有通话并且没有被叫的时候才记录被叫信息, 否则通知对方忙并拒绝通话
        if (!netcall.calling && !this.beCalling) {
            this.type = obj.type;
            this.beCalling = true;
            this.beCalledInfo = obj;
            var account = obj.account;
            this.netcallActive = true;
            this.netcallAccount = account;
            this.doOpenChatBox(account);
            this.showBeCallingUI(obj.type);
            this.updateBeCallingSupportUI(true, true);
            var playRingE = function(){
                this.playRing("E", 10, playRingE);
            }.bind(this);
            playRingE();

            // 检查是否支持
            // signal只做检测
            this.checkNetcallSupporting(function() {
                that.updateBeCallingSupportUI(true);
                this.checkDeviceStateUI();
            }.bind(this), function(){
                // 平台不支持
                that.reject();
            }, function(){
                // agent调用失败
                that.updateBeCallingSupportUI(false);
            }, true, true);
            $(".asideBox .nick").text(this.yx.getNick(account));
            
        } else {
            /*var busy = false;
            if (netcall.calling) {
                busy = netcall.notCurrentChannelId(obj);
            } else if (this.beCalling) {
                busy = this.beCalledInfo.channelId !== channelId;
            }
            if (busy) {
                console.log("busy");
                netcall.control({
                    channelId: channelId,
                    command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
                });
                /!* netcall.response({
                    accepted: false,
                    beCalledInfo: obj
                }); *!/
            }*/
            this.log("通知呼叫方我方不空");
            netcall.control({
                channelId: channelId,
                command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
            });
        }
    };
    // 对方接受通话 或者 我方接受通话，都会触发
    NetcallBridge.fn.onCallAccepted = function(obj) {
        this.log("音视频通话开始");
        this.acceptAndWait = false;
        this.type = obj.type;
        this.showConnectedUI(obj.type);
        this.clearCallTimer();
        this.clearRingPlay();
        this.$beCallingAcceptButton.toggleClass("loading", false);
        this.$switchToAudioButton.toggleClass("disabled", false);
        if (obj.type === Netcall.NETCALL_TYPE_VIDEO) {
            this.setDeviceAudioIn(true);
            this.setDeviceAudioOut(true);
            this.setDeviceVideoIn(true);
            this.netcall.startLocalStream();
            this.netcall.startRemoteStream();
            $("#videoWaitingAcceptedTip").toggleClass("hide",true);
            $("#microSliderInput1").val(10).change();
            $("#volumeSliderInput1").val(10).change();
            this.updateVideoShowSize(true, true);
        } else {
            this.setDeviceAudioIn(true);
            this.setDeviceAudioOut(true);
            this.setDeviceVideoIn(false);
            $("#microSliderInput").val(10).change();
            $("#volumeSliderInput").val(10).change();
        }
        // 设置采集和播放音量
        this.netcall.setCaptureVolume(255);
        this.netcall.setPlayVolume(255);
        // 通话时长显示
        this.startDurationTimer();


    };
    // 对方拒绝通话
    NetcallBridge.fn.onCallingRejected = function(obj) {
        this.log("对方拒绝音视频通话");
        this.showTip("对方已拒绝", 2000, this.hideAllNetcallUI.bind(this));
        this.clearCallTimer();
        this.sendLocalMessage("对方已拒绝");
    };

    // 发起音视频呼叫
    NetcallBridge.fn.doCalling = function(type){
        this.log("发起音视频呼叫");
        this.type = type;
        var netcall = this.netcall;
        var account = this.yx.crtSessionAccount;
        this.netcallAccount = account;
        this.netcallActive = true;
        this.$goNetcall.find(".nick").text(this.yx.getNick(this.netcallAccount));
        this.showCallingUI();
        var deviceType = type === Netcall.NETCALL_TYPE_VIDEO ? Netcall.DEVICE_TYPE_VIDEO : Netcall.DEVICE_TYPE_AUDIO_IN;
        /*netcall.getDevicesOfType(type).then(function(obj) {
            if (!obj.devices.length) {
                // return alert("无视频设备");
            }
        }.bind(this));*/
        this.checkDeviceStateUI();
        this.afterPlayRingA = function(){};
        this.playRing("A", 1, function(){
            this.afterPlayRingA && this.afterPlayRingA();
            this.afterPlayRingA = null;
        }.bind(this));
        netcall.call({
            type: type,
            account: account,
            pushConfig: {
                enable: true,
                needBadge: true,
                needPushNick: true,
                pushContent: '',
                custom: '',
                pushPayload: '',
                sound: ''
            },
            sessionConfig: this.sessionConfig
        }).then(function(obj){
            this.log("发起通话成功，等待对方接听");
            // 设置超时计时器
            this.callTimer = setTimeout(function() {
                if (!netcall.callAccepted) {
                    this.log("超时无人接听");
                    this.showTip("无人接听", 2000, this.cancelCalling.bind(this));
                    this.sendLocalMessage("无人接听");
                }
            }.bind(this), 1000 * 60);

            if(this.afterPlayRingA) {
                this.afterPlayRingA = function(){
                    this.playRing("E", 60);
                }.bind(this);
            } else {
                this.playRing("E", 60);
            }

        }.bind(this)).catch(function(err) {
            console.log("发起音视频通话请求失败：", err);
            this.log("发起音视频通话请求失败");
            if (err && err.code === 11001) {
                this.log("发起音视频通话请求失败，对方不在线");
                if(this.afterPlayRingA) {
                    this.afterPlayRingA = function(){
                        this.showTip("对方不在线", 3000, this.cancelCalling.bind(this));
                        this.sendLocalMessage("对方不在线");
                    }.bind(this);
                } else {
                    this.showTip("对方不在线", 3000, this.cancelCalling.bind(this));
                    this.sendLocalMessage("对方不在线");
                }
            } else {
                this.cancelCalling();
            }

        }.bind(this));
    };

    NetcallBridge.fn.setDeviceAudioIn = function (state) {
        if(state) {
            this.log("开启麦克风");
            this.netcall.startDevice({
                // 开启麦克风输入
                type: Netcall.DEVICE_TYPE_AUDIO_IN
            }).then(function() {
                this.log("开启麦克风成功，通知对方我方开启了麦克风");
                // 通知对方自己开启了麦克风
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
                })
            }.bind(this)).catch(function() {
                console.log("开启麦克风失败");
                this.log("开启麦克风失败");
            }.bind(this));
        } else {
            this.log("关闭麦克风");
            this.netcall
                .stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN) // 关闭麦克风输入
                .then(function() {
                    this.log("关闭麦克风成功，通知对方我方关闭了麦克风");
                    // 通知对方自己关闭了麦克风
                    this.netcall.control({
                        command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
                    });
                }.bind(this)).catch(function(){
                this.log("关闭麦克风失败");
            }.bind(this));
        }
        $(".icon-micro").toggleClass("icon-disabled", !state);
        this.deviceAudioInOn = !!state;

    };
    NetcallBridge.fn.setDeviceAudioOut = function(state) {
        if (state) {
            this.log("开启扬声器");
            this.netcall.startDevice({
                type: Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT
            }).then(function(){
                this.log("开启扬声器成功");
            }.bind(this)).catch(function() {
                console.log("开启扬声器失败");
                this.log("开启扬声器失败");
            }.bind(this));
        } else {
            this.log("关闭扬声器");
            this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT).then(function(){
                this.log("关闭扬声器成功");
            }.bind(this)).catch(function(){
                this.log("关闭扬声器失败");
            }.bind(this));
        }
        $(".icon-volume").toggleClass("icon-disabled", !state);
        this.deviceAudioOutOn = !!state;

    };
    NetcallBridge.fn.setDeviceVideoIn = function(state) {
        if (state) {
            this.log("开启摄像头");
            this.netcall.startDevice({
                type: Netcall.DEVICE_TYPE_VIDEO
                /* width: this.videoCaptureSize.width,
                 height: this.videoCaptureSize.height */
            }).then(function() {
                this.log("开启摄像头成功，通知对方己方开启了摄像头");
                // 通知对方自己开启了摄像头
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON
                });
                $(".netcall-video-local").toggleClass("empty", false);
                $(".netcall-video-local .message").text("");
            }.bind(this)).catch(function() {
                // 通知对方自己的摄像头不可用
                this.log("开启摄像头失败，通知对方己方摄像头不可用");
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
                });
                console.log("摄像头不可用");
            }.bind(this));

        } else {
            this.log("关闭摄像头");
            this.netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO).then(function() {
                // 通知对方自己关闭了摄像头
                this.log("关闭摄像头成功，通知对方我方关闭了摄像头");
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF
                });
                $(".netcall-video-local").toggleClass("empty", true);
                $(".netcall-video-local .message").text("您关闭了摄像头");
            }.bind(this)).catch(function(e){
                this.log("关闭摄像头失败");
            }.bind(this));

        }
        $(".icon-camera").toggleClass("icon-disabled", !state);
        this.deviceVideoInOn = !!state;
    };
    NetcallBridge.fn.clearCallTimer = function() {
        if (this.callTimer) {
            clearTimeout(this.callTimer);
            this.callTimer = null;
        }
    };
    NetcallBridge.fn.clearRingPlay = function(){
        if (this.playRingInstance) {
            this.playRingInstance.cancel && this.playRingInstance.cancel();
            this.playRingInstance = null;
        }
    };
    NetcallBridge.fn.playRing = function(name, count, done) {
        done = done || function(){};
        this.playRingInstance = this.playRingInstance || {};
        var nameMap = {
            A: "avchat_connecting",
            B: "avchat_no_response",
            C: "avchat_peer_busy",
            D: "avchat_peer_reject",
            E: "avchat_ring"
        };
        var url = "audio/" + nameMap[name] + ".mp3";
        function doPlay(url, playDone){
            var audio = document.createElement("audio");
            audio.autoplay = true;
            function onEnded(){

                this.playRingInstance.cancel = null;
                audio = null;
                playDone();
            }
            onEnded = onEnded.bind(this);
            audio.addEventListener("ended", onEnded);
            audio.src = url;
            this.playRingInstance.cancel = function(){
                audio.removeEventListener("ended", onEnded);
                audio.pause();
                audio = null;
            }
        }
        doPlay = doPlay.bind(this);
        var wrap = function(){
            this.playRingInstance = null
            done();
        }.bind(this);
        for(var i = 0; i< count; i++){
            wrap = (function(wrap){
                return function() {
                    doPlay(url, wrap);
                };
            })(wrap);
        }
        wrap();
    };
    NetcallBridge.fn.log = function(){
        message = [].join.call(arguments, " ");
        console.log("%c"+message, "color: green;font-size:16px;");
    };

    // NetcallBridge.fn.
    window.NetcallBridge = NetcallBridge;
})();



