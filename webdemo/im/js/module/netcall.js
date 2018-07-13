/*
 * 点对点音视频通话控制逻辑
 * 注：由于融合了WebRTC和Netcall两种音视频sdk，需要进行如下处理
 * 1. 分别初始化两种实例 webrtc(WebRTC) / webnet(Netcall), 注册各种事件
 * 2. 逻辑里真正调用的sdk API需要通过一个 bridge(目前名字叫netcall) 进行桥接选择当前使用的sdk，默认使用 Netcall 方式
 */
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
    // 被呼叫超时检查定时器
    this.beCallTimer = null;
    // 音频或视频通话
    this.type = null;
    // 是否处于通话流程中
    this.netcallActive = false;
    // 通话的channelId
    this.channelId = null;
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
    this.agentDownloadUrl = "http://yx-web.nos.netease.com/package%2FWebAgent_Setup_V2.7.0.710.zip";
    // 多人音视频的缓存对象
    this.meetingCall = {};
    // 当前视频状态，是桌面共享还是视频: video / window / screen
    this.videoType = 'video'

    this.isRtcSupported = false;
    // this.signalInited = false;

    // 通话方式选择，是WebRTC还是Netcall，每次发起通话都要进行选择, 值有: WebRTC / Netcall
    this.callMethod = "";
    // 通话方式选择，是WebRTC还是Netcall，第一次进行选择后记住选择
    this.callMethodRemember = "";

    // 真正业务调用的 API 桥, 在进行通话方式选择之后赋值对应的实例
    this.netcall = null;

    // 开始初始化
    this.init();
}

var fn = NetcallBridge.fn = NetcallBridge.prototype;

fn.init = function () {
    this.initEvent();
    this.initNetcall();
};

