import { connect } from '../../redux/index.js'
import { showToast, correctData, formatDate } from '../../utils/util.js'
let app = getApp()
let store = app.store
let attrMap = {
  msgRemind: {
    valueArr: ['0', '2', '1'],
    txtArr: ['提醒所有消息', '只提醒管理员消息', '不提醒任何消息']
  },
  joinMode: {
    valueArr: ['noVerify', 'needVerify', 'rejectAll'],
    txtArr: ['允许任何人', '需要验证', '拒绝任何人']
  },
  inviteMode: {
    valueArr: ['manager', 'all'],
    txtArr: ['管理员邀请', '所有人邀请']
  },
  updateTeamMode: {
    valueArr: ['manager', 'all'],
    txtArr: ['管理员修改', '所有人修改']
  },
  beInviteMode: {
    valueArr: ['needVerify', 'noVerify'],
    txtArr: ['需要验证', '不需要验证']
  }
}
let pageConfig = {
  data: {
    defaultAvatar: app.globalData.PAGE_CONFIG.defaultUserLogo,
    teamId: '',
    createTime: '',
    deleteThe: false,
    editFlag: false,
    newChangeValue: '',
    changeBoxTitle: '',
    changeBoxType: {},
    msgRemind: false,
    msgRemindTxt: '',
    from: ''
  },
  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let teamId = options.teamId
    let from = options.from || ''
    let currentGroup = this.data.currentGroup
    let createTime = currentGroup.createTime ? formatDate(new Date(currentGroup.createTime)) : formatDate(new Date())
    wx.setNavigationBarTitle({
      title: currentGroup && currentGroup.name || '高级群'
    })
    this.setData({
      teamId,
      createTime,
      from
    })
    this.getUsersAvatar()
  },
  onShow: function () {
    let teamId = this.data.teamId
    let currentAccountCard = this.data.groupMemberMap[teamId] && this.data.groupMemberMap[teamId][this.data.userInfo.account] || {}
    let muteNotiType = currentAccountCard.muteNotiType
    this.setData({
      msgRemind: muteNotiType || '0',
      msgRemindTxt: pageConfig.getAttrText('msgRemind', muteNotiType || '0')
    })
  },
  /**
   * 获取用户头像，一次最多150个
   */
  getUsersAvatar (currentGroupMembers, personList) {
    currentGroupMembers = currentGroupMembers || this.data.currentGroupMembers
    personList = personList || this.data.personList
    let list = []
    currentGroupMembers.map(item => {
      if (!personList[item.account] || !personList[item.account].avatar) {
        list.push(item.account)
      }
    })
    while (list.length) {
      let arr = list.splice(0, 150)
      app.globalData.nim.getUsers({
        accounts: arr,
        done: (error, users) => {
          if (error) {
            showToast('error', '获取成员资料失败')
          }
          store.dispatch({
            type: 'Add_Person',
            payload: users
          })
        }
      })
    }
  },
  /**
   * 获取群组成员列表
   */
  getMemberList(teamId, currentGroupMembers, personList) {
    if (!teamId) {
      return
    }
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
        this.getUsersAvatar(currentGroupMembers, personList)
      }
    })
  },
  /**
   * 检查当前用户是否是 管理员
   */
  checkIsManager (listMap, teamId, account) {
    let listObj = listMap[teamId] || {}
    if (listObj[account] && listObj[account].type === 'manager') {
      return true
    }
    return false
  },
  getSelfUserCard(listMap, teamId, account) {
    let listObj = listMap[teamId] || {}
    return listObj[account] || {}
  },
  /**
   * 添加按钮
   */
  addPerson () {
    wx.navigateTo({
      url: '../../partials/chooseContact/chooseContact?type=advanced&action=add&teamId=' + this.data.teamId + '&limit=' + (this.data.isManager || this.data.isOwner || this.data.inviteMode === 'all')
    })
  },
  /**
   * 打开修改弹框
   */
  openChangeBox (e) {
    let attr = e.currentTarget.dataset.attr
    let attTxtrArr = ['群名称', '群昵称', '群介绍']
    let attrActionArr = ['updateTeam', 'updateInfoInTeam', 'updateTeam']
    let attrArr = ['name', 'nickInTeam', 'intro']
    let index = attrArr.indexOf(attr)
    let currentGroup = this.data.currentGroup
    if ((index === 1 && !currentGroup.isCurrentNotIn) || (index !== 1 && !currentGroup.isCurrentNotIn && (this.data.isOwner || this.data.isManager ||  this.data.updateTeamMode === 'all'))) {
      this.setData({
        changeBoxTitle: `修改${attTxtrArr[index]}`,
        changeBoxType: {
          attr,
          type: attrActionArr[index],
          typeTxt: attTxtrArr[index]
        },
        editFlag: true
      })
    }
  },
  /**
   * 确认修改
   */
  changeBoxClickHandler (e) {
    let data = e.detail.data
    if (data === 'confirm') {
      if (this.data.newChangeValue.length === 0) {
        showToast('text', '请输入内容')
      } else {
        this.sureToChange()
      }
    } else if (data === 'cancel') {
      this.setData({
        newChangeValue: '',
        editFlag: false
      })
    }
  },
  /**
   * 修改内容输入
   */
  changeBoxInputChange(e) {
    this.setData({
      newChangeValue: e.detail.value
    })
  },
  /**
   * 发起修改群信息
   */
  sureToChange () {
    let self = this
    let attr = self.data.changeBoxType.attr
    let data = { teamId: self.data.teamId }
    data[attr] = self.data.newChangeValue
    data['done'] = function (error, obj) {
      if (error) {
        showToast('error', `修改${self.data.changeBoxType.typeTxt}失败`)
        return
      }
      delete data['done']
      if (attr === 'name' || attr === 'intro') {
        if (attr === 'name') {
          wx.setNavigationBarTitle({
            title: self.data.newChangeValue
          })
        }
        store.dispatch({
          type: 'Update_Group_And_Set_Current',
          payload: data
        })
      }
      self.setData({
        newChangeValue: '',
        editFlag: false
      })
    }
    app.globalData.nim[self.data.changeBoxType.type](data)
  },
  /**
   * 查看公告
   */
  lookAnnouncement() {
    wx.navigateTo({
      url: '../../partials/announcement/announcement?limit=' + (!this.data.currentGroup.isCurrentNotIn && (this.data.isManager || this.data.isOwner || this.data.updateTeamMode === 'all')) + '&teamId=' + this.data.teamId
    })
  },
  /**
   * 查看群成员
   */
  lookMembers(e) {
    let add = e.target.dataset.add
    if (add) { // 添加群成员
      this.addPerson()
    } else { // 查看群成员
      wx.navigateTo({
        url: '../../partials/advancedGroupMember/advancedGroupMember?teamId=' + this.data.teamId
      })
    }
  },
  /**
   * 获取 attrMap 对应文案
   */
  getAttrText(name, attr) {
    name = name || ''
    if (!name) {
      return ''
    }
    let obj = attrMap[name]
    let index = obj.valueArr.indexOf(attr)
    return (obj.txtArr[index] || '')
  },
  /**
   * 获取 attrMap 对应属性
   */
  getAttrStr(name, index) {
    name = name || ''
    if (!name) {
      return ''
    }
    return attrMap[name].valueArr[index]
  },
  /**
   * 消息提醒
   */
  settingMsgRemind() {
    let self = this
    wx.showActionSheet({
      itemList: attrMap['msgRemind'].txtArr,
      success: function (res) {
        let value = self.getAttrStr('msgRemind', res.tapIndex)
        app.globalData.nim.updateInfoInTeam({
          teamId: self.data.teamId,
          muteNotiType: value,
          done: (error, obj) => {
            if (error) {
              console.log(error)
              showToast('error', '设置失败')
              return
            }
            self.setData({
              msgRemind: value,
              msgRemindTxt: self.getAttrText('msgRemind', value)
            })
          }
        })
      }
    })
  },
  /**
   * 身份验证
   */
  settingAuthentication() {
    let self = this
    wx.showActionSheet({
      itemList: attrMap['joinMode'].txtArr,
      success: function (res) {
        let value = self.getAttrStr('joinMode', res.tapIndex)
        app.globalData.nim.updateTeam({
          teamId: self.data.teamId,
          joinMode: value,
          done: (error, obj) => {
            if (error) {
              console.log(error)
              showToast('error', '设置失败')
              return
            }
            store.dispatch({
              type: 'Update_Group_And_Set_Current',
              payload: obj
            })
          }
        })
      }
    })
  },
  /**
   * 邀请他人权限
   */
  settingInviteLimit() {
    let self = this
    wx.showActionSheet({
      itemList: attrMap['inviteMode'].txtArr,
      success: function (res) {
        let value = self.getAttrStr('inviteMode', res.tapIndex)
        app.globalData.nim.updateTeam({
          teamId: self.data.teamId,
          inviteMode: value,
          done: (error, obj) => {
            if (error) {
              console.log(error)
              showToast('error', '设置权限失败')
              return
            }
            store.dispatch({
              type: 'Update_Group_And_Set_Current',
              payload: obj
            })
          }
        })
      }
    })
  },
  /**
   * 群资料修改权限
   */
  settingCardChange() {
    let self = this
    wx.showActionSheet({
      itemList: attrMap['updateTeamMode'].txtArr,
      success: function (res) {
        let value = self.getAttrStr('updateTeamMode', res.tapIndex)
        app.globalData.nim.updateTeam({
          teamId: self.data.teamId,
          updateTeamMode: value,
          done: (error, obj) => {
            if (error) {
              console.log(error)
              showToast('error', '设置权限失败')
              return
            }
            store.dispatch({
              type: 'Update_Group_And_Set_Current',
              payload: obj
            })
          }
        })
      }
    })
  },
  /**
   * 被邀请人身份验证
   */
  settingBeInvitedPass() {
    let self = this
    wx.showActionSheet({
      itemList: attrMap['beInviteMode'].txtArr,
      success: function (res) {
        let value = self.getAttrStr('beInviteMode', res.tapIndex)
        app.globalData.nim.updateTeam({
          teamId: self.data.teamId,
          beInviteMode: value,
          done: (error, obj) => {
            if (error) {
              console.log(error)
              showToast('error', '设置失败')
              return
            }
            store.dispatch({
              type: 'Update_Group_And_Set_Current',
              payload: obj
            })
          }
        })
      }
    })
  },

  /**
   * 申请进入高级群
   */
   applyJoin() {
    app.globalData.nim.applyTeam({
     teamId: this.data.teamId,
     done: (error, obj) => {
       if (error) {
         if (error.message.indexOf('已经在群里')) {
           showToast('error', '已经在群里')
         } else {
           showToast('error', '申请入群失败')
         }
         console.log(error)
         return
       }
       showToast('text', '已发送入群申请')
     }
    })
   },
  /**
   * 退出高级群
   */
   deleteGroup() {
     wx.showModal({
       title: '确认退出高级群',
       content: '',
       showCancel: true,
       cancelText: '取消',
       confirmText: '确定',
       success: (res) => {
         if (res.confirm) { // 用户点击确定
           app.globalData.nim.leaveTeam({
            teamId: this.data.teamId,
            done: (error, obj) => {
              if (error) {
                showToast('error', '退出高级群失败')
                console.log(error)
                return
              }
              store.dispatch({
                type: 'Del_Group',
                payload: obj
              })
            }
           })
           wx.navigateBack({ delta: (this.data.from ? 2 : 3) })
         }
       }
     })
   },
  /**
    * 解散高级群
    */
  dismissGroup() {
    wx.showModal({
      title: '确认解散群聊',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) { // 用户点击确定
          app.globalData.nim.dismissTeam({
           teamId: this.data.teamId,
           done: (error, obj) => {
             if (error) {
               showToast('error', '解散高级群失败')
               console.log(error)
               return
             }
             store.dispatch({
               type: 'Del_Group',
               payload: obj
             })
           }
          })
          wx.navigateBack({ delta: (this.data.from ? 2 : 3) })
        }
      }
    })
  }
}
let mapStateToData = (state) => {
  console.log('高级群store', state);
  if (!state.currentGroup.isCurrentNotIn && !state.currentGroupMembers.allMembers) {
    pageConfig.getMemberList(state.currentGroup.teamId, state.currentGroupMembers, state.personList)
  }
  return {
    userInfo: state.userInfo,
    personList: state.personList,
    currentGroup: state.currentGroup,
    currentGroupMembers: state.currentGroupMembers,
    groupMemberMap: state.groupMemberMap,
    aLineMembers: state.currentGroupMembers.slice(0,6),
    isOwner: state.currentGroup.owner === state.userInfo.account,
    isManager: pageConfig.checkIsManager(state.groupMemberMap, state.currentGroup.teamId, state.userInfo.account),
    userCard: pageConfig.getSelfUserCard(state.groupMemberMap, state.currentGroup.teamId, state.userInfo.account),
    inviteMode: state.currentGroup.inviteMode || '',
    updateTeamMode: state.currentGroup.updateTeamMode || '',
    joinModeTxt: pageConfig.getAttrText('joinMode', state.currentGroup.joinMode),
    inviteModeTxt: pageConfig.getAttrText('inviteMode', state.currentGroup.inviteMode),
    updateTeamModeTxt: pageConfig.getAttrText('updateTeamMode', state.currentGroup.updateTeamMode),
    beInviteModeTxt: pageConfig.getAttrText('beInviteMode', state.currentGroup.beInviteMode)
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
