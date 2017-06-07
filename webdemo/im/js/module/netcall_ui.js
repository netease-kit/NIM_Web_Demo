/*
 * 1. 点对点音视频通话中对应的ui相关逻辑
 * 2. 多人音视频相关UI逻辑
*/

var fn = NetcallBridge.fn;
// 每当设备信息发生变化时，调用此方法同步设备控制按钮状态和提示信息，更新设备输入,更新视频画面提示信息等
NetcallBridge.fn.checkDeviceStateUI = function () {
    var p1 = this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_VIDEO).then(function (obj) {
        var $camera = $(".netcall-box .camera.control-item");
        if (obj.devices.length) {
            if ($camera.is(".no-device")) { // 摄像头从无到有的变化
                // 开启摄像头
                this.setDeviceVideoIn(true);
                // 开始推送本地流
                this.netcall.startLocalStream();

                /** 如果是群聊，转到多人脚本处理 */
                if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
                    this.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, true, false);
                } else {
                    // 更新画面显示大小
                    this.updateVideoShowSize(true);
                }

                $(".netcall-video-local").toggleClass("empty", false);
                $(".netcall-video-local .message").text("");

            }
            $camera.toggleClass("no-device", false).attr("title", "");
        } else {
            // 通知对方，我方摄像头不可用
            this.netcall.control({
                command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
            });

            $camera.toggleClass("no-device", true).attr("title", "摄像头不可用");
            $(".netcall-video-local").toggleClass("empty", true);
            $(".netcall-video-local .message").text("摄像头不可用");

            /** 如果是群聊，转到多人脚本处理 */
            if (this.netcall.calling && this.yx.crtSessionType === 'team' && this.meetingCall.channelName) {
                this.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, true, false);
            }
        }
    }.bind(this));
    var p2 = this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_AUDIO_IN).then(function (obj) {
        var $microphone = $(".netcall-box .microphone.control-item");
        if (obj.devices.length) {
            if ($microphone.is(".no-device")) {
                this.setDeviceAudioIn(true);
            }

            $microphone.toggleClass("no-device", false).attr("title", "");
        } else {

            $microphone.toggleClass("no-device", true).attr("title", "麦克风不可用");
        }
    }.bind(this));
    var p3 = this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT).then(function (obj) {
        var $volume = $(".netcall-box .volume.control-item");
        if (obj.devices.length) {
            if ($volume.is(".no-device")) {
                this.setDeviceAudioOut(true);
            }

            $volume.toggleClass("no-device", false).attr("title", "");
        } else {

            $volume.toggleClass("no-device", true).attr("title", "麦克风不可用");
        }
    }.bind(this));
    console.log(p1)
    return Promise.all([p1, p2, p3]);
};
// 切换对方我方画面位置
NetcallBridge.fn.switchViewPosition = function () {
    var $smallView = $(".netcall-box .smallView");
    var $bigView = $(".netcall-box .bigView");
    var $smallParent = $smallView[0].parentNode;
    var $bigParent = $bigView[0].parentNode;
    $bigView.prependTo($smallParent).addClass("smallView").removeClass("bigView");
    $smallView.prependTo($bigParent).addClass("bigView").removeClass("smallView");

    this.updateVideoShowSize(true, true);
};
NetcallBridge.fn.toggleFullScreen = function () {
    this.isFullScreen = !this.isFullScreen;
    this.$netcallBox.toggleClass("fullscreen", this.isFullScreen);
    this.$netcallBox.find(".fullScreenIcon").toggleClass("full", this.isFullScreen);
    this.updateVideoShowSize(true, true);
};
// UI界面蒙版展示提示信息，指定时间后消失，消失后执行回调函数
NetcallBridge.fn.showTip = function (message, duration, done) {
    $(".netcall-mask").toggleClass("hide", false).find(".netcallTip").text(message);
    this.showTipTimer = setTimeout(function () {
        $(".netcall-mask").toggleClass("hide", true).find(".netcallTip").text("");
        done && done();
        this.showTipTimer = null;
    }.bind(this), duration);
};
// 更新视频画面显示尺寸
NetcallBridge.fn.updateVideoShowSize = function (local, remote) {
    var bigSize = {
        width: this.isFullScreen ? 640 : 320,
        height: this.isFullScreen ? 480 : 240
    };
    var smallSize = {
        width: this.isFullScreen ? 240 : 160,
        height: this.isFullScreen ? 180 : 120
    };
    if (local) {
        this.netcall.setVideoViewSize($(".netcall-video-local").is(".bigView") ? bigSize : smallSize);
    }
    if (remote) {
        this.netcall.setVideoViewRemoteSize($(".netcall-video-remote").is(".bigView") ? bigSize : smallSize);
    }

};
//
NetcallBridge.fn.hideAllNetcallUI = function () {
    this.clearRingPlay();
    this.$netcallBox.toggleClass("calling", false);
    this.$chatBox.toggleClass("show-netcall-box", false);
    this.$callingBox.toggleClass("hide", true);
    this.$videoShowBox.toggleClass("hide", true);
    this.$audioShowBox.toggleClass("hide", true);
    this.$beCallingBox.toggleClass("hide", true);
    this.$netcallBox.find(".top").toggleClass('hide', true);
    this.netcallActive = false;
    this.netcallAccount = "";
    this.stopRemoteStream();
    this.stopLocalStream();
    $(".netcall-video-local").toggleClass("empty", false);
    $(".netcall-video-local .message").text("");
    $(".netcall-video-remote").toggleClass("empty", false);
    $(".netcall-video-remote .message").text("");
    // 重置为非全屏状态
    if (this.isFullScreen) {
        this.toggleFullScreen();
        this.updateVideoShowSize(true, true);
    }
    // 重置视频画面显示位置
    if (this.$videoRemoteBox.is(".smallView")) {
        this.switchViewPosition();
    }
    // 隐藏右上角悬浮框
    this.$goNetcall.addClass("hide");
    this.clearDurationTimer();
    this.$beCallingAcceptButton.toggleClass("loading", false);
    if (this.requestSwitchToVideoWaiting) {
        this.requestSwitchToVideoWaiting = false;
        try {
            // $("#askSwitchToVideoDialog").dialog("close");
        } catch (e) { }
    }
    this.$switchToAudioButton.toggleClass("disabled", false);
    this.$callingHangupButton.toggleClass("disabled", false);
    this.isBusy = false;
    this.clearRingPlay();
    $(".netcall-mask").toggleClass("hide", true);
    if (this.showTipTimer) {
        clearTimeout(this.showTipTimer);
        this.showTipTimer = null;
    }
    this.log("隐藏通话界面");
    this.resizeChatContent();
};
// 通话建立成功后，展示视频通话或者音频通话画面
NetcallBridge.fn.showConnectedUI = function (type) {
    this.checkDeviceStateUI();
    // this.$netcallBox.toggleClass("calling", true);
    this.$toggleFullScreenButton.toggleClass("hide", false);
    this.$netcallBox.find(".top").toggleClass('hide', false);
    this.$callingBox.toggleClass("hide", true);
    this.$videoShowBox.toggleClass("hide", type !== Netcall.NETCALL_TYPE_VIDEO);
    this.$audioShowBox.toggleClass("hide", type !== Netcall.NETCALL_TYPE_AUDIO);
    var info = this.yx.cache.getUserById(this.netcallAccount);
    if (type === Netcall.NETCALL_TYPE_AUDIO) {

        this.$audioShowBox.find(".nick").text(this.yx.getNick(this.netcallAccount));
        this.$audioShowBox.find('img').attr('src', getAvatar(info.avatar));

    }
    this.$switchToVideoButton.toggleClass("hide", type !== Netcall.NETCALL_TYPE_AUDIO);
    this.$switchToAudioButton.toggleClass("hide", type === Netcall.NETCALL_TYPE_AUDIO);
    this.$switchToAudioButton.toggleClass("disabled", this.requestSwitchToVideoWaiting);
    $(".asideBox .nick").text(this.yx.getNick(this.netcallAccount));
    this.$beCallingBox.toggleClass("hide", true);
};

