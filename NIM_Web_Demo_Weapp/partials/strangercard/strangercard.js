import { showToast, correctData } from '../../utils/util.js'
let app = getApp()
let store = app.store
let pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    user: {}, //界面显示
    isBlack: false //是否拉黑
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = options.account
    let userCard = store.getState().personList[account] || {}
    this.setData({
      user: correctData(userCard),
      isBlack: userCard.isBlack || false
    })
  },
  /**
   * 添加好友按钮
   */
  addFriendBtnHandler() {
    let account = this.data.user.account
    app.globalData.nim.addFriend({
      account,
      ps: '',
      done: (err, obj) => {
        if (err) {
          console.log(err)
          return
        }
        showToast('text', '添加成功')
        // 获取名片信息
        app.globalData.nim.getUser({
          account,
          done: function (err, user) {
            store.dispatch({
              type: 'FriendCard_Add_Friend',
              payload: user
            })
            // 订阅后只有在订阅账号登录状态变化后才会收到推送事件
            app.globalData.nim.subscribeEvent({
              type: 1, // 订阅用户登录状态事件
              accounts: new Array(account),
              subscribeTime: 3600 * 24 * 30,
              sync: true,
              done: function(err, obj) {
                if(err) {
                  console.log(err)
                  return
                }
                console.log(obj) // {failedAccounts: Array(0)}
              }
            })
            wx.switchTab({
              url: '../../pages/contact/contact'
            })
          }
        })
      }
    })
  },
  /**
   * 加入黑名单
   */
  toggleBlackList(e) {
    let value = e.detail.value
    let account = this.data.user.account
    if (value) {//加入黑名单
      wx.showActionSheet({
        itemList: ['确定'],
        itemColor: '#f00',
        success: (res) => {
          let tapIndex = res.tapIndex
          if (tapIndex == 0) {
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
Page(pageConfig)
