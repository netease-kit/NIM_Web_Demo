webpackJsonp([3],{

/***/ 319:
/* no static exports found */
/* all exports used */
/*!***********************************!*\
  !*** ./src/pages/ChatHistory.vue ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-7439346a","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./ChatHistory.vue */ 516)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./ChatHistory.vue */ 436),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-7439346a"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./ChatHistory.vue */ 497),
  /* scopeId */
  "data-v-7439346a",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\ChatHistory.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ChatHistory.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7439346a", Component.options)
  } else {
    hotAPI.reload("data-v-7439346a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 358:
/* no static exports found */
/* all exports used */
/*!******************************!*\
  !*** ./src/configs/emoji.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _index = __webpack_require__(/*! ./index */ 6);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emojiBaseUrl = "http://yx-web.nosdn.127.net/webdoc/h5/emoji";

var emojiList = {
  "emoji": {
    "[大笑]": { file: "emoji_0.png" }, "[可爱]": { file: "emoji_01.png" }, "[色]": { file: "emoji_02.png" }, "[嘘]": { file: "emoji_03.png" }, "[亲]": { file: "emoji_04.png" }, "[呆]": { file: "emoji_05.png" }, "[口水]": { file: "emoji_06.png" }, "[汗]": { file: "emoji_145.png" }, "[呲牙]": { file: "emoji_07.png" }, "[鬼脸]": { file: "emoji_08.png" }, "[害羞]": { file: "emoji_09.png" }, "[偷笑]": { file: "emoji_10.png" }, "[调皮]": { file: "emoji_11.png" }, "[可怜]": { file: "emoji_12.png" }, "[敲]": { file: "emoji_13.png" }, "[惊讶]": { file: "emoji_14.png" }, "[流感]": { file: "emoji_15.png" }, "[委屈]": { file: "emoji_16.png" }, "[流泪]": { file: "emoji_17.png" }, "[嚎哭]": { file: "emoji_18.png" }, "[惊恐]": { file: "emoji_19.png" }, "[怒]": { file: "emoji_20.png" }, "[酷]": { file: "emoji_21.png" }, "[不说]": { file: "emoji_22.png" }, "[鄙视]": { file: "emoji_23.png" }, "[阿弥陀佛]": { file: "emoji_24.png" }, "[奸笑]": { file: "emoji_25.png" }, "[睡着]": { file: "emoji_26.png" }, "[口罩]": { file: "emoji_27.png" }, "[努力]": { file: "emoji_28.png" }, "[抠鼻孔]": { file: "emoji_29.png" }, "[疑问]": { file: "emoji_30.png" }, "[怒骂]": { file: "emoji_31.png" }, "[晕]": { file: "emoji_32.png" }, "[呕吐]": { file: "emoji_33.png" }, "[拜一拜]": { file: "emoji_160.png" }, "[惊喜]": { file: "emoji_161.png" }, "[流汗]": { file: "emoji_162.png" }, "[卖萌]": { file: "emoji_163.png" }, "[默契眨眼]": { file: "emoji_164.png" }, "[烧香拜佛]": { file: "emoji_165.png" }, "[晚安]": { file: "emoji_166.png" }, "[强]": { file: "emoji_34.png" }, "[弱]": { file: "emoji_35.png" }, "[OK]": { file: "emoji_36.png" }, "[拳头]": { file: "emoji_37.png" }, "[胜利]": { file: "emoji_38.png" }, "[鼓掌]": { file: "emoji_39.png" }, "[握手]": { file: "emoji_200.png" }, "[发怒]": { file: "emoji_40.png" }, "[骷髅]": { file: "emoji_41.png" }, "[便便]": { file: "emoji_42.png" }, "[火]": { file: "emoji_43.png" }, "[溜]": { file: "emoji_44.png" }, "[爱心]": { file: "emoji_45.png" }, "[心碎]": { file: "emoji_46.png" }, "[钟情]": { file: "emoji_47.png" }, "[唇]": { file: "emoji_48.png" }, "[戒指]": { file: "emoji_49.png" }, "[钻石]": { file: "emoji_50.png" }, "[太阳]": { file: "emoji_51.png" }, "[有时晴]": { file: "emoji_52.png" }, "[多云]": { file: "emoji_53.png" }, "[雷]": { file: "emoji_54.png" }, "[雨]": { file: "emoji_55.png" }, "[雪花]": { file: "emoji_56.png" }, "[爱人]": { file: "emoji_57.png" }, "[帽子]": { file: "emoji_58.png" }, "[皇冠]": { file: "emoji_59.png" }, "[篮球]": { file: "emoji_60.png" }, "[足球]": { file: "emoji_61.png" }, "[垒球]": { file: "emoji_62.png" }, "[网球]": { file: "emoji_63.png" }, "[台球]": { file: "emoji_64.png" }, "[咖啡]": { file: "emoji_65.png" }, "[啤酒]": { file: "emoji_66.png" }, "[干杯]": { file: "emoji_67.png" }, "[柠檬汁]": { file: "emoji_68.png" }, "[餐具]": { file: "emoji_69.png" }, "[汉堡]": { file: "emoji_70.png" }, "[鸡腿]": { file: "emoji_71.png" }, "[面条]": { file: "emoji_72.png" }, "[冰淇淋]": { file: "emoji_73.png" }, "[沙冰]": { file: "emoji_74.png" }, "[生日蛋糕]": { file: "emoji_75.png" }, "[蛋糕]": { file: "emoji_76.png" }, "[糖果]": { file: "emoji_77.png" }, "[葡萄]": { file: "emoji_78.png" }, "[西瓜]": { file: "emoji_79.png" }, "[光碟]": { file: "emoji_80.png" }, "[手机]": { file: "emoji_81.png" }, "[电话]": { file: "emoji_82.png" }, "[电视]": { file: "emoji_83.png" }, "[声音开启]": { file: "emoji_84.png" }, "[声音关闭]": { file: "emoji_85.png" }, "[铃铛]": { file: "emoji_86.png" }, "[锁头]": { file: "emoji_87.png" }, "[放大镜]": { file: "emoji_88.png" }, "[灯泡]": { file: "emoji_89.png" }, "[锤头]": { file: "emoji_90.png" }, "[烟]": { file: "emoji_91.png" }, "[炸弹]": { file: "emoji_92.png" }, "[枪]": { file: "emoji_93.png" }, "[刀]": { file: "emoji_94.png" }, "[药]": { file: "emoji_95.png" }, "[打针]": { file: "emoji_96.png" }, "[钱袋]": { file: "emoji_97.png" }, "[钞票]": { file: "emoji_98.png" }, "[银行卡]": { file: "emoji_99.png" }, "[手柄]": { file: "emoji_100.png" }, "[麻将]": { file: "emoji_101.png" }, "[调色板]": { file: "emoji_102.png" }, "[电影]": { file: "emoji_103.png" }, "[麦克风]": { file: "emoji_104.png" }, "[耳机]": { file: "emoji_105.png" }, "[音乐]": { file: "emoji_106.png" }, "[吉他]": { file: "emoji_107.png" }, "[火箭]": { file: "emoji_108.png" }, "[飞机]": { file: "emoji_109.png" }, "[火车]": { file: "emoji_110.png" }, "[公交]": { file: "emoji_111.png" }, "[轿车]": { file: "emoji_112.png" }, "[出租车]": { file: "emoji_113.png" }, "[警车]": { file: "emoji_114.png" }, "[自行车]": { file: "emoji_115.png" }
  }
};

for (var emoji in emojiList) {
  var emojiItem = emojiList[emoji];
  for (var key in emojiItem) {
    var item = emojiItem[key];
    item.img = emojiBaseUrl + "/" + emoji + "/" + item.file;
  }
}

var pinupList = {
  'ajmd': {},
  'xxy': {},
  'lt': {}
};

for (var i = 1; i <= 48; i++) {
  var _key = 'ajmd0' + (i >= 10 ? i : '0' + i);
  pinupList['ajmd'][_key] = { file: _key + '.png' };
}
for (var _i = 1; _i <= 40; _i++) {
  var _key2 = 'xxy0' + (_i >= 10 ? _i : '0' + _i);
  pinupList['xxy'][_key2] = { file: _key2 + '.png' };
}
for (var _i2 = 1; _i2 <= 20; _i2++) {
  var _key3 = 'lt0' + (_i2 >= 10 ? _i2 : '0' + _i2);
  pinupList['lt'][_key3] = { file: _key3 + '.png' };
}

for (var _emoji in pinupList) {
  var _emojiItem = pinupList[_emoji];
  for (var _key4 in _emojiItem) {
    var _item = _emojiItem[_key4];
    _item.img = emojiBaseUrl + "/" + _emoji + "/" + _item.file;
  }
}

exports.default = {
  emojiList: emojiList,
  pinupList: pinupList
};
module.exports = exports["default"];

/***/ }),