fn.initEvent = function () {
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
    this.$beCallingBox.find("#downloadAgentButton").on("click", this.clickAgentEvent.bind(this));
    // 通话中挂断
    this.$hangupButton.on("click", this.hangup.bind(this));
    // 切换为视频通话
    this.$switchToVideoButton.on("click", this.requestSwitchToVideo.bind(this));
    // 切换为音频通话
    this.$switchToAudioButton.on("click", this.requestSwitchToAudio.bind(this));
    // 切换全屏状态
    $('body').on('click', '.J-member-list .fullScreenIcon', this.toggleFullScreen.bind(this))
    this.$toggleFullScreenButton.on("click", this.toggleFullScreen.bind(this));
    // 点击右上角悬浮框返回到音视频通话聊天界面
    this.$goNetcall.on("click", this.doOpenChatBox.bind(this));
    // 视频通话时，切换自己和对方的画面显示位置
    this.$switchViewPositionButton.on("click", this.switchViewPosition.bind(this));

    // 桌面共享按钮
    $('body').on('click', '.J-desktop-share .share-item', this.firefoxDesktopShare.bind(this))

    // 离开页面调用destroy
    window.addEventListener('beforeunload', this.beforeunload.bind(this));

    // 点击扬声器控制按钮
    this.volumeDebounceState = null;
    this.volumeStateTimeout = null;
    this.$netcallBox.on('click', '.icon-volume', function (event) {
        if ($(event.target).parent().is(".no-device")) return;
        if (this.volumeDebounceState !== null) {
            this.volumeDebounceState = !this.volumeDebounceState;
        } else {
            this.volumeDebounceState = !this.deviceAudioOutOn;
        }
        if (this.volumeStateTimeout) clearTimeout(this.volumeStateTimeout);
        this.volumeStateTimeout = setTimeout(function () {
            this.volumeStateTimeout = null;
            if (this.volumeDebounceState !== this.deviceAudioOutOn) {
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
    this.$netcallBox.on('click', '.icon-micro', function (event) {
        if ($(event.target).parent().is(".no-device")) return;
        if (this.microDebounceState !== null) {
            this.microDebounceState = !this.microDebounceState;
        } else {
            this.microDebounceState = !this.deviceAudioInOn;
        }
        if (this.microStateTimeout) clearTimeout(this.microStateTimeout);
        this.microStateTimeout = setTimeout(function () {
            this.microStateTimeout = null;
            if (this.microDebounceState !== this.deviceAudioInOn) {
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
    this.$netcallBox.on('click', '.icon-camera', function (event) {
        if ($(event.target).parent().is(".no-device")) return;
        if (this.cameraDebounceState !== null) {
            this.cameraDebounceState = !this.cameraDebounceState;
        } else {
            this.cameraDebounceState = !this.deviceVideoInOn;
        }
        if (this.cameraStateTimeout) clearTimeout(this.cameraStateTimeout);
        this.cameraStateTimeout = setTimeout(function () {
            this.cameraStateTimeout = null;
            if (this.cameraDebounceState !== this.deviceVideoInOn) {
                var nextState = !this.deviceVideoInOn;
                this.deviceVideoInOn = nextState;

                // WebRTC 模式
                if (this.isRtcSupported && nextState && this.meetingCall.channelName) {
                    return this.setDeviceVideoIn(nextState).then(function () {
                        that.startLocalStreamMeeting();
                        that.setVideoViewSize();
                    })
                } else {
                    this.setDeviceVideoIn(nextState)
                }

            }
            this.cameraDebounceState = null;
        }.bind(this), 300)
        $(".icon-camera").toggleClass("icon-disabled", !this.cameraDebounceState);
    }.bind(this));

    // 麦克风、摄像头按钮在hover的时候显示音量调节的slider
    this.$controlItem.hover(function () {
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        $(this).find(".slider").removeClass("hide");
    }, function () {
        this.hoverTimer = setTimeout(function () {
            $(this).find(".slider").addClass("hide");
        }.bind(this), 250);
    });
    // 初始化音量调节slider
    function doRangeSliderInit(selector, fn) {
        $(selector).rangeslider({
            polyfill: false,
            onSlide: function (position, value) {
                $(selector).parent().find(".txt").text(value);
            },
            onSlideEnd: function (position, value) {
                this.netcall[fn](parseInt(255 * value / 10));
            }.bind(this)
        });
    }
    doRangeSliderInit = doRangeSliderInit.bind(this);
    var map = {
        ".microSliderInput": "setCaptureVolume",
        // ".microSliderInput1": "setCaptureVolume",
        ".volumeSliderInput": "setPlayVolume",
        // ".volumeSliderInput1": "setPlayVolume"
    };
    for (var selector in map) {
        doRangeSliderInit(selector, map[selector]);
    }
    // 无可用设备时，鼠标hover音视频控制按钮，展示tooltip
    $(".netcall-box").tooltip({
        items: ".control-item.no-device",
        classes: { "ui-tooltip": "ui-tooltip-netcall" },
        position: {
            my: "center bottom-14",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    });
};

/** 页面卸载事件 */
fn.beforeunload = function (e) {
    if (!this.netcall || !this.netcall.calling) return;

    if (this.meetingCall.channelName) {
        this.leaveChannel();
    } else {
        this.hangup();
    }

    // var confirmationMessage = "\o/";

    // e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    // return confirmationMessage;

    /** 以下的方式在webkit浏览器不起作用
    // 开启阻止关闭模式
    event.preventDefault();
    // 弹窗提示用户
    minAlert.alert({
        type: 'error',
        msg: '当前正在通话中，确定要关闭窗口吗 ', //消息主体
        cancelBtnMsg: '取消', //取消按钮的按钮内容
        confirmBtnMsg: '关闭',
        cbConfirm: function () {
            if (this.meetingCall.channelName) {
                this.leaveChannel();
            } else {
                this.hangup();
            }
        }
    });
    **/
}

/** 初始化p2p音视频响应事件 */
fn.initNetcall = function () {
    var NIM = window.SDK.NIM;
    var Netcall = window.Netcall;
    var WebRTC = window.WebRTC;

    NIM.use(WebRTC);
    NIM.use(Netcall);
    NIM.use(window.WhiteBoard);

    var that = this;

    // 初始化webrtc
    window.webrtc = this.webrtc = WebRTC.getInstance({
        nim: window.nim,
        container: $(".netcall-video-local")[0],
        remoteContainer: $(".netcall-video-remote")[0],
        debug: true
    })

    // 初始化netcall
    window.webnet = this.webnet = Netcall.getInstance({
        nim: window.nim,
        mirror: false,
        mirrorRemote: false,
        /*kickLast: true,*/
        container: $(".netcall-video-local")[0],
        remoteContainer: $(".netcall-video-remote")[0]
    });

    this.initWebRTCEvent();
    this.initNetcallEvent();

    // 默认使用agent模式
    this.netcall = this.webnet
    this.callMethod = "webnet";
};

/** 初始化webrtc事件 */
fn.initWebRTCEvent = function () {
    var webrtc = this.webrtc;
    var that = this;
    // 对方接受通话 或者 我方接受通话，都会触发
    webrtc.on("callAccepted", function (obj) {
        if (this.callMethod !== 'webrtc') return
        this.onCallAccepted(obj);
    }.bind(this));
    webrtc.on("callRejected", function (obj) {
        if (this.callMethod !== 'webrtc') return
        this.onCallingRejected(obj);
    }.bind(this));
    webrtc.on('signalClosed', function () {
        if (this.callMethod !== 'webrtc') return

        console.log("signal closed");
        this.signalInited = false;
        this.showTip("信令断开了", 2000, function () {
            this.beCalling = false;
            this.beCalledInfo = null;
            this.hideAllNetcallUI();

            /** 如果是群视频，离开房间 */
            if (this.meetingCall.channelName) {
                this.leaveChannel();
                this.resetWhenHangup();
                return;
            }

            this.netcall.hangup();
            this.resetWhenHangup();
        }.bind(this));
    }.bind(this));
    webrtc.on('rtcConnectFailed', function () {
        if (this.callMethod !== 'webrtc') return
        console.log("rtcConnectFailed");
        this.log("rtc 连接中断");
        this.showTip("通话连接断开了", 2000, function () {
            this.beCalling = false;
            this.beCalledInfo = null;
            this.netcall.hangup();
            this.hideAllNetcallUI();
        }.bind(this));
    }.bind(this));
    webrtc.on("devices", function (obj) {
        if (this.callMethod !== 'webrtc') return
        console.log("on devices:", obj);
        //this.checkDeviceStateUI();
    }.bind(this));
    webrtc.on("deviceStatus", function (obj) {
        if (this.callMethod !== 'webrtc') return
        console.log("on deviceStatus:", obj);
        this.checkDeviceStateUI();
    }.bind(this));
    // webrtc.on('deviceAdd', function (obj) {
    //     if (this.callMethod !== 'webrtc') return
    //     console.log('on deviceAdd', obj)
    //     var temp = this.netcall
    //     if (!temp.signalInited) return;
    //     this.checkDeviceStateUI();
    // }.bind(this))
    // webrtc.on('deviceRemove', function (obj) {
    //     if (this.callMethod !== 'webrtc') return
    //     console.log('on deviceRemove', obj)
    //     var temp = this.netcall
    //     if (!temp.signalInited) return;
    //     this.checkDeviceStateUI();
    // }.bind(this))
    webrtc.on("beCalling", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        this.onBeCalling(obj);
    }.bind(this));
    webrtc.on("control", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        this.onControl(obj);
    }.bind(this));
    webrtc.on("hangup", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        this.onHangup(obj);
    }.bind(this));
    webrtc.on("heartBeatError", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        console.log("heartBeatError,要重建信令啦");
    }.bind(this));
    webrtc.on("callerAckSync", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        this.onCallerAckSync(obj);
    }.bind(this));
    webrtc.on("netStatus", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        // console.log("on net status:", obj);
    }.bind(this));
    webrtc.on("statistics", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        // console.log("on statistics:", obj);
    }.bind(this));
    webrtc.on("audioVolume", function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        // console.log(JSON.stringify(obj))
        // console.log("on audioVolume:", obj);
        /** 如果是群聊，转到多人脚本处理 */
        if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
            this.updateVolumeBar(obj)
        }
    }.bind(this));
    webrtc.on('joinChannel', function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        console.log('user join', obj)
    }.bind(this))
    webrtc.on('remoteTrack', function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        // type多人没用
        console.log('on remoteTrack', obj)
        that.onJoinChannel(obj);
    }.bind(this))
    webrtc.on('leaveChannel', function (obj) {
        if (this.callMethod !== 'webrtc' || window.yunXin.WB.session.length !== 0) return
        console.log('sb leaveChannel', obj)
        that.onLeaveChannel(obj);
    }.bind(this))
}

