// 数据缓存
// 建议开发者选择mvvm框架来通过数据来驱动UI变化
var Cache = (function(){
	var Cache = function (argument) {
		this.friendslist = [];
		this.personlist = {};
		this.teamlist = [];
		this.teamMembers = {};
		this.teamMap = {};
		this.msgs ={};
		this.sessions=[];
		this.blacklist = [];
		this.mutelist = [];
		this.sysMsgs = [];
		this.customSysMsgs = [];
		this.sysMsgCount = 0;
	};
	
	/**
	* 根据account获取用户对象
	* @param account: 用户account
	*/
	Cache.prototype.getUserById = function (account) {
		if(this.personlist[account]){
	   		return this.personlist[account];
	   	}
    	return false;
	};
	// 用户对象相关
	Cache.prototype.setPersonlist = function(list){
		var item;
		for (var i = list.length - 1; i >= 0; i--) {
		 	item = list[i];
		 	this.personlist[item.account] = item;
		};
	};

	Cache.prototype.updateAvatar = function(url){
		this.personlist[userUID].avatar = url;
	};
	Cache.prototype.updatePersonlist = function(list){
		if(!this.personlist[list.account]){
			this.personlist[list.account] = list;
		}else{
			for(var p in list){
				this.personlist[list.account][p] = list[p];
			}			
		}
		
	};

	Cache.prototype.getPersonlist = function(){
		return this.personlist;
	};
	
	/**
	 * 好友相关
	 */
	Cache.prototype.setFriends = function(list){
		this.friendslist = list;
	};
	Cache.prototype.getFriends = function(list){
		return this.friendslist;
	};
	// 获取好友备注名
	Cache.prototype.getFriendAlias = function(account){
		for (var i = this.friendslist.length-1; i >= 0; i--) {
			if(this.friendslist[i].account == account){
				return this.friendslist[i].alias||"";
			}
		};
	}
	Cache.prototype.updateFriendAlias = function(account,alias){
		for (var i = this.friendslist.length-1; i >= 0; i--) {
			if(this.friendslist[i].account == account){
				this.friendslist[i].alias = alias;
				return;
			}
		};
	}
	Cache.prototype.addFriend = function(list){
		if(!this.isFriend(list.account)){
			this.friendslist.push(list);
		}
	};
	Cache.prototype.removeFriend = function(account){
		for (var i = this.friendslist.length-1; i >= 0; i--) {
			if(this.friendslist[i].account == account){
				this.friendslist.splice(i,1);
			}
		};
	};
	Cache.prototype.getFriendslist = function(){
		var array = [];
		for(var i =0;i<this.friendslist.length; i++){
			array.push(this.getUserById(this.friendslist[i].account));
		}
		return array;
	};

	Cache.prototype.getFriendslistOnShow = function(){
		var array = [];
		for(var i =0;i<this.friendslist.length; i++){
			if(!this.inBlacklist(this.friendslist[i].account)){
				array.push(this.getUserById(this.friendslist[i].account));
			}
		}
		return array;
	};

	Cache.prototype.isFriend = function(account){
		for (var i = this.friendslist.length-1 ; i >= 0; i--) {
			if(this.friendslist[i].account == account){
				return true;
			}
		};
		return false;
	};


	/**
	 * 设置会话列表
	 * @param {Array} sessions 会话对象
	 */
	Cache.prototype.setSessions = function(sessions){
		this.sessions = sessions;
	};

	/**
	 * 获取当前会话
	 * @return {Array} 会话集合
	 */
	Cache.prototype.getSessions = function () {
		return this.sessions;
	};

	/**
	 * 获取指定会话
	 * @return {Array} 会话集合
	 */
	Cache.prototype.findSession = function (id) {
		for (var i = this.sessions.length - 1; i >= 0; i--) {
			if(this.sessions[i].id ===id){
				return this.sessions[i];
			}
		};
		return false;
	}

	Cache.prototype.addMsgs = function(msgs) {
		var item,
			user;
		if(!$.isArray(msgs)){
			this.addMsg(msgs);
			return;
		}
		for (var i = 0; i <msgs.length; i++) {
			if(msgs[i].scene==="team"){
				user = msgs[i].to;
				if(!this.msgs["team-"+user]){
					this.msgs["team-"+user] = [];
				}
				this.msgs["team-"+user].push(msgs[i]);
			}else{
				user = (msgs[i].from === userUID?msgs[i].to:msgs[i].from);
				if(!this.msgs["p2p-"+user]){
					this.msgs["p2p-"+user] = [];
				}
				this.msgs["p2p-"+user].push(msgs[i]);
			}
		};
	};
	Cache.prototype.addMsg = function(msg){
		var user;
		if(msg.scene==="team"){
			user = "team-"+msg.to;
			if(!this.msgs[user]){
				this.msgs[user] = [];
			}
			this.msgs[user].push(msg);
		}else{
			user = "p2p-"+(msg.from === userUID?msg.to:msg.from);
			if(!this.msgs[user]){
				this.msgs[user] = [];
			}
			this.msgs[user].push(msg);
		}
		for(var i = 0;i<this.sessions.length;i++){
			if(user===this.sessions[i]){
				this.sessions.splice(i,1);
				break;
			}
		}
	};
	Cache.prototype.addMsgsByReverse = function(msgs) {
		var item,
			user;
		for (var i = 0; i <msgs.length; i++) {
			if(msgs[i].scene==="team"){
				user = msgs[i].to;
				if(!this.msgs["team-"+user]){
					this.msgs["team-"+user] = [];
				}
				this.msgs["team-"+user].unshift(msgs[i]);
			}else{
				user = (msgs[i].from === userUID?msgs[i].to:msgs[i].from);
				if(!this.msgs["p2p-"+user]){
					this.msgs["p2p-"+user] = [];
				}
				this.msgs["p2p-"+user].unshift(msgs[i]);
			}
		};
	};
	//查消息 session-id idClient
	Cache.prototype.findMsg = function(sid, cid) {
		var list = this.msgs[sid];
		for (var i = list.length - 1; i >= 0; i--) {
			if(list[i].idClient === cid){
				return list[i];
			}
		};
		return false
	}
	//设置消息用于重发状态变化 session-id idClient 消息
	Cache.prototype.setMsg = function(sid, cid, msg) {
		var list = this.msgs[sid];
		for (var i = list.length - 1; i >= 0; i--) {
			if(list[i].idClient === cid){
				list.splice(i,1);
				list.push(msg);
				return;
			}
		};
	}
	//回撤消息,回撤的消息用tip替换
	Cache.prototype.backoutMsg = function (sid, cid, msg) {
		var list = this.msgs[sid];
		if(!list){
			this.msgs[sid] = [msg]
			return;
		}
		for (var i = list.length - 1; i >= 0; i--) {
			if(list[i].idClient === cid){
				list[i] = msg;
				return;
			}
		}
		this.msgs[sid].push(msg)
	}
	//系统消息
	Cache.prototype.setSysMsgs = function(data){
		this.sysMsgs= data;
	}
	Cache.prototype.getSysMsgs = function(data){
		return this.sysMsgs;
	}
	//自定义系统消息
	Cache.prototype.addCustomSysMsgs = function(data){
		for (var i = 0; i <data.length; i++) {
			this.customSysMsgs.push(data[i]);
		};
	}
	Cache.prototype.deleteCustomSysMsgs = function(){
		this.customSysMsgs= [];
	}
	Cache.prototype.getCustomSysMsgs = function(data){
		return this.customSysMsgs;
	}
	// 系统消息计数
	Cache.prototype.getSysMsgCount = function(value){
		return this.sysMsgCount;
	}
	Cache.prototype.setSysMsgCount = function(value){
		this.sysMsgCount = value;
	}
	Cache.prototype.addSysMsgCount = function(value){
		this.sysMsgCount= this.sysMsgCount + value;
	}
	// /**
	//  * 删除漫游消息/历史消息
	//  * @param {String} to 需移除的消息对象标识
	//  */
	// Cache.prototype.rmMsgs = function(to) {
	// 	if($.type(to) === "string"){
	// 		if(!!this.msgs["p2p-"+to]){
	// 			delete this.msgs["p2p-"+to];
	// 		}
	// 	}else{
	// 		if(!!this.msgs["team-"+to]){
	// 			delete this.msgs["team-"+to];
	// 		}
	// 	}
	// };

	/**
	 * 获取漫游/历史消息
	 * @return {Array}    
	 */

	Cache.prototype.getMsgs = function(id) {
		if(!!this.msgs[id]){
			return this.msgs[id];
		}else{
			return [];
		}
	};

	/**
	 * 根据映射名来获取消息对象集合 如"p2p-iostest"
	 * @param  {String} name 名字
	 * @return {Array}     
	 */
	Cache.prototype.getMsgsByUser = function (name) {
		return this.msgs[name]||[];
	}
	/**
	 * 离线消息处理
	 * @param {Array} msgs 
	 */
	Cache.prototype.addOfflineMsgs= function(msgs) {
		for (var i = msgs.length - 1; i >= 0; i--) {
			if (/text|image|file|audio|video|geo|custom|notification/i.test(msgs[i].type)) {
				this.addMsgs(msgs[i]);
			}else{
				continue;
			}
		};
	};

	/**
	 * 初始化群列表
	 * @param {array} list 
	 */
	Cache.prototype.setTeamList = function(list) {
		var item;
		for (var i = list.length - 1; i >= 0; i--) {
			item = list[i];
			this.teamMap[item.teamId] = item;
		};
		this.teamlist = list;
	};

	Cache.prototype.addTeam = function(team) {
		if(!this.hasTeam(team.teamId)){
			this.teamMap[team.teamId] = team;
			this.teamlist.push(team);
		}
	};
	Cache.prototype.hasTeam = function(id) {
		var item;
		for (var i = this.teamlist.length - 1; i >= 0; i--) {
			item = this.teamlist[i];
			if(item.teamId===id){
				return true;
			}
		};
		return false;
	};

	/**
	* 获取群列表
	*/
	Cache.prototype.getTeamlist = function() {
	    return this.teamlist;
	};

	/**
	* 获取群对象
	*/
	Cache.prototype.getTeamMap = function() {
	    return this.teamMap;
	};
	Cache.prototype.addTeamMap = function(data) {
	    for (var i = data.length - 1; i >= 0; i--) {
			item = data[i];
			this.teamMap[item.teamId] = item;
		};
	};
	/**
	* 根据群id获取群对象
	*/
	Cache.prototype.getTeamById = function(teamId) {
	   	if(this.hasTeam(teamId)){
			return this.teamMap[teamId];
		}
	    return null;
	};
	Cache.prototype.getTeamMapById = function(teamId) {
		return this.teamMap[teamId]||null;
	};

	/**
	* 根据群id删除群
	*/
	Cache.prototype.removeTeamById = function (id) {
	    for (var i in this.teamlist) {
	        if (this.teamlist[i].teamId === id) {
	            this.teamlist.splice(i, 1);
	            break;
	        }
	    }
	};

	/**
	 * 更变群名
	 */
	Cache.prototype.updateTeam= function (teamId,obj) {
		for(var p in obj){
			this.teamMap[teamId][p] = obj[p];
		}
		for (var i in this.teamlist) {
		    if (this.teamlist[i].teamId === teamId) {
		        for(var p in obj){
					this.teamlist[i][p] = obj[p];
				}
		        break;
		    }
		}
	};
	Cache.prototype.setTeamMembers = function(id, list){
		this.teamMembers[id] = list;
	}
	Cache.prototype.addTeamMembers = function(id, array){
		if(!this.teamMembers[id]){
			return;
		}
		for (var i = array.length - 1; i >= 0; i--) {
			this.teamMembers[id].members.push(array[i])
		};
	}
	Cache.prototype.removeTeamMembers = function(id, array){
		var obj = this.teamMembers[id],
			account;
		if(obj){
			for (var j = array.length - 1; j >= 0; j--) {
				account = array[j];
				for (var i = obj.members.length - 1; i >= 0; i--) {
					if (obj.members[i].account === account) {
						obj.members.splice(i,1);
						break;
					} 
				};
			};
		}
	}
	Cache.prototype.getTeamMembers = function(id){
		return this.teamMembers[id];
	}
	Cache.prototype.getTeamMemberInfo = function(account,id){
		var obj = this.teamMembers[id];
		if(obj&&obj.members){
			for (var i = obj.members.length - 1; i >= 0; i--) {
				if (obj.members[i].account === account) {
					return obj.members[i]
				} 
			};
		}
		return false
	}
	Cache.prototype.isTeamManager = function (account,id) {
		var obj = this.teamMembers[id];
		if(obj){
			for (var i = obj.members.length - 1; i >= 0; i--) {
				if (obj.members[i].account === account&&(obj.members[i].type==='owner'||obj.members[i].type==='manager')) {
					return true
				} 
			};
		}
		return false
	}
	Cache.prototype.updateTeamMemberMute = function (id,account,mute) {
		var obj = this.teamMembers[id];
		if(obj){
			for (var i = obj.members.length - 1; i >= 0; i--) {
				if (obj.members[i].account === account) {
					obj.members[i].mute =mute;
					return;
				} 
			};
		}
	}
	Cache.prototype.setMutelist= function (data) {
	   this.mutelist = data;
	};

	Cache.prototype.getMutelist= function (data) {
		return this.mutelist;
	};

	Cache.prototype.inMutelist = function(account){
		for (var i = this.mutelist.length - 1; i >= 0; i--) {
			if(this.mutelist[i].account == account){
				return true;
			}
		};
		return false;
	};

	Cache.prototype.addToMutelist= function (data) {
	   this.mutelist.push(data);
	}
	Cache.prototype.removeFromMutelist = function(account){
		for (var i = this.mutelist.length - 1; i >= 0; i--) {
			if(this.mutelist[i].account == account){
				this.mutelist.splice(i,1);
				return true;
			}
		};
		return false;
	}
	Cache.prototype.setBlacklist= function (data) {
	   this.blacklist = data;
	};
	Cache.prototype.getBlacklist= function () {
	   return this.blacklist;
	}
	Cache.prototype.inBlacklist = function(account){
		for (var i = this.blacklist.length - 1; i >= 0; i--) {
			if(this.blacklist[i].account == account){
				return true;
			}
		};
		return false;
	};
	Cache.prototype.addToBlacklist= function (data) {
	   this.blacklist.push(data);
	};
	Cache.prototype.removeFromBlacklist = function(account){
		for (var i = this.blacklist.length - 1; i >= 0; i--) {
			if(this.blacklist[i].account == account){
				this.blacklist.splice(i,1);
				return true;
			}
		};
		return false;
	};
	return Cache;
})();