/***/ 360:
/* no static exports found */
/* all exports used */
/*!*******************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/components/ChatItem.vue ***!
  \*******************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 8);

var _assign2 = _interopRequireDefault(_assign);

var _utils = __webpack_require__(/*! ../../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _configs = __webpack_require__(/*! ../../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

var _emoji = __webpack_require__(/*! ../../configs/emoji */ 358);

var _emoji2 = _interopRequireDefault(_emoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audio = {
  $node: null,
  $audio: null,
  timeout: '',
  imgPlay0: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay0.gif',
  imgPlay1: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay1.gif'
};
exports.default = {
  props: {
    type: String,
    rawMsg: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    userInfos: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    myInfo: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    isRobot: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    isHistory: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    }
  },
  data: function data() {
    return {
      msg: '',
      isFullImgShow: false
    };
  },

  computed: {
    robotInfos: function robotInfos() {
      return this.$store.state.robotInfos;
    },
    teamMsgUnRead: function teamMsgUnRead() {
      var _this = this;

      var obj = !this.isHistory && this.msg.needMsgReceipt && this.msg.flow === 'out' && this.$store.state.teamMsgReads.find(function (item) {
        return item.idServer === _this.msg.idServer;
      });

      return obj ? parseInt(obj.unread) : -1;
    }
  },
  watch: {
    rawMsg: function rawMsg(newVal, oldVal) {
      var newCustom = newVal && newVal.localCustom;
      if (!newCustom || !newVal || newVal.type !== 'audio') {
        return;
      }
      var oldCustom = oldVal && oldVal.localCustom;
      if (newCustom !== oldCustom) {
        this.computedItem();
      }
    }
  },
  beforeMount: function beforeMount() {
    this.computedItem();
  },
  mounted: function mounted() {
    var _this2 = this;

    var item = this.msg;
    window.stopPlayAudio = this.stopPlayAudio.bind(this);

    this.$nextTick(function () {
      var media = null;
      if (item.type === 'image') {
        media = new Image();
        media.src = item.file.url + '?imageView&thumbnail=180x0&quality=85';
      } else if (item.type === 'custom-type1') {
        media = new Image();
        media.className = 'emoji-middle';
        media.src = item.imgUrl;
      } else if (item.type === 'custom-type3') {
        media = new Image();
        media.className = 'emoji-big';
        media.src = item.imgUrl;
      } else if (item.type === 'video') {
        if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
          media = document.createElement('video');
          media.src = item.file.url;
          media.width = 640;
          media.height = 480;
          media.autoStart = false;
          media.preload = 'metadata';
          media.controls = 'controls';
        } else {
          var aLink = document.createElement('a');
          aLink.href = item.file.url;
          aLink.target = '_blank';
          aLink.innerHTML = '<i class="u-icon icon-file"></i>' + video.name;
          _this2.$refs.mediaMsg.appendChild(aLink);
        }
      }
      if (media) {
        if (_this2.$refs.mediaMsg) {
          _this2.$refs.mediaMsg.appendChild(media);
        }
        media.onload = function () {
          _this2.$emit('msg-loaded');
        };
        media.onerror = function () {
          _this2.$emit('msg-loaded');
        };
      } else {
        _this2.$emit('msg-loaded');
      }
    });
  },

  methods: {
    computedItem: function computedItem() {
      var item = (0, _assign2.default)({}, this.rawMsg);

      if (this.type === 'session') {
        if (item.flow === 'in') {
          if (item.type === 'robot' && item.content && item.content.msgOut) {
            var robotAccid = item.content.robotAccid;
            item.avatar = this.robotInfos[robotAccid].avatar;
            item.isRobot = true;
            item.link = '#/namecard/' + robotAccid;
          } else if (item.from !== this.$store.state.userUID) {
            item.avatar = this.userInfos[item.from] && this.userInfos[item.from].avatar || _configs2.default.defaultUserIcon;
            item.link = '#/namecard/' + item.from;
          } else {
            item.avatar = this.myInfo.avatar;
          }
        } else if (item.flow === 'out') {
          item.avatar = this.myInfo.avatar;
        }
      } else {
        item.showTime = _utils2.default.formatDate(item.time);
      }
      if (item.type === 'timeTag') {
        item.showText = item.text;
      } else if (item.type === 'text') {
        item.showText = _utils2.default.escape(item.text);
        if (/\[[^\]]+\]/.test(item.showText)) {
          var emojiItems = item.showText.match(/\[[^\]]+\]/g);
          emojiItems.forEach(function (text) {
            var emojiCnt = _emoji2.default.emojiList.emoji;
            if (emojiCnt[text]) {
              item.showText = item.showText.replace(text, '<img class="emoji-small" src="' + emojiCnt[text].img + '">');
            }
          });
        }
      } else if (item.type === 'custom') {
        var content = JSON.parse(item.content);

        if (content.type === 1) {
          var data = content.data;
          var resourceUrl = _configs2.default.resourceUrl;

          item.type = 'custom-type1';
          item.imgUrl = resourceUrl + '/im/play-' + data.value + '.png';
        } else if (content.type === 3) {
          var _data = content.data;
          var emojiCnt = '';
          if (_emoji2.default.pinupList[_data.catalog]) {
            emojiCnt = _emoji2.default.pinupList[_data.catalog][_data.chartlet];

            item.type = 'custom-type3';
            item.imgUrl = '' + emojiCnt.img;
          }
        } else {
          item.showText = _utils2.default.parseCustomMsg(item);
          if (item.showText !== '[自定义消息]') {
            item.showText += ',请到手机或电脑客户端查看';
          }
        }
      } else if (item.type === 'image') {
        item.originLink = item.file.url;
      } else if (item.type === 'video') {} else if (item.type === 'audio') {
        item.width = (5.3 + Math.round(item.file.dur / 1000) * 0.03).toFixed(2) + 'rem';
        item.audioSrc = item.file.mp3Url;
        item.showText = '<i>' + Math.round(item.file.dur / 1000) + '"</i> 点击播放';
        if (!this.isHistory && nim.useDb) {
          item.unreadAudio = !item.localCustom;
        }
      } else if (item.type === 'file') {
        item.fileLink = item.file.url;
        item.showText = item.file.name;
      } else if (item.type === 'notification') {
        if (item.scene === 'team') {
          item.showText = _utils2.default.generateTeamSysmMsg(item);
        } else {
          item.showText = _utils2.default.generateChatroomSysMsg(item);
        }
      } else if (item.type === 'tip') {
        item.showText = item.tip;
      } else if (item.type === 'robot') {
        var _content = item.content || {};
        var message = _content.message || [];
        if (!_content.msgOut) {
          item.robotFlow = 'out';
          item.showText = item.text;
        } else if (_content.flag === 'bot') {
          item.subType = 'bot';
          message = message.map(function (item) {
            if (item.type === 'template') {
              return item.content.json;
            } else if (item.type === 'text' || item.type === 'answer') {
              return [{
                type: 'text',
                text: item.content
              }];
            } else if (item.type === 'image') {
              return [{
                type: 'image',
                url: item.content
              }];
            }
          });
          item.message = message;
        } else if (item.content.flag === 'faq') {
          item.subType = 'faq';
          item.query = message.query;
          var match = message.match.sort(function (a, b) {
            return b.score - a.score;
          });
          item.message = match[0];
        }
      } else {
        item.showText = '[' + _utils2.default.mapMsgType(item) + '],\u8BF7\u5230\u624B\u673A\u6216\u7535\u8111\u5BA2\u6237\u7AEF\u67E5\u770B';
      }
      this.msg = item;
    },
    revocateMsg: function revocateMsg(vNode) {
      if (this.$store.state.currSessionId) {
        if (vNode && vNode.data && vNode.data.attrs) {
          var attrs = vNode.data.attrs;
          if (attrs.type === 'robot') {
            return;
          }

          if (attrs.flow === 'out') {
            var that = this;
            this.$vux.confirm.show({
              title: '确定需要撤回消息',
              onCancel: function onCancel() {},
              onConfirm: function onConfirm() {
                that.$store.dispatch('revocateMsg', {
                  idClient: attrs.idClient
                });
              }
            });
          }
        }
      }
    },
    sendRobotBlockMsg: function sendRobotBlockMsg(msg, originMsg) {
      if (this.isHistory) {
        return;
      }
      var body = '[复杂按钮模板触发消息]';
      if (msg.text && msg.text.length === 1) {
        body = msg.text[0].text;
      }
      var robotAccid = originMsg.content.robotAccid;
      if (!this.isRobot) {
        body = '@' + this.robotInfos[robotAccid].nick + ' ' + body;
      }
      if (this.type === 'session') {
        this.$store.dispatch('sendRobotMsg', {
          type: 'link',
          scene: originMsg.scene,
          to: originMsg.to,
          robotAccid: robotAccid,

          params: msg.params,
          target: msg.target,

          body: body
        });
      } else if (this.type === 'chatroom') {
        this.$store.dispatch('sendChatroomRobotMsg', {
          type: 'link',
          robotAccid: robotAccid,

          params: msg.params,
          target: msg.target,

          body: body
        });
      }
    },
    continueRobotMsg: function continueRobotMsg(robotAccid) {
      this.$store.dispatch('continueRobotMsg', robotAccid);
    },
    showFullImg: function showFullImg(src) {
      this.$store.dispatch('showFullscreenImg', {
        src: src
      });
    },
    autoPlayNextUnreadAudio: function autoPlayNextUnreadAudio() {
      var parentNode = audio.$node && audio.$node.parentElement;
      if (!parentNode) {
        return;
      }
      var currentMsgNode = parentNode.parentElement;
      var nextMsgNode = currentMsgNode.nextElementSibling;
      var nextAudioNode;
      while (nextMsgNode) {
        if (~nextMsgNode.className.indexOf('item-you')) {
          nextAudioNode = nextMsgNode.querySelector('.msg-audio');
          if (nextAudioNode) {
            break;
          }
        }
        nextMsgNode = nextMsgNode.nextElementSibling;
      }
      if (nextMsgNode && ~nextAudioNode.className.indexOf('unreadAudio')) {
        nextAudioNode.click();
      }
    },
    playAudio: function playAudio(msg, event) {
      var _this3 = this;

      var $target;
      if (!~event.target.className.indexOf('msg-audio')) {
        $target = event.target.parentElement;
      } else {
        $target = event.target;
      }
      if (audio.$audio) {
        var targetChild1 = $target.childNodes[2];
        var sameNode = targetChild1 && targetChild1.tagName === "IMG";
        this.stopPlayAudio();
        if (sameNode) {
          return;
        }
      }
      var duration = msg.file.dur;
      if (!duration) {
        return;
      }
      audio.$audio = document.createElement('audio');
      var $source = document.createElement('source');
      var audioType = msg.file.ext;
      $source.src = msg.file.url;
      $source.type = 'audio/' + (audioType === 'mp3' ? 'mpeg' : audioType);
      audio.$audio.appendChild($source);
      audio.$audio.play();
      audio.$node = $target;
      $target.innerHTML = $target.innerHTML.replace('点击播放', '<img src="' + (msg.flow === 'in' ? audio.imgPlay1 : audio.imgPlay0) + '">');
      audio.timeout = setTimeout(function () {
        audio.$audio = null;
        _this3.canclePlayAudio();
      }, duration);
      if (~audio.$node.className.indexOf('unreadAudio')) {
        msg.localCustom = '{"audio": "played"}';
        this.$store.dispatch('updateLocalMsg', msg);
        audio.$node.className = audio.$node.className.replace('unreadAudio', '');
        audio.$audio.onended = this.autoPlayNextUnreadAudio.bind(this);
      }
    },
    canclePlayAudio: function canclePlayAudio() {
      if (audio.$node.childNodes[2]) {
        audio.$node.removeChild(audio.$node.childNodes[2]);
      }
      audio.$node.innerHTML += '点击播放';
    },
    stopPlayAudio: function stopPlayAudio() {
      if (audio.$audio) {
        audio.$audio.pause();
        this.canclePlayAudio();
        clearTimeout(audio.timeout);
        audio.$audio = null;
        audio.$node = null;
        audio.timeout = '';
      }
    },
    toMsgUnReadDetail: function toMsgUnReadDetail() {
      this.href = '#/msgReceiptDetail/' + this.msg.idServer;
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 361:
/* no static exports found */
/* all exports used */
/*!*******************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/components/ChatList.vue ***!
  \*******************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(/*! ../../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _configs = __webpack_require__(/*! ../../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

var _emoji = __webpack_require__(/*! ../../configs/emoji */ 358);

