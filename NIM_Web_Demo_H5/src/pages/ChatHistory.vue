<template>
  <div class="g-inherit m-article p-chat-history">
    <x-header class="m-tab" :left-options="leftBtnOptions" @on-click-back = "onClickBack">
      <h1 class="m-tab-top">{{sessionName}}</h1>
      <a slot="left"></a>
      <!-- <group class="m-tab-right" slot="right">
        <datetime v-model="selectedDate" format="YYYY-MM-DD HH:mm" @on-change="selectDate" title="">历史日期</datetime>
      </group> -->
    </x-header>
    <div class="m-chat-main">
      <chat-list
        ref="chatlist"
        type="session"
        :canLoadMore="canLoadMore"
        :msglist="msglist"
        :userInfos="userInfos"
        :myInfo="myInfo"
        :isHistory='true'
        v-touch:swipedown="loadMore"
      ></chat-list>
    </div>
  </div>
</template>

<script>
import ChatList from './components/ChatList'
import util from '../utils'
import pageUtil from '../utils/page'

export default {
  beforeMount () {
    // 如果是刷新页面，重定向至聊天页面
    if (this.$store.state.isRefresh) {
      location.href = `#/chat/${this.sessionId}`
    }
  },
  mounted () {
    this.$store.dispatch('resetNoMoreHistoryMsgs')
    this.getHistoryMsgs()
  },
  updated () {
    let tempPagePos = pageUtil.getChatListHeight()
    pageUtil.scrollChatListDown(tempPagePos - this.currPagePos)
    this.currPagePos = tempPagePos
  },
  components: {
    ChatList
  },
  data () {
    return {
      leftBtnOptions: {
        backText: ' ',
        preventGoBack: true,
      },
      currPagePos: 0,
      // selectedDate: ''
    }
  },
  computed: {
    sessionId () {
      return this.$route.params.sessionId
    },
    sessionName () {
      let sessionId = this.sessionId
      let user = null
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '')
        if (user === this.$store.state.userUID) {
          return '我的手机'
        } else if (this.isRobot) {
          return this.robotInfos[user].nick || user
        } else {
          let userInfo = this.userInfos[user] || {}
          return util.getFriendAlias(userInfo)
        }
      } else if (/^team-/.test(sessionId)) {
        return '历史记录'
      }
    },
    // 判断是否是机器人
    isRobot () {
      let sessionId = this.sessionId
      let user = null
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '')
        if (this.robotInfos[user]) {
          return true
        }
      }
      return false
    },
    myInfo () {
      return this.$store.state.myInfo
    },
    userInfos () {
      return this.$store.state.userInfos
    },
    msglist () {
      let msgs = this.$store.state.currSessionMsgs
      return msgs
    },
    robotInfos () {
      return this.$store.state.robotInfos
    },
    scene () {
      return util.parseSession(this.sessionId).scene
    },
    to () {
      return util.parseSession(this.sessionId).to
    },
    canLoadMore () {
      return !this.$store.state.noMoreHistoryMsgs
    }
  },
  methods: {
    getHistoryMsgs () {
      if (this.canLoadMore) {
        this.$store.dispatch('getHistoryMsgs', {
          scene: this.scene,
          to: this.to
        })
      }
    },
    loadMore () {
      if (pageUtil.getChatListScroll() <= 5) {
        this.getHistoryMsgs()
      }
    },
    onClickBack: function () {
      // location.href = `#/chat/${this.sessionId}`
      window.history.go(-1)
    }
  }
}
</script>

<style scoped>
  .p-chat-history {
    .m-chat-main {
      padding: 0;
    }
  }
</style>
