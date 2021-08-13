var Login = {
  init: function () {
    this.initNode();
    this.showNotice();
    this.initAnimation();
    this.addEvent();
  },

  initNode: function () {
    // 初始化节点
    this.$phone = $("#j-account");
    this.$smsCode = $("#j-secret");
    this.$errorMsg = $("#j-errorMsg");
    this.$loginBtn = $("#j-loginBtn");
    this.$footer = $("#footer");
    this.$getCode = $("#getCode");
  },

  initAnimation: function () {
    // 添加动画
    var $wrapper = $("#j-wrapper"),
      wrapperClass = $wrapper.attr("class");
    $wrapper
      .addClass("fadeInDown animated")
      .one(
        "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
        function () {
          $(this).removeClass().addClass(wrapperClass);
        }
      );
  },

  /**
   * 如果浏览器非IE10,Chrome, FireFox, Safari, Opera的话，显示提示
   */
  showNotice: function () {
    var browser = this.getBrowser(),
      temp = browser.split(" "),
      appname = temp[0],
      version = temp[1];
    if (["msie", "firefox", "opera", "safari", "chrome"].contains(appname)) {
      if (appname == "msie" && version < 10) {
        this.$footer.find("p").removeClass("hide");
      }
    } else {
      this.$footer.find("p").removeClass("hide");
    }
  },

  addEvent: function () {
    // 绑定事件
    var that = this;
    this.$getCode.on("click", this.getCode.bind(this));
    this.$loginBtn.on("click", this.validate.bind(this));
    $(document).on("keydown", function (e) {
      var ev = e || window.event;
      if (ev.keyCode === 13) {
        that.validate();
      }
    });
  },

  validate: function () {
    // 登录验证
    var that = this,
      phone = $.trim(that.$phone.val()),
      smsCode = that.$smsCode.val(),
      errorMsg = "";
    if (phone.length === 0) {
      errorMsg = "手机号不能为空";
    } else if (!/^1\d{10}$/.test(phone)) {
      errorMsg = "手机号格式错误";
    } else if (!smsCode) {
      errorMsg = "验证码不能为空";
    } else {
      that.$loginBtn.html("登录中...").attr("disabled", "disabled");
      that.requestLogin.call(that, phone, smsCode);
      that.$loginBtn.html("登录").removeAttr("disabled");
    }
    that.$errorMsg.html(errorMsg).removeClass("hide"); // 显示错误信息
    return false;
  },

  getCode: function () {
    var that = this;
    var phone = $.trim(that.$phone.val());
    if (!phone) {
      this.$errorMsg.html("手机号不能为空").removeClass("hide");
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      this.$errorMsg.html("手机号格式错误").removeClass("hide");
      return;
    }
    $.ajax({
      url: CONFIG.authService + "/auth/sendLoginSmsCode",
      method: "POST",
      contentType: "application/json;charset=utf-8",
      data: JSON.stringify({
        mobile: phone,
      }),
      beforeSend: function (req) {
        req.setRequestHeader("appKey", CONFIG.appkey);
        req.setRequestHeader("scope", 7);
      },
      success: function (data) {
        if (data.code === 200) {
          let total = 60;
          that.$getCode.html(`${total}s后可重发`).attr("disabled", "disabled").css("pointer-events","none");
          const timer = setInterval(function () {
            total--;
            that.$getCode.html(`${total}s后可重发`);
            if (total <= 0) {
              clearInterval(timer);
              that.$getCode.html('获取验证码').removeAttr("disabled").css("pointer-events","auto");
            }
          }, 1000);
        } else {
          that.$errorMsg.html(data.msg).removeClass("hide");
        }
      },
      error: function () {
        that.$errorMsg.html("请求失败，请重试");
      },
    });
  },

  //这里做了个伪登录方式（实际上是把accid，token带到下个页面连SDK在做鉴权）
  //一般应用服务器的应用会有自己的登录接口
  requestLogin: function (phone, smsCode) {
    var that = this;
    $.ajax({
      url: CONFIG.authService + "/auth/loginBySmsCode",
      method: "POST",
      contentType: "application/json;charset=utf-8",
      data: JSON.stringify({
        mobile: phone,
        smsCode: smsCode,
      }),
      beforeSend: function (req) {
        req.setRequestHeader("appKey", CONFIG.appkey);
        req.setRequestHeader("scope", 7);
      },
      success: function (data) {
        if (data.code === 200) {
          const accid = data.data.imAccid;
          const token = data.data.imToken;
          setCookie("uid", accid);
          setCookie("sdktoken", token);
          if (/chatroom/.test(location.href)) {
            delCookie("nickName");
            window.location.href = "./list.html";
          } else {
            window.location.href = "./main.html";
          }
        } else {
          that.$errorMsg.html(data.msg).removeClass("hide");
        }
      },
      error: function () {
        that.$errorMsg.html("请求失败，请重试").removeClass("hide");
      },
    });
  },

  /**
   * 获取浏览器的名称和版本号信息
   */
  getBrowser: function () {
    var browser = {
        msie: false,
        firefox: false,
        opera: false,
        safari: false,
        chrome: false,
        netscape: false,
        appname: "unknown",
        version: 0,
      },
      ua = window.navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
      browser[RegExp.$1] = true;
      browser.appname = RegExp.$1;
      browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
      // safari
      browser.safari = true;
      browser.appname = "safari";
      browser.version = RegExp.$2;
    }
    return browser.appname + " " + browser.version;
  },
};
Login.init();