/** 初始化netcall事件 */
fn.initNetcallEvent = function () {
    var webnet = this.webnet;
    var that = this;
    // 对方接受通话 或者 我方接受通话，都会触发
    webnet.on("callAccepted", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onCallAccepted(obj);
    }.bind(this));
    webnet.on("callRejected", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onCallingRejected(obj);
    }.bind(this));

    webnet.on('signalClosed', function () {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        
        console.log("signal closed");
        this.signalInited = false;
        this.showTip("信令断开了", 2000, function () {
            this.beCalling = false;
            this.beCalledInfo = null;
            this.hideAllNetcallUI();

            /** 如果是群视频，离开房间 */
            if (this.meetingCall.channelName) {
                this.leaveChannel();
                this.resetWhenHangup();
                return;
            }

            this.netcall.hangup();
        }.bind(this));
    }.bind(this));
    webnet.on("devices", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        
        console.log("on devices:", obj);
        //this.checkDeviceStateUI();
    }.bind(this));
    webnet.on("deviceStatus", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        console.log("on deviceStatus:", obj);
        this.checkDeviceStateUI();
    }.bind(this));
    webnet.on("beCalling", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onBeCalling(obj);
    }.bind(this));
    webnet.on("control", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onControl(obj);
    }.bind(this));
    webnet.on("hangup", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onHangup(obj);
    }.bind(this));
    webnet.on("heartBeatError", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        console.log("heartBeatError,要重建信令啦");
    }.bind(this));
    webnet.on("callerAckSync", function (obj) {
        if (this.callMethod !== 'webnet' || window.yunXin.WB.session.length !== 0) return
        this.onCallerAckSync(obj);
    }.bind(this));

    webnet.on("netStatus", function (obj) {
        if (this.callMethod !== 'webnet') return
        // console.log("on net status:", obj);
    }.bind(this));
    webnet.on("statistics", function (obj) {
        if (this.callMethod !== 'webnet') return
        // console.log("on statistics:", obj);
    }.bind(this));
    webnet.on("audioVolume", function (obj) {
        if (this.callMethod !== 'webnet' || (!this.beCalling && !this.calling && !this.netcallActive)) return
        // console.log("on audioVolume:", obj);
        /** 如果是群聊，转到多人脚本处理 */
        if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
            this.updateVolumeBar(obj)
        }
    }.bind(this));
    webnet.on("streamResize", function () {
        if (this.callMethod !== 'webnet') return
        console.log("stream resize", arguments)
    }.bind(this))
    webnet.on('joinChannel', function (obj) {
        if (this.callMethod !== 'webnet') return
        // type多人没用
        console.log('user join', obj)
        that.onJoinChannel(obj);
    }.bind(this))
    webnet.on('leaveChannel', function (obj) {
        if (this.callMethod !== 'webnet') return
        console.log('sb leaveChannel', obj)
        that.onLeaveChannel(obj);
    }.bind(this))

}

