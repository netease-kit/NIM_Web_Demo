webpackJsonp([0],{

/***/ 325:
/* no static exports found */
/* all exports used */
/*!********************************!*\
  !*** ./src/pages/RoomChat.vue ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-ed15f416","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./RoomChat.vue */ 521)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./RoomChat.vue */ 442),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-ed15f416"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./RoomChat.vue */ 501),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\RoomChat.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RoomChat.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ed15f416", Component.options)
  } else {
    hotAPI.reload("data-v-ed15f416", Component.options)
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

/***/ 359:
/* no static exports found */
/* all exports used */
/*!**************************************************************!*\
  !*** ./~/core-js/library/modules/_new-promise-capability.js ***!
  \**************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(/*! ./_a-function */ 68);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


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

/***/ 363:
/* no static exports found */
/* all exports used */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_classof.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ 57);
var TAG = __webpack_require__(/*! ./_wks */ 34)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ 364:
/* no static exports found */
/* all exports used */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_perform.js ***!
  \***********************************************/
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ 365:
/* no static exports found */
/* all exports used */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/_promise-resolve.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ 35);
var isObject = __webpack_require__(/*! ./_is-object */ 18);
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ 359);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 366:
/* no static exports found */
/* all exports used */
/*!***********************************************************!*\
  !*** ./~/core-js/library/modules/_species-constructor.js ***!
  \***********************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(/*! ./_an-object */ 35);
var aFunction = __webpack_require__(/*! ./_a-function */ 68);
var SPECIES = __webpack_require__(/*! ./_wks */ 34)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ 367:
/* no static exports found */
/* all exports used */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_task.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(/*! ./_ctx */ 69);
var invoke = __webpack_require__(/*! ./_invoke */ 391);
var html = __webpack_require__(/*! ./_html */ 70);
var cel = __webpack_require__(/*! ./_dom-create */ 54);
var global = __webpack_require__(/*! ./_global */ 7);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(/*! ./_cof */ 57)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


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

/***/ 381:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/components/ChatEditor.vue ***!
  \*********************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _ChatEmoji = __webpack_require__(/*! ./ChatEmoji */ 411);

var _ChatEmoji2 = _interopRequireDefault(_ChatEmoji);

var _utils = __webpack_require__(/*! ../../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _configs = __webpack_require__(/*! ../../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

var _page = __webpack_require__(/*! ../../utils/page */ 41);

var _page2 = _interopRequireDefault(_page);

var _recorder = __webpack_require__(/*! ../../plugins/recorder.js */ 384);

