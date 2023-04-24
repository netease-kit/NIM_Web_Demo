<template>
  <div class="p-room-chat-online">
    <group class="u-list">
      <cell
        v-for="(member, index) in chatroomMembers"
        class="u-list-item"
        :title="member.nick || member.account"
        :key="member.account"
        :inline-desc="member.showType">
        <img class="icon" slot="icon" width="24" :src="member.avatar">
      </cell>
    </group>
  </div>
</template>

<script>
import config from '../configs'

export default {
  mounted () {
    this.$store.dispatch('getChatroomMembers')
  },
  destroyed () {
    this.$store.dispatch('clearChatroomMembers')
  },
  computed: {
    chatroomMembers () {
      return this.$store.state.currChatroomMembers.map(member => {
        if (!member.avatar) {
          member.avatar = config.defaultUserIcon
        } else if (!/\?imageView/.test(member.avatar)) {
          member.avatar += '?imageView&thumbnail=40x40&quality=85'
        }
        switch (member.type) {
          case 'owner':
            member.showType = '群主'
            break
          case 'manager':
            member.showType = '管理员'
            break
          case 'common':
          case 'normal':
            member.showType = '普通成员'
            break
          case 'restricted':
            member.showType = '受限制'
            break
          case 'guest':
            member.showType = '游客'
            break
        }
        return member
      })
    }
  }
}
</script>

<style type="text/css">
  .p-room-chat-online {
    position: relative;
    display: block;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
</style>