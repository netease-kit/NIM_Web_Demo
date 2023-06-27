webpackJsonp([17],{

/***/ 326:
/* no static exports found */
/* all exports used */
/*!**********************************!*\
  !*** ./src/pages/SearchUser.vue ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./SearchUser.vue */ 446),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-3df14b96"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./SearchUser.vue */ 483),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\SearchUser.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] SearchUser.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3df14b96", Component.options)
  } else {
    hotAPI.reload("data-v-3df14b96", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 446:
/* no static exports found */
/* all exports used */
/*!**********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/SearchUser.vue ***!
  \**********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _configs = __webpack_require__(/*! ../configs */ 6);

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.searchType = parseInt(_this.$route.params.searchType);
      _this.$store.dispatch('resetSearchResult');
    });

    setTimeout(function () {
      _this.$refs.searchInput.$refs.input.focus();
    }, 500);
  },
  data: function data() {
    return {
      searchType: 0,
      searchText: '',
      searchList: [],
      errMsg: '',

      firstEntry: true
    };
  },

  watch: {
    searchResult: function searchResult(val, oldVal) {
      if (val.length === 0 && !this.firstEntry) {
        this.errMsg = '无记录';
      } else {
        this.errMsg = '';
      }
      this.searchList = val;
    },
    searchType: function searchType() {
      this.$refs.searchInput.$refs.input.focus();
    }
  },
  computed: {
    searchResult: function searchResult() {
      var result = [];
      if (this.searchType === 1) {
        result = this.$store.state.searchedTeams.map(function (item) {
          item.avatar = item.avatar || _configs2.default.defaultUserIcon;
          item.link = '/teamcard/' + item.teamId;
          return item;
        });
      } else if (this.searchType === 0) {
        result = this.$store.state.searchedUsers.map(function (item) {
          item.nick = item.nick || item.account;
          item.link = '/namecard/' + item.account;
          item.avatar = item.avatar || _configs2.default.defaultUserIcon;
          return item;
        });
      }
      return result;
    }
  },
  methods: {
    searchUser: function searchUser() {
      if (!this.searchText) {
        this.$toast('未输入内容');
        return;
      }
      this.firstEntry = false;
      if (this.searchType === 1) {
        if (!/^(\d){4,9}$/.test(this.searchText)) {
          this.$toast('输入的群号非法');
          return;
        }
        this.$store.dispatch('searchTeam', {
          teamId: this.searchText
        });
      } else if (this.searchType === 0) {
        if (this.searchText === this.$store.state.userUID) {
          this.searchList = [];
          this.errMsg = '别看了，就是你自己！';
        } else {
          this.$store.dispatch('searchUsers', {
            accounts: [this.searchText]
          });
        }
      }
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 483:
/* no static exports found */
/* all exports used */
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-3df14b96"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/SearchUser.vue ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article p-search-user"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('button-tab', {
    staticClass: "m-tab-top",
    model: {
      value: (_vm.searchType),
      callback: function($$v) {
        _vm.searchType = $$v
      },
      expression: "searchType"
    }
  }, [_c('button-tab-item', {
    staticClass: "u-tab-top"
  }, [_vm._v("搜索用户")]), _vm._v(" "), _c('button-tab-item', {
    staticClass: "u-tab-top"
  }, [_vm._v("搜索群")])], 1), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })], 1), _vm._v(" "), _c('group', {
    staticClass: "u-search"
  }, [_c('search', {
    ref: "searchInput",
    staticClass: "u-ipt-default",
    attrs: {
      "type": "text",
      "required": false,
      "auto-fixed": false,
      "placeholder": _vm.searchType === 0 ? '请输入搜索内容' : '请输入群号'
    },
    model: {
      value: (_vm.searchText),
      callback: function($$v) {
        _vm.searchText = $$v
      },
      expression: "searchText"
    }
  }, [_c('span', {
    attrs: {
      "slot": "label"
    },
    slot: "label"
  }, [_vm._v("搜索：")])])], 1), _vm._v(" "), _c('div', [_c('x-button', {
    attrs: {
      "type": "primary",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.searchUser($event)
      }
    }
  }, [_vm._v("搜索")])], 1), _vm._v(" "), _c('group', {
    staticClass: "u-card u-list"
  }, _vm._l((_vm.searchList), function(user, index) {
    return (_vm.searchType === 0) ? _c('cell', {
      key: user.account,
      staticClass: "u-list-item",
      attrs: {
        "title": user.nick,
        "inline-desc": user.account,
        "userId": index,
        "is-link": "",
        "link": user.link
      }
    }, [_c('img', {
      staticClass: "icon",
      attrs: {
        "slot": "icon",
        "width": "20",
        "src": user.avatar
      },
      slot: "icon"
    })]) : _vm._l((_vm.searchList), function(team) {
      return _c('cell', {
        key: team.teamId,
        staticClass: "u-list-item",
        attrs: {
          "title": team.name,
          "is-link": "",
          "link": team.link
        }
      }, [_c('img', {
        staticClass: "icon",
        attrs: {
          "slot": "icon",
          "width": "20",
          "src": team.avatar
        },
        slot: "icon"
      })])
    })
  })), _vm._v(" "), _c('div', {
    staticClass: "u-card"
  }, [_c('h3', [_vm._v(_vm._s(_vm.errMsg))])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3df14b96", module.exports)
  }
}

/***/ })

});
//# sourceMappingURL=17.js.map