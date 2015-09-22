
var SDKBridge = function (ctr,data) {
	var sdktoken = readCookie('sdktoken'),
		userUID = readCookie('uid'),
		that = this;
	if(!sdktoken){
     	window.location.href = '/webdemo/index.html';
    	return;
	}
	this.person = {};
	this.person[userUID] = true;
	this.controller = ctr;
	this.cache = data;
	this.nim = new NIM({
		debug: true || { api: 'info', style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)' },
        appKey: 'fe416640c8e8a72734219e1847ad2547',//测试
        // appKey: '45c6af3c98409b18a84451215d0bdd6e',
        account: userUID,
        token: sdktoken,
        onconnect: onConnect.bind(this),
        ondisconnect: onDisconnect.bind(this),
        onerror: onError.bind(this),
        onteams: onTeams.bind(this), 
        onroamingmsgs: onRoamingMsgs.bind(this),
        onofflinemsgs: onOfflineMsgs.bind(this),
        onsessions: onSessions.bind(this),
        onofflinesysmsgs: onOfflineSysMsgs.bind(this),
        onteammembers: onTeamMembers.bind(this),
        onsyncteammembersdone: onSyncTeamMembersDone.bind(this),
        onsyncdone: onSyncDone.bind(this),
        onmsg: onMsg.bind(this),
        onsysmsg: onSysMsg.bind(this),
        oncustommsg: onCustomMsg.bind(this),
        oncreateteam: onCreateTeam.bind(this),
        onloginportschange:onLoginPortsChange.bind(this),
        onupdateteammember: onUpdateTeamMember.bind(this),
        onmutelist:onMutelist.bind(this),
        onblacklist: onBlacklist.bind(this),
        onfriends:onFriends.bind(this),
        onsynccreateteam:onSyncCreateteam.bind(this),
        onsyncmarkinblacklist:onSyncMarkinBlacklist.bind(this),
        onsyncmarkinmutelist:onSyncMarkinMutelist.bind(this),
        onsyncfriendaction:onSyncFriendAction.bind(this)

    });
	function onConnect() {
		$('#j-errorNetwork').addClass('hide');
		this.teamMemberDone = false;
		this.sysMsgDone = false;
	    console&&console.log('连接成功');
	};
	function onKicked(obj) {
	    this.iskicked = true;
		
	};
	function onError(error) {
	    console.log('错误信息' + error);
	};
	function onDisconnect(obj) {
		var that = this;
		console.log('连接断开');
		$('#j-errorNetwork').removeClass('hide');
    	if(!!obj.kicked){
			var map={
				PC:"电脑版",
				Web:"网页版",
				Android:"手机版",
				iOS:"手机版",
				WindowsPhone:"手机版"
			}
			var str =obj.kicked.from;
		    alert("你的帐号于"+dateFormat(+new Date(),"HH:mm")+"被"+(map[obj.kicked.from]||"其他端")+"踢出下线，请确定帐号信息安全!");
		    delCookie('uid');
		    delCookie('sdktoken');
		    window.location.href = '/webdemo/index.html'; 		 
	    }else{
       		console.log('重连中');
			setTimeout(function(){
				that.nim.connect();
			},2000)
	    }
	};
	function onLoginPortsChange(loginPorts) {
	    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
     	this.controller.loginPorts(loginPorts);
	};
	function onTeams(teams) {
		this.cache.setTeamList(teams);    
	};
	function onFriends(obj){
		for(var i = 0;i<obj.length;i++){
			this.person[obj[i].account] = true;
			this.cache.addFriend(obj[i].account);
		}		
	};
	function onSessions(sessions){
		this.cache.addSessions(sessions);
	};

	function onRoamingMsgs(msgs) {
	    console.log('漫游消息', msgs);
	    this.cache.addMsgs(msgs);

	    for(var i = 0;i<msgs.length;i++){
	    	if(msgs[i].scene==="p2p"){
	    		this.person[msgs[i].from!==userUID?msgs[i].from:msgs[i].to] = true;
	    	}
	    	//拿到一条数据即可记录帐号
	    	break;
		}
	};
	function onOfflineMsgs(msgs) {
	    console.log('离线消息', msgs);
      	this.cache.addOfflineMsgs(msgs);

  	 	for(var i = 0;i<msgs.length;i++){
	    	if(msgs[i].scene==="p2p"){
	    		this.person[msgs[i].from!==userUID?msgs[i].from:msgs[i].to] = true;
	    	}
		}
	};
	function onOfflineSysMsgs(msgs) {
	    console.log('离线系统通知', msgs);
	};
	function onSyncDone() {
		console.log('消息同步完成');	
 		var ctr = this.controller;
 		this.sysMsgDone = true;
	    //如果用户数据拉取完毕，UI开始呈现
	    if(this.teamMemberDone){
	    	ctr.doPersonInfo(this.person);
	    }
	};
	function onSyncTeamMembersDone() {
		console.log('群成员同步完成');
		var ctr = this.controller;
	    this.teamMemberDone = true;
	    //如果用户消息等拉取完毕，UI开始呈现
	    if(this.sysMsgDone){
	    	ctr.doPersonInfo(this.person);
	    }
	};
	function onTeamMembers(obj) {
		var members = obj.members;
	    for(var i = 0;i<members.length;i++){
    		this.person[members[i].account] = true;	
		}
	};
	function onMsg(msg) {
	    this.controller.doMsg(msg);
	};
	function onSysMsg(msg) {
		var type = msg.type,
			ctr = this.controller,
			cache = this.cache;
		switch (type) {
            case 'deleteFriend':
                cache.removeFriend(msg.from);
                ctr.buildContacts();
                break;
            case 'addFriend':
                cache.addFriend(msg.from);
                if(!this.cache.getUserById(msg.from)){
                    ctr.getUser([{uid:msg.from}],function(data){
                        cache.updatePersonlist(data.list[0]);
                        ctr.buildContacts();
                    })
                }else{
                    ctr.buildContacts();   
                }
                break;
            default:
                console.log(msg);
                break;
        }
	};
	function onCustomSysMsg(msg) {
	    console.log('收到一条自定义系统通知', msg);
	};
	function onCreateTeam(team) {
	    console.log('你在其它端创建了一个群', team);
	};
	function onUpdateTeamMember(teamMember) {
	    console.log('群成员信息更新了', teamMember);
	};

	function onCustomMsg(){

	};
	// 黑名单
	function onBlacklist(data){
		this.cache.setBlacklist(data);
		for(var i = 0;i<data.length;i++){
			this.person[data[i]] = true;
		}
	};
	//静音
	function onMutelist(data){
		this.cache.setMutelist(data);
		for(var i = 0;i<data.length;i++){
			this.person[data[i]] = true;
		}
	};
	function onSyncCreateteam(data){
		this.cache.addTeam(data);
		this.controller.buildGroups();
	};
	// 多端同步好友关系
	function onSyncFriendAction(data){
		ctr.doSyncFriendAction(data);
	};

	function onSyncMarkinBlacklist(param){
		if(param.isAdd){
			this.cache.addToBlacklist(param.account);
		}else {
			this.cache.removeFromBlacklist(param.account);
		}
		this.controller.buildConversations();
        this.controller.buildContacts();     
	};

	function onSyncMarkinMutelist(param){
		if(param.isAdd){
			this.cache.addToMutelist(param.account);
		}else {
			this.cache.removeFromMutelist(param.account);
		}
	};
}

