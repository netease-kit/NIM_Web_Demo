import { connect } from '../../redux/index.js'
import { getPinyin } from '../../utils/pinyin.js'
import { deepClone, showToast } from '../../utils/util.js'

let app = getApp()
let store = app.store

const SpecialCharBetweenAccountAndNick = '!@!'

let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    chatTo: '',
    chatType: 'p2p',
    nick: '',
    defaultUserLogo: '/images/default-icon.png',
    friendCata: {},//按照类别排好序的数据 {'a': [{'account':'','nick':'',avatar:'',nickPinyin:'',accountAndNick:''}]}（如有#则在最前）
    cataHeader: [], //首字母列表(如有#则在最后)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let paramString = JSON.parse(decodeURIComponent(options.data))
    this.setData({ paramString })
    this.calcForwardFriendList()
  },
  /**
   * 单击进行转发
   */
  radioChange(e) {
    let self = this
    let accountAndNick = e.detail.value
    let chatTo = accountAndNick.split(SpecialCharBetweenAccountAndNick)[0]
    let nick = accountAndNick.split(SpecialCharBetweenAccountAndNick)[1]
    self.setData({
      chatTo,
      nick
    })
    wx.showModal({
      title: '确认转发？',
      content: `确认转发给${nick}`,
      success: function (res) {
        if (res.confirm) {
          self.sendMsg()
        }
      }
    })
  },
  /**
   * 发送消息
   */
  sendMsg() {
    // 参数是用来取消息的
    let sessionId = (this.data.paramString.chatType === 'p2p' ? 'p2p-' : 'team-') + this.data.paramString.chatTo
    let message = this.data.rawMessageList[sessionId][this.data.paramString.time]
    this.forwardMessage(this.data.chatTo, message)
  },
  /**
   * 调用发送api发送数据
   */
  forwardMessage(account, msg) {
    let self = this
    app.globalData.nim.forwardMsg({
      msg: msg,
      scene: 'p2p',
      to: account,
      done: function (err, msg) {
        if (err) {
          console.log(err)
          return
        }
        showToast('text', '转发成功')
        // 存储到store
        store.dispatch({
          type: 'RawMessageList_Add_Msg',
          payload: { msg }
        })
        // 修改store中聊天对象
        store.dispatch({
          type: 'CurrentChatTo_Change',
          payload: 'p2p-' + account
        })
        // 跳转到新页面
        wx.redirectTo({
          url: `../chating/chating?chatTo=${account}&type=${self.data.chatType}`,
        })
      }
    })
  },
  /**
   * 计算好友转发列表
   */
  calcForwardFriendList() {
    let self = this
    let friendCata = {}
    let cataHeader = []
    for (let account in this.data.friendCard) {
      let friendCard = this.data.friendCard[account]
      let nickPinyin = getPinyin(friendCard.nick, '').toUpperCase()
      if (!nickPinyin[0] || self.testNum(nickPinyin[0]) || !/^[A-Za-z]*$/.test(nickPinyin[0])) { // 数字、空格、非字母
        if (!friendCata['#']) {
          friendCata['#'] = []
        }
        friendCata['#'].push({
          accountAndNick: `${account}${SpecialCharBetweenAccountAndNick}${friendCard.nick}`,
          account,
          nick: friendCard.nick,
          avatar: friendCard['avatar'] || app.globalData.PAGE_CONFIG.defaultUserLogo,
          nickPinyin
        })
        if (friendCata['#'].length >= 2) {
          friendCata['#'].sort((a, b) => {
            return a.nickPinyin > b.nickPinyin
          })
        }
      } else { 
        if (!friendCata[nickPinyin[0]]) {// 已存在此条目,第一个为字母
          friendCata[nickPinyin[0]] = []
        }
        friendCata[nickPinyin[0]].push({
          accountAndNick: `${account}${SpecialCharBetweenAccountAndNick}${friendCard.nick}`,
          account,
          nick: friendCard.nick,
          avatar: friendCard['avatar'] || app.globalData.PAGE_CONFIG.defaultUserLogo,
          nickPinyin
        })
        if (friendCata[nickPinyin[0]].length >= 2) {
          self.sortPinyin(friendCata[nickPinyin[0]])
        }
      }
    }
    cataHeader = [...Object.keys(friendCata)]
    cataHeader.sort()
    if (cataHeader[0] === '#') {// #排到最后
      cataHeader.push(cataHeader.shift(0, 1))
    }
    self.setData({
      friendCata,
      cataHeader
    })
  },
  /**
   * 排序
   */
  sortPinyin(arr) {
    arr.sort((a, b) => {
      return a.nickPinyin.localeCompare(b.nickPinyin)
    })
  },
  /**
   * 检测数字
   */
  testNum(char) {
    return /^[0-9]*$/.test(char)
  },
}

let mapStateToData = (state) => {
  // let messageArr = pageConfig.convertRawMessageListToRenderMessageArr(state.rawMessageList[account])
  return {
    friendCard: state.friendCard,
    rawMessageList: state.rawMessageList,
    // messageArr: messageArr
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
