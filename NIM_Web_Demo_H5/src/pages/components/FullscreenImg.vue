<template>
  <div class="chat-fullscreen" :class="{active:showImg}" @click.stop="hideFullscreenImg">
    <div class="chat-mask"></div>
    <div class="chat-image" ref="chatImg"></div>
  </div>
</template>

<script type="text/javascript">

export default {
  // 兼容性处理，图片加载时间可能比较慢
  watch: {
    isFullscreenImgShow (val, oldVal) {
      var self = this
      let chatImg = this.$refs.chatImg
      if (val === true) {
        chatImg.innerHTML = ''
        let img = new Image()
        img.src = this.$store.state.fullscreenImgSrc
        img.alt = '图片尺寸较大，正在加载中...'
        img.onload = function () {
          chatImg.appendChild(img)
          self.showImg = val
        }
      } else {
        self.showImg = false
        chatImg.innerHTML = ''
      }
    }
  },
  data () {
    return {
      showImg: false
    }
  },
  computed: {
    isFullscreenImgShow () {
      return this.$store.state.isFullscreenImgShow
    }
  },
  methods: {
    hideFullscreenImg () {
      this.$store.dispatch('hideFullscreenImg')
    }
  }
}
</script>

<style type="text/css">
  .chat-fullscreen, .chat-image img {
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .chat-fullscreen {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    visibility: hidden;
    z-index: 98;
    &.active {
      visibility: visible;
      .chat-mask {
        opacity: 0.7;
      }
      .chat-image {
        transform: scale3d(1, 1, 1);
      }
    }
    .chat-mask, .chat-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: all 0.5s;
    }
    .chat-mask {
      left: 0;
      top: 0;
      background-color: #000;
      opacity: 0;
    }
    .chat-image {
      transform: scale3d(0, 0, 0);
      img {
        display: block;
        position: absolute;
        width: 100%;
        height: auto;
/*          max-width: 100%;
        max-height: 100%;*/
      }
    }
  }

</style>