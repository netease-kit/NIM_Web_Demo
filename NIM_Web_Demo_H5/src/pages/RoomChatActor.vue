<template>
  <div class="p-room-chat-actor">
    <div class="actor-info">
      <span class="actor-avatar">
        <img :src="chatroomActor.avatar">
      </span>
      <span class="actor-status">
        <h3>主播： {{chatroomActor.nick || chatroomActor.account}} </h3>
        <p>
          <span>
            在线：{{chatroomInfo.onlineMemberNum}}
          </span>
          <!-- <em>创建时间：{{chatroomInfo.showTime}}</em> -->
        </p>
      </span>
    </div>
    <div class="actor-notice">
      <h3>公告：</h3>
      <p>
        {{chatroomNotice}}
      </p>
    </div>
  </div>
</template>

<script>
import util from '../utils'
import config from '../configs'

export default {
  mounted () {
    this.$store.dispatch('getChatroomInfo')
  },
  computed: {
    chatroomInfo () {
      let chatroomInfo = this.$store.state.currChatroomInfo
      chatroomInfo.showTime = util.formatDate(chatroomInfo.createTime)
      return chatroomInfo
    },
    chatroomNotice () {
      return this.chatroomInfo.announcement || '暂无公告'
    },
    chatroomActor () {
      if (this.chatroomInfo) {
        let actor = this.chatroomInfo.actor || {}
        actor.avatar = actor.avatar || config.defaultUserIcon
        return actor
      }
      return {}
    }
  }
}
</script>

<style type="text/css">
  .p-room-chat-actor {
    position: relative;
    width: 100%;
    height: 100%;
    h3 {
      text-align: left;
    }
    .actor-info {
      position: relative;
      width: 100%;
      height: 4rem;
      padding: 0.5rem;
      box-sizing: border-box;
    }
    .actor-avatar {
      position: relative;
      display: inline-block;
      height: 3rem;
      width: 3rem;
      border-radius: 3rem;
      overflow: hidden;
      img {
        width: inherit;
        height: inherit;
      }
    }
    .actor-status {
      position: relative;
      display: inline-block;
      margin-left: 0.5rem;
      height: 3rem;
      width: auto;
      vertical-align: top;
      h3 {
        line-height: 1.8rem;
        font-size: 1.0rem;
      }
      p {
        position: relative;
        top: 0.2rem;
        line-height: 1.0rem;
        font-size: 0.9rem;
        color: #999;
      }
      em {
        margin-left: 2rem;
      }
    }
    .actor-notice {
      position: absolute;
      box-sizing: border-box;
      padding: 5rem 1rem 1rem 1rem;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 1.4;
      h3 {
        border-bottom: 1px solid #e9e9e9;
      }
      p {
        margin-top: 0.6rem;
        color: #666;
      }
    }
  }
</style>