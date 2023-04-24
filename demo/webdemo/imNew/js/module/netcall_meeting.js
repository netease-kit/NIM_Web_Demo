/**
 * 多人音视频控制
 */

var fn = NetcallBridge.prototype;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

//
/**
 * 生成参与多人音视频的可供选择的群成员的列表UI
 */
fn.getMeetingMemberListUI = function (isCalling) {
    var that = this;
    var listContainer = $('#dialogTeamContainer')
    var teamId = that.yx.crtSessionAccount

    that.yx.getTeamMembers(teamId, showMember);

    function showMember() {
        var list = that.yx.cache.getTeamMembers(teamId).members;
        // 绑定环境，回调继续用
        var selectedList = list.map(function(item) {
            if (that.meetingCall.members && Object.keys(that.meetingCall.members).indexOf(item.account) > -1) {
                return item;
            }
        }).filter(function(item) {
            return !!item;
        });
        that.yx.dialog.open({ list: list, cbConfirm: cbConfirm, cbCancel: cbCancel, env: that, yx: that.yx, limit: 8, selectedlist: selectedList });
    }

    // 回调传回来选中的列表
    function cbConfirm(list) {
        that.meetingCall.members = list;
        that.meetingCall.caller = that.netcall.getAccount && that.netcall.getAccount() || that.yx.accid;
        if (!isCalling) {
            that.createChannel();
        } else {
            const newList = Array.from(listContainer.find('.icon-radio.cur')).filter(item => {
                return $(item).parent().hasClass('selected')
            }).map(item => {
                return $(item).parent().attr('data-account')
            })
            that.groupInvite(newList);
        }
    }

    // 取消多人音视频，放开通道
    function cbCancel() {
        that.signalInited = false;
        if (!isCalling) {
            that.meetingCall = { members: that.meetingCall.members };
        }
        that.netcall && that.netcall.stopSignal && that.netcall.stopSignal()
    }
}

fn.groupInvite = function(list) {
    // debugger;
    this.netcall.groupInvite({
        userIds: list,
        groupId:  this.netcall.channelName,
        attachment: JSON.stringify({
            groupInvite: "testValue"
        })
    }).then(function (obj) {
        console.log("通话中邀请成功，等待对方接听");
        var $addIconItem = $('#addIconItem'),
            html = "";
        html = '<span class="icons icon-add"></span>'
        $addIconItem.html(html)
        $addIconItem.removeClass('control-item-hide')
    }).catch(function (err) {
        console.log("通话中邀请失败：", err);
    });
}

fn.onGroupUserEnter = function(item) {
    if(!item) {
        return
    }
    var $addUserUl = $('#memberList')
    if (!$addUserUl.find(`.item[data-account="${item}"]`).length){
        var node = appUI.buildmeetingMemberUI({ account: item, nick: getNick(item), avatar: this.yx.cache.getUserById(item).avatar });
        $addUserUl.append(node);
    }
}

/** 根据选中的人数，生成房间UI
 * @param {array} list 参与音视频的成员列表,eg: ['id1','id2'...]
 */
fn.getMeetingCallUI = function (list, isCaller) {
    console.warn('根据选中的人数，生成房间UI: ', list)
    var dialog = $('#netcallMeetingBox');
    var that = this;
    dialog.load('./netcall_meeting.html', function () {
        var $addUserUl = $('#memberList'), tmp = '';

        // 拉取模板失败，连不上网的情况下,
        if ($addUserUl.length === 0) {
            that.resetWhenHangup();
            that.showTip('网络错误，加入房间失败', 2000);
        }

        if ($("#devices")) {
            $("#devices").addClass('hide')
        }
        dialog.removeClass('hide');
        list.forEach(function (item) {
            tmp += appUI.buildmeetingMemberUI({ account: item, nick: getNick(item), avatar: that.yx.cache.getUserById(item).avatar });
        });
        $addUserUl.html(tmp);

        // 判断是否是firefox, 显示桌面共享按钮
        if (platform.name === 'Firefox' && that.isRtcSupported) {
            $('.J-desktop-share').toggleClass('hide', false)
        }
        console.warn('要accept, isCaller: ', isCaller)
        if (isCaller) {
            that.joinChannel()
        } else {
            that.setLocalView();
            that.netcall.accept().then(function(){
                console.warn('接受成功，')
                that.startLocalStreamMeeting()
                that.setVideoViewSize(that.videoCaptureSize);
            }).catch(function(err){
                console.warn('接受err: ', err)
                that.showTip(`接听失败: ${err.message || ''}`, 2000, function() {
                    that.hideAllNetcallUI();
                    that.resetWhenHangup();
                });
            })
        }

        that.$chatBox.toggleClass("show-netcall-box", true);
        /** 重置文案聊天高度 */
        that.resizeChatContent();

        that.initMeetingCallEvent();

    });
}

/** 打开禁言弹框 */
fn.showSpeakBanUI = function (list) {

    var arr = [], that = this;
    list && list.forEach(function (item) {
        arr.push({ account: item, nick: getNick(item), avatar: that.yx.cache.getUserById(item).avatar })
    });

    that.yx.dialog.open({ list: arr, type: 'list', isCompleteList: true, cbConfirm: that.disableSpeak, env: that, yx: that.yx, selectedlist: that.meetingCall.banList });

}

/**
 * 设置禁言
 * @param {object} listObj 被禁言的人列表
 */
fn.disableSpeak = function (listObj) {
    console.log(listObj)
    if (!this.meetingCall.banList) {
        this.meetingCall.banList = {};
    }
    var client = this.webrtc.getSdkInstance().rtcClient
    var list = this.meetingCall.list, that = this, banlist = that.meetingCall.banList;
    list.forEach(function (item) {
        if (item in listObj) {
            that.netcall.setAudioBlack(item)
            console.log('设置禁言: ', item)
            client.adapterRef.remoteStreamMap[item].muteAudio()
        }
        else {
            //that.netcall.setAudioStart(item)
            client.adapterRef.localStream.unmuteAudio()
        }
    });
    that.meetingCall.banList = listObj;
}