var _emoji2 = _interopRequireDefault(_emoji);

var _ChatItem = __webpack_require__(/*! ./ChatItem */ 377);

var _ChatItem2 = _interopRequireDefault(_ChatItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: {
    ChatItem: _ChatItem2.default
  },
  props: {
    type: String,
    canLoadMore: [String, Boolean],
    isRobot: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    msglist: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    userInfos: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    myInfo: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    isHistory: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    }
  },
  data: function data() {
    return {
      isFullImgShow: false,
      msgLoadedTimer: null
    };
  },

  methods: {
    showFullImg: function showFullImg(src) {
      this.$store.dispatch('showFullscreenImg', {
        src: src
      });
    },
    msgLoaded: function msgLoaded() {
      var _this = this;

      clearTimeout(this.msgLoadedTimer);
      this.msgLoadedTimer = setTimeout(function () {
        _this.$emit('msgs-loaded');
      }, 20);
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 368:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-0f617406","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatList.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-chat-list .u-icon {\n    width: 1.4rem;\n    height: 1.6rem;\n    margin-right: 0.2rem;\n    vertical-align: bottom;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/components/ChatList.vue"],"names":[],"mappings":";AA+FE;IACE,cAAc;IACd,eAAe;IACf,qBAAqB;IACrB,uBAAuB;CACxB","file":"ChatList.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-chat-list {\n  .u-icon {\n    width: 1.4rem;\n    height: 1.6rem;\n    margin-right: 0.2rem;\n    vertical-align: bottom;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 370:
/* no static exports found */
/* all exports used */
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-236c641c","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatItem.vue ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-chat-history .u-msg .msg-link[data-v-236c641c] {\n  display: none;\n}\n.p-room-chat-list .u-msg .msg-text[data-v-236c641c] {\n  max-width: 80%;\n}\n.p-room-chat-list .u-msg .msg-link[data-v-236c641c] {\n  bottom: 0;\n  right: -4rem;\n  font-size: 0.9rem;\n}\n.msg-unread[data-v-236c641c] {\n  position: relative;\n  float: right;\n  top: 0.3rem;\n  right: 0.5rem;\n  font-size: 0.9rem;\n  color: #0091e4;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/components/ChatItem.vue"],"names":[],"mappings":";AAogBI;EACE,cAAc;CACf;AAKD;EACE,eAAe;CAChB;AACD;EACE,UAAU;EACV,aAAa;EACb,kBAAkB;CACnB;AAIL;EACE,mBAAmB;EACnB,aAAa;EACb,YAAY;EACZ,cAAc;EACd,kBAAkB;EAClB,eAAe;CAChB","file":"ChatItem.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-chat-history {\n  .u-msg {\n    .msg-link {\n      display: none;\n    }\n  }\n}\n.p-room-chat-list {\n  .u-msg {\n    .msg-text {\n      max-width: 80%;\n    }\n    .msg-link {\n      bottom: 0;\n      right: -4rem;\n      font-size: 0.9rem;\n    }\n  }\n}\n\n.msg-unread {\n  position: relative;\n  float: right;\n  top: 0.3rem;\n  right: 0.5rem;\n  font-size: 0.9rem;\n  color: #0091e4;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 371:
/* no static exports found */
/* all exports used */
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-0f617406"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/components/ChatList.vue ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "m-chat-list p-chat-list",
    attrs: {
      "id": "chat-list"
    }
  }, [(_vm.canLoadMore) ? _c('li', {
    staticClass: "u-msg item-time"
  }, [_vm._v("\n    ---- 上拉加载更多 ----\n  ")]) : _c('li', {
    staticClass: "u-msg item-time"
  }, [_vm._v("\n    ---- 已无更多记录 ----\n  ")]), _vm._v(" "), _vm._l((_vm.msglist), function(msg, index) {
    return _c('chat-item', {
      key: (msg.idClient || index),
      attrs: {
        "type": _vm.type,
        "rawMsg": msg,
        "isRobot": _vm.isRobot,
        "userInfos": _vm.userInfos,
        "myInfo": _vm.myInfo,
        "isHistory": _vm.isHistory
      },
      on: {
        "msg-loaded": _vm.msgLoaded
      }
    })
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0f617406", module.exports)
  }
}

/***/ }),

/***/ 373:
/* no static exports found */
/* all exports used */
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-236c641c"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/components/ChatItem.vue ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "u-msg",
    class: {
      'item-me': _vm.msg.flow === 'out',
        'item-you': _vm.msg.flow === 'in',
        'item-time': _vm.msg.type === 'timeTag',
        'item-tip': _vm.msg.type === 'tip',
        'session-chat': _vm.type === 'session'
    }
  }, [(_vm.msg.type === 'timeTag') ? _c('div', [_vm._v("---- " + _vm._s(_vm.msg.showText) + " ----")]) : (_vm.msg.type === 'tip') ? _c('div', {
    staticClass: "tip"
  }, [_vm._v(_vm._s(_vm.msg.showText))]) : (_vm.msg.type === 'notification' && _vm.msg.scene === 'team') ? _c('div', {
    staticClass: "notification"
  }, [_vm._v(_vm._s(_vm.msg.showText))]) : (_vm.msg.flow === 'in' || _vm.msg.flow === 'out') ? _c('div', {
    directives: [{
      name: "touch",
      rawName: "v-touch:hold",
      value: (_vm.revocateMsg),
      expression: "revocateMsg",
      arg: "hold"
    }],
    attrs: {
      "idClient": _vm.msg.idClient,
      "time": _vm.msg.time,
      "flow": _vm.msg.flow,
      "type": _vm.msg.type
    }
  }, [(_vm.msg.avatar) ? _c('a', {
    staticClass: "msg-head",
    attrs: {
      "href": _vm.msg.link
    }
  }, [_c('img', {
    staticClass: "icon u-circle",
    attrs: {
      "src": _vm.msg.avatar
    }
  })]) : (_vm.msg.type !== 'notification') ? _c('p', {
    staticClass: "msg-user"
  }, [_c('em', [_vm._v(_vm._s(_vm.msg.showTime))]), _vm._v(_vm._s(_vm.msg.from))]) : _vm._e(), _vm._v(" "), (_vm.msg.type === 'text') ? _c('span', {
    staticClass: "msg-text",
    domProps: {
      "innerHTML": _vm._s(_vm.msg.showText)
    }
  }) : (_vm.msg.type === 'custom-type1') ? _c('span', {
    ref: "mediaMsg",
    staticClass: "msg-text"
  }) : (_vm.msg.type === 'custom-type3') ? _c('span', {
    ref: "mediaMsg",
    staticClass: "msg-text"
  }) : (_vm.msg.type === 'image') ? _c('span', {
    ref: "mediaMsg",
    staticClass: "msg-text",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.showFullImg(_vm.msg.originLink)
      }
    }
  }) : (_vm.msg.type === 'video') ? _c('span', {
    ref: "mediaMsg",
    staticClass: "msg-text"
  }) : (_vm.msg.type === 'audio') ? _c('span', {
    staticClass: "msg-text msg-audio",
    class: {
      'unreadAudio': _vm.msg.unreadAudio
    },
    style: ('width: ' + _vm.msg.width),
    domProps: {
      "innerHTML": _vm._s(_vm.msg.showText)
    },
    on: {
      "click": function($event) {
        _vm.playAudio(_vm.msg, $event)
      }
    }
  }) : (_vm.msg.type === 'file') ? _c('span', {
    staticClass: "msg-text"
  }, [_c('a', {
    attrs: {
      "href": _vm.msg.fileLink,
      "target": "_blank"
    }
  }, [_c('i', {
    staticClass: "u-icon icon-file"
  }), _vm._v(_vm._s(_vm.msg.showText))])]) : (_vm.msg.type === 'robot') ? _c('span', {
    staticClass: "msg-text",
    class: {
      'msg-robot': _vm.msg.robotFlow !== 'out' && !_vm.isRobot
    }
  }, [(_vm.msg.robotFlow === 'out') ? _c('div', [_vm._v(_vm._s(_vm.msg.showText))]) : (_vm.msg.subType === 'bot') ? _c('div', _vm._l((_vm.msg.message), function(tmsgs) {
    return _c('div', _vm._l((tmsgs), function(tmsg) {
      return _c('div', [(tmsg.type === 'text') ? _c('div', [_c('p', [_vm._v(_vm._s(tmsg.text))])]) : (tmsg.type === 'image') ? _c('div', [_c('p', [_c('img', {
        attrs: {
          "src": tmsg.url
        }
      })])]) : (tmsg.type === 'url') ? _c('div', [_c('a', {
        class: tmsg.style,
        attrs: {
          "href": tmsg.target,
          "target": "_blank"
        }
      }, [(tmsg.image) ? _c('div', _vm._l((tmsg.image), function(tmsg2) {
        return _c('p', [_c('img', {
          attrs: {
            "src": tmsg2.url
          }
        })])
      })) : _vm._e(), _vm._v(" "), (tmsg.text) ? _c('div', _vm._l((tmsg.text), function(tmsg2) {
        return _c('p', [_vm._v(_vm._s(tmsg2.text))])
      })) : _vm._e()])]) : (tmsg.type === 'block') ? _c('div', [_c('a', {
        class: tmsg.style,
        attrs: {
          "params": tmsg.params,
          "target": tmsg.target
        },
        on: {
          "click": function($event) {
            _vm.sendRobotBlockMsg(tmsg, _vm.msg)
          }
        }
      }, [(tmsg.image) ? _c('div', _vm._l((tmsg.image), function(tmsg2) {
        return _c('p', [_c('img', {
          attrs: {
            "src": tmsg2.url
          }
        })])
      })) : _vm._e(), _vm._v(" "), (tmsg.text) ? _c('div', _vm._l((tmsg.text), function(tmsg2) {
        return _c('p', [_vm._v(_vm._s(tmsg2.text))])
      })) : _vm._e()])]) : _vm._e()])
    }))
  })) : (_vm.msg.subType === 'faq') ? _c('div', [_c('p', [_vm._v(_vm._s(_vm.msg.message.answer))])]) : _vm._e(), _vm._v(" "), (_vm.msg.robotFlow !== 'out' && !_vm.isRobot) ? _c('span', {
    staticClass: "msg-link"
  }, [_c('a', {
    staticClass: "link-right",
    on: {
      "click": function($event) {
        _vm.continueRobotMsg(_vm.msg.content.robotAccid)
      }
    }
  }, [_vm._v("继续对话")])]) : _vm._e()]) : (_vm.msg.type === 'notification') ? _c('span', {
    staticClass: "msg-text notify"
  }, [_vm._v(_vm._s(_vm.msg.showText))]) : _c('span', {
    staticClass: "msg-text",
    domProps: {
      "innerHTML": _vm._s(_vm.msg.showText)
    }
  }), _vm._v(" "), (_vm.msg.status === 'fail') ? _c('span', {
    staticClass: "msg-failed"
  }, [_c('i', {
    staticClass: "weui-icon-warn"
  })]) : _vm._e(), _vm._v(" "), (_vm.teamMsgUnRead >= 0) ? _c('a', {
    staticClass: "msg-unread",
    attrs: {
      "href": ("#/msgReceiptDetail/" + (_vm.msg.to) + "-" + (_vm.msg.idServer))
    }
  }, [_vm._v(_vm._s(_vm.teamMsgUnRead > 0 ? (_vm.teamMsgUnRead + "人未读") : '全部已读'))]) : _vm._e()]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-236c641c", module.exports)
  }
}

/***/ }),