fn.onControl = function (obj) {
    console.log("on control:", obj);

    var netcall = this.netcall;
    // 如果不是当前通话的指令, 直接丢掉
    if (netcall.notCurrentChannelId(obj)) {
        this.log("非当前通话的控制信息");
        return;
    }

    /** 如果是多人音视频会话，转到多人脚本处理 */
    if (this.yx.crtSessionType === 'team') {
        this.onMeetingControl(obj);
        return;
    }

    var type = obj.type;
    switch (type) {
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
            if (this.isRtcSupported) {
                //p2p
                if (this.yx.crtSessionType === 'p2p') {
                    return this.startRemoteStream();
                }
                // team
                this.startRemoteStreamMeeting(obj.account);
            }
            this.updateVideoShowSize(true, true);
            break;
        // NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF 通知对方自己关闭了视频
        case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF:
            this.log("对方关闭了摄像头");
            this.$videoRemoteBox.toggleClass("empty", true).find(".message").text("对方关闭了摄像头");
            if (this.isRtcSupported) {
                //p2p
                if (this.yx.crtSessionType === 'p2p') {
                    return this.stopRemoteStream();
                }
                // team
                this.stopRemoteStreamMeeting(obj.account);
            }
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
            function doEnd() {
                this.cancelCalling();
            }
            doEnd = doEnd.bind(this);
            if (this.afterPlayRingA) {
                this.afterPlayRingA = function () {
                    this.playRing("C", 3, function () {
                        this.showTip("对方正在通话中", 2000, doEnd);
                    }.bind(this));
                }.bind(this);
            } else {
                this.clearRingPlay();
                this.playRing("C", 3, function () {
                    this.showTip("对方正在通话中", 2000, doEnd);
                }.bind(this));
            }
            break;
        // NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID 自己的摄像头不可用
        case Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID:
            this.log("对方摄像头不可用");
            this.$videoRemoteBox.toggleClass("empty", true).find(".message").text("对方摄像头不可用");
            if (this.isRtcSupported) {
                //p2p
                if (this.yx.crtSessionType === 'p2p') {
                    return this.stopRemoteStream();
                }
                // team
                this.stopRemoteStreamMeeting(obj.account);
            }
            break;
        // NETCALL_CONTROL_COMMAND_SELF_ON_BACKGROUND 自己处于后台
        // NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED 告诉发送方自己已经收到请求了（用于通知发送方开始播放提示音）
        // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_START 通知对方自己开始录制视频了
        // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_STOP 通知对方自己结束录制视频了
    }
};

// 对方请求音频切换为视频时
fn.beingAskSwitchToVideo = function () {
    var that = this;
    function agree() {
        this.log("同意切换到视频通话");
        this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE
        });

        if (this.isRtcSupported) {
            this.setDeviceVideoIn(true).then(function () {
                this.startLocalStream()
            }.bind(this)).then(function () {
                return this.netcall.switchAudioToVideo();
            }.bind(this)).then(function () {
                this.startRemoteStream()
            }.bind(this)).catch(function (e) {
                console.log(e);
            })
        } else {
            this.netcall.switchAudioToVideo();
            this.setDeviceVideoIn(true);
            this.startLocalStream();
            this.startRemoteStream();
        }

        this.$videoRemoteBox.toggleClass("empty", false).find(".message").text("");
        this.updateVideoShowSize(true, true);
        this.type = Netcall.NETCALL_TYPE_VIDEO;
        this.showConnectedUI(Netcall.NETCALL_TYPE_VIDEO);
        // 更新右上角悬浮框中的音视频图标
        this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
        this.$videoRemoteBox.find(".message").text("");
        // $("#askSwitchToVideoDialog").dialog("close");
        this.$switchToAudioButton.toggleClass("disabled", false);
    }
    function reject() {
        this.log("拒绝切换到视频通话");
        this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT
        });
    }
    // 弹窗提示用户
    minAlert.alert({
        type: 'camera',
        msg: '对方邀请你开始视频聊天 ', //消息主体
        cancelBtnMsg: '拒绝', //取消按钮的按钮内容
        confirmBtnMsg: '开始视频',
        cbCancel: reject.bind(that),
        cbConfirm: agree.bind(that)
    });

};
// 我方请求音频切换到视频通话，对方同意时
fn.doSwitchToVideo = function () {
    this.log("切换到视频通话")
    this.requestSwitchToVideoWaiting = false;
    this.type = Netcall.NETCALL_TYPE_VIDEO;
    this.$switchToAudioButton.toggleClass("disabled", false);

    if (this.isRtcSupported) {
        var promise;
        if (!this.requestSwitchToVideoWaiting) {
            promise = this.setDeviceVideoIn(true).then(function () {
                this.startLocalStream()
            }.bind(this))
        } else {
            promise = Promise.resolve();
        }

        promise.then(function () {
            return this.netcall.switchAudioToVideo();
        }.bind(this)).then(function () {
            this.startRemoteStream()
        }.bind(this)).catch(function (e) {
            console.log(e);
        })
    } else {
        this.netcall.switchAudioToVideo();
        this.setDeviceVideoIn(true);
        this.startLocalStream();
        this.startRemoteStream();
    }

    this.$videoRemoteBox.toggleClass("empty", false).find(".message").text("");
    this.updateVideoShowSize(true, true);
    this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
    this.checkDeviceStateUI();
};
fn.requestSwitchToVideoRejected = function () {
    this.requestSwitchToVideoWaiting = false;
    $(".netcall-video-remote .message").text("");
    this.showTip("对方拒绝切换为视频聊天", 2000, function () {
        this.showConnectedUI(Netcall.NETCALL_TYPE_AUDIO);
        this.setDeviceVideoIn(false);
        this.stopLocalStream();
    }.bind(this));

};
fn.requestSwitchToVideo = function () {
    this.log("请求切换到视频通话");
    this.setDeviceVideoIn(true).then(function () {
        this.startLocalStream();
    }.bind(this)).then(function () {

        this.requestSwitchToVideoWaiting = true; // 标志请求中的状态
        this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO
        });
        this.showConnectedUI(Netcall.NETCALL_TYPE_VIDEO);
        this.updateVideoShowSize(true);
        this.$videoRemoteBox.toggleClass("empty", true).find(".message").text("正在等待对方开启摄像头");
    }.bind(this));

};
fn.doSwitchToAudio = function () {
    this.log("切换到音频通话");
    this.type = Netcall.NETCALL_TYPE_AUDIO;
    this.setDeviceVideoIn(false).then(function () {
        this.netcall.switchVideoToAudio().then(function () {
            this.stopLocalStream();
            this.stopRemoteStream();
        }.bind(this));
    }.bind(this));

    this.showConnectedUI(Netcall.NETCALL_TYPE_AUDIO);
    this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
};
fn.stopLocalStream = function () {
    this.log("停止本地流显示 stopLocalStream");
    try {
        this.netcall.stopLocalStream();
    } catch (e) {
        this.log("停止本地流失败");
        console && console.warn && console.warn(e);
    }
};
fn.stopRemoteStream = function () {
    this.log("停止远端流显示 stopRemoteStream");
    try {
        this.netcall.stopRemoteStream();
    } catch (e) {
        this.log("停止远端流失败");
        console && console.warn && console.warn(e);
    }
};
fn.startLocalStream = function (node) {
    this.log("开启本地流显示 startLocalStream");
    try {
        this.netcall.startLocalStream(node);
    } catch (e) {
        this.log("开启本地流失败");
        console && console.warn && console.warn(e);
    }
};
fn.startRemoteStream = function () {
    this.log("开启远端流显示 startRemoteStream");
    try {
        this.netcall.startRemoteStream();
    } catch (e) {
        this.log("开启远端流失败");
        console && console.warn && console.warn(e);
    }
};
fn.requestSwitchToAudio = function () {
    this.log("请求切换到音频流");
    if (this.$switchToAudioButton.is(".disabled")) return;
    this.netcall.control({
        command: Netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO
    });
    this.doSwitchToAudio();
};