/** 初始化多人音视频绑定事件 */
fn.initMeetingCallEvent = function () {
    var that = this;
    that.meetingCall.$box = that.meetingCall.$box || $('#netcallMeetingBox');
    var $box = that.meetingCall.$box;

    /** 音量滑条事件绑定，有代码冗余，html结构的原因 */
    // 初始化音量调节slider
    function doRangeSliderInit(selector, fn) {
        selector = $box.find(selector);
        selector.rangeslider({
            polyfill: false,
            onSlide: function (position, value) {
                selector.parent().find(".txt").text(value);
            },
            onSlideEnd: function (position, value) {
                var client = this.webrtc.getSdkInstance().rtcClient
                console.log('fnfnfn: ', fn)
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

    // 麦克风、摄像头按钮在hover的时候显示音量调节的slider
    $box.find('.control-item').hover(function () {
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

    /** 其他绑定事件，如果已经绑定过，则不再绑定 */
    if (that.meetingCall.inited) return;

    $box.on('click', '.hangupButton', function (e) {
        that.leaveChannel();
        console.log('hangup')
    });

    $box.on('click', '.setAudioMute', function(e) {
        var $target = $(e.target);
        var $icon = $target.find('.audioMute-icon');
        var userId = $target.data('account');
        if (userId === userUID) {
            return;
        }
        if ($target.hasClass('mute')) {
            that.netcall.setAudioMute(false, userId).then(() => {
                console.log('开启声音成功')
                $target.removeClass('mute');
                $icon.attr('src', 'images/audio-unmute.png');
            }).catch(e => {
                console.log('开启声音失败：', e);
            });
        } else {
            that.netcall.setAudioMute(true, userId).then(() => {
                console.log('静音成功')
                $target.addClass('mute');
                $icon.attr('src', 'images/audio-mute.png');
            }).catch(e => {
                console.log('静音失败：', e);
            });
        }
    })

    // $box.on('click', '.fullScreenIcon', function (e) {
    //     $box.toggleClass('fullscreen');
    //     var isFullScreen = $box.hasClass('fullscreen');
    //     that.$netcallBox.toggleClass("fullscreen", isFullScreen);
    //     var screenSize = isFullScreen ? '216' : '136';
    //     that.videoCaptureSize = { width: screenSize, height: screenSize };
    //     that.setVideoViewSize();
    //     that.setVideoViewRemoteSize();
    // });

    $box.on('click', '.microphone', function (e) {
        console.log('microphone')
    });
    $box.on('click', '.volume', function (e) {
        console.log('volume')
    });
    $box.on('click', '.camera', function (e) {
        console.log('camera')
    });
    $box.on('click', '.add', function (e) {
        console.log('add')
    });
    $box.on('click', '.speakBan', function (e) {
        if ($(e.target).hasClass('icon-disabled')) return;
        that.showSpeakBanUI(that.meetingCall.list);
    });

    /** 在线离线事件注册 */
    window.addEventListener('online', that.online.bind(that));
    window.addEventListener('offline', function (e) {
        that.offline.call(that, e)
    });

    that.meetingCall.inited = true;
}

// /**
//  * 多人音视频过程的控制处理
//  * @param {object} obj 传递过来的控制对象属性
//  */
// fn.onMeetingControl = function (obj) {
//     this.log('meeting control');
//     console.log(obj);
//     var account = obj.account, joinedMembers = this.meetingCall.joinedMembers;

//     if (!joinedMembers || !joinedMembers[account]) {
//         return;
//     }

//     switch (obj.type) {
//         // NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON 通知对方自己打开了音频
//         case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON:
//             this.log("对方打开了麦克风");
//             break;
//         // NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF 通知对方自己关闭了音频
//         case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF:
//             this.log("对方关闭了麦克风");
//             break;
//         // NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON 通知对方自己打开了视频
//         case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON:
//             this.log("对方打开了摄像头");
//             this.nodeLoadingStatus(obj.account, '');
//             this.nodeCameraStatus(obj.account, true);
//             this.netcall.setVideoShow(obj.account);
//             break;
//         // NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF 通知对方自己关闭了视频
//         case Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF:
//             this.log("对方关闭了摄像头");
//             this.nodeLoadingStatus(obj.account, '对方关闭了摄像头');
//             this.nodeCameraStatus(obj.account, false);
//             this.netcall.setVideoBlack(obj.account);
//             break;
//         // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT 拒绝从音频切换到视频
//         case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT:
//             this.log("对方拒绝从音频切换到视频通话");
//             break;
//         // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO 请求从音频切换到视频
//         case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO:
//             this.log("对方请求从音频切换到视频通话");
//             break;
//         // NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE 同意从音频切换到视频
//         case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE:
//             this.log("对方同意从音频切换到视频通话");
//             break;
//         // NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO 从视频切换到音频
//         case Netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO:
//             this.log("对方请求从视频切换为音频");
//             break;
//         // NETCALL_CONTROL_COMMAND_BUSY 占线
//         case Netcall.NETCALL_CONTROL_COMMAND_BUSY:
//             this.log("对方正在通话中");
//             this.log("取消通话");
//             this.nodeLoadingStatus(obj.account, '对方正在通话中');
//             break;
//         // NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID 自己的摄像头不可用
//         case Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID:
//             this.log("对方摄像头不可用");
//             this.nodeLoadingStatus(obj.account, '对方摄像头不可用');
//             this.nodeCameraStatus(obj.account, false);
//             this.netcall.setVideoBlack(obj.account);
//             break;
//         // NETCALL_CONTROL_COMMAND_SELF_ON_BACKGROUND 自己处于后台
//         // NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED 告诉发送方自己已经收到请求了（用于通知发送方开始播放提示音）
//         // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_START 通知对方自己开始录制视频了
//         // NETCALL_CONTROL_COMMAND_NOTIFY_RECORD_STOP 通知对方自己结束录制视频了
//     }
// }

// /**
//  * 更新音量状态显示
//  * @param {object} obj 当前在房间的群成员的音量表 eg: {id1:{status:1000}}
//  */
// fn.updateVolumeBar = function (obj) {

//     if (!this.meetingCall.channelName) return;
//     var that = this, meetingCall = that.meetingCall;
//     if (this.meetingCall.volumeStatus) {
//         meetingCall.volumeStatus = obj;
//         return;
//     }

//     meetingCall.volumeStatus = obj;
//     meetingCall.volumeStatusTimer = requestAnimationFrame(refresh)

//     function refresh() {
//         /** 先全部清空 */
//         meetingCall.$box.find('.item .volume-show').css({
//             width: '0%'
//         });

//         var id, val, percent, tmp = meetingCall.volumeStatus, log10;
//         for (var i in tmp) {
//             id = i === 'self' ? that.yx.accid : i;
//             val = tmp[i].status;

//             // WebRTC模式
//             if (that.isRtcSupported) {
//                 percent = val * 100
//             } else {

//                 // webnet模式
//                 log10 = Math.log(val / 65535.0) / Math.LN10;
//                 percent = val === 0 ? 0 : (20.0 * log10) + 96;
//             }


//             meetingCall.$box.find('.item[data-account=' + id + '] .volume-show').css({
//                 width: percent + '%'
//             });
//         }
//         requestAnimationFrame(refresh);
//     }
// }

/** 更新禁言可用状态 */
fn.updateBanStatus = function () {
    var tmp = this.meetingCall;
    tmp.$box.find('.icon-ban').toggleClass('icon-disabled', Object.keys(tmp.joinedMembers || []).length === 0);
}

/**
 * 群呼超时处理
 */
fn.onGroupCallTimeout = function () {
    this.showTip('未接听', 2000);
    this.clearRingPlay();
    this.resetWhenHangup();
    this.hideAllNetcallUI();
}

// /**
//  * 呼叫等待计时器
//  * 60s呼叫倒计时，到点将所有未接入的用户设置为未连接
//  * @param {string} type 倒计时类型
//  *  - beCalling: 被呼叫中
//  *  - calling: 进入房间通话中
//  */
// fn.waitingCallTimer = function (type) {
//     type = type || 'beCalling';
//     var timer = this.meetingCall.waitingTimer, that = this;
//     if (timer) clearTimeout(timer)
//     timer = this.meetingCall.waitingTimer = setTimeout(function () {
//         if (!that.meetingCall.channelName) return;
//         if (type === 'beCalling') {
//             that.reject();
//             that.showTip('群视频呼叫无应答，自动挂断退出', 2000);
//             return;
//         }
//         that.meetingCall.$box && that.meetingCall.$box.find('.item.loading .tip').html('未接通');
//         that.clearRingPlay();

//         /** 如果是主叫，判断房间里是否还是没人加进来，如果是，自动挂断退出 */
//         if (that.meetingCall.caller === that.yx.accid && !that.meetingCall.ready) {
//             that.leaveChannel();
//             that.showTip('未接通', 2000);
//         }
//     }, 45 * 1000);
// }

/** 根据帐号找到对应的节点，播放音视频
 * @param {string} account 唯一id帐号uid
 */
fn.findAccountNode = function (account) {
    // console.log(this);
    console.warn('根据帐号找到对应的节点，account: ', account)
    return this.meetingCall.$box && this.meetingCall.$box.find('.item[data-account="' + account + '"]')[0];
}

/** 画面加载状态变化提示
 * @param {string} uid 唯一id帐号uid
 * @param {string} message 加载状态的消息
 */
fn.nodeLoadingStatus = function (uid, message) {
    this.meetingCall.$box && this.meetingCall.$box.find('.item[data-account="' + uid + '"]').removeClass('loading').find('.tip').html(message || '');
}

/** 摄像头状态切换的节点变化
 * @param {string} uid 唯一id帐号uid
 * @param {string} isEnable 摄像头是否开启
 */
fn.nodeCameraStatus = function (uid, isEnable) {
    isEnable = isEnable || false;
    this.meetingCall.$box && this.meetingCall.$box.find('.item[data-account="' + uid + '"] canvas').toggleClass('hide', !isEnable);
}

/** 发送群视频提示消息 */
fn.sendTeamTip = function (message, isLocal) {
    this.yx.sendTeamNetCallTip({
        teamId: this.yx.crtSessionAccount,
        account: this.yx.accid,
        message: message,
        isLocal: isLocal
    });
}

/** 在线事件 */
fn.online = function (e) {
    console.log('在线');
    // if (!this.meetingCall.channelName) return;

    // this.leaveChannel(this.joinChannel);
    // this.joinChannel();
    this.meetingCall.offlineTimer && clearTimeout(this.meetingCall.offlineTimer);
    console.log(e);
    console.log(this);
}

/** 离线事件, 启动倒计时30s后自动挂断 */
fn.offline = function (e) {
    console.log('离线');
    console.log(e);
    var that = this;
    that.meetingCall.offlineTimer = setTimeout(function () {
        that.showTip('掉线超时，通话结束', 2000);
        that.log("30s超时，可能断网掉线，直接挂断通话");
        // this.beCallTimer = null;
        that.resetWhenHangup();
    }.bind(this), 30 * 1000)
}

/** 创建房间 */
fn.createChannel = function () {
    var that = this;
    this.netcall.channelName = this.yx.crtSession + '-' + Date.now();
    console.warn('创建房间')
    that.log('createChannel')
    var mcall = that.meetingCall;
    mcall.teamId = that.yx.crtSessionAccount
    mcall.teamName = that.yx.cache.getTeamMapById(mcall.teamId);
    mcall.teamName = mcall.teamName && mcall.teamName.constructor === Object ? mcall.teamName.name : "";
    mcall.channelName = this.netcall.channelName;
    mcall.joinedMembers = {};
    console.warn('mcall: ', mcall)
    // 新语法不支持
    // that.getMeetingCallUI([that.yx.accid, ...Object.keys(mcall.members)]);
    var keys = Object.keys(mcall.members);
    keys.unshift(that.yx.accid);
    that.getMeetingCallUI(keys, true);
    return
    // this.netcall.channelName = "a";
    // var client = this.webrtc.getSdkInstance().rtcClient

    // client.join({
    //     channelName: this.netcall.channelName,
    //     joinChannelRecordConfig: {
    //       isHostSpeaker: false,
    //       recordAudio: false,
    //       recordVideo: false,
    //       recordType: false
    //     },
    //     joinChannelLiveConfig: {
    //       liveEnable: false
    //     }
    // }).then(function (obj) {
    //     that.log('createChannel', JSON.stringify(obj))
    //     var mcall = that.meetingCall;
    //     mcall.teamId = that.yx.crtSessionAccount
    //     mcall.teamName = that.yx.cache.getTeamMapById(mcall.teamId);
    //     mcall.teamName = mcall.teamName && mcall.teamName.constructor === Object ? mcall.teamName.name : "";
    //     mcall.channelName = this.netcall.channelName;
    //     mcall.joinedMembers = {};
    //     // 新语法不支持
    //     // that.getMeetingCallUI([that.yx.accid, ...Object.keys(mcall.members)]);
    //     var keys = Object.keys(mcall.members);
    //     keys.unshift(that.yx.accid);
    //     that.getMeetingCallUI(keys);
    // }, function (err) {
    //     that.log('createChannelErr', JSON.stringify(err))
    //     that.resetWhenHangup()
    //     that.sendTeamTip('发起视频通话失败: ' + err.message, true)
    // })
}

/** 主动加入房间
 * 默认参数pushConfig
 * @param {boolean} isReConnect 是否是断网重连
 */
fn.joinChannel = function (isReConnect) {
    var that = this;
    var netcall = that.netcall;
    var type = that.meetingCall.type || that.type;

    // 默认视频宽高
    that.videoCaptureSize = {
        width: 136,
        height: 136
    }
    var userIds = Object.keys(that.meetingCall.members)

    /*that.netcall.joinChannel({
        channelName: netcall.channelName,
        type: type,
        custom: netcall.channelCustom || "",
        sessionConfig: that.sessionConfig
    })*/
    this.setLocalView();
    // 设置超时时间
    netcall.setCallTimeout(1000 * 45);
    // 发起群呼
    netcall.groupCall({
        userIds,
        groupId: this.netcall.channelName,
        type,
        attachment: JSON.stringify({
            groupCall: "testValue"
        })
    }).then(function (obj) {
        that.log('joinChannel', JSON.stringify(obj));
        that.startLocalStreamMeeting()
        that.setVideoViewSize();
        // next
        function next() {
            /** 断网重连不再做其他设置 */
            if (isReConnect) return;

            /** 设置自己在通话中 */
            that.netcall.calling = true;
            that.netcallActive = true;
            that.netcallAccount = that.meetingCall.teamId;

            // /** 启动60s呼叫倒计时 */
            // that.waitingCallTimer('calling');

            // 通话时长显示
            that.startDurationTimer();
            that.meetingCall.isCallingTimer = true;

            /** 显示通话小图标 */
            that.$goNetcall.find(".tip").text("接通中...");

            /** 如果是视频发起者，需要发送呼叫声音，tip和点对点通知 */
            if (that.meetingCall.caller === that.yx.accid) {

                var $addIconItem = $('#addIconItem'),
                    html = "";
                that.$goNetcall.find(".nick").text(that.meetingCall.teamName);
                that.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", that.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", that.type === Netcall.NETCALL_TYPE_VIDEO);

                html = '<span class="icons icon-add"></span>'
                $addIconItem.html(html)
                $addIconItem.removeClass('control-item-hide')

                /** 呼叫声音开启 */
                that.afterPlayRingA = function () {
                    that.playRing("E", 45);
                };
                that.playRing("A", 1, function () {
                    that.afterPlayRingA && that.afterPlayRingA();
                    that.afterPlayRingA = null;
                }.bind(that));

                /** 发送群视频tip */
                that.sendTeamTip('发起了视频聊天', false)
                /** 发给本地 */
                // that.sendTeamTip('发起了视频聊天', true)

                // 新语法不支持
                // var tmplist = [that.yx.accid, ...Object.keys(that.meetingCall.members)];
                var tmplist = Object.keys(that.meetingCall.members);
                tmplist.unshift(that.yx.accid);

                that.meetingCall.list = tmplist;
                
                /** 点对点发起视频通知 */
                // that.yx.sendCustomMessage({
                //     caller: that.yx.accid,
                //     list: tmplist,
                //     teamId: that.yx.crtSessionAccount,
                //     channelName: that.meetingCall.channelName,
                //     type: that.type
                // });

            }
        }
        next();
        return

        // WebRTC模式
        // if (this.isRtcSupported) {
        //     // 设置为互动者
        //     this.netcall.changeRoleToPlayer()
        //     // var promise;
        //     // if (obj.type === WebRTC.NETCALL_TYPE_VIDEO) {
        //     //     promise = this.setDeviceVideoIn(true);
        //     // } else {
        //     //     promise = this.setDeviceVideoIn(false);
        //     // }
        //     // promise.then(function () {
        //     //     return this.setDeviceAudioIn(true);
        //     // }.bind(this)).then(function () {
        //     //     this.startLocalStreamMeeting();
        //     //     this.setVideoViewSize();
        //     //     this.netcall.setCaptureVolume(255);
        //     // }.bind(this)).then(function () {
        //     //     this.log("开始webrtc连接")
        //     //     return this.netcall.startRtc();
        //     // }.bind(this)).then(function () {
        //     //     this.log("webrtc连接成功")
        //     //     next();
        //     //     return this.setDeviceAudioOut(true);
        //     // }.bind(this)).catch(function (e) {
        //     //     console.error(e);
        //     //     this.log("连接出错");
        //     //     if (/webrtc兼容开关/i.test(e)) {
        //     //         minAlert.alert({
        //     //             type: 'error',
        //     //             msg: '无法加入房间!请让呼叫方打开"WebRTC兼容开关"，方可正常通话', //消息主体
        //     //             confirmBtnMsg: '知道了，挂断',
        //     //             cbCancel: this.leaveChannel.bind(this),
        //     //             cbConfirm: this.leaveChannel.bind(this)
        //     //         })
        //     //     }
        //     // }.bind(this))
        //     Promise.resolve().then(function () {
        //         that.log("开始webrtc连接")
        //         return that.netcall.startRtc();
        //     }).then(() => {
        //         if (obj.type === WebRTC.NETCALL_TYPE_VIDEO) {
        //             return that.setDeviceVideoIn(true);
        //         } else {
        //             return that.setDeviceVideoIn(false);
        //         }
        //     }).then(function () {
        //         return that.setDeviceAudioIn(true);
        //     }).then(function () {
        //         that.startLocalStreamMeeting();
        //         that.setVideoViewSize();
        //         that.netcall.setCaptureVolume(255);
        //     }).then(function () {
        //         that.log("webrtc连接成功")
        //         next();
        //         return that.setDeviceAudioOut(true);
        //     }).catch(function (e) {
        //         console.error(e);
        //         that.log("连接出错");
        //         if (/webrtc兼容开关/i.test(e)) {
        //             minAlert.alert({
        //                 type: 'error',
        //                 msg: '无法加入房间!请让呼叫方打开"WebRTC兼容开关"，方可正常通话', //消息主体
        //                 confirmBtnMsg: '知道了，挂断',
        //                 cbCancel: that.leaveChannel.bind(that),
        //                 cbConfirm: that.leaveChannel.bind(that)
        //             })
        //         }
        //     })
        //     return
        // }

        // // webnet模式
        // that.checkDeviceStateUI().then(function () {
        //     if (type === Netcall.NETCALL_TYPE_VIDEO) {
        //         that.startDeviceAudioIn()
        //         that.startDeviceVideo()
        //         that.startLocalStreamMeeting()
        //     } else {
        //         that.startDeviceAudioIn()
        //         that.stopDeviceVideo()
        //     }

        //     that.setCaptureVolume()
        //     that.setPlayVolume()
        //     that.setVideoViewSize()
        //     that.setVideoViewRemoteSize()
        //     next();
        // });

    }.bind(this), function (err) {

        that.resetWhenHangup();
        that.log('joinChannelErr', JSON.stringify(err));

        /** 断网重连失败处理 */
        if (isReConnect) {
            that.showTip('重新加入视频通话失败', 2000);
            return;
        }

        if (err) {
            that.showTip('视频通话错误', 2000);
        }
    })
}

/** 主动离开房间
 * @param {fn} cb 离开房间的回调
 */
fn.leaveChannel = function (cb) {
    var that = this;
    var func;
    if (this.yx.crtSessionType === 'team') {
        func = 'leave';
    } else {
        func = 'hangup';
    }
    that.netcall[func]().then(function (obj) {
        that.log('leaveChannel', JSON.stringify(obj))

        that.clearRingPlay();

        /** 如果自己是发起方并且这时房间里没有一个人，则发送挂断通话的信号, 目前不做了 */
        // if (this.meetingCall.caller === this.yx.accid && Object.keys(this.meetingCall.joinedMembers).length === 0) {
        //     this.yx.sendCustomMessage({
        //         caller: this.yx.accid,
        //         list: [this.yx.accid, ...Object.keys(this.meetingCall.members)],
        //         teamId: this.yx.crtSessionAccount,
        //         channelName: this.meetingCall.channelName,
        //         type: ''
        //     });
        // }

        if (cb && cb.constructor === Function) {
            cb.call(that, true);
        } else {
            that.resetWhenHangup();
        }

    }).catch(function (err) {
        that.resetWhenHangup();
        that.log('leaveChannelErr')
        console.log('leaveChannelErr:', err)
    })
}

/**
 * 有第三方加入房间
 */
fn.onJoinChannel = function (obj) {
    var joinedMembers = this.meetingCall.joinedMembers;
    // if (joinedMembers && joinedMembers[obj.account]) return;
    this.log('加入群视频:', JSON.stringify(obj));

    /** 将加入者加入自己的列表里 */
    joinedMembers = this.meetingCall.joinedMembers = joinedMembers || {}
    /** 将加入者加入自己的列表里 */
    joinedMembers[obj.userID] = 1;
    /** 是否已经有人进来的标志，给倒计时使用 */
    this.meetingCall.ready = true;

    //刷新禁言状态
    this.updateBanStatus();

    this.startDeviceAudioOutChat(obj)

    // // WebRTC模式
    // if (this.isRtcSupported) {
    //     this.startDeviceAudioOutChat()
    //     this.startRemoteStreamMeeting(obj)
    //     return
    // } else {

    // }

    this.startRemoteStreamMeeting(obj)
    //this.setCaptureVolume()
    
    this.setVideoViewSize()
    this.setVideoViewRemoteSize(obj.userId, this.videoCaptureSize)
    this.updateVideoShowSize(true, false);
    //this.setVideoScale();

    /** 停止呼叫音乐 */
    this.clearRingPlay();

    /** 如果已经开始计时, 不再重新计时 */
    if (this.meetingCall.isCallingTimer) return;

}

/** 有第三方离开房间 */
fn.onLeaveChannel = function (userId) {
    // if(this.meetingCall.joinedMembers) {
        console.log(userId);
        this.nodeLoadingStatus(userId, '已挂断');
        //this.stopRemoteStreamMeeting(obj);

        // delete this.meetingCall.joinedMembers[userId];
        //刷新禁言状态
        this.updateBanStatus();
    // }

}

/** 音视频通信状态重置 */
fn.resetWhenHangup = function () {
    /** 放开通道 */
    this.channelId = null;
    this.signalInited = false;
    this.netcall && this.netcall.stopSignal && this.netcall.stopSignal();
    this.isFullScreen = false
    this.videoType = null

    minAlert.close();

    /** 设置自己空闲 */
    this.netcall.calling = false;
    this.calling = false;
    this.beCalling = false;
    this.netcallActive = false;
    this.netcallAccount = "";
    this.isFullScreen = false;

    /** 关闭UI */
    this.meetingCall.$box && this.meetingCall.$box.removeClass('fullscreen').html('');
    this.$chatBox.toggleClass("show-netcall-box", false);
    this.$chatBox.toggleClass("hide-netcall-box", false);
    this.$netcallBox.toggleClass("fullscreen", false);

    // 隐藏右上角悬浮框
    this.$goNetcall.addClass("hide");
    /** 重置文案聊天高度 */
    this.resizeChatContent();
    /** 关闭呼叫响铃 */
    this.clearRingPlay();

    /** 关闭各种计时器 */
    this.meetingCall.waitingTimer && clearTimeout(this.meetingCall.waitingTimer);
    this.meetingCall.volumeStatusTimer && window.cancelAnimationFrame(this.meetingCall.volumeStatusTimer);
    this.clearDurationTimer();

    this.meetingCall = {
        inited: this.meetingCall.inited,
        $box: this.meetingCall.$box
    };

    if (!this.meetingCall.channelName) return;
    // this.stopLocalStreamMeeting()
    // this.stopRemoteStreamMeeting()
    // this.stopDeviceAudioIn()
    // this.stopDeviceAudioOutLocal()
    // this.stopDeviceAudioOutChat()
    // this.stopDeviceVideo()

}

/** 收到群视频呼叫
 * 1. 首先判断呼叫team是否是自己所属team
 * 2. 判断当前是否在视频会话中
 * 3. 判断当前会话窗口是否是呼叫群窗口
 */
fn.onMeetingCalling = function (message) {
    var that = this;
    console.warn('收到群呼叫： ', message);
    this.log('收到群视频呼叫');
    
    //如果自己发给自己，忽略
    if (message.invitor === this.yx.accid) return;
    var obj = message.content = message.content ? JSON.parse(message.content) : '';

    //if (!obj) return;

    /** 在通话中 */
    if (this.netcall.calling || this.beCalling) {
        // this.netcall.control({
        //     command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
        // });
        console.warn('在通话中, 退出')
        return
    };

    //that.beCalling = true;
    console.warn('this.netcall.invitorChannelInfo: ', this.netcall.invitorChannelInfo)
    console.warn('this.netcall.channelInfo: ', this.netcall.channelInfo)
    var channelInfo = this.netcall.invitorChannelInfo || this.netcall.channelInfo || {channelName: 'abcde'}
    var teamId = message.groupId.match(/(\d+)+/)[0]
    console.warn('teamId: ', teamId)
    
    this.meetingCall.caller = message.invitor
    this.meetingCall.channelName = channelInfo.channelName
    this.meetingCall.list = message.userIds
    this.meetingCall.teamId = teamId

    this.netcallAccount = teamId;
    channelInfo.teamId = teamId
    channelInfo.room = channelInfo.channelName
    message.from = message.invitor
    channelInfo.members = message.userIds
    // 默认视频宽高
    that.videoCaptureSize = {
        width: 136,
        height: 136
    }

    setTimeout(function(){
        // 先刷新一下群状态
       //channelInfo.members = that.yx.cache.getTeamMembers(teamId).members;
        that.yx.buildSessions();
        that.yx.getTeamMembers(teamId, checkMember);
    }, 1000)

    //checkMember()
    function checkMember(obj) {
        //that.beCalling = true;
        console.warn('checkMember 测试: ', obj)
        /** 不在所属team中！！！要改 */
        if (!that.yx.cache.getTeamById(obj.teamId)) {
            console.warn('不在所属team中！！！要改')
            //return;
        }

        that.yx.$rightPanel.find(".u-chat-notice").addClass("hide")
        that.yx.$rightPanel.find(".chat-mask").addClass("hide")
        that.onMeetingCallingUI(channelInfo, message);

        that.netcallActive = true;
        var tmp = obj.content;

        that.showBeCallingUI(channelInfo.type, 'team', {
            teamId: channelInfo.teamId,
            caller: message.invitor
        });

        that.updateBeCallingSupportUI(true, true);

        that.playRing("E", 45);
        channelInfo = null
    }
    return;
}

/** 群视频呼叫UI逻辑 */
fn.onMeetingCallingUI = function (obj, message) {

    /** 默认是视频呼叫 */
    obj.type = obj.type || 2;
    if (!obj.type) {
        this.resetWhenHangup();
        this.hideAllNetcallUI();
        return;
    }

    /** 如果正在选择成员的发起窗口，先关闭 */
    if (this.yx.dialog.isOpen) {
        this.yx.dialog.close();
    }

    /** 非呼叫群窗口, 切换到该窗口 */
    if (!this.yx.crtSessionAccount || this.yx.crtSessionType === 'p2p' || this.yx.crtSessionAccount !== obj.teamId) {
        this.yx.openChatBox(obj.teamId, 'team');
    }

    /** 如果在群资料/云记录窗口，先关闭 */
    $('#teamInfoContainer').addClass('hide');
    $('#cloudMsgContainer').addClass('hide');

    /** 发起呼叫窗口 */
    this.meetingCall = $.extend(this.meetingCall, {
        caller: message.from,
        list: obj.members,
        channelName: obj.room,
        type: obj.type,
        teamId: obj.teamId,
        teamName: this.yx.cache.getTeamMapById(obj.teamId).name
    });

    this.type = obj.type;
    this.netcallAccount = this.meetingCall.teamId;

    /** 显示通话小图标 */
    this.$goNetcall.find(".nick").text(this.meetingCall.teamName);
    // this.$goNetcall.find(".tip").text("待接听...");
    // this.$goNetcall.find(".netcall-icon-state").toggleClass("netcall-icon-state-audio", this.type === Netcall.NETCALL_TYPE_AUDIO).toggleClass("netcall-icon-state-video", this.type === Netcall.NETCALL_TYPE_VIDEO);

    this.$chatBox.toggleClass("show-netcall-box", true);
    /** 重置文案聊天高度 */
    this.resizeChatContent();

    //this.onBeCalling(message, 'team');

    // /** 开启被叫倒计时 */
    // this.waitingCallTimer('beCalling');
    console.log(message);
}

/** 群视频离线信息列表 */
fn.offlineMeetingCall = function (messages) {
    messages = messages || [];
    var now = Date.now();
    for (var i = 0; i < messages.length; i++) {
        var item = messages[i];
        if (now - item.time >= 45 * 1000) continue;
        this.onMeetingCalling(item);
    }
}

/** 主动同意通话 */
fn.meetingCallAccept = function () {
    console.log('接受视频群呼叫');
    // this.netcallActive = true;
    if (Object.keys(this.meetingCall).length === 0) {
        this.resetWhenHangup();
        return;
    }
    this.meetingCall.waitingTimer && clearTimeout(this.meetingCall.waitingTimer);
    this.netcall.channelName = this.meetingCall.channelName;
    this.getMeetingCallUI(this.meetingCall.list, false);
    
}

/** 主动拒绝通话
 * @param {string} reject_type 拒绝类型：正忙 / 不想接
 */
fn.meetingCallReject = function (reject_type) {
    this.resetWhenHangup();
    /*this.netcall.control({
        command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
    });*/
    this.netcall.reject()
    this.hideAllNetcallUI();
    console.log('reject');
}

/**
 * 对方同意群视频
 */
fn.onMeetingCallAccepted = function (obj) {
    this.meetingCallAccept()
}

/**
* 对方拒绝群视频
*/
fn.onMeetingCallRejected = function (obj) {
    console.log(obj);
}

/**
 * 对方取消群呼叫
 */
fn.onMeetingCallCancel = function() {
    var that = this;
    // 因为收到呼叫发起ui的地方延迟了1s，所以取消处理UI的时候也延迟1s
    setTimeout(function() {
        that.showTip('对方已取消呼叫', 2000, function() {
            that.resetWhenHangup();
            that.hideAllNetcallUI();
        })
    }, 1001)
}

/************************* 音视频相关操作 ***********************/
/** 打开自己麦克风 */
fn.startDeviceAudioIn = function () {
    var that = this;
    that.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_AUDIO_IN
    }).then(function () {
        // 通知对方自己开启了麦克风
        that.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
        })
    }).catch(function () {
        that.log('启动麦克风失败')
        $(".netcall-box .microphone.control-item").toggleClass("no-device", true).attr("title", "麦克风不可用");
    })
}

/** 关闭自己麦克风 */
fn.stopDeviceAudioIn = function () {
    var that = this;
    that.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN).then(function () {
        // 通知对方自己关闭了麦克风
        that.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
        })
    })
}

