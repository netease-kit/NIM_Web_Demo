var Login = {
	init: function() {
		this.initNode();
		this.showNotice();
		this.initAnimation();
		this.addEvent();
	},

	initNode: function() {	// 初始化节点
		this.$account = $('#j-account');
		this.$pwd = $('#j-secret');
		this.$errorMsg = $('#j-errorMsg');
		this.$loginBtn = $('#j-loginBtn');
		this.$footer = $('#footer');
	},

	initAnimation: function() {	// 添加动画
		var $wrapper = $('#j-wrapper'),
			wrapperClass = $wrapper.attr('class');
		$wrapper.addClass('fadeInDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass().addClass(wrapperClass);
		});
	},

	/**
	* 如果浏览器非IE10,Chrome, FireFox, Safari, Opera的话，显示提示
	*/
	showNotice: function() {
		var browser = this.getBrowser(),
			temp = browser.split(' '),
			appname = temp[0],
			version = temp[1];
		if (['msie', 'firefox', 'opera', 'safari', 'chrome'].contains(appname)) {
			if (appname == 'msie' && version < 10) {
				this.$footer.find('p').removeClass('hide');
			}
		} else {
			this.$footer.find('p').removeClass('hide');
		}
	},

	addEvent: function() {	// 绑定事件
		var that = this;
		this.$loginBtn.on('click', this.validate.bind(this));
		$(document).on('keydown', function(e) {
			var ev = e || window.event;
			if (ev.keyCode === 13) {
				that.validate();
			}
		});
	},

	validate: function() {	// 登录验证
		var that = this,
			account = $.trim(that.$account.val()),
			pwd = that.$pwd.val(),
			errorMsg = '';
		if (account.length === 0) {
			errorMsg = '账号不能为空';
		} else if (!pwd || pwd.length < 6) {
			errorMsg = '密码长度至少6位';
		} else {
			that.$loginBtn.html('登录中...').attr('disabled', 'disabled');
			that.requestLogin.call(that, account, pwd);
			that.$loginBtn.html('登录').removeAttr('disabled');
		}
		that.$errorMsg.html(errorMsg).removeClass('hide');  // 显示错误信息
		return false;
	},

	requestLogin: function(account, pwd) {
		var that = this;
		var params = {
			'userid': account,
			'secret': MD5(pwd),
			'client_type': 1
		};
		$.ajax({
			url: 'https://apptest.netease.im/api/token',
			type: 'POST',
			data: JSON.stringify(params),
			contentType: 'application/json',
			success: function(data) {
				if (data.res === 200) {	// 登录成功
					setCookie('uid',data.msg.uid.toLocaleLowerCase());
					setCookie('sdktoken',data.msg.sdktoken);
					window.location.href = '/webdemo/main.html';
				}else if(data.res===453){
					that.$errorMsg.html('账户被锁，请30分钟后再试');
				}else{
					that.$errorMsg.html('用户名或密码错误');
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
Login.init();