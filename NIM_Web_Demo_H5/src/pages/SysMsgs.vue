<template>
  <div class="g-inherit m-article">
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <button-tab class="m-tab-top" v-model="sysType">
        <button-tab-item class="u-tab-top">系统消息</button-tab-item>
        <button-tab-item class="u-tab-top">自定义消息</button-tab-item>
      </button-tab>
      <a slot="left"></a>
      <a slot="right" @click.stop="clearMsgs">清空</a>
    </x-header>
    <div class="m-article-main p-sysmsgs">
      <group class="u-list">
        <template v-for="msg in msgList">
          <cell 
            v-if='msg.type ==="applyTeam" || msg.type ==="teamInvite"'
            class="u-list-item"
            :key="msg.idServer"
            :idServer ="msg.idServer"
            v-touch:swipeleft="showDelBtn"
            v-touch:swiperight="hideDelBtn"
          > 
            <img class="icon" slot="icon" width="24" :src="msg.avatar">
            <div slot="child"  class='g-teamSys'>
              <div class='m-info'>
                <span class='u-name'>{{msg.from}}</span>
                <span class='u-time'>{{msg.showTime}}</span>
                <p class='u-desc'>{{msg.desc}}</p>
                <p v-if='msg.ps' class='u-desc'>{{`留言:${msg.ps}`}}</p>
              </div>
              <div class='m-options' slot='default' v-if='deleteIdServer !== msg.idServer'>
                <template v-if='msg.state === "init"'>
                  <x-button type="primary" :mini='true' action-type="button" @click.native="handleTeamApply(msg, true)">同意</x-button>
                  <x-button type="warn" :mini='true' action-type="button" @click.native="handleTeamApply(msg, false)">拒绝</x-button>
                </template>
                <div v-else class='u-msg-state'>
                  {{msg.state==='error'? '已过期' : msg.state==='rejected'?'已拒绝':'已同意'}}
                </div>
              </div>
            </div>
            <span class="u-tag-del" :class="{active: deleteIdServer === msg.idServer}" @click="deleteMsg(msg.idServer)"></span>
          </cell>
          <cell
            v-else
            class="u-list-item"
            :title="msg.showText"
            :value="msg.showTime"
            :inline-desc="msg.desc"
            :key="msg.idServer"
            :idServer ="msg.idServer"
            v-touch:swipeleft="showDelBtn"
            v-touch:swiperight="hideDelBtn"
          >
            <img class="icon" slot="icon" width="24" :src="msg.avatar">
            <span class="u-tag-del" :class="{active: deleteIdServer === msg.idServer}" @click="deleteMsg(msg.idServer)"></span>
          </cell>
        </template>
      </group>
       <div class='empty-hint' v-if='!msgList || msgList.length<1'>暂无任何消息</div>
    </div>
  </div>
</template>

