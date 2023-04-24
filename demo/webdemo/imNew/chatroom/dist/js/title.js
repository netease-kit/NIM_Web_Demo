(function () {
 	function getAvatar(url) {
        var re=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
        if(re.test(url)){
			return page.link.room.viewImageSync({
				url: url,
				quality: 85, // 图片质量 0 - 100 可选填
				thumbnail: { // 生成缩略图， 可选填
					width: 80,
					height: 80,
					mode: 'cover'
				}
			})
            // return url+"?imageView&thumbnail=80x80&quality=85";
        }else{
            return "./images/default-icon.png"
        } 
	}
	function logout () {
		if (confirm('确认要退出聊天室帐号？')) {
			util.delCookie('nickName')
			util.delCookie('sdktoken')
			util.delCookie('avatar')
			util.delCookie('uid')
			location.href = './list.html'
		}
	}
	// var sdktoken = readCookie('sdktoken');
	// if(!sdktoken){
		//  	window.location.href = '../index.html';
		// }
	var nickName = util.readCookie("nickName")
	if (nickName === 'null' || nickName === 'undefined') {
		util.delCookie('nickName')
		nickName = ''
	}
	nickName = nickName || util.readCookie('uid') || '匿名'
	$("#nickName").text(nickName)
	$('#chatroom-logout').on('click', logout)
	document.getElementById('avatar').src = getAvatar(util.readCookie("avatar"));
	if (util.readCookie('sdktoken')) {
		$('#chatroom-login').hide()
	} else {
		// 匿名状态
		$('.m-head .action').hide()
		$('#chatroom-logout').hide()
	}
	$('#nickName').on('click', function () {
		if (util.readCookie('sdktoken')) {
			location.href = './roomManage.html'
		} else {
			alert('聊天室匿名登录不支持房间管理')
		}
	})
})();