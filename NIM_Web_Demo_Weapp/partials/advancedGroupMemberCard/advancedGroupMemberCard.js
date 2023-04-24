import { connect } from '../../redux/index.js'
import { showToast } from '../../utils/util.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    defaultAvatar: app.globalData.PAGE_CONFIG.defaultUserLogo,
    isSelf: false,
    limit: '',
    account: '',
    teamId: '',
    card: '',

    editNameFlag: false,
    disableSendMsg: false
  },
  onLoad: function (options) {
    let selfAccount = this.data.userInfo.account
    let isSelf = options.account === selfAccount
    let account = options.account
    let teamId = options.teamId
    let memberMap = this.data.groupMemberMap[teamId] || {}
    let card = memberMap[account] || {}
    let limit = (memberMap[selfAccount] || {}).type === 'manager'
    this.setData({ isSelf, account, teamId, card, limit, disableSendMsg: card.mute })
  },
  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {
  },
  /**
   * 修改名称
   */
  changeName () {
    if (this.data.isSelf) {
      this.setData({
        editNameFlag: true
      })
    }
  },
  /**
   * 确认修改名称
   */
  nameClickHandler (e) {
    let data = e.detail.data
    if (data === 'confirm') {
      if (this.data.newName.length === 0) {
        showToast('text', '请输入内容')
      } else {
        this.sureToChangeName()
      }
    } else if (data === 'cancel') {
      this.setData({
        newName: '',
        editNameFlag: false
      })
    }
  },
  /**
   * 名称输入
   */
  nameInputChange(e) {
    this.setData({
      newName: e.detail.value
    })
  },
  /**
   * 发起修改名称请求
   */
  sureToChangeName () {
    var data = {
      teamId: this.data.teamId,
      nickInTeam: this.data.newName
    }
    data.account = this.data.account
    data.done = (error, team) => {
      if (error) {
        showToast('error', '修改失败')
        return
      }
      this.setData({
        card: Object.assign({}, this.data.card, { nickInTeam: this.data.newName }),
        newName: '',
        editNameFlag: false
      })
    }
    if (this.data.isSelf) {
      app.globalData.nim.updateInfoInTeam(data)
    } else {
      app.globalData.nim.updateTeam(data)
    }
  },

 /**
  * 设置群身份
  */
  changeIdentity() {
    if (!(this.data.currentGroup.owner == this.data.userInfo.account && !this.data.isSelf)) {
      return
    }
    let self = this
    let arr = []
    let card = self.data.card
    if (card.type === 'manager') {
      arr.push('取消管理员')
    } else {
      arr.push('设为管理员')
    }
    let data = {
      teamId: self.data.teamId,
      accounts: [card.account],
      done: (error, obj) => {
        if (error) {
          console.log(error)
          showToast('error', '设置身份失败')
          return
        }
        self.setData({
          card: Object.assign({}, card, { type: card.type === 'manager' ? 'normal' : 'manager' })
        })
      }
    }
    wx.showActionSheet({
      itemList: arr,
      success: function (res) {
        if (res.tapIndex === 0) {
          if (card.type === 'manager') {
            app.globalData.nim.removeTeamManagers(data)
          } else {
            app.globalData.nim.addTeamManagers(data)
          }
        }
      }
    })
  },
  /**
   * 设置禁言
   */
  toggleDisableSendMsg (e) {
    app.globalData.nim.updateMuteStateInTeam({
      teamId: this.data.teamId,
      account: this.data.account,
      mute: e.detail.value,
      done: (error, obj) => {
        if (error) {
          console.log(error)
          showToast('error', '设置禁言失败')
          return
        }
        this.setData({
          disableSendMsg: e.detail.value
        })
      }
    })
  },
  /**
   * 移出本群
   */
   removePerson() {
     wx.showModal({
       title: '确认移出本群',
       content: '',
       showCancel: true,
       cancelText: '取消',
       confirmText: '确定',
       success: (res) => {
         if (res.confirm) { // 用户点击确定
           app.globalData.nim.removeTeamMembers({
            teamId: this.data.teamId,
            accounts: [this.data.account],
            done: (error, obj) => {
              if (error) {
                showToast('error', '解散高级群失败')
                console.log(error)
                return
              }
              wx.navigateBack()
            }
          })
        }
      }
    })
  }
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo,
    isOwner: state.userInfo.account === state.currentGroup.owner,
    currentGroup: state.currentGroup,
    groupMemberMap: state.groupMemberMap
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
