webpackJsonp([6],{

/***/ 332:
/* no static exports found */
/* all exports used */
/*!**********************************!*\
  !*** ./src/pages/TeamManage.vue ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-3dbe9b44","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./TeamManage.vue */ 505)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./TeamManage.vue */ 452),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-3dbe9b44"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./TeamManage.vue */ 482),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\TeamManage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] TeamManage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3dbe9b44", Component.options)
  } else {
    hotAPI.reload("data-v-3dbe9b44", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 362:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/components/TeamMember.vue ***!
  \*********************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 8);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    teamId: {
      type: String
    },

    advanced: {
      type: Boolean,
      default: false
    },

    showAllMode: {
      type: Boolean,
      default: false
    },
    filterAccount: {
      type: Array
    }
  },
  data: function data() {
    return {
      removeMode: false,
      hasManagePermission: false,
      hasSearched: false
    };
  },
  mounted: function mounted() {
    var teamMembers = this.$store.state.teamMembers[this.teamId];
    if (teamMembers === undefined) {
      this.$store.dispatch('getTeamMembers', this.teamId);
    }
  },

  computed: {
    teamInfo: function teamInfo() {
      var _this = this;

      var teamList = this.$store.state.teamlist;
      var team = teamList && teamList.find(function (team) {
        return team.teamId === _this.teamId;
      });
      if (!team) {
        return undefined;
      }
      return team;
    },
    members: function members() {
      var _this2 = this;

      var members = this.$store.state.teamMembers[this.teamId];
      var userInfos = this.$store.state.userInfos;
      var needSearchAccounts = [];
      if (members) {
        members = members.map(function (item) {
          var member = (0, _assign2.default)({}, item);
          member.valid = true;
          if (member.account === _this2.$store.state.userUID) {
            member.alias = '我';
            member.avatar = _this2.$store.state.myInfo.avatar;
            _this2.isOwner = member.type === 'owner';
            _this2.hasManagePermission = member.type !== 'normal';
          } else if (userInfos[member.account] === undefined) {
            needSearchAccounts.push(member.account);
            member.avatar = member.avatar || _this2.avatar;
            member.alias = member.nickInTeam || member.account;
          } else {
            member.avatar = userInfos[member.account].avatar;
            member.alias = member.nickInTeam || userInfos[member.account].nick;
          }
          return member;
        });
        if (needSearchAccounts.length > 0 && !this.hasSearched) {
          this.hasSearched = true;
          while (needSearchAccounts.length > 0) {
            this.searchUsers(needSearchAccounts.splice(0, 150));
          }
        }
        return members;
      }
      return [];
    },
    membersInDisplay: function membersInDisplay() {
      var _this3 = this;

      if (this.filterAccount) {
        return this.members.filter(function (member) {
          return !!_this3.filterAccount.find(function (account) {
            return account === member.account;
          });
        });
      } else if (this.advanced || this.showAllMode) {
        return this.members;
      } else {
        return this.members.slice(0, this.hasInvitePermission ? 3 : 4);
      }
    },
    hasInvitePermission: function hasInvitePermission() {
      return this.advanced && (this.hasManagePermission || this.teamInfo && this.teamInfo.inviteMode === "all");
    }
  },
  methods: {
    searchUsers: function searchUsers(Accounts) {
      var _this4 = this;

      this.$store.dispatch('searchUsers', {
        accounts: Accounts,
        done: function done(users) {
          _this4.updateTeamMember(users);
        }
      });
    },
    updateTeamMember: function updateTeamMember(users) {
      var _this5 = this;

      users.forEach(function (user) {
        var member = _this5.members.find(function (member) {
          return member.account === user.account;
        });
        if (member) {
          member.avatar = user.avatar;
          member.alias = member.nickInTeam || user.nick;
        }
      });
    },
    triggerRemove: function triggerRemove(e, show) {
      this.removeMode = !this.removeMode;
    },
    remove: function remove(e, member) {
      var _this6 = this;

      this.$store.dispatch('showLoading');
      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'removeTeamMembers',
        options: {
          teamId: this.teamId,
          accounts: [member.account],
          done: function done(error, obj) {
            _this6.$toast('移除成功');
            _this6.$store.dispatch('hideLoading');
          }
        }
      });
      e.cancelBubble = true;
      e.preventDefault();
    },
    onMemberClick: function onMemberClick(member) {
      location.href = this.advanced ? '#/teammembercard/' + member.id : '#/namecard/' + member.account;
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 369:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-1cc8d8fe","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/TeamMember.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.m-members[data-v-1cc8d8fe] {\r\n  display: -webkit-box;\r\n  display: -webkit-flex;\r\n  display: -moz-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-flex-wrap: wrap;\r\n      -ms-flex-wrap: wrap;\r\n          flex-wrap: wrap;\r\n  margin: 0 auto;\r\n  text-align: center;\r\n  width: 100%;\n}\n.m-members img.avatar[data-v-1cc8d8fe]{\r\n  width: 3.8rem;\r\n  height: 3.8rem;\r\n  -webkit-box-flex: 0;\r\n  -webkit-flex: 0 1 auto;\r\n     -moz-box-flex: 0;\r\n      -ms-flex: 0 1 auto;\r\n          flex: 0 1 auto;\n}\n.m-members .u-member[data-v-1cc8d8fe] {\r\n  display: -webkit-box;\r\n  display: -webkit-flex;\r\n  display: -moz-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  position: relative;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n  -webkit-flex-direction: column;\r\n     -moz-box-orient: vertical;\r\n     -moz-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-box-align: center;\r\n  -webkit-align-items: center;\r\n     -moz-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  width: 25%;\r\n  margin: .5rem 0;\n}\n.m-members .u-member .remove[data-v-1cc8d8fe], .m-members .u-member .manager[data-v-1cc8d8fe], .m-members .u-member .owner[data-v-1cc8d8fe]{\r\n  display: inline-block;\r\n  position: absolute;\r\n  bottom: 1.1rem;\r\n  right: 0;\r\n  width: 2rem;\r\n  height: 2rem;\r\n  background: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\r\n  background-position: -10.3rem 0;\r\n  background-size: 20rem\n}\n.m-members .u-member .owner[data-v-1cc8d8fe] {\r\n  background-position: -10.3rem -2.7rem;\n}\n.m-members .u-member .remove[data-v-1cc8d8fe] {\r\n  top: 0;\r\n  bottom: auto;\r\n  right: 0;\r\n  width: 2.4rem;\r\n  height: 2.4rem;\r\n  background-position: -10.1rem -5.1rem;\n}\n.m-members .u-member span[data-v-1cc8d8fe] {\r\n  max-width: 100%;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\n}\n.m-members.s-bg-white[data-v-1cc8d8fe] {\r\n  background-color: white;\n}\r\n\r\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/components/TeamMember.vue"],"names":[],"mappings":";AAwKA;EACE,qBAAc;EAAd,sBAAc;EAAd,kBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,wBAAgB;MAAhB,oBAAgB;UAAhB,gBAAgB;EAChB,eAAe;EACf,mBAAmB;EACnB,YAAY;CAmDb;AAjDC;EACE,cAAc;EACd,eAAe;EACf,oBAAe;EAAf,uBAAe;KAAf,iBAAe;MAAf,mBAAe;UAAf,eAAe;CAChB;AAED;EACE,qBAAc;EAAd,sBAAc;EAAd,kBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,mBAAmB;EACnB,6BAAuB;EAAvB,8BAAuB;EAAvB,+BAAuB;KAAvB,0BAAuB;KAAvB,2BAAuB;MAAvB,2BAAuB;UAAvB,uBAAuB;EACvB,0BAAoB;EAApB,4BAAoB;KAApB,uBAAoB;MAApB,uBAAoB;UAApB,oBAAoB;EACpB,WAAW;EACX,gBAAgB;CAgCjB;AA9BC;EACE,sBAAsB;EACtB,mBAAmB;EACnB,eAAe;EACf,SAAS;EACT,YAAY;EACZ,aAAa;EACb,sEAAsE;EACtE,gCAAgC;EAChC,sBAAsB;CACvB;AACD;EACE,sCAAsC;CACvC;AAED;EACE,OAAO;EACP,aAAa;EACb,SAAS;EACT,cAAc;EACd,eAAe;EACf,sCAAsC;CACvC;AAED;EACE,gBAAgB;EAChB,iBAAiB;EACjB,wBAAwB;EACxB,oBAAoB;CACrB;AAGH;EACE,wBAAwB;CACzB","file":"TeamMember.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n\r\n.m-members {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  margin: 0 auto;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  img.avatar{\r\n    width: 3.8rem;\r\n    height: 3.8rem;\r\n    flex: 0 1 auto;\r\n  }\r\n\r\n  .u-member {\r\n    display: flex;\r\n    position: relative;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 25%;\r\n    margin: .5rem 0;\r\n\r\n    .remove, .manager, .owner{\r\n      display: inline-block;\r\n      position: absolute;\r\n      bottom: 1.1rem;\r\n      right: 0;\r\n      width: 2rem;\r\n      height: 2rem;\r\n      background: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\r\n      background-position: -10.3rem 0;\r\n      background-size: 20rem\r\n    }\r\n    .owner {\r\n      background-position: -10.3rem -2.7rem;\r\n    }\r\n\r\n    .remove {\r\n      top: 0;\r\n      bottom: auto;\r\n      right: 0;\r\n      width: 2.4rem;\r\n      height: 2.4rem;\r\n      background-position: -10.1rem -5.1rem;\r\n    }\r\n\r\n    span {\r\n      max-width: 100%;\r\n      overflow: hidden;\r\n      text-overflow: ellipsis;\r\n      white-space: nowrap;\r\n    }\r\n  }\r\n\r\n  &.s-bg-white{\r\n    background-color: white;\r\n  }\r\n}\r\n\r\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 372:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-1cc8d8fe"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/components/TeamMember.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "m-members",
    class: {
      "s-bg-white": _vm.advanced && !_vm.showAllMode
    }
  }, [(_vm.hasInvitePermission && !_vm.showAllMode) ? _c('a', {
    staticClass: "u-member",
    attrs: {
      "href": "#/teaminvite/" + _vm.teamId
    }
  }, [_c('img', {
    staticClass: "avatar",
    attrs: {
      "src": "http://yx-web.nos.netease.com/webdoc/h5/im/team_member_add.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', [_vm._v("添加")])]) : _vm._e(), _vm._v(" "), _vm._l((_vm.membersInDisplay), function(member) {
    return _c('a', {
      key: member.account,
      staticClass: "u-member",
      on: {
        "click": function($event) {
          _vm.onMemberClick(member)
        }
      }
    }, [_c('img', {
      staticClass: "avatar u-circle",
      attrs: {
        "src": member.avatar
      }
    }), _vm._v(" "), (_vm.removeMode && member.type != "owner" && member.account != _vm.$store.state.userUID) ? _c('span', {
      staticClass: "remove",
      on: {
        "click": function($event) {
          _vm.remove($event, member)
        }
      }
    }) : _vm._e(), _vm._v(" "), (member.type !== "normal") ? _c('span', {
      class: member.type === "manager" ? "manager" : "owner"
    }) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(member.alias))])])
  }), _vm._v(" "), (!_vm.advanced) ? [_c('a', {
    staticClass: "u-member",
    attrs: {
      "href": "#/teaminvite/" + _vm.teamId
    }
  }, [_c('img', {
    staticClass: "avatar",
    attrs: {
      "src": "http://yx-web.nos.netease.com/webdoc/h5/im/team_member_add.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', [_vm._v("添加")])]), _vm._v(" "), (_vm.hasManagePermission) ? _c('div', {
    staticClass: "u-member",
    on: {
      "click": function($event) {
        _vm.triggerRemove()
      }
    }
  }, [_c('img', {
    staticClass: "avatar",
    attrs: {
      "src": "http://yx-web.nos.netease.com/webdoc/h5/im/team_member_delete.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', [_vm._v("移除")])]) : _vm._e()] : _vm._e()], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1cc8d8fe", module.exports)
  }
}

/***/ }),

/***/ 375:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-1cc8d8fe","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/components/TeamMember.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../~/css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler?{"id":"data-v-1cc8d8fe","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector.js?type=styles&index=0!./TeamMember.vue */ 369);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../~/vue-style-loader/lib/addStylesClient.js */ 5)("d06946a2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-1cc8d8fe\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMember.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-1cc8d8fe\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vux-loader/src/style-loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMember.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 379:
/* no static exports found */
/* all exports used */
/*!*********************************************!*\
  !*** ./src/pages/components/TeamMember.vue ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-1cc8d8fe","scoped":true,"hasInlineConfig":true}!../../../~/vux-loader/src/style-loader.js!../../../~/vue-loader/lib/selector?type=styles&index=0!./TeamMember.vue */ 375)

var Component = __webpack_require__(/*! ../../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../../~/vux-loader/src/script-loader.js!../../../~/vue-loader/lib/selector?type=script&index=0!./TeamMember.vue */ 362),
  /* template */
  __webpack_require__(/*! !../../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-1cc8d8fe"}!../../../~/vux-loader/src/before-template-compiler-loader.js!../../../~/vux-loader/src/template-loader.js!../../../~/vue-loader/lib/selector?type=template&index=0!./TeamMember.vue */ 372),
  /* scopeId */
  "data-v-1cc8d8fe",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\components\\TeamMember.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] TeamMember.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1cc8d8fe", Component.options)
  } else {
    hotAPI.reload("data-v-1cc8d8fe", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 452:
/* no static exports found */
/* all exports used */
/*!**********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/TeamManage.vue ***!
  \**********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _configs = __webpack_require__(/*! ../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

var _utils = __webpack_require__(/*! ../utils */ 16);

var _utils2 = _interopRequireDefault(_utils);

var _TeamMember = __webpack_require__(/*! ./components/TeamMember.vue */ 379);

var _TeamMember2 = _interopRequireDefault(_TeamMember);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      avatar: _configs2.default.defaultUserIcon,
      isOwner: false,
      hasSearched: false
    };
  },

  computed: {
    teamId: function teamId() {
      return this.$route.params.teamId;
    },
    teamInfo: function teamInfo() {
      var _this = this;

      var teamList = this.$store.state.teamlist;
      var team = teamList && teamList.find(function (team) {
        return team.teamId === _this.teamId;
      });
      if (!team) {
        return undefined;
      }
      return team;
    },
    teamMembers: function teamMembers() {
      return this.$store.state.teamMembers[this.teamId];
    },
    teamMemberNum: function teamMemberNum() {
      return this.teamMembers && this.teamMembers.length;
    },
    teamAvatar: function teamAvatar() {
      return this.teamInfo.avatar || this.avatar;
    },
    teamName: function teamName() {
      return this.teamInfo && this.teamInfo.name || '未设置';
    },
    nickName: function nickName() {
      var _this2 = this;

      if (!this.teamMembers) return '未设置';
      var selfInfo = this.teamMembers.find(function (item) {
        return item.account === _this2.$store.state.userUID;
      });
      return selfInfo && selfInfo.nickInTeam || '未设置';
    },
    hasManagePermission: function hasManagePermission() {
      var _this3 = this;

      if (!this.teamMembers) return false;
      var self = this.teamMembers.find(function (member) {
        return member.account === _this3.$store.state.userUID;
      });
      this.isOwner = self.type === 'owner';
      return self.type !== 'normal';
    },
    hasEditPermission: function hasEditPermission() {
      return this.teamInfo.type === 'normal' || this.teamInfo.updateTeamMode === 'all' || this.hasManagePermission;
    }
  },
  methods: {
    onTeamAvatarClick: function onTeamAvatarClick() {
      if (this.hasEditPermission) {
        this.$refs.input.click();
      }
    },
    onFileSelected: function onFileSelected(event) {
      var _this4 = this;

      this.$store.dispatch('showLoading');
      var fileInput = event.target;
      if (fileInput.files.length === 0) {
        return;
      }
      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'previewFile',
        options: {
          fileInput: fileInput,
          done: function done(err, data) {
            _this4.$store.dispatch('hideLoading');
            if (err) {
              _this4.$toast(err);
            } else {
              if (data.w < 300 || data.h < 300) {
                _this4.$toast("图片长宽不能小于300");
                return;
              }
              _this4.updateTeamAvatar(data.url);
            }
          }
        }
      });
    },
    updateTeamAvatar: function updateTeamAvatar(url) {
      var _this5 = this;

      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'updateTeam',
        options: {
          teamId: this.teamId,
          avatar: url,
          done: function done(err, data) {
            _this5.$toast(err ? err : '修改群头像成功');
          }
        }
      });
    },
    dismissTeam: function dismissTeam() {
      var that = this;
      this.$vux.confirm.show({
        title: '确定要解散群？',
        onConfirm: function onConfirm() {
          that.$store.dispatch('showLoading');
          that.$store.dispatch('delegateTeamFunction', {
            functionName: 'dismissTeam',
            options: {
              teamId: that.teamId,
              done: function done(error, obj) {
                that.$store.dispatch('hideLoading');
                that.$toast(error ? error : '已解散群');
                window.history.go(-1);
              }
            }
          });
        }
      });
    },
    leaveTeam: function leaveTeam() {
      var that = this;
      this.$vux.confirm.show({
        title: '确定要退出群？',
        onConfirm: function onConfirm() {
          that.$store.dispatch('showLoading');
          that.$store.dispatch('delegateTeamFunction', {
            functionName: 'leaveTeam',
            options: {
              teamId: that.teamId,
              done: function done(error, obj) {
                that.$store.dispatch('hideLoading');
                that.$toast(error ? error : '已退出群');
                window.history.go(-2);
              }
            }
          });
        }
      });
    },
    onEditItemClick: function onEditItemClick(title, inputType, updateKey, updateInfoInTeam) {
      this.$store.dispatch('enterSettingPage', {
        title: title,
        inputType: inputType,
        updateKey: updateKey,
        teamId: this.teamId,
        defaultValue: this.teamInfo[updateKey],
        updateInfoInTeam: updateInfoInTeam,
        enable: updateInfoInTeam ? true : this.hasEditPermission
      });
    },
    getTeamInfo: function getTeamInfo(key) {
      return _utils2.default.teamConfigMap[key][this.teamInfo[key]];
    },

    formateDate: function formateDate(timeMill) {
      var date = new Date(timeMill);
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
  },
  components: {
    TeamMember: _TeamMember2.default
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 462:
/* no static exports found */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-3dbe9b44","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamManage.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.g-window .m-article.p-teammanager {\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-moz-box;\n  display:-ms-flexbox;\n  display:flex;\n  background-color: #e6ebf0;\n}\n.g-window .m-article.p-teammanager .m-body {\n  overflow-y: scroll;\n  width: 100%;\n}\n.g-window .m-article.p-teammanager img.avatar{\n  width: 3.8rem;\n  height: 3.8rem;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 auto;\n     -moz-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n}\n.g-window .m-article.p-teammanager .m-group {\n  background-color: white;\n}\n.g-window .m-article.p-teammanager .m-group .weui-cells:after {\n  border-bottom-style: none;\n}\n.g-window .m-article.p-teammanager .m-group .weui-cell:before {\n  border: none;\n}\n.g-window .m-article.p-teammanager .m-group .weui-cell:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 1px;\n  border-bottom: 1px solid #D9D9D9;\n  color: #D9D9D9;\n  -webkit-transform-origin: 0 100%;\n     -moz-transform-origin: 0 100%;\n          transform-origin: 0 100%;\n  -webkit-transform: scaleY(0.5);\n     -moz-transform: scaleY(0.5);\n          transform: scaleY(0.5);\n  left: 15px;\n  right: 15px;\n}\n.g-window .m-article.p-teammanager .m-group .weui-btn {\n  margin: 1rem 5%;\n}\n.g-window .m-article.p-teammanager .m-group .weui-cell__ft{\n  max-width: 70%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color:#aaa;\n}\n.g-window .m-article.p-teammanager .m-group + .m-group {\n  margin-top:1rem;\n}\n.g-window .m-article.p-teammanager .m-teaminfo {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n     -moz-box-orient: horizontal;\n     -moz-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n     -moz-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.g-window .m-article.p-teammanager .m-teaminfo .u-info{\n  margin-left: 1rem;\n}\n.g-window .m-article.p-teammanager .m-teaminfo .u-info span{\n  color: #999;\n  font-size: 0.9rem;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/TeamManage.vue"],"names":[],"mappings":";AAyNA;EACE,oBAAa;EAAb,qBAAa;EAAb,iBAAa;EAAb,oBAAa;EAAb,aAAa;EACb,0BAA0B;CA6D3B;AA3DC;EACE,mBAAmB;EACnB,YAAY;CACb;AAED;EACE,cAAc;EACd,eAAe;EACf,oBAAe;EAAf,uBAAe;KAAf,iBAAe;MAAf,mBAAe;UAAf,eAAe;CAChB;AAED;EACE,wBAAwB;CAkCzB;AA9BC;EACE,0BAA0B;CAC3B;AACD;EACE,aAAa;CACd;AACD;EACE,aAAa;EACb,mBAAmB;EACnB,QAAQ;EACR,UAAU;EACV,SAAS;EACT,YAAY;EACZ,iCAAiC;EACjC,eAAe;EACf,iCAAyB;KAAzB,8BAAyB;UAAzB,yBAAyB;EACzB,+BAAuB;KAAvB,4BAAuB;UAAvB,uBAAuB;EACvB,WAAW;EACX,YAAY;CACb;AACD;EACE,gBAAgB;CACjB;AACD;EACE,eAAe;EACf,iBAAiB;EACjB,wBAAwB;EACxB,oBAAoB;EACpB,WAAW;CACZ;AAhCD;EACE,gBAAiB;CAClB;AAgCH;EACE,qBAAc;EAAd,sBAAc;EAAd,kBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,+BAAoB;EAApB,8BAAoB;EAApB,4BAAoB;KAApB,4BAAoB;KAApB,2BAAoB;MAApB,wBAAoB;UAApB,oBAAoB;EACpB,0BAAoB;EAApB,4BAAoB;KAApB,uBAAoB;MAApB,uBAAoB;UAApB,oBAAoB;CAQrB;AAPC;EACE,kBAAkB;CAKnB;AAJC;EACE,YAAY;EACZ,kBAAkB;CACnB","file":"TeamManage.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.g-window .m-article.p-teammanager {\n  display:flex;\n  background-color: #e6ebf0;\n  \n  .m-body {\n    overflow-y: scroll;\n    width: 100%;\n  }\n\n  img.avatar{\n    width: 3.8rem;\n    height: 3.8rem;\n    flex: 0 1 auto;\n  }\n\n  .m-group {\n    background-color: white;\n    & + .m-group {\n      margin-top: 1rem;\n    }\n    .weui-cells:after {\n      border-bottom-style: none;\n    }\n    .weui-cell:before {\n      border: none;\n    }\n    .weui-cell:after {\n      content: \" \";\n      position: absolute;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      height: 1px;\n      border-bottom: 1px solid #D9D9D9;\n      color: #D9D9D9;\n      transform-origin: 0 100%;\n      transform: scaleY(0.5);\n      left: 15px;\n      right: 15px;\n    }\n    .weui-btn {\n      margin: 1rem 5%;\n    }\n    .weui-cell__ft{\n      max-width: 70%;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      color:#aaa;\n    }\n  }\n  .m-teaminfo {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    .u-info{\n      margin-left: 1rem;\n      span{\n        color: #999;\n        font-size: 0.9rem;\n      }\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 482:
/* no static exports found */
/* all exports used */
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-3dbe9b44"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/TeamManage.vue ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-teammanager"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v("群设置")]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "m-body"
  }, [(_vm.teamInfo && _vm.teamInfo.type === 'normal') ? [_c('team-member', {
    attrs: {
      "teamId": _vm.teamId
    }
  }), _vm._v(" "), _c('group', {
    staticClass: "m-group"
  }, [_c('cell', {
    attrs: {
      "title": "讨论组名称",
      "value": _vm.teamName,
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('修改讨论组名称', 'text', 'name'); })($event)
      }
    }
  }), _vm._v(" "), _c('x-button', {
    attrs: {
      "mini": "",
      "type": "warn"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.leaveTeam($event)
      }
    }
  }, [_vm._v("退出讨论组")])], 1)] : _vm._e(), _vm._v(" "), (_vm.teamInfo && _vm.teamInfo.type === 'advanced') ? [_c('cell', {
    attrs: {
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return _vm.onTeamAvatarClick($event)
      }
    }
  }, [_c('div', {
    staticClass: "m-teaminfo",
    attrs: {
      "slot": "icon"
    },
    slot: "icon"
  }, [_c('img', {
    staticClass: "avatar u-circle",
    attrs: {
      "src": _vm.teamAvatar
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "u-info"
  }, [_c('p', [_vm._v(_vm._s(_vm.teamInfo.name))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(((_vm.teamInfo.teamId) + " 于" + (_vm.formateDate(_vm.teamInfo.createTime)) + "创建")))])])]), _vm._v(" "), _c('form', [_c('input', {
    ref: "input",
    staticStyle: {
      "display": "none"
    },
    attrs: {
      "type": "file",
      "accept": "image/*"
    },
    on: {
      "change": _vm.onFileSelected
    }
  })])]), _vm._v(" "), _c('group', {
    staticClass: "m-group"
  }, [_c('cell', {
    attrs: {
      "title": "群成员",
      "value": ("共" + _vm.teamMemberNum + "人"),
      "is-link": "",
      "link": ("/teammembers/" + _vm.teamId)
    }
  }), _vm._v(" "), _c('team-member', {
    attrs: {
      "teamId": _vm.teamId,
      "advanced": true
    }
  })], 1), _vm._v(" "), _c('group', {
    staticClass: "m-group"
  }, [_c('cell', {
    attrs: {
      "title": "群名称",
      "value": _vm.teamName,
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick(_vm.hasEditPermission ? '修改群名称' : '群名称', 'text', 'name'); })($event)
      }
    }
  }), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "群昵称",
      "value": _vm.nickName,
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('修改群昵称', 'text', 'nickInTeam', true); })($event)
      }
    }
  }), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "群介绍",
      "value": _vm.teamInfo.intro || '未设置',
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick(_vm.hasEditPermission ? '修改群介绍' : '群介绍', 'textarea', 'intro'); })($event)
      }
    }
  })], 1), _vm._v(" "), (_vm.hasManagePermission) ? _c('group', {
    staticClass: "m-group"
  }, [_c('cell', {
    attrs: {
      "title": "身份验证",
      "value": _vm.getTeamInfo('joinMode'),
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('身份验证', 'select', 'joinMode'); })($event)
      }
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('group', {
    staticClass: "m-group"
  }, [(_vm.hasManagePermission) ? [_c('cell', {
    attrs: {
      "title": "邀请他人权限",
      "value": _vm.getTeamInfo('inviteMode'),
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('邀请他人权限', 'select', 'inviteMode'); })($event)
      }
    }
  }), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "群资料修改权限",
      "value": _vm.getTeamInfo('updateTeamMode'),
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('群资料修改权限', 'select', 'updateTeamMode'); })($event)
      }
    }
  }), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "被邀请人身份验证",
      "value": _vm.getTeamInfo('beInviteMode'),
      "is-link": ""
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.onEditItemClick('被邀请人身份验证', 'select', 'beInviteMode'); })($event)
      }
    }
  })] : _vm._e(), _vm._v(" "), _c('x-button', {
    attrs: {
      "mini": "",
      "type": "warn"
    },
    nativeOn: {
      "click": function($event) {
        return (function () { return _vm.isOwner ? _vm.dismissTeam() : _vm.leaveTeam(); })($event)
      }
    }
  }, [_vm._v(_vm._s(_vm.isOwner ? '解散群聊' : '退出高级群'))])], 2)] : _vm._e()], 2)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3dbe9b44", module.exports)
  }
}

/***/ }),

/***/ 505:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-3dbe9b44","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamManage.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-3dbe9b44","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./TeamManage.vue */ 462);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("208ad512", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-3dbe9b44\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamManage.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-3dbe9b44\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamManage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=6.js.map