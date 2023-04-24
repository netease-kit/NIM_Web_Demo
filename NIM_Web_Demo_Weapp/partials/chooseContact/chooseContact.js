import IMController from '../../controller/im.js'
import { connect } from '../../redux/index.js'
import { sortStringArray, deepClone, showToast, getFormatFriendList } from '../../utils/util.js'
import { getPinyin } from '../../utils/pinyin.js'
import { iconRightArrow } from '../../utils/imageBase64.js'

let app = getApp()
let store = app.store

let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    groupCard: {},
    groupType: '',
    action: 'create',
    iconRightArrow: '',
    defaultUserLogo: '/images/default-icon.png',
    friendCata: {},//按照类别排好序的数据 {'A': [{account,nick,avatar,status,nickPinyin,isBlack}]}（如有#则在最前）
    cataHeader: [], //首字母列表(如有#则在最后)
    addListMap: {}, // account map
    addList: [], // account array
    addList1to6: [] // addList 的前 6
  },
  /**
   * 检查是否加载成功数据
   */
  onShow() {
    if (Object.keys(this.data.friendCard).length == 0) {
      showToast('text', '你还没有任何好友')
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 渲染本地列表
    let obj = this.showFriendList(this.data.friendCard, options.teamId)
    let teamId = options.teamId || ''
    let groupCard = this.data.groupList[teamId] || {}
    this.setData({
      groupCard,
      groupType: options.type,
      action: options.action,
      teamId: teamId,
      iconRightArrow,
      friendCata: obj.friendCata,
      cataHeader: obj.cataHeader
    })
  },
  showFriendList(friendCard, teamId) {
    let excludeList = []
    if (teamId) {
      this.data.groupMemberList[teamId] && this.data.groupMemberList[teamId].map(item => excludeList.push(item.account))
    }
    return getFormatFriendList(friendCard, app.globalData.PAGE_CONFIG.defaultUserLogo, excludeList)
  },
  /**
   * 单击用户条目
   */
  friendItemClick(e) {
    let addList = this.data.addList
    // if (addList.length >= 50 || addList.length + this.data.groupMemberList[this.data.teamId] >=this.data.groupCard.level) {
    if (addList.length >= 50 || addList.length + (this.data.groupCard && this.data.groupCard.memberNum || 0) >= this.data.groupCard.level) {
      showToast('text', '选择人数已达上限')
      return
    }
    let account = e.currentTarget.dataset.account
    let addListMap = this.data.addListMap
    let friendCard = this.data.friendCard
    this.data.addListMap[account] = !addListMap[account]
    if (this.data.addListMap[account]) {
      addList.push(friendCard[account])
    } else {
      addList = addList.filter(item => item.account !== account)
    }
    let start = addList.length - 6
    let addList1to6 = addList.slice((start < 0 ? 0 : start))
    this.setData({ addListMap, addList, addList1to6 })
  },
  sureChoose () {
    if (this.data.action === 'create') {
      this.createGroup()
    } else if (this.data.action === 'add') {
      this.addPersonToGroup()
    }
  },
  createGroup() {
    let accounts = this.data.addList.map(item => item.account)
    app.globalData.nim.createTeam({
      type: this.data.groupType,
      name: this.data.groupType === 'normal' ? '讨论组' : '高级群',
      accounts: accounts,
      done: this.addGroupMembersDone
    })
  },
  addPersonToGroup () {
    let accounts = this.data.addList.map(item => item.account)
    app.globalData.nim.addTeamMembers({
      teamId: this.data.teamId,
      accounts: accounts,
      done: this.addGroupMembersDone
    })
  },
  addGroupMembersDone(error, obj) {
    if (error) {
      showToast('error', '拉人入群失败')
      console.error(error)
      return
    }
    console.log('拉人入群', obj);
    // owner
    if (this.data.action === 'create') {
      if (obj.accounts.indexOf(obj.owner.account) === -1) {
        obj.accounts.push(obj.owner.account)
      }
      obj.team.isCurrentNotIn = false
      let session = 'team-' + obj.team.teamId
      // 更新会话对象
      store.dispatch({
        type: 'CurrentChatTo_Change',
        payload: session
      })
      // 更新当前群信息
      store.dispatch({
        type: 'Update_Group_And_Set_Current',
        payload: obj.team
      })
      // 告知服务器，标记会话已读
      app.globalData.nim.resetSessionUnread(session)
      wx.redirectTo({
        url: '../chating/chating?chatTo=' + obj.team.teamId + '&type=' + this.data.groupType
      })
    } else {
      wx.navigateBack({ delta: 1 })
      if (this.data.groupType === 'advanced') {
        showToast('text', '已发送邀请')
      }
    }
  }
}

let mapStateToData = (state) => {
  return {
    friendCard: state.friendCard,
    userInfo: state.userInfo,
    onlineList: state.onlineList,
    groupMemberList: state.groupMemberList,
    groupList: state.groupList
  }
}
const mapDispatchToPage = (dispatch) => ({

})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
