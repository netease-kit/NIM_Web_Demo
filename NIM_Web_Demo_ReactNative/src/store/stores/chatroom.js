import { observable } from 'mobx';

class Stores {
  @observable chatroomId = ''
  @observable chatroomInfos = {}
  // 聊天室分房间消息集合
  @observable chatroomMsgs = {}
  // 当前聊天室实例及id
  @observable currChatroom = null
  @observable currChatroomId = null
  @observable currChatroomMsgs = []
  @observable currChatroomInfo = {}
  // 聊天室成员列表
  @observable currChatroomMembers = []
}

export default new Stores();