var _recorder2 = _interopRequireDefault(_recorder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: {
    ChatEmoji: _ChatEmoji2.default
  },
  updated: function updated() {
    var _this = this;

    window.document.body.addEventListener('click', function () {
      _this.isEmojiShown = false;
    });
  },

  props: {
    type: String,
    scene: String,
    to: String,
    isRobot: {
      type: Boolean,
      default: function _default() {
        return false;
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
    continueRobotAccid: function continueRobotAccid(curVal, oldVal) {
      if (curVal && this.robotInfos[curVal]) {
        this.msgToSent = '@' + this.robotInfos[curVal].nick + ' ';
      }

      this.$store.dispatch('continueRobotMsg', '');
    },
    msgToSent: function msgToSent(curVal, oldVal) {
      if (this.isRobot) {
        return;
      }
      var indexAt = this.msgToSent.indexOf('@');
      if (indexAt >= 0 && indexAt === this.msgToSent.length - 1) {
        if (this.robotslist && this.robotslist.length > 0) {
          this.isRobotListShown = true;
        }
      } else if (this.isRobotListShown === true) {
        this.isRobotListShown = false;
      }
    }
  },
  data: function data() {
    var data = {
      isEmojiShown: false,
      isRobotListShown: false,
      msgToSent: '',
      icon1: _configs2.default.resourceUrl + '/im/chat-editor-1.png',
      icon2: _configs2.default.resourceUrl + '/im/chat-editor-2.png',
      icon3: _configs2.default.resourceUrl + '/im/chat-editor-3.png',
      icon4: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png',
      icon5: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png',
      sendTxt: true,
      recording: false,
      recordDisable: false,
      toRecordCount: 0,
      recordTime: 0,
      $recordTime: null,
      recordTimeout: '',
      recorder: null,
      audioContext: null
    };

    try {
      data.audioContext = new window.AudioContext();
    } catch (e) {
      data.recordDisable = true;
      console.error(e);
    }
    return data;
  },

  computed: {
    continueRobotAccid: function continueRobotAccid() {
      return this.$store.state.continueRobotAccid;
    },
    robotslist: function robotslist() {
      return this.$store.state.robotslist;
    },
    robotInfos: function robotInfos() {
      return this.$store.state.robotInfos;
    },
    robotInfosByNick: function robotInfosByNick() {
      return this.$store.state.robotInfosByNick;
    },
    supportTouch: function supportTouch() {
      return "ontouchend" in document && "ontouchstart" in document && "ontouchmove" in document ? true : false;
    }
  },
  methods: {
    sendTextMsg: function sendTextMsg() {
      if (this.invalid) {
        this.$toast(this.invalidHint);
        return;
      }
      if (/^\s*$/.test(this.msgToSent)) {
        this.$vux.alert.show({
          title: '请不要发送空消息'
        });
        return;
      } else if (this.msgToSent.length > 800) {
        this.$vux.alert.show({
          title: '请不要超过800个字'
        });
        return;
      }
      this.msgToSent = this.msgToSent.trim();
      if (this.type === 'session') {
        if (this.isRobot) {
          this.$store.dispatch('sendRobotMsg', {
            type: 'text',
            scene: this.scene,
            to: this.to,
            robotAccid: this.to,

            content: this.msgToSent,

            body: this.msgToSent
          });
        } else {
          var robotAccid = '';
          var robotText = '';

          var atUsers = this.msgToSent.match(/@[^\s@$]+/g);
          if (atUsers) {
            for (var i = 0; i < atUsers.length; i++) {
              var item = atUsers[i].replace('@', '');
              if (this.robotInfosByNick[item]) {
                robotAccid = this.robotInfosByNick[item].account;
                robotText = (this.msgToSent + '').replace(atUsers[i], '').trim();
                break;
              }
            }
          }
          if (robotAccid) {
            if (robotText) {
              this.$store.dispatch('sendRobotMsg', {
                type: 'text',
                scene: this.scene,
                to: this.to,
                robotAccid: robotAccid,

                content: robotText,

                body: this.msgToSent
              });
            } else {
              this.$store.dispatch('sendRobotMsg', {
                type: 'welcome',
                scene: this.scene,
                to: this.to,
                robotAccid: robotAccid,

                body: this.msgToSent
              });
            }
          } else {
            this.$store.dispatch('sendMsg', {
              type: 'text',
              scene: this.scene,
              to: this.to,
              text: this.msgToSent
            });
          }
        }
      } else if (this.type === 'chatroom') {
        var _robotAccid = '';
        var _robotText = '';

        var _atUsers = this.msgToSent.match(/@[^\s@$]+/g);
        if (_atUsers) {
          for (var _i = 0; _i < _atUsers.length; _i++) {
            var _item = _atUsers[_i].replace('@', '');
            if (this.robotInfosByNick[_item]) {
              _robotAccid = this.robotInfosByNick[_item].account;
              _robotText = (this.msgToSent + '').replace(_atUsers[_i], '').trim();
              break;
            }
          }
        }
        if (_robotAccid) {
          if (_robotText) {
            this.$store.dispatch('sendChatroomRobotMsg', {
              type: 'text',
              robotAccid: _robotAccid,

              content: _robotText,

              body: this.msgToSent
            });
          } else {
            this.$store.dispatch('sendChatroomRobotMsg', {
              type: 'welcome',
              robotAccid: _robotAccid,

              body: this.msgToSent
            });
          }
        } else {
          this.$store.dispatch('sendChatroomMsg', {
            type: 'text',
            text: this.msgToSent
          });
        }
      }
      this.msgToSent = '';
    },
    sendPlayMsg: function sendPlayMsg() {
      if (this.invalid) {
        this.$toast(this.invalidHint);
        return;
      }

      if (this.type === 'session') {
        this.$store.dispatch('sendMsg', {
          type: 'custom',
          scene: this.scene,
          to: this.to,
          pushContent: '[猜拳]',
          content: {
            type: 1,
            data: {
              value: Math.ceil(Math.random() * 3)
            }
          }
        });
      } else if (this.type === 'chatroom') {
        this.$store.dispatch('sendChatroomMsg', {
          type: 'custom',
          pushContent: '[猜拳]',
          content: {
            type: 1,
            data: {
              value: Math.ceil(Math.random() * 3)
            }
          }
        });
      }
    },
    sendFileMsg: function sendFileMsg() {
      if (this.invalid) {
        this.$toast(this.invalidHint);
        return;
      }
      var ipt = this.$refs.fileToSent;
      if (ipt.value) {
        if (this.type === 'session') {
          this.$store.dispatch('sendFileMsg', {
            scene: this.scene,
            to: this.to,
            fileInput: ipt
          });
        } else if (this.type === 'chatroom') {
          this.$store.dispatch('sendChatroomFileMsg', {
            fileInput: ipt
          });
        }
      }
    },
    showEmoji: function showEmoji() {
      this.isEmojiShown = true;
    },
    hideEmoji: function hideEmoji() {
      this.isEmojiShown = false;
    },
    addEmoji: function addEmoji(emojiName) {
      this.msgToSent += emojiName;
      this.hideEmoji();
    },
    chooseRobot: function chooseRobot(robot) {
      if (robot && robot.account) {
        var len = this.msgToSent.length;
        if (len === 0 || this.msgToSent[len - 1] !== '@') {
          this.msgToSent += '@' + robot.nick + ' ';
        }{
          this.msgToSent += robot.nick + ' ';
        }
      }
    },
    hideRobotList: function hideRobotList() {
      this.isRobotListShown = false;
    },
    onInputFocus: function onInputFocus(e) {
      setTimeout(function () {
        e.target.scrollIntoView();
        _page2.default.scrollChatListDown();
      }, 200);
    },
    turnToMsgReceipt: function turnToMsgReceipt() {
      if (this.invalid) {
        this.$toast(this.invalidHint);
        return;
      }
      location = '#/teamSendMsgReceipt/' + this.to;
    },
    swicthMsgType: function swicthMsgType() {
      this.sendTxt = !this.sendTxt;
    },
    toRecord: function toRecord() {
      var self = this;
      self.toRecordCount++;
      if (window.stopPlayAudio) {
        window.stopPlayAudio();
      }
      if (location.protocol === 'http:') {
        self.$toast('请使用https协议');
        return;
      }
      if (self.recording) {
        return;
      }
      if (self.toRecordCount > 1 && !self.recorder) {
        self.recordDisable = true;
      }
      if (self.recordDisable || !self.audioContext || !window.AudioContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        self.$toast('当前浏览器不支持录音');
        return;
      }
      if (self.recorder) {
        self.recorder.record();
        self.resumeAudioContext();
      } else {
        var failed = function failed() {
          self.recordDisable = true;
          self.$toast('当前浏览器不支持录音');
        };

        try {
          var value = navigator.mediaDevices.getUserMedia({
            audio: true
          }).then(function (stream) {
            var input;
            try {
              input = self.audioContext.createMediaStreamSource(stream);
              self.recorder = new _recorder2.default(input);
              self.recorder.record();
              self.resumeAudioContext();
              if (!self.recorder) {
                failed();
              }
            } catch (e) {
              failed();
            }
          }).catch(function (err) {
            self.$toast('没有权限获取麦克风');
            self.recordDisable = true;
            console.log('No live audio input: ' + err, err.name + ": " + err.message);
          });
        } catch (e) {
          failed();
        }
      }
    },
    runRecorderTime: function runRecorderTime() {
      var _this2 = this;

      if (this.recorder) {
        this.recording = true;
        this.recordTime = 0;
        setTimeout(function () {
          _this2.$recordTime = document.getElementById('recordTime');
        }, 800);
        this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000);
      }
    },
    resumeAudioContext: function resumeAudioContext() {
      var _this3 = this;

      if (this.audioContext && ~this.audioContext.state.indexOf('suspend')) {
        this.audioContext.resume().then(function () {
          console.log('audioContext suspend state resume');
          _this3.recorder.record();
          _this3.runRecorderTime();
        });
      } else {
        this.runRecorderTime();
      }
    },
    runRecordDuration: function runRecordDuration() {
      this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000);
      this.recordTime++;
      if (this.recordTime >= 60) {
        clearTimeout(this.recordTimeout);
        this.sendRecord();
      }
      this.$recordTime.innerText = '00:' + (this.recordTime > 9 ? this.recordTime : '0' + this.recordTime);
    },
    siwtchRecord: function siwtchRecord() {
      if (this.recording) {
        this.sendRecordMsg();
      } else {
        this.toRecord();
      }
    },
    cancelRecord: function cancelRecord() {
      if (this.recording) {
        this.recording = false;
        clearTimeout(this.recordTimeout);
        if (this.$recordTime) {
          this.$recordTime.innerText = '00:00';
        }
        this.recorder.stop();
        this.recorder.clear();
      }
    },
    sendRecordMsg: function sendRecordMsg() {
      setTimeout(this.sendRecord, 500);
    },
    sendRecord: function sendRecord() {
      var _this4 = this;

      if (this.recording) {
        clearTimeout(this.recordTimeout);
        if (this.recordTime < 2) {
          this.$toast('语音消息最短2s');
          this.cancelRecord();
          return;
        }
        this.recording = false;
        this.$recordTime.innerText = '00:00';
        this.recorder.stop();
        this.recorder.exportWAV(function (blob) {
          _this4.$store.dispatch('showLoading');
          _this4.$store.dispatch('sendFileMsg', {
            scene: _this4.scene,
            to: _this4.to,
            type: 'audio',
            blob: blob,
            uploadprogress: function uploadprogress(obj) {
              console.log('文件总大小: ' + obj.total + 'bytes');
              console.log('已经上传的大小: ' + obj.loaded + 'bytes');
              console.log('上传进度: ' + obj.percentage);
              console.log('上传进度文本: ' + obj.percentageText);
              if (obj.percentage === 100) {
                _this4.$store.dispatch('hideLoading');
              }
            },
            uploaderror: function uploaderror() {
              console && console.log('上传失败');
            },
            uploaddone: function uploaddone(error, file) {
              console.log(error);
            }
          });
        });
        this.recorder.clear();
      }
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 382:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/components/ChatEmoji.vue ***!
  \********************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _emoji = __webpack_require__(/*! ../../configs/emoji */ 358);

var _emoji2 = _interopRequireDefault(_emoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function genEmojiList(type, emojiList) {
  var result = {};
  for (var name in emojiList) {
    var emojiMap = emojiList[name];
    var list = [];
    for (var key in emojiMap) {
      list.push({
        type: type,
        name: name,
        key: key,
        img: emojiMap[key].img
      });
    }
    if (list.length > 0) {
      result[name] = {
        type: type,
        name: name,
        list: list,
        album: list[0].img
      };
    }
  }
  return result;
}

exports.default = {
  props: {
    type: String,
    scene: String,
    to: String
  },
  data: function data() {
    return {
      currType: 'emoji',
      currAlbum: 'emoji'
    };
  },

  computed: {
    emoji: function emoji() {
      return genEmojiList('emoji', _emoji2.default.emojiList);
    },
    pinup: function pinup() {
      return genEmojiList('pinup', _emoji2.default.pinupList);
    },
    currEmoji: function currEmoji() {
      if (this.currType === 'emoji') {
        return this.emoji[this.currAlbum];
      } else if (this.currType === 'pinup') {
        return this.pinup[this.currAlbum];
      }
      return [];
    }
  },
  methods: {
    selectAlbum: function selectAlbum(album) {
      this.currType = album.type;
      this.currAlbum = album.name;
    },
    selectEmoji: function selectEmoji(emoji) {
      if (this.currType === 'emoji') {
        this.$emit('add-emoji', emoji.key);
      } else if (this.currType === 'pinup') {
        if (this.type === 'session') {
          this.$store.dispatch('sendMsg', {
            type: 'custom',
            scene: this.scene,
            to: this.to,
            pushContent: '[贴图表情]',
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key
              }
            }
          });
        } else if (this.type === 'chatroom') {
          this.$store.dispatch('sendChatroomMsg', {
            type: 'custom',
            pushContent: '[贴图表情]',
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key
              }
            }
          });
        }
        this.$emit('hide-emoji');
      }
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 383:
/* no static exports found */
/* all exports used */
/*!**************************************!*\
  !*** ./src/plugins/inline-worker.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

function InlineWorker(func, self) {
  var _this = this;
  var functionBody;

  self = self || {};

  if (WORKER_ENABLED) {
    functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];

    return new global.Worker(global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" })));
  }

  function postMessage(data) {
    setTimeout(function () {
      _this.onmessage({ data: data });
    }, 0);
  }

  this.self = self;
  this.self.postMessage = postMessage;

  setTimeout(func.bind(self, self), 0);
}

InlineWorker.prototype.postMessage = function postMessage(data) {
  var _this = this;

  setTimeout(function () {
    _this.self.onmessage({ data: data });
  }, 0);
};

module.exports = InlineWorker;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../~/webpack/buildin/global.js */ 20)))

