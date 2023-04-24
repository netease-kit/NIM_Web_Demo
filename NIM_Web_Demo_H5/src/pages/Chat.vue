<template>
  <div class="g-inherit m-article">
    <x-header class="m-tab" :left-options="leftBtnOptions" @on-click-back = "onClickBack">
      <h1 class="m-tab-top" @click="enterNameCard">{{sessionName}}</h1>
      <a slot="left"></a>
      <div class="m-tab-right" slot="right">
        <span class='icon-history' @click='onHistoryClick'></span>
        <span v-if="scene==='team'" class='icon-team' @click="onTeamManageClick"></span>
      </div>
    </x-header>
    <div class="m-chat-main">
      <div class='invalidHint' v-if='scene==="team" && teamInvalid'>
        {{`您已退出该${teamInfo && teamInfo.type==='normal' ? '讨论组':'群'}`}}
      </div>
      <chat-list
        type="session"
        :msglist="msglist"
        :userInfos="userInfos"
        :myInfo="myInfo"
        :isRobot="isRobot"
        @msgs-loaded="msgsLoaded"
      ></chat-list>
      <chat-editor
        type="session"
        :scene="scene"
        :to="to"
        :isRobot="isRobot"
        :invalid="teamInvalid || muteInTeam"
        :invalidHint="sendInvalidHint"
        :advancedTeam="teamInfo && teamInfo.type === 'advanced'"
      ></chat-editor>
    </div>
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
    this.$store.dispatch('showLoading')
    // 此时设置当前会话
    this.$store.dispatch('setCurrSession', this.sessionId)
    pageUtil.scrollChatListDown()

    setTimeout(() => {
      this.$store.dispatch('hideLoading')
    }, 1000)

    // 获取群成员
    if(this.scene === 'team') {
      var teamMembers = this.$store.state.teamMembers[this.to]
      if (teamMembers === undefined || teamMembers.length < this.teamInfo.memberNum) {
        this.$store.dispatch('getTeamMembers', this.to)
      }
    }
  },
  updated () {
    pageUtil.scrollChatListDown()
  },
  // 离开该页面，此时重置当前会话
  destroyed () {
    this.$store.dispatch('resetCurrSession')
  },
  data () {
    return {
      leftBtnOptions: {
        backText: ' ',
        preventGoBack: true,
      }
    }
  },
  computed: {
    sessionId () {
      let sessionId = this.$route.params.sessionId
      return sessionId
    },
    sessionName () {
      let sessionId = this.sessionId
      let user = null
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '')
        if (user === this.$store.state.userUID) {
          return '我的手机'
        } else if (this.isRobot) {
          return this.robotInfos[user].nick
        } else {
          let userInfo = this.userInfos[user] || {}
          return util.getFriendAlias(userInfo)
        }
      } else if (/^team-/.test(sessionId)) {
        if (this.teamInfo) {
          // teamInfo中的人数为初始获取的值，在人员增减后不会及时更新，而teamMembers在人员增减后同步维护的人员信息
          var members = this.$store.state.teamMembers && this.$store.state.teamMembers[this.teamInfo.teamId]
          var memberCount = members && members.length
          return this.teamInfo.name + (memberCount ? `(${memberCount})` : '')
        } else {
          return  '群'
        }
      }
    },
    scene () {
      return util.parseSession(this.sessionId).scene
    },
    to () {
      return util.parseSession(this.sessionId).to
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
    robotInfos () {
      return this.$store.state.robotInfos
    },
    msglist () {
      let msgs = this.$store.state.currSessionMsgs
      return msgs
    },
    teamInfo() {
      if (this.scene==='team') {
        var teamId =  this.sessionId.replace('team-','')
        return this.$store.state.teamlist.find(team=>{
          return team.teamId === teamId
        })
      } 
      return undefined
    },
    muteInTeam(){
      if(this.scene!=='team') return false
      var teamMembers = this.$store.state.teamMembers 
      var Members = teamMembers && teamMembers[this.teamInfo.teamId]
      var selfInTeam = Members && Members.find(item=>{
        return item.account === this.$store.state.userUID
      })
      return selfInTeam && selfInTeam.mute || false
    },
    teamInvalid() {
      if (this.scene==='team') {
        return !(this.teamInfo && this.teamInfo.validToCurrentUser)
      }
      return false
    }, 
    sendInvalidHint() {
      if (this.scene==='team' && this.teamInvalid) {
        return `您已不在该${this.teamInfo && this.teamInfo.type==='normal'? '讨论组':'群'}，不能发送消息`
      } else if (this.muteInTeam) {
        return '您已被禁言'
      }
      return '无权限发送消息'
    }
  },
  methods: {
    onClickBack () {
      // location.href = '#/contacts'
      window.stopPlayAudio && window.stopPlayAudio()
      window.history.go(-1)
    },
    msgsLoaded () {
      pageUtil.scrollChatListDown()
    },
    enterNameCard () {
      if (/^p2p-/.test(this.sessionId)) {
        let account = this.sessionId.replace(/^p2p-/, '')
        if (account === this.$store.state.userUID) {
          location.href = `#/general`
          return
        }
        location.href = `#/namecard/${account}`
      }
    },
    onTeamManageClick() {
      if (this.teamInfo && this.teamInfo.validToCurrentUser) {
        location.href = `#/teammanage/${this.teamInfo.teamId}`
      } else {
        this.$toast('您已退出该群')
      }
    },
    onHistoryClick() {
      if (this.scene!=='team' || (this.teamInfo && this.teamInfo.validToCurrentUser)) {
        location.href = `#/chathistory/${this.sessionId}`
      } else {
        this.$toast('您已退出该群')
      }
    }
  }
}
</script>
<style scoped>
.g-window .m-tab .m-tab-right{
  width: 5rem;
  right: -1rem;
}
.m-tab-right {
  display: flex;
  justify-content: flex-end;

  .icon-history, .icon-team {
    display: inline-block;
    margin-right: .8rem;
    width: 1.7rem;
    height: 1.7rem;
    background: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
    background-size: 20rem;
    background-position: -5.8rem -11.3rem;
  }
  .icon-team{
    background-position: -7.9rem -11.3rem;
  }
}
.invalidHint {
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  background-color: bisque;
  color: burlywood;
}
</style>
<style>
.g-window .vux-header .m-tab-top {
  width: 80%;
  margin: 0 10%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>