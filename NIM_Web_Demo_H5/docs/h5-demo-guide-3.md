# WEB DEMO - alpha (HTML5-VUE版本) 源码导读 - 出神入化
## 概述
该部分主要向开发者介绍h5 demo的数据结构及数据驱动层，使得开发者可以依据[web sdk](http://dev.netease.im/docs/product/IM即时通讯/SDK开发集成/Web开发集成)，深度订制自己崭新的业务功能。如果开发者在阅读本章时有一些配置上的困难，可以回过头去阅读[登堂入市](./h5-demo-guide-2.md)

## vuex相关
本h5 demo的中央数据管理使用vuex，请优先阅读[vuex开始](http://vuex.vuejs.org/zh-cn/getting-started.html)。它并不复杂，仅仅是一个缓存中的数据仓库而已，可以通过他管理全局数据。

### state
Vuex使用单一状态树，即用一个对象就包含了全部的应用层级状态。每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
- 对应于h5 demo中 src/store/state.js

### mutation
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
- 对应于h5 demo中 src/store/mutations

### action
Action 类似于 mutation，不同在于：
- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。
- 对应于h5 demo中 src/store/actions

## SDK初始化
- 首先，开发者需要在src/configs中正确配置自己的appkey
- 每当在UI交互层，提交了this.$store.dispatch('connect')请求，在actions层即会尝试sdk连接。
  - 初始化聊天代码见：src/store/actions/initNimSDK.js
  - 初始化聊天室代码见：src/store/actions/initChatroomSDK.js
- 在SDK同步数据完成后，h5 demo会触发hideLoading事件，取消加载框，加载数据(vue会自动渲染数据)

## 缓存数据
src/store/state.js中封装各种需要使用的全局数据
``` javascript
  // 正在加载中
  isLoading: true,
  // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
  isRefresh: true,
  // 全屏显示的原图
  isFullscreenImgShow: false,
  fullscreenImgSrc: '',

  // IM相关
  // NIM SDK 实例
  nim: null,
  // 登录账户ID
  userUID: null,
  // 用户名片
  myInfo: {},
  // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
  userInfos: {},
  // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
  userSubscribes: {},

  // 好友列表
  friendslist: [],
  // 黑名单列表
  blacklist: [],
  // 禁言列表
  // mutelist: [],

  // teamlist: [],
  // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
  // teamAttrs: {},
  // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
  // teamMembers: {},

  // 消息列表
  msgs: {}, // 以sessionId作为key
  msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
  // 会话列表
  sessionlist: [],
  sessionMap: {},
  // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
  currSessionId: null,
  currSessionMsgs: [],
  // 是否有更多历史消息，用于上拉加载更多
  noMoreHistoryMsgs: false,

  // 系统消息
  sysMsgs: [],
  customSysMsgs: [],
  sysMsgUnread: {
    total: 0
  },
  customSysMsgUnread: 0,

  // 临时变量
  // 缓存需要获取的用户信息账号,如searchUser
  searchedUsers: [],
  // 缓存需要获取的群组账号
  searchedTeams: [],

  // 聊天室相关
  // 聊天室sdk实例
  chatroomInsts: {},
  chatroomInfos: {},
  // 聊天室分房间消息集合
  chatroomMsgs: {},
  // 当前聊天室实例及id
  currChatroom: null,
  currChatroomId: null,
  currChatroomMsgs: [],
  currChatroomInfo: {},
  // 聊天室成员列表
  currChatroomMembers: []
```

## 组件层常用事件申请
``` javascript
  /* 导出actions方法 */
  import {showLoading, hideLoading, showFullscreenImg, hideFullscreenImg} from './widgetUi'
  import {initNimSDK} from './initNimSDK'
  import {initChatroomSDK, resetChatroomSDK} from './initChatroomSDK'
  import {updateBlack} from './blacks'
  import {updateFriend, addFriend, deleteFriend} from './friends'
  import {resetSearchResult, searchUsers} from './search'
  import {deleteSession, setCurrSession, resetCurrSession} from './session'
  import {sendMsg, sendFileMsg, sendMsgReceipt, revocateMsg, getHistoryMsgs, resetNoMoreHistoryMsgs} from './msgs'
  import {markSysMsgRead, resetSysMsgs, markCustomSysMsgRead} from './sysMsgs'
  import {sendChatroomMsg, sendChatroomFileMsg, getChatroomHistoryMsgs} from './chatroomMsgs'
  import {initChatroomInfos, getChatroomInfo, getChatroomMembers, clearChatroomMembers} from './chatroomInfos'
```