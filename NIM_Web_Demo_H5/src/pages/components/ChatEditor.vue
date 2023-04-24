<template>
  <div class="m-chat-editor" @click="hideRobotList">
    <chat-emoji
      v-bind:type="type"
      v-bind:scene="scene"
      v-bind:to="to"
      v-show="isEmojiShown"
      v-on:add-emoji="addEmoji"
      v-on:hide-emoji="hideEmoji"
    ></chat-emoji>
    <group v-show="isRobotListShown" class="m-chat-emoji m-chat-robot">
      <cell v-for="robot in robotslist" :title="robot.nick" :key="robot.account" @click.native="chooseRobot(robot)">
        <img class="icon u-circle" slot="icon" width="20" height="20" :src="robot.avatar">
      </cell>
    </group>
    <div class="m-chat-editor-main" :class="{robot:isRobot}">
      <span class="u-editor-input">
        <textarea v-if="sendTxt" v-model="msgToSent" @focus='onInputFocus'></textarea>
        <i v-if="supportTouch && !sendTxt" class="u-btn-record" :class="{'recording':recording, 'disabled': recordDisable}" @touchstart.prevent='toRecord' v-touch:swipeup='cancelRecord' @touchend.prevent='sendRecordMsg'>
          <b v-if="recording">松开结束</b>
          <b v-else>按下说话</b>
          <a v-if="recording" id="recordTime"  class="u-record-time">00:00</a>
        </i>
        <i v-if="!supportTouch && !sendTxt" class="u-btn-record" :class="{'recording':recording, 'disabled': recordDisable}" @click.stop="siwtchRecord">
          <b v-if="recording">点击发送</b>
          <b v-else>点击说话</b>
          <a v-if="recording" id="recordTime"  class="u-record-time with-close-btn" @click.stop="cancelRecord">00:00</a>
        </i>
      </span>
      <span class="u-editor-icons">
        <span v-if="sendTxt" class="u-editor-icon" @click.stop="swicthMsgType">
          <i class="u-icon-img"><img :src="icon5"></i>
        </span>
        <span v-else class="u-editor-icon" @click.stop="swicthMsgType">
          <i class="u-icon-img"><img :src="icon4"></i>
        </span>
        <span v-if="!isRobot" class="u-editor-icon" @click.stop="showEmoji">
          <i class="u-icon-img"><img :src="icon1"></i>
        </span>
        <span v-if="!isRobot" class="u-editor-icon">
          <i class="u-icon-img"><img :src="icon2"></i>
          <input type="file" ref="fileToSent" @change="sendFileMsg">
        </span>
        <span v-if="!isRobot && !advancedTeam" class="u-editor-icon" @click.stop="sendPlayMsg">
          <i class="u-icon-img"><img :src="icon3"></i>
        </span>
        <span v-if='advancedTeam' class="u-editor-send u-editor-receipt" @click="turnToMsgReceipt">回执</span>
        <span class="u-editor-send" @click="sendTextMsg">发 送</span>
      </span>
    </div>
  </div>
</template>

<script>
import ChatEmoji from './ChatEmoji'
import util from '../../utils'
import config from '../../configs'
import pageUtil from '../../utils/page'
import Recorder from '../../plugins/recorder.js'