/***/ }),

/***/ 384:
/* no static exports found */
/* all exports used */
/*!*********************************!*\
  !*** ./src/plugins/recorder.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 386);

var _promise2 = _interopRequireDefault2(_promise);

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 8);

var _assign2 = _interopRequireDefault2(_assign);

var _defineProperty = __webpack_require__(/*! babel-runtime/core-js/object/define-property */ 385);

var _defineProperty2 = _interopRequireDefault2(_defineProperty);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Recorder = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _inlineWorker = __webpack_require__(/*! ./inline-worker */ 383);

var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Recorder = exports.Recorder = function () {
    function Recorder(source, cfg) {
        var _this = this;

        _classCallCheck(this, Recorder);

        this.config = {
            bufferLen: 4096,
            numChannels: 2,
            mimeType: 'audio/wav'
        };
        this.recording = false;
        this.callbacks = {
            getBuffer: [],
            exportWAV: []
        };

        (0, _assign2.default)(this.config, cfg);
        this.context = source.context;
        this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

        this.node.onaudioprocess = function (e) {
            if (!_this.recording) return;

            var buffer = [];
            for (var channel = 0; channel < _this.config.numChannels; channel++) {
                buffer.push(e.inputBuffer.getChannelData(channel));
            }
            _this.worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);

        var self = {};
        this.worker = new _inlineWorker2.default(function () {
            var recLength = 0,
                recBuffers = [],
                sampleRate = void 0,
                numChannels = void 0;

            this.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'record':
                        record(e.data.buffer);
                        break;
                    case 'exportWAV':
                        exportWAV(e.data.type);
                        break;
                    case 'getBuffer':
                        getBuffer();
                        break;
                    case 'clear':
                        clear();
                        break;
                }
            };

            function init(config) {
                sampleRate = config.sampleRate;
                numChannels = config.numChannels;
                initBuffers();
            }

            function record(inputBuffer) {
                for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel].push(inputBuffer[channel]);
                }
                recLength += inputBuffer[0].length;
            }

            function exportWAV(type) {
                var buffers = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                var interleaved = void 0;
                if (numChannels === 2) {
                    interleaved = interleave(buffers[0], buffers[1]);
                } else {
                    interleaved = buffers[0];
                }
                var dataview = encodeWAV(interleaved);
                var audioBlob = new Blob([dataview], { type: type });

                this.postMessage({ command: 'exportWAV', data: audioBlob });
            }

            function getBuffer() {
                var buffers = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                this.postMessage({ command: 'getBuffer', data: buffers });
            }

            function clear() {
                recLength = 0;
                recBuffers = [];
                initBuffers();
            }

            function initBuffers() {
                for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel] = [];
                }
            }

            function mergeBuffers(recBuffers, recLength) {
                var result = new Float32Array(recLength);
                var offset = 0;
                for (var i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                }
                return result;
            }

            function interleave(inputL, inputR) {
                var length = inputL.length + inputR.length;
                var result = new Float32Array(length);

                var index = 0,
                    inputIndex = 0;

                while (index < length) {
                    result[index++] = inputL[inputIndex];
                    result[index++] = inputR[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function floatTo16BitPCM(output, offset, input) {
                for (var i = 0; i < input.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }

            function writeString(view, offset, string) {
                for (var i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            function encodeWAV(samples) {
                var buffer = new ArrayBuffer(44 + samples.length * 2);
                var view = new DataView(buffer);

                writeString(view, 0, 'RIFF');

                view.setUint32(4, 36 + samples.length * 2, true);

                writeString(view, 8, 'WAVE');

                writeString(view, 12, 'fmt ');

                view.setUint32(16, 16, true);

                view.setUint16(20, 1, true);

                view.setUint16(22, numChannels, true);

                view.setUint32(24, sampleRate, true);

                view.setUint32(28, sampleRate * 4, true);

                view.setUint16(32, numChannels * 2, true);

                view.setUint16(34, 16, true);

                writeString(view, 36, 'data');

                view.setUint32(40, samples.length * 2, true);

                floatTo16BitPCM(view, 44, samples);

                return view;
            }
        }, self);

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                numChannels: this.config.numChannels
            }
        });

        this.worker.onmessage = function (e) {
            var cb = _this.callbacks[e.data.command].pop();
            if (typeof cb == 'function') {
                cb(e.data.data);
            }
        };
    }

    _createClass(Recorder, [{
        key: 'record',
        value: function record() {
            this.recording = true;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.recording = false;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.worker.postMessage({ command: 'clear' });
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer(cb) {
            cb = cb || this.config.callback;
            if (!cb) throw new Error('Callback not set');

            this.callbacks.getBuffer.push(cb);

            this.worker.postMessage({ command: 'getBuffer' });
        }
    }, {
        key: 'exportWAV',
        value: function exportWAV(cb, mimeType) {
            mimeType = mimeType || this.config.mimeType;
            cb = cb || this.config.callback;
            if (!cb) throw new Error('Callback not set');

            this.callbacks.exportWAV.push(cb);

            this.worker.postMessage({
                command: 'exportWAV',
                type: mimeType
            });
        }
    }], [{
        key: 'forceDownload',
        value: function forceDownload(blob, filename) {
            var url = (window.URL || window.webkitURL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = url;
            link.download = filename || 'output.wav';
            var click = document.createEvent("Event");
            click.initEvent("click", true, true);
            link.dispatchEvent(click);
        }
    }]);
    return Recorder;
}();

if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
            new Error('getUserMedia is not implemented in this browser');
            return;
        }

        return new _promise2.default(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    };
}
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.URL = window.URL || window.webkitURL;
if (!window.AudioContext) {
    new Error('AudioContext is not implemented in this browser');
}
if (!window.URL) {
    new Error('URL is not implemented in this browser');
}

exports.default = Recorder;

/***/ }),

/***/ 385:
/* no static exports found */
/* all exports used */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/core-js/object/define-property.js ***!
  \***********************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ 387), __esModule: true };

/***/ }),

/***/ 386:
/* no static exports found */
/* all exports used */
/*!********************************************!*\
  !*** ./~/babel-runtime/core-js/promise.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/promise */ 388), __esModule: true };

/***/ }),