/**
* 发送普通文本消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param text：发送的消息文本
* @param callback：回调
*/
SDKBridge.prototype.sendTextMessage = function (scene, to, text , callback) {
    this.nim.sendText({
        scene: scene || 'p2p',
        to: to,
        text: text,
        done: callback
    });
};

/**
* 发送自定义消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param content：消息内容对象
* @param callback：回调
*/
SDKBridge.prototype.sendCustomMessage = function (scene, to, content , callback) {
  	this.nim.sendCustomMsg({
        scene: scene || 'p2p',
        to: to,
        content: JSON.stringify(content),
        done: callback
    });
};

/**
* 发送文件消息
* @param scene：场景，分为：P2P点对点对话，team群对话,callback回调
* @param to：消息的接收方
* @param text：发送的消息文本
* @param callback：回调
*/
SDKBridge.prototype.sendFileMessage = function (scene, to, fileInput , callback) {
	var that = this,
		value = fileInput.value,
		ext = value.substring(value.lastIndexOf('.') + 1, value.length),
		type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
    this.nim.sendFile({
        scene: scene,
        to: to,
		type: type,
        fileInput: fileInput,
        uploadprogress: function (data) {
           console && console.log(data.percentageText);
        },
        uploaderror: function () {
            console && console.log('上传失败');
        },
        uploaddone: function (file) {
            console && console.log('上传完成，服务器处理中...');
        },
        beforesend: function (msgId) {
            console && console.log('正在发送消息, id=' + msgId);
        },
        done: callback
    });
}
/**
 * 获取云记录消息
 * @param  {Object} param 数据对象
 * @return {void}       
 */
