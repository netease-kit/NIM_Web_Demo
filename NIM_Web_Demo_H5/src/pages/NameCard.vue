<template>
  <div class="g-inherit m-article p-namecard">
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">{{userInfo.alias}}</h1>
      <a slot="left"></a>
    </x-header>
    <div v-if="isRobot" class="m-list m-robot">
      <div class="u-logo">
        <img class="logo" :src="userInfo.avatar">
        <h3>{{userInfo.alias}}</h3>
        <p>@{{userInfo.account}}</p>
      </div>
      <div class="u-desc">
        <p>{{userInfo.intro}}</p>
      </div>
      <div class="u-bottom">
        <x-button type="primary" action-type="button" @click.native="enterChat">开始对话</x-button>
      </div>
    </div>
    <div v-else class="m-list">
      <group class="u-card">
        <cell :title="userInfo.account" :inline-desc="'昵称: '+userInfo.nick" :value="userInfo.gender=='不显示'?'':userInfo.gender">
          <img class="icon" slot="icon" width="20" :src="userInfo.avatar">
        </cell>
      </group>
      <group class="u-card">
        <cell title="性别">{{userInfo.gender}}</cell>
        <cell title="生日">{{userInfo.birth}}</cell>
        <cell title="手机">{{userInfo.tel}}</cell>
        <cell title="邮箱">{{userInfo.email}}</cell>
        <cell title="签名">{{userInfo.sign}}</cell>
      </group>
      <group v-show="isFriend" class="u-card">
        <cell title="备注名" is-link :link="remarkLink">{{userInfo._alias}}</cell>
      </group>
      <group v-if='!isSelf' class="u-card">
        <x-switch class="u-switch" title="黑名单" v-model="isBlack" @on-change="changeBlack"></x-switch>
      </group>
      <div class="u-bottom">
        <x-button type="primary" action-type="button" @click.native="enterChat">聊天</x-button>
        <x-button v-show="isFriend" type="primary" action-type="button" @click.native="enterHistory">历史记录</x-button>
        <x-button v-show="isFriend" type="warn" action-type="button" @click.native="deleteFriend">删除好友</x-button>
        <x-button v-show="!isFriend && !isSelf" type="warn" action-type="button" @click.native="addFriend">添加好友</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../utils'

export default {
  data () {
    return {
      isBlack: false,
      isSelf: false
    }
  },
  computed: {
    account () {
      return this.$route.params.userId
    },
    userInfo () {
      let info = {}
      if (this.isRobot) {
        info = Object.assign({}, this.robotInfos[this.account])
        info.alias = info.nick || account
        info.avatar = info.originAvatar || item.avatar
      } else if (this.account === this.$store.state.userUID) {
        info =  Object.assign({}, this.$store.state.myInfo)
        info.alias = info.nick
        this.isSelf = true
      } else {
        info = Object.assign({}, this.$store.state.userInfos[this.account])
        info._alias = info.alias //服务器中存的别名，在备注栏展示
        info.alias = util.getFriendAlias(info)
        this.isBlack = info.isBlack
      }
      return info
    },
    robotInfos () {
      return this.$store.state.robotInfos
    },
    // 是否是联系人，黑名单和好友都算
    isFriend () {
      let userInfo = this.userInfo
      return userInfo.isFriend
    },
    isRobot () {
      if (this.robotInfos[this.account]) {
        return true
      }
      return false
    },
    remarkLink () {
      return `/namecardremark/${this.account}`
    }
  },
  methods: {
    changeBlack () {
      this.$store.dispatch('updateBlack', {
        account: this.account,
        isBlack: this.isBlack
      })
    },
    enterChat () {
      location.href = `#/chat/p2p-${this.account}`
    },
    enterHistory () {
      location.href = `#/chatHistory/p2p-${this.account}`
    },
    addFriend () {
      this.$store.dispatch('addFriend', this.account)
    },
    deleteFriend () {
      let that = this
      this.$vux.confirm.show({
        title: '删除好友后，将同时解除双方的好友关系',
        onConfirm () {
          that.$store.dispatch('deleteFriend', that.account)
        }
      })
    }
  }
}
</script>

<style type="text/css">
  .p-namecard {
    .m-list {
      padding-top: 3.6rem;
    }
    .u-bottom {
      margin-bottom: 2rem;
    }
  }

</style>