/***/ 387:
/* no static exports found */
/* all exports used */
/*!********************************************************!*\
  !*** ./~/core-js/library/fn/object/define-property.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ 400);
var $Object = __webpack_require__(/*! ../../modules/_core */ 3).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 388:
/* no static exports found */
/* all exports used */
/*!*****************************************!*\
  !*** ./~/core-js/library/fn/promise.js ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/es6.object.to-string */ 101);
__webpack_require__(/*! ../modules/es6.string.iterator */ 102);
__webpack_require__(/*! ../modules/web.dom.iterable */ 103);
__webpack_require__(/*! ../modules/es6.promise */ 401);
__webpack_require__(/*! ../modules/es7.promise.finally */ 402);
__webpack_require__(/*! ../modules/es7.promise.try */ 403);
module.exports = __webpack_require__(/*! ../modules/_core */ 3).Promise;


/***/ }),

/***/ 389:
/* no static exports found */
/* all exports used */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_an-instance.js ***!
  \***************************************************/
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ 390:
/* no static exports found */
/* all exports used */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_for-of.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(/*! ./_ctx */ 69);
var call = __webpack_require__(/*! ./_iter-call */ 393);
var isArrayIter = __webpack_require__(/*! ./_is-array-iter */ 392);
var anObject = __webpack_require__(/*! ./_an-object */ 35);
var toLength = __webpack_require__(/*! ./_to-length */ 71);
var getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ 399);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ 391:
/* no static exports found */
/* all exports used */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_invoke.js ***!
  \**********************************************/
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ 392:
/* no static exports found */
/* all exports used */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_is-array-iter.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(/*! ./_iterators */ 58);
var ITERATOR = __webpack_require__(/*! ./_wks */ 34)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ 393:
/* no static exports found */
/* all exports used */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iter-call.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ 35);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ 394:
/* no static exports found */
/* all exports used */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-detect.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(/*! ./_wks */ 34)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ 395:
/* no static exports found */
/* all exports used */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_microtask.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ 7);
var macrotask = __webpack_require__(/*! ./_task */ 367).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(/*! ./_cof */ 57)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ 396:
/* no static exports found */
/* all exports used */
/*!****************************************************!*\
  !*** ./~/core-js/library/modules/_redefine-all.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(/*! ./_hide */ 19);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),

/***/ 397:
/* no static exports found */
/* all exports used */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_set-species.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ./_global */ 7);
var core = __webpack_require__(/*! ./_core */ 3);
var dP = __webpack_require__(/*! ./_object-dp */ 14);
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ 10);
var SPECIES = __webpack_require__(/*! ./_wks */ 34)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ 398:
/* no static exports found */
/* all exports used */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_user-agent.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ 7);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ 399:
/* no static exports found */
/* all exports used */
/*!***************************************************************!*\
  !*** ./~/core-js/library/modules/core.get-iterator-method.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ 363);
var ITERATOR = __webpack_require__(/*! ./_wks */ 34)('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ 58);
module.exports = __webpack_require__(/*! ./_core */ 3).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 400:
/* no static exports found */
/* all exports used */
/*!*****************************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.define-property.js ***!
  \*****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ 17);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 10), 'Object', { defineProperty: __webpack_require__(/*! ./_object-dp */ 14).f });


/***/ }),