<script>
import config from '../configs'
export default {
  // 进入该页面，文档被挂载
  mounted () {
    this.$store.dispatch('markSysMsgRead')
    this.$store.dispatch('markCustomSysMsgRead')
  },
  updated () {
    this.$store.dispatch('markSysMsgRead')
    this.$store.dispatch('markCustomSysMsgRead')
  },
  data () {
    return {
      sysType: 0, // 系统消息 0, 自定义消息 1,
      defaultAvatar: config.defaultUserIcon,
      deleteIdServer: ''
    }
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos || {}
    },
    sysMsgs () {
      let sysMsgs = this.$store.state.sysMsgs.filter(msg => {
        switch (msg.type) {
          case 'addFriend':
            msg.showText = `${msg.friend.alias || msg.friend.account} 添加您为好友~`
            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar
            return true
          case 'deleteFriend':
            msg.showText = `${msg.from} 将您从好友中删除`
            msg.avatar = this.userInfos[msg.from].avatar
            return false
          case 'applyTeam':
            console.log('applyTeam', msg)
            msg.showText = msg.from
            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar || this.defaultAvatar
            msg.desc = `申请加入群:${this.getTeamName(msg.to)}`
            return true
          case 'teamInvite':
            msg.showText = msg.attach.team.name
            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar || this.defaultAvatar
            msg.desc = `邀请你加入群${msg.to}`
            return true
          case 'rejectTeamApply':
            msg.showText = msg.attach.team.name
            msg.desc ='管理员拒绝你加入本群'
            msg.avatar = msg.attach.team.avatar || this.defaultAvatar
            return true
          case 'rejectTeamInvite':
            let op = this.userInfos[msg.from]
            msg.showText = op.nick
            msg.avatar = op.avatar || this.defaultAvatar
            msg.desc = `${op.nick}拒绝了群${this.getTeamName(msg.to)}的入群邀请`
            return true
        }
        console.log(msg)
        return false
      })
      sysMsgs.sort((msg1, msg2)=>{
        // 最新的排在前
        return msg2.time - msg1.time
      })
      return sysMsgs
    },
    customSysMsgs () {
      let customSysMsgs = this.$store.state.customSysMsgs.filter(msg => {
        if (msg.scene === 'p2p') {
          let content = JSON.parse(msg.content)
          msg.showText = `${content.content}`
          msg.avatar = this.userInfos[msg.from].avatar
          return msg
        }
        return false
      })
      return customSysMsgs
    },
    msgList() {
      return this.sysType ===  0 ? this.sysMsgs : this.customSysMsgs
    }
    
  },
  methods: {
    deleteMsg(idServer){
      this.$store.commit('deleteSysMsgs', {
        type: this.sysType,
        idServer: idServer,
      })
    },
    clearMsgs () {
      var that = this
      this.$vux.confirm.show({
        title: '确认要清空消息吗？',
        onConfirm () {
          that.$store.dispatch('resetSysMsgs', {
            type: that.sysType
          })
        }
      })
    },
    getTeamName(teamId) {
      let team = this.$store.state.teamlist.find(team => {
        return team.teamId === teamId
      })
      return team && team.name || ''
    },
    handleTeamApply(msg, pass) {
      let action
      switch (msg.type) {
        case 'applyTeam':
          action = pass ? 'passTeamApply' : 'rejectTeamApply'
          break;
         case 'teamInvite':
          action = pass ? 'acceptTeamInvite' : 'rejectTeamInvite'
          break;
        default:
          return
      }
      this.$store.dispatch('delegateTeamFunction', {
        functionName: action, 
        options: {
          idServer: msg.idServer,
          teamId: msg.to,
          from: msg.from,
          done: (error, obj)=>{
            console.log('handleDone', obj)
          }
        }
      })
    },
    findTeamInfo(teamId) {
      var team = this.$store.state.teamlist.find(item =>{
        return item.teamId === teamId
      })
      return team && team.name || teamId
    },
    showDelBtn (vNode) {
      if (vNode && vNode.data && vNode.data.attrs) {
        this.deleteIdServer = vNode.data.attrs.idServer
        this.stopBubble = true
        setTimeout(() => {
          this.stopBubble = false
        }, 20)
      }
    },
    hideDelBtn () {
      if (this.deleteIdServer !== null && !this.stopBubble) {
        // 用于判断是否前置状态是显示删除按钮
        this.deleteIdServer = null
        return true
      }
      return false
    }
  }
}
</script>

<style type="text/css">
  .p-sysmsgs {
    .u-list {
      height: 100%;
      overflow-y: scroll;
    }
    p {
      word-wrap: normal;
      word-break: break-all;
      color: #333;
    }
    
    .g-teamSys {
      display: flex;
      flex-grow: 100;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      
      .m-info {
        flex-shrink: 1;
        overflow: hidden;

        .u-time {
          color: #aaa;
        }
        .u-desc {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aaa;
          font-size: 1rem;
        }
      }

      .m-options{
        display: flex;
        align-items: center;
        
        .weui-btn.weui-btn_mini {
          padding: 0;
          width: 3rem;
          height: 2rem;
        }
        
        .weui-btn + .weui-btn {
          margin-top: 0;
          margin-left: 0.5rem;
        }
      }
    }
    .u-msg-state {
      color: #aaa;
      font-size: .9rem;
    }
    .empty-hint{
      position: absolute;
      left: 0;
      right: 0;
      top: 5rem;  
      margin: auto;
      text-align: center;
    }
  }
</style>