/***/ 374:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-0f617406","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatList.vue ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../~/css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler?{"id":"data-v-0f617406","scoped":false,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector.js?type=styles&index=0!./ChatList.vue */ 368);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../~/vue-style-loader/lib/addStylesClient.js */ 5)("c7d9600e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-0f617406\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatList.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-0f617406\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatList.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 376:
/* no static exports found */
/* all exports used */
/*!*******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-236c641c","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatItem.vue ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../~/css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler?{"id":"data-v-236c641c","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector.js?type=styles&index=0!./ChatItem.vue */ 370);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../~/vue-style-loader/lib/addStylesClient.js */ 5)("0e349adf", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-236c641c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatItem.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-236c641c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatItem.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 377:
/* no static exports found */
/* all exports used */
/*!*******************************************!*\
  !*** ./src/pages/components/ChatItem.vue ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-236c641c","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector?type=styles&index=0!./ChatItem.vue */ 376)

var Component = __webpack_require__(/*! ../../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../../~/vux-loader/src/script-loader.js!../../../~/vue-loader/lib/selector?type=script&index=0!./ChatItem.vue */ 360),
  /* template */
  __webpack_require__(/*! !../../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-236c641c"}!../../../~/vux-loader/src/before-template-compiler-loader.js!../../../~/vux-loader/src/template-loader.js!../../../~/vue-loader/lib/selector?type=template&index=0!./ChatItem.vue */ 373),
  /* scopeId */
  "data-v-236c641c",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\components\\ChatItem.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ChatItem.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-236c641c", Component.options)
  } else {
    hotAPI.reload("data-v-236c641c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 378:
/* no static exports found */
/* all exports used */
/*!*******************************************!*\
  !*** ./src/pages/components/ChatList.vue ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-0f617406","scoped":false,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector?type=styles&index=0!./ChatList.vue */ 374)

var Component = __webpack_require__(/*! ../../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../../~/vux-loader/src/script-loader.js!../../../~/vue-loader/lib/selector?type=script&index=0!./ChatList.vue */ 361),
  /* template */
  __webpack_require__(/*! !../../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-0f617406"}!../../../~/vux-loader/src/before-template-compiler-loader.js!../../../~/vux-loader/src/template-loader.js!../../../~/vue-loader/lib/selector?type=template&index=0!./ChatList.vue */ 371),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\components\\ChatList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ChatList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0f617406", Component.options)
  } else {
    hotAPI.reload("data-v-0f617406", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 436:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/ChatHistory.vue ***!
  \***********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _ChatList = __webpack_require__(/*! ./components/ChatList */ 378);

var _ChatList2 = _interopRequireDefault(_ChatList);

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _page = __webpack_require__(/*! ../utils/page */ 41);

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  beforeMount: function beforeMount() {
    if (this.$store.state.isRefresh) {
      location.href = '#/chat/' + this.sessionId;
    }
  },
  mounted: function mounted() {
    this.$store.dispatch('resetNoMoreHistoryMsgs');
    this.getHistoryMsgs();
  },
  updated: function updated() {
    var tempPagePos = _page2.default.getChatListHeight();
    _page2.default.scrollChatListDown(tempPagePos - this.currPagePos);
    this.currPagePos = tempPagePos;
  },

  components: {
    ChatList: _ChatList2.default
  },
  data: function data() {
    return {
      leftBtnOptions: {
        backText: ' ',
        preventGoBack: true
      },
      currPagePos: 0
    };
  },

  computed: {
    sessionId: function sessionId() {
      return this.$route.params.sessionId;
    },
    sessionName: function sessionName() {
      var sessionId = this.sessionId;
      var user = null;
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '');
        if (user === this.$store.state.userUID) {
          return '我的手机';
        } else if (this.isRobot) {
          return this.robotInfos[user].nick || user;
        } else {
          var userInfo = this.userInfos[user] || {};
          return _utils2.default.getFriendAlias(userInfo);
        }
      } else if (/^team-/.test(sessionId)) {
        return '历史记录';
      }
    },
    isRobot: function isRobot() {
      var sessionId = this.sessionId;
      var user = null;
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '');
        if (this.robotInfos[user]) {
          return true;
        }
      }
      return false;
    },
    myInfo: function myInfo() {
      return this.$store.state.myInfo;
    },
    userInfos: function userInfos() {
      return this.$store.state.userInfos;
    },
    msglist: function msglist() {
      var msgs = this.$store.state.currSessionMsgs;
      return msgs;
    },
    robotInfos: function robotInfos() {
      return this.$store.state.robotInfos;
    },
    scene: function scene() {
      return _utils2.default.parseSession(this.sessionId).scene;
    },
    to: function to() {
      return _utils2.default.parseSession(this.sessionId).to;
    },
    canLoadMore: function canLoadMore() {
      return !this.$store.state.noMoreHistoryMsgs;
    }
  },
  methods: {
    getHistoryMsgs: function getHistoryMsgs() {
      if (this.canLoadMore) {
        this.$store.dispatch('getHistoryMsgs', {
          scene: this.scene,
          to: this.to
        });
      }
    },
    loadMore: function loadMore() {
      if (_page2.default.getChatListScroll() <= 5) {
        this.getHistoryMsgs();
      }
    },

    onClickBack: function onClickBack() {
      window.history.go(-1);
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 473:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-7439346a","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/ChatHistory.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-chat-history .m-chat-main[data-v-7439346a] {\n    padding: 0;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/ChatHistory.vue"],"names":[],"mappings":";AA0IE;IACE,WAAW;CACZ","file":"ChatHistory.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-chat-history {\n  .m-chat-main {\n    padding: 0;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 497:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-7439346a"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/ChatHistory.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-chat-history"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": _vm.leftBtnOptions
    },
    on: {
      "on-click-back": _vm.onClickBack
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v(_vm._s(_vm.sessionName))]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "m-chat-main"
  }, [_c('chat-list', {
    directives: [{
      name: "touch",
      rawName: "v-touch:swipedown",
      value: (_vm.loadMore),
      expression: "loadMore",
      arg: "swipedown"
    }],
    ref: "chatlist",
    attrs: {
      "type": "session",
      "canLoadMore": _vm.canLoadMore,
      "msglist": _vm.msglist,
      "userInfos": _vm.userInfos,
      "myInfo": _vm.myInfo,
      "isHistory": true
    }
  })], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7439346a", module.exports)
  }
}

/***/ }),

/***/ 516:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-7439346a","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/ChatHistory.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-7439346a","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./ChatHistory.vue */ 473);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("02261fe7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-7439346a\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatHistory.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-7439346a\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatHistory.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=3.js.map