/***/ 401:
/* no static exports found */
/* all exports used */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/es6.promise.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ 36);
var global = __webpack_require__(/*! ./_global */ 7);
var ctx = __webpack_require__(/*! ./_ctx */ 69);
var classof = __webpack_require__(/*! ./_classof */ 363);
var $export = __webpack_require__(/*! ./_export */ 17);
var isObject = __webpack_require__(/*! ./_is-object */ 18);
var aFunction = __webpack_require__(/*! ./_a-function */ 68);
var anInstance = __webpack_require__(/*! ./_an-instance */ 389);
var forOf = __webpack_require__(/*! ./_for-of */ 390);
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ 366);
var task = __webpack_require__(/*! ./_task */ 367).set;
var microtask = __webpack_require__(/*! ./_microtask */ 395)();
var newPromiseCapabilityModule = __webpack_require__(/*! ./_new-promise-capability */ 359);
var perform = __webpack_require__(/*! ./_perform */ 364);
var userAgent = __webpack_require__(/*! ./_user-agent */ 398);
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ 365);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(/*! ./_wks */ 34)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(/*! ./_redefine-all */ 396)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(/*! ./_set-to-string-tag */ 59)($Promise, PROMISE);
__webpack_require__(/*! ./_set-species */ 397)(PROMISE);
Wrapper = __webpack_require__(/*! ./_core */ 3)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(/*! ./_iter-detect */ 394)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ 402:
/* no static exports found */
/* all exports used */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/es7.promise.finally.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(/*! ./_export */ 17);
var core = __webpack_require__(/*! ./_core */ 3);
var global = __webpack_require__(/*! ./_global */ 7);
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ 366);
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ 365);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ 403:
/* no static exports found */
/* all exports used */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/es7.promise.try.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(/*! ./_export */ 17);
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ 359);
var perform = __webpack_require__(/*! ./_perform */ 364);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ 404:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-23f73ce8","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatEditor.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.robot.m-chat-editor-main[data-v-23f73ce8] {\n  /*.u-editor-input {\n    padding-right: 4.5rem;\n  }\n  .u-editor-icons {\n    width: 4rem;\n  }*/\n}\n.m-chat-robot[data-v-23f73ce8] {\n  overflow-y: scroll;\n}\n.m-chat-robot .weui-cells .weui-cell__hd[data-v-23f73ce8] {\n  margin-right: 0.5rem;\n}\n.u-editor-send.u-editor-receipt[data-v-23f73ce8] {\n  background-color: #fefefe;\n  border: #ccc solid 1px;\n  color: black;\n  padding: 0.1rem;\n  margin-left: .1rem;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/components/ChatEditor.vue"],"names":[],"mappings":";AAugBA;EACE;;;;;KAKG;CACJ;AACD;EACE,mBAAmB;CAMpB;AAJG;EACE,qBAAqB;CACtB;AAIL;EACE,0BAA0B;EAC1B,uBAAuB;EACvB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;CACpB","file":"ChatEditor.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.robot.m-chat-editor-main {\n  /*.u-editor-input {\n    padding-right: 4.5rem;\n  }\n  .u-editor-icons {\n    width: 4rem;\n  }*/\n}\n.m-chat-robot {\n  overflow-y: scroll;\n  .weui-cells {\n    .weui-cell__hd {\n      margin-right: 0.5rem;\n    }\n  }\n}\n\n.u-editor-send.u-editor-receipt {\n  background-color: #fefefe;\n  border: #ccc solid 1px;\n  color: black;\n  padding: 0.1rem;\n  margin-left: .1rem;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 405:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-7c971212","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatEmoji.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.m-chat-emoji {\n  position: absolute;\n  top: -12rem;\n  height: 12rem;\n  left: 0;\n  width: 100%;\n  border-top: 1px solid #ccc;\n  background-color: #fff;\n}\n.m-chat-emoji .emoji-channel {\n  position: relative;\n  width: 100%;\n  height: auto;\n  margin: 0 1rem;\n}\n.m-chat-emoji .emoji-channel .emoji-album {\n  display: inline-block;\n  padding: 0.1rem;\n  width: 1.8rem;\n  height: 1.8rem;\n  border-right: 1px solid #f0f0f0;\n}\n.m-chat-emoji .emoji-channel .emoji-album img {\n  margin: 0;\n  display: block;\n  width: inherit;\n  height: inherit;\n}\n.m-chat-emoji .emoji-channel .emoji-album.active {\n  background-color: #f0f0f0;\n}\n.m-chat-emoji .emoji-content {\n  position: relative;\n  width: 100%;\n  height: 10rem;\n  background-color: #f0f0f0;\n  overflow-y: auto;\n}\n.m-chat-emoji .emoji-content .cnt {\n  position: relative;\n  display: block;\n  margin: 0.4rem auto;\n  text-align: left;\n}\n.m-chat-emoji .emoji-content .emoji-item {\n  display: inline-block;\n  width: 28px;\n  height: 28px;\n  padding: 2px;\n  vertical-align: middle;\n  /*border: 1px solid #fff;*/\n  /*margin-left: -1px;*/\n}\n/*margin-bottom: -1px;*/\n.m-chat-emoji .emoji-content .emoji-item img {\n  width: inherit;\n  height: inherit;\n}\n.m-chat-emoji .emoji-content .pinup-item {\n  width: 44px;\n  height: 44px;\n}\n@media screen and (min-width: 300px) and (max-width: 420px) {\n  .m-chat-emoji .emoji-content .cnt {\n    width: 300px;\n  }\n}\n@media screen and (min-width: 420px) and (max-width: 600px) {\n  .m-chat-emoji .emoji-content .cnt {\n    width: 420px;\n  }\n}\n@media screen and (min-width: 600px) and (max-width: 720px) {\n  .m-chat-emoji .emoji-content .cnt {\n    width: 600px;\n  }\n}\n@media screen and (min-width: 720px) and (max-width: 1080px) {\n  .m-chat-emoji .emoji-content .cnt {\n    width: 720px;\n  }\n}\n@media screen and (min-width: 1080px){\n  .m-chat-emoji .emoji-content .cnt {\n    width: 1080px;\n  }\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/components/ChatEmoji.vue"],"names":[],"mappings":";AAwHA;EACE,mBAAmB;EACnB,YAAY;EACZ,cAAc;EACd,QAAQ;EACR,YAAY;EACZ,2BAA2B;EAC3B,uBAAuB;CAoFxB;AAnFC;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,eAAe;CAiBhB;AAhBC;EACE,sBAAsB;EACtB,gBAAgB;EAChB,cAAc;EACd,eAAe;EACf,gCAAgC;CAUjC;AATC;EACE,UAAU;EACV,eAAe;EACf,eAAe;EACf,gBAAgB;CACjB;AACD;EACE,0BAA0B;CAC3B;AAGL;EACE,mBAAmB;EACnB,YAAY;EACZ,cAAc;EACd,0BAA0B;EAC1B,iBAAiB;CAyBlB;AAxBC;EACE,mBAAmB;EACnB,eAAe;EACf,oBAAoB;EACpB,iBAAiB;CAClB;AACD;EACE,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,aAAa;EACb,uBAAuB;EACvB,2BAA2B;EAC3B,sBAAsB;CAMvB;AALC,wBAAwB;AACxB;EACE,eAAe;EACf,gBAAgB;CACjB;AAEH;EACE,YAAY;EACZ,aAAa;CACd;AAGH;EACE;IACE,aAAa;GACd;CACF;AAED;EACE;IACE,aAAa;GACd;CACF;AAED;EACE;IACE,aAAa;GACd;CACF;AAED;EACE;IACE,aAAa;GACd;CACF;AAED;EACE;IACE,cAAc;GACf;CACF","file":"ChatEmoji.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.m-chat-emoji {\n  position: absolute;\n  top: -12rem;\n  height: 12rem;\n  left: 0;\n  width: 100%;\n  border-top: 1px solid #ccc;\n  background-color: #fff;\n  .emoji-channel {\n    position: relative;\n    width: 100%;\n    height: auto;\n    margin: 0 1rem;\n    .emoji-album {\n      display: inline-block;\n      padding: 0.1rem;\n      width: 1.8rem;\n      height: 1.8rem;\n      border-right: 1px solid #f0f0f0;\n      img {\n        margin: 0;\n        display: block;\n        width: inherit;\n        height: inherit;\n      }\n      &.active {\n        background-color: #f0f0f0;\n      }\n    }\n  }\n  .emoji-content {\n    position: relative;\n    width: 100%;\n    height: 10rem;\n    background-color: #f0f0f0;\n    overflow-y: auto;\n    .cnt {\n      position: relative;\n      display: block;\n      margin: 0.4rem auto;\n      text-align: left;\n    }\n    .emoji-item {\n      display: inline-block;\n      width: 28px;\n      height: 28px;\n      padding: 2px;\n      vertical-align: middle;\n      /*border: 1px solid #fff;*/\n      /*margin-left: -1px;*/\n      /*margin-bottom: -1px;*/\n      img {\n        width: inherit;\n        height: inherit;\n      }\n    }\n    .pinup-item {\n      width: 44px;\n      height: 44px;\n    }\n  }\n\n  @media screen and (min-width: 300px) and (max-width: 420px) {\n    .emoji-content .cnt {\n      width: 300px;\n    }\n  }\n\n  @media screen and (min-width: 420px) and (max-width: 600px) {\n    .emoji-content .cnt {\n      width: 420px;\n    }\n  }\n\n  @media screen and (min-width: 600px) and (max-width: 720px) {\n    .emoji-content .cnt {\n      width: 600px;\n    }\n  }\n\n  @media screen and (min-width: 720px) and (max-width: 1080px) {\n    .emoji-content .cnt {\n      width: 720px;\n    }\n  }\n\n  @media screen and (min-width: 1080px){\n    .emoji-content .cnt {\n      width: 1080px;\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 406:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-23f73ce8"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/components/ChatEditor.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "m-chat-editor",
    on: {
      "click": _vm.hideRobotList
    }
  }, [_c('chat-emoji', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isEmojiShown),
      expression: "isEmojiShown"
    }],
    attrs: {
      "type": _vm.type,
      "scene": _vm.scene,
      "to": _vm.to
    },
    on: {
      "add-emoji": _vm.addEmoji,
      "hide-emoji": _vm.hideEmoji
    }
  }), _vm._v(" "), _c('group', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isRobotListShown),
      expression: "isRobotListShown"
    }],
    staticClass: "m-chat-emoji m-chat-robot"
  }, _vm._l((_vm.robotslist), function(robot) {
    return _c('cell', {
      key: robot.account,
      attrs: {
        "title": robot.nick
      },
      nativeOn: {
        "click": function($event) {
          _vm.chooseRobot(robot)
        }
      }
    }, [_c('img', {
      staticClass: "icon u-circle",
      attrs: {
        "slot": "icon",
        "width": "20",
        "height": "20",
        "src": robot.avatar
      },
      slot: "icon"
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "m-chat-editor-main",
    class: {
      robot: _vm.isRobot
    }
  }, [_c('span', {
    staticClass: "u-editor-input"
  }, [(_vm.sendTxt) ? _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.msgToSent),
      expression: "msgToSent"
    }],
    domProps: {
      "value": (_vm.msgToSent)
    },
    on: {
      "focus": _vm.onInputFocus,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.msgToSent = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.supportTouch && !_vm.sendTxt) ? _c('i', {
    directives: [{
      name: "touch",
      rawName: "v-touch:swipeup",
      value: (_vm.cancelRecord),
      expression: "cancelRecord",
      arg: "swipeup"
    }],
    staticClass: "u-btn-record",
    class: {
      'recording': _vm.recording, 'disabled': _vm.recordDisable
    },
    on: {
      "touchstart": function($event) {
        $event.preventDefault();
        return _vm.toRecord($event)
      },
      "touchend": function($event) {
        $event.preventDefault();
        return _vm.sendRecordMsg($event)
      }
    }
  }, [(_vm.recording) ? _c('b', [_vm._v("松开结束")]) : _c('b', [_vm._v("按下说话")]), _vm._v(" "), (_vm.recording) ? _c('a', {
    staticClass: "u-record-time",
    attrs: {
      "id": "recordTime"
    }
  }, [_vm._v("00:00")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (!_vm.supportTouch && !_vm.sendTxt) ? _c('i', {
    staticClass: "u-btn-record",
    class: {
      'recording': _vm.recording, 'disabled': _vm.recordDisable
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.siwtchRecord($event)
      }
    }
  }, [(_vm.recording) ? _c('b', [_vm._v("点击发送")]) : _c('b', [_vm._v("点击说话")]), _vm._v(" "), (_vm.recording) ? _c('a', {
    staticClass: "u-record-time with-close-btn",
    attrs: {
      "id": "recordTime"
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.cancelRecord($event)
      }
    }
  }, [_vm._v("00:00")]) : _vm._e()]) : _vm._e()]), _vm._v(" "), _c('span', {
    staticClass: "u-editor-icons"
  }, [(_vm.sendTxt) ? _c('span', {
    staticClass: "u-editor-icon",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.swicthMsgType($event)
      }
    }
  }, [_c('i', {
    staticClass: "u-icon-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.icon5
    }
  })])]) : _c('span', {
    staticClass: "u-editor-icon",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.swicthMsgType($event)
      }
    }
  }, [_c('i', {
    staticClass: "u-icon-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.icon4
    }
  })])]), _vm._v(" "), (!_vm.isRobot) ? _c('span', {
    staticClass: "u-editor-icon",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.showEmoji($event)
      }
    }
  }, [_c('i', {
    staticClass: "u-icon-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.icon1
    }
  })])]) : _vm._e(), _vm._v(" "), (!_vm.isRobot) ? _c('span', {
    staticClass: "u-editor-icon",
    on: {
      "change": _vm.sendFileMsg
    }
  }, [_c('i', {
    staticClass: "u-icon-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.icon2
    }
  })]), _vm._v(" "), _c('input', {
    ref: "fileToSent",
    attrs: {
      "type": "file"
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.isRobot && !_vm.advancedTeam) ? _c('span', {
    staticClass: "u-editor-icon",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.sendPlayMsg($event)
      }
    }
  }, [_c('i', {
    staticClass: "u-icon-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.icon3
    }
  })])]) : _vm._e(), _vm._v(" "), (_vm.advancedTeam) ? _c('span', {
    staticClass: "u-editor-send u-editor-receipt",
    on: {
      "click": _vm.turnToMsgReceipt
    }
  }, [_vm._v("回执")]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "u-editor-send",
    on: {
      "click": _vm.sendTextMsg
    }
  }, [_vm._v("发 送")])])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-23f73ce8", module.exports)
  }
}

