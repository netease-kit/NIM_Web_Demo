
var Cache = (function(){
	var Cache = function (argument) {
		this.friendsList = [];
		this.personlist = {};
		this.teamList = [];
		this.teamMap = {};
		this.msgs ={};
		this.sessions=[];
		this.unreadMsg = {};
		this.blacklist = [];
		this.mutelist = [];
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
	Cache.prototype.addFriend = function(list){
		if(!this.isFriend(list)){
			this.friendsList.push(list);
		}
	};
	Cache.prototype.removeFriend = function(account){
		for (var i = this.friendsList.length-1; i >= 0; i--) {
			if(this.friendsList[i] == account){
				this.friendsList.splice(i,1);
			}
		};
	};
	Cache.prototype.getFriendslist = function(){
		var array = [];
		for(var i =0;i<this.friendsList.length; i++){
			array.push(this.getUserById(this.friendsList[i]));
		}
		return array;
	};

	Cache.prototype.getFriendslistOnShow = function(){
		var array = [];
		for(var i =0;i<this.friendsList.length; i++){
			if(!this.inBlacklist(this.friendsList[i])){
				array.push(this.getUserById(this.friendsList[i]));
			}
		}
		return array;
	};

	Cache.prototype.isFriend = function(account){
		for (var i = this.friendsList.length-1 ; i >= 0; i--) {
			if(this.friendsList[i] == account){
				return true;
			}
		};
		return false;
	};


	/**
	 * 添加到会话列表
	 * @param {Array|Object} sessions 会话对象
	 */
	Cache.prototype.addSessions = function(sessions){
		if(!$.isArray(sessions)){
			this.sessions.unshift(sessions);
			return;
		}
		for (var i = 0; i <sessions.length; i++) {
			this.sessions.push(sessions[i].scene +"-"+sessions[i].to);
		};
	};

	/**
	 * 获取当前会话的消息
	 * @return {Array} 消息集合
	 */
	Cache.prototype.getSessionsMsg = function () {
		var arr = [],
			item,
			msgs;
		for(var i = 0 ;i <this.sessions.length;i++){
			item = this.sessions[i];
			msgs = this.getMsgsByUser(item);
			for (var j = msgs.length - 1; j >= 0; j--) {
				if(msgs[j].status!==-1){
					arr.push(msgs[j]);
					break;
				}
			};
		}
		return arr;
	};
	
	Cache.prototype.addMsgs = function(msgs) {
		var item,
			user;
		if(!$.isArray(msgs)){
			this.addMsg(msgs);
			return;
		}
		// 去重消息，防止断线重连后推送的消息跟本地存的重复
		for (var i = msgs.length - 1; i >= 0; i--) {
			if(msgs[i].scene==="team"){
				user = msgs[i].to;
				if(this.msgs["team-"+user]){
					item = this.msgs["team-"+user];
					for (var j = item.length - 1; j >= 0; j--) {
						if(item[j].idClient === msgs[i].idClient){
							msgs.splice(i,1);
							break;
						}
					};	
				}
			}else{
				user = (msgs[i].from === userUID?msgs[i].to:msgs[i].from);
				if(this.msgs["p2p-"+user]){
					item = this.msgs["p2p-"+user];
					for (var j = item.length - 1; j >= 0; j--) {
						if(item[j].idClient === msgs[i].idClient){
							msgs.splice(i,1);
							break;
						}
					};	
				}
			}	
		};
		for (var i = msgs.length - 1; i >= 0; i--) {
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
		this.addSessions(user);
	};

	/**
	 * 删除漫游消息/历史消息
	 * @param {String} to 需移除的消息对象标识
	 */
	Cache.prototype.rmMsgs = function(to) {
		if($.type(to) === "string"){
			if(!!this.msgs["p2p-"+to]){
				delete this.msgs["p2p-"+to];
			}
		}else{
			if(!!this.msgs["team-"+to]){
				delete this.msgs["team-"+to];
			}
		}
	};

	/**
	 * 获取漫游/历史消息
	 * @param  {String} to 消息的对象
	 * @return {Array}    
	 */

	Cache.prototype.getMsgs = function(to) {
		if($.type(to) === "string"){
			if(!!this.msgs["p2p-"+to]){
				return this.msgs["p2p-"+to];
			}else{
				return [];
			}
		}else{
			if(!!this.msgs["team-"+to]){
				return this.msgs["team-"+to];
			}else{
				return [];
			}
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
			//群通知消息不计数
			if(/text|image|file|audio|video|geo|custom/i.test(msgs[i].type)){
			 	this.addUnreadMsg(msgs[i]);
			}
		};
	};

	/**
	 * 未读消息计数相关
	 */
	Cache.prototype.getUnreadMsg = function(){
		return this.unreadMsg;
	};

	Cache.prototype.addUnreadMsg = function(msg) {
		var who = (msg.scene==="team")?msg.to:msg.from;
		// if(this.inMutelist(who)){
		// 	return;
		// }else{
		if (this.unreadMsg.hasOwnProperty(who)) {
			this.unreadMsg[who] = {count: ++this.unreadMsg[who].count};		
		} else {
			this.unreadMsg[who] = {count: 1};
		}		
		// }
	};

	Cache.prototype.setUnreadMsg = function(uid,count) {
		if (this.unreadMsg[uid] && this.unreadMsg[uid].hasOwnProperty('count')) {
			this.unreadMsg[uid].count = count;
		}
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
		this.teamList = list;
	};

	Cache.prototype.addTeam = function(team) {
		this.teamMap[team.teamId] = team;
		this.teamList.push(team);
	};
	Cache.prototype.hasTeam = function(id) {
		if(!!this.teamMap[id]){
			return true;
		}
		return false;
	};

	/**
	* 获取群列表
	*/
	Cache.prototype.getTeamList = function() {
	    return this.teamList;
	};

	/**
	* 获取群对象
	*/
	Cache.prototype.getTeamMap = function() {
	    return this.teamMap;
	};
	/**
	* 根据群id获取群对象
	* @param id: 群（普通/高级）id
	*/
	Cache.prototype.getTeamById = function(teamId) {
		var teamId = parseInt(teamId);
	   	if(this.hasTeam(teamId)){
			return this.teamMap[teamId];
		}
	    return null;
	};

	/**
	* 根据群id删除群
	* @param id: 群（普通/高级）id
	*/
	Cache.prototype.removeTeamById = function (id) {
		var id = parseInt(id);
		delete this.teamMap[id];
	    for (var i in this.teamList) {
	        if (this.teamList[i].teamId === id) {
	            this.teamList.splice(i, 1);
	            break;
	        }
	    }
	};

	/**
	 * 更变群名
	 */
	Cache.prototype.setTeamName= function (teamId,name) {
	   this.getTeamById(teamId).name = name;
	   for (var i in this.teamList) {
	        if (this.teamList[i].teamId === teamId) {
	            this.teamList[i].name = name;
	            break;
	        }
	    }
	};

	Cache.prototype.setMutelist= function (data) {
	   this.mutelist = data;
	}
	Cache.prototype.inMutelist = function(account){
		for (var i = this.mutelist.length - 1; i >= 0; i--) {
			if(this.mutelist[i] == account){
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
			if(this.mutelist[i] == account){
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
			if(this.blacklist[i] == account){
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
			if(this.blacklist[i] == account){
				this.blacklist.splice(i,1);
				return true;
			}
		};
		return false;
	};
	return Cache;
})();