/** 同意音视频通话, 兼容多人音视频 */
fn.accept = function (e) {
    // 如果在转圈的状态，忽略
    if (this.$beCallingAcceptButton.hasClass('loading')) return

    var that = this
    if (this.$beCallingAcceptButton.is(".disabled")) return;
    if (!this.beCalling) return;

    // 发起通话选择UI
    this.displayCallMethodUI(deviceCheck.bind(that), function () {
        that.reject()
    })

    function deviceCheck(data) {

        this.callMethod = data && data.type || this.callMethod;
        this.callMethodRemember = data && data.type || this.callMethodRemember;

        this.$beCallingAcceptButton.toggleClass("loading", true);

        // WebRTC模式
        if (this.callMethod === 'webrtc') {
            this.netcall = this.webrtc;
            that.updateBeCallingSupportUI(true);
            return this.callAcceptedResponse()
        }

        // webnet模式
        this.netcall = this.webnet;
        // 音视频插件检查, signal只做检测
        this.checkNetcallSupporting(function () {

            that.updateBeCallingSupportUI(true);
            this.callAcceptedResponse()

        }.bind(this), function () {
            // 平台不支持
            that.reject();
        }, function (err) {

            // 插件弹框报错
            that.showAgentNeedInstallDialog(err, deviceCheck.bind(that), function () {
                that.reject();
            })

            that.updateBeCallingSupportUI(false, null, err);
        }, true, true);

    }

};

/** 同意通话的操作 */
fn.callAcceptedResponse = function () {

    /** 如果是群视频通话 */
    if (this.yx.crtSessionType === 'team') {
        this.hideAllNetcallUI();
        this.meetingCallAccept();
        return;
    }

    this.clearBeCallTimer();
    this.log("同意对方音视频请求");
    this.beCalling = false;

    this.netcall.response({
        accepted: true,
        beCalledInfo: this.beCalledInfo,
        sessionConfig: this.sessionConfig
    }).then(function () {
        this.log("同意对方音视频请求成功");
        // 加个定时器 处理点击接听了 实际上对面杀进程了，没有callAccepted回调
        this.acceptAndWait = true;
        setTimeout(function () {
            if (this.acceptAndWait) {
                this.log("通话建立过程超时");
                this.hideAllNetcallUI();
                this.hangup()
                this.acceptAndWait = false;
            }
        }.bind(this), 45 * 1000)

    }.bind(this)).catch(function (err) {
        this.log("同意对方音视频通话失败，转为拒绝");
        console.log("error info:", err);
        this.$beCallingAcceptButton.toggleClass("loading", false);
        this.reject();
    }.bind(this));

}
/** 拒绝音视频通话, 兼容多人音视频 */
fn.reject = function () {

    /** 如果是群视频通话 */
    if (this.meetingCall.channelName) {
        this.hideAllNetcallUI();
        this.meetingCallReject();
        this.beCalling = false;
        this.netcall.beCalling = false;
        return;
    }

    if (!this.beCalling) return;

    this.clearBeCallTimer();
    this.log("拒绝对方音视频通话请求");
    var beCalledInfo = this.beCalledInfo;
    this.netcall.response({
        accepted: false,
        beCalledInfo: beCalledInfo
    }).then(function () {
        this.log("拒绝对方音视频通话请求成功");
        this.sendLocalMessage("已拒绝");
        this.beCalledInfo = null;
        this.beCalling = false;
        this.hideAllNetcallUI();
    }.bind(this)).catch(function (err) {
        // 自己断网了
        this.log("拒绝对方音视频通话请求失败");
        console.log("error info:", err);
        this.beCalledInfo = null;
        this.beCalling = false;
        this.hideAllNetcallUI();
    }.bind(this));

};

