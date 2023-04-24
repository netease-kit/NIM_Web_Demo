import { connect } from '../../redux/index.js'
import { showToast, correctData } from '../../utils/util.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    addType: '', // friend group
    tip: '',
    inputVal: ''
  },
  onLoad: function (options) {
    let addType = options.type
    let addTypeName = addType === 'friend' ? '添加好友' : '搜索高级群'
    let tip = addType === 'friend' ? '请输入好友账号' : '请输入群号搜索'
    wx.setNavigationBarTitle({
      title: addTypeName
    })
    this.setData({ addType, addTypeName, tip })
  },
  /**
   * 点击取消，返回上一层
   */
  cancel() {
    wx.navigateBack()
  },
  textChange(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  clearInput() {
    this.setData({
      inputVal: ''
    })
  },
  /**
   * 搜索
   */
  search(e) {
    wx.showLoading({
      title: '搜索中',
    })
    let val = e.detail.value || this.data.inputVal
    if (!val) {
      showToast('error', '请输入内容')
      return
    }
    if (this.data.addType === 'friend' ) {
      app.globalData.nim.getUser({
        account: val,
        done: this.searchFriendResult
      })
    } else if (this.data.addType === 'group' ) {
      app.globalData.nim.getTeam({
        teamId: val,
        done: this.searchGroupResult
      })
    }
  },
  /**
   * 搜索结果
   */
  searchFriendResult(err, user) {
    wx.hideLoading()
    if (err) {
      console.log(err)
      return
    }
    if (user) {
      if (user.account == this.data.userInfo.account) { //自己
        wx.switchTab({
          url: '../../pages/setting/setting',
        })
      } else { //非自己：可能好友可能陌生人
        let isFriend = false
        let accounts = Object.keys(this.data.friendCard)

        // 是否好友
        accounts.map(account => {
          if (account == user.account && this.data.friendCard[account].isFriend == true) {
            isFriend = true
            return
          }
        })
        if (isFriend) {//好友
          wx.navigateTo({
            url: '../personcard/personcard?account=' + user.account,
          })
        } else {//陌生人
          console.log(this.data.friendCard, user)
          store.dispatch({
            type: 'FriendCard_Update_NonFriendInfoCard',
            payload: user
          })
          wx.navigateTo({
            url: '../strangercard/strangercard?account=' + user.account,
          })
        }
      }
    } else {
      showToast('text', '该好友不存在')
    }
  },
  searchGroupResult(err, group) {
    wx.hideLoading()
    if (err) {
      showToast('error', `群号不存在`)
      console.log(err)
      return
    }
    if (group && group.type === 'advanced') {
      if (this.data.groupList[group.teamId]) {
        if (!this.data.groupList[group.teamId].isCurrentNotIn) {
          if (!this.data.groupMemberList[group.teamId] || !this.data.groupMemberList[group.teamId].allMembers) {
            this.getMemberList(group.teamId)
          }
        }
      } else {
        group.isCurrentNotIn = true
        store.dispatch({
          type: 'Add_Group',
          payload: group
        })
      }
      store.dispatch({
        type: 'Set_Current_Group_And_Members',
        payload: group.teamId
      })
      wx.navigateTo({
        url: '../advancedGroupCard/advancedGroupCard?teamId=' + group.teamId
      })
    } else {
      showToast('text', '群号不存在')
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
  }
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo,
    friendCard: state.friendCard,
    groupList: state.groupList,
    groupMemberList: state.groupMemberList
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)
Page(connectedPageConfig)