/** 打开摄像头
 * 默认设置采集大小是全屏状态下的采集大小
 */
fn.startDeviceVideo = function () {
    var that = this;
    var defaultWidth = 210, defaultHeight = 210;

    this.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_VIDEO,
        width: defaultWidth,
        height: defaultHeight,
        cut: 1
    }).then(function () {
        // 通知对方自己开启了摄像头
        that.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON
        })
    }).catch(function () {
        // 通知对方自己的摄像头不可用
        that.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
        })
        that.log('启动摄像头失败')
        that.nodeLoadingStatus(that.yx.accid, '摄像头不可用');
        that.nodeCameraStatus(that.yx.accid, false);

        /** 图标展示摄像头不可用 */
        var $camera = $(".netcall-box .camera.control-item");
        $camera.toggleClass("no-device", true).attr("title", "摄像头不可用");
        $(".netcall-video-local").toggleClass("empty", true);
        $(".netcall-video-local .message").text("摄像头不可用");
        // that.updateDeviceStatus(Netcall.DEVICE_TYPE_VIDEO, true, false);

    })
}

/** 关闭摄像头 */
fn.stopDeviceVideo = function () {
    var that = this;
    that.netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO).then(function () {
        // 通知对方自己关闭了摄像头
        that.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_OFF
        })
        that.nodeLoadingStatus(that.yx.accid, '摄像头已关闭');
        that.nodeCameraStatus(that.yx.accid, false);
    })
}

