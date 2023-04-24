import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    groupType: '',
    groupTypeName: '',
    list: []
  },
  onLoad: function (options) {
    let groupType = options.type
    let groupTypeName = groupType === 'advanced' ? '高级群组' : '讨论组'
    wx.setNavigationBarTitle({
      title: groupTypeName
    })
    let list = this.getCurrentTypeList(groupType)
    this.setData({ groupType, groupTypeName, list })
  },
  /**
   * 切换到聊天
   */
  switchToGroupChat(e) {
    let teamId = e.currentTarget.dataset.teamid || ''
    let session = 'team-' + teamId
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    store.dispatch({
      type: 'Set_Current_Group',
      payload: teamId
    })
    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session)
    wx.navigateTo({
      url: '../../partials/chating/chating?chatTo=' + teamId + '&type=' + this.data.groupType + '&from=list'
    })
  },
  /**
   * 生成群列表
   */
  getCurrentTypeList(groupType) {
    let resultArr = []
    let listObj = this.data.groupList
    for (let teamId in listObj) {
      let card = listObj[teamId]
      // 去除已解散、已被踢、不是当前类型的群
      if (card.type === groupType && card.valid && !card.isCurrentNotIn) {
        resultArr.push({
          teamId,
          name: listObj[teamId].name || teamId,
          createTime: listObj[teamId].createTime,
          updateTime: listObj[teamId].updateTime,
          avatar: listObj[teamId].avatar || app.globalData.PAGE_CONFIG.defaultUserLogo
        })
      }
    }
    return resultArr
  }
}
let mapStateToData = (state) => {
  return {
    groupList: state.groupList
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
