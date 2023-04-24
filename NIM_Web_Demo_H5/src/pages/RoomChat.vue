<template>
  <div class="g-inherit m-room p-room-chat">
    <div class="m-room-album">
      <div class="img-wraper">
        <img class="room-img" :src="chatroomInfo.album">
      </div>
      <span class="left-arrow" @click="enterHall"></span>
    </div>
    <div class="m-room-tabs">
      <span class="u-tab" :class="{active:roomType===1}" @click="changeRoomType(1)">
        直播互动
      </span><span class="u-tab" :class="{active:roomType===2}" @click="changeRoomType(2)">
        主播
      </span><span class="u-tab" :class="{active:roomType===3}" @click="changeRoomType(3)">
        在线成员
      </span>
    </div>
    <div class="m-room-container">
      <div class="room-cnt">
        <room-chat-list v-if="roomType===1"></room-chat-list>
        <room-chat-actor v-if="roomType===2"></room-chat-actor>
        <room-chat-member v-if="roomType===3"></room-chat-member>
      </div>
    </div>
  </div>
</template>

<script>
import RoomChatList from './RoomChatList'
import RoomChatActor from './RoomChatActor'
import RoomChatMember from './RoomChatMember'

export default {
  beforeMount () {
    // 如果是刷新页面，重定向至聊天室列表页面
    if (this.$store.state.isRefresh) {
      location.href = `#/room`
    } else {
      this.$store.dispatch('connect', {
        type: 'chatroom',
        chatroomId: this.chatroomId
      })
    }
  },
  // 离开该页面，此时重置当前会话
  destroyed () {
    this.$store.dispatch('resetChatroomSDK', this.chatroomId)
  },
  components: {
    RoomChatList,
    RoomChatMember,
    RoomChatActor
  },
  data () {
    return {
      roomType: 1, // 1 直播互动， 2 主播， 3 在线成员
    }
  },
  computed: {
    chatroomId () {
      let chatroomId = this.$route.params.chatroomId
      return chatroomId
    },
    chatroomInfo () {
      return this.$store.state.chatroomInfos[this.chatroomId] || {}
    }
  },
  methods: {
    changeRoomType (roomType) {
      this.roomType = roomType
    },
    enterHall () {
      location.href = '#/room'
    }
  }
}
</script>

<style type="text/css">
  .p-room-chat {
    .left-arrow {
      position: absolute;
      display: block;
      top: 1rem;
      left: 1rem;
      width: 2rem;
      height: 2rem;
    }

  }
</style>