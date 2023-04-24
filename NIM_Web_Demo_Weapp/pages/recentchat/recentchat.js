import { connect } from '../../redux/index.js'
import { showToast, calcTimeHeader, clickLogoJumpToCard } from '../../utils/util.js'
import { iconNoMessage } from '../../utils/imageBase64.js'
let app = getApp()
let store = app.store

let startX = 0

let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    iconNoMessage: '',
    loginUserAccount: '',
    translateX: 0,
    defaultUserLogo: '',
    chatList: [], // [{account,nick,lastestMsg,type,timestamp,displayTime,message,unread,status}]
    chatAccount: {} // {accountName: accountName} 备注:消息通知key为notification
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 条目题目展示我的电脑
    this.setData({
      iconNoMessage,
      defaultUserLogo: app.globalData.PAGE_CONFIG.defaultUserLogo
    })
  },
  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {
  },
  /**
   * 显示时排序
   */
  onShow() {
    // this.sortChatList()
  },
  /**
   * 排序chatlist
   */
  sortChatList() {
    if (this.data.chatList.length !== 0) {
      let chatList = [...this.data.chatList]
      chatList.sort((a, b) => {
        return parseInt(b.timestamp) - parseInt(a.timestamp)
      })
      this.setData({
        chatList
      })
    }
  },
  /**
   * 传递消息进来，添加至最近会话列表
   * 必须字段 {type, time, from,to}
   */
  addNotificationToChatList(msg) {
    let desc = ''
    let self = this
    switch (msg.type) {
      case 'addFriend': {
        desc = `添加好友-${msg.from}`
        break
      }
      case 'deleteFriend': {
        desc = `删除好友-${msg.from}`
        break
      }
      case 'deleteMsg':
        desc = `${msg.from}撤回了一条消息`
        break
      case 'custom':
        let data = JSON.parse(msg.content)
        let seen = []
        let str = data['content'] || JSON.stringify(data, function (key, val) {
          if (typeof val == "object") {
            if (seen.indexOf(val) >= 0)
              return
            seen.push(val)
          }
          return val
        }) // 可能没有content属性
        desc = `自定义系统通知-${str}`
        break
      default:
        desc = msg.type
        break
    }
    if (!self.data.chatAccount['notification']) { // 没有系统通知
      self.setData({
        chatList: [{
          account: '消息通知',
          timestamp: msg.time,
          displayTime: msg.time ? calcTimeHeader(msg.time) : '',
          lastestMsg: desc,
        }, ...self.data.chatList],
        chatAccount: Object.assign({}, self.data.chatAccount, { notification: 'notification' })
      })
    } else {
      let temp = [...self.data.chatList]
      temp.map((message, index) => {
        if (message.account === '消息通知') {
          temp[index].lastestMsg = desc
          temp[index].timestamp = msg.time
          temp[index].displayTime = msg.time ? calcTimeHeader(msg.time) : ''
          return
        }
      })
      temp.sort((a, b) => {
        return a.timestamp < b.timestamp
      })
      self.setData({
        chatList: temp
      })
    }
  },
  /**
   * 捕获从滑动删除传递来的事件
   */
  catchDeleteNotification(e) {
    store.dispatch({
      type: 'Notification_Clear_All',
    })
  },
  /**
   * 捕获从滑动删除传递来的事件
   */
  catchDeleteTap(e) {
    let session = e.currentTarget.dataset.session
    let chatAccount = Object.assign({}, this.data.chatAccount)
    delete chatAccount[session]
    let chatList = [...this.data.chatList]
    let deleteIndex = 0
    chatList.map((item, index) => {
      if (item.session === session) {
        deleteIndex = index
        return
      }
    })
    chatList.splice(deleteIndex, 1)
    store.dispatch({
      type: 'Delete_All_MessageByAccount',
      payload: session
    })
    this.setData({
      chatList,
      chatAccount
    })
  },
  /**
     * 单击消息通知
     */
  switchToMessageNotification() {
    wx.navigateTo({
      url: '../../partials/messageNotification/messageNotification',
    })
  },
  /**
   * 单击进入聊天页面
   */
  switchToChating(e) {
    let account = e.currentTarget.dataset.account
    let session = e.currentTarget.dataset.session
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    let typeAndAccount = session.split('-')
    var chatType
    if (typeAndAccount[0] === 'team') {
      let card = this.data.groupList[typeAndAccount[1]] || {}
      chatType = card.type || 'team'
      store.dispatch({
        type: 'Set_Current_Group',
        payload: account
      })
    } else {
      chatType = 'p2p'
    }
    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session)
    // 跳转
    wx.navigateTo({
      url: `../../partials/chating/chating?chatTo=${account}&type=${chatType}`,
    })
  },
  /**
   * 单击进入个人区域
   */
  switchToPersonCard(e) {
    let account = e.currentTarget.dataset.account
    if (account === 'ai-assistant') {
      return
    }
    // 重置该人的未读数
    // 重置某个会话的未读数,如果是已经存在的会话记录, 会将此会话未读数置为 0, 并会收到onupdatesession回调,而且此会话在收到消息之后依然会更新未读数
    app.globalData.nim.resetSessionUnread(`p2p-${account}`)
    // 压栈进入account介绍页
    clickLogoJumpToCard(this.data.friendCard, account, true)
  },
  /**
   * 判断消息类型，返回提示
   */
  judgeMessageType(rawMsg) {
    rawMsg = rawMsg || {}
    let msgType = ''
    if (rawMsg.type === 'image') {
      msgType = '[图片]'
    } else if (rawMsg.type === 'geo') {
      msgType = '[位置]'
    } else if (rawMsg.type === 'audio') {
      msgType = '[语音]'
    } else if (rawMsg.type === 'video') {
      msgType = '[视频]'
    } else if (rawMsg.type === 'custom') {
      msgType = rawMsg.pushContent || '[自定义消息]'
    } else if (rawMsg.type === 'tip') {
      msgType = '[提醒消息]'
    } else if (rawMsg.type === 'deleteMsg') {//可能是他人撤回消息
      msgType = '[提醒消息]'
    } else if (rawMsg.type === 'file') {
      msgType = '[文件消息]'
    } else if (rawMsg.type === '白板消息') {
      msgType = '[白板消息]'
    } else if (rawMsg.type === '阅后即焚') {
      msgType = '[阅后即焚]'
    } else if (rawMsg.type === 'robot') {
      msgType = '[机器人消息]'
    } else if (rawMsg.type === 'notification') {
      msgType = '[通知消息]'
    }
    return msgType
  },
  /**
   * 将原生消息转化为最近会话列表渲染数据
   */
  convertRawMessageListToRenderChatList(rawMessageList, friendCard, groupList, unreadInfo) {
    let chatList = []
    let sessions = Object.keys(rawMessageList)
    let index = 0
    sessions.map(session => {
      let account = session.indexOf('team-') === 0 ? session.slice(5, session.length) : session.slice(4, session.length)
      let isP2p = session.indexOf('p2p-') === 0
      let chatType = isP2p ? 'p2p' : (groupList[account] && groupList[account].type)
      let sessionCard = (isP2p ? friendCard[account] : groupList[account]) || {}
      let unixtimeList = Object.keys(rawMessageList[session])
      if (!unixtimeList) {
        return
      }
      let maxTime = Math.max(...unixtimeList)
      if (maxTime) {
        let msg = rawMessageList[session][maxTime + ''] || {}
        let msgType = this.judgeMessageType(msg)
        let lastestMsg = msgType
        let status =  isP2p ?  (sessionCard.status || '离线') : ''
        let nick = isP2p ? (sessionCard.nick || '非好友') : sessionCard.name
        let avatar =  isP2p ? (sessionCard.avatar || app.globalData.PAGE_CONFIG.defaultUserLogo) : (sessionCard.avatar || app.globalData.PAGE_CONFIG.defaultUserLogo)
        chatList.push({
          chatType,
          session,
          account,
          status,
          nick,
          avatar,
          lastestMsg: lastestMsg || msg.text,
          type: msgType || msg.type,
          timestamp: msg.time,
          unread: unreadInfo[session] || 0,
          displayTime: msg.time ? calcTimeHeader(msg.time) : ''
        })
      }
    })
    // 排序
    chatList.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
    return chatList
  },
  /**
   * 计算最近一条发送的通知消息列表
   */
  caculateLastestNotification(notificationList) {
    let temp = Object.assign({}, notificationList)
    let lastestDesc = ''
    let systemMaxIndex = null
    let customMaxIndex = null
    // 从大到小
    let system = notificationList.system.sort((a, b) => {
      return b.msg.time - a.msg.time
    })
    let custom = notificationList.custom.sort((a, b) => {
      return b.msg.time - a.msg.time
    })
    if (system[0]) {
      if (custom[0]) {
        lastestDesc = system[0].msg.time - custom[0].msg.time ? system[0].desc : custom[0].desc
      } else {
        lastestDesc = system[0].desc
      }
    } else {
      if (custom[0]) {
        lastestDesc = custom[0].desc
      }
    }
    return lastestDesc
  }
}
let mapStateToData = (state) => {
  let chatList = pageConfig.convertRawMessageListToRenderChatList(state.rawMessageList, state.friendCard, state.groupList, state.unreadInfo)
  let latestNotification = pageConfig.caculateLastestNotification(state.notificationList)
  return {
    rawMessageList: state.rawMessageList,
    userInfo: state.userInfo,
    friendCard: state.friendCard,
    groupList: state.groupList,
    unreadInfo: state.unreadInfo,
    chatList: chatList,
    latestNotification
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