/** 接收方显示来电界面，兼容多人音视频 by hzzouhuan
 * 
 * @param {string} type 通话类型，1： 音频，2：视频
 * @param {string} scene 通话场景，p2p(默认值) / team
 * @param {object} option 通话场景，p2p(默认值) / team
 * @param {string} option.teamId 群视频id
 * @param {string} option.caller 发起群视频的人
 */
NetcallBridge.fn.showBeCallingUI = function (type, scene, option) {
    scene = scene || 'p2p';
    option = option || {};
    this.type = type;
    this.$netcallBox.toggleClass("calling", true);
    this.$toggleFullScreenButton.toggleClass("hide", true);
    this.$switchToAudioButton.toggleClass("hide", true);
    this.$switchToVideoButton.toggleClass("hide", true);
    this.$netcallBox.find(".top").toggleClass('hide', false);
    if (this.yx.crtSessionType === "p2p" && this.yx.crtSessionAccount === this.netcallAccount) {
        this.$chatBox.toggleClass("show-netcall-box", true);
    }
    this.$callingBox.toggleClass("hide", true);
    this.isBusy = false;
    this.clearRingPlay();
    $(".netcall-mask").toggleClass("hide", true);
    if (this.showTipTimer) {
        clearTimeout(this.showTipTimer);
        this.showTipTimer = null;
    }
    this.$videoShowBox.toggleClass("hide", true);
    this.$audioShowBox.toggleClass("hide", true);

    this.$beCallingBox.toggleClass("hide", false);
    var text = " 邀请" + (type === Netcall.NETCALL_TYPE_VIDEO ? "视频" : "音频") + "通话...";
    var info = {};

    /** 群视频呼叫 */
    if (scene === 'team') {
        option.nick = getNick(option.caller);
        var tmpUser = this.yx.cache.getTeamMemberInfo(option.caller, option.teamId);
        if(tmpUser.nickInTeam){
            option.nick = option.nick === option.caller ? tmpUser.nickInTeam : option.nick;
        }

        text = option.nick + text;
        info = this.yx.cache.getTeamById(option.teamId);
        info.nick = info.name;
    } else {
        info = this.yx.cache.getUserById(this.netcallAccount);
        info.nick = this.yx.getNick(this.netcallAccount);
    }

    this.$beCallingText.text(text);

    this.$beCallingBox.find(".nick").text(info.nick);
    this.$beCallingBox.find('img').attr('src', getAvatar(info.avatar));
    this.$goNetcall.find(".tip").text("待接听...");
    this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);

    this.resizeChatContent();
};
// 发起方显示通话界面
NetcallBridge.fn.showCallingUI = function () {
    this.$netcallBox.toggleClass("calling", true);
    $("#toggleFullScreenButton").toggleClass("hide", false);
    $("#switchToVideo").toggleClass("hide", true);
    $("#switchToAudio").toggleClass("hide", true);
    if (this.yx.crtSessionType === "p2p" && this.yx.crtSessionAccount === this.netcallAccount) {
        this.$chatBox.toggleClass("show-netcall-box", true);
        var top = $('#chatContent').scrollTop()
        $('#chatContent').scrollTop(top + 324)
    }
    this.$callingBox.toggleClass("hide", false);
    var info = this.yx.cache.getUserById(this.netcallAccount);
    this.$netcallBox.find(".top").toggleClass('hide', false);
    this.$callingBox.find(".nick").text(this.yx.getNick(this.netcallAccount));
    this.$callingBox.find('img').attr('src', getAvatar(info.avatar));

    this.$videoShowBox.toggleClass("hide", true);
    this.$audioShowBox.toggleClass("hide", true);
    this.$beCallingBox.toggleClass("hide", true);
    this.$goNetcall.find(".tip").text("接通中...");
    this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
};
/**
 * 点击发起音视频通话按钮
 * @param {number} type 通话类型
 * 1: NETCALL_TYPE_AUDIO
 * 2: NETCALL_TYPE_VIDEO
 */
