import { observable, action } from 'mobx';

class Stores {
  @observable imLastMsg = '';
  @observable imSendMsg = '';
  // 登录账户ID
  @observable userID = null
  // 用户名片
  @observable myInfo = null
  // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
  @observable userInfos = null
  // 是否为好友等相关信息
  @observable friendFlags = null
  // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
  @observable userSubscribes = null
  // 好友列表
  @observable friendslist = null
  // 机器人列表
  @observable robotslist = null
  // 用于判定帐号是否是robots
  @observable robotInfos = null
  @observable robotInfosByNick = null
  // 黑名单列表
  @observable blacklist = null
  // 禁音列表
  @observable mutelist = null

  @observable teamlist = null
  // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
  @observable teamAttrs = null
  // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
  @observable teamMembers = null
  // 关闭群提醒的群id列表
  @observable muteTeamIds = null
  // 群设置传递数据
  @observable teamSettingConfig = null

  // 已发送群消息回执Map,key为群Id
  @observable sentReceipedMap = null
  // 当前群消息回执查询的群id
  @observable currReceiptQueryTeamId = null
  // 群消息回执查询的消息列表
  @observable receiptQueryList = null
  // 群消息回执查询结果列表
  @observable teamMsgReads = null
  // 群消息已读未读账号列表
  @observable teamMsgReadsDetail = null

  // 消息列表
  @observable msgs = null // 以sessionId作为ke
  @observable msgsMap = null // 以idClient作为key，诸如消息撤回等的消息查
  // 会话列表
  @observable sessionlist = null
  @observable sessionMap = null
  // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
  @observable currentSessionId = null
  @observable currentSessionMsgs = null
  // 是否有更多历史消息，用于上拉加载更多
  @observable noMoreHistoryMsgs = null
  // 继续对话的机器人id
  @observable continueRobotAccid = null

  // 系统消息
  @observable sysMsgs = null
  @observable customSysMsgs = null
  @observable sysMsgUnread = null
  @observable customSysMsgUnread = null

  // 临时变量
  // 缓存需要获取的用户信息账号,如searchUser
  @observable searchedUsers = null
  // 缓存需要获取的群组账号
  @observable searchedTeams = null

  @action
  reset = () => {
    this.userID = null;
    this.myInfo = {};
    this.userInfos = {};
    // this.friendFlags = {};
    this.friendFlags = new Map();
    this.userSubscribes = {};
    this.friendslist = [];
    this.robotslist = [];
    this.robotInfos = {};
    this.robotInfosByNick = {};
    this.blacklist = [];
    this.mutelist = [];

    this.teamlist = [];
    this.teamAttrs = {};
    this.teamMembers = {};
    this.muteTeamIds = [];
    this.teamSettingConfig = {};
    this.sentReceipedMap = {};
    this.currReceiptQueryTeamId = null;
    this.receiptQueryList = [];
    this.teamMsgReads = [];
    this.teamMsgReadsDetail = {
      readAccounts: [],
      unreadAccounts: [],
    };

    this.msgsMap = {};
    this.sessionlist = [];
    this.sessionMap = {};
    this.currentSessionId = null;
    this.currentSessionMsgs = [];
    this.noMoreHistoryMsgs = false;
    this.continueRobotAccid = '';

    this.sysMsgs = [];
    this.customSysMsgs = [];
    this.sysMsgUnread = {
      total: 0,
    };
    this.customSysMsgUnread = 0;

    this.searchedUsers = [];
    // 缓存需要获取的群组账号
    this.searchedTeams = [];
  }
}

const st = new Stores();
st.reset();

export default st;
