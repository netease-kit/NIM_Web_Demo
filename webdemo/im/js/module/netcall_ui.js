/*
 * 点对点音视频通话中对应的ui相关逻辑
*/
(function() {
    // 每当设备信息发生变化时，调用此方法同步设备控制按钮状态和提示信息，更新设备输入,更新视频画面提示信息等
    NetcallBridge.fn.checkDeviceStateUI = function() {
        this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_VIDEO).then(function(obj) {
            if(obj.devices.length) {
                if (this.$controlItem.filter(".camera").is(".no-device")) { // 摄像头从无到有的变化
                    // 开启摄像头
                    this.setDeviceVideoIn(true);
                    // 开始推送本地流
                    this.netcall.startLocalStream();
                    // 更新画面显示大小
                    this.updateVideoShowSize(true);
                    $(".netcall-video-local").toggleClass("empty", false);
                    $(".netcall-video-local .message").text("");
                }
                this.$controlItem.filter(".camera").toggleClass("no-device", false).attr("title","");
            } else {
                // 通知对方，我方摄像头不可用
                this.netcall.control({
                    command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
                });
                $(".netcall-box .camera.control-item").toggleClass("no-device", true).attr("title","摄像头不可用");
                $(".netcall-video-local").toggleClass("empty", true);
                $(".netcall-video-local .message").text("摄像头不可用");
            }
        }.bind(this));
        this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_AUDIO_IN).then(function(obj) {
            if(obj.devices.length) {
                if (this.$controlItem.filter(".microphone").is(".no-device")) {
                    this.setDeviceAudioIn(true);
                }
                this.$controlItem.filter(".microphone").toggleClass("no-device", false).attr("title","");
            } else {
                this.$controlItem.filter(".microphone").toggleClass("no-device", true).attr("title","麦克风不可用");
            }
        }.bind(this));
        this.netcall.getDevicesOfType(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT).then(function(obj) {
            if(obj.devices.length) {
                if (this.$controlItem.filter(".volume").is(".no-device")) {
                    this.setDeviceAudioOut(true);
                }
                this.$controlItem.filter(".volume").toggleClass("no-device", false).attr("title","");
            } else {
                this.$controlItem.filter(".volume").toggleClass("no-device", true).attr("title","麦克风不可用");
            }
        }.bind(this));
    };
    // 切换对方我方画面位置
    NetcallBridge.fn.switchViewPosition = function(){
        var $smallView = $(".netcall-box .smallView");
        var $bigView = $(".netcall-box .bigView");
        var $smallParent = $smallView[0].parentNode;
        var $bigParent = $bigView[0].parentNode;
        $bigView.prependTo($smallParent).addClass("smallView").removeClass("bigView");
        $smallView.prependTo($bigParent).addClass("bigView").removeClass("smallView");

        this.updateVideoShowSize(true, true);
    };
    NetcallBridge.fn.toggleFullScreen = function() {
        this.isFullScreen = !this.isFullScreen;
        this.$netcallBox.toggleClass("fullscreen", this.isFullScreen);
        this.$netcallBox.find(".fullScreenIcon").toggleClass("full", this.isFullScreen);
        this.updateVideoShowSize(true, true);
    };
    // UI界面蒙版展示提示信息，指定时间后消失，消失后执行回调函数
    NetcallBridge.fn.showTip = function(message, duration, done){
        $(".netcall-mask").toggleClass("hide", false).find(".netcallTip").text(message);
        this.showTipTimer = setTimeout(function() {
            $(".netcall-mask").toggleClass("hide", true).find(".netcallTip").text("");
            done();
            this.showTipTimer = null;
        }.bind(this), duration);
    };
    // 更新视频画面显示尺寸
    NetcallBridge.fn.updateVideoShowSize = function(local, remote) {
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
    NetcallBridge.fn.hideAllNetcallUI = function() {
        this.clearRingPlay();
        this.$chatBox.toggleClass("show-netcall-box", false);
        this.$callingBox.toggleClass("hide", true);
        this.$videoShowBox.toggleClass("hide", true);
        this.$audioShowBox.toggleClass("hide", true);
        this.$beCallingBox.toggleClass("hide", true);
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
        if(this.requestSwitchToVideoWaiting) {
            this.requestSwitchToVideoWaiting = false;
            try{
                $("#askSwitchToVideoDialog").dialog( "close" );
            }catch(e){}
        }
        this.$switchToAudioButton.toggleClass("disabled", false);
        this.$callingHangupButton.toggleClass("disabled", false);
        this.isBusy = false;
        this.clearRingPlay();
        $(".netcall-mask").toggleClass("hide", true);
        if(this.showTipTimer) {
            clearTimeout(this.showTipTimer);
            this.showTipTimer = null;
        }
        this.log("隐藏通话界面");
    };
    // 通话建立成功后，展示视频通话或者音频通话画面
    NetcallBridge.fn.showConnectedUI = function(type) {
        this.checkDeviceStateUI();
        this.$toggleFullScreenButton.toggleClass("hide", false);
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
    NetcallBridge.fn.showBeCallingUI = function(type) {
        this.$toggleFullScreenButton.toggleClass("hide", true);
        this.$switchToAudioButton.toggleClass("hide", true);
        this.$switchToVideoButton.toggleClass("hide", true);
        if (this.yx.crtSessionType === "p2p" && this.yx.crtSessionAccount === this.netcallAccount) {
            this.$chatBox.toggleClass("show-netcall-box", true);
        }
        this.$callingBox.toggleClass("hide", true);
        this.isBusy = false;
        this.clearRingPlay();
        $(".netcall-mask").toggleClass("hide", true);
        if(this.showTipTimer) {
            clearTimeout(this.showTipTimer);
            this.showTipTimer = null;
        }
        this.$videoShowBox.toggleClass("hide", true);
        this.$audioShowBox.toggleClass("hide", true);

        this.$beCallingBox.toggleClass("hide", false);
        var text = "邀请" + (type === Netcall.NETCALL_TYPE_VIDEO ? "视频" : "音频") + "通话...";
        this.$beCallingText.text(text);
        var info = this.yx.cache.getUserById(this.netcallAccount);
        this.$beCallingBox.find(".nick").text(this.yx.getNick(this.netcallAccount));
        this.$beCallingBox.find('img').attr('src', getAvatar(info.avatar));
        this.$goNetcall.find(".tip").text("待接听...");
        this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
    };
    NetcallBridge.fn.showCallingUI = function(){
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
        this.$callingBox.find(".nick").text(this.yx.getNick(this.netcallAccount));
        this.$callingBox.find('img').attr('src', getAvatar(info.avatar));

        this.$videoShowBox.toggleClass("hide", true);
        this.$audioShowBox.toggleClass("hide", true);
        this.$beCallingBox.toggleClass("hide", true);
        this.$goNetcall.find(".tip").text("接通中...");
        this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);
    };
    // 点击发起音视频通话按钮
    NetcallBridge.fn.onClickNetcallLink = function(type) {
        if (this.netcallActive) { // 已经处于音视频通话中，弹窗提示
            function agree() {
                $("#alertDuplicateDialog").dialog( "close" );
            }
            $( "#alertDuplicateDialog" ).dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: 480,
                modal: true,
                title: "提示",
                classes: {
                    "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-3"
                },
                close: agree.bind(this),
                buttons: {
                    "知道了": agree.bind(this)
                }
            });
        } else {
            // 检查支持情况
            this.checkNetcallSupporting(this.doCalling.bind(this, type));

        }

    };
    NetcallBridge.fn.clickDownloadAgent = function() {
        location.href = this.agentDownloadUrl;
        function successCb(){
            this.updateBeCallingSupportUI(true);
        }
        successCb = successCb.bind(this);
        function failureCb(){
            this.updateBeCallingSupportUI(false);
        }
        failureCb = failureCb.bind(this);
        var closeDialog = this.showAgentInstallConfirmDialog(function() {
            closeDialog();
            this.doAgentIntallCheck(successCb, failureCb);
        }.bind(this), function() {
            failureCb();
        });
    };
    NetcallBridge.fn.checkNetcallSupporting = function(done, platformReject, agentReject, onlyCheckingSignal, notShowCheckingDialog) {
        if (this.signalInited) {
            return done();
        }
        // 1. 检查操作系统和浏览器
        // 2. 检查是否能连通agent
        this.checkPlatform(function(){
            this.checkAgentWorking(done, agentReject, onlyCheckingSignal, notShowCheckingDialog);
        }.bind(this), platformReject)
    };
    NetcallBridge.fn.checkPlatform  = function(done, failure) {
        failure = failure || function(){};
        if (platform.os.family.indexOf("Windows") !== -1 && (platform.os.version === "10" || platform.os.version === "7")) { // 判断是否是win7或win10
            if (platform.name === "Chrome" || platform.name === "Microsoft Edge" || (platform.name === "IE" && platform.version === "11.0")) { // 判断是否是Chrome, Edge, IE 11
                done();
            } else {

                // alert("只支持Chrome、Edge、IE 11");
                $( "#browserNotSupportDialog" ).dialog({
                    resizable: false,
                    draggable: false,
                    height: "auto",
                    width: 480,
                    modal: true,
                    title: "提示",
                    classes: {
                        "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-3"
                    },
                    close: function(e){
                        if(e && e.originalEvent) {
                            failure();
                        }
                    },
                    buttons: {
                        "知道了": function(){
                            $( "#browserNotSupportDialog" ).dialog("close");
                            failure();
                        }
                    }
                });
            }
        } else {
            // alert("只支持win7或win10");
            $( "#osNotSupportDialog" ).dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: 480,
                modal: true,
                title: "提示",
                classes: {
                    "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-3"
                },
                close: function(e){
                    if(e && e.originalEvent) {
                        failure();
                    }
                },
                buttons: {
                    "知道了": function(){
                        $( "#osNotSupportDialog" ).dialog("close");
                        failure();
                    }
                }
            });
        }
    };

    NetcallBridge.fn.updateBeCallingSupportUI = function(isSupport, showChecking){

        this.$beCallingBox.find(".checking-tip").toggleClass("hide",!showChecking);
        this.$beCallingAcceptButton.toggleClass("disabled", !!showChecking);

        this.$beCallingBox.find(".op").toggleClass("no-agent", !isSupport);
    };
    NetcallBridge.fn.checkAgentWorking = function(done, failure, onlyCheckingSignal, notShowCheckingDialog) {
        console.log("checkAgentWorking");
        failure = failure || function(){};
        done = done || function(){};
        var closeCheckingDialog = function(){};
        var canceled = false;
        if(!notShowCheckingDialog) {
            closeCheckingDialog = this.showCheckingDialog(function(){
                // 点击弹框x时
                canceled = true;
                failure();
            });
        }
        console.log("start netcall initSignal");
        this.netcall.initSignal().then(function() {
            console.log("netcall initSignal success");
            this.signalInited = true;
            if(canceled) return;
            if(notShowCheckingDialog) return done();
            closeCheckingDialog();
            var closeSuccessDialog = this.showSuccessDialog(function(){
                done();
                closeSuccessDialog();
            });


        }.bind(this)).catch(function(err) {
            console.log("netcall initSignal error", err);
            if(canceled) return;
            // alert("未检测到agent");
            closeCheckingDialog();
            if(onlyCheckingSignal) return failure();
            this.showAgentNeedInstallDialog(done, failure);
        }.bind(this));

    };
    NetcallBridge.fn.showAgentNeedInstallDialog = function(successCb, failureCb){
        $( "#agentNeedInstallDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-1"
            },
            close: function(e){
                if(e && e.originalEvent) {
                    failureCb();
                }
            },
            buttons: {
                "不使用音视频": function(){
                    $( "#agentNeedInstallDialog" ).dialog("close");
                    failureCb();
                },
                "下载插件": function(){
                    location.href = this.agentDownloadUrl;
                    $( "#agentNeedInstallDialog" ).dialog("close");
                    var closeDialog = this.showAgentInstallConfirmDialog(function() {
                        closeDialog();
                        this.doAgentIntallCheck(successCb, failureCb);
                    }.bind(this), function() {
                        failureCb();
                    });
                }.bind(this)
            }
        });
    };
    NetcallBridge.fn.doAgentIntallCheck = function(successCb, failureCb) {
        successCb = successCb || function(){};
        failureCb = failureCb || function(){};
        console.log("do checking");
        var canceled = false;
        var closeCheckingDialog = this.showCheckingDialog(function(){
            // 点击x关闭弹窗时
            canceled = true;
            failureCb();
        });
        console.log("start netcall initSignal");
        this.netcall.initSignal().then(function() {
            console.log("netcall initSignal success");
            this.signalInited = true;
            if (canceled) return;
            closeCheckingDialog();
            var closeSuccessDialog = this.showSuccessDialog(function() {
                closeSuccessDialog();
                successCb();
            });

        }.bind(this)).catch(function(err) {
            console.log("netcall initSignal error", err);
            if (canceled) return;
            closeCheckingDialog();
            var closeDialog = this.showAgentCheckingFailureDialog( function(){
                this.doAgentIntallCheck();
                closeDialog();
                
            }.bind(this), function(){
                closeDialog();
                failureCb();
            })
        }.bind(this))
    };
    NetcallBridge.fn.showAgentCheckingFailureDialog = function(done, reject){
        $( "#agentCheckingFailureDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-1 "
            },
            close: function(e){
                if(e && e.originalEvent) {
                    reject();
                }
            },
            buttons: {
                "不使用音视频": reject,
                "已安装": done

            }
        });
        return function(){
            $( "#agentCheckingFailureDialog" ).dialog("close");
        };
    };
    NetcallBridge.fn.showAgentInstallConfirmDialog = function(done, failure) {
        $( "#agentInstallConfirmDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-4 "
            },
            close: function(e){
                if(e && e.originalEvent) {
                    failure();
                }
            },
            buttons: {
                "已安装": done
            }
        });
        return function(){
            $( "#agentInstallConfirmDialog" ).dialog("close");
        };
    };
    NetcallBridge.fn.showCheckingDialog = function(onCancel) {
        $( "#agentCheckingDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            close: function(e){
                if(e && e.originalEvent) { // 通过 x 图标关闭
                    onCancel();
                }
            },
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-3"
            },
            buttons: {
            }
        });
        return function(){
            $( "#agentCheckingDialog" ).dialog("close");
        };
    };
    NetcallBridge.fn.showSuccessDialog = function(done) {
        var timer;
        function agree() {
            clearTimeout(timer);
            done();
        }
        $( "#agentCheckSuccessDialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 480,
            modal: true,
            title: "提示",
            classes: {
                "ui-dialog": "netcall-ui-dialog netcall-ui-dialog-5"
            },
            buttons: {
                "自动跳转...": agree
            }
        });
        timer = setTimeout(agree, 1000);
        return function(){
            $( "#agentCheckSuccessDialog" ).dialog("close");
            clearTimeout(timer);
        };
    };

    // 点击左侧列表，打开聊天窗口时，判断是否是单人聊天，调整ui
    NetcallBridge.fn.whenOpenChatBox = function(scene, account) {
        this.$msgInput.toggleClass("p2p", scene === "p2p");
        this.$netcallAudioLink.toggleClass("hide", scene !== "p2p");
        this.$netcallVideoLink.toggleClass("hide", scene !== "p2p");

        this.$goNetcall.toggleClass("hide", !this.netcallActive ||  account === this.netcallAccount);

        this.$chatBox.toggleClass("show-netcall-box", this.netcallActive && account === this.netcallAccount);

    };
    NetcallBridge.fn.getDurationText = function(ms) {
        var allSeconds = parseInt(ms/1000);
        var result = "";
        var hours,minutes,seconds;
        if (allSeconds >= 3600) {
            hours = parseInt(allSeconds/3600);
            result += ("00" + hours).slice(-2) + " : ";
        }
        if(allSeconds >= 60) {
            minutes = parseInt(allSeconds % 3600 / 60);
            result += ("00" + minutes).slice(-2) + " : ";
        } else {
            result += "00 : ";
        }
        seconds = parseInt(allSeconds % 3600 %60);
        result += ("00" + seconds).slice(-2);
        return result;
    };
    NetcallBridge.fn.startDurationTimer = function(){
        this.clearDurationTimer();
        function timer(){
            var now = (new Date()).getTime();
            this.netcallDuration = now - this.netcallStartTime;
            var timeText = this.getDurationText(this.netcallDuration);
            $(".netcall-show-audio .tip,.netcall-show-video .tip,.asideBox .tip").text(timeText);
        }
        timer = timer.bind(this);
        this.netcallDuration = 0;
        this.netcallStartTime = (new Date()).getTime();
        this.netcallDurationTimer = setInterval(timer, 500);
        timer();
    };
    NetcallBridge.fn.clearDurationTimer = function() {
        if (this.netcallDurationTimer) {
            clearInterval(this.netcallDurationTimer);
            this.netcallDurationTimer = null;
        }
    };
})();