export default {
  components: {
    ChatEmoji
  },
  updated () {
    window.document.body.addEventListener('click', () => {
      this.isEmojiShown = false
    })
  },
  props: {
    type: String,
    scene: String,
    to: String,
    isRobot: {
      type: Boolean,
      default () {
        return false
      }
    },
    invalid: {
      type: Boolean,
      default: false
    },
    invalidHint: {
      type: String,
      default: '您无权限发送消息'
    },
    advancedTeam: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    continueRobotAccid (curVal, oldVal) {
      if (curVal && this.robotInfos[curVal]) {
        this.msgToSent = `@${this.robotInfos[curVal].nick} `
      }
      // 重置
      this.$store.dispatch('continueRobotMsg', '')
    },
    msgToSent (curVal, oldVal) {
      if (this.isRobot) {
        return
      }
      let indexAt = this.msgToSent.indexOf('@')
      if (indexAt >= 0 && (indexAt === this.msgToSent.length - 1)) {
        if (this.robotslist && this.robotslist.length > 0) {
          this.isRobotListShown = true
        }
      } else if (this.isRobotListShown === true) {
        this.isRobotListShown = false
      }
    }
  },
  data () {
    const data = {
      isEmojiShown: false,
      isRobotListShown: false,
      msgToSent: '',
      icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
      icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
      icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
      icon4: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png`,
      icon5: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png`,
      sendTxt: true,
      recording: false,
      recordDisable: false,
      toRecordCount: 0,
      recordTime: 0,
      $recordTime: null,
      recordTimeout: '',
      recorder: null,
      audioContext: null
    }

    try {
      data.audioContext = new window.AudioContext
    } catch (e) {
      data.recordDisable = true
      console.error(e)
    }
    return data
  },
  computed: {
    continueRobotAccid () {
      return this.$store.state.continueRobotAccid
    },
    robotslist () {
      return this.$store.state.robotslist
    },
    robotInfos () {
      return this.$store.state.robotInfos
    },
    robotInfosByNick () {
      return this.$store.state.robotInfosByNick
    },
    supportTouch () {
      return ("ontouchend" in document && "ontouchstart" in document && "ontouchmove" in document ? true : false)
    }
  },
  methods: {
    sendTextMsg () {
      if (this.invalid) {
        this.$toast(this.invalidHint)
        return
      }
      if (/^\s*$/.test(this.msgToSent)) {
        this.$vux.alert.show({
          title: '请不要发送空消息'
        })
        return
      } else if (this.msgToSent.length > 800) {
        this.$vux.alert.show({
          title: '请不要超过800个字'
        })
        return
      }
      this.msgToSent = this.msgToSent.trim()
      if (this.type === 'session') {
        // 如果是机器人
        if (this.isRobot) {
          this.$store.dispatch('sendRobotMsg', {
            type: 'text',
            scene: this.scene,
            to: this.to,
            robotAccid: this.to,
            // 机器人后台消息
            content: this.msgToSent,
            // 显示的文本消息
            body: this.msgToSent
          })
        } else {
          let robotAccid = ''
          let robotText = ''

          let atUsers = this.msgToSent.match(/@[^\s@$]+/g)
          if (atUsers) {
            for (let i = 0; i < atUsers.length; i++) {
              let item = atUsers[i].replace('@', '')
              if (this.robotInfosByNick[item]) {
                robotAccid = this.robotInfosByNick[item].account
                robotText = (this.msgToSent + '').replace(atUsers[i], '').trim()
                break
              }
            }
          }
          if (robotAccid) {
            if (robotText) {
              this.$store.dispatch('sendRobotMsg', {
                type: 'text',
                scene: this.scene,
                to: this.to,
                robotAccid,
                // 机器人后台消息
                content: robotText,
                // 显示的文本消息
                body: this.msgToSent
              })
            } else {
              this.$store.dispatch('sendRobotMsg', {
                type: 'welcome',
                scene: this.scene,
                to: this.to,
                robotAccid,
                // 显示的文本消息
                body: this.msgToSent
              })
            }
          } else {
            this.$store.dispatch('sendMsg', {
              type: 'text',
              scene: this.scene,
              to: this.to,
              text: this.msgToSent
            })
          }
        }
      } else if (this.type === 'chatroom') {
        let robotAccid = ''
        let robotText = ''

        let atUsers = this.msgToSent.match(/@[^\s@$]+/g)
        if (atUsers) {
          for (let i = 0; i < atUsers.length; i++) {
            let item = atUsers[i].replace('@', '')
            if (this.robotInfosByNick[item]) {
              robotAccid = this.robotInfosByNick[item].account
              robotText = (this.msgToSent + '').replace(atUsers[i], '').trim()
              break
            }
          }
        }
        if (robotAccid) {
          if (robotText) {
            this.$store.dispatch('sendChatroomRobotMsg', {
              type: 'text',
              robotAccid,
              // 机器人后台消息
              content: robotText,
              // 显示的文本消息
              body: this.msgToSent
            })
          } else {
            this.$store.dispatch('sendChatroomRobotMsg', {
              type: 'welcome',
              robotAccid,
              // 显示的文本消息
              body: this.msgToSent
            })
          }
        } else {
          this.$store.dispatch('sendChatroomMsg', {
            type: 'text',
            text: this.msgToSent
          })
        }
      }
      this.msgToSent = ''
    },
    sendPlayMsg () {
      if (this.invalid) {
        this.$toast(this.invalidHint)
        return
      }
      // 发送猜拳消息
      if (this.type === 'session') {
        this.$store.dispatch('sendMsg', {
          type: 'custom',
          scene: this.scene,
          to: this.to,
          pushContent: '[猜拳]',
          content: {
            type: 1,
            data: {
              value: Math.ceil(Math.random()*3)
            }
          }
        })
      } else if (this.type === 'chatroom') {
        this.$store.dispatch('sendChatroomMsg', {
          type: 'custom',
          pushContent: '[猜拳]',
          content: {
            type: 1,
            data: {
              value: Math.ceil(Math.random()*3)
            }
          }
        })
      }
    },
    sendFileMsg () {
      if (this.invalid) {
        this.$toast(this.invalidHint)
        return
      }
      let ipt = this.$refs.fileToSent
      if (ipt.value) {
        if (this.type === 'session') {
          this.$store.dispatch('sendFileMsg', {
            scene: this.scene,
            to: this.to,
            fileInput: ipt
          })
        } else if (this.type === 'chatroom') {
          this.$store.dispatch('sendChatroomFileMsg', {
            fileInput: ipt
          })
        }
      }
    },
    showEmoji () {
      this.isEmojiShown = true
    },
    hideEmoji () {
      this.isEmojiShown = false
    },
    addEmoji (emojiName) {
      this.msgToSent += emojiName
      this.hideEmoji()
    },
    chooseRobot (robot) {
      if (robot && robot.account) {
        let len = this.msgToSent.length
        if (len === 0 || this.msgToSent[len-1] !== '@') {
          this.msgToSent += '@' + robot.nick + ' '
        } {
          this.msgToSent += robot.nick + ' '
        }
      }
    },
    hideRobotList () {
      this.isRobotListShown = false
    },
    onInputFocus(e) {
      setTimeout(() => {
        // todo fixme 解决iOS输入框被遮挡问题，但会存在空白缝隙
        e.target.scrollIntoView()
        pageUtil.scrollChatListDown()
      }, 200)
    },
    turnToMsgReceipt() {
      if (this.invalid) {
        this.$toast(this.invalidHint)
        return
      }
      location = `#/teamSendMsgReceipt/${this.to}`
    },
    swicthMsgType () {
      this.sendTxt = !this.sendTxt
    },
    toRecord () {
      var self = this
      self.toRecordCount ++
      if (window.stopPlayAudio) {
        window.stopPlayAudio()
      }
      if (location.protocol === 'http:') {
        self.$toast('请使用https协议')
        return
      }
      if (self.recording) {
        return
      }
      if (self.toRecordCount > 1 && !self.recorder) {
        self.recordDisable = true
      }
      if (self.recordDisable || !self.audioContext || !window.AudioContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        self.$toast('当前浏览器不支持录音')
        return
      }
      if (self.recorder) {
        self.recorder.record()
        self.resumeAudioContext()
      } else {
        function failed () {
          self.recordDisable = true
          self.$toast('当前浏览器不支持录音')
        }
        try {
          var value = navigator.mediaDevices.getUserMedia({
            audio: true
          }).then(stream => {
            var input
            try {
              input = self.audioContext.createMediaStreamSource(stream)
              self.recorder = new Recorder(input)
              self.recorder.record()
              self.resumeAudioContext()
              if (!self.recorder) {
                failed()
              }
            } catch (e) {
              failed()
            }
          }).catch(err => {
            self.$toast('没有权限获取麦克风')
            self.recordDisable = true
            console.log('No live audio input: ' + err, err.name + ": " + err.message)
          })
        } catch (e) {
          failed()
        }
      }
    },
    runRecorderTime () {
      if (this.recorder) {
        this.recording = true
        this.recordTime = 0
        setTimeout(() => {
          this.$recordTime = document.getElementById('recordTime')
        }, 800)
        this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000)
      }
    },
    resumeAudioContext () {
      if (this.audioContext && ~this.audioContext.state.indexOf('suspend')) {
        this.audioContext.resume().then(() => {
          console.log('audioContext suspend state resume')
          this.recorder.record()
          this.runRecorderTime()
        })
      } else {
        this.runRecorderTime()
      }
    },
    runRecordDuration () {
      this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000)
      this.recordTime++
      if (this.recordTime >= 60) {
        clearTimeout(this.recordTimeout)
        this.sendRecord()
      }
      this.$recordTime.innerText = '00:' + (this.recordTime > 9 ? this.recordTime : '0' + this.recordTime)
    },
    siwtchRecord () {
      if (this.recording) {
        this.sendRecordMsg()
      } else {
        this.toRecord()
      }
    },
    cancelRecord () {
      if (this.recording) {
        this.recording = false
        clearTimeout(this.recordTimeout)
        if (this.$recordTime) {
          this.$recordTime.innerText = '00:00'
        }
        this.recorder.stop()
        this.recorder.clear()
      }
    },
    sendRecordMsg () {
      setTimeout(this.sendRecord, 500)
    },
    sendRecord () {
      if (this.recording) {
        clearTimeout(this.recordTimeout)
        if (this.recordTime < 2) {
          this.$toast('语音消息最短2s')
          this.cancelRecord()
          return
        }
        this.recording = false
        this.$recordTime.innerText = '00:00'
        this.recorder.stop()
        this.recorder.exportWAV(blob => {
          this.$store.dispatch('showLoading')
          this.$store.dispatch('sendFileMsg', {
            scene: this.scene,
            to: this.to,
            type: 'audio',
            blob: blob,
            uploadprogress: obj => {
              console.log('文件总大小: ' + obj.total + 'bytes')
              console.log('已经上传的大小: ' + obj.loaded + 'bytes')
              console.log('上传进度: ' + obj.percentage)
              console.log('上传进度文本: ' + obj.percentageText)
              if (obj.percentage === 100) {
                this.$store.dispatch('hideLoading')
              }
            },
            uploaderror: () => {
              console && console.log('上传失败')
            },
            uploaddone: (error, file) => {
              console.log(error)
            }
          })
        })
        this.recorder.clear()
      }
    }
  }
}
</script>

<style scoped>
  .robot.m-chat-editor-main {
    /*.u-editor-input {
      padding-right: 4.5rem;
    }
    .u-editor-icons {
      width: 4rem;
    }*/
  }
  .m-chat-robot {
    overflow-y: scroll;
    .weui-cells {
      .weui-cell__hd {
        margin-right: 0.5rem;
      }
    }
  }

  .u-editor-send.u-editor-receipt {
    background-color: #fefefe;
    border: #ccc solid 1px;
    color: black;
    padding: 0.1rem;
    margin-left: .1rem;
  }
</style>
