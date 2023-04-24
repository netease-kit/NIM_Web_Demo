<template>
  <div class="g-inherit m-main">
    <div class="m-room-entry g-flex-c">
      <span class="u-box" v-for="item in roomList" @click="enterRoom(item.roomid)">
        <div class="album">
          <img class="pic" :src="item.album">
          <div class="status">
            <strong v-if="item.status===1">正在直播</strong>
            <em>{{item.onlineusercount}} 人</em>
          </div>
        </div>
        <p class="desc">{{item.name}}</p>
      </span>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import config from '../configs'

export default {
  mounted () {
    this.$store.dispatch('showLoading')
    axios.get(
      `${config.postUrl}/api/chatroom/homeList`,
      {
        headers: {
          'appkey': config.appkey,
          'content-type': 'application/json',
        }
      }
    ).then(res => {
      let data = res.data
      if (data.res === 200) {
        let chatroomInfos = {}
        let roomCount = 0
        this.roomList = data.msg.list.map(item => {
          if(item.onlineusercount > 10000){
            let value = new Number(item.onlineusercount/10000)
            item.onlineusercount = value.toFixed(1) + '万'
          } else {
            item.onlineusercount = item.onlineusercount || 0
          }
          item.album = `${config.resourceUrl}/chatroom/image${roomCount}.png`
          item.announcement = item.announcement || ' '
          // 用于初始化
          chatroomInfos[item.roomid] = item
          roomCount++
          return item
        })
        this.roomTotal = data.msg.total
        // 用于demo设置封面
        this.$store.dispatch('initChatroomInfos', chatroomInfos)
      } else {
        alert(this.errorMsg)
      }
      this.$store.dispatch('hideLoading')
    }).catch(err => {
      alert(err)
      this.$store.dispatch('hideLoading')
    })
  },
  data () {
    return {
      roomList: [],
      roomTotal: 0
    }
  },
  methods: {
    enterRoom (chatroomId) {
      location.href = `#/roomChat/${chatroomId}`
    }
  }
}
</script>
