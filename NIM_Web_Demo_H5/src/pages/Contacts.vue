<template>
  <div class="g-inherit m-main p-contacts">
    <div class="m-cards u-search-box-wrap">
      <span class="u-search-box">
        <a href="#/searchUser/0">
          添加好友\群
        </a>
      </span>
      <span class="u-search-box">
        <a href='#/teaminvite/0'>
        创建组\群
        </a>
      </span>
    </div>
    <div id="userList" class="m-list">
      <group class="u-card" title="群">
        <cell title="高级群" is-link link='/teamlist/advanced'>
          <span class="icon icon-team-advanced" slot="icon"></span>
        </cell>
        <cell title="讨论组" is-link link='/teamlist/normal'>
          <span class="icon icon-team" slot="icon"></span>
        </cell>
      </group>
      <group class="u-card" title="好友列表">
        <cell v-for="friend in friendslist" :title="friend.alias" :key="friend.account" is-link :link="friend.link">
          <img class="icon" slot="icon" width="20" :src="userInfos[friend.account].avatar">
        </cell>
        <!-- <RecyclerView
          :prerender="5"
          :item="Cell" 
          :list="friendslist">
        </RecyclerView> -->
      </group>
      <group class="u-card" title="机器人">
        <cell v-for="robot in robotslist" :title="robot.nick" :key="robot.account" is-link :link="robot.link">
          <img class="icon u-circle" slot="icon" width="20" :src="robot.avatar">
        </cell>
      </group>
      <group class="u-card" title="黑名单">
        <cell v-for="friend in blacklist" :title="friend.alias" :key="friend.account" is-link :link="friend.link">
          <img class="icon u-circle" slot="icon" width="20" :src="userInfos[friend.account].avatar">
        </cell>
      </group>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    friendslist () {
      return this.$store.state.friendslist.filter(item => {
        let account = item.account
        let thisAttrs = this.userInfos[account]
        let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
        item.alias = alias || thisAttrs.nick || account
        item.link = `/namecard/${item.account}`
        if ((!thisAttrs.isFriend) || (thisAttrs.isBlack)) {
          return false
        }
        return true
      })
    },
    blacklist () {
      return this.$store.state.blacklist.filter(item => {
        let account = item.account
        let thisAttrs = this.userInfos[account]
        let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
        item.alias = alias || thisAttrs.nick || account
        item.link = `/namecard/${item.account}`
        if (!thisAttrs.isFriend) {
          return false
        }
        return true
      })
    },
    robotslist () {
      return this.$store.state.robotslist.map(item => {
        item.link = `/namecard/${item.account}`
        return item
      })
    },
    userInfos () {
      return this.$store.state.userInfos
    }
  }
}
</script>

<style type="text/css">
  .p-contacts {
    .add-friend {
      background-color: #fff;
    }
    .m-list {
      padding-top: 8rem;
    }
    .u-search-box-wrap {
      text-align: center;
    }
    .u-search-box {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      min-width: 45%;
      padding: 1em;
      height: 3rem;
      text-align: center;
      border: 1px solid #ccc;
      background-color: #fff;
      font-size: 0.8rem;
      box-shadow: 2px 2px 6px #ccc;
      a {
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
      }
    }
    .u-card {
      .icon {
        display: inline-block;
        margin-right: 0.4rem;
        width: 1.4rem;
        height: 1.4rem;
        background-size: 20rem;
      }
      .icon-team-advanced {
        background-position: 0 -3rem;
        background-image: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
      }
      .icon-team {
        background-position: -2.1rem -3rem;
        background-image: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
      }
    }
  }
</style>