/***/ }),

/***/ 407:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-7c971212"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/components/ChatEmoji.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "m-chat-emoji"
  }, [_c('div', {
    staticClass: "emoji-content"
  }, [_c('div', {
    staticClass: "cnt"
  }, _vm._l((_vm.currEmoji.list), function(item) {
    return _c('span', {
      staticClass: "emoji-item",
      class: {
        'pinup-item': item.type === 'pinup'
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.selectEmoji(item)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.img
      }
    })])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "emoji-channel"
  }, [_vm._l((_vm.emoji), function(item) {
    return _c('span', {
      staticClass: "emoji-album",
      class: {
        active: item.name == _vm.currAlbum
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.selectAlbum(item)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.album
      }
    })])
  }), _vm._l((_vm.pinup), function(item) {
    return (_vm.type === 'session') ? _c('span', {
      staticClass: "emoji-album",
      class: {
        active: item.name == _vm.currAlbum
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.selectAlbum(item)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.album
      }
    })]) : _vm._e()
  })], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7c971212", module.exports)
  }
}

/***/ }),

/***/ 408:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-23f73ce8","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatEditor.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../~/css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler?{"id":"data-v-23f73ce8","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector.js?type=styles&index=0!./ChatEditor.vue */ 404);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../~/vue-style-loader/lib/addStylesClient.js */ 5)("34d0e6dc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-23f73ce8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatEditor.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-23f73ce8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatEditor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 409:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-7c971212","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/ChatEmoji.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../~/css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler?{"id":"data-v-7c971212","scoped":false,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector.js?type=styles&index=0!./ChatEmoji.vue */ 405);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../~/vue-style-loader/lib/addStylesClient.js */ 5)("613a0def", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-7c971212\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatEmoji.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-7c971212\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatEmoji.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 410:
/* no static exports found */
/* all exports used */
/*!*********************************************!*\
  !*** ./src/pages/components/ChatEditor.vue ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-23f73ce8","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector?type=styles&index=0!./ChatEditor.vue */ 408)