// 取消呼叫
fn.cancelCalling = function (isClick) {
    if (isClick === true && this.$callingHangupButton.is(".disabled")) return;

    if (!this.isBusy) {
        this.log("取消呼叫");
        this.netcall.hangup();
    }
    this.clearCallTimer();
    this.clearRingPlay();
    if (isClick === true && !this.isBusy) this.sendLocalMessage("未接通");
    this.hideAllNetcallUI();
    this.resetWhenHangup();
};
// 聊天窗口添加本地消息
fn.sendLocalMessage = function (text, to) {
    if (!to) to = this.netcallAccount;
    setTimeout(function () {
        this.yx.mysdk.sendTextMessage("p2p", to, text, true, function (error, msg) {
            this.yx.cache.addMsgs(msg);
            this.yx.$chatContent.find('.no-msg').remove();
            var msgHtml = appUI.updateChatContentUI(msg, this.yx.cache);
            this.yx.$chatContent.append(msgHtml).scrollTop(99999);
        }.bind(this));
    }.bind(this), 100);

};
// 挂断通话过程
fn.hangup = function () {
    this.netcall.hangup();
    this.beCalledInfo = null;
    this.beCalling = false;
    this.setDeviceAudioIn(false);
    this.setDeviceAudioOut(false);
    this.setDeviceVideoIn(false);
    this.hideAllNetcallUI();
    this.stopRemoteStream();
    this.stopLocalStream();

    /** 重置文案聊天高度 */
    this.resizeChatContent();
    /**状态重置 */
    this.resetWhenHangup();
};
// 其它端已处理
fn.onCallerAckSync = function (obj) {
    this.log("其它端已处理");
    if (this.beCalledInfo && obj.channelId === this.beCalledInfo.channelId) {

        console.log("on caller ack async:", obj);
        this.showTip("其它端已处理", 2000, function () {
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
fn.onHangup = function (obj) {
    this.log("收到对方挂断通话消息");
    console.log("on hange up", obj);
    console.log(this.beCalling, this.beCalledInfo, this.netcallDurationTimer);
    // 是否挂断当前通话
    if (obj.account && obj.account === this.netcallAccount) {
        close.call(this);
    }
    if (this.meetingCall.channelName) {
        return this.log("挂断消息不属于当前群视频通话，忽略");
    }
    if (this.netcallDurationTimer !== null && this.netcall.notCurrentChannelId(obj)) {
        return this.log("挂断消息不属于当前活动通话，忽略1");
    }
    if (this.netcallDurationTimer === null && this.beCalling && this.beCalledInfo.channelId !== obj.channelId) {
        return this.log("挂断消息不属于当前活动通话，忽略2");
    }
    if (this.netcallDurationTimer === null && !this.beCalling) {
        return this.log("挂断消息不属于当前活动通话，忽略3，当前无通话活动");
    }
    try {
        // $("#askSwitchToVideoDialog").dialog("close");
    } catch (e) { }
    this.clearBeCallTimer();
    /* var tipText;
    if(this.netcallDurationTimer !== null) {
        // this.sendLocalMessage("通话拨打时长" + this.getDurationText(this.netcallDuration));
        tipText = "对方已挂断";
    } else {
        // var to = obj.account;
        tipText = "对方已挂断";
        // this.sendLocalMessage("未接听", to);
    } */

    close.call(this);

    function close() {
        this.showTip("对方已挂断", 2000, function () {
            this.beCalling = false;
            this.beCalledInfo = null;
            this.hideAllNetcallUI();
            this.setDeviceVideoIn(false);
            this.setDeviceAudioIn(false);
            this.setDeviceAudioOut(false);
        }.bind(this));

        /**状态重置 */
        this.resetWhenHangup();
    }


};
// 打开当前音视频通话对象的聊天窗口
fn.doOpenChatBox = function () {
    /** 群视频处理 */
    if (this.meetingCall.channelName) {
        this.yx.openChatBox(this.meetingCall.teamId, 'team');
        return;
    }
    var account = this.netcallAccount;
    if (!account) {
        if (this.showTipTimer) {
            clearTimeout(this.showTipTimer);
            this.showTipTimer = null;
        }
        // 隐藏右上角悬浮框
        return this.$goNetcall.addClass("hide");
    }
    this.yx.openChatBox(account, 'p2p');
};

/** 被呼叫，兼容多人音视频
 * @param {object} obj 主叫信息
 * @param {string} scene 是否是群视频，默认值p2p
 */
fn.onBeCalling = function (obj, scene) {
    scene = scene || 'p2p';
    this.log("收到音视频呼叫");
    console.log("on be calling:", obj);
    var channelId = obj.channelId;
    var netcall = this.netcall;
    var that = this;

    // 如果是同一通呼叫，直接丢掉
    if (obj.channelId === this.channelId) return

    // p2p场景，先通知对方自己收到音视频通知
    // if (scene === 'p2p') {
    //     netcall.control({
    //         channelId: channelId,
    //         command: Netcall.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
    //     });
    // }

    // 自己正在通话或者被叫中, 知对方忙并拒绝通话
    var WB = window.yunXin.WB
    if (netcall.calling || this.beCalling || WB.isCalling || WB.isCalled) {

        var tmp = { command: Netcall.NETCALL_CONTROL_COMMAND_BUSY };
        if (scene === 'p2p') {
            tmp.channelId = channelId;
        }

        this.log("通知呼叫方我方不空");
        netcall.control(tmp);

        return;
    }

    // 正常发起通话请求
    this.type = obj.type;
    this.channelId = obj.channelId;
    this.beCalling = true;

    // 先关闭所有弹框
    minAlert.close();
    this.dialog_call && this.dialog_call.close();
    this.dialog && this.dialog.close();

    that.updateBeCallingSupportUI(true);

    // team场景
    if (scene === 'team') {

        this.netcallActive = true;
        var tmp = obj.content;

        this.showBeCallingUI(tmp.type, 'team', {
            teamId: tmp.teamId,
            caller: obj.from
        });

        // this.updateBeCallingSupportUI(true, true);

        this.playRing("E", 45);

        return;
    }

    /**
     * 考虑被呼叫时，呼叫方断网，被呼叫方不能收到hangup消息，因此设置一个超时时间
     * 在通话连接建立后，停掉这个计时器
     */
    this.beCallTimer = setTimeout(function () {
        if (!this.beCallTimer) return;
        this.log("呼叫方可能已经掉线，挂断通话");
        this.beCallTimer = null;
        this.reject();
    }.bind(this), 62 * 1000)

    //p2p场景
    this.beCalledInfo = obj;
    var account = obj.account;
    this.netcallActive = true;
    this.netcallAccount = account;
    this.doOpenChatBox(account);
    this.showBeCallingUI(obj.type);

    // this.updateBeCallingSupportUI(true, true);
    // checkDevice.call(this);

    this.playRing("E", 45);
    $(".asideBox .nick").text(this.yx.getNick(account));

};
// 对方接受通话 或者 我方接受通话，都会触发
fn.onCallAccepted = function (obj) {

    function changeState() {
        this.acceptAndWait = false;
        this.log("音视频通话开始");
        this.type = obj.type;
        this.showConnectedUI(obj.type);
        this.clearCallTimer();
        this.clearRingPlay();
        this.$beCallingAcceptButton.toggleClass("loading", false);
        this.$switchToAudioButton.toggleClass("disabled", false);
    }

    changeState = changeState.bind(this);

    // WebRTC模式
    if (this.isRtcSupported) {
        var promise;
        if (obj.type === WebRTC.NETCALL_TYPE_VIDEO) {
            promise = this.setDeviceVideoIn(true);
        } else {
            promise = this.setDeviceVideoIn(false);
        }
        promise.then(function () {
            return this.setDeviceAudioIn(true);
        }.bind(this)).then(function () {
            this.startLocalStream();
            this.updateVideoShowSize(true, false);
            this.netcall.setCaptureVolume(255);
        }.bind(this)).then(function () {
            this.log("开始webrtc连接")
            return this.netcall.startRtc();
        }.bind(this)).then(function () {
            this.log("webrtc连接成功")
            changeState();
            return this.setDeviceAudioOut(true);
        }.bind(this)).catch(function (e) {
            console.error(e);
            this.log("连接出错");

            if (/webrtc兼容开关/i.test(e)) {
                minAlert.alert({
                    type: 'error',
                    msg: '无法接通!请让呼叫方打开"WebRTC兼容开关"，方可正常通话', //消息主体
                    confirmBtnMsg: '知道了，挂断',
                    cbConfirm: this.hangup.bind(this)
                })
            }
        }.bind(this))
    } else {
        changeState();

        if (obj.type === Netcall.NETCALL_TYPE_VIDEO) {
            this.setDeviceAudioIn(true);
            this.setDeviceAudioOut(true);
            this.setDeviceVideoIn(true);
            this.netcall.startLocalStream();
            this.netcall.startRemoteStream();
            $("#videoWaitingAcceptedTip").toggleClass("hide", true);
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
    }

    // 通话时长显示
    this.startDurationTimer();
    /** 重置文案聊天高度 */
    this.resizeChatContent();
    // 关闭被呼叫倒计时
    this.beCallTimer = null;
};

/** 
 * 对方拒绝通话, 兼容多人音视频
 * 先判断是否是群视频，如果是群视频，交给群视频的脚本处理
 */
fn.onCallingRejected = function (obj) {

    if (this.yx.crtSessionType === 'team') {
        this.onMeetingCallRejected(obj);
        return;
    }

    this.log("对方拒绝音视频通话");
    this.showTip("对方已拒绝", 2000, this.hideAllNetcallUI.bind(this));
    this.clearCallTimer();
    this.sendLocalMessage("对方已拒绝");
};

// 发起音视频呼叫
fn.doCalling = function (type) {
    this.log("发起音视频呼叫");
    // this.type = type;
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
    this.afterPlayRingA = function () { };
    this.playRing("A", 1, function () {
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
            sound: '',
        },
        sessionConfig: this.sessionConfig
    }).then(function (obj) {
        this.log("发起通话成功，等待对方接听");
        // 设置超时计时器
        this.callTimer = setTimeout(function () {
            if (!netcall.callAccepted) {
                this.log("超时无人接听");
                this.showTip("无人接听", 2000, this.cancelCalling.bind(this));
                this.sendLocalMessage("无人接听");
            }
        }.bind(this), 1000 * 45);

        if (this.afterPlayRingA) {
            this.afterPlayRingA = function () {
                this.playRing("E", 45);
            }.bind(this);
        } else {
            this.playRing("E", 45);
        }

    }.bind(this)).catch(function (err) {
        console.log("发起音视频通话请求失败：", err);
        this.log("发起音视频通话请求失败");
        if (err && err.code === 11001) {
            this.log("发起音视频通话请求失败，对方不在线");
            if (this.afterPlayRingA) {
                this.afterPlayRingA = function () {
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

fn.setDeviceAudioIn = function (state) {
    $(".icon-micro").toggleClass("icon-disabled", !state);
    this.deviceAudioInOn = !!state;

    if (state) {
        this.log("开启麦克风");
        return this.netcall.startDevice({
            // 开启麦克风输入
            type: Netcall.DEVICE_TYPE_AUDIO_IN
        }).then(function () {
            this.log("开启麦克风成功，通知对方我方开启了麦克风");
            // 通知对方自己开启了麦克风
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
            })
        }.bind(this)).catch(function () {
            console.log("开启麦克风失败");
            this.log("开启麦克风失败");
            this.onDeviceNoUsable(Netcall.DEVICE_TYPE_AUDIO_IN);
        }.bind(this));
    } else {
        this.log("关闭麦克风");
        return this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN) // 关闭麦克风输入
            .then(function () {
                this.log("关闭麦克风成功，通知对方我方关闭了麦克风");
                // 通知对方自己关闭了麦克风
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
                });
            }.bind(this)).catch(function () {
                this.log("关闭麦克风失败");
            }.bind(this));
    }
};

fn.setDeviceAudioOut = function (state) {
    $(".icon-volume").toggleClass("icon-disabled", !state);
    this.deviceAudioOutOn = !!state;

    if (state) {
        this.log("开启扬声器");
        return this.netcall.startDevice({
            type: Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT
        }).then(function () {
            this.log("开启扬声器成功");
        }.bind(this)).catch(function () {
            console.log("开启扬声器失败");
            this.log("开启扬声器失败");
            this.onDeviceNoUsable(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT);
        }.bind(this));
    } else {
        this.log("关闭扬声器");
        return this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT).then(function () {
            this.log("关闭扬声器成功");
        }.bind(this)).catch(function () {
            this.log("关闭扬声器失败");
        }.bind(this));
    }
};

fn.setDeviceVideoIn = function (state) {
    $(".icon-camera").toggleClass("icon-disabled", !state);
    this.deviceVideoInOn = !!state;

    if (state) {
        this.log("开启摄像头");
        return this.netcall.startDevice({
            type: Netcall.DEVICE_TYPE_VIDEO
            /* width: this.videoCaptureSize.width,
             height: this.videoCaptureSize.height */
        }).then(function () {
            this.videoType = 'video'
            this.log("开启摄像头成功，通知对方己方开启了摄像头");
            // 通知对方自己开启了摄像头
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON
            });
            $(".netcall-video-local").toggleClass("empty", false);
            $(".netcall-video-local .message").text("");

            /** 如果是群聊，转到多人脚本处理 */
            if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
                this.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, true, true);
                this.startLocalStreamMeeting() && this.setVideoViewSize()
            } else {
                this.startLocalStream() && this.setVideoViewSize()
            }

        }.bind(this)).catch(function (err) {
            console.error(err)
            this.videoType = null
            // 通知对方自己的摄像头不可用
            this.log("开启摄像头失败，通知对方己方摄像头不可用", err);
            this.onDeviceNoUsable(Netcall.DEVICE_TYPE_VIDEO);

            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
            });
            /** 如果是群聊，转到多人脚本处理 */
            if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
                this.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, true, false);
            }
            $(".netcall-video-local").toggleClass("empty", true);
            $(".netcall-video-local .message").text("摄像头不可用");
            $(".netcall-box .camera.control-item").toggleClass("no-device", true).attr("title", "摄像头不可用");

            // console.log("摄像头不可用");
        }.bind(this));

    } else {
        this.videoType = null
        this.log("关闭摄像头");
        return this.netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO).then(function () {
            // 通知对方自己关闭了摄像头
            this.log("关闭摄像头成功，通知对方我方关闭了摄像头");
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF
            });
            $(".netcall-video-local").toggleClass("empty", true);
            $(".netcall-video-local .message").text("您关闭了摄像头");
            /** 如果是群聊，转到多人脚本处理 */
            if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
                this.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, false, true);
            }
        }.bind(this)).catch(function (e) {
            this.videoType = null
            this.log("关闭摄像头失败");
        }.bind(this));

    }

};


