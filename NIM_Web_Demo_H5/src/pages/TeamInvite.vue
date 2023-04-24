<template>
  <div class='g-inherit m-article p-teaminvite'>
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">邀请成员</h1>
      <a slot="left"></a>
    </x-header>
    <div class="m-list">
      <div v-for="group in friendsGroups" :key="group.letter" class='m-group'>
        <em>{{group.letter}}</em>
        <cell v-for="friend in group.arr" :title="friend.alias" :key="friend.account" @click.native='itemClick(friend)'>
          <span ref='checkIcon' class='check-icon' slot='icon'  :class='friend.ingroup ? "checked-grey": (friend.checked ? "checked-blue": "unchecked")'></span>
          <img class="icon u-circle" slot="icon" width="25" height="25" :src="userInfos[friend.account].avatar">
        </cell>
      </div>
    </div>
    <div class='m-selected'>
      <div class='avators' ref='avators'>
        <img class='u-circle' v-for='friend in selected' :key='friend.account' width="30" height="30" :src='userInfos[friend.account].avatar' @click='unSelect(friend)'>
        <img width="30" height="30" src='http://yx-web-nosdn.netease.im/webdoc/h5/im/team_invite_dot_avatar.png'>
      </div>
      <x-button class='btn' type="primary" :mini='true' action-type="button" @click.native='onNext'>{{`确认(${selected.length})`}}</x-button>
    </div>
    <action-sheet v-model="showActionSheet" :menus="menus" @on-click-menu="onActionClick" show-cancel></action-sheet>
  </div>
</template>

<script>
import {getPinyin} from '../utils/pinyin'

export default {
  data() {
    return {
      selected: [],
      showActionSheet: false,
      menus: {
        menu1: '创建讨论组',
        menu2: '创建高级群'
      }
    }
  },
  computed: {
    frinedList () {
      var teamMember = this.$store.state.teamMembers && this.$store.state.teamMembers[this.teamId]
      var list = this.$store.state.friendslist.map(item => {
        var friend = Object.assign({}, item)
        let account = friend.account
        let thisAttrs = this.userInfos[account]
        let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
        friend.alias = alias || thisAttrs.nick || account
        friend.pinyin = getPinyin(friend.alias, '').toUpperCase()
        friend.checked = false

        if (teamMember) {
          teamMember.forEach(item=>{
            if (friend.account === item.account) {
              friend.ingroup = true
            }
          })
        }
        return friend
      })
      list.sort((a, b) => {
        return a.pinyin < b.pinyin ? -1 : a.pinyin>b.pinyin ? 1 : 0
      })
      return list
    },
    friendsGroups () {
      var map = Object.create(null)
      this.frinedList.forEach(friend=>{
        var firstLetter = friend.pinyin[0]
        var firstLetter = firstLetter>='A' && firstLetter<='Z' ? firstLetter : '#'
        if(map[firstLetter] === undefined) {
          map[firstLetter] = []
        }
        map[firstLetter].push(friend)
      })
      var groups = []
      for (const key in map) {
        groups.push({
          letter: key, 
          arr: map[key]
        })
      }
      return groups
    },
    userInfos () {
      return this.$store.state.userInfos
    },
    teamId() {
      return this.$route.params.teamId
    },
  },
  methods: {
    itemClick(friend) {
      if (!friend.ingroup) {
        friend.checked = !friend.checked
        if (friend.checked) {
          this.selected.push(friend)
        } else {
          this.selected.splice(this.selected.indexOf(friend), 1)
        }
        this.$forceUpdate()
        this.$nextTick(()=>{
          this.$refs.avators.scrollLeft = this.$refs.avators.scrollWidth
        })
      }
    },
    unSelect(friend) {
      friend.checked = false
      this.selected.splice(this.selected.indexOf(friend), 1)
      this.$forceUpdate()
    },
    onNext() {
      if (this.selected.length<1) {
        this.$toast('未选择成员')
        return 
      }
      if (this.teamId==="0") {
        // 创建群模式
        this.showActionSheet = true
      } else {
        // 添加新成员
        this.addMembers()
      }
    },
    addMembers() {
      this.$store.dispatch('showLoading')
      var accounts = this.selected.map((friend)=>{
        return friend.account
      })
      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'addTeamMembers', 
        options: {
          teamId: this.teamId,
          accounts: accounts,
          done:(error, obj)=>{
            this.$store.dispatch('hideLoading')
            if (error) {
              this.$toast(error)
              return
            }
            this.$toast('邀请成员成功')
            setTimeout(() => {
              window.history.go(-1)
            }, 200);
          }
        }
      })
    },
    onActionClick(key) {
      var type, name, accounts = this.selected.map((friend)=>{
        return friend.account
      })
      switch(key) {
        case "menu1":
          type = 'normal'
          name = '讨论组'
          break
        case "menu2":
          type = 'advanced'
          name = '高级群'
        break
        default:
          // cancle
          return
      }
      this.$store.dispatch('showLoading')
      this.$store.dispatch('delegateTeamFunction',{
        functionName: 'createTeam', 
        options: {
          type: type,
          name: name,
          avatar: '',
          accounts: accounts,
          done: (error, obj)=>{
            if (error) {
              this.$toast('创群失败'+ error)
            }
            if(!error) {
              if(history.replaceState) {
                // 改变当前页路由的hash值为联系人页，这样从会话页返回时，不再回到邀请页
                history.replaceState(null, null, '#/contacts')
              } else {
                history.go(-1)
              } 
              setTimeout(() => {
                location.href = `#/chat/team-${obj.team.teamId}`
                this.$store.dispatch('hideLoading')
              }, 20);
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .p-teaminvite {
    display: flex;
    flex-direction: column;
    padding-top: 0;
    .m-tab {
      position: relative;
    }
    .m-list {
      position: relative;
      flex-grow: 1;

      .check-icon{
        margin-right: 0.8rem;
      }

      .icon{
        margin-right: 0.5rem;
      }
    }
    .m-selected {
      display: inherit;
      height: 5rem;
      background-color: black;
      align-items: center;
      justify-content: space-between;

      .avators {
        display: flex;
        flex: 1 0 1rem;
        overflow-x: scroll;

        &::-webkit-scrollbar{
          display: none;
        }

        img {
          margin: .5rem;
        }
      }

      .btn {
        width: 6rem;
        height: 2.5rem;
        margin: auto .3rem;
        padding: 0;
        flex-shrink: 0;   
      }
    }
    .m-group {
      & +.m-group{
        margin-top: 1.1rem;
      }
      .checked-grey, .checked-blue, .unchecked{
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        background-size: 20rem;
        background-image: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
        background-position: -5rem .2rem;
      }

      .checked-blue {
        background-position: -3.7rem -2.95rem;
      }

      .unchecked {
        background-position: -5.15rem -2.95rem;
      }

      em{
        display: block;
        position: relative;
        padding-left: 1rem;
      }
      .weui-cell:before {
        border-top: none;
      }
      em:after, .weui-cell:after {
        content: " ";
        position: absolute;
        left: 70px;
        right: 15px;
        bottom: 0;
        height: 1px;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
      }
      em:after {
        left: 15;
        right: 15;
      }
    }
  }
</style>