var Component = __webpack_require__(/*! ../../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../../~/vux-loader/src/script-loader.js!../../../~/vue-loader/lib/selector?type=script&index=0!./ChatEditor.vue */ 381),
  /* template */
  __webpack_require__(/*! !../../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-23f73ce8"}!../../../~/vux-loader/src/before-template-compiler-loader.js!../../../~/vux-loader/src/template-loader.js!../../../~/vue-loader/lib/selector?type=template&index=0!./ChatEditor.vue */ 406),
  /* scopeId */
  "data-v-23f73ce8",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\components\\ChatEditor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ChatEditor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-23f73ce8", Component.options)
  } else {
    hotAPI.reload("data-v-23f73ce8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 411:
/* no static exports found */
/* all exports used */
/*!********************************************!*\
  !*** ./src/pages/components/ChatEmoji.vue ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-7c971212","scoped":false,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector?type=styles&index=0!./ChatEmoji.vue */ 409)

var Component = __webpack_require__(/*! ../../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../../~/vux-loader/src/script-loader.js!../../../~/vue-loader/lib/selector?type=script&index=0!./ChatEmoji.vue */ 382),
  /* template */
  __webpack_require__(/*! !../../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-7c971212"}!../../../~/vux-loader/src/before-template-compiler-loader.js!../../../~/vux-loader/src/template-loader.js!../../../~/vue-loader/lib/selector?type=template&index=0!./ChatEmoji.vue */ 407),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\components\\ChatEmoji.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ChatEmoji.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c971212", Component.options)
  } else {
    hotAPI.reload("data-v-7c971212", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 442:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/RoomChat.vue ***!
  \********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _RoomChatList = __webpack_require__(/*! ./RoomChatList */ 523);

var _RoomChatList2 = _interopRequireDefault(_RoomChatList);

var _RoomChatActor = __webpack_require__(/*! ./RoomChatActor */ 522);

var _RoomChatActor2 = _interopRequireDefault(_RoomChatActor);

var _RoomChatMember = __webpack_require__(/*! ./RoomChatMember */ 524);

var _RoomChatMember2 = _interopRequireDefault(_RoomChatMember);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  beforeMount: function beforeMount() {
    if (this.$store.state.isRefresh) {
      location.href = '#/room';
    } else {
      this.$store.dispatch('connect', {
        type: 'chatroom',
        chatroomId: this.chatroomId
      });
    }
  },
  destroyed: function destroyed() {
    this.$store.dispatch('resetChatroomSDK', this.chatroomId);
  },

  components: {
    RoomChatList: _RoomChatList2.default,
    RoomChatMember: _RoomChatMember2.default,
    RoomChatActor: _RoomChatActor2.default
  },
  data: function data() {
    return {
      roomType: 1 };
  },

  computed: {
    chatroomId: function chatroomId() {
      var chatroomId = this.$route.params.chatroomId;
      return chatroomId;
    },
    chatroomInfo: function chatroomInfo() {
      return this.$store.state.chatroomInfos[this.chatroomId] || {};
    }
  },
  methods: {
    changeRoomType: function changeRoomType(roomType) {
      this.roomType = roomType;
    },
    enterHall: function enterHall() {
      location.href = '#/room';
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 443:
/* no static exports found */
/* all exports used */
/*!*************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/RoomChatActor.vue ***!
  \*************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _configs = __webpack_require__(/*! ../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mounted: function mounted() {
    this.$store.dispatch('getChatroomInfo');
  },

  computed: {
    chatroomInfo: function chatroomInfo() {
      var chatroomInfo = this.$store.state.currChatroomInfo;
      chatroomInfo.showTime = _utils2.default.formatDate(chatroomInfo.createTime);
      return chatroomInfo;
    },
    chatroomNotice: function chatroomNotice() {
      return this.chatroomInfo.announcement || '暂无公告';
    },
    chatroomActor: function chatroomActor() {
      if (this.chatroomInfo) {
        var actor = this.chatroomInfo.actor || {};
        actor.avatar = actor.avatar || _configs2.default.defaultUserIcon;
        return actor;
      }
      return {};
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 444:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/RoomChatList.vue ***!
  \************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _ChatEditor = __webpack_require__(/*! ./components/ChatEditor */ 410);

var _ChatEditor2 = _interopRequireDefault(_ChatEditor);

var _ChatList = __webpack_require__(/*! ./components/ChatList */ 378);

var _ChatList2 = _interopRequireDefault(_ChatList);

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _page = __webpack_require__(/*! ../utils/page */ 41);

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: {
    ChatEditor: _ChatEditor2.default,
    ChatList: _ChatList2.default
  },
  mounted: function mounted() {
    _page2.default.scrollChatListDown();
  },
  updated: function updated() {
    _page2.default.scrollChatListDown();
  },
  data: function data() {
    return {};
  },

  computed: {
    chatroomId: function chatroomId() {
      var chatroomId = this.$route.params.chatroomId;
      return chatroomId;
    },
    msglist: function msglist() {
      var msgs = this.$store.state.currChatroomMsgs;
      return msgs;
    }
  },
  methods: {
    msgsLoaded: function msgsLoaded() {
      _page2.default.scrollChatListDown();
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 445:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/RoomChatMember.vue ***!
  \**************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _configs = __webpack_require__(/*! ../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mounted: function mounted() {
    this.$store.dispatch('getChatroomMembers');
  },
  destroyed: function destroyed() {
    this.$store.dispatch('clearChatroomMembers');
  },

  computed: {
    chatroomMembers: function chatroomMembers() {
      return this.$store.state.currChatroomMembers.map(function (member) {
        if (!member.avatar) {
          member.avatar = _configs2.default.defaultUserIcon;
        } else if (!/\?imageView/.test(member.avatar)) {
          member.avatar += '?imageView&thumbnail=40x40&quality=85';
        }
        switch (member.type) {
          case 'owner':
            member.showType = '群主';
            break;
          case 'manager':
            member.showType = '管理员';
            break;
          case 'common':
          case 'normal':
            member.showType = '普通成员';
            break;
          case 'restricted':
            member.showType = '受限制';
            break;
          case 'guest':
            member.showType = '游客';
            break;
        }
        return member;
      });
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 470:
/* no static exports found */
/* all exports used */
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6fdeb8b0","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatActor.vue ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-room-chat-actor {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.p-room-chat-actor h3 {\n  text-align: left;\n}\n.p-room-chat-actor .actor-info {\n  position: relative;\n  width: 100%;\n  height: 4rem;\n  padding: 0.5rem;\n  -moz-box-sizing: border-box;\n       box-sizing: border-box;\n}\n.p-room-chat-actor .actor-avatar {\n  position: relative;\n  display: inline-block;\n  height: 3rem;\n  width: 3rem;\n  border-radius: 3rem;\n  overflow: hidden;\n}\n.p-room-chat-actor .actor-avatar img {\n  width: inherit;\n  height: inherit;\n}\n.p-room-chat-actor .actor-status {\n  position: relative;\n  display: inline-block;\n  margin-left: 0.5rem;\n  height: 3rem;\n  width: auto;\n  vertical-align: top;\n}\n.p-room-chat-actor .actor-status h3 {\n  line-height: 1.8rem;\n  font-size: 1.0rem;\n}\n.p-room-chat-actor .actor-status p {\n  position: relative;\n  top: 0.2rem;\n  line-height: 1.0rem;\n  font-size: 0.9rem;\n  color: #999;\n}\n.p-room-chat-actor .actor-status em {\n  margin-left: 2rem;\n}\n.p-room-chat-actor .actor-notice {\n  position: absolute;\n  -moz-box-sizing: border-box;\n       box-sizing: border-box;\n  padding: 5rem 1rem 1rem 1rem;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  line-height: 1.4;\n}\n.p-room-chat-actor .actor-notice h3 {\n  border-bottom: 1px solid #e9e9e9;\n}\n.p-room-chat-actor .actor-notice p {\n  margin-top: 0.6rem;\n  color: #666;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/RoomChatActor.vue"],"names":[],"mappings":";AAuDA;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;CA8Dd;AA7DC;EACE,iBAAiB;CAClB;AACD;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,gBAAgB;EAChB,4BAAuB;OAAvB,uBAAuB;CACxB;AACD;EACE,mBAAmB;EACnB,sBAAsB;EACtB,aAAa;EACb,YAAY;EACZ,oBAAoB;EACpB,iBAAiB;CAKlB;AAJC;EACE,eAAe;EACf,gBAAgB;CACjB;AAEH;EACE,mBAAmB;EACnB,sBAAsB;EACtB,oBAAoB;EACpB,aAAa;EACb,YAAY;EACZ,oBAAoB;CAerB;AAdC;EACE,oBAAoB;EACpB,kBAAkB;CACnB;AACD;EACE,mBAAmB;EACnB,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,YAAY;CACb;AACD;EACE,kBAAkB;CACnB;AAEH;EACE,mBAAmB;EACnB,4BAAuB;OAAvB,uBAAuB;EACvB,6BAA6B;EAC7B,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,iBAAiB;CAQlB;AAPC;EACE,iCAAiC;CAClC;AACD;EACE,mBAAmB;EACnB,YAAY;CACb","file":"RoomChatActor.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-room-chat-actor {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  h3 {\n    text-align: left;\n  }\n  .actor-info {\n    position: relative;\n    width: 100%;\n    height: 4rem;\n    padding: 0.5rem;\n    box-sizing: border-box;\n  }\n  .actor-avatar {\n    position: relative;\n    display: inline-block;\n    height: 3rem;\n    width: 3rem;\n    border-radius: 3rem;\n    overflow: hidden;\n    img {\n      width: inherit;\n      height: inherit;\n    }\n  }\n  .actor-status {\n    position: relative;\n    display: inline-block;\n    margin-left: 0.5rem;\n    height: 3rem;\n    width: auto;\n    vertical-align: top;\n    h3 {\n      line-height: 1.8rem;\n      font-size: 1.0rem;\n    }\n    p {\n      position: relative;\n      top: 0.2rem;\n      line-height: 1.0rem;\n      font-size: 0.9rem;\n      color: #999;\n    }\n    em {\n      margin-left: 2rem;\n    }\n  }\n  .actor-notice {\n    position: absolute;\n    box-sizing: border-box;\n    padding: 5rem 1rem 1rem 1rem;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    line-height: 1.4;\n    h3 {\n      border-bottom: 1px solid #e9e9e9;\n    }\n    p {\n      margin-top: 0.6rem;\n      color: #666;\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 476:
/* no static exports found */
/* all exports used */
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-d5ccb59a","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatList.vue ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-room-chat-list .m-chat-editor-main .u-editor-input[data-v-d5ccb59a] {\n    padding-right: 8rem;\n}\n.p-room-chat-list .m-chat-editor-main .u-editor-icons[data-v-d5ccb59a] {\n    width: 8rem;\n}\n.p-room-chat-list .u-msg .msg-text[data-v-d5ccb59a] {\n    max-width: 80%;\n}\n.p-room-chat-list .u-msg .msg-link[data-v-d5ccb59a] {\n    bottom: 0;\n    right: -4rem;\n    font-size: 0.9rem;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/RoomChatList.vue"],"names":[],"mappings":";AA4DI;IACE,oBAAoB;CACrB;AACD;IACE,YAAY;CACb;AAGD;IACE,eAAe;CAChB;AACD;IACE,UAAU;IACV,aAAa;IACb,kBAAkB;CACnB","file":"RoomChatList.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-room-chat-list {\n  .m-chat-editor-main {\n    .u-editor-input {\n      padding-right: 8rem;\n    }\n    .u-editor-icons {\n      width: 8rem;\n    }\n  }\n  .u-msg {\n    .msg-text {\n      max-width: 80%;\n    }\n    .msg-link {\n      bottom: 0;\n      right: -4rem;\n      font-size: 0.9rem;\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 477:
/* no static exports found */
/* all exports used */
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-e2f05422","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatMember.vue ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-room-chat-online {\n  position: relative;\n  display: block;\n  -moz-box-sizing: border-box;\n       box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  overflow-y: auto;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/RoomChatMember.vue"],"names":[],"mappings":";AA2DA;EACE,mBAAmB;EACnB,eAAe;EACf,4BAAuB;OAAvB,uBAAuB;EACvB,WAAW;EACX,UAAU;EACV,YAAY;EACZ,aAAa;EACb,iBAAiB;EACjB,iBAAiB;CAClB","file":"RoomChatMember.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-room-chat-online {\n  position: relative;\n  display: block;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  overflow-y: auto;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 478:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-ed15f416","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChat.vue ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-room-chat .left-arrow {\n    position: absolute;\n    display: block;\n    top: 1rem;\n    left: 1rem;\n    width: 2rem;\n    height: 2rem;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/RoomChat.vue"],"names":[],"mappings":";AAgFE;IACE,mBAAmB;IACnB,eAAe;IACf,UAAU;IACV,WAAW;IACX,YAAY;IACZ,aAAa;CACd","file":"RoomChat.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-room-chat {\n  .left-arrow {\n    position: absolute;\n    display: block;\n    top: 1rem;\n    left: 1rem;\n    width: 2rem;\n    height: 2rem;\n  }\n\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 494:
/* no static exports found */
/* all exports used */
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-6fdeb8b0"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/RoomChatActor.vue ***!
  \****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "p-room-chat-actor"
  }, [_c('div', {
    staticClass: "actor-info"
  }, [_c('span', {
    staticClass: "actor-avatar"
  }, [_c('img', {
    attrs: {
      "src": _vm.chatroomActor.avatar
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "actor-status"
  }, [_c('h3', [_vm._v("主播： " + _vm._s(_vm.chatroomActor.nick || _vm.chatroomActor.account) + " ")]), _vm._v(" "), _c('p', [_c('span', [_vm._v("\n          在线：" + _vm._s(_vm.chatroomInfo.onlineMemberNum) + "\n        ")])])])]), _vm._v(" "), _c('div', {
    staticClass: "actor-notice"
  }, [_c('h3', [_vm._v("公告：")]), _vm._v(" "), _c('p', [_vm._v("\n      " + _vm._s(_vm.chatroomNotice) + "\n    ")])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6fdeb8b0", module.exports)
  }
}

/***/ }),

/***/ 499:
/* no static exports found */
/* all exports used */
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-d5ccb59a"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/RoomChatList.vue ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "m-chat-main p-room-chat-list"
  }, [_c('chat-list', {
    attrs: {
      "type": "chatroom",
      "chatroomId": _vm.chatroomId,
      "msglist": _vm.msglist
    },
    on: {
      "msgs-loaded": _vm.msgsLoaded
    }
  }), _vm._v(" "), _c('chat-editor', {
    attrs: {
      "type": "chatroom",
      "chatroomId": _vm.chatroomId
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d5ccb59a", module.exports)
  }
}

/***/ }),

/***/ 500:
/* no static exports found */
/* all exports used */
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-e2f05422"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/RoomChatMember.vue ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "p-room-chat-online"
  }, [_c('group', {
    staticClass: "u-list"
  }, _vm._l((_vm.chatroomMembers), function(member, index) {
    return _c('cell', {
      key: member.account,
      staticClass: "u-list-item",
      attrs: {
        "title": member.nick || member.account,
        "inline-desc": member.showType
      }
    }, [_c('img', {
      staticClass: "icon",
      attrs: {
        "slot": "icon",
        "width": "24",
        "src": member.avatar
      },
      slot: "icon"
    })])
  }))], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e2f05422", module.exports)
  }
}

/***/ }),

/***/ 501:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-ed15f416"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/RoomChat.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-room p-room-chat"
  }, [_c('div', {
    staticClass: "m-room-album"
  }, [_c('div', {
    staticClass: "img-wraper"
  }, [_c('img', {
    staticClass: "room-img",
    attrs: {
      "src": _vm.chatroomInfo.album
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "left-arrow",
    on: {
      "click": _vm.enterHall
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "m-room-tabs"
  }, [_c('span', {
    staticClass: "u-tab",
    class: {
      active: _vm.roomType === 1
    },
    on: {
      "click": function($event) {
        _vm.changeRoomType(1)
      }
    }
  }, [_vm._v("\n      直播互动\n    ")]), _c('span', {
    staticClass: "u-tab",
    class: {
      active: _vm.roomType === 2
    },
    on: {
      "click": function($event) {
        _vm.changeRoomType(2)
      }
    }
  }, [_vm._v("\n      主播\n    ")]), _c('span', {
    staticClass: "u-tab",
    class: {
      active: _vm.roomType === 3
    },
    on: {
      "click": function($event) {
        _vm.changeRoomType(3)
      }
    }
  }, [_vm._v("\n      在线成员\n    ")])]), _vm._v(" "), _c('div', {
    staticClass: "m-room-container"
  }, [_c('div', {
    staticClass: "room-cnt"
  }, [(_vm.roomType === 1) ? _c('room-chat-list') : _vm._e(), _vm._v(" "), (_vm.roomType === 2) ? _c('room-chat-actor') : _vm._e(), _vm._v(" "), (_vm.roomType === 3) ? _c('room-chat-member') : _vm._e()], 1)])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ed15f416", module.exports)
  }
}

/***/ }),

/***/ 513:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6fdeb8b0","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatActor.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-6fdeb8b0","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatActor.vue */ 470);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("28a238b6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6fdeb8b0\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatActor.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6fdeb8b0\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatActor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 519:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-d5ccb59a","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatList.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-d5ccb59a","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatList.vue */ 476);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("56b4acbd", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-d5ccb59a\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatList.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-d5ccb59a\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatList.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 520:
/* no static exports found */
/* all exports used */
/*!***************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-e2f05422","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChatMember.vue ***!
  \***************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-e2f05422","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatMember.vue */ 477);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("1fbc3b24", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e2f05422\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatMember.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e2f05422\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChatMember.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 521:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-ed15f416","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/RoomChat.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-ed15f416","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./RoomChat.vue */ 478);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("3ccdca08", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-ed15f416\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChat.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-ed15f416\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RoomChat.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 522:
/* no static exports found */
/* all exports used */
/*!*************************************!*\
  !*** ./src/pages/RoomChatActor.vue ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-6fdeb8b0","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./RoomChatActor.vue */ 513)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./RoomChatActor.vue */ 443),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-6fdeb8b0"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./RoomChatActor.vue */ 494),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\RoomChatActor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RoomChatActor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fdeb8b0", Component.options)
  } else {
    hotAPI.reload("data-v-6fdeb8b0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 523:
/* no static exports found */
/* all exports used */
/*!************************************!*\
  !*** ./src/pages/RoomChatList.vue ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-d5ccb59a","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./RoomChatList.vue */ 519)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./RoomChatList.vue */ 444),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-d5ccb59a"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./RoomChatList.vue */ 499),
  /* scopeId */
  "data-v-d5ccb59a",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\RoomChatList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RoomChatList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d5ccb59a", Component.options)
  } else {
    hotAPI.reload("data-v-d5ccb59a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 524:
/* no static exports found */
/* all exports used */
/*!**************************************!*\
  !*** ./src/pages/RoomChatMember.vue ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-e2f05422","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./RoomChatMember.vue */ 520)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./RoomChatMember.vue */ 445),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-e2f05422"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./RoomChatMember.vue */ 500),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\RoomChatMember.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RoomChatMember.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e2f05422", Component.options)
  } else {
    hotAPI.reload("data-v-e2f05422", Component.options)
  }
})()}

module.exports = Component.exports


/***/ })

});
//# sourceMappingURL=0.js.map