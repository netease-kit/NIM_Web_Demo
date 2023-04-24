import { showToast, calcTimeHeader, generateFingerGuessImageFile, generateBigEmojiImageFile, generateRichTextNode, generateImageNode } from '../../utils/util.js'
import dealGroupMsg from '../../utils/dealGroupMsg.js'
import { voice } from '../../utils/imageBase64.js'
import { connect } from '../../redux/index.js'
import * as iconBase64Map from '../../utils/imageBase64.js'

let app = getApp()
let store = app.store

let pageConfig = {
  data: {
    defaultUserLogo: app.globalData.PAGE_CONFIG.defaultUserLogo,
    chatTo: '',
    voiceIcon: '',// 小喇叭图标base64
    iconBase64Map: {}, //发送栏base64图标集合
    messageArr: [], //[{scene,from,fromNick,flow,to,text,type,time,content,file,geo,displayTimeHeader]}]
    endTime: new Date().getTime(), // 存储上次加载的最后一条消息的时间，后续加载更多使用
    limit: 20, // 每次查询结果
    historyAllDone: false, //是否已经加载完所有历史
    isVideoFullScreen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      iconBase64Map: iconBase64Map,
      chatTo: options.account,
      chatType: options.chatType,
      voiceIcon: voice,
      userLogo: this.data.userInfo.avatar || app.globalData.PAGE_CONFIG.defaultUserLogo
    })
    this.getHistoryMsgs(true)
  },
  /**
   * 下拉刷新钩子
   */
  onPullDownRefresh() {
    if (this.data.historyAllDone) {
      wx.stopPullDownRefresh()
      showToast('text', '别扯了，到底了！')
    } else {
      this.getHistoryMsgs(false)
    }
  },
  /**
   * 获取云端历史记录
   */
  getHistoryMsgs(isScrollToBottom) {
    wx.showLoading({
      title: '加载历史消息中',
    })
    app.globalData.nim.getHistoryMsgs({
      scene: this.data.chatType === 'p2p' ? 'p2p' : 'team',
      to: this.data.chatTo,
      limit: this.data.limit,
      asc: true,// 时间正序排序
      endTime: this.data.endTime,
      done: (err, obj) => {
        this.getHistoryMsgsDone(err, obj)
        if(isScrollToBottom === true) {
          setTimeout(() => {
            this.scrollToBottom()
          }, 200)
        }
      }
    })
  },
  /**
   * 历史消息获取成功回调
   */
  getHistoryMsgsDone(err, obj) {
    if (err) {
      console.log(err)
      showToast('text', '请检查网络后重试')
      return
    }
    // 所有历史消息加载完毕
    if(obj.msgs.length < this.data.limit) {
      this.setData({
        historyAllDone: true
      })
    }
    obj.msgs.map(item => dealGroupMsg.dealMsg(item, null, this.data.userInfo.account))
    this.setData({
      endTime: obj.msgs[0] && obj.msgs[0].time || new Date().getTime()
    })
    this.setData({
      messageArr: [...this.convertRawMessageListToRenderMessageArr(obj.msgs), ...this.data.messageArr]
    })
    // 隐藏loading动画
    wx.hideLoading()
  },
  /**
   * 滚动页面到底部
   */
  scrollToBottom() {
    wx.pageScrollTo({
      scrollTop: 99999999,
      duration: 100
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
   * 播放音频
   */
  playAudio(e) {
    let audio = e.currentTarget.dataset.audio
    const audioContext = wx.createInnerAudioContext()
    if (audio.ext === 'mp3') { // 小程序发送的
      audioContext.src = audio.url
    } else {
      audioContext.src = audio.mp3Url
    }
    audioContext.play()
    audioContext.onPlay(() => {
      showToast('text', '播放中', { duration: audio.dur})
    })
    audioContext.onError((res) => {
      showToast('text', res.errCode)
    })
  },
  /**
  * 全屏播放视频
  */
  requestFullScreenVideo(e) {
    let video = e.currentTarget.dataset.video
    // console.log(video)
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
   * [{flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}]
   * =>
   * [{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
   */
  convertRawMessageListToRenderMessageArr(rawMsgList) {
    let messageArr = []
    rawMsgList.map(rawMsg => {
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
      switch (msgType) {
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
        case 'notification':
          specifiedObject = {
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
        type: msgType,
        text: rawMsg.text || '',
        from: rawMsg.from,
        time: rawMsg.time,
        sendOrReceive,
        displayTimeHeader
      }, specifiedObject))
    })
    return messageArr
  },
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo,
    personList: state.personList
  }
}
let mapDispatchToPage = dispatch => {}
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