/** 开启自己本地音视频流 */
fn.startLocalStreamMeeting = function () {
    console.warn('开启自己本地音视频流 accid: ', this.yx.accid)
    var node = this.findAccountNode(this.yx.accid);
    console.error('开启自己本地音视频流: ', node)
    if (this.netcall) {
        //this.netcall.startLocalStream(node)
        console.warn('开启自己本地音视频流 accid: ', this.yx.accid)
        // this.netcall.setupLocalView(node)
        this.nodeLoadingStatus(this.yx.accid)
    }
}

/** 关闭本地视频流 */
fn.stopLocalStreamMeeting = function () {
    if (this.netcall) {
        this.netcall.stopLocalStream()
    }
}

/** 开启远程音视频流 */
fn.startRemoteStreamMeeting = function (obj) {
    if (!obj.account && !obj.uid) {
        console.log('远程流错误，缺少account或者uid：', obj);
    }
    if (!obj.account) {
      obj.account = this.netcall.getAccountWithUid && this.netcall.getAccountWithUid(obj.uid) || '';
    }
    console.warn('开启远程音视频流 account: ', obj.userId)
    obj.node = this.findAccountNode(obj.userId);
    console.warn('开启远程音视频流: ', obj.node)
    if (this.netcall) {
        // this.netcall.setupRemoteView(obj.userId, obj.node)

        this.nodeLoadingStatus(obj.userId)
    }
}

