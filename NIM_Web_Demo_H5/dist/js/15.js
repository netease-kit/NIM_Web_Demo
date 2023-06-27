webpackJsonp([15],{

/***/ 322:
/* no static exports found */
/* all exports used */
/*!********************************!*\
  !*** ./src/pages/NameCard.vue ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-654b9b5d","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./NameCard.vue */ 509)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./NameCard.vue */ 439),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-654b9b5d"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./NameCard.vue */ 490),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\NameCard.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] NameCard.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-654b9b5d", Component.options)
  } else {
    hotAPI.reload("data-v-654b9b5d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 439:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/NameCard.vue ***!
  \********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 8);

var _assign2 = _interopRequireDefault(_assign);

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      isBlack: false,
      isSelf: false
    };
  },

  computed: {
    account: function account() {
      return this.$route.params.userId;
    },
    userInfo: function userInfo() {
      var info = {};
      if (this.isRobot) {
        info = (0, _assign2.default)({}, this.robotInfos[this.account]);
        info.alias = info.nick || account;
        info.avatar = info.originAvatar || item.avatar;
      } else if (this.account === this.$store.state.userUID) {
        info = (0, _assign2.default)({}, this.$store.state.myInfo);
        info.alias = info.nick;
        this.isSelf = true;
      } else {
        info = (0, _assign2.default)({}, this.$store.state.userInfos[this.account]);
        info._alias = info.alias;
        info.alias = _utils2.default.getFriendAlias(info);
        this.isBlack = info.isBlack;
      }
      return info;
    },
    robotInfos: function robotInfos() {
      return this.$store.state.robotInfos;
    },
    isFriend: function isFriend() {
      var userInfo = this.userInfo;
      return userInfo.isFriend;
    },
    isRobot: function isRobot() {
      if (this.robotInfos[this.account]) {
        return true;
      }
      return false;
    },
    remarkLink: function remarkLink() {
      return '/namecardremark/' + this.account;
    }
  },
  methods: {
    changeBlack: function changeBlack() {
      this.$store.dispatch('updateBlack', {
        account: this.account,
        isBlack: this.isBlack
      });
    },
    enterChat: function enterChat() {
      location.href = '#/chat/p2p-' + this.account;
    },
    enterHistory: function enterHistory() {
      location.href = '#/chatHistory/p2p-' + this.account;
    },
    addFriend: function addFriend() {
      this.$store.dispatch('addFriend', this.account);
    },
    deleteFriend: function deleteFriend() {
      var that = this;
      this.$vux.confirm.show({
        title: '删除好友后，将同时解除双方的好友关系',
        onConfirm: function onConfirm() {
          that.$store.dispatch('deleteFriend', that.account);
        }
      });
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 466:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-654b9b5d","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/NameCard.vue ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-namecard .m-list {\n    padding-top: 3.6rem;\n}\n.p-namecard .u-bottom {\n    margin-bottom: 2rem;\n}\n\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/NameCard.vue"],"names":[],"mappings":";AAiIE;IACE,oBAAoB;CACrB;AACD;IACE,oBAAoB;CACrB","file":"NameCard.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-namecard {\n  .m-list {\n    padding-top: 3.6rem;\n  }\n  .u-bottom {\n    margin-bottom: 2rem;\n  }\n}\n\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 490:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-654b9b5d"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/NameCard.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-namecard"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v(_vm._s(_vm.userInfo.alias))]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), (_vm.isRobot) ? _c('div', {
    staticClass: "m-list m-robot"
  }, [_c('div', {
    staticClass: "u-logo"
  }, [_c('img', {
    staticClass: "logo",
    attrs: {
      "src": _vm.userInfo.avatar
    }
  }), _vm._v(" "), _c('h3', [_vm._v(_vm._s(_vm.userInfo.alias))]), _vm._v(" "), _c('p', [_vm._v("@" + _vm._s(_vm.userInfo.account))])]), _vm._v(" "), _c('div', {
    staticClass: "u-desc"
  }, [_c('p', [_vm._v(_vm._s(_vm.userInfo.intro))])]), _vm._v(" "), _c('div', {
    staticClass: "u-bottom"
  }, [_c('x-button', {
    attrs: {
      "type": "primary",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.enterChat($event)
      }
    }
  }, [_vm._v("开始对话")])], 1)]) : _c('div', {
    staticClass: "m-list"
  }, [_c('group', {
    staticClass: "u-card"
  }, [_c('cell', {
    attrs: {
      "title": _vm.userInfo.account,
      "inline-desc": '昵称: ' + _vm.userInfo.nick,
      "value": _vm.userInfo.gender == '不显示' ? '' : _vm.userInfo.gender
    }
  }, [_c('img', {
    staticClass: "icon",
    attrs: {
      "slot": "icon",
      "width": "20",
      "src": _vm.userInfo.avatar
    },
    slot: "icon"
  })])], 1), _vm._v(" "), _c('group', {
    staticClass: "u-card"
  }, [_c('cell', {
    attrs: {
      "title": "性别"
    }
  }, [_vm._v(_vm._s(_vm.userInfo.gender))]), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "生日"
    }
  }, [_vm._v(_vm._s(_vm.userInfo.birth))]), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "手机"
    }
  }, [_vm._v(_vm._s(_vm.userInfo.tel))]), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "邮箱"
    }
  }, [_vm._v(_vm._s(_vm.userInfo.email))]), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "签名"
    }
  }, [_vm._v(_vm._s(_vm.userInfo.sign))])], 1), _vm._v(" "), _c('group', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isFriend),
      expression: "isFriend"
    }],
    staticClass: "u-card"
  }, [_c('cell', {
    attrs: {
      "title": "备注名",
      "is-link": "",
      "link": _vm.remarkLink
    }
  }, [_vm._v(_vm._s(_vm.userInfo._alias))])], 1), _vm._v(" "), (!_vm.isSelf) ? _c('group', {
    staticClass: "u-card"
  }, [_c('x-switch', {
    staticClass: "u-switch",
    attrs: {
      "title": "黑名单"
    },
    on: {
      "on-change": _vm.changeBlack
    },
    model: {
      value: (_vm.isBlack),
      callback: function($$v) {
        _vm.isBlack = $$v
      },
      expression: "isBlack"
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "u-bottom"
  }, [_c('x-button', {
    attrs: {
      "type": "primary",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.enterChat($event)
      }
    }
  }, [_vm._v("聊天")]), _vm._v(" "), _c('x-button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isFriend),
      expression: "isFriend"
    }],
    attrs: {
      "type": "primary",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.enterHistory($event)
      }
    }
  }, [_vm._v("历史记录")]), _vm._v(" "), _c('x-button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isFriend),
      expression: "isFriend"
    }],
    attrs: {
      "type": "warn",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.deleteFriend($event)
      }
    }
  }, [_vm._v("删除好友")]), _vm._v(" "), _c('x-button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.isFriend && !_vm.isSelf),
      expression: "!isFriend && !isSelf"
    }],
    attrs: {
      "type": "warn",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.addFriend($event)
      }
    }
  }, [_vm._v("添加好友")])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-654b9b5d", module.exports)
  }
}

/***/ }),

/***/ 509:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-654b9b5d","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/NameCard.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-654b9b5d","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./NameCard.vue */ 466);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("520e0f31", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-654b9b5d\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./NameCard.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-654b9b5d\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./NameCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=15.js.map