SDKBridge.prototype.getHistoryMsgs = function(param){
	this.nim.getHistoryMsgs (param);
}

/**
 * 踢人
 * @param  {int} type  设备端
 * @return {void}     
 */
SDKBridge.prototype.kick = function(type){
	var deviceIds = (type ===0?this.mobileDeviceId:this.pcDeviceId);
	this.nim.kick({
	    deviceIds: [deviceIds],
	    done: function(error, obj){
	    	alert('踢'+(type===0?'移动':'PC')+'端' + (!error?'成功':'失败'));
		    console.log(error);
		    console.log(obj);
	    }
	});
}
SDKBridge.prototype.createTeam = function(param){
	this.nim.createTeam(param);
}	
SDKBridge.prototype.getTeamMembers = function(param){
	this.nim.getTeamMembers(param);
}
SDKBridge.prototype.updateTeam = function(param){
	this.nim.updateTeam(param);
}
SDKBridge.prototype.leaveTeam = function(param){
	this.nim.leaveTeam(param);
}
SDKBridge.prototype.addTeamMembers= function(param){
	this.nim.addTeamMembers(param);
}
SDKBridge.prototype.removeTeamMembers = function(param){
	this.nim.removeTeamMembers(param);
}

/**
 * 加好友（不需要验证）
 * @param  {String}   uid       
 * @param  {Function} callback 
 * @return             
 */
SDKBridge.prototype.addFriend = function(account,callback){
	this.nim.addFriend({
		account: account,
		done: callback
	});
}
/**
 * 删好友
 * @param  {[type]}   account  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
SDKBridge.prototype.deleteFriend = function(account,callback){
	this.nim.deleteFriend({
		account: account,
		done: callback
	});
}

/**
 * 静音
 */
SDKBridge.prototype.addToMutelist = function(account,callback){
	this.nim.addToMutelist({
	    account: account,
	    done: callback
	});
}

SDKBridge.prototype.removeFromMutelist = function(account,callback){
	this.nim.removeFromMutelist({
	    account: account,
	    done: callback
	});
}

/**
 * 黑名单
 */
SDKBridge.prototype.markInBlacklist = function(account,isAdd,callback){
	this.nim.markInBlacklist({
		account: account,
		// true表示加入黑名单，false表示从黑名单移除
		isAdd: isAdd,
		done: callback
	});
}


/**
 * 获取用户信息（如果用户信息让SDK托管）
 */
SDKBridge.prototype.getUsers = function(accounts,callback){
	this.nim.getUsers({
		accounts: accounts,
		done: callback
	});
};
SDKBridge.prototype.getUser = function(account,callback){
	this.nim.getUser({
		account: account,
		done: callback
	});
};

SDKBridge.prototype.updateMyInfo = function(nick,gender,birth,tel,email,sign,callback){
	this.nim.updateMyInfo({
		nick:nick,
		gender:gender,
		birth:birth,
		tel:tel,
		email:email,
		sign:sign,
		done: callback
	});
}
SDKBridge.prototype.updateMyAvatar = function(avatar,callback){
	this.nim.updateMyInfo({
		avatar:avatar,
		done: callback
	});
}

SDKBridge.prototype.thumbnailImage = function (options) {
	return this.nim.thumbnailImage({
		url:options.url,
		mode:options.mode,
		width:options.width,
		height:options.height
	})
}

SDKBridge.prototype.cropImage = function(option){
	return this.nim.cropImage(option);
}

SDKBridge.prototype.previewImage = function(option){
	this.nim.previewFile({
	    type: 'image',
	    fileInput: option.fileInput,
	    uploadprogress: function(obj) {
	        console.log('文件总大小: ' + obj.total + 'bytes');
	        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
	        console.log('上传进度: ' + obj.percentage);
	        console.log('上传进度文本: ' + obj.percentageText);
	    },
	    done: option.callback
	});
}