webpackJsonp([10],{

/***/ 333:
/* no static exports found */
/* all exports used */
/*!**************************************!*\
  !*** ./src/pages/TeamMemberCard.vue ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-6b45b6ae","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./TeamMemberCard.vue */ 511)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./TeamMemberCard.vue */ 453),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-6b45b6ae"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./TeamMemberCard.vue */ 492),
  /* scopeId */
  "data-v-6b45b6ae",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\TeamMemberCard.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] TeamMemberCard.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6b45b6ae", Component.options)
  } else {
    hotAPI.reload("data-v-6b45b6ae", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 453:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/TeamMemberCard.vue ***!
  \**************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 8);

var _assign2 = _interopRequireDefault(_assign);

var _configs = __webpack_require__(/*! ../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      avatar: _configs2.default.defaultUserIcon,
      teamId: '',
      account: '',
      mute: false,
      selfType: 'normal'
    };
  },

  computed: {
    member: function member() {
      var _this = this;

      var parseReg = /(\d+)-(\w+)/;
      var result = parseReg.exec(this.$route.params.member);
      var teamId = result[1];
      this.teamId = teamId;
      var account = result[2];
      this.account = account;
      var member = {};
      this.$store.state.teamMembers[teamId] && this.$store.state.teamMembers[teamId].forEach(function (item) {
        if (item.account === account) {
          member = (0, _assign2.default)(member, item);
        }
        if (item.account === _this.$store.state.userUID) {
          _this.selfType = item.type;
        }
      });
      var userInfo = this.$store.state.userInfos[member.account];
      if (member.account === this.$store.state.userUID) {
        userInfo = this.$store.state.myInfo;
      }
      member.avatar = userInfo ? userInfo.avatar : member.avatar || this.avatar;
      member.alias = userInfo ? userInfo.nick : member.account || 'account';
      this.mute = !!member.mute;
      return member;
    },
    memberType: function memberType() {
      if (this.member) {
        switch (this.member.type) {
          case 'owner':
            return '群主';
          case 'manager':
            return '管理员';
          case 'normal':
            return '普通成员';
        }
      }
      return '普通成员';
    },
    infoInTeam: function infoInTeam() {
      return {
        nickInTeam: this.member.nickInTeam,
        memberType: this.member.type
      };
    },
    hasSetMemberTypePermission: function hasSetMemberTypePermission() {
      return this.selfType === 'owner' && this.member.type !== 'owner';
    },
    hasMuteOrRemovePermission: function hasMuteOrRemovePermission() {
      if (this.selfType === 'owner') {
        return this.member.type !== 'owner';
      }
      if (this.selfType === 'manager') {
        return this.member.type === 'normal';
      }
      return false;
    },
    isSelf: function isSelf() {
      return this.member.account === this.$store.state.userUID;
    },
    hasSetNickPermission: function hasSetNickPermission() {
      return this.selfType !== 'normal' || this.isSelf;
    }
  },
  methods: {
    changeMute: function changeMute() {
      var _this2 = this;

      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'updateMuteStateInTeam',
        options: {
          teamId: this.teamId,
          account: this.account,
          mute: this.mute,
          done: function done(error, obj) {
            if (error) {
              _this2.$toast(error);
            } else {
              _this2.$toast(_this2.mute ? '已禁言' : '已取消禁言');
            }
          }
        }
      });
    },
    getUpdateCallBcak: function getUpdateCallBcak() {
      var _this3 = this;

      var account = this.member.account;
      var store = this.$store;
      var toast = this.$toast;

      var doneCallBack = function doneCallBack(error, obj) {
        if (error) {
          _this3.$toast(error);
        } else {
          _this3.$toast('更改成功');
          setTimeout(function () {
            history.go(-1);
          }, 200);
        }
        store.dispatch('hideLoading');
      };
      return function (teamId, updateKey, newValue) {
        store.dispatch('showLoading');
        var action = null;
        var opts = {};
        if (updateKey === 'nickInTeam') {
          action = 'updateNickInTeam';
          opts.account = account;
          opts.nickInTeam = newValue;
        } else if (updateKey === 'memberType') {
          action = newValue === 'manager' ? 'addTeamManagers' : 'removeTeamManagers';
          opts.accounts = [account];
        }
        store.dispatch('delegateTeamFunction', {
          functionName: action,
          options: (0, _assign2.default)({
            teamId: teamId,
            done: doneCallBack
          }, opts)
        });
      };
    },
    onEditItemClick: function onEditItemClick(title, inputType, updateKey, confirmCallback) {
      var updateSelfNick = this.isSelf && updateKey === 'nickInTeam';
      this.$store.dispatch('enterSettingPage', {
        title: title,
        inputType: inputType,
        updateKey: updateKey,
        teamId: this.teamId,
        updateInfoInTeam: updateSelfNick ? true : false,
        defaultValue: this.infoInTeam[updateKey],
        confirmCallback: updateSelfNick ? null : confirmCallback,
        enable: true
      });
    },
    remove: function remove() {
      var _this4 = this;

      this.$store.dispatch('showLoading');
      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'removeTeamMembers',
        options: {
          teamId: this.teamId,
          accounts: [this.member.account],
          done: function done(error, obj) {
            _this4.$toast(error ? error : '移除成功');
            history.go(-1);
            _this4.$store.dispatch('hideLoading');
          }
        }
      });
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 468:
/* no static exports found */
/* all exports used */
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6b45b6ae","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamMemberCard.vue ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.g-body[data-v-6b45b6ae]{\n}\n.g-avatar[data-v-6b45b6ae]{\n  margin: 2rem auto;\n  width: 100%;\n  text-align: center;\n}\n.u-btn[data-v-6b45b6ae]{\n  width: 80%;\n  margin: 1rem 10%;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/TeamMemberCard.vue"],"names":[],"mappings":";AA0LA;CAEC;AACD;EACE,kBAAkB;EAClB,YAAY;EACZ,mBAAmB;CACpB;AACD;EACE,WAAW;EACX,iBAAiB;CAClB","file":"TeamMemberCard.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.g-body{\n  \n}\n.g-avatar{\n  margin: 2rem auto;\n  width: 100%;\n  text-align: center;\n}\n.u-btn{\n  width: 80%;\n  margin: 1rem 10%;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 492:
/* no static exports found */
/* all exports used */
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-6b45b6ae"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/TeamMemberCard.vue ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-membercard"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v("群名片")]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "g-body"
  }, [_c('div', {
    staticClass: "g-avatar"
  }, [_c('img', {
    staticClass: "icon u-circle",
    attrs: {
      "slot": "icon",
      "width": "50",
      "height": "50",
      "src": _vm.member && _vm.member.avatar
    },
    slot: "icon"
  }), _vm._v(" "), _c('div', [_vm._v(_vm._s(_vm.member && _vm.member.alias))])]), _vm._v(" "), _c('group', {
    staticClass: "m-group"
  }, [_c('cell', {
    attrs: {
      "title": "群昵称",
      "value": _vm.member.nickInTeam || '未设置',
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.hasSetNickPermission ? _vm.onEditItemClick('修改群昵称', 'text', 'nickInTeam', _vm.getUpdateCallBcak()) : _vm.$toast('无权限'); })($event)
      }
    }
  }), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "身份",
      "value": _vm.memberType,
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.hasSetMemberTypePermission ? _vm.onEditItemClick('身份', 'select', 'memberType', _vm.getUpdateCallBcak()) : _vm.$toast('无权限'); })($event)
      }
    }
  }), _vm._v(" "), (_vm.hasMuteOrRemovePermission) ? _c('x-switch', {
    staticClass: "u-switch",
    attrs: {
      "title": "设置禁言"
    },
    on: {
      "on-change": _vm.changeMute
    },
    model: {
      value: (_vm.mute),
      callback: function($$v) {
        _vm.mute = $$v
      },
      expression: "mute"
    }
  }) : _vm._e()], 1), _vm._v(" "), (_vm.hasMuteOrRemovePermission) ? _c('x-button', {
    staticClass: "u-btn",
    attrs: {
      "mini": "",
      "type": "warn"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.remove($event)
      }
    }
  }, [_vm._v("移出本群")]) : _vm._e()], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6b45b6ae", module.exports)
  }
}

/***/ }),

/***/ 511:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6b45b6ae","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamMemberCard.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-6b45b6ae","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./TeamMemberCard.vue */ 468);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("5e07c060", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6b45b6ae\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMemberCard.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6b45b6ae\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMemberCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=10.js.map