NetcallBridge.fn.onClickNetcallLink = function (type) {
    var that = this;
    // 已经处于音视频通话中，弹窗提示
    if (that.netcallActive) {
        minAlert.alert({
            type: 'error',
            msg: '正在通话中，无法发起新的通话', //消息主体
            cancelBtnMsg: '知道了' //取消按钮的按钮内容
        });
        return;
    }

    // p2p场景
    if (that.yx.crtSessionType === 'p2p') {
        deviceCheck.call(that);
        return;
    }

    // team多人场景: 人数少于2人的多人视频
    var tn = that.yx.crtSessionAccount;
    that.yx.getTeamMembers(tn, function () {
        if (that.yx.cache.getTeamMembers(tn).members.length < 2) {
            that.showTip('无法发起，人数少于2人', 2000);
            return;
        }
        deviceCheck.call(that);
    });

    function deviceCheck() {
        // 检查设备支持情况
        that.checkNetcallSupporting(function () {
            that.type = type;
            if (that.yx.crtSessionType === 'p2p') {
                that.doCalling.call(that, type)
                return;
            }
            //多人音视频
            that.showMeetingMemberListUI(type, that.yx.crtSessionAccount)
        }, reject, reject);
        function reject() {
            // 平台检查失败的处理
            if (that.yx.crtSessionType === 'team') {
                // that.sendTeamTip('发起视频通话失败', true)
                // 注：上面那种写法单单在IE10下面会报错说找不到sendTeamTip这个方法！！
                that.yx.sendTeamNetCallTip({
                    teamId: that.yx.crtSessionAccount,
                    account: that.yx.accid,
                    message: '发起视频通话失败',
                    isLocal: true
                });
            }
        }
    }
};
/** 错误事件响应，是应该下载插件还是重试 */
NetcallBridge.fn.clickAgentEvent = function (e) {
    var errorType = $(e.target).data('error-type');
    if (errorType === 'device_busy') {
        this.reCheckAgent();
        return;
    }
    this.clickDownloadAgent();
}
NetcallBridge.fn.reCheckAgent = function (e) {
    var that = this;
    function successCb() {
        that.updateBeCallingSupportUI(true);
    }
    function failureCb() {
        that.reject();
    }
    that.doAgentIntallCheck(successCb, failureCb);
}
NetcallBridge.fn.clickDownloadAgent = function () {
    location.href = this.agentDownloadUrl;
    function successCb() {
        this.updateBeCallingSupportUI(true);
    }
    successCb = successCb.bind(this);
    function failureCb() {
        this.updateBeCallingSupportUI(false);
    }
    failureCb = failureCb.bind(this);
    var closeDialog = this.showAgentInstallConfirmDialog(function () {
        closeDialog();
        this.doAgentIntallCheck(successCb, failureCb);
    }.bind(this), function () {
        failureCb();
    });
};
NetcallBridge.fn.checkNetcallSupporting = function (done, platformReject, agentReject, onlyCheckingSignal, notShowCheckingDialog) {
    if (this.signalInited) {
        return done();
    }
    // 1. 检查操作系统和浏览器
    // 2. 检查是否能连通agent
    this.checkPlatform(function () {
        this.checkAgentWorking(done, agentReject, onlyCheckingSignal, notShowCheckingDialog);
    }.bind(this), platformReject)

    // mac测试，后期需要删除
    // this.checkAgentWorking(done, agentReject, onlyCheckingSignal, notShowCheckingDialog);
};
NetcallBridge.fn.checkPlatform = function (done, failure) {
    failure = failure || function () { };
    if (platform.os.family.indexOf("Windows") !== -1 && (platform.os.version === "10" || platform.os.version === "7")) { // 判断是否是win7或win10
        if (platform.name === "Chrome" || platform.name === "Microsoft Edge" || (platform.name === "IE" && platform.version === "11.0")) { // 判断是否是Chrome, Edge, IE 11
            done();
        } else {
            // alert("只支持Chrome、Edge、IE 11");
            minAlert.alert({
                type: 'error',
                msg: '当前浏览器不支持音视频功能，请使用 Chrome、IE 11 或者 Edge 浏览器', //消息主体
                cancelBtnMsg: '知道了，挂断', //取消按钮的按钮内容
                cbCancel: failure
            });
        }
    } else {
        // alert("只支持win7或win10");
        minAlert.alert({
            type: 'error',
            msg: '当前系统不支持音视频功能，请使用win7、win10系统', //消息主体
            cancelBtnMsg: '知道了，挂断', //取消按钮的按钮内容
            cbCancel: failure
        });
    }
};
NetcallBridge.fn.updateBeCallingSupportUI = function (isSupport, showChecking, errObj) {

    this.$beCallingBox.find(".checking-tip").toggleClass("hide", !showChecking);
    this.$beCallingAcceptButton.toggleClass("disabled", !!showChecking);

    this.$beCallingBox.find(".op").toggleClass("no-agent", !isSupport);
    errObj = errObj || {};
    var msg = errObj && errObj.constructor === Object ? errObj.error : "下载音视频插件";
    this.$beCallingBox.find("#downloadAgentButton").text(msg);
    if (errObj.errorType) {
        this.$beCallingBox.find("#downloadAgentButton").data('error-type', errObj.errorType);
    }

};
NetcallBridge.fn.checkAgentWorking = function (done, failure, onlyCheckingSignal, notShowCheckingDialog) {
    console.log("checkAgentWorking");
    failure = failure || function () { };
    done = done || function () { };
    var closeCheckingDialog = function () { };
    var canceled = false;
    if (!notShowCheckingDialog) {
        closeCheckingDialog = this.showCheckingDialog(function () {
            // 点击弹框x时
            canceled = true;
            failure();
        });
    }
    console.log("start netcall initSignal");
    this.netcall.initSignal().then(function () {
        console.log("netcall initSignal success");
        this.signalInited = true;
        if (canceled) return;
        if (notShowCheckingDialog) return done();
        closeCheckingDialog();
        var closeSuccessDialog = this.showSuccessDialog(function () {
            done();
            closeSuccessDialog();
        });

    }.bind(this)).catch(function (err) {
        console.log("netcall initSignal error", err);
        if (canceled) return;
        // alert("未检测到agent");
        closeCheckingDialog();

        if (onlyCheckingSignal) return failure(err);
        this.showAgentNeedInstallDialog(err, done, failure);
    }.bind(this));

};
NetcallBridge.fn.showAgentNeedInstallDialog = function (errOjb, successCb, failureCb) {
    var that = this;
    var msg_text = errOjb.error || "请安装插件PC Agent，方可使用音视频功能";
    var errorType = errOjb.errorType || "agent_empty";
    var btn_text = (errorType === "device_busy" ? "已解决，重试" : "下载插件");
    minAlert.alert({
        type: 'error',
        msg: msg_text, //消息主体
        subMsg: '拒绝调用插件申请会导致无法唤起插件,需重启浏览器',
        cancelBtnMsg: '不使用音视频', //取消按钮的按钮内容
        confirmBtnMsg: btn_text,
        cbCancel: failureCb,
        cbConfirm: function () {

            if (errorType === "device_busy") {
                that.doAgentIntallCheck(successCb, failureCb);
                return;
            }
            location.href = that.agentDownloadUrl;
            var closeDialog = that.showAgentInstallConfirmDialog(function () {
                closeDialog();
                that.doAgentIntallCheck(successCb, failureCb);
            }, function () {
                failureCb();
            });
        }
    });

};
NetcallBridge.fn.doAgentIntallCheck = function (successCb, failureCb) {
    successCb = successCb || function () { };
    failureCb = failureCb || function () { };
    console.log("do checking");
    var canceled = false;
    var closeCheckingDialog = this.showCheckingDialog(function () {
        // 点击x关闭弹窗时
        canceled = true;
        failureCb();
    });
    console.log("start netcall initSignal");
    this.netcall.initSignal().then(function () {
        console.log("netcall initSignal success");
        this.signalInited = true;
        if (canceled) return;
        closeCheckingDialog();
        var closeSuccessDialog = this.showSuccessDialog(function () {
            closeSuccessDialog();
            successCb();
        });

    }.bind(this)).catch(function (err) {

        console.log("netcall initSignal error", err);
        if (canceled) return;
        // alert("未检测到agent");
        closeCheckingDialog();
        var closeDialog = this.showAgentCheckingFailureDialog(err, function () {
            this.doAgentIntallCheck(successCb, failureCb);
            // closeDialog();

        }.bind(this), function () {
            closeDialog();
            failureCb();
        })
    }.bind(this))
};
NetcallBridge.fn.showAgentCheckingFailureDialog = function (errOjb, done, reject) {
    var text = errOjb.error || "未检测到插件！请确认已安装插件并未被占用";
    var errorType = errOjb.errorType;
    minAlert.alert({
        type: 'error',
        msg: text, //消息主体
        subMsg: '拒绝调用插件申请会导致无法唤起插件,需重启浏览器',
        cancelBtnMsg: '不使用音视频', //取消按钮的按钮内容
        confirmBtnMsg: '已解决，重试',
        cbCancel: reject,
        cbConfirm: done
    });

    return function () {
        minAlert.close();
    };
};
NetcallBridge.fn.showAgentInstallConfirmDialog = function (done, failure) {
    minAlert.alert({
        type: 'error',
        msg: '下载完成后，需手动安装插件', //消息主体
        confirmBtnMsg: '已安装', //取消按钮的按钮内容
        showCancel: false,
        cbConfirm: done,
        cbCancel: failure
    });
    return function () {
        minAlert.close();
    };
};
NetcallBridge.fn.showCheckingDialog = function (onCancel) {
    minAlert.alert({
        type: 'error',
        msg: '检查插件中...<span class="netcall-icon-checking"></span>', //消息主体
        showCancel: false,
        cbCancel: onCancel
    });
    return function () {
        minAlert.close();
    };
};
NetcallBridge.fn.showSuccessDialog = function (done) {
    var timer;
    function agree() {
        clearTimeout(timer);
        done();
    }
    timer = setTimeout(agree, 1000);
    minAlert.alert({
        type: 'success',
        msg: '成功检测到插件！', //消息主体
        confirmBtnMsg: '自动跳转...', //取消按钮的按钮内容
        showCancel: false,
        cbConfirm: agree
    });
    return function () {
        minAlert.close();
        clearTimeout(timer);
    };
};
/** 点击左侧列表，打开聊天窗口时，判断是否是单人聊天，调整ui
 * 是否当前在通话中，切换了别的窗口
 */
