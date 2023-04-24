<template>
  <div class="m-members" :class='{"s-bg-white": advanced && !showAllMode}'>
    <a v-if='hasInvitePermission && !showAllMode' class='u-member' :href='"#/teaminvite/" + teamId'>
      <img class='avatar' src="http://yx-web-nosdn.netease.im/webdoc/h5/im/team_member_add.png" alt="">
      <span>添加</span>
    </a>
    <a class='u-member' v-for='member in membersInDisplay' :key='member.account' @click='onMemberClick(member)'>
      <img class='avatar u-circle' :src='member.avatar'>
      <span v-if='removeMode && member.type!="owner" && member.account!=$store.state.userUID' class='remove' @click='remove($event, member)'></span>
      <span v-if='member.type !== "normal"' :class='member.type === "manager"? "manager":"owner"'></span>
      <span>{{member.alias}}</span>
    </a>
    <template v-if='!advanced'>
      <a class='u-member' :href='"#/teaminvite/" + teamId'>
        <img class='avatar' src="http://yx-web-nosdn.netease.im/webdoc/h5/im/team_member_add.png" alt="">
        <span>添加</span>
      </a>
      <div v-if='hasManagePermission' class='u-member' @click='triggerRemove()'>
        <img class='avatar' src="http://yx-web-nosdn.netease.im/webdoc/h5/im/team_member_delete.png" alt="">
        <span>移除</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    teamId: {
      type: String,
    },
    // 是否为高级群
    advanced: {
      type: Boolean,
      default: false
    },
    // 显示全部群成员模式
    showAllMode: {
      type: Boolean,
      default: false
    },
    filterAccount: {
      type: Array
      // [account1, account2]。 若设置了，则只显示该数组中的群成员, 应用场景：群消息回执中, 对已读未读进行了分组。
    }
  },
  data(){
    return {
      removeMode: false,
      hasManagePermission: false,
      hasSearched: false
    }
  },
  mounted(){
    // 防止在此页面直接刷新，此时需要获取群成员
    var teamMembers = this.$store.state.teamMembers[this.teamId]
    if (teamMembers === undefined) {
      this.$store.dispatch('getTeamMembers', this.teamId)
    }
  },
  computed: {
    teamInfo() {
      var teamList = this.$store.state.teamlist
      var team =  teamList && teamList.find(team=>{
        return team.teamId === this.teamId
      })
      if(!team) {
        return undefined
      }
      return team
    },
    members() {
      var members = this.$store.state.teamMembers[this.teamId]
      var userInfos = this.$store.state.userInfos
      var needSearchAccounts = []
      if (members) {
        members = members.map( item => {
          var member = Object.assign({}, item) //重新创建一个对象，用于存储展示数据，避免对vuex数据源的修改
          member.valid = true //被管理员移除后，标记为false
          if (member.account === this.$store.state.userUID) {
            member.alias = '我'
            member.avatar = this.$store.state.myInfo.avatar
            this.isOwner = member.type === 'owner'
            this.hasManagePermission = member.type !== 'normal'
          } else if (userInfos[member.account] === undefined) {
            needSearchAccounts.push(member.account)
            member.avatar = member.avatar || this.avatar
            member.alias = member.nickInTeam || member.account
          } else {
            member.avatar = userInfos[member.account].avatar
            member.alias = member.nickInTeam ||userInfos[member.account].nick
          }
          return member
        })
        if (needSearchAccounts.length>0 && !this.hasSearched) {
          this.hasSearched = true
          while(needSearchAccounts.length>0) {
            this.searchUsers(needSearchAccounts.splice(0, 150))
          }
        }
        return members
      }
      return []
    },
    membersInDisplay() {
      if (this.filterAccount) {
        return this.members.filter(member=>{
          return !!this.filterAccount.find(account => account === member.account)
        })
      } else if(this.advanced || this.showAllMode) {
        return this.members
      } else {
        return this.members.slice(0, this.hasInvitePermission ? 3 : 4)
      }
    },
    hasInvitePermission() {
      return this.advanced && (this.hasManagePermission || (this.teamInfo&&this.teamInfo.inviteMode === "all"))
    }
  },
  methods: {
    searchUsers(Accounts) {
      this.$store.dispatch('searchUsers', 
      {
        accounts: Accounts,
        done: (users) => {
          this.updateTeamMember(users)
        }
      })
    },
    updateTeamMember(users) {
      users.forEach(user =>{
        var member = this.members.find(member=>{
          return member.account === user.account
        })
        if(member) {
          member.avatar = user.avatar
          member.alias = member.nickInTeam || user.nick
        }
      })
    },
    triggerRemove(e, show) {
      this.removeMode = !this.removeMode
    },
    remove(e, member) {
      this.$store.dispatch('showLoading')
      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'removeTeamMembers', 
        options: {
          teamId: this.teamId,
          accounts: [member.account],
          done: (error, obj)=>{
            this.$toast('移除成功')
            this.$store.dispatch('hideLoading')
          }
        }
      })
      e.cancelBubble = true
      e.preventDefault()
    },
    onMemberClick(member){
      location.href = this.advanced ? `#/teammembercard/${member.id}` : `#/namecard/${member.account}`
    }
  }
}
</script>

<style scoped>

.m-members {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  text-align: center;
  width: 100%;

  img.avatar{
    width: 3.8rem;
    height: 3.8rem;
    flex: 0 1 auto;
  }

  .u-member {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    width: 25%;
    margin: .5rem 0;

    .remove, .manager, .owner{
      display: inline-block;
      position: absolute;
      bottom: 1.1rem;
      right: 0;
      width: 2rem;
      height: 2rem;
      background: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
      background-position: -10.3rem 0;
      background-size: 20rem
    }
    .owner {
      background-position: -10.3rem -2.7rem;
    }

    .remove {
      top: 0;
      bottom: auto;
      right: 0;
      width: 2.4rem;
      height: 2.4rem;
      background-position: -10.1rem -5.1rem;
    }

    span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &.s-bg-white{
    background-color: white;
  }
}

</style>