fn.clearCallTimer = function () {
    if (this.callTimer) {
        clearTimeout(this.callTimer);
        this.callTimer = null;
    }
};

fn.clearBeCallTimer = function () {
    if (this.beCallTimer) {
        clearTimeout(this.beCallTimer);
        this.beCallTimer = null;
    }
};
fn.clearRingPlay = function () {
    if (this.playRingInstance) {
        this.playRingInstance.cancel && this.playRingInstance.cancel();
        this.playRingInstance = null;
    }
};

fn.playRing = function (name, count, done) {
    done = done || function () { };
    this.playRingInstance = this.playRingInstance || {};
    var nameMap = {
        A: "avchat_connecting",
        B: "avchat_no_response",
        C: "avchat_peer_busy",
        D: "avchat_peer_reject",
        E: "avchat_ring"
    };
    var url = "audio/" + nameMap[name] + ".mp3";
    function doPlay(url, playDone) {
        var audio = document.createElement("audio");
        audio.autoplay = true;
        function onEnded() {

            this.playRingInstance.cancel = null;
            audio = null;
            playDone();
        }
        onEnded = onEnded.bind(this);
        audio.addEventListener("ended", onEnded);
        audio.src = url;
        this.playRingInstance.cancel = function () {
            audio.removeEventListener("ended", onEnded);
            audio.pause();
            audio = null;
        }
    }
    doPlay = doPlay.bind(this);
    var wrap = function () {
        this.playRingInstance = null
        done();
    }.bind(this);
    for (var i = 0; i < count; i++) {
        wrap = (function (wrap) {
            return function () {
                doPlay(url, wrap);
            };
        })(wrap);
    }
    wrap();
};
fn.log = function () {
    message = [].join.call(arguments, " ");
    console.log("%c" + message, "color: green;font-size:16px;");
};




