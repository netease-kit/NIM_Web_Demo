webpackJsonp([16],{

/***/ 320:
/* no static exports found */
/* all exports used */
/*!********************************!*\
  !*** ./src/pages/Contacts.vue ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-73e40375","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./Contacts.vue */ 514)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./Contacts.vue */ 437),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-73e40375"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./Contacts.vue */ 495),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\Contacts.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Contacts.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73e40375", Component.options)
  } else {
    hotAPI.reload("data-v-73e40375", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 437:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/Contacts.vue ***!
  \********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = {
  computed: {
    friendslist: function friendslist() {
      var _this = this;

      return this.$store.state.friendslist.filter(function (item) {
        var account = item.account;
        var thisAttrs = _this.userInfos[account];
        var alias = thisAttrs.alias ? thisAttrs.alias.trim() : '';
        item.alias = alias || thisAttrs.nick || account;
        item.link = '/namecard/' + item.account;
        if (!thisAttrs.isFriend || thisAttrs.isBlack) {
          return false;
        }
        return true;
      });
    },
    blacklist: function blacklist() {
      var _this2 = this;

      return this.$store.state.blacklist.filter(function (item) {
        var account = item.account;
        var thisAttrs = _this2.userInfos[account];
        var alias = thisAttrs.alias ? thisAttrs.alias.trim() : '';
        item.alias = alias || thisAttrs.nick || account;
        item.link = '/namecard/' + item.account;
        if (!thisAttrs.isFriend) {
          return false;
        }
        return true;
      });
    },
    robotslist: function robotslist() {
      return this.$store.state.robotslist.map(function (item) {
        item.link = '/namecard/' + item.account;
        return item;
      });
    },
    userInfos: function userInfos() {
      return this.$store.state.userInfos;
    }
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 471:
/* no static exports found */
/* all exports used */
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-73e40375","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/Contacts.vue ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.p-contacts .add-friend {\n    background-color: #fff;\n}\n.p-contacts .m-list {\n    padding-top: 8rem;\n}\n.p-contacts .u-search-box-wrap {\n    text-align: center;\n}\n.p-contacts .u-search-box {\n    position: relative;\n    display: inline-block;\n    -moz-box-sizing: border-box;\n         box-sizing: border-box;\n    min-width: 45%;\n    padding: 1em;\n    height: 3rem;\n    text-align: center;\n    border: 1px solid #ccc;\n    background-color: #fff;\n    font-size: 0.8rem;\n    box-shadow: 2px 2px 6px #ccc;\n}\n.p-contacts .u-search-box a {\n    display: inline-block;\n    -moz-box-sizing: border-box;\n         box-sizing: border-box;\n    height: 100%;\n    width: 100%;\n}\n.p-contacts .u-card .icon {\n    display: inline-block;\n    margin-right: 0.4rem;\n    width: 1.4rem;\n    height: 1.4rem;\n    background-size: 20rem;\n}\n.p-contacts .u-card .icon-team-advanced {\n    background-position: 0 -3rem;\n    background-image: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\n}\n.p-contacts .u-card .icon-team {\n    background-position: -2.1rem -3rem;\n    background-image: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/Contacts.vue"],"names":[],"mappings":";AA4FE;IACE,uBAAuB;CACxB;AACD;IACE,kBAAkB;CACnB;AACD;IACE,mBAAmB;CACpB;AACD;IACE,mBAAmB;IACnB,sBAAsB;IACtB,4BAAuB;SAAvB,uBAAuB;IACvB,eAAe;IACf,aAAa;IACb,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,uBAAuB;IACvB,kBAAkB;IAClB,6BAA6B;CAO9B;AANC;IACE,sBAAsB;IACtB,4BAAuB;SAAvB,uBAAuB;IACvB,aAAa;IACb,YAAY;CACb;AAGD;IACE,sBAAsB;IACtB,qBAAqB;IACrB,cAAc;IACd,eAAe;IACf,uBAAuB;CACxB;AACD;IACE,6BAA6B;IAC7B,4EAA4E;CAC7E;AACD;IACE,mCAAmC;IACnC,4EAA4E;CAC7E","file":"Contacts.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.p-contacts {\n  .add-friend {\n    background-color: #fff;\n  }\n  .m-list {\n    padding-top: 8rem;\n  }\n  .u-search-box-wrap {\n    text-align: center;\n  }\n  .u-search-box {\n    position: relative;\n    display: inline-block;\n    box-sizing: border-box;\n    min-width: 45%;\n    padding: 1em;\n    height: 3rem;\n    text-align: center;\n    border: 1px solid #ccc;\n    background-color: #fff;\n    font-size: 0.8rem;\n    box-shadow: 2px 2px 6px #ccc;\n    a {\n      display: inline-block;\n      box-sizing: border-box;\n      height: 100%;\n      width: 100%;\n    }\n  }\n  .u-card {\n    .icon {\n      display: inline-block;\n      margin-right: 0.4rem;\n      width: 1.4rem;\n      height: 1.4rem;\n      background-size: 20rem;\n    }\n    .icon-team-advanced {\n      background-position: 0 -3rem;\n      background-image: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\n    }\n    .icon-team {\n      background-position: -2.1rem -3rem;\n      background-image: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 495:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-73e40375"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/Contacts.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-main p-contacts"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "m-list",
    attrs: {
      "id": "userList"
    }
  }, [_c('group', {
    staticClass: "u-card",
    attrs: {
      "title": "群"
    }
  }, [_c('cell', {
    attrs: {
      "title": "高级群",
      "is-link": "",
      "link": "/teamlist/advanced"
    }
  }, [_c('span', {
    staticClass: "icon icon-team-advanced",
    attrs: {
      "slot": "icon"
    },
    slot: "icon"
  })]), _vm._v(" "), _c('cell', {
    attrs: {
      "title": "讨论组",
      "is-link": "",
      "link": "/teamlist/normal"
    }
  }, [_c('span', {
    staticClass: "icon icon-team",
    attrs: {
      "slot": "icon"
    },
    slot: "icon"
  })])], 1), _vm._v(" "), _c('group', {
    staticClass: "u-card",
    attrs: {
      "title": "好友列表"
    }
  }, _vm._l((_vm.friendslist), function(friend) {
    return _c('cell', {
      key: friend.account,
      attrs: {
        "title": friend.alias,
        "is-link": "",
        "link": friend.link
      }
    }, [_c('img', {
      staticClass: "icon",
      attrs: {
        "slot": "icon",
        "width": "20",
        "src": _vm.userInfos[friend.account].avatar
      },
      slot: "icon"
    })])
  })), _vm._v(" "), _c('group', {
    staticClass: "u-card",
    attrs: {
      "title": "机器人"
    }
  }, _vm._l((_vm.robotslist), function(robot) {
    return _c('cell', {
      key: robot.account,
      attrs: {
        "title": robot.nick,
        "is-link": "",
        "link": robot.link
      }
    }, [_c('img', {
      staticClass: "icon u-circle",
      attrs: {
        "slot": "icon",
        "width": "20",
        "src": robot.avatar
      },
      slot: "icon"
    })])
  })), _vm._v(" "), _c('group', {
    staticClass: "u-card",
    attrs: {
      "title": "黑名单"
    }
  }, _vm._l((_vm.blacklist), function(friend) {
    return _c('cell', {
      key: friend.account,
      attrs: {
        "title": friend.alias,
        "is-link": "",
        "link": friend.link
      }
    }, [_c('img', {
      staticClass: "icon u-circle",
      attrs: {
        "slot": "icon",
        "width": "20",
        "src": _vm.userInfos[friend.account].avatar
      },
      slot: "icon"
    })])
  }))], 1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "m-cards u-search-box-wrap"
  }, [_c('span', {
    staticClass: "u-search-box"
  }, [_c('a', {
    attrs: {
      "href": "#/searchUser/0"
    }
  }, [_vm._v("\n        添加好友\\群\n      ")])]), _vm._v(" "), _c('span', {
    staticClass: "u-search-box"
  }, [_c('a', {
    attrs: {
      "href": "#/teaminvite/0"
    }
  }, [_vm._v("\n      创建组\\群\n      ")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-73e40375", module.exports)
  }
}

/***/ }),

/***/ 514:
/* no static exports found */
/* all exports used */
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-73e40375","scoped":false,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/Contacts.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-73e40375","scoped":false,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./Contacts.vue */ 471);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("9bdd95dc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-73e40375\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Contacts.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-73e40375\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Contacts.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=16.js.map