import { connect } from '../../redux/index.js'
import { showToast, correctData } from '../../utils/util.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    defaultAvatar: app.globalData.PAGE_CONFIG.defaultUserLogo,
    userCard: {},
    isBlack: false,
    newValue: '',
    editFlag: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = options.account
    let userCard = this.data.friendCard[account]
    this.setData({
      userCard: correctData(userCard),
      isBlack: userCard.isBlack || false
    })
  },
  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {},
  /**
   * 修改备注
   */
  changeRemark () {
    this.setData({
      editFlag: true
    })
  },
  /**
   * 确认修改备注
   */
  valueClickHandler (e) {
    let data = e.detail.data
    if (data === 'confirm') {
      if (this.data.newValue.length === 0) {
        showToast('text', '请输入内容')
      } else {
        this.sureToChangValue()
      }
    } else if (data === 'cancel') {
      this.setData({
        newValue: '',
        editFlag: false
      })
    }
  },
  /**
   * 备注输入
   */
  valueInputChange(e) {
    this.setData({
      newValue: e.detail.value
    })
  },
  /**
   * 发起修改备注请求
   */
  sureToChangValue () {
    var data = {
      account: this.data.userCard.account,
      alias: this.data.newValue,
      remark: this.data.newValue,
      done: (error, team) => {
        if (error) {
          showToast('error', '修改失败')
          return
        }
        let userCard = Object.assign({}, this.data.userCard, { alias: this.data.newValue, remark: this.data.newValue })
        this.setData({
          userCard,
          newValue: '',
          editFlag: false
        })
        store.dispatch({
          type: 'FriendCard_Update_InfoCard',
          payload: userCard
        })
      }
    }
    app.globalData.nim.updateFriend(data)
  },
  /**
   * 删除好友按钮
   */
  deleteFriendBtnHandler() {
    wx.showModal({
      title: '确认删除此好友',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {//用户点击确定
          this.doDeleteFriend()
        }
      }
    })
  },
  /**
   * 发送请求，删除好友
   */
  doDeleteFriend() {
    let self = this
    app.globalData.nim.deleteFriend({
      account: self.data.userCard.account,
      done: (err, obj) => {
        if (err) {
          console.log(err)
          return
        }
        store.dispatch({
          type: 'FriendCard_Delete_By_Account',
          payload: self.data.userCard.account
        })
        wx.switchTab({
          url: '../../pages/contact/contact',
        })
      }
    })
  },
  /**
   * 聊天按钮
   */
  chatBtnHandler() {
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: 'p2p-' + this.data.userCard.account
    })
    wx.navigateTo({
      url: '../chating/chating?chatTo=' + this.data.userCard.account + '&type=p2p',
    })
  },
  /**
   * 加入黑名单
   */
  toggleBlackList(e) {
    let account = this.data.userCard.account
    let self = this
    if (e.detail.value) {//加入黑名单
      wx.showModal({
        title: '',
        content: '加入黑名单，你将不再收到对方消息',
        confirmColor: '#f00',
        success: function (res) {
          if (res.confirm) { // 确定
            // 发送请求
            app.globalData.nim.markInBlacklist({
              account,
              isAdd: true,//true表示加入黑名单,
              done: (err, obj) => {
                if (err) {
                  console.log(err)
                  return
                }
                // 更新数据
                store.dispatch({
                  type: 'Blacklist_Update_MarkInBlacklist',
                  payload: {
                    account,
                    isBlack: true,
                    addTime: new Date().getTime() // 用这个排序
                  }
                })
                showToast('text', '拉入黑名单成功')
              }
            })
          } else {
            self.setData({
              isBlack: false
            })
          }
        }
      })
    } else {//从黑名单移除
      // 发送请求
      app.globalData.nim.markInBlacklist({
        account,
        isAdd: false,//true表示加入黑名单,
        done: (err, obj) => {
          if (err) {
            console.log(err)
            return
          }
          store.dispatch({
            type: 'Blacklist_Update_MarkInBlacklist',
            payload: {
              account,
              isBlack: false,
              addTime: new Date().getTime()
            }
          })
          showToast('text', '移除黑名单成功')
        }
      })
    }
  }
}
let mapStateToData = (state) => {
  return {
    friendCard: state.friendCard
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)
