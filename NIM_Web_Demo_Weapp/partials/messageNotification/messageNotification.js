import { iconNoMessage } from '../../utils/imageBase64.js'
import { deepClone, showToast } from '../../utils/util.js'
import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    currentTab: 0,//当前索引
    windowMaxHeight: 0,//通知窗口高度
  },
  onLoad: function (options) {
    let self = this
    // 获取窗口高度，设置底部滑动容器
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowMaxHeight: res.windowHeight - 120
        })
      },
    })
    wx.setNavigationBarTitle({
      title: '消息通知',
    })
    this.setData({
      iconNoMessage
    })
  },
  /**
   * nav点击
   */
  switchNav(e) {
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  sysClear() {
    this.clearNotification('sys')
  },
  cusClear() {
    this.clearNotification('cus')
  },
  /**
   * 清除通知消息公用方法
   */
  clearNotification(cata) {
    let self = this
    wx.showActionSheet({
      itemList: ['确认'],
      itemColor: '#f00',
      success: function (res) {
        if (res.tapIndex === 0) {
          if (cata == 'cus') {
            store.dispatch({
              type: 'Notification_Clear_System'
            })
          } else if (cata == 'sys') {
            store.dispatch({
              type: 'Notification_Clear_System'
            })
          }
        }
      },
      fail: function (res) {
        console.error(res)
      }
    })
  },
  /**
   * 删除自定义通知条目
   */
  deleteCusItem(e) {
    let index = e.currentTarget.dataset.data
    this.deleteItem('cus', index)
  },
  /**
   * 操作系统通知条目
   */
  actionSysItem(e) {
    let index = e.currentTarget.dataset.data
    let list = this.data.notificationList.system
    if (list[index].type === 'team') {
      if (list[index].state) {
        return
      }
      let data = {
        idServer: list[index].idServer,
        teamId: list[index].teamId,
        from: list[index].from,
        done: (error, obj) => {
          if (error) {
            showToast('error', '操作失败')
            return
          }
        }
      }
      wx.showActionSheet({
        itemList: ['同意', '拒绝'],
        success: (res) => {
          if (res.tapIndex == 0) {
            if (list[index].teamAction === 'invite') {
              app.globalData.nim.acceptTeamInvite(data) // 接受入群邀请
            } else if (list[index].teamAction === 'apply') {
              app.globalData.nim.passTeamApply(data) // 拒绝入群申请
            }
          } else if (res.tapIndex == 1) {
            if (list[index].teamAction === 'invite') {
              app.globalData.nim.rejectTeamInvite(data) // 拒绝入群邀请
            } else if (list[index].teamAction === 'apply') {
              app.globalData.nim.rejectTeamApply(data) // 拒绝入群申请
            }
          }
        }
      })
    }
  },
  /**
   * 删除系统通知条目
   */
  deleteSysItem(e) {
    let index = e.currentTarget.dataset.data
    this.deleteItem('sys', index)
  },
  /**
   * 删除item公用方法
   */
  deleteItem(cata, notification) {
    if (cata == 'sys') {
      store.dispatch({
        type: 'Notification_Delete_Specified_System_By_Index'
      })
    } else if (cata == 'cus') {
      store.dispatch({
        type: 'Notification_Delete_Specified_Custom_By_Index'
      })
    }
  }
}

let mapStateToData = (state) => {
  return {
    notificationList: state.notificationList
  }
}
const mapDispatchToPage = (dispatch) => {}
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
