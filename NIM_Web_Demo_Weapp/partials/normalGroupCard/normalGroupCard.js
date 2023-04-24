import { connect } from '../../redux/index.js'
import { showToast, correctData } from '../../utils/util.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    defaultAvatar: app.globalData.PAGE_CONFIG.defaultUserLogo,
    teamId: '',
    deleteThe: false,
    editNameFlag: false,
    newGroupName: '',
    msgRemind: false,
    from: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let teamId = options.teamId
    let from = options.from || ''
    let currentAccountCard = this.data.groupMemberMap[teamId] && this.data.groupMemberMap[teamId][this.data.userInfo.account] || {}
    wx.setNavigationBarTitle({
      title: this.data.currentGroup && this.data.currentGroup.name || '讨论组'
    })
    this.setData({ teamId, from, msgRemind: currentAccountCard.muteNotiType == '0' })
    this.getUsersAvatar()
  },
  /**
   * 获取用户头像，一次最多150个
   */
  getUsersAvatar () {
    let currentGroupMembers = this.data.currentGroupMembers
    let personList = this.data.personList
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
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {
  },
  /**
   * 添加按钮
   */
  addPerson () {
    wx.navigateTo({
      url: '../../partials/chooseContact/chooseContact?type=normal&action=add&teamId=' + this.data.teamId
    })
  },
  /**
   * 删除某一个人
   */
  deletePerson(e) {
    let index = e.currentTarget.dataset.index
    let account = e.currentTarget.dataset.account
    app.globalData.nim.removeTeamMembers({
      teamId: this.data.teamId,
      accounts: [account],
      done: (error, obj) => {
        if (error) {
          showToast('error', '删除失败')
          console.log(error)
          return
        }
        store.dispatch({
          type: 'Del_Group_Member',
          payload: obj
        })
      }
    })
  },
  /**
   * 修改讨论组名称
   */
  changeName () {
    if (!this.data.currentGroup.isCurrentNotIn) {
      this.setData({
        editNameFlag: true
      })
    }
  },
  /**
   * 确认修改讨论组名称
   */
  nameClickHandler (e) {
    let data = e.detail.data
    if (data === 'confirm') {
      if (this.data.newGroupName.length === 0) {
        showToast('text', '请输入内容')
      } else {
        this.sureToChangeName()
      }
    } else if (data === 'cancel') {
      this.setData({
        newGroupName: '',
        editNameFlag: false
      })
    }
  },
  /**
   * 讨论组名称输入
   */
  nameInputChange(e) {
    this.setData({
      newGroupName: e.detail.value
    })
  },
  /**
   * 发起修改讨论组名称请求
   */
  sureToChangeName () {
    app.globalData.nim.updateTeam({
      teamId: this.data.teamId,
      name: this.data.newGroupName,
      done: (error, team) => {
        if (error) {
          showToast('error', '修改名称失败')
          return
        }
        wx.setNavigationBarTitle({
          title: this.data.newGroupName
        })
        store.dispatch({
          type: 'Update_Group_And_Set_Current',
          payload: team
        })
        this.setData({
          newGroupName: '',
          editNameFlag: false
        })
      }
    })
  },
  /**
   * 删除按钮
   */
  openDelPerson() {
    this.setData({ deleteThe: !this.data.deleteThe })
  },
  toggleMsgRemind (e) {
     app.globalData.nim.updateInfoInTeam({
       teamId: this.data.teamId,
       muteNotiType: e.detail.value ? 0 : 1, // 0表示接收提醒，1表示关闭提醒
       done: (error, obj) => {
         if (error) {
           console.log(error)
           showToast('error', '设置失败')
           return
         }
         this.setData({
           msgRemind: obj.muteNotiType == '0'
         })
       }
    })
  },
  /**
   * 退出讨论组
   */
   deleteGroup() {
     wx.showModal({
       title: '确认退出讨论组',
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
                showToast('error', '退出失败')
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
  return {
    userInfo: state.userInfo,
    personList: state.personList,
    currentGroup: state.currentGroup,
    currentGroupMembers: state.currentGroupMembers,
    groupMemberMap: state.groupMemberMap
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
