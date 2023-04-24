import {INITIAL_STATE} from './store.js'
import dealGroupMsg from '../utils/dealGroupMsg.js'
let app = getApp()
let indexReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // IM：收到个人信息
    case 'IM_OnMyInfo':{
      return Object.assign({}, state, {
        userInfo: action.payload
      })
    }
    // Login：开始登陆，转菊花
    case 'Login_StartLogin':{
      return Object.assign({}, state, {
        isLogin: true
      })
    }
    // Login：登陆成功，停止转菊花
    case 'Login_LoginSuccess':{
      return Object.assign({}, state, {
        isLogin: false
      })
    }
    // Register：开始注册，转菊花
    case 'Register_StartRegister': {
      return Object.assign({}, state, {
        isRegister: true
      })
    }
    // Register：注册成功，停止转菊花
    case 'Register_RegisterSuccess': {
      return Object.assign({}, state, {
        isRegister: false
      })
    }
    // UserInfo：个人更新头像
    case 'UserInfo_Update_Avatar': {
      let temp = Object.assign({}, state)
      temp.userInfo['avatar'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新昵称
    case 'UserInfo_Update_Nick': {
      let temp = Object.assign({}, state)
      temp.userInfo['nick'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新性别
    case 'UserInfo_Update_Gender': {
      let temp = Object.assign({}, state)
      temp.userInfo['gender'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新生日
    case 'UserInfo_Update_Birthday': {
      let temp = Object.assign({}, state)
      temp.userInfo['birth'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新电话
    case 'UserInfo_Update_Tel': {
      let temp = Object.assign({}, state)
      temp.userInfo['tel'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新邮箱
    case 'UserInfo_Update_Email': {
      let temp = Object.assign({}, state)
      temp.userInfo['email'] = action.payload
      return Object.assign({}, state, temp)
    }
    // UserInfo：个人更新签名
    case 'UserInfo_Update_Sign': {
      let temp = Object.assign({}, state)
      temp.userInfo['sign'] = action.payload
      return Object.assign({}, state, temp)
    }
    // CurrentChatTo：登录用户的聊天对象改变
    case 'CurrentChatTo_Change': {
      let temp = Object.assign({}, state)
      temp['currentChatTo'] = action.payload
      return Object.assign({}, state, temp)
    }
    // FriendCard：登录初始化获取后更新
    case 'FriendCard_Update_Initial': { // 初始化好友卡片
      let friends = action.payload
      let temp = Object.assign({}, state)
      friends.map(friend => {
        // 设置默认好友登录状态
        if (!temp.friendCard[friend.account]) {
          friend.status = '离线'
        } else if (!temp.friendCard[friend.account].status) {
          friend.status = '离线'
        }
        friend.isFriend = true // 好友标记位
        // blackList数据在friend之前，需要合并之前的数据
        temp.friendCard[friend.account] = Object.assign({}, friend, temp.friendCard[friend.account])
        temp.personList[friend.account] = temp.friendCard[friend.account]
      })
      return Object.assign({}, state, temp)
    }
    // FriendCard：更新指定好友名片信息，携带名片数据
    case 'FriendCard_Update_InfoCard': {
      let tempState = Object.assign({}, state)
      let card = action.payload
      // 触发状态更新时friendCard可能为空
      if (!tempState.friendCard[card.account]) {
        tempState.friendCard[card.account] = {}
      }
      tempState.friendCard[card.account] = Object.assign({}, tempState.friendCard[card.account], card)
      return Object.assign({}, state, tempState)
    }
    // FriendCard：更新非好友名片信息(搜索时存进来)，携带名片数据
    case 'FriendCard_Update_NonFriendInfoCard': {
      let tempState = Object.assign({}, state)
      let card = action.payload
      // 触发状态更新时friendCard可能为空
      if (!tempState.friendCard[card.account]) {
        tempState.friendCard[card.account] = {}
      }
      card.isFriend = false
      tempState.friendCard[card.account] = Object.assign({}, tempState.friendCard[card.account], card)
      tempState.personList[card.account] = Object.assign({}, tempState.personList[card.account], card)
      return Object.assign({}, state, tempState)
    }
    // FriendCard：更新指定好友在线状态
    case 'FriendCard_Update_Online_Status': {
      let tempState = Object.assign({}, state)
      let statusArr = action.payload
      statusArr.map(item => {
        // 触发状态更新时friendCard可能为空
        if (!tempState.friendCard[item.account]) {
          tempState.friendCard[item.account] = {}
        }
        tempState.friendCard[item.account].status = item.status
        tempState.onlineList[item.account] = item.status
      })
      return Object.assign({}, state, tempState)
    }
    // FriendCard：删除好友，依据account
    case 'FriendCard_Delete_By_Account': {
      let tempState = Object.assign({}, state)
      let account = action.payload
      delete tempState.friendCard[account]
      // todo 暂时先不删除，暂存删除好友前的在线状态
      // if (tempState.onlineList[account]) {
      //   delete tempState.onlineList[account]
      // }
      return Object.assign({}, state, tempState)
    }
    // FriendCard：添加好友
    case 'FriendCard_Add_Friend': {
      let tempState = Object.assign({}, state)
      let card = action.payload
      card.isFriend = true // 标记好友
      card.status = '离线' // 默认状态是离线
      tempState.friendCard = Object.assign({}, tempState.friendCard)
      tempState.friendCard[card.account] = Object.assign({}, tempState.friendCard[card.account], card)
      return Object.assign({}, state, tempState)
    }
    // Blacklist：登录成功后获取的初始化黑名单
    case 'Blacklist_Update_Initial': {
      // 发送来了黑名单就在好友名片信息中添加标志位
      let tempState = Object.assign({}, state)
      let blacklist = action.payload // [{account}, invalid: []]
      blacklist.map(item => {
        // 触发黑名单时friendCard为空
        if (item.account) {
          if (!tempState.friendCard[item.account]) {
            tempState.friendCard[item.account] = {}
            tempState.friendCard[item.account].isFriend = false //没有任何用户信息，非好友状态下拉黑
          }
          tempState.friendCard[item.account].isBlack = true
        }
      })
      return Object.assign({}, state, tempState)
    }
    // Blacklist：拉黑或取消拉黑
    case 'Blacklist_Update_MarkInBlacklist': {
      let tempState = Object.assign({}, state)
      let blackUser = action.payload // {account, isBlack, addTime}
      tempState.friendCard = Object.assign({}, tempState.friendCard)
      if (!tempState.friendCard[blackUser.account]) {
        tempState.friendCard[blackUser.account] = {}
      }
      tempState.friendCard[blackUser.account].isBlack = blackUser.isBlack
      tempState.friendCard[blackUser.account].addTime = blackUser.addTime
      return Object.assign({}, state, tempState)
    }
    // RawMessageList：存储原始消息
    case 'RawMessageList_Add_Msg': {
      /*
        attach:{type: "acceptTeamInvite", team: {…}, account: "twilbeter3", users: Array(2), members: Array(1)}
        cc:true
        flow:"out"
        from:"twilbeter"
        fromClientType:"Web"
        fromNick:""
        idClient:"c86b07d8-c98f-4186-94a4-68c2db010ae2"
        idServer:"93284035043786753"
        isHistoryable:true
        isLocal:false
        isOfflinable:true
        isPushable:true
        isReplyMsg:true
        isRoamingable:true
        isSyncable:true
        isUnreadable:true
        needMsgReceipt:false
        needPushNick:false
        scene:"team"
        sessionId:"team-1390040443"
        status:"success"
        target:"1390040443"
        text:""
        time:1536914522419
        to:"1390040443"
        type:"notification"
      */
      let tempState = Object.assign({}, state)
      let { msg, nim } = action.payload
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      // 自己的退群消息就不记录、展示了
      if (msg && msg.type === 'notification') { // 群通知消息  && msg.scene === 'team'
        if ((msg.attach.type === 'leaveTeam' || msg.attach.type ===  'dismissTeam') && msg.from === tempState.userInfo.account) {
          return tempState
        }
        dealGroupMsg.dealMsg(msg, tempState, tempState.userInfo.account)
      }
      let sessionId = msg.sessionId
      if (!tempState.rawMessageList[sessionId]) {
        tempState.rawMessageList[sessionId] = {}
      }
      tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg)
      if (tempState.currentChatTo === msg.sessionId && nim) { // 当前会话
        nim.resetSessionUnread(msg.sessionId)
      }
      return Object.assign({}, state, tempState)
    }
    // RawMessageList：存储漫游消息
    case 'RawMessageList_Add_RoamingMsgList': {
      let tempState = Object.assign({}, state)
      let msgList = action.payload.msgs
      let sessionId = action.payload.sessionId
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      msgList.map(msg => {
        if (!tempState.rawMessageList[sessionId]) {
          tempState.rawMessageList[sessionId] = {}
        }
        if (msg.type === 'notification') { // 群通知消息  && msg.scene === 'team'
          dealGroupMsg.dealMsg(msg, null, tempState.userInfo.account)
        }
        tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg)
      })
      console.log('rawMessageList', tempState.rawMessageList)
      return Object.assign({}, state, tempState)
    }
    // OfflineMessageList：存储离线消息
    case 'RawMessageList_Add_OfflineMessage': {
      let tempState = Object.assign({}, state)
      let msg = action.payload
      let sessionId = msg.sessionId
      if (!tempState.rawMessageList[sessionId]) {
        tempState.rawMessageList[sessionId] = {}
      }
      msg.msgs.map((item) => {
        tempState.rawMessageList[sessionId][item.time] = Object.assign({}, item)
      })
      return Object.assign({}, state, tempState)
    }
    // RawMessageList：替换其中的指定消息
    case 'RawMessageList_Replace_Message': {
      let tempState = Object.assign({}, state)
      let msg = action.payload
      let sessionId = msg.sessionId
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg)
      return Object.assign({}, state, tempState)
    }
    // RawMessageList：自己撤回消息
    case 'RawMessageList_Recall_Msg': {
      let tempState = Object.assign({}, state)
      let msg = action.payload
      let sessionId = msg.sessionId
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      // 替换原始文件消息，使得页面展示撤回消息提示
      tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg, {
        tip: '你撤回了一条消息',
        type: 'tip'
      })
      return Object.assign({}, state, tempState)
    }
    // RawMessageList：对端撤回消息
    case 'RawMessageList_OppositeRecall_Msg': {
      let tempState = Object.assign({}, state)
      let deleteInfo = action.payload
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      let sessionId = deleteInfo.msg.sessionId
      let msgSendTime = deleteInfo.deletedMsgTime // 撤回的消息的发送时间
      let deletedMsg = tempState.rawMessageList[sessionId][msgSendTime] // 之前发送的老消息
      tempState.rawMessageList[sessionId][deleteInfo.time] = Object.assign({}, deletedMsg, {
        type: 'tip',
        tip: `${deleteInfo.deletedMsgFromNick}撤回了一条消息`,
        time: deleteInfo.time
      }) // 修改删除的消息主体内容后存储到全局
      delete tempState.rawMessageList[sessionId][deleteInfo.deletedMsgTime] // 删除老的消息
      return Object.assign({}, state, tempState)
    }
    // Notification：对端将你添加为好友
    case 'Notification_Opposite_AddFriend': {
      let tempState = Object.assign({}, state)
      let payload = action.payload
      payload.type = 'p2p'
      tempState.notificationList.system.push(payload)
      return Object.assign({}, state, tempState)
    }
    // Notification：对端将你从好友列表中删除
    case 'Notification_Opposite_DeleteFriend': {
      let tempState = Object.assign({}, state)
      let payload = action.payload
      payload.type = 'p2p'
      tempState.notificationList.system.push(payload)
      return Object.assign({}, state, tempState)
    }
    // Notification：收到入群邀请
    case 'Notification_Team_Invite': {
      let tempState = Object.assign({}, state)
      let payload = action.payload
      payload.type = 'team'
      payload.teamAction = 'invite'
      payload.idServer = payload.msg.idServer
      payload.teamId = payload.msg.attach.team.teamId
      payload.from = payload.msg.from
      tempState.notificationList.system.push(payload)
      return Object.assign({}, state, tempState)
    }
    // Notification：收到入群申请
    case 'Notification_Team_Apply': {
      let tempState = Object.assign({}, state)
      let payload = action.payload
      payload.type = 'team'
      payload.teamAction = 'apply'
      payload.idServer = payload.msg.idServer
      payload.teamId = payload.msg.to
      payload.from = payload.msg.from
      payload.desc += '“' + (tempState.groupList[payload.teamId] && tempState.groupList[payload.teamId].name) + '”'
      tempState.notificationList.system.push(payload)
      return Object.assign({}, state, tempState)
    }
    // Notification：入群邀请反馈信息
    case 'Update_Sys_Msg': {
      let tempState = Object.assign({}, state)
      let payload = action.payload
      let array = tempState.notificationList.system
      for (let i = 0; i < array.length; i++) {
        if (array[i].idServer === payload.idServer) {
          array[i].state = payload.state === 'rejected' ? '已拒绝' : (payload.state === 'passed' ? '已接受' : '')
          return Object.assign({}, state, tempState)
        }
      }
    }
    // Notification：对端将你从好友列表中删除
    case 'Notification_Team_Del': {
      // let tempState = Object.assign({}, state)
      // let payload = action.payload
      // tempState.notificationList.system.push(payload)
      // return Object.assign({}, state, tempState)
    }
    // Notification：清除指定条目的系统消息通知
    case 'Notification_Delete_Specified_System_By_Index': {
      let tempState = Object.assign({}, state)
      let index = action.payload
      tempState.notificationList.system.splice(index, 1)
      return Object.assign({}, state, tempState)
    }
    // Notification：清除指定条目的系统消息通知
    case 'Notification_Delete_Specified_Custom_By_Index': {
      let tempState = Object.assign({}, state)
      let index = action.payload
      tempState.notificationList.custom.splice(index, 1)
      return Object.assign({}, state, tempState)
    }
    // Notification：清除系统消息通知
    case 'Notification_Clear_System': {
      let tempState = Object.assign({}, state)
      tempState.notificationList.system = []
      return Object.assign({}, state, tempState)
    }
    // Notification：清除自定义消息通知
    case 'Notification_Clear_Custom': {
      let tempState = Object.assign({}, state)
      tempState.notificationList.custom = []
      return Object.assign({}, state, tempState)
    }
    // Notification：清除系统消息通知、自定义消息通知
    case 'Notification_Clear_All': {
      let tempState = Object.assign({}, state)
      tempState.notificationList = { system: [], custom: [] }
      return Object.assign({}, state, tempState)
    }
    // UnreadInfo：更新未读数
    case 'UnreadInfo_update': {
      let tempState = Object.assign({}, state)
      let updateSession = action.payload
      tempState.unreadInfo[updateSession.id] = updateSession.unread
      return Object.assign({}, state, tempState)
    }
    // UnreadInfo：更新群未读数
    case 'SessionUnreadInfo_update': {
      let tempState = Object.assign({}, state)
      let sessions = action.payload
      sessions.map(item => {
        if (item.unread) {
          tempState.unreadInfo[item.id] = item.unread
        }
      })
      return Object.assign({}, state, tempState)
    }
    // Delete：清除与指定人的所有聊天记录
    case 'Delete_All_MessageByAccount': {
      let tempState = Object.assign({}, state)
      let sessionId = action.payload
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      if (tempState.rawMessageList[sessionId]) {
        delete tempState.rawMessageList[sessionId]
      }
      return Object.assign({}, state, tempState)
    }
    // Delete：删除指定人的指定时间的聊天记录
    case 'Delete_Single_MessageByAccount': {
      let tempState = Object.assign({}, state)
      let accountAndTime = action.payload
      tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      if (tempState.rawMessageList[accountAndTime.sessionId]) {
        delete tempState.rawMessageList[accountAndTime.sessionId][accountAndTime.time]
      }
      return Object.assign({}, state, tempState)
    }
    // Reset：恢复出厂设置
    case 'Reset_All_State': {
      let tempState = Object.assign({}, state)
      let keysArr = Object.keys(tempState)
      keysArr.map(item => {
        if (Array.isArray(tempState[item])) {
          tempState[item] = []
        } else if (typeof tempState[item] === 'object') {
          tempState[item] = {}
        } else if (typeof tempState[item] === 'boolean') {
          tempState[item] = false
        } else if (typeof tempState[item] === 'string') {
          tempState[item]  = ''
        }
      })
      tempState.notificationList = { system: [], custom: [] }
      return Object.assign({}, state, tempState)
    }
    // 设置当前群
    case 'Set_Current_Group': {
      let tempState = Object.assign({}, state)
      tempState.currentGroup = tempState.groupList[action.payload] || {}
      return Object.assign({}, state, tempState)
    }
    // 设置当前群/成员
    case 'Set_Current_Group_And_Members': {
      let tempState = Object.assign({}, state)
      tempState.currentGroup = tempState.groupList[action.payload] || {}
      tempState.currentGroupMembers = tempState.groupMemberList[action.payload] || []
      return Object.assign({}, state, tempState)
    }
    // 初始化群组 ， onTeam 回调的所有群
    case 'Init_Groups': {
      let tempState = Object.assign({}, state)
      let teams = action.payload
      let groupList = {}
      Object.keys(teams).map(item => { // 初始化 list、构造群 map
        if (item === 'invalid') {
          return
        }
        let teamId = teams[item].teamId
        teams[item].isCurrentNotIn = false
        groupList[teamId] = teams[item]
      })
      tempState.groupList = groupList
      return Object.assign({}, state, tempState)
    }
    // 添加群
    case 'Add_Group': {
      let tempState = Object.assign({}, state)
      let team = action.payload
      if (!team.hasOwnProperty('isCurrentNotIn')) {
        team.isCurrentNotIn = false
      }
      tempState.groupList[team.teamId] = team
      return Object.assign({}, state, tempState)
    }
    // 更新群
    case 'Update_Group': {
      let tempState = Object.assign({}, state)
      let group = action.payload
      dealGroupMsg.onUpdateTeam(group, null, tempState, false)
      return Object.assign({}, state, tempState)
    }
    // 更新当前群和成员列表
    case 'Update_Group_And_Set_Current': {
      let tempState = Object.assign({}, state)
      let group = action.payload
      dealGroupMsg.onUpdateTeamAndCurrent(group, null, tempState, true)
      return Object.assign({}, state, tempState)
    }
    // 退出、删除群组；并且将存在的对应会话丢弃
    case 'Del_Group': {
      let tempState = Object.assign({}, state)
      let group = action.payload
      let sessionId = 'team-' + group.teamId
      // 更新群信息
      tempState.groupList[group.teamId] = Object.assign({}, tempState.groupList[group.teamId], { isCurrentNotIn: true })
      // 更新当前群信息
      if (tempState.currentGroup.teamId === group.teamId) {
        tempState.currentGroup = tempState.groupList[group.teamId]
      }
      // 删除会话
      if (tempState.rawMessageList[sessionId]) {
        delete tempState.rawMessageList[sessionId]
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
      }
      return Object.assign({}, state, tempState)
    }
    // 获取了某群组的所有成员、更新 groupList groupMemberList groupMemberMap currentGroup currentGroupMembers ；检验了当前用户是否在对应的群里，更新群 isCurrentNotIn 标志;
    case 'Get_Group_Members_And_Set_Current': {
      let tempState = Object.assign({}, state)
      let obj = action.payload
      console.log('取得了所有成员：' + obj.teamId, obj)
      dealGroupMsg.onAddTeamMembers(obj, null, tempState)
      return Object.assign({}, state, tempState)
    }
    // 添加群成员
    case 'Add_Group_Members': {
      let tempState = Object.assign({}, state)
      let obj = action.payload
      dealGroupMsg.onAddTeamMembers(obj, null, tempState)
      return Object.assign({}, state, tempState)
    }
    // 更新群成员/或者自己的群信息
    case 'Update_Group_Member': {
      let tempState = Object.assign({}, state)
      let teamMember = action.payload
      if (!tempState.groupMemberList[teamMember.teamId]) {
        return Object.assign({}, state, tempState)
      }
      if (!tempState.groupMemberMap[teamMember.teamId]) {
        tempState.groupMemberMap[teamMember.teamId] = {}
      }
      let list = tempState.groupMemberList[teamMember.teamId].slice()
      let listMap = tempState.groupMemberMap[teamMember.teamId]
      for (let i = 0, length = list.length; i < length; i++) {
        if (list[i].account === teamMember.account) {
          let newMember = Object.assign({}, list[i], teamMember)
          list.splice(i, 1, newMember)
          tempState.groupMemberList[teamMember.teamId] = list
          listMap[list[i].account] = newMember
          tempState.groupMemberMap = Object.assign({}, tempState.groupMemberMap)
          if (teamMember.teamId === tempState.currentGroup.teamId) { // 需要更新当前群
            tempState.currentGroupMembers = list // 更新成员列表
          }
          return Object.assign({}, state, tempState)
        }
      }
      return Object.assign({}, state, tempState)
    }
    // 删除群成员
    case 'Del_Group_Member': {
      let tempState = Object.assign({}, state)
      let obj = action.payload
      dealGroupMsg.onRemoveTeamMembers(obj, null, tempState)
      return Object.assign({}, state, tempState)
    }
    // 更新群管理员
    case 'Update_Group_Member_Manager': {
      let tempState = Object.assign({}, state)
      let { team, accounts, members } = action.payload
      let teamId = team.teamId
      if (!tempState.groupMemberList[teamId]) {
        return Object.assign({}, state, tempState)
      }
      let list = tempState.groupMemberList[teamId].slice()
      for (let i = 0, length = list.length; i < length; i++) {
        let index = accounts.indexOf(list[i].account)
        if (index !== -1) {
          Object.assign(list[i], members[index]) // 更新被更新成员的信息 groupMemberMap 会同时改变
        }
      }
      tempState.groupMemberList[teamId] = list
      if (tempState.currentGroup.teamId === teamId) {
        tempState.currentGroupMembers = list
      }
      return Object.assign({}, state, tempState)
    }
    // 更新群主
    case 'Update_Group_Owner': {
      let tempState = Object.assign({}, state)
      let { team } = action.payload
      dealGroupMsg.onUpdateTeam(team, null, tempState, false)
      return Object.assign({}, state, tempState)
    }
    // 获取到用户资料
    case 'Add_Person': {
      let tempState = Object.assign({}, state)
      let users = action.payload
      users.map(item => {
        tempState.personList[item.account] = Object.assign({}, tempState.personList[item.account], item)
      })
      tempState.personList = Object.assign({}, tempState.personList)
      return Object.assign({}, state, tempState)
    }
    // 多人通话呼叫列表
    case 'Netcall_Call_UserList': {
      let tempState = Object.assign({}, state)
      let userList = action.payload // [{account,nick,avatar}]
      tempState.netcallCallList = Object.assign([], userList)
      return Object.assign({}, state, tempState)
    }
    case 'Netcall_Call_Clear_UserList_Url': {
      let tempState = Object.assign({}, state)
      tempState.netcallCallList.map(user => {
        if (user.url) {
          user.url = ''
        }
      })
      return Object.assign({}, state, tempState)
    }
    // 收到自定义消息，群视频呼叫标记
    case 'Netcall_Set_GroupCall': {
      let tempState = Object.assign({}, state)
      let groupCall = action.payload // {apnsText,content:{id,members,teamId,room,type},from,to}
      tempState.netcallGroupCallInfo = Object.assign({}, groupCall)
      return Object.assign({}, state, tempState)
    }
    default:
      return state
  }
}

export default indexReducer
