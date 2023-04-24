import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    defaultAvatar: app.globalData.PAGE_CONFIG.defaultUserLogo,
    teamId: ''
  },
  onLoad: function (options) {
    let teamId = options.teamId
    this.setData({ teamId })
  },
  /**
   * 查看/设置群成员
   */
  settingMember(e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../partials/advancedGroupMemberCard/advancedGroupMemberCard?account=' + this.data.currentGroupMembers[index].account + '&teamId=' + this.data.teamId
    })
  }
}
let mapStateToData = (state) => {
  return {
    personList: state.personList,
    currentGroupMembers: state.currentGroupMembers
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
