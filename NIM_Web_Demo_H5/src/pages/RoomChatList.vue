<template>
  <div class="m-chat-main p-room-chat-list">
    <chat-list
      type="chatroom"
      :chatroomId="chatroomId"
      :msglist="msglist"
      @msgs-loaded="msgsLoaded"
    ></chat-list>
    <chat-editor
      type="chatroom"
      :chatroomId="chatroomId"
    ></chat-editor>
  </div>
</template>

<script>

import ChatEditor from './components/ChatEditor'
import ChatList from './components/ChatList'
import util from '../utils'
import pageUtil from '../utils/page'

export default {
  components: {
    ChatEditor,
    ChatList
  },
  // 进入该页面，文档被挂载
  mounted () {
    // 此时设置当前会话
    pageUtil.scrollChatListDown()
  },
  updated () {
    pageUtil.scrollChatListDown()
  },
  data () {
    return {
    }
  },
  computed: {
    chatroomId () {
      let chatroomId = this.$route.params.chatroomId
      return chatroomId
    },
    msglist () {
      let msgs = this.$store.state.currChatroomMsgs
      return msgs
    }
  },
  methods: {
    msgsLoaded () {
      pageUtil.scrollChatListDown()
    }
  }
}
</script>

<style scoped>
  .p-room-chat-list {
    .m-chat-editor-main {
      .u-editor-input {
        padding-right: 8rem;
      }
      .u-editor-icons {
        width: 8rem;
      }
    }
    .u-msg {
      .msg-text {
        max-width: 80%;
      }
      .msg-link {
        bottom: 0;
        right: -4rem;
        font-size: 0.9rem;
      }
    }
  }
</style>
