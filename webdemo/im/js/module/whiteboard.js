// main.html中引入vue简化UI操作
window.yunXin.WB = new window.Vue({
  el: '#whiteboard',
  template: '#whiteboard-template',
  data: {
    wb: {}, // 白板SDk实例
    audio: yunXin.myNetcall.netcall, // 音视频SDK实例，和yunXin.myNetcall.netcall始终一致
    display: false, // 根据crtSession判断是否应该展示白板界面，具体见checkSession方法
    isCalling: false, // 是否为呼叫方
    isCalled: false, // 是否为被叫
    connected: false, // 接受了请求后连接是否建立成功
    tip: '', // 遮罩提示
    statusTip: '', // 等待对方加入房间时的提示
    bottomTip: '', // 底部提示
    banner: '', // 顶部横幅
    needAgent: false, // 被叫是否需要下载PCAgent
    waiting: false, // 被叫时是否在检测Agent插件
    hasAccepted: false, // 是否接受了邀请
    avatar: '', // 对方头像图片地址
    nick: '', // 对方昵称图片地址
    drawboard: null, // 建立连接成功后创建白板实例
    undoable: false, // 是否能进行撤销操作
    isMicroOpen: false, // 麦克风状态 'unavailable', 'close', 'open'
    canWeUseMicro: false, // 麦克风状态 'unavailable', 'close', 'open'
    account: '', // 对方账号
    beCalledInfo: {}, // 被叫方信息
    session: '', // 白板session信息
    sessionConfig: {
      height: 275,
      width: 275,
      videoQuality: window.WebRTC.CHAT_VIDEO_QUALITY_HIGH,
      videoFrameRate: window.WebRTC.CHAT_VIDEO_FRAME_RATE_15,
      videoBitrate: 0,
      recordVideo: false,
      recordAudio: false,
      highAudio: false,
      bypassRtmp: false,
      rtmpUrl: '',
      rtmpRecord: false,
      splitMode: window.WebRTC.LAYOUT_SPLITLATTICETILE
    }
  },

  methods: {
    // 发起白板邀请
    call: function() {
      // 已经在白板互动或者音视频互动中
      var that = this;
      var NETCALL = window.yunXin.myNetcall;
      if (
        NETCALL.netcallActive ||
        NETCALL.calling ||
        NETCALL.beCalling ||
        this.isCalled ||
        this.isCalling
      ) {
        window.minAlert.alert({
          type: 'error',
          msg:
            this.isCalled || this.isCalling
              ? '正在白板互动中，无法发起新的白板互动'
              : '正在音视频通话中，无法发起白板互动',
          cancelBtnMsg: '知道了'
        });
        return;
      }
      // 选择技术方案，成功后发起邀请
      this.chooseNetcallSolution(
        function(data) {
          console.log('选择方式', data);
          that.session = window.yunXin.crtSession;
          that.account = window.yunXin.crtSessionAccount;
          var user = window.yunXin.cache.getUserById(that.account);
          that.nick = user.nick;
          that.avatar = getAvatar(user.avatar);
          that.isCalling = true;
          that.display = true;

          that.wb
            .call({
              type: window.WhiteBoard.WB_TYPE_TCP,
              netcallType: window.WhiteBoard.CALL_TYPE_AUDIO,
              account: that.account,
              sessionConfig: that.sessionConfig,
              webrtcEnable: data.type === 'webrtc' ? true : data.isWebRTCEnable
            })
            .then(
              function() {
                that.log('对方收到了邀请');
                // 播放连接铃声，复用音视频的API
                NETCALL.playRing('A', 1, function() {
                  NETCALL.playRing('E', 45);
                });
              }
            )
            .catch(
              function(err) {
                that.log('邀请出错' + err);
                if (err.code === 11001) {
                  that.log('对方不在线');
                  that.tip = '对方不在线';
                } else {
                  that.tip = '通信断开';
                }
                setTimeout(
                  function() {
                    if (that.session) that.hangup();
                  },
                  2000
                );
              }
            );

          // 本地发送消息
          var me = window.yunXin.cache.getUserById(window.yunXin.accid);
          var msg = window.yunXin.nim.sendText({
            scene: 'p2p',
            text: me.nick + '发起了[白板互动]',
            to: that.account
          });
          var msgHtml = window.appUI.updateChatContentUI(msg, window.yunXin.cache);
          window.yunXin.$chatContent.append(msgHtml).scrollTop(99999);
          // 45秒超时
          that.timeouter = setTimeout(
            function() {
              if (that.tip) return;
              that.tip = '无应答';
              that.log('超时无应答');
              NETCALL.clearRingPlay();
              NETCALL.playRing('B', 1);
              // 2秒后交互窗口消失
              setTimeout(
                function() {
                  that.hangup();
                },
                1000 * 2
              );
            },
            1000 * 45
          );
        }
      );
    },
    // 收到白板邀请
    onBeCalled: function(info) {
      // 告诉发送方自己已经收到请求了
      this.log('收到邀请');
      this.wb.control({
        channelId: info.channelId,
        command: window.WhiteBoard.CONTROL_COMMAND_START_NOTIFY_RECEIVED
      });
      // 判断当前是否忙
      var NETCALL = window.yunXin.myNetcall;
      if (
        NETCALL.netcallActive ||
        NETCALL.calling ||
        NETCALL.beCalling ||
        this.isCalled ||
        this.isCalling
      ) {
        // 如果是重复收到当前会话的请求，啥都不做
        if (this.wb.isCurrentChannelId(info) && this.isCalled) return;
        // 否则发送正忙的拒绝命令
        this.log('当前忙，拒绝邀请');
        this.wb.control({
          channelId: info.channelId,
          command: window.WhiteBoard.CONTROL_COMMAND_BUSY
        });
        return;
      }
      // 当前不忙，保存邀请者信息
      this.account = info.account;
      this.session = 'p2p-' + info.account;
      this.beCalledInfo = info;
      var inviter = window.yunXin.cache.getUserById(info.account);
      this.nick = window.yunXin.getNick(info.account);
      this.avatar = getAvatar(inviter.avatar);
      // 播放提示铃声，复用音视频的API
      NETCALL.playRing('E', 45);
      // 等待用户操作
      window.yunXin.openChatBox(info.account, 'p2p');
      this.isCalled = true;
      // 45s未接受，超时自动断开
      this.timeouter = setTimeout(
        function() {
          if (this.tip) return;
          this.tip = '未接受';
          this.log('超时未接受');
          // 2秒后交互窗口消失
          setTimeout(
            function() {
              if (this.session) this.hangup();
            }.bind(this),
            1000 * 2
          );
        }.bind(this),
        1000 * 45
      );
    },
    // 接受邀请
    accept: function() {
      var that = this
      if (this.waiting) return;
      // 选择音频技术方案
      var NETCALL = window.yunXin.myNetcall;
      NETCALL.clearRingPlay();
      this.chooseNetcallSolution(
        function(data) {
          if (data.type === 'webrtc') {
            that.audio = NETCALL.netcall = NETCALL.webrtc;
          } else {
            that.audio = NETCALL.netcall = NETCALL.webnet;
          }
          // 选择成功后发送接受邀请的回应给对方
          if (that.session.length === 0) return
          that.wb
            .response({
              accepted: true,
              beCalledInfo: that.beCalledInfo,
              sessionConfig: that.sessionConfig
            })
            .then(
              function() {
                that.log('接受了邀请');
                that.waiting = true;
                that.hasAccepted = true;
              },
              function(err) {
                // 向服务器发送接受回应失败了，按拒绝邀请处理
                that.reject();
                that.log('接受白板邀请失败', err.toString());
              }
            );
        },
        function(data) {
          // 选择音频技术方案出现问题，按拒绝邀请处理
          that.log('选择音频方案出现问题');
          if (data.incompatible) {
            that.reject()
          } else if (data.type === 'webnet') that.needAgent = true;
        },
        true
      );
    },
    // 接受邀请的回调
    onAccept: function(info) {
      var that = this;
      // 如果并没有发起邀请，不做响应
      if (this.session.length === 0) return;
      // 停止播放等待的铃声，复用音视频的API
      if (this.isCalling) this.log('对方接受了邀请');
      console.log(info);
      var NETCALL = window.yunXin.myNetcall;
      this.wb.startSession()
      .then(function() {
        if (that.timeouter) clearTimeout(that.timeouter);
        that.statusTip = '等待对方加入房间，请稍候...'
        that.waiting = true
        that.timeouter = setTimeout(function () {
          if (that.connected) return
          that.tip = '对方加入房间失败';
          setTimeout(function() {
            that.hangup();
          }, 1000 * 2);
        }, 45 * 1000)
      })
      .catch(function(err) {
        that.log('会话开启失败', err)
      });
    },
    // 拒绝邀请
    reject: function() {
      if (this.session.length === 0) return;
      // 接受了请求，但还在等待对方加入房间，此时拒绝应该进行挂断操作
      if (this.hasAccepted) {
        this.hangup()
        return
      } 
      this.wb.response({
        accepted: false,
        beCalledInfo: this.beCalledInfo
      });
      this.log('拒绝了邀请')
      this.sendLocalTip('白板互动已结束');
      this.clearSession();
    },
    // 对方拒绝邀请
    onReject: function(info) {
      // 如果并没有发起邀请，不做响应
      if (!this.isCalling || this.account != info.account) return;
      this.log('对方拒绝邀请');
      // 显示相关文案
      this.tip = '对方已拒绝';
      var NETCALL = window.yunXin.myNetcall;
      NETCALL.clearRingPlay();
      NETCALL.playRing('D', 1);
      this.end();
    },
    // 结束白板互动
    hangup: function() {
      if (this.session.length === 0) return;
      var NETCALL = window.yunXin.myNetcall;
      this.log('我方挂断')
      this.sendLocalTip('白板互动已结束');
      this.wb.hangup();
      this.clearSession();
    },
    // 对方结束白板互动
    onHangup: function(info) {
      if (!this.session) return;
      // 断网挂断
      if (info.type === -1) {
        this.log('和对方通信断开');
        this.tip = '通信断开';
        setTimeout(function () {
          if (this.session.length === 0) return;
          this.hangup()
        }.bind(this), 2000);
        return;
      }
      // 此时可能并没有接受请求，所以不能用channelId判断
      if (this.account != info.account) return;
      this.log('对方挂断');
      window.yunXin.myNetcall.dialog_call.close();
      if (this.connected) this.tip = '对方结束互动';
      else if (this.isCalled) this.tip = '对方已取消';
      else this.tip = '对方已拒绝'
      this.end();
    },
    onJoinChannel: function (info) {
      this.log('对方加入房间')
      if (this.timeouter) clearTimeout(this.timeouter);
      window.yunXin.myNetcall.clearRingPlay();
      this.waiting = false;
      this.banner = '';
      this.connected = true;
      this.startNetcallSession();
    },
    // 对方发来白板指令
    onControl: function(info) {
      // 没和对方在进行互动
      if (this.session.length === 0 || this.account !== info.account) return;

      this.log('收到指令');
      console.log(info);
      var NETCALL = window.yunXin.myNetcall;
      switch (info.type) {
        case window.WhiteBoard.CONTROL_COMMAND_BUSY:
          this.tip = '对方正忙';
          NETCALL.clearRingPlay();
          NETCALL.playRing('C', 1);
          this.end();
          break;
        default:
          break;
      }
    },
    // 其它端已处理
    onCallerAckSync: function(info) {
      // 没有收到请求
      if (!this.isCalled) return;
      this.log('其它端已处理');
      var NETCALL = window.yunXin.myNetcall;
      if (this.beCalledInfo && info.channelId === this.beCalledInfo.channelId) {
        this.tip = '其它端已处理';
        setTimeout(
          function() {
            this.sendLocalTip('白板互动已结束');
            this.clearSession();
          }.bind(this),
          1000 * 2
        );
      }
    },
    // 出错
    onError: function(info) {
      this.log('出错');
      console.log('出错信息 ', info);
      this.tip = '通信断开';
      setTimeout(function () {
        this.hangup();
      }.bind(this), 2000);
    },
    // 信令断开
    onSignalClosed: function(info) {
      this.log('信令断开');
      console.log(info);
      this.tip = '通信断开';
      setTimeout(function () {
        this.hangup();
      }.bind(this), 2000);
    },
    onOffline: function () {
      var that = this;
      if (this.session.length === 0) return;
      that.log('检测到本地网络断开')
      this.offlineTimer = setTimeout(function () {
        that.tip = '通信断开';
        setTimeout(function () {
          that.hangup();
        }, 2000);
      }, 30 * 1000);
    },
    onOnline: function () {
      this.log('连接上网络')      
      if (this.offlineTimer) clearTimeout(this.offlineTimer)
    },
    // 白板互动结束，显示本地消息并清除保存的信息
    // 适用于非主动挂断情况下的善后
    end: function() {
      if (this.session.length === 0) return;
      var NETCALL = window.yunXin.myNetcall;
      setTimeout(
        function() {
          if (this.session.length === 0) return;
          this.sendLocalTip('白板互动已结束');
          this.clearSession();
        }.bind(this),
        1000 * 2
      );
    },
    sendLocalTip: function(tip) {
      var msg = window.yunXin.nim.sendTipMsg({
        scene: 'p2p',
        to: this.account,
        tip: tip,
        isLocal: true
      });
      window.yunXin.cache.addMsgs(msg);
      var msgHtml = window.appUI.updateChatContentUI(msg, window.yunXin.cache);
      window.yunXin.$chatContent.append(msgHtml).scrollTop(99999);
    },
    // 下载PCAgent
    downloadAgent: function() {
      var that = this;
      var NETCALL = window.yunXin.myNetcall;
      // 修改并复用音视频部分，最后加上一个isWhiteboard参数进行区分
      NETCALL.clickDownloadAgent(
        function() {
          if (!that.session) return;
          that.audio = NETCALL.netcall = NETCALL.webnet;
          // 选择成功后发送接受邀请的回应给对方
          that.wb
            .response({
              accepted: true,
              beCalledInfo: that.beCalledInfo,
              sessionConfig: that.sessionConfig
            })
            .then(
              function() {
                that.log('接受了邀请');
                that.waiting = true;
              },
              function(err) {
                // 向服务器发送接受回应失败了，按拒绝邀请处理
                that.reject();
                that.log('接受白板邀请失败', err.toString());
              }
            );
        },
        function() {
          if (!that.session) return;
          that.reject();
        },
        true /* isWhiteboard, 详见netcal_ui.js的fn.clickDownloadAgent */
      );
    },
    // 撤销
    undo: function() {
      this.wb.undo();
    },
    // 清空
    clear: function() {
      this.wb.clear();
    },
    // 清除白板连接相关信息
    clearSession: function() {
      var NETCALL = window.yunXin.myNetcall;
      this.account = this.session = this.tip = this.bottomTip = this.banner = this.statusTip = '';
      this.waiting = this.isCalled = this.isCalling = this.connected = this.display = false;
      this.isMicroOpen = this.canWeUseMicro = this.needAgent = this.hasAccepted = false;
      this.beCalledInfo = {};
      this.switchAudioEvent(false);
      this.audio.hangup();
      this.audio.stopSignal && this.audio.stopSignal();
      this.audio.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN);
      this.audio.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT);
      NETCALL.resetWhenHangup();
      window.yunXin.myNetcall.clearRingPlay();
      if (this.timeouter) clearTimeout(this.timeouter);
      $('.m-goWhiteboard').toggleClass('hide', true);
    },
    /* 音频部分 */
    // onAccept事件触发后开启音视频的会话
    startNetcallSession: function() {
      var that = this;
      var NETCALL = window.yunXin.myNetcall;
      // 初始化音频信令
      this.audio.initSignal().then(function () {
        that.log('初始化信令成功');
        return that.audio.setNetcallSession(that.isCalled ? that.wb.beCalledInfo : that.wb.callerInfo)
      }).then(function () {
        that.log('音频加入白板会话成功');
        // 绑定音频事件
        that.switchAudioEvent(true);
        // 开启播放设备
        that.audio.startDevice({ type: window.WebRTC.DEVICE_TYPE_AUDIO_OUT_CHAT }).then(function () {
          that.log("开启扬声器成功");
        }).catch(function () {
          that.log("开启扬声器失败");
        });
          // WebRTC模式需要连接网关
        if (that.callMethod == 'webrtc') {
          that.log('开始webrtc连接');
          that.audio
            .startRtc()
            .then(function () {
              that.log('webrtc连接成功');
            })
            .catch(function (e) {
              console.error(e);
              that.log('连接出错');
              if (/webrtc服务器地址/.test(e)) {
                that.banner = '对方未打开”WebRTC开关“，请让对方在设置中打开此开关'
              }
            });
          return;
        }
        // webnet模式
        that.log('开始agent连接');
      }).catch(function (e) {
        that.log(e)
      })
    },
    // 开关音频
    switchAudio: function() {
      // 麦不可用的情况下不做处理
      var open = !this.isMicroOpen;
      if (open) {
        this.audio
          .startDevice({
            type: window.Netcall.DEVICE_TYPE_AUDIO_IN
          })
          .then(
            function() {
              this.audio.setCaptureVolume(255);
              this.audio.setPlayVolume(255);
              this.log('启动麦克风成功');
              this.isMicroOpen = true;
              this.bottomTip = '已开启己方语音';
              // 显示2秒底部提示
              setTimeout(
                function() {
                  if (this.bottomTip === '已开启己方语音') this.bottomTip = '';
                }.bind(this),
                2000
              );
              this.audio.control({
                command: window.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
              });
            }.bind(this)
          )
          .catch(
            function(err) {
              if (/webrtc服务器地址/.test(err)) {
                minAlert.alert({
                  type: 'error',
                  msg: '无法接通!请让呼叫方打开"WebRTC兼容开关"，方可正常通话',
                  confirmBtnMsg: '知道了'
                });
              } else if (err === '启动设备失败: NotAllowedError') {
                this.canWeUseMicro = false
              }
              this.log('启动麦克风失败');
              console.log(err);
            }.bind(this)
          );
      } else {
        this.audio.stopDevice(window.Netcall.DEVICE_TYPE_AUDIO_IN).then(
          function() {
            this.log('关闭麦克风成功');
            this.isMicroOpen = false;
            this.bottomTip = '已关闭己方语音';
            setTimeout(
              function() {
                if (this.bottomTip === '已关闭己方语音') this.bottomTip = '';
              }.bind(this),
              2000
            );
            this.audio.control({
              command: window.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
            });
          }.bind(this)
        );
      }
    },
    // 复用音视频的部分，选择白板Demo中的音频技术方案
    chooseNetcallSolution: function(successCallback, failCallback, isCalled) {
      var NETCALL = window.yunXin.myNetcall;
      var that = this;
      NETCALL.dialog_call.open({
        callMethod: this.callMethod,
        isWebRTCEnable: this.isWebRTCEnable || false,
        cbConfirm: function(data) {
          that.callMethod = data.type;
          that.isWebRTCEnable = data.isWebRTCEnable;
          if (data.type === 'webrtc') {
            this.audio = NETCALL.webrtc;
          } else {
            this.audio = NETCALL.webnet;
          }

          if (data.type === 'webnet') {
            // 检查是否满足要求
            var error = '';
            var os = window.platform.os;
            // 测试
            if (os.family.indexOf('Windows') === -1 && (os.version !== '10' || os.version !== '7')) {
              error = '当前系统不支持白板互动功能中的音频功能（PCagent技术方案），请使用win7、win10系统'
            }
            if (
              window.platform.name !== 'Chrome' &&
              window.platform.name !== 'Microsoft Edge' &&
              (window.platform.name !== 'IE' ||
                window.platform.version !== '11.0')
            ) {
              error =
                '当前浏览器不支持白板互动功能中的音频功能（PCagent技术方案），请使用chrome最新版、IE11或者edge浏览器';
            }
            if (error.length > 0) {
              return window.minAlert.alert({
                type: 'error',
                msg: error,
                cancelBtnMsg: that.isCalled ? '拒绝邀请' : '结束邀请',
                cbCancel: function () {
                  data.incompatible = true
                  failCallback && failCallback(data);
                }
              });
            }
            
            // 尝试唤起插件
            NETCALL.checkAgentWorking(
              function() {
                console.log('唤起插件成功');
                // 使用PC agent
                // 发起白板呼叫，音频呼叫
                successCallback(data);
              },
              function() {
                console.log('唤起插件失败');
                failCallback && failCallback(data);
              },
              isCalled,
              isCalled,
              true
            );
            this.waiting = true;
          } else if (data.type === 'webrtc') {

            if (!window.yunXin.myNetcall.checkRtcBrowser()) {
              return window.minAlert.alert({
                type: 'error',
                msg:
                  '当前浏览器不支持WebRTC，无法使用白板互动功能。（白板功能中的音频功能需要WebRTC的支持）请使用最新版Chrome浏览器',
                cancelBtnMsg: that.isCalled ? '拒绝邀请' : '结束邀请',
                cbCancel: function () {
                  data.incompatible = true;
                  failCallback && failCallback(data);
                }
              });
            }
            // 发送白板请求，音视频请求
            successCallback(data);
          }
        }.bind(this),
        yx: window.yunXin,
        env: this,
        isWhiteboard: true
      });
    },
    // 绑定音频事件
    switchAudioEvent: function(add) {
      var that = this;
      var op = add ? 'on' : 'off';
      // 检查microphone可用性
      this.checkDeviceStatus()
      this.audio[op]('deviceStatus', this.onAudioDeviceStatus);
      this.audio[op]('control', this.onAudioControl);
      this.audio[op]('signalClosed', this.onAudioSignalClosed);
      this.audio[op]('rtcConnectFailed', this.onAudioRtcConnectFailed);
      // 音频部分发生意外时按断线处理（也可以提示
      this.audio[op]('error', this.onAudioError);
      this.audio[op]('hangup', this.onAudioHangUp);
      // this.audio[op]('error', function() {});
    },
    checkDeviceStatus: function () {
      var that = this
      this.audio.getDevicesOfType(window.Netcall.DEVICE_TYPE_AUDIO_IN)
      .then(function(info) {
        if (info.devices.length === 0) {
          that.canWeUseMicro = false;
          if (that.isMicroOpen) {
            that.switchAudio()
          }
        } else {
          that.canWeUseMicro = true;
        }
      });
    },
    // 收到音频指令
    onAudioControl: function (info) {
      var that = this
      if (!this.connected) return
      this.log('收到音视频指令');
      console.log(info);
      switch (info.type) {
        case window.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON:
          this.bottomTip = '对方已开启语音';
          setTimeout(function() {
            if (that.bottomTip === '对方已开启语音') {
              that.bottomTip = '';
            }
          }, 2000);
          break;
        case window.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF:
          this.bottomTip = '对方已关闭语音';
          setTimeout(function() {
            if (that.bottomTip === '对方已关闭语音') {
              that.bottomTip = '';
            }
          }, 2000);
          break;
      }
    },
    // 音频设备发生变化
    onAudioDeviceStatus: function (info) {
      this.log('设备状态发生变化')
      if (!this.connected || info.status === 'started' || info.status === 'stoped') return
      this.checkDeviceStatus()
    },
    // 音频信令断开
    onAudioSignalClosed: function () {
      var that = this
      if (!this.connected) return;
      this.log('音频信令断开')
      this.tip = '通信断开'
      setTimeout(function () {
        that.hangup()
      }, 2000)
    },
    onAudioRtcConnectFailed: function () {
      var that = this;
      if (!this.connected) return;
      this.log('音频rtc连接断开');
      this.tip = '通信断开'
      setTimeout(function () {
        that.hangup()
      }, 2000)
    },
    // 音视频挂断
    onAudioHangUp: function (info) {
      // 音视频在未连接上时会hangup，但正常挂断白板音频也会hangup
      // 通过tip进行两种情况的区分
      if (this.tip === '对方结束互动' || info.type === 0) return
      var that = this;
      if (!this.connected) return;
      this.log('音视频挂断')
      console.log(info);
      this.tip = '通信断开'
      setTimeout(function () {
        that.hangup()
      }, 2000)
    },
    onAudioError: function (info) {
      var that = this;
      if (!this.connected) return;
      this.log('音视频出错')
      console.log(info);
      this.tip = '通信断开'
      setTimeout(function () {
        that.hangup()
      }, 2000)
    },
    // 检测是否显示白板UI，这个方法会在base.js的openChatBox函数中被调用
    checkSession: function() {
      this.display =
        this.session.length > 0 && window.yunXin.crtSession === this.session;
    },
    // 日志
    log: function() {
      var message = [].join.call(arguments, ' ');
      console.log('%c【白板】' + message, 'color: green;font-size:16px;');
    }
  },

  mounted: function() {
    this.wb = window.WhiteBoard.getInstance({
      nim: window.nim,
      isCustom: false,
      container: this.$refs.container,
      debug: true
    });
    this.$refs.container.ondragstart =function () { return false };
    // Vue已经把方法绑定好了this
    // 点击互动白板按钮，发起邀请
    document
      .getElementById('showWhiteboard')
      .addEventListener('click', this.call);
    // 收到邀请请求
    this.wb.on('beCalling', this.onBeCalled);
    // 拒绝互动
    this.wb.on('callRejected', this.onReject);
    // 接受邀请
    this.wb.on('callAccepted', this.onAccept);
    // 加入频道
    this.wb.on('joinChannel', this.onJoinChannel);
    // 离开频道 暂不支持多人
    // this.wb.on('leaveChannel', this.leaveChannel)
    // 其他端消息
    this.wb.on('callerAckSync', this.onCallerAckSync);
    // 信令断开
    this.wb.on('signalClosed', this.onSignalClosed);
    // 收到指令
    this.wb.on('control', this.onControl);
    // 挂断
    this.wb.on('hangup', this.onHangup);
    // 收到
    this.wb.on('error', this.onError);
    window.addEventListener('offline', this.onOffline);
    window.addEventListener('online', this.onOnline);
  }
});

// 白板模块外部按钮还是使用Jquery
window.yunXin.WB.$goWhiteboard = $('.m-goWhiteboard');
window.yunXin.WB.$goWhiteboard.click(function() {
  window.yunXin.openChatBox(window.yunXin.WB.account, 'p2p');
});