/** 关闭远程视频流 */
fn.stopRemoteStreamMeeting = function (obj) {
    if (this.netcall) {
        //this.netcall.stopRemoteStream(account)
        console.warn('关闭远程视频流: ', obj)
        var client = this.webrtc.getSdkInstance().rtcClient
        console.warn('关闭远程视频流, remoteStreamMap')
        /*Object.values(client.adapterRef.remoteStreamMap).forEach(stream => {
          stream.muteVideo()
        })*/
        var stream =  client.adapterRef.remoteStreamMap[obj.uid]
        if(stream) {
            console.warn('关闭远程视频流 stream')
            stream.muteVideo()
        }
    }
}

/** 设置采集音量大小
 * 默认值255
 */
fn.setCaptureVolume = function () {
    var netcall = this.netcall;
    if (netcall) {
        netcall.setCaptureVolume(this.captureVolume || 255)
    }
}

/** 设置播放音量大小 */
fn.setPlayVolume = function () {
    var netcall = this.netcall;
    if (netcall) {
        netcall.setPlayVolume({ volume: this.playVolume || 255 })
    }
}

/** 设置自己视频大小尺寸
 * @param {object} option
 * @param {string} option.width 宽度
 * @param {string} option.height 高度
 */
fn.setVideoViewSize = function (size) {
    //this.netcall.setVideoViewSize(this.videoCaptureSize)
    // var client = this.netcall.getSdkInstance().rtcClient

    // client.adapterRef.localStream.setLocalRenderMode(size)
}

