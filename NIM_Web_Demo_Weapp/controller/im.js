import MD5 from '../vendors/md5.js'
import NIM from '../vendors/NIM_Web_NIM_weixin_v7.7.0.js'
import NetcallController from './netcall.js'
import { updateMultiPortStatus, deepClone, dealMsg, showToast } from '../utils/util.js'

let app = getApp()
let store = app.store

let orderCounter = 1
// 第一次进去onConnect onBlacklist onMutelist onFriends onMyInfo onUsers onTeams SyncDone onPushEvents
// 重连 onWillConnect
export default class IMController {
  constructor(headers) {
    app.globalData.nim = NIM.getInstance({
      // 初始化SDk
      // debug: true,
      appKey: app.globalData.ENVIRONMENT_CONFIG.appkey,
      token: MD5(headers.token),
      account: headers.account,
      promise: true,
      transports: ['websocket'],
      syncSessionUnread: true, // 同步未读数
      onconnect: this.onConnect,
      onwillreconnect: this.onWillReconnect,
      ondisconnect: this.onDisconnect,
      onerror: this.onError,
      // 私有化配置文件
      privateConf: app.globalData.ENVIRONMENT_CONFIG.openPrivateConf ? app.globalData.ENVIRONMENT_CONFIG.privateConf : '',
      // 同步完成
      onsyncdone: this.onSyncDone,
      // 用户关系
      onblacklist: this.onBlacklist,
      onsyncmarkinblacklist: this.onMarkInBlacklist,
      onmutelist: this.onMutelist,
      onsyncmarkinmutelist: this.onMarkInMutelist,
      // 好友关系
      onfriends: this.onFriends,
      onsyncfriendaction: this.onSyncFriendAction,
      // // 用户名片
      onmyinfo: this.onMyInfo,
      onupdatemyinfo: this.onUpdateMyInfo,
      onusers: this.onUsers,
      onupdateuser: this.onUpdateUser,
      // 机器人列表的回调
      onrobots: this.onRobots,
      // 群组
      onteams: this.onTeams,
      onsynccreateteam: this.onCreateTeam,
      onupdateteammember: this.onUpdateTeamMember,
      onAddTeamMembers: this.onAddTeamMembers,
      onRemoveTeamMembers: this.onRemoveTeamMembers,
      onUpdateTeam: this.onUpdateTeam,
      onUpdateTeamManagers: this.onUpdateTeamManagers,
      onDismissTeam: this.onDismissTeam,
      onTransferTeam: this.onTransferTeam,
      onUpdateTeamMembersMute: this.onUpdateTeamMembersMute,
      shouldCountNotifyUnread: this.shouldCountNotifyUnread,
      // 会话
      onsessions: this.onSessions,
      onupdatesession: this.onUpdateSession,
      // 消息
      onroamingmsgs: this.onRoamingMsgs,
      onofflinemsgs: this.onOfflineMsgs,
      onmsg: this.onMsg,
      // 系统通知
      onofflinesysmsgs: this.onOfflineSysMsgs,
      onsysmsg: this.onSysMsg,
      onupdatesysmsg: this.onUpdateSysMsg,
      onsysmsgunread: this.onSysMsgUnread,
      onupdatesysmsgunread: this.onUpdateSysMsgUnread,
      onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs,
      oncustomsysmsg: this.onCustomSysMsg,
      // 收到广播消息
      onbroadcastmsg: this.onBroadcastMsg,
      onbroadcastmsgs: this.onBroadcastMsgs,
      // 事件订阅
      onpushevents: this.onPushEvents,
    })
    // 发送消息开始登陆
    store.dispatch({
      type: 'Login_StartLogin'
    })
  }
  /** 1
   * 连接成功
   */
  onConnect() {
    console.log(orderCounter++, ' onConnect: ')
    app.globalData.netcallController = new NetcallController({
      // debug: false,
      debug: true,
      nim: app.globalData.nim
    })
  }
  /** 2或sync done之后触发
   * 设置订阅后，服务器消息事件回调
   */
  onPushEvents(param) {
    console.log(orderCounter++, ' onPushEvents: ', param)
    let msgEvents = param.msgEvents
    if (msgEvents) {
      let statusArr = []
      msgEvents.map((data) => {
        statusArr.push({
          status: updateMultiPortStatus(data),
          account: data.account
        })
      })
      // 更新好友全局状态
      store.dispatch({
        type: 'FriendCard_Update_Online_Status',
        payload: statusArr
      })
    }
  }
  /** 3
 * 收到黑名单列表
 */
  onBlacklist(blacklist) {
    console.log(orderCounter++, ' onBlacklist: ', blacklist)
    store.dispatch({
      type: 'Blacklist_Update_Initial',
      payload: blacklist
    })
  }
  /** 4
   * onMutelist
   */
  onMutelist(mutelist) {
    console.log(orderCounter++, ' onMutelist: ', mutelist)
  }
  /** 5
   * 同步好友信息，不含名片 [{account, createTime, updateTime}]
   */
  onFriends(friends) {
    console.log(orderCounter++, ' onFriends: ', friends)
    store.dispatch({
      type: 'FriendCard_Update_Initial',
      payload: friends
    })
    if (app.globalData.ENVIRONMENT_CONFIG.openSubscription) {
      app.globalData.nim.subscribeEvent({
        type: 1, // 订阅用户登录状态事件
        accounts: friends.map(item => item.account),
        sync: true,
        done: function (err, obj) {
          console.log(err, obj)
        }
      })
    }
  }
  /** 6
   * 个人名片：存储个人信息到全局数据
   */
  onMyInfo(user) {
    console.log(orderCounter++, ' onMyInfo: ')
    store.dispatch({
      type: 'IM_OnMyInfo',
      payload: user
    })
  }
  /** 7
   * 包含名片的好友信息（可能某些字段不全），[{account,avatar,birth,createTime,email,gender,nick,sign,updateTime}]
   */
  onUsers(friends) {
    console.log(orderCounter++, ' onUsers: ', friends)
    store.dispatch({
      type: 'FriendCard_Update_Initial',
      payload: friends
    })
  }
  /** 8 同步群列表
   * onTeams
   */
  onTeams(teams) {
    console.log(orderCounter++, 'onTeams')
    console.log(teams)
    store.dispatch({
      type: 'Init_Groups',
      payload: teams
    })
  }
  /** 9
   * onSyncDone,同步完成
   */
  onSyncDone() {
    console.log(orderCounter++, ' Sync Done')
    store.dispatch({
      type: 'Login_LoginSuccess'
    })
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    if (currentPage.route.includes('login') || currentPage.route.includes('register')) {
      wx.switchTab({
        url: '/pages/recentchat/recentchat',
      })
    }
  } 
  /**
 * 会话更新：收到消息、发送消息、设置当前会话、重置会话未读数 触发
 * {id:'p2p-zys2',lastMsg:{},scene,to,unread,updateTime}
 * {id:'team-1389946935',lastMsg:{attach:{accounts,team},type,users},scene,to,from,type,unread,updateTime}
 */
  onUpdateSession(session) {
    console.log('onUpdateSession: ', session)
    try {
      store.dispatch({
        type: 'UnreadInfo_update',
        payload: session
      })
    } catch(error) {
    }
  }
  /**
   * 收到消息
   * {cc,flow:"in",from,fromClientType:"Web",fromDeviceId,fromNick,idClient,idServer:"9680840912",isHistoryable:true,isLocal,isMuted, isOfflinable,isPushable,isRoamingable,isSyncable,isUnreadable,needPushNick,resend,scene:"p2p",sessionId:"p2p-zys2",status:"success",target:"zys2",text:"[呕吐]",time,to:"wujie",type:"text",userUpdateTime}
   */
  onMsg(msg) {
    console.log('onMsg: 收到消息', msg)
    try {
      store.dispatch({
        type: 'RawMessageList_Add_Msg',
        payload: { msg, nim: app.globalData.nim }
      })
    } catch (error) {
      
    }
  }
  /** 操作主体为对方
   * 收到系统通知，例如 被对方删除好友、被对方添加好友、被对方撤回消息
   * {type,to,time,deletedMsgTime,deletedMsgFromNick,deletedIdServer,deletedIdClient,status,scene,opeAccount,msg:{flow,from,fromNick,idClient,scene,sessionId,target,time,to,opeAccount},idServer,from}
   * time:为删除消息时间，deletedMsgTime为删除的消息发送时间
   */
  onSysMsg(msg) {
    console.log('onSysMsg: ', msg)
    dealMsg(msg, store, app)
  }
  /**
   * 丢失连接
   */
  onDisconnect(error) {
    console.log(orderCounter++, ' onDisconnect: ')
    console.log(error)
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          console.log('onError: 账号或者密码错误')
          wx.showToast({
            title: '账号或密码错误',
            image: '/images/emoji.png'
          })
          store.dispatch({ type: 'Login_LoginSuccess' })
          break;
        // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        case 417:
          console.log('onError: 重复登录')
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          wx.showModal({
            title: '用户下线',
            showCancel: false,
            content: '在其他客户端登录，导致被踢',
            confirmText: '重新登录',
            success: (res) => {
              if (res.confirm) { //点击确定
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                if (currentPage.route.includes('videoCallMeeting')) { // 多人视频
                  try {
                    // 兼容登录网关502错误离开房间
                    if (app.globalData.netcall) {
                      app.globalData.netcall.leaveChannel()
                        .then(() => {
                          app.globalData.netcall.destroy()
                          app.globalData.nim.destroy({
                            done: function () {
                              console.log('destroy nim done !!!')
                              wx.clearStorage()
                              wx.hideLoading()
                            }
                          })
                          wx.reLaunch({
                            url: '/pages/login/login',
                          })
                        })
                    }
                  } catch (error) {
                  }
                } else if (currentPage.route.includes('videoCall')) { // p2p
                  try {
                     // 兼容登录网关502错误离开房间
                     if (app.globalData.netcall) {
                       app.globalData.netcall.hangup()
                         .then(() => {
                           app.globalData.netcall.destroy()
                           app.globalData.nim.destroy({
                             done: function () {
                               console.log('destroy nim done !!!')
                               wx.clearStorage()
                               wx.hideLoading()
                             }
                           })
                           wx.reLaunch({
                             url: '/pages/login/login',
                           })
                        })
                     }
                  } catch (error) {
                    console.warn(error)
                  }
                } else {
                  app.globalData.netcall.destroy()
                  app.globalData.nim.destroy({
                    done: function () {
                      console.log('destroy nim done !!!')
                      wx.clearStorage()
                      wx.hideLoading()
                    }
                  })
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                }

              }
            }
          })
          break;
        default:
          break;
      }
    }
  }
  /**
   * 漫游消息：会多次收到，每次只会收到指定人的漫游消息
    // {scene:"p2p",sessionId:"p2p-cs4",timetag:1513153729257,to:"cs4",msg:[{from:'wujie',text:'222',to:'cs4'}]}
    // {scene:"team",sessionId:"team-3944051",timetag:1513153729257,to:"3944051",msg:[{from:'wujie',text:'222',to:'cs4'}]}
   */
  onRoamingMsgs(list) {
    console.log(orderCounter++, ' 漫游消息')
    console.log(list)
    store.dispatch({
      type: 'RawMessageList_Add_RoamingMsgList',
      payload: list
    })
  }
  /**
   * 连接出错
   */
  onError(error) {
    console.log(' onError', error)
    app.globalData.nim.disconnect()
    app.globalData.nim.connect()
  }

  onMarkInBlacklist(obj) {
    console.log(orderCounter++, ' onMarkInBlacklist: ')
    console.log(obj)
  }

  onMarkInMutelist(obj) {
    console.log(orderCounter++, ' onMarkInMutelist: ')
    console.log(obj)
  }

  onSyncFriendAction(obj) {
    console.log(orderCounter++, ' onSyncFriendAction')
    console.log(obj)
  }

  onUpdateMyInfo(user) {
    console.log(orderCounter++, ' onUpdateMyInfo')
    console.log(user)
  }

  onUpdateUser(user) {
    console.log(orderCounter++, ' onUpdateUser')
    console.log(user)
  }

  /**
  *   创建群的回调, 此方法接收一个参数, 包含群信息和群主信息
  */
  onCreateTeam(team) {
    console.log(orderCounter++, ' onCreateTeam')
    store.dispatch({
      type: 'Add_Group',
      payload: team
    })
  }
  /**
  *  群成员信息更新后的回调, 会传入群成员对象, 不过此时的信息是不完整的, 只会包括被更新的字段。当前登录帐号在其它端修改自己的群属性时也会收到此回调。
  */
  onUpdateTeamMember(teamMember) {
    console.log(orderCounter++, 'onUpdateTeamMember')
    store.dispatch({
      type: 'Update_Group_Member',
      payload: teamMember
    })
  }
  /**
  *  新成员入群的回调，自己建群成功也回调
  */
  onAddTeamMembers(msg) {
    console.log(orderCounter++, 'onAddTeamMembers')
    store.dispatch({
      type: 'Add_Group_Members',
      payload: msg
    })
  }
  /**
  *  有人出群的回调
  */
  onRemoveTeamMembers(msg) {
    console.log(orderCounter++, 'onRemoveTeamMembers')
    store.dispatch({
      type: 'Del_Group_Member',
      payload: msg
    })
  }
  /**
  *  更新群的回调
  */
  onUpdateTeam(msg) {
    console.log(orderCounter++, 'onUpdateTeam')
    store.dispatch({
      type: 'Update_Group',
      payload: msg
    })
  }
  /**
  *  更新群管理员的回调
  */
  onUpdateTeamManagers(msg) {
    console.log(orderCounter++, 'onUpdateTeamManagers')
    store.dispatch({
      type: 'Update_Group_Member_Manager',
      payload: msg
    })
  }
  /**
  *  解散群的回调
  */
  onDismissTeam(msg) {
    console.log(orderCounter++, 'onDismissTeam')
    store.dispatch({
      type: 'Del_Group',
      payload: msg
    })
  }
  /**
  *  移交群的回调
  */
  onTransferTeam(msg) {
    console.log(orderCounter++, 'onTransferTeam')
    store.dispatch({
      type: 'Update_Group_Owner',
      payload: msg
    })
  }
  /**
  *  更新群成员禁言状态的回调
  */
  onUpdateTeamMembersMute(msg) {
    console.log(orderCounter++, 'onUpdateTeamMembersMute')
    store.dispatch({
      type: 'Add_Group_Members',
      payload: msg
    })
  }
  /**
  *  群消息通知是否加入未读数开关如果返回true，则计入未读数，否则不计入
  */
  shouldCountNotifyUnread(msg) {
    console.log(orderCounter++, 'shouldCountNotifyUnread')
    console.log(msg)

    return true
  }
  /**会话
   * [ {id:"p2p-liuxuanlin",lastMsg:{from:'wujie',text:'222',to:"liuxuanlin"}} ]
   */
  onSessions(sessions) {
    console.log('onSessions: ', sessions)
    store.dispatch({
      type: 'SessionUnreadInfo_update',
      payload: sessions
    })
  }
  onOfflineMsgs(msg) {
    console.log(orderCounter++, ' onOfflineMsgs')
    console.log(msg)
    store.dispatch({
      type: 'RawMessageList_Add_OfflineMessage',
      payload: msg
    })
  }
  // 系统通知
  onOfflineSysMsgs(msg) {
    console.log(orderCounter++, ' onOfflineSysMsgs')
    console.log(msg)
    msg.map(item => dealMsg(item, store, app))
  }
  onUpdateSysMsg(sysMsg) {
    console.log(orderCounter++, ' onUpdateSysMsg')
    console.log(sysMsg)
    store.dispatch({
      type: 'Update_Sys_Msg',
      payload: sysMsg
    })
  }
  onCustomSysMsg(sysMsg) {
    console.log(orderCounter++, ' onCustomSysMsg')
    console.log(sysMsg)
    //多端同步 正在输入自定义消息类型需要过滤
    let content = JSON.parse(sysMsg.content);
    let id = content.id;
    if (id == 1) {
      return;
    }
    /** 群视频通知 */
    if (id == 3) {
      // {apnsText,content:{id,members,teamId,room,type},from,to}
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      if (currentPage.route.includes('videoCallMeeting') === false) { // 不在多人通话中，才提示
        sysMsg.content = content
        store.dispatch({
          type: 'Netcall_Set_GroupCall',
          payload: sysMsg
        })
        wx.navigateTo({
          url: `/partials/videoCallMeeting/videoCallMeeting?beCalling=true`,
        })
      }
      return;
    }
  }
  onSysMsgUnread(obj) {
    console.log(orderCounter++, ' onSysMsgUnread')
    console.log(obj)
  }
  onUpdateSysMsgUnread(obj) {
    console.log(orderCounter++, ' onUpdateSysMsgUnread')
    console.log(obj)
  }
  onOfflineCustomSysMsgs(sysMsg) {
    console.log(orderCounter++, ' onOfflineCustomSysMsgs')
    console.log(sysMsg)
  }
  // 收到广播消息
  onBroadcastMsg(msg) {
    console.log('onBroadcastMsg: ', msg)
  }
  onBroadcastMsgs(msg) {
    console.log('onBroadcastMsgs: ', msg)
  }
  /**
   * 断开重连
   */
  onWillReconnect() {
    console.log(' onWillReconnect')
    showToast('text', '重连中，请稍后！', { duration: 3000 })
  }
}

// 初始化的时候回返回一条数据，里面还有所有的未读数，未读数初始化状态不对，后面收到新的后就正确了
// 好友被删除后，再次推送过来的消息如有此人消息会报错，原因recentChat页是获取数据时是从好友列表中拿的