NetcallBridge.fn.whenOpenChatBox = function (scene, account) {
    // this.$msgInput.toggleClass("p2p", scene === "p2p");
    /** 多人隐藏音频按钮 */
    this.$netcallAudioLink.toggleClass("hide", scene !== "p2p");
    // this.$netcallVideoLink.toggleClass("hide", scene !== "p2p");

    /** 当前正在通话中或者被叫中 */
    if (this.netcallActive || this.beCalling) {
        isOtherBoxDisable = $('#teamInfoContainer').hasClass('hide') && $('#cloudMsgContainer').hasClass('hide')
        this.$goNetcall.toggleClass("hide", account === this.netcallAccount && isOtherBoxDisable);

        this.$chatBox.toggleClass("show-netcall-box", account === this.netcallAccount);

        this.$chatBox.toggleClass("hide-netcall-box", account !== this.netcallAccount);
    }
    // this.$goNetcall.toggleClass("hide", !this.netcallActive || account === this.netcallAccount);



    this.resizeChatContent();
};
/** 动态更改文字聊天窗口的高度 */
NetcallBridge.fn.resizeChatContent = function (scene, account) {
    var h = this.yx.$chatTitle.height();
    h = h + (this.$chatBox.hasClass('show-netcall-box') ? this.$netcallBox.height() : 0);
    /** 最小值81 */
    h = h >= 81 ? h : 81;
    var top = this.yx.$chatContent.position().top;

    if (h === top) return;
    this.yx.$chatContent.css({
        top: (h + 1) + 'px'
    });
};