/** 设置远程视频尺寸大小 */
fn.setVideoViewRemoteSize = function (userId, size) {
    
    //this.netcall.setVideoViewRemoteSize(this.videoCaptureSize)
    var userMap = this.webrtc.userMap
    var uid = 0
    for (let k in userMap) {
        let value = userMap[k];
        if(value == userId) {
            uid = k
            break
        }
    }
    size.cut = true
    console.warn('setVideoViewRemoteSize: ', size)
    console.warn('uid: ', uid)
    var client = this.webrtc.getSdkInstance().rtcClient
    if(!userId){
        Object.values(client.adapterRef.remoteStreamMap).forEach( stream => {
          stream.setRemoteRenderMode(size)
        })
    } else {
        var stream = client.adapterRef.remoteStreamMap[uid]
        if(stream){
            stream.setRemoteRenderMode(size)
        }
    }
}

/** 设置视频裁剪尺寸 */
fn.setVideoScale = function () {
    this.netcall.setVideoScale && this.netcall.setVideoScale({ type: 1 });
}

/** 播放自己的声音 */
fn.startDeviceAudioOutLocal = function () {
    var that = this;
    that.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL
    }).catch(function () {
        that.log('播放自己的声音失败')
    })
}

/** 关闭自己的声音 */
fn.stopDeviceAudioOutLocal = function () {
    this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL)
}

