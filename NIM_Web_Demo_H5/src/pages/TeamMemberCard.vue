<template>
  <div class='g-inherit m-article p-membercard'>
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">群名片</h1>
      <a slot="left"></a>
    </x-header>
    <div class='g-body'>
      <div class='g-avatar'>
        <img class="icon u-circle" slot="icon" width="50" height="50" :src="member && member.avatar">
        <div>{{member && member.alias}}</div>
      </div>
      <group class='m-group'>
        <cell title="群昵称" :value="member.nickInTeam||'未设置'" @click.native="()=> hasSetNickPermission? onEditItemClick('修改群昵称', 'text', 'nickInTeam', getUpdateCallBcak()) : $toast('无权限')" is-link></cell>
        <cell title="身份" :value="memberType"  @click.native="()=> hasSetMemberTypePermission? onEditItemClick('身份', 'select', 'memberType', getUpdateCallBcak()) : $toast('无权限')" is-link></cell>
        <x-switch v-if='hasMuteOrRemovePermission' class="u-switch" title="设置禁言" v-model="mute" @on-change="changeMute"></x-switch>
      </group>
      <x-button v-if='hasMuteOrRemovePermission' class='u-btn' mini type="warn" @click.native='remove'>移出本群</x-button>
    </div>
  </div>
</template>

<script>
import config from '../configs'
import Utils from  '../utils'
export default {
  data(){
    return {
      avatar: config.defaultUserIcon,
      teamId: '',
      account: '',
      mute: false,
      selfType: 'normal'
    }
  },
  computed:{
    member(){
      var parseReg = /(\d+)-(\w+)/
      var result = parseReg.exec(this.$route.params.member)
      var teamId = result[1]
      this.teamId = teamId
      var account = result[2]
      this.account = account
      var member = {}
      this.$store.state.teamMembers[teamId] && this.$store.state.teamMembers[teamId].forEach(item=>{
        if (item.account === account){
          member = Object.assign(member, item)
        } 
        if(item.account === this.$store.state.userUID) {
          this.selfType = item.type
        }
      })
      var userInfo = this.$store.state.userInfos[member.account]
      if (member.account === this.$store.state.userUID) {
        userInfo = this.$store.state.myInfo
      }
      member.avatar =  userInfo? userInfo.avatar : (member.avatar || this.avatar)
      member.alias = userInfo ? userInfo.nick : (member.account || 'account')
      this.mute = !!member.mute
      return member
    },
    memberType(){
      if(this.member) {
        switch (this.member.type) {
          case 'owner':
            return '群主'
          case 'manager':
            return '管理员'
          case 'normal':
            return '普通成员'
        }
      }
      return '普通成员'
    },
    infoInTeam(){
      return {
        nickInTeam: this.member.nickInTeam,
        memberType: this.member.type
      }
    },
    hasSetMemberTypePermission() {
      return this.selfType === 'owner' && this.member.type !=='owner'
    },
    hasMuteOrRemovePermission() {
      if (this.selfType === 'owner') {
        return this.member.type !== 'owner'
      }
      if (this.selfType === 'manager') {
        return this.member.type === 'normal'
      }
      return false
    },
    isSelf(){
      return  this.member.account === this.$store.state.userUID
    },
    hasSetNickPermission() {
      return this.selfType!=='normal' || this.isSelf
    }
  },
  methods:{
    changeMute(){
      this.$store.dispatch('delegateTeamFunction',{
        functionName: 'updateMuteStateInTeam',
        options: {
          teamId: this.teamId,
          account: this.account,
          mute: this.mute,
          done: (error, obj)=>{
            if(error) {
              this.$toast(error)
            }else{
              this.$toast(this.mute? '已禁言':'已取消禁言')
            }
          }
        }
      })
    },
    getUpdateCallBcak() {
      var account = this.member.account
      var store = this.$store
      var toast = this.$toast
      
      var doneCallBack = (error, obj)=>{
        if(error) {
          this.$toast(error)
        }else{
          this.$toast('更改成功')
          setTimeout(() => {
            history.go(-1)
          }, 200);
        }
        store.dispatch('hideLoading')
      }
      return function(teamId, updateKey, newValue){
        store.dispatch('showLoading')
        let action = null
        let opts = {}
        if(updateKey === 'nickInTeam') {
          action = 'updateNickInTeam'
          opts.account = account
          opts.nickInTeam = newValue
        } else if(updateKey === 'memberType') {
          action = newValue === 'manager'? 'addTeamManagers' : 'removeTeamManagers'
          opts.accounts = [account]
        }
        store.dispatch('delegateTeamFunction', {
          functionName: action,
          options: Object.assign({
            teamId: teamId,
            done: doneCallBack
          }, opts)
        })
      }
    },
    onEditItemClick(title, inputType, updateKey, confirmCallback) {
      var updateSelfNick = this.isSelf && updateKey === 'nickInTeam'
      this.$store.dispatch('enterSettingPage', {
        title: title,
        inputType: inputType,
        updateKey: updateKey,
        teamId: this.teamId,
        updateInfoInTeam: updateSelfNick ? true : false, 
        defaultValue: this.infoInTeam[updateKey],
        confirmCallback: updateSelfNick ? null : confirmCallback,
        enable: true
      })
    },
    remove(){
      this.$store.dispatch('showLoading')
      this.$store.dispatch('delegateTeamFunction', {
        functionName:'removeTeamMembers',
        options: {
          teamId: this.teamId,
          accounts: [this.member.account],
          done: (error, obj)=>{
            this.$toast(error ? error : '移除成功')
            history.go(-1)
            this.$store.dispatch('hideLoading')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .g-body{
    
  }
  .g-avatar{
    margin: 2rem auto;
    width: 100%;
    text-align: center;
  }
  .u-btn{
    width: 80%;
    margin: 1rem 10%;
  }
</style>
