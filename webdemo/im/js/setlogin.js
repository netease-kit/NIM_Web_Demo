var Login = {

	//这里做了个伪登录方式（实际上是把accid，token带到下个页面连SDK在做鉴权）
	//一般应用服务器的应用会有自己的登录接口
	requestLogin: function(account, pwd) {
		setCookie('uid',account.toLocaleLowerCase());
		//自己的appkey就不用加密了
		// setCookie('sdktoken',pwd);
		setCookie('sdktoken',MD5(pwd));
		// if (/chatroom/.test(location.href)) {
		// 	delCookie('nickName')
		// 	window.location.href = './list.html'
		// } else {
		// 	window.location.href = './main.html';
		// }
			
	},

};
Login.requestLogin('hechangming', '123456');