const INITIAL_STATE = {
  isLogin: false, // 是否正在登陆
  isRegister: false, // 是否正在注册
  userInfo: {}, // 登录用户信息
  currentChatTo: '', // 正在聊天 sessionId
  friendCard: {}, //好友列表，含名片信息，额外添加在线信息
  onlineList: {}, // 在线好友列表
  // messageListToRender: {},
  currentGroup: {},
  currentGroupMembers: [],
  groupList: {}, // 群列表
  groupMemberList: {}, // 群成员列表
  groupMemberMap: {}, // 群成员列表
  personList: {}, // 所有有信息的人的列表
  unreadInfo: {}, // 未读信息，包含已、未订阅的账户数
  rawMessageList: {}, // 所有的聊天列表都在里面
  notificationList: { system: [], custom: [] }, // 系统通知，分为自定义消息和系统消息
  netcallEvent: {type: '', payload: null}, // 音视频事件载荷
  netcallCallList: [], // 多人通话呼叫列表
  netcallGroupCallInfo: {} // 群组音视频被叫时通知信息
}

export {INITIAL_STATE}

/**
 * 登录用户个人信息
 * userInfo: {account, avatar, birth, createTime, email, gender, nick, sign, tel, updateTime}
 * friendCard: { account: {account,nick,avatar,sign,gender:'male/female/unknown',tel,updateTime,createTime, isBlack, status} }
 * onlineList: {account: status}
 * groupList: {teamId:{avatar,beInviteMode,createTime,inviteMode,joinMode,level,memberNum,memberUpdateTime,mute,muteType,name,owner,teamId,type,updateCustomMode,updateTeamMode,updateTime,valid,validToCurrentUser}}
 * groupMemberList: {teamId: [{teamId,account,type,nickInTeam,active,joinTime,updateTime}]}
 * messageListToRender: {account: {unixtime1: {from,to,type,scene,text,sendOrReceive,displayTimeHeader,time}, unixtime2: {}}}
 * rawMessageList: {sessionId: {unixtime1: {flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}, unixtime2: {}}}
 * unreadInfo: {sessionId: unread}
 * notificationList: {system: [{desc:'',msg:{category,from,idServer,read,state,status,time,to,type}}], custom: []}
 * netcallCallList: [{account,nick,avatar}]
 * netcallGroupCallInfo: {id,members:['account'],teamName,type}
 */
