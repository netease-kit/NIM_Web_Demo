var register = {
	init: function() {
		this.initNode();
		this.addEvent();
	},

	initNode: function() {	// 初始化节点
		this.$username = $('#username');
		this.$pwd = $('#password');
		this.$nickname = $('#nickname');
		this.$errorMsg = $('#errorMsg');
		this.$submit = $('#submit');
	},

	addEvent: function() {	// 绑定事件
		var that = this;
		this.$submit.on('click', this.validate.bind(this));
		$(document).on('keydown', function(e) {
			var ev = e || window.event;
			if (ev.keyCode === 13) {
				that.validate();
			}
		});
	},

	validate: function() {	
		this.$errorMsg.addClass('hide');
		var that = this,
			username = $.trim(this.$username.val()),
			pwd = this.$pwd.val(),
			nickname = $.trim(this.$nickname.val()),
			errorMsg = '';
		if (username.length === 0) {
			errorMsg = '帐号不能为空';
		} else if(nickname.length===0){
			errorMsg = '昵称不能为空';
		}else if (!pwd || pwd.length < 6) {
			errorMsg = '密码为6~20位字母或者数字';
		}else {
			this.$submit.html('注册中...').attr('disabled', 'disabled');
			this.doRegister(username,pwd,nickname);
			return;
			this.$submit.html('注册').removeAttr('disabled');
		}
		this.$errorMsg.html(errorMsg).removeClass('hide');  // 显示错误信息
		return false;
	},

	doRegister: function(username,pwd,nickname) {
		var that = this;
		var params = {
			'username': username,
			'password':MD5(pwd),
			'nickname': nickname
		};
		$.ajax({
			url: CONFIG.url+'/api/createDemoUser',
			type: 'POST',
			data: params,
			contentType: 'application/x-www-form-urlencoded',
		 	beforeSend: function (req) {
                req.setRequestHeader('appkey', CONFIG.appkey);
            },
			success: function(data) {
				if (data.res === 200) {	
					alert("注册成功");
					window.location.href = './index.html';
				}else{
					that.$errorMsg.html(data.errmsg).removeClass('hide');
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
		}, ua = window.navigator.userAgent.toLowerCase();
		if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
			browser[RegExp.$1] = true;
			browser.appname = RegExp.$1;
			browser.version = RegExp.$2;
		} else if (/version\D+(\d[\d.]*).*safari/.test(ua)){ // safari
			browser.safari = true;
			browser.appname = 'safari';
			browser.version = RegExp.$2;
		}
		return browser.appname + ' ' + browser.version;
	}
};
register.init();