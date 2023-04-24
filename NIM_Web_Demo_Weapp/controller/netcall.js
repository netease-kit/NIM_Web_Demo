import NetcallWeixin from '../vendors/NIM_Web_Netcall_weixin_v7.7.0.js'
import NIM from '../vendors/NIM_Web_NIM_weixin_v7.7.0.js'
import Emitter from '../utils/emitter.js'

let app = getApp()
let store = app.store
export default class NetcallController {
  constructor(props) {
    NIM.use(NetcallWeixin)
    NetcallWeixin.destroy()
    this.netcall = app.globalData.netcall = NetcallWeixin.getInstance(props)
    app.globalData.emitter = new Emitter()
    this.bindNetcallEvent()

    this.state = {
      onTheCall: false, // 正在通话中
    }
  }
  bindNetcallEvent() {
    this.netcall.on('syncDone', (data) => {
      console.log(new Date())
      console.log('登录成功', data)
      app.globalData.emitter.emit('syncDone', data)
    })
    this.netcall.on('clientLeave', (data) => {
      console.log('有人离开了', data)
      app.globalData.emitter.emit('clientLeave', data)
    })
    this.netcall.on('clientJoin', (data) => {
      console.log(new Date())
      // {account,cid,mode,uid,url}
      console.log('有人加入了', data)
      this.state.onTheCall = true // 标记正在通话
      app.globalData.emitter.emit('clientJoin', data)
    })
    this.netcall.on('callRejected', (data) => {
      console.log('对方拒绝了', data)
      app.globalData.emitter.emit('callRejected', data)
    })
    this.netcall.on('callAccepted', (data) => {
      console.log('对方接听了', data)
      app.globalData.emitter.emit('callAccepted', data)
    })
    this.netcall.on('beCalling', (data) => {
      // {caller,cid,type}
      console.log('beCalling', data)
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      if (currentPage.route.includes('videoCall') === false && app.globalData.isPushBeCallPage == false) { // 不在多人通话中，才提示
        if (!currentPage) {
          wx.navigateTo({
            url: `/partials/videoCall/videoCall?beCalling=true&caller=${data.caller}&cid=${data.cid}&type=${data.type}`,
          })
          app.globalData.isPushBeCallPage = true
          return
        }
        let netcallGroupCallInfo = store.getState().netcallGroupCallInfo
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        if (Object.keys(netcallGroupCallInfo).length === 0) { // p2p视频
          if (!currentPage.route.includes('videoCall') && app.globalData.isPushBeCallPage == false) {
            wx.navigateTo({
              url: `/partials/videoCall/videoCall?beCalling=true&caller=${data.caller}&cid=${data.cid}&type=${data.type}`,
            })
            app.globalData.isPushBeCallPage = true
          }
        }
      }
      app.globalData.emitter.emit('beCalling', data)
    })
    this.netcall.on('callerAckSync', (data) => {
      // {timetag,type,fromClientType:number,cid,accepted}
      console.log('callerAckSync: 其他端已经处理了', data)
      wx.showToast({
        title: '已在其他端处理！',
        duration: 2000,
        icon: 'none',
        success: function() {
          setTimeout(() => {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]
            if (currentPage.route.includes('videoCall') || currentPage.route.includes('videoCallMeeting')) {
              wx.navigateBack(1)
            }
          }, 2000)
        }
      })
    })
    this.netcall.on('hangup', (data) => {
      console.log('hangup', data)
      this.state.onTheCall = false // 标记正在通话
      app.globalData.emitter.emit('hangup', data)
    })
    this.netcall.on('control', (data) => {
      console.log('control', data)
      // {cid,account,command}
      app.globalData.emitter.emit('control', data)
    })
    this.netcall.on('joinChannel', (data) => {
      // {uid,account,cid}
      console.log('joinChannel', data)
      app.globalData.emitter.emit('joinChannel', data)
    })
    this.netcall.on('clientUpdate', (data) => {
      console.log('有人更新了', data)
    })
    this.netcall.on('error', (error) => {
      console.error('出错了', error)
    })
    this.netcall.on('open', (data) => {
      console.log('socket建立成功', data)
    })
    this.netcall.on('willreconnect', (data) => {
      // 直播通道准备重连
      app.globalData.emitter.emit('willreconnect', data)
    })
    this.netcall.on('sendCommandOverTime', (data) => {
      console.log('发送命令超时', data)
    })
    this.netcall.on('liveRoomClose', (data) => {
      console.log('互动直播房间解散了', data)
    })
    this.netcall.on('sessionDuration', (data) => {
      console.log('===结束通话(ms)：', data)
    })
  }
}
