import { connect } from '../../redux/index.js'
import { generateFingerGuessImageFile, generateBigEmojiImageFile, generateRichTextNode, generateImageNode, calcTimeHeader } from '../../utils/util.js'
import { showToast, deepClone, clickLogoJumpToCard } from '../../utils/util.js'
import * as iconBase64Map from '../../utils/imageBase64.js'

let app = getApp()
let store = app.store
let self = this
let pageConfig = {
  data: {
    defaultUserLogo: app.globalData.PAGE_CONFIG.defaultUserLogo,
    videoContext: null, // 视频操纵对象
    isVideoFullScreen: false, // 视频全屏控制标准
    videoSrc: '', // 视频源
    recorderManager: null, // 微信录音管理对象
    recordClicked: false, // 判断手指是否触摸录音按钮
    iconBase64Map: {}, //发送栏base64图标集合
    isLongPress: false, // 录音按钮是否正在长按
    chatWrapperMaxHeight: 0,// 聊天界面最大高度
    chatTo: '', //聊天对象account
    chatType: '', //聊天类型 advanced 高级群聊 normal 讨论组群聊 p2p 点对点聊天
    loginAccountLogo: '',  // 登录账户对象头像
    focusFlag: false,//控制输入框失去焦点与否
    emojiFlag: false,//emoji键盘标志位
    moreFlag: false, // 更多功能标志
    tipFlag: false, // tip消息标志
    tipInputValue: '', // tip消息文本框内容
    sendType: 0, //发送消息类型，0 文本 1 语音
    messageArr: [], //[{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
    inputValue: '',//文本框输入内容
    from: ''
  },
  onUnload() {
    // 更新当前会话对象账户
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let chatWrapperMaxHeight = wx.getSystemInfoSync().windowHeight - 52 - 35
    // 初始化聊天对象
    let self = this
    let tempArr = []
    let chatTo = options.chatTo
    let chatType = options.type || 'p2p'
    let from = options.from || ''
    let loginAccountLogo = this.data.userInfo.avatar || this.data.defaultUserLogo

    // 设置顶部标题
    if (chatTo === this.data.userInfo.account) {
      wx.setNavigationBarTitle({
        title: '我的电脑',
      })
    } else if (chatType === 'advanced' || chatType === 'normal') {
      if (this.data.currentGroup.teamId === chatTo && this.data.currentGroup.isCurrentNotIn) {
        showToast('error', '您已离开该群组')
      }
      let card = this.data.currentGroup || this.data.groupList[chatTo] || {}
      let memberNum = card.memberNum || 0
      let title = card.name || chatTo
      wx.setNavigationBarTitle({
        title: (title.length > 8 ? title.slice(0, 8) + '…' : title) + '（' + memberNum + '）',
      })
      if (!this.data.groupMemberList[chatTo] || !this.data.groupMemberList[chatTo].allMembers) { // 当前群组的成员不全时获取成员列表 并 更新当前成员是否在群聊的标志
        this.getMemberList(chatTo)
      }
    } else { // p2p
      let card = this.data.friendCard[chatTo] || {}
      wx.setNavigationBarTitle({
        title: card.nick || chatTo,
      })
    }
    this.setData({
      chatTo,
      chatType,
      loginAccountLogo,
      iconBase64Map: iconBase64Map,
      chatWrapperMaxHeight,
    })
    // 重新计算所有时间
    self.reCalcAllMessageTime()
    // 滚动到底部
    self.scrollToBottom()
    app.globalData.emitter.on('callRejected', (data) => {
      console.log('对方拒绝了111')
      console.log(data)
    })
  },
  /**
   * 生命周期函数--监听页面展示
   */
  onShow: function () {
    let chatType = this.data.chatType
    if (chatType === 'advanced' || chatType === 'normal') {
      let card = this.data.currentGroup
      let memberNum = card.memberNum || 0
      let title = card.name
      wx.setNavigationBarTitle({
        title: (title.length > 8 ? title.slice(0, 8) + '…' : title) + '（' + memberNum + '）',
      })
    }
  },
  /**
   * 获取群组成员列表
   */
  getMemberList(teamId) {
    app.globalData.nim.getTeamMembers({
      teamId: teamId,
      done: (error, obj) => {
        if (error) {
          console.log(error, '获取群成员失败')
          return
        }
        store.dispatch({
          type: 'Get_Group_Members_And_Set_Current',
          payload: obj
        })
      }
    })
  },
  /**
   * 文本框输入事件
   */
  inputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 键盘单击发送，发送文本
   */
  inputSend(e) {
    this.sendRequest(e.detail.value)
  },
  /**
   * emoji组件回调
   */
  emojiCLick(e) {
    let val = e.detail
    // 单击删除按钮，，删除emoji
    if (val == '[删除]') {
      let lastIndex = this.data.inputValue.lastIndexOf('[')
      if (lastIndex != -1) {
        this.setData({
          inputValue: this.data.inputValue.slice(0, lastIndex)
        })
      }
      return
    }
    if (val[0] == '[') { // emoji
      this.setData({
        inputValue: this.data.inputValue + val
      })
    } else {//大图
      this.sendBigEmoji(val)
    }
  },
  /**
   * emoji点击发送
   */
  emojiSend(e) {
    let val = this.data.inputValue
    this.sendRequest(val)
    this.setData({
      emojiFlag: false
    })
  },
  /**
   * 发送网络请求：发送文本消息(包括emoji)
   */
  sendRequest(text) {
    let self = this
    app.globalData.nim.sendText({
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: this.data.chatTo,
      text,
      done: (err, msg) => {
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        self.setData({
          inputValue: '',
          focusFlag: false
        })
        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 发送大的emoji:实际上是type=3的自定义消息
   * {"type":3,"data":{"catalog":"ajmd","chartlet":"ajmd010"}}
   */
  sendBigEmoji(val) {
    wx.showLoading({
      title: '发送中...',
    })
    let self = this
    let catalog = ''
    if (val[0] === 'a') {
      catalog = 'ajmd'
    } else if (val[0] === 'x') {
      catalog = 'xxy'
    } else if (val[0] === 'l') {
      catalog = 'lt'
    }
    let content = {
      type: 3,
      data: {
        catalog,
        chartlet: val
      }
    }
    app.globalData.nim.sendCustomMsg({
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: self.data.chatTo,
      content: JSON.stringify(content),
      done: function (err, msg) {
        wx.hideLoading()
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        // 隐藏发送栏
        self.setData({
          focusFlag: false,
          emojiFlag: false,
          tipFlag: false,
          moreFlag: false
        })
        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 发送自定义消息-猜拳
   */
  sendFingerGuess() {
    let self = this
    self.setData({
      moreFlag: false
    })
    let content = {
      type: 1,
      data: {
        value: Math.ceil(Math.random() * 3)
      }
    }
    app.globalData.nim.sendCustomMsg({
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: self.data.chatTo,
      content: JSON.stringify(content),
      done: function (err, msg) {
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 点击发送tip按钮
   */
  tipInputConfirm() {
    let self = this
    if (self.data.tipInputValue.length !== 0) {
      app.globalData.nim.sendTipMsg({
        scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
        to: self.data.chatTo,
        tip: self.data.tipInputValue,
        done: function (err, msg) {
          // 判断错误类型，并做相应处理
          if (self.handleErrorAfterSend(err)) {
            return
          }
          // 存储数据到store
          self.saveChatMessageListToStore(msg)

          self.setData({
            tipInputValue: '',
            tipFlag: false
          })

          // 滚动到底部
          self.scrollToBottom()
        }
      })
    } else {
      showToast('text', '请输入内容')
    }
  },
  /**
   * 发送语音消息
   */
  sendAudioMsg(res) {
    wx.showLoading({
      title: '发送中...',
    })
    let tempFilePath = res.tempFilePath
    let self = this
    // console.log(tempFilePath)
    app.globalData.nim.sendFile({
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: self.data.chatTo,
      type: 'audio',
      wxFilePath: tempFilePath,
      done: function (err, msg) {
        wx.hideLoading()
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 发送位置消息
   */
  sendPositionMsg(res) {
    let self = this
    let { address, latitude, longitude } = res
    app.globalData.nim.sendGeo({
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: self.data.chatTo,
      geo: {
        lng: longitude,
        lat: latitude,
        title: address
      },
      done: function (err, msg) {
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 发送视频文件到nos
   */
  sendVideoToNos(res) {
    wx.showLoading({
      title: '发送中...',
    })
    // {duration,errMsg,height,size,tempFilePath,width}
    let self = this
    let tempFilePath = res.tempFilePath
    // 上传文件到nos
    app.globalData.nim.sendFile({
      type: 'video',
      scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: self.data.chatTo,
      wxFilePath: tempFilePath,
      done: function (err, msg) {
        wx.hideLoading()
        // file: {dur, ext,h,md5,name,size,url,w}
        // 判断错误类型，并做相应处理
        if (self.handleErrorAfterSend(err)) {
          return
        }
        // 存储数据到store
        self.saveChatMessageListToStore(msg)

        // 滚动到底部
        self.scrollToBottom()
      }
    })
  },
  /**
   * 发送图片到nos
   */
  sendImageToNOS(res) {
    wx.showLoading({
      title: '发送中...',
    })
    let self = this
    let tempFilePaths = res.tempFilePaths
    for (let i = 0; i < tempFilePaths.length; i++) {
      // 上传文件到nos
      app.globalData.nim.sendFile({
        // app.globalData.nim.previewFile({
        type: 'image',
        scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
        to: self.data.chatTo,
        wxFilePath: tempFilePaths[i],
        done: function (err, msg) {
          wx.hideLoading()
          // 判断错误类型，并做相应处理
          if (self.handleErrorAfterSend(err)) {
            return
          }
          // 存储数据到store
          self.saveChatMessageListToStore(msg)

          // 滚动到底部
          self.scrollToBottom()
        }
      })
    }

  },
  /**
   * 统一发送消息后打回的错误信息
   * 返回true表示有错误，false表示没错误
   */
  handleErrorAfterSend(err) {
    if (err) {
      if (err.code == 7101) {
        showToast('text', '你已被对方拉黑')
      }
      console.log(err)
      return true
    }
    return false
  },
  /**
   * 滚动页面到底部
   */
  scrollToBottom() {
    wx.pageScrollTo({
      scrollTop: 999999,
      duration: 100
    })
  },
  /**
   * 保存数据到store
   */
  saveChatMessageListToStore(rawMsg, handledMsg) {
    store.dispatch({
      type: 'RawMessageList_Add_Msg',
      payload: { msg: rawMsg }
    })
  },
  /**
   * 收起所有输入框
   */
  chatingWrapperClick(e) {
    this.foldInputArea()
  },
  /**
   * 收起键盘
   */
  foldInputArea() {
    this.setData({
      focusFlag: false,
      emojiFlag: false,
      tipFlag: false,
      moreFlag: false
    })
  },
  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {
  },
  /**
   * 全屏播放视频
   */
  requestFullScreenVideo(e) {
    let video = e.currentTarget.dataset.video
    let videoContext = wx.createVideoContext('videoEle')

    this.setData({
      isVideoFullScreen: true,
      videoSrc: video.url,
      videoContext
    })
    videoContext.requestFullScreen()
    videoContext.play()
  },
  /**
   * 视频播放结束钩子
   */
  videoEnded() {
    this.setData({
      isVideoFullScreen: false,
      videoSrc: ''
    })
  },
  /**
   * 播放音频
   */
  playAudio(e) {
    showToast('text', '播放中', {
      duration: 120 * 1000,
      mask: true
    })
    let audio = e.currentTarget.dataset.audio
    const audioContext = wx.createInnerAudioContext()
    if (audio.ext === 'mp3') { // 小程序发送的
      audioContext.src = audio.url
    } else {
      audioContext.src = audio.mp3Url
    }
    audioContext.play()
    audioContext.onPlay(() => {
    })
    audioContext.onEnded(() => {
      wx.hideToast()
    })
    audioContext.onError((res) => {
      showToast('text', res.errCode)
    })
  },
  /**
   * 重新计算时间头
   */
  reCalcAllMessageTime() {
    let tempArr = [...this.data.messageArr]
    if (tempArr.length == 0) return
    // 计算时差
    tempArr.map((msg, index) => {
      if (index === 0) {
        msg['displayTimeHeader'] = calcTimeHeader(msg.time)
      } else {
        let delta = (msg.time - tempArr[index - 1].time) / (120 * 1000)
        if (delta > 1) { // 距离上一条，超过两分钟重新计算头部
          msg['displayTimeHeader'] = calcTimeHeader(msg.time)
        }
      }
    })
    this.setData({
      messageArr: tempArr
    })
  },
  /**
   * 切换发送文本类型
   */
  switchSendType() {
    this.setData({
      sendType: this.data.sendType == 0 ? 1 : 0,
      focusFlag: false,
      emojiFlag: false
    })
  },
  /**
   * 获取焦点
   */
  inputFocus(e) {
    this.setData({
      emojiFlag: false,
      focusFlag: true
    })
  },
  /**
   * 失去焦点
   */
  inputBlur() {
    this.setData({
      focusFlag: false
    })
  },
  /**
   * tip输入
   */
  tipInputChange(e) {
    this.setData({
      tipInputValue: e.detail.value
    })
  },
  /**
   * 组件按钮回调
   */
  tipClickHandler(e) {
    let data = e.detail.data
    if (data === 'confirm') {
      if (this.data.tipInputValue.length === 0) {
        showToast('text', '请输入内容')

      } else {
        this.tipInputConfirm()
        this.setData({
          tipFlag: false
        })
      }
    } else if (data === 'cancel') {
      this.setData({
        tipFlag: false
      })
    }
  },
  /**
   * 切换出emoji键盘
   */
  toggleEmoji() {
    this.setData({
      sendType: 0,
      // focusFlag: this.data.emojiFlag ? true : false,
      emojiFlag: !this.data.emojiFlag,
      moreFlag: false
    })
  },
  /**
   * 切出更多
   */
  toggleMore() {
    this.setData({
      moreFlag: !this.data.moreFlag,
      emojiFlag: false,
      focusFlag: false
    })
  },
  /**
   * 调出tip发送面板
   */
  showTipMessagePanel() {
    this.setData({
      tipFlag: true,
      moreFlag: false
    })
  },
  /**
   * 微信按钮长按，有bug，有时候不触发
   */
  voiceBtnLongTap(e) {
    let self = this
    self.setData({
      isLongPress: true
    })
    wx.getSetting({
      success: (res) => {
        let recordAuth = res.authSetting['scope.record']
        if (recordAuth == false) { //已申请过授权，但是用户拒绝
          wx.openSetting({
            success: function (res) {
              let recordAuth = res.authSetting['scope.record']
              if (recordAuth == true) {
                showToast('success', '授权成功')
              } else {
                showToast('text', '请授权录音')
              }
              self.setData({
                isLongPress: false
              })
            }
          })
        } else if (recordAuth == true) { // 用户已经同意授权
          self.startRecord()
        } else { // 第一次进来，未发起授权
          wx.authorize({
            scope: 'scope.record',
            success: () => {//授权成功
              showToast('success', '授权成功')
            }
          })
        }
      },
      fail: function () {
        showToast('error', '鉴权失败，请重试')
      }
    })
  },
  /**
   * 手动模拟按钮长按，
   */
  longPressStart() {
    let self = this
    self.setData({
      recordClicked: true
    })
    setTimeout(() => {
      if (self.data.recordClicked == true) {
        self.executeRecord()
      }
    }, 350)
  },
  /**
   * 语音按钮长按结束
   */
  longPressEnd() {
    this.setData({
      recordClicked: false
    })
    // 第一次授权，
    if (!this.data.recorderManager) {
      this.setData({
        isLongPress: false
      })
      return
    }
    if (this.data.isLongPress === true) {
      this.setData({
        isLongPress: false
      })
      wx.hideToast()
      this.data.recorderManager.stop()
    }
  },
  /**
   * 执行录音逻辑
   */
  executeRecord() {
    let self = this
    self.setData({
      isLongPress: true
    })
    wx.getSetting({
      success: (res) => {
        let recordAuth = res.authSetting['scope.record']
        if (recordAuth == false) { //已申请过授权，但是用户拒绝
          wx.openSetting({
            success: function (res) {
              let recordAuth = res.authSetting['scope.record']
              if (recordAuth == true) {
                showToast('success', '授权成功')
              } else {
                showToast('text', '请授权录音')
              }
              self.setData({
                isLongPress: false
              })
            }
          })
        } else if (recordAuth == true) { // 用户已经同意授权
          self.startRecord()
        } else { // 第一次进来，未发起授权
          wx.authorize({
            scope: 'scope.record',
            success: () => {//授权成功
              showToast('success', '授权成功')
            }
          })
        }
      },
      fail: function () {
        showToast('error', '鉴权失败，请重试')
      }
    })
  },
  /**
   * 开始录音
   */
  startRecord() {
    let self = this
    showToast('text', '开始录音', { duration: 120000 })
    const recorderManager = self.data.recorderManager || wx.getRecorderManager()
    const options = {
      duration: 120 * 1000,
      format: 'mp3'
    }
    recorderManager.start(options)
    self.setData({
      recorderManager
    })
    recorderManager.onStop((res) => {
      if (res.duration < 2000) {
        showToast('text', '录音时间太短')
      } else {
        self.sendAudioMsg(res)
      }
    })
  },
  /**
   * 选择相册图片
   */
  chooseImageToSend(e) {
    let type = e.currentTarget.dataset.type
    let self = this
    self.setData({
      moreFlag: false
    })
    wx.chooseImage({
      sourceType: ['album'],
      success: function (res) {
        self.sendImageToNOS(res)
      },
    })
  },
  /**
   * 选择拍摄视频或者照片
   */
  chooseImageOrVideo() {
    let self = this
    self.setData({
      moreFlag: false
    })
    wx.showActionSheet({
      itemList: ['照相', '视频'],
      success: function (res) {
        if (res.tapIndex === 0) { // 相片
          wx.chooseImage({
            sourceType: ['camera'],
            success: function (res) {
              self.sendImageToNOS(res)
            },
          })
        } else if (res.tapIndex === 1) { // 视频
          wx.chooseVideo({
            sourceType: ['camera', 'album'],
            success: function (res) {
              if (res.duration > 60) {
                showToast('text', '视频时长超过60s，请重新选择')
                return
              }
              console.log(res);
              // {duration,errMsg,height,size,tempFilePath,width}
              self.sendVideoToNos(res)
            }
          })
        }
      }
    })
  },
  /**
   * 选取位置
   */
  choosePosition() {
    let self = this
    self.setData({
      moreFlag: false
    })
    wx.getSetting({
      success: (res) => {
        let auth = res.authSetting['scope.userLocation']
        if (auth == false) { //已申请过授权，但是用户拒绝
          wx.openSetting({
            success: function (res) {
              if (res.authSetting['scope.userLocation'] == true) {
                showToast('success', '授权成功')
              } else {
                showToast('text', '请授权地理位置')
              }
            }
          })
        } else if (auth == true) { // 用户已经同意授权
          self.callSysMap()
        } else { // 第一次进来，未发起授权
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {//授权成功
              self.callSysMap()
            }
          })
        }
      },
      fail: (res) => {
        showToast('error', '鉴权失败，请重试')
      }
    })
  },
  /**
   * 视频通话
   */
  videoCall() {
    if (app.globalData.waitingUseVideoCall) {
      showToast('text', '请勿频繁操作', {duration: 2000})
      return
    }
    if (this.data.chatType === 'advanced' || this.data.chatType === 'normal') { // 群组
      if (this.data.currentGroup.memberNum.length < 2) {
        showToast('text', '无法发起，人数少于2人')
      } else {
        wx.navigateTo({
          url: `../forwardMultiContact/forwardMultiContact?teamId=${this.data.currentGroup.teamId}`,
        })
      }
    } else { // p2p
      console.log(`正在发起对${this.data.chatTo}的视频通话`)
      wx.navigateTo({
        url: `../videoCall/videoCall?callee=${this.data.chatTo}`,
      })
    }
  },
  /**
   * 调用系统地图界面
   */
  callSysMap() {
    let self = this
    wx.chooseLocation({
      success: function (res) {
        let { address, latitude, longitude } = res
        self.sendPositionMsg(res)
      },
    })
  },
  /**
   * 查看全屏地图
   */
  fullScreenMap(e) {
    let geo = e.currentTarget.dataset.geo
    wx.openLocation({
      latitude: geo.lat,
      longitude: geo.lng,
    })
  },
  /**
   * 切换到个人介绍页
   */
  switchToMyTab() {
    wx.switchTab({
      url: '../../pages/setting/setting',
    })
  },
  /**
   * 切换到对方介绍页
   */
  switchPersonCard(data) {
    if (this.data.chatType === 'p2p') {
      if (this.data.chatTo === this.data.userInfo.account || this.data.chatTo === 'ai-assistant') {
        return
      }
      // 重定向进入account介绍页
      clickLogoJumpToCard(this.data.friendCard, this.data.chatTo, false)
    } else if (this.data.chatType === 'advanced') {
      wx.navigateTo({
        url: '../../partials/advancedGroupMemberCard/advancedGroupMemberCard?account=' + data.target.dataset.account + '&teamId=' + this.data.chatTo
      })
    }   
  },
  /**
   * 查看云端历史消息、查看群信息、查看讨论组信息
   */
  lookMessage() {
    let self = this
    let actionArr = ['清空本地聊天记录', '查看云消息记录']
    let actionFn = [self.sureToClearAllMessage, self.lookAllMessage]
    if (this.data.currentGroup.isCurrentNotIn) {
      actionArr.pop()
    }
    if (self.data.chatType === 'advanced') {
      actionArr.unshift('群信息')
      actionFn.unshift(self.lookAdvancedGroupInfo)
    } else if (self.data.chatType === 'normal') {
      actionArr.unshift('讨论组信息')
      actionFn.unshift(self.lookNormalGroupInfo)
    }
    wx.showActionSheet({
      itemList: actionArr,
      success: (res) => {
        (actionFn[res.tapIndex])()
      }
    })
  },
  /**
   * 查看群信息
   */
  lookAdvancedGroupInfo() {
    store.dispatch({
      type: 'Set_Current_Group_And_Members',
      payload: this.data.chatTo
    })
    wx.navigateTo({
      url: `../advancedGroupCard/advancedGroupCard?teamId=${this.data.chatTo}&from=${this.data.from}`,
    })
  },
  /**
   * 查看讨论组信息
   */
  lookNormalGroupInfo() {
    store.dispatch({
      type: 'Set_Current_Group_And_Members',
      payload: this.data.chatTo
    })
    wx.navigateTo({
      url: `../normalGroupCard/normalGroupCard?teamId=${this.data.chatTo}&from=${this.data.from}`,
    })
  },
  /**
   * 弹框 确认 清除本地记录
   */
  sureToClearAllMessage() {
    let self = this
    wx.showActionSheet({//二次确认
      itemList: ['清空'],
      itemColor: '#f00',
      success: (res) => {
        if (res.tapIndex == 0) {
          self.clearAllMessage()
        }
      }
    })
  },
  /**
   * 查看云消息记录
   */
  lookAllMessage() {
    wx.navigateTo({
      url: `../historyFromCloud/historyFromCloud?account=${this.data.chatTo}&chatType=${this.data.chatType}`,
    })
  },
  /**
   * 清除本地记录
   */
  clearAllMessage() {
      // 刷新本地视图
    this.setData({
      messageArr: []
    })
    store.dispatch({
      type: 'Delete_All_MessageByAccount',
      payload: (this.data.chatType === 'p2p' ? 'p2p-' : 'team-') + this.data.chatTo
    })
  },
  /**
   * 展示编辑菜单
   */
  showEditorMenu(e) {
    let message = e.currentTarget.dataset.message
    if (message.type === 'tip') {
      return
    }
    let paraObj = {
      time: message.time,
      chatTo: this.data.chatTo,
      chatType: this.data.chatType
    }
    let self = this
    if (message.sendOrReceive === 'send') { // 自己消息
      wx.showActionSheet({
        itemList: ['删除', '转发', '撤回'],
        success: function (res) {
          switch (res.tapIndex) {
            case 0:
              self.deleteMessageRecord(message)
              break
            case 1:
              self.forwardMessage(paraObj)
              break
            case 2:
              wx.showActionSheet({
                itemList: ['确定'],
                itemColor: '#ff0000',
                success: function (res) {
                  if (res.tapIndex === 0) {
                    self.recallMessage(message)
                  }
                }
              })
              break
            default:
              break
          }
        }
      })
    } else {// 对方消息
      wx.showActionSheet({
        itemList: ['删除', '转发'],
        success: function (res) {
          switch (res.tapIndex) {
            case 0:
              self.deleteMessageRecord(message)
              break
            case 1:
              self.forwardMessage(paraObj)
              break
            default:
              break
          }
        }
      })
    }
  },
  /**
   * 转发消息
   */
  forwardMessage(paramObj) {
    let str = encodeURIComponent(JSON.stringify(paramObj))
    wx.redirectTo({
      url: '../forwardContact/forwardContact?data=' + str,
    })
  },
  /**
   * 撤回消息
   */
  recallMessage(message) {
    let self = this
    let sessionId = (self.data.chatType === 'p2p' ? 'p2p-' : 'team-') + self.data.chatTo
    let rawMessage = self.data.rawMessageList[sessionId][message.time]

    app.globalData.nim.deleteMsg({
      msg: rawMessage,
      done: function (err, { msg }) {
        if (err) { // 撤回失败
          console.log(err)
          showToast('text', '消息已超过2分钟，不能撤回')
          return
        } else {// 撤回成功
          store.dispatch({
            type: 'RawMessageList_Recall_Msg',
            payload: msg
          })
          // 滚动到底部
          self.scrollToBottom()
        }
      }
    })
  },
  /**
   * 删除消息
   * {displayTimeHeader,nodes,sendOrReceive,text,time,type}
   */
  deleteMessageRecord(msg) {
    let sessionId = (this.data.chatType === 'p2p' ? 'p2p-' : 'team-') + this.data.chatTo
    // 从全局记录中删除
    store.dispatch({
      type: 'Delete_Single_MessageByAccount',
      payload: { sessionId: sessionId, time: msg.time }
    })
  },
  /**
   * 距离上一条消息是否超过两分钟
   */
  judgeOverTwoMinute(time, messageArr) {
    let displayTimeHeader = ''
    let lastMessage = messageArr[messageArr.length - 1]
    if (lastMessage) {//拥有上一条消息
      let delta = time - lastMessage.time
      if (delta > 2 * 60 * 1000) {//两分钟以上
        displayTimeHeader = calcTimeHeader(time)
      }
    } else {//没有上一条消息
      displayTimeHeader = calcTimeHeader(time)
    }
    return displayTimeHeader
  },
  /**
   * 原始消息列表转化为适用于渲染的消息列表
   * {unixtime1: {flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}, unixtime2: {}}
   * =>
   * [{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
   */
  convertRawMessageListToRenderMessageArr(rawMsgList) {
    let messageArr = []
    for(let time in rawMsgList) {
      let rawMsg = rawMsgList[time]
      let msgType = ''
      if (rawMsg.type === 'custom' && JSON.parse(rawMsg['content'])['type'] === 1) {
        msgType = '猜拳'
      } else if (rawMsg.type === 'custom' && JSON.parse(rawMsg['content'])['type'] === 3) {
        msgType = '贴图表情'
      } else {
        msgType = rawMsg.type
      }
      let displayTimeHeader = this.judgeOverTwoMinute(rawMsg.time, messageArr)
      let sendOrReceive = rawMsg.flow === 'in' ? 'receive' : 'send'
      let specifiedObject = {}
      switch(msgType) {
        case 'text': {
          specifiedObject = {
            nodes: generateRichTextNode(rawMsg.text)
          }
          break
        }
        case 'image': {
          specifiedObject = {
            nodes: generateImageNode(rawMsg.file)
          }
          break
        }
        case 'geo': {
          specifiedObject = {
            geo: rawMsg.geo
          }
          break
        }
        case 'audio': {
          specifiedObject = {
            audio: rawMsg.file
          }
          break
        }
        case 'video': {
          specifiedObject = {
            video: rawMsg.file
          }
          break
        }
        case '猜拳': {
          let value = JSON.parse(rawMsg['content']).data.value
          specifiedObject = {
            nodes: generateImageNode(generateFingerGuessImageFile(value))
          }
          break
        }
        case '贴图表情': {
          let content = JSON.parse(rawMsg['content'])
          specifiedObject = {
            nodes: generateImageNode(generateBigEmojiImageFile(content))
          }
          break
        }
        case 'tip': {
          specifiedObject = {
            text: rawMsg.tip,
            nodes: [{
              type: 'text',
              text: rawMsg.tip
            }]
          }
          break
        }
        case '白板消息':
        case '阅后即焚': {
          specifiedObject = {
            nodes: [{
              type: 'text',
              text: `[${msgType}],请到手机或电脑客户端查看`
            }]
          }
          break
        }
        case 'file':
        case 'robot': {
          let text = msgType === 'file' ? '文件消息' : '机器人消息'
          specifiedObject = {
            nodes: [{
              type: 'text',
              text: `[${text}],请到手机或电脑客户端查看`
            }]
          }
          break
        }
        case 'custom':
          specifiedObject = {
            nodes: [{
              type: 'text',
              text: '自定义消息'
            }]
          }
          break;
        case 'notification':
          specifiedObject = {
            // netbill的text为空
            text: rawMsg.groupNotification || (rawMsg.text.length == 0 ? '通知' : rawMsg.text),
            nodes: [{
              type: 'text',
              text: rawMsg.groupNotification || (rawMsg.text.length == 0 ? '通知' : rawMsg.text)
            }]
          }
          break;
        default: {
          break
        }
      }
      messageArr.push(Object.assign({}, {
        from: rawMsg.from,
        type: msgType,
        text: rawMsg.text || '',
        time,
        sendOrReceive,
        displayTimeHeader
      }, specifiedObject))
    }
    return messageArr
  },
}

let mapStateToData = (state) => {
  let sessionId = state.currentChatTo
  let messageArr = pageConfig.convertRawMessageListToRenderMessageArr(state.rawMessageList[sessionId])
  return {
    friendCard: state.friendCard,
    personList: state.personList,
    userInfo: state.userInfo,
    currentGroup: state.currentGroup,
    groupList: state.groupList,
    groupMemberList: state.groupMemberList,
    rawMessageList: state.rawMessageList,
    messageArr: messageArr
  }
}
const mapDispatchToPage = (dispatch) => {}
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
