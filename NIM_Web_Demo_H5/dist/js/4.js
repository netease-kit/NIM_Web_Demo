webpackJsonp([4],{

/***/ 335:
/* no static exports found */
/* all exports used */
/*!********************************************!*\
  !*** ./src/pages/TeamMsgReceiptDetail.vue ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-6f5e7372","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./TeamMsgReceiptDetail.vue */ 512)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./TeamMsgReceiptDetail.vue */ 455),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-6f5e7372"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./TeamMsgReceiptDetail.vue */ 493),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\TeamMsgReceiptDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] TeamMsgReceiptDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f5e7372", Component.options)
  } else {
    hotAPI.reload("data-v-6f5e7372", Component.options)
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

/***/ 455:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/TeamMsgReceiptDetail.vue ***!
  \********************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _TeamMember = __webpack_require__(/*! ./components/TeamMember.vue */ 379);

var _TeamMember2 = _interopRequireDefault(_TeamMember);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      selectIndex: 0
    };
  },

  computed: {
    teamId: function teamId() {
      return (/(\d+)-(\d+)/.exec(this.$route.params.msgInfo)[1]
      );
    },
    idServer: function idServer() {
      return (/(\d+)-(\d+)/.exec(this.$route.params.msgInfo)[2]
      );
    },
    readAccounts: function readAccounts() {
      return this.$store.state.teamMsgReadsDetail.readAccounts;
    },
    unreadAccounts: function unreadAccounts() {
      return this.$store.state.teamMsgReadsDetail.unreadAccounts;
    }
  },
  created: function created() {
    var _this = this;

    this.$store.dispatch('delegateTeamFunction', {
      functionName: 'getTeamMsgReadAccounts',
      options: {
        teamMsgReceipt: {
          teamId: this.teamId,
          idServer: this.idServer
        },
        done: function done(error, obj, content) {
          if (!error) {
            _this.$store.commit('initMsgReceiptDetail', content);
          }
        }
      }
    });
  },

  methods: {},
  components: {
    TeamMember: _TeamMember2.default
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 469:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6f5e7372","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamMsgReceiptDetail.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.m-article.p-msg-receipt {\n  background: #ebeef3;\n}\n.m-article.p-msg-receipt .select-bar {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n  height: 3rem;\n  background: #fff;\n}\n.m-article.p-msg-receipt .select-bar .item {\n  height: 3rem;\n  width: 50%;\n  line-height: 3rem;\n  -moz-box-sizing: border-box;\n       box-sizing: border-box;\n  text-align: center\n}\n.m-article.p-msg-receipt .select-bar .item.active {\n  color: #0091e4;\n  border-bottom: #0091e4 5px solid;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/TeamMsgReceiptDetail.vue"],"names":[],"mappings":";AAqEA;EACE,oBAAoB;CAqBrB;AAnBC;EACE,qBAAc;EAAd,sBAAc;EAAd,kBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,YAAY;EACZ,aAAa;EACb,iBAAiB;CAclB;AAZC;EACE,aAAa;EACb,WAAW;EACX,kBAAkB;EAClB,4BAAuB;OAAvB,uBAAuB;EACvB,kBAAmB;CAMpB;AAJC;EACE,eAAe;EACf,iCAAiC;CAClC","file":"TeamMsgReceiptDetail.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.m-article.p-msg-receipt {\n  background: #ebeef3;\n\n  .select-bar {\n    display: flex;\n    width: 100%;\n    height: 3rem;\n    background: #fff;\n    \n    .item {\n      height: 3rem;\n      width: 50%;\n      line-height: 3rem;\n      box-sizing: border-box;\n      text-align: center;\n\n      &.active {\n        color: #0091e4;\n        border-bottom: #0091e4 5px solid;\n      }\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 493:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-6f5e7372"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/TeamMsgReceiptDetail.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-msg-receipt"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v("已读回执详情")]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "g-body"
  }, [_c('div', {
    staticClass: "select-bar"
  }, [_c('div', {
    staticClass: "item",
    class: {
      active: _vm.selectIndex === 0
    },
    on: {
      "click": function($event) {
        _vm.selectIndex = 0
      }
    }
  }, [_vm._v("\n        未读 (" + _vm._s(_vm.unreadAccounts.length) + ")\n      ")]), _vm._v(" "), _c('div', {
    staticClass: "item",
    class: {
      active: _vm.selectIndex === 1
    },
    on: {
      "click": function($event) {
        _vm.selectIndex = 1
      }
    }
  }, [_vm._v("\n        已读 (" + _vm._s(_vm.readAccounts.length) + ")\n      ")])])]), _vm._v(" "), _c('team-member', {
    attrs: {
      "teamId": _vm.teamId,
      "advanced": true,
      "showAllMode": true,
      "filterAccount": _vm.selectIndex === 0 ? _vm.unreadAccounts : _vm.readAccounts
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6f5e7372", module.exports)
  }
}

/***/ }),

/***/ 512:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-6f5e7372","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamMsgReceiptDetail.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-6f5e7372","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./TeamMsgReceiptDetail.vue */ 469);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("6edb8755", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6f5e7372\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMsgReceiptDetail.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6f5e7372\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamMsgReceiptDetail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=4.js.map