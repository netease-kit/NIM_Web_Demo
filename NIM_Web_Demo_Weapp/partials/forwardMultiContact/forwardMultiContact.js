import { connect } from '../../redux/index.js'
import { getPinyin } from '../../utils/pinyin.js'
import { showToast } from '../../utils/util.js'

let app = getApp()
let store = app.store

const SpecialCharBetweenAccountAndNick = '!@!'

let pageConfig = {
  data: {
    teamId: '', // 群组ID
    chooseList: [], // 用户选择列表 [{nick.account,avatar}]
    memberDetailMap: {}, // {account:{account,nick,avatar...}}
    checkedMap: {}, // {account: checked}
    chatType: 'p2p',
    defaultUserLogo: '/images/default-icon.png',
    friendCata: {},//按照类别排好序的数据 {'a': [{'account':'','nick':'',avatar:'',nickPinyin:'',accountAndNick:''}]}（如有#则在最前）
    cataHeader: [], //首字母列表(如有#则在最后)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data)
    wx.setNavigationBarTitle({
      title: this.data.currentGroup.name,
    })
    let teamId = options.teamId
    this.setData({ teamId })
    this.getGroupMemberDetailList()
  },
  /**
   * 单击进行转发
   */
  radioChange(e) {
    let resultList = e.detail.value
    if (resultList.length > 8) {
      showToast('text', '人数已达到上线,请重选')
      return
    }
    // ["twilbeter0!@!twilbeter0", "twilbeter1!@!twilbeter1"]
    let self = this
    let chooseList = []
    let checkedMap = {}
    resultList.map(accountAndNick => {
      let account = accountAndNick.split(SpecialCharBetweenAccountAndNick)[0]
      let nick = accountAndNick.split(SpecialCharBetweenAccountAndNick)[1]
      chooseList.push({
        account,
        nick,
        avatar: self.data.memberDetailMap[account].avatar
      })
      checkedMap[account] = true
    })
    self.setData({
      checkedMap,
      chooseList
    })
  },
  cancelSelectHandler() {
    this.setData({
      checkedMap: {},
      chooseList: []
    })
  },
  confirmSelecthandler() {
    if (this.data.chooseList.length > 8) {
      showToast('text', '请确保8人以下！')
      return
    }
    store.dispatch({
      type: 'Netcall_Call_UserList',
      payload: this.data.chooseList
    })
    this.data.chooseList.map(user => {
      app.globalData.nim.sendTipMsg({
        scene: 'team',
        to: this.data.currentGroup.teamId,
        tip: `${app.globalData.nim.account}发起了通话`,
        done: function (err, msg) {
          // 判断错误类型，并做相应处理
          if (err) {
            if (err.code == 7101) {
              showToast('text', '你已被对方拉黑')
            }
            console.log(err)
          }
          console.error('已发送消息给：', user.account)
        }
      })
    })
    wx.navigateTo({
      url: '../videoCallMeeting/videoCallMeeting',
    })
  },
  /**
   * 获取群成员详细信息
   */
  getGroupMemberDetailList() {
    let self = this
    let teamId = this.data.currentGroup.teamId
    let groupMemberAccountList = this.data.groupMemberList[teamId].map(member => member.account)
    if (groupMemberAccountList.length >= 150) {
      showToast('text', '暂不支持超过150人群组选择，后续即将开放！', {duration: 3000})
      setTimeout(() => {
        wx.navigateBack(1)
      }, 3000)
      return
    }
    // 删除自己
    groupMemberAccountList = self.deleteSelf(groupMemberAccountList)
    app.globalData.nim.getUsers({
      accounts: groupMemberAccountList,
      done: function (error, users) {
        if (error) {
          console.error(error)
          return
        }
        console.log(users)
        self.calcForwardFriendList(users)
      }
    })
  },
  deleteSelf(accountList) {
    let index = accountList.indexOf(app.globalData.nim.account)
    if (index != -1) {
      accountList.splice(index, 1)
    }
    console.log(accountList)
    return accountList
  },
  /**
   * 计算好友转发列表
   */
  calcForwardFriendList(data) {
    let self = this
    let friendCata = {}
    let cataHeader = []
    let memberDetailMap = {}
    data.map((friendCard) => {
      let nickPinyin = getPinyin(friendCard.nick, '').toUpperCase()
      let card = {
        accountAndNick: `${friendCard.account}${SpecialCharBetweenAccountAndNick}${friendCard.nick}`,
        account: friendCard.account,
        nick: friendCard.nick,
        avatar: friendCard['avatar'] || app.globalData.PAGE_CONFIG.defaultUserLogo,
        nickPinyin
      }
      memberDetailMap[friendCard.account] = card
      if (!nickPinyin[0] || self.testNum(nickPinyin[0]) || !/^[A-Za-z]*$/.test(nickPinyin[0])) { // 数字、空格、非字母
        if (!friendCata['#']) {
          friendCata['#'] = []
        }
        friendCata['#'].push(card)
        if (friendCata['#'].length >= 2) {
          friendCata['#'].sort((a, b) => {
            return a.nickPinyin > b.nickPinyin
          })
        }
      } else {
        if (!friendCata[nickPinyin[0]]) {// 已存在此条目,第一个为字母
          friendCata[nickPinyin[0]] = []
        }
        friendCata[nickPinyin[0]].push(card)
        if (friendCata[nickPinyin[0]].length >= 2) {
          self.sortPinyin(friendCata[nickPinyin[0]])
        }
      }
    })
    cataHeader = [...Object.keys(friendCata)]
    cataHeader.sort()
    if (cataHeader[0] === '#') {// #排到最后
      cataHeader.push(cataHeader.shift(0, 1))
    }
    self.setData({
      memberDetailMap,
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
  }
}

let mapStateToData = (state) => {
  return {
    currentGroup: state.currentGroup,
    groupList: state.groupList,
    groupMemberList: state.groupMemberList,
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
