webpackJsonp([12],{

/***/ 329:
/* no static exports found */
/* all exports used */
/*!********************************!*\
  !*** ./src/pages/TeamCard.vue ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(/*! !vue-style-loader!css-loader?sourceMap!../../~/vue-loader/lib/style-compiler/index?{"id":"data-v-15ba712f","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector?type=styles&index=0!./TeamCard.vue */ 502)

var Component = __webpack_require__(/*! ../../~/vue-loader/lib/component-normalizer */ 2)(
  /* script */
  __webpack_require__(/*! !babel-loader!../../~/vux-loader/src/script-loader.js!../../~/vue-loader/lib/selector?type=script&index=0!./TeamCard.vue */ 449),
  /* template */
  __webpack_require__(/*! !../../~/vue-loader/lib/template-compiler/index?{"id":"data-v-15ba712f"}!../../~/vux-loader/src/before-template-compiler-loader.js!../../~/vux-loader/src/template-loader.js!../../~/vue-loader/lib/selector?type=template&index=0!./TeamCard.vue */ 479),
  /* scopeId */
  "data-v-15ba712f",
  /* cssModules */
  null
)
Component.options.__file = "D:\\Project\\javascript\\NIM_Web_Demo_H5\\src\\pages\\TeamCard.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] TeamCard.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-15ba712f", Component.options)
  } else {
    hotAPI.reload("data-v-15ba712f", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 449:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************!*\
  !*** ./~/babel-loader/lib!./~/vux-loader/src/script-loader.js!./~/vue-loader/lib/selector.js?type=script&index=0!./src/pages/TeamCard.vue ***!
  \********************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = {
  computed: {
    teamId: function teamId() {
      return this.$route.params.teamId;
    },
    teamInfo: function teamInfo() {
      var _this = this;

      return this.$store.state.searchedTeams.find(function (team) {
        return team.teamId === _this.teamId;
      });
    },
    teamDesc: function teamDesc() {
      if (!this.teamInfo) {
        return '';
      }
      var teamType = this.teamInfo.type === "advanced" ? "高级群" : "普通群";
      return teamType + ":" + this.teamInfo.memberNum + "\u4EBA";
    }
  },
  methods: {
    applyClick: function applyClick() {
      var _this2 = this;

      var team = this.$store.state.teamlist.find(function (team) {
        return team.teamId === _this2.teamId;
      });
      if (team && team.validToCurrentUser) {
        this.$toast('已在群中');
        return;
      }
      switch (this.teamInfo.joinMode) {
        case 'rejectAll':
          this.$toast('该群禁止任何人加入');
          break;
        case 'noVerify':
          this.applyTeam();
          break;
        case 'needVerify':
          this.showConfirm();
          break;
      }
    },
    showConfirm: function showConfirm() {
      var _this3 = this;

      this.$vux.confirm.prompt('限十字以内', {
        title: '请输入验证信息',
        closeOnConfirm: false,
        inputAttrs: {
          maxlength: '10'
        },
        onConfirm: function onConfirm(msg) {
          if (msg) {
            _this3.applyTeam(msg);
            _this3.$vux.confirm.hide();
          } else {
            _this3.$toast('请输入验证信息');
          }
        }
      });
    },
    applyTeam: function applyTeam(msg) {
      var _this4 = this;

      this.$store.dispatch('delegateTeamFunction', {
        functionName: 'applyTeam',
        options: {
          teamId: this.teamId,
          ps: msg || '',
          done: function done(error, obj) {
            if (error) {
              _this4.$toast(error);
              return;
            }
            _this4.$toast(msg ? '申请成功 等待验证' : '已加入群');
            history.go(-2);
          }
        }
      });
    }
  }
};
module.exports = exports["default"];

/***/ }),

/***/ 459:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-15ba712f","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamCard.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../~/css-loader/lib/css-base.js */ 4)(true);
// imports


// module
exports.push([module.i, "\n.g-body[data-v-15ba712f] {\n  margin-top: 5rem;\n  text-align: center;\n}\n.g-body div[data-v-15ba712f] {\n  margin: 1rem auto;\n}\n", "", {"version":3,"sources":["D:/Project/javascript/NIM_Web_Demo_H5/src/pages/TeamCard.vue"],"names":[],"mappings":";AAkGA;EACE,iBAAiB;EACjB,mBAAmB;CAKpB;AAHC;EACE,kBAAkB;CACnB","file":"TeamCard.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.g-body {\n  margin-top: 5rem;\n  text-align: center;\n  \n  div {\n    margin: 1rem auto;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 479:
/* no static exports found */
/* all exports used */
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-loader/lib/template-compiler?{"id":"data-v-15ba712f"}!./~/vux-loader/src/before-template-compiler-loader.js!./~/vux-loader/src/template-loader.js!./~/vue-loader/lib/selector.js?type=template&index=0!./src/pages/TeamCard.vue ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "g-inherit m-article"
  }, [_c('x-header', {
    staticClass: "m-tab",
    attrs: {
      "left-options": {
        backText: ' '
      }
    }
  }, [_c('h1', {
    staticClass: "m-tab-top"
  }, [_vm._v("加入群")]), _vm._v(" "), _c('a', {
    attrs: {
      "slot": "left"
    },
    slot: "left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "g-body"
  }, [_c('img', {
    staticClass: "icon u-circle",
    attrs: {
      "slot": "icon",
      "width": "50",
      "height": "50",
      "src": _vm.teamInfo && _vm.teamInfo.avatar
    },
    slot: "icon"
  }), _vm._v(" "), _c('div', [_vm._v(_vm._s(_vm.teamInfo && _vm.teamInfo.name))]), _vm._v(" "), _c('div', [_vm._v(_vm._s(_vm.teamDesc))]), _vm._v(" "), _c('div', {
    staticClass: "u-bottom"
  }, [_c('x-button', {
    attrs: {
      "type": "primary",
      "action-type": "button"
    },
    nativeOn: {
      "click": function($event) {
        return _vm.applyClick($event)
      }
    }
  }, [_vm._v("申请加入")])], 1)])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-15ba712f", module.exports)
  }
}

/***/ }),

/***/ 502:
/* no static exports found */
/* all exports used */
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/vue-style-loader!./~/css-loader?sourceMap!./~/vue-loader/lib/style-compiler?{"id":"data-v-15ba712f","scoped":true,"hasInlineConfig":true}!./~/vux-loader/src/style-loader.js!./~/vue-loader/lib/selector.js?type=styles&index=0!./src/pages/TeamCard.vue ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../~/css-loader?sourceMap!../../~/vue-loader/lib/style-compiler?{"id":"data-v-15ba712f","scoped":true,"hasInlineConfig":true}!../../~/vux-loader/src/style-loader.js!../../~/vue-loader/lib/selector.js?type=styles&index=0!./TeamCard.vue */ 459);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../../~/vue-style-loader/lib/addStylesClient.js */ 5)("4c8ba566", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-15ba712f\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamCard.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-15ba712f\",\"scoped\":true,\"hasInlineConfig\":true}!../../node_modules/vux-loader/src/style-loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TeamCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
//# sourceMappingURL=12.js.map