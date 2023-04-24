var register = {
  init: function() {
    this.initNode();
    this.addEvent();
  },

  initNode: function() {
    // 初始化节点
    this.$phone = $('#phone');
    this.$smsCode = $('#smsCode');
    this.$nickname = $('#nickname');
    this.$errorMsg = $('#errorMsg');
    this.$submit = $('#submit');
    this.$getCode = $('#getCode');
  },

  addEvent: function() {
    // 绑定事件
    var that = this;
    this.$submit.on('click', this.validate.bind(this));
    this.$getCode.on('click', this.getCode.bind(this));
    $(document).on('keydown', function(e) {
      var ev = e || window.event;
      if (ev.keyCode === 13) {
        that.validate();
      }
    });
  },

  validate: function() {
    this.$errorMsg.addClass('hide');
    var phone = $.trim(this.$phone.val()),
      smsCode = this.$smsCode.val(),
      nickname = $.trim(this.$nickname.val()),
      errorMsg = '';
    if (phone.length === 0) {
      errorMsg = '手机号不能为空';
    } else if (!/^1\d{10}$/.test(phone)) {
      errorMsg = "手机号格式错误";
    } else if (nickname.length === 0) {
      errorMsg = '昵称不能为空';
    } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/gi.test(nickname)) {
      errorMsg = "昵称有误";
    } else if (!smsCode) {
      errorMsg = '验证码不能为空';
    } else {
      this.$submit.html('注册中...').attr('disabled', 'disabled');
      this.doRegister(phone, smsCode, nickname);
      return;
    }
    this.$errorMsg.html(errorMsg).removeClass('hide'); // 显示错误信息
    return false;
  },

  getCode: function() {
    var that = this;
    var phone = $.trim(that.$phone.val());
    if (!phone) {
      this.$errorMsg.html('手机号不能为空').removeClass('hide');
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      this.$errorMsg.html("手机号格式错误").removeClass("hide");
      return;
    }
    $.ajax({
      url: CONFIG.authService + '/auth/sendLoginSmsCode',
      method: 'POST',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({
        mobile: phone
      }),
      beforeSend: function(req) {
        req.setRequestHeader('appKey', CONFIG.appkey);
        req.setRequestHeader('scope', 7);
      },
      success: function(data) {
        if (data.code === 200) {
          let total = 60;
          that.$getCode.html(`${total}s后可重发`).attr('disabled', 'disabled').css("pointer-events","none");
          const timer = setInterval(function() {
              total--;
              that.$getCode.html(`${total}s后可重发`)
              if(total <= 0) {
                clearInterval(timer)
                that.$getCode.html('获取验证码').removeAttr('disabled').css("pointer-events", "auto");
              }
          }, 1000)
        } else {
          that.$errorMsg.html(data.msg).removeClass('hide');
        }
      },
      error: function() {
        that.$errorMsg.html('请求失败，请重试');
      }
    })
  },

  doRegister: function(phone, smsCode, nickname) {
    var that = this;
    var params = JSON.stringify({
      mobile: phone,
      nickname: nickname,
      smsCode: smsCode,
    });
    $.ajax({
      url: CONFIG.authService + '/auth/registerBySmsCode',
      method: 'POST',
      data: params,
      contentType: 'application/json;charset=utf-8',
      beforeSend: function(req) {
        req.setRequestHeader('appKey', CONFIG.appkey);
        req.setRequestHeader('scope', 7);
      },
      success: function(data) {
        if (data.code === 200) {
          alert('注册成功');
          window.location.href = './login.html';
        } else {
          that.$errorMsg.html(data.msg).removeClass('hide');
          that.$submit.html('注册').removeAttr('disabled');
        }
      },
      error: function() {
        that.$errorMsg.html('请求失败，请重试');
      }
    });
  },

  /**
   * 获取浏览器的名称和版本号信息
   */
  getBrowser: function() {
    var browser = {
        msie: false,
        firefox: false,
        opera: false,
        safari: false,
        chrome: false,
        netscape: false,
        appname: 'unknown',
        version: 0
      },
      ua = window.navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
      browser[RegExp.$1] = true;
      browser.appname = RegExp.$1;
      browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
      // safari
      browser.safari = true;
      browser.appname = 'safari';
      browser.version = RegExp.$2;
    }
    return browser.appname + ' ' + browser.version;
  }
};
register.init();