/** 播放远程声音 */
fn.startDeviceAudioOutChat = function (obj) {
    this.log("播放远端流声音 startDeviceAudioOutChat");
    console.warn("播放远程声音: ", obj);

    try {
        // this.netcall.setupRemoteView(obj.userId, null)
    } catch (e) {
        this.log("开启远端流失败");
        console && console.warn && console.warn(e);
    }
}

/** 关闭远程声音 */
fn.stopDeviceAudioOutChat = function () {
    this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT)
}

/** 自己本地设备状态变化的通知
 * @param {string} type 类型：视频 / 音频（默认）
 * @param {boolean} isOn 状态：开（默认） / 关
 * @param {boolean} isEnable 状态：设备可用（默认） / 设备不可用
 */
fn.updateDeviceStatus = function (type, isOn, isEnable) {
    type = type || Netcall.DEVICE_TYPE_AUDIO_IN;
    isOn = isOn;
    isEnable = isEnable;
    var map = {};
    map[Netcall.DEVICE_TYPE_AUDIO_IN] = '麦克风';
    map[Netcall.DEVICE_TYPE_VIDEO] = '摄像头';
    var text = (isEnable ? (isOn ? '' : '已关闭') : '不可用');
    text = text ? map[type] + text : '';
    this.log(text);
    if (type === Netcall.DEVICE_TYPE_VIDEO) {
        this.nodeLoadingStatus(this.yx.accid, text);
        this.nodeCameraStatus(this.yx.accid, isEnable && isOn);
    }
}

// 桌面共享
fn.firefoxDesktopShare = function (e) {
    if (!this.isRtcSupported) return
    var typeText = $(e.target).data('type'), type
    var that = this
    if (this.videoType === typeText && /(screen|window)/.test(typeText)) return

    if (typeText === 'close') {
        this.videoType = typeText
        return this.setDeviceVideoIn(this.deviceVideoInOn).then(function () {
            that.startLocalStreamMeeting()
        })
    }

    if (typeText === 'screen') {
        type = WebRTC.DEVICE_TYPE_DESKTOP_SCREEN
    }

    if (typeText === 'window') {
        type = WebRTC.DEVICE_TYPE_DESKTOP_WINDOW
    }

    return this.netcall.startDevice({
        type: type
    }).then(function () {
        that.videoType = typeText
        console.log('启动成功')
        that.startLocalStreamMeeting()
    }).catch(function (error) {
        console.error('启动失败', error)
    })

}