NetcallBridge.fn.getDurationText = function (ms) {
    var allSeconds = parseInt(ms / 1000);
    var result = "";
    var hours, minutes, seconds;
    if (allSeconds >= 3600) {
        hours = parseInt(allSeconds / 3600);
        result += ("00" + hours).slice(-2) + " : ";
    }
    if (allSeconds >= 60) {
        minutes = parseInt(allSeconds % 3600 / 60);
        result += ("00" + minutes).slice(-2) + " : ";
    } else {
        result += "00 : ";
    }
    seconds = parseInt(allSeconds % 3600 % 60);
    result += ("00" + seconds).slice(-2);
    return result;
};

/** 通话计时器
 * 场景：p2p音视频 / 多人音视频
 * @param {dom对象} box 倒计时容器
 */
NetcallBridge.fn.startDurationTimer = function (box) {
    box = box || $(".netcall-show-audio .tip,.netcall-show-video .tip,.asideBox .tip,.netcall-meeting-box .option-box .tip");
    this.clearDurationTimer();
    function timer() {
        var now = (new Date()).getTime();
        this.netcallDuration = now - this.netcallStartTime;
        var timeText = this.getDurationText(this.netcallDuration);
        box.text(timeText);
    }
    timer = timer.bind(this);
    this.netcallDuration = 0;
    this.netcallStartTime = (new Date()).getTime();
    this.netcallDurationTimer = setInterval(timer, 500);
    timer();
};
NetcallBridge.fn.clearDurationTimer = function () {
    if (this.netcallDurationTimer) {
        clearInterval(this.netcallDurationTimer);
        this.netcallDurationTimer = null;
    }
};

/***************多人音视频的UI部分******************************/
/**
 * 显示选择好友列表
 */
NetcallBridge.fn.showMeetingMemberListUI = function (type, teamId) {
    this.yx.myNetcall.getMeetingMemberListUI()
};

