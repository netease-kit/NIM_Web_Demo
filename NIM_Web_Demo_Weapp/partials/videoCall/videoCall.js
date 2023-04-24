import { showToast, formatNumber } from '../../utils/util.js'

const app = getApp()
let needRePublish = false
let needRePlay = false
let callingBackToLast = false
Page({
  data: {
    onTheCall: false, //正在通话中标记
    isCalling: false,// 主叫中
    beCalling: false, // 被叫中
    callingPosition: {}, // 呼叫中的位置
    enableCamera: true, // 开启摄像头标记
    muted: false, // 静音标记
    userlist: [], // 所有用户列表
    loginUser: {}, // {uid,account,cid}
    infoOfBeCalled: {}, // 被叫时传递过来的：主叫信息 {caller,cid,type}
    netcallTime: 0, // 通话时长
    duration: '', // 格式化后的时间
    selfPosition: {}, // 自己的位置
    otherPosition: {}, // 对端的位置大小
    callTypeIconKind: 'video', // 当前的通话类型，音频通话为audio，视频通话为video
    // 音视频流重连标记
    streamNeedReconnect: false,
    streamStoped: false
  },
  onLoad: function (options) {
    app.globalData.isPushBeCallPage = false
    console.log(options)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    let pageTitle = ''
    if (options.beCalling) { // 被叫
      pageTitle = options.caller
      this.setData({
        pageTitle: pageTitle,
        beCalling: true,
        infoOfBeCalled: {
          caller: options.caller,
          cid: options.cid,
          type: options.type
        }
      })
    } else { // 主叫
      this.setData({
        isCalling: true,
        pageTitle: pageTitle,
        callingPosition: {
          x: 0,
          y: 0,
          width: app.globalData.videoContainerSize.width,
          height: app.globalData.videoContainerSize.height
        }
      })
      app.globalData.netcall.call({
        type: 2, // 通话类型：1音频，2视频
        callee: options.callee, // 被叫
        forceKeepCalling: false, // 持续呼叫
      })
      .then(obj => {
        console.log(obj, 'call-success')
      }, error => {
        if (error.event.code === 11001) {
          console.log(error, 'call-error 11001')
        } else {
          console.log(error, 'call-error')
        }
      })
      .catch((error) => {
        const duration = 2000
        showToast('text', `呼叫失败，请重试，${duration}ms后返回`, { duration })
        this.hangupHandlerAfter(duration)
      })
      pageTitle = options.callee
      clearTimeout(this.callTimerId)
      this.callTimerId = setTimeout(() => {
        const duration = 2000
        showToast('text', `无人接听，${duration}ms后自动返回`, { duration })
        this.hangupHandlerAfter(duration)
      }, 30 * 1000)
    }
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
    this._initialPosition()
    this.listenNetcallEvent()
  },
  _initialPosition() {
    let containerSize = app.globalData.videoContainerSize // 外部容器大小
    let selfPosition = {
      x: containerSize.width - 100 - 30,
      y: 30,
      width: 100,
      height: 150
    }
    let otherPosition = {
      x: 0,
      y: 0,
      width: containerSize.width,
      height: containerSize.height
    }
    this.setData({
      selfPosition,
      otherPosition
    })
  },
  onUnload() {
    if (this.data.onTheCall || this.data.isCalling) {
      this.hangupHandler(true)
    }
    app.globalData.emitter.eventReset()
  },
  _unBindNetcallEvent() {
    app.globalData.emitter.eventReset()
  },
  _mergeUserList(oldList, newList) {
    console.log('老的数据')
    console.log(oldList)
    console.log('新的数据')
    console.log(newList)
    let resultList = Object.assign([], oldList)
    resultList.map(user => {
      newList.map(newUser => {
        if (newUser.uid == user.uid || newUser.account == user.account) {
          Object.assign(user, newUser)
        }
      })
    })
    console.log('处理后的数据')
    console.log(resultList)
    return resultList
  },
  listenNetcallEvent() {
    let self = this
    app.globalData.emitter.on('syncDone', (data) => {
      console.log('同步完成')
      console.log(data)
      // self._mergeUserList(this.data.userlist, data.userlist)
      let userlist = Object.assign([], data.userlist)
      if (userlist.length == 1) {
        userlist.push({})
        userlist.reverse()
      }
      console.error(userlist)
      if (this.data.userlist.length == 2) {
        this.setData({
          streamNeedReconnect: true,
          userlist: []
        })
        console.error('再次重连媒体流了')
        setTimeout(() => {
          self.setData({
            onTheCall: true, // 正在通话中标记
            userlist: userlist,
          })
        }, 70)
        showToast('text', '媒体流重新建立中，请稍后')
        self.reconnectStreamAfter(100)
        return
      }
      self.setData({
        onTheCall: true, // 正在通话中标记
        userlist: userlist,
        streamNeedReconnect: true
      })
      self.reconnectStreamAfter()
      // 设置通话定时计时器
      self._clearCallTimer()
      if (!self.netcallTimeTimer) {
        self.netcallTimeTimer = setInterval(() => {
          let { hour, minute, second } = self._formateDuration(self.data.netcallTime + 1)
          self.setData({
            netcallTime: self.data.netcallTime + 1,
            duration: `${hour}:${minute}:${second}`
          })
        }, 1000)
      }
    })
    app.globalData.emitter.on('callAccepted', (data) => {
      console.log('对方接听了', data)
      clearTimeout(this.hangupTimer)
      // 开启音视频逻辑
      app.globalData.netcall.startRtc({ mode: 0 })
        .then((data) => {
          console.log(`开启音视频成功`)
          console.log(data)
          self.livePusherContext = wx.createLivePusherContext()
          self.setData({
            loginUser: data,
            isCalling: false,
            streamNeedReconnect: true
          })
        })
    })
    app.globalData.emitter.on('callRejected', (data) => {
      console.log('对方拒绝了')
      console.log(data)
      clearTimeout(this.hangupTimer)
      this.setData({
        onTheCall: false
      })
      const duration = 2000
      showToast('text', `对方拒绝，${duration}ms后返回`, { duration })
      this.hangupHandlerAfter(duration)
    })
    app.globalData.emitter.on('clientLeave', (data) => {
      console.log('有人离开了：')
      console.log(self.data.userlist)
      console.log(data)
    })
    app.globalData.emitter.on('clientJoin', (data) => {
      console.log('有人加入了')
      self._personJoin(data)
      console.log(self.data.userlist)
    })
    app.globalData.emitter.on('beCalling', (data) => {
      console.log('被叫了')
      console.log(data)
      if (this.data.onTheCall || this.data.isCalling || this.data.infoOfBeCalled.cid != data.cid) {
        // 如果通话中，则拒绝
        app.globalData.netcall.response({
          accepted: false,
          caller: data.caller,
          type: data.type,
          cid: data.cid
        })
        return
      }
      this.setData({
        infoOfBeCalled: data
      })
    })
    app.globalData.emitter.on('hangup', (data) => {
      console.log('对端挂断了')
      console.log(data)
      console.log(this.data.loginUser)
      // 接通过程
      if (data.cid != this.data.loginUser.cid && this.data.onTheCall) {
        console.warn('接通过程,非本通通话，抛弃')
        return
      }
      // 被叫过程
      if (this.data.beCalling && this.data.infoOfBeCalled.cid != data.cid) {
        console.warn('被叫过程,非本通通话，抛弃')
        return
      }
      // 主叫过程
      if (this.data.isCalling && data.account != this.data.pageTitle) {
        console.warn('主叫过程,非本通通话，抛弃')
        return
      }
      this._clearCallTimer()

      const duration = 2000
      showToast('text', `对方已经挂断`, { duration })
      this.hangupHandlerAfter(0)
    })
    app.globalData.emitter.on('control', (data) => {
      console.log('control')
      console.log(data)
      this.controlHandler(data)
    })
    // 信令准备重连
    app.globalData.emitter.on('willreconnect', () => {
      this.stopStream()
    })
  },
  // 校验是否需要返回上一层，
  _judgeNavigateBack(delayTime = 0) {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    if (currentPage.route.includes('videoCall') === true) {
      setTimeout(() => {
        wx.navigateBack(1)
      }, delayTime)
    }
  },
  _personJoin(data) {
    let userlist = Object.assign([], this.data.userlist)
    if (userlist.length == 0) {
      userlist.push(data)
      this.setData({
        userlist: userlist
      })
      return
    }
    let uids = userlist.map(user => user.uid) || []
    if (uids.includes(data.uid) === false) {
      // 非自己
      if (this.data.loginUser.uid !== data.uid) {
        Object.assign(userlist[0], data)
      }
      console.error(userlist)
      this.setData({
        userlist: userlist
      })
    }
  },
  /**
   * 返回指定uid组件的拉流操作上下文
   */
  _getPlayerComponent(uid) {
    const yunxinPlayer = this.selectComponent(`#yunxinplayer-${uid}`)
    return yunxinPlayer
  },
  /**
   * 返回推流组件的操作上下文
   */
  _getPusherComponent() {
    const yunxinPusher = this.selectComponent(`#yunxin-pusher`)
    return yunxinPusher
  },
  controlHandler(_data) {
    let self = this
    switch (_data.command) {
      // 主动请求从音频切换到视频
      case app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO:
        console.log('请求从音频切换到视频')
        wx.showModal({
          title: '切换通话模式',
          content: '对方请求从音频切换到音视频',
          confirmText: '允许',
          cancelText: '拒绝',
          success: function (res) {
            let { confirm, cancel } = res
            if (confirm) { // 单击了允许
              self.agreeSwitchAudioToVideo()
            }
            if (cancel) { // 单击了取消
              self.rejectSwitchAudioToVideo()
            }
          }
        })
        break
      // 对方同意从音频切换到视频
      case app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE:
        console.log('对方同意从音频切换到视频')
        // 切换音频到视频
        this.switchToVideoCall()
        break
      // 对方拒绝从音频切换到视频
      case app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT:
        showToast('text', '对方拒绝音频切换到音视频')
        break
      // 从视频切换到音频
      case app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO:
        console.log('从视频切换到音频')
        // 切换视频到音频
        self.switchToVoiceCall()
        break
    }
  },
  // 拒绝 音频 -> 视频
  rejectSwitchAudioToVideo() {
    showToast('text', '拒绝切换到视频模式')
    app.globalData.netcall.control({
      command: app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT
    })
  },
  // 同意 音频 -> 视频
  agreeSwitchAudioToVideo() {
    showToast('text', '切换到视频模式')
    // 发送指令
    app.globalData.netcall.control({
      command: app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE
    })
    this.switchToVideoCall()
  },
  /**
   * 切换至音频通话单击事件
   */
  switchToVoiceCallHandler() {
    if (this.data.callTypeIconKind === 'video') {
      // 当前是视频，准备切换至音频
      app.globalData.netcall.control({
        cid: this.data.loginUser.cid,
        command: app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO
      })
      this.switchToVoiceCall()
    } else {
      // 当前是音频准备切换至音视频
      app.globalData.netcall.control({
        cid: this.data.loginUser.cid,
        command: app.globalData.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO
      })
    }
  },
  switchToVoiceCall() {
    const self = this
    // 切换本地状态
    this.setData({
      enableCamera: false,
      mute: this.data.mute,
      // muted: false, // 主动关闭麦克风的，麦克风还是关闭的
      callTypeIconKind: 'audio'
    })
    app.globalData.netcall.switchMode(app.globalData.netcall.NETCALL_MODE_ONLY_AUDIO)
      .then(() => {
        console.log('切换模式至 -> ', app.globalData.netcall.NETCALL_MODE_ONLY_AUDIO)
        self.stopStream(0).then(() => {
          self.reconnectStreamAfter(100)
        })
      })
      .catch((err) => {
        console.error(err)
      })
  },
  /**
   * 切换至视频通话
   */
  switchToVideoCall() {
    const self = this
    // 切换本地状态
    this.setData({
      enableCamera: true,
      mute: this.data.mute,
      // muted: false, // 主动关闭麦克风的，麦克风还是关闭的
      callTypeIconKind: 'video'
    })
    showToast('text', '切换至视频模式')
    app.globalData.netcall.switchMode(app.globalData.netcall.NETCALL_MODE_AUDIO_VIDEO)
      .then(() => {
        console.log('切换模式至 -> ', app.globalData.netcall.NETCALL_MODE_AUDIO_VIDEO)
        self.stopStream(0).then(() => {
          self.reconnectStreamAfter(100)
        })
      })
      .catch((err) => {
        console.error(err)
      })
  },
  /**
   * 切换摄像头回调
   */
  switchCameraHandler() {
    this.livePusherContext.switchCamera()
  },
  /**
   * 开关摄像头、麦克风回调
   * 0音视频，1纯音频，2纯视频，3静默
   */
  switchMeetingModeHandler(e) {
    let mode = e.currentTarget.dataset.mode
    let enableCamera = this.data.enableCamera
    let muted = this.data.muted
    if (mode == 1) { // 单击了关闭摄像头 => 纯音频
      enableCamera = !enableCamera
      if (enableCamera) { // 摄像头开启 => 关闭摄像头
        if (muted) {
          mode = 2
        } else {
          mode = 0
        }
      } else { // 摄像头关闭 => 开启摄像头
        if (muted) {
          mode = 3
        } else {
          mode = 1
        }
      }

      if (enableCamera) {
        showToast('text', '摄像头已打开')
      } else {
        showToast('text', '摄像头已关闭')
      }
    } else if (mode == 2) { // 单击了关闭麦克风 => 纯视频
      muted = !muted
      if (muted) { // 静音：false => true
        if (enableCamera) {
          mode = 2
        } else {
          mode = 3
        }
      } else { // true => false
        if (enableCamera) {
          mode = 0
        } else {
          mode = 1
        }
      }
      if (muted) {
        showToast('text', '麦克风已关闭')
      } else {
        showToast('text', '麦克风已打开')
      }
    }
    // 切换本地状态
    this.setData({
      enableCamera,
      muted
    })
    if (mode == 1) {
      this.stopStream(0).then(() => {
        this.reconnectStreamAfter(100)
      })
    }
    app.globalData.netcall.switchMode(mode)
      .then(() => {
        console.log('切换模式至 -> ', mode)
      })
      .catch((err) => {
        console.error(err)
      })
  },
  switchAudioInputHandler () {
    let muted = this.data.muted
    this.setData({
      muted: !muted
    })
  },
  switchVideoInputHandler () {
    let enableCamera = this.data.enableCamera
    this.setData({
      enableCamera: !enableCamera
    })
  },
  /**
   * 接听通话
   */
  acceptCallHandler(e) {
    let self = this
    // 显示通信画面
    // this.setDatas
    app.globalData.netcall.response({
      caller: this.data.infoOfBeCalled.caller,
      accepted: true,
      type: this.data.infoOfBeCalled.type,
      cid: this.data.infoOfBeCalled.cid
    })
      .then(() => {
        // 开启音视频逻辑
        console.log('接听。。。')
        app.globalData.netcall.startRtc({ mode: 0 })
          .then((data) => {
            self._clearCallTimer()
            self.setData({
              beCalling: false,
              isCalling: false,
              loginUser: data,
              streamNeedReconnect: true
            })
            self.livePusherContext = wx.createLivePusherContext()
          })
      })
      .catch((error) => {
        console.error(error)
        const duration = 2000
        showToast('text', `接听失败，请重试，${duration}ms后返回`, { duration })
        this.hangupHandlerAfter(0)
      })
  },
  /**
   * 拒绝通话
   */
  rejectCallHandler(e) {
    this._clearCallTimer()
    app.globalData.netcall.response({
      caller: this.data.infoOfBeCalled.caller,
      accepted: false,
      type: this.data.infoOfBeCalled.type,
      cid: this.data.infoOfBeCalled.cid
    })
      .then(() => {
        this._resetData()
        this.hangupHandlerAfter(0)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  /**
   * 挂断通话
   */
  hangupHandler(notBack = false) {
    return Promise.resolve().then(() => {
      if (app.globalData.netcall) {
        console.log('start hangup')
        app.globalData.netcall.hangup()
      }
      return Promise.resolve()
    }).then(() => {
      // 停止推拉流
      this._resetData()
      console.log('通话被挂断。。。')
      this.stopStream(0)
      if (notBack !== true) {
        this._judgeNavigateBack(0)
      }
      this._clearCallTimer()
      this._clearNetcallTimeTimer()
      this._unBindNetcallEvent()
      // 避免频繁操作
      clearTimeout(app.globalData.videoCallTimer)
      app.globalData.videoCallTimer = setTimeout(() => {
        app.globalData.waitingUseVideoCall = false
      }, 2000)
      app.globalData.waitingUseVideoCall = true
    })
  },
  hangupHandlerAfter(duration = 0) {
    clearTimeout(this.hangupTimer)
    this.hangupTimer = setTimeout(() => {
      this.hangupHandler()
    }, duration)
  },
  /**
   * 清除呼叫定时器
   */
  _clearCallTimer() {
    if (this.callTimerId) {
      clearTimeout(this.callTimerId)
      this.callTimerId = null
    }
  },
  /**
   * 清除通话计时定时器
   */
  _clearNetcallTimeTimer() {
    if (this.netcallTimeTimer) {
      clearTimeout(this.netcallTimeTimer)
      this.netcallTimeTimer = null
    }
  },
  onPusherFailed() {
    needRePublish = true
  },
  onPullFailed() {
    needRePlay = true
  },
  _resetData () {
    clearTimeout(this.hangupTimer)
    clearTimeout(this.callTimerId)
    this._resetStreamState()
    this.setData({
      beCalling: false,
      isCalling: false,
      onTheCall: false, // 通话中的标记复位
      userlist: []
    })
  },
  _resetStreamState () {
    clearTimeout(this.stopStreamTimer)
    this.setData({
      streamNeedReconnect: false,
      streamStoped: false
    })
  },
  stopStream (duration = 1000) {
    if (this.stopStreamTimer) {
      clearTimeout(this.stopStreamTimer)
    }
    if (this.data.streamStoped) {
      return Promise.resolve()
    }
    console.log('停止推流')
    return new Promise((resolve, reject) => {
      this.stopStreamTimer = setTimeout(() => {
        if (!this.livePusherContext) {
          return
        }
        if (!this.livePlayerMap) {
          this.livePlayerMap = {}
        }
        this.data.userlist.map(user => {
          const uid = `${user.uid}`
          if (user.uid != this.data.loginUser.uid) {
            console.log(`停止拉流 ${uid}`)
            if (!this.livePlayerMap[uid]) {
              this.livePlayerMap[uid] = wx.createLivePlayerContext(`yunxinplayer-${user.uid}`, this)
            }
            this.livePlayerMap[uid].stop()
          }
        })
        this.livePusherContext.stop({
          complete: () => {
            console.log('推流已停止')
            this.setData({
              streamStoped: true
            })
            resolve()
          }
        })
      }, duration)
    })
  },
  reconnectStream () {
    if (this.data.streamNeedReconnect) {
      clearTimeout(this.stopStreamTimer)
      console.log('开始推流')
      this.livePusherContext.start({
        success: () => {
          this.setData({
            streamStoped: false
          })
        },
        complete: () => {
          if (!this.livePlayerMap) {
            this.livePlayerMap = {}
          }
          this.data.userlist.map(user => {
            const uid = `${user.uid}`
            if (user.uid != this.data.loginUser.uid) {
              console.log(`重新播放 ${uid}`)
              if (!this.livePlayerMap[uid]) {
                this.livePlayerMap[uid] = wx.createLivePlayerContext(`yunxinplayer-${user.uid}`, this)
              }
              console.error(this.livePlayerMap[uid])
              showToast('text', '开始重连拉流')
              this.livePlayerMap[uid].play()
            }
          })
        }
      })
    }
  },
  reconnectStreamAfter (duration = 0) {
    clearTimeout(this.reconnectStreamTimer)
    this.reconnectStreamTimer = setTimeout(() => {
      this.reconnectStream()
    }, duration)
  },
  /**
   * 格式化需要时间
   */
  _formateDuration(time) {
    let hour = parseInt(time / 3600)
    let minute = parseInt((time - hour * 3600) / 60)
    let second = time % 60
    return {
      hour: formatNumber(hour),
      minute: formatNumber(minute),
      second: formatNumber(second)
    }
  },
  cameraOpenErrorHandler(e) {
    console.error(e)
  }
})
