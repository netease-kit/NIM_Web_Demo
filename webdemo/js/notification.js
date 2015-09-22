var notification = {
	init:function(cache,sdk){
		this.sdk = sdk;
		this.cache = cache;
	},
	messageHandler: function(msg) {
		var type = msg.attach.type, team = msg.attach.team;
		switch (type) {
			case 'addTeamMembers':		// 添加成员
				this.addMember(team);
				break;
			case 'removeTeamMembers':	// 移除成员
				this.removeMember(team, msg);
				break;
			case 'leaveTeam':		// 离开群
				this.leaveTeam(team, msg);
				break;
			case 'updateTeam':		// 更新群
				this.updateTeam(team, msg);
				break;
			case 'acceptInvite':	// 接受入群邀请
				this.acceptInvite(team,msg);
				break;
			case 'passApply':		// 群主/管理员 通过加群邀请
				this.passApply(team);
				break;
			default:				// 其他
				console.log("type-->" + type);
				break;
		}
	},

	/**
	* 添加成员
	* @param team: 群（普通/高级）对象
	*/
	addMember: function(team) {
		if(!this.cache.hasTeam(team)){
			this.cache.addTeam(team);
		}
	},

	/**
	* 群主/管理员 移除成员
	* @param team: 群（普通/高级）对象
	* @param msg: 消息对象
	*/
	removeMember: function(team, msg) {  
		var teamId = team.teamId,
			removeAccounts = msg.attach.accounts;
		if (removeAccounts.indexOf(userUID) != -1) { 
			this.cache.rmMsgs(teamId);
		}
	},

	/**
	* 主动退群
	* @param team: 群（普通/高级）对象
	* @param msg: 消息对象
	*/
	leaveTeam: function(team, msg) {   
		this.leave(team, msg);

	},

	/**
	* @param team: 群（普通/高级）对象
	* @param msg: 消息对象
	* 在被移除或主动退群，要做：
	* 1. 如果存在最近会话，移除会话；
	* 2. 如果正在对话时，关闭聊天窗口；
	* 3. 移除群列表里面的对应群；
	*/
	leave: function(team, msg) {
		if(msg.from===userUID){
			// 从漫游消息中删除
			var teamId = team.teamId,
				teamType = this.cache.getTeamById(teamId).type,
				$conversations = $('#j-loadConversations ul'),
				$teams = $('#j-teams .teams');
			this.cache.rmMsgs(teamId);
			this.cache.removeTeamById(teamId);
			yunXin.buildConversations();
			yunXin.buildTeams();
			if($('#j-chatEditor').data('to') === msg.to) { 
				$('#j-chatEditor').data({to:""});
				$('#j-rightPanel').addClass('hide');
			}
		}		
	},

	/**
	* 更新群名字
	* @param team: 群（普通/高级）对象
	* @param msg: 消息对象
	*/
	updateTeam: function(team, msg) {  // 更新群名字
		var teamName = team.name;
		$('#j-teams [data-uid="' + msg.to + '"] .nick span').text(teamName);
		if($('#j-chatEditor').data('to') === msg.to){
			$('#j-nickName').text(teamName);
		}
		this.cache.setTeamName(msg.to,teamName);
	},

	/**
	* 用户接受入群邀请
	* @param team: 群（普通/高级）对象
	*/
	acceptInvite: function(team, msg) {
		var members = getMembersById(team.teamId);
		if (msg.from === userUID) {
			teamList.push(team);
		}
		mysdk.nim.getTeamMembers({
			teamId: team.teamId,
			done: function(error, obj) {
				if (!error) {  
				}
			}
		});
	},

	/**
	* 群主/管理员 同意入群邀请
	*/
	passApply: function(team) {
		
	}
};