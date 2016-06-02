/**
 * 群通知处理
 */

var notification = {
	init:function(cache,sdk){
		this.mysdk = sdk;
		this.cache = cache;
	},
	messageHandler: function(msg,callback) {
		var type = msg.attach.type, team = msg.attach.team;
		switch (type) {
			case 'addTeamMembers':		// 添加成员
				this.addMember(msg,callback);
				break;
			case 'removeTeamMembers':	// 移除成员
				this.removeMember(msg,callback);
				break;
			case 'leaveTeam':		// 离开群
				this.leaveTeam(msg,callback);
				break;
			case 'updateTeam':		// 更新群
				this.updateTeam(msg,callback);
				break;
			case 'acceptTeamInvite':	// 接受入群邀请
				this.acceptTeamInvite(msg,callback);
				break;
			case 'passTeamApply':		// 群主/管理员 通过加群邀请
				this.passTeamApply(msg,callback);
				break;
			case 'dismissTeam':
				this.dismissTeam(msg,callback);
				break;
			case 'updateTeamMute':
				this.updateTeamMute(msg,callback);
				break;
			default:				// 其他
				console.log("type-->" + type);
				this.cache.addMsgs(msg);
        		callback();
				break;
		}
	},

	/**
	* 添加成员
	*/
	addMember: function(msg,callback) {
		var team = msg.attach.team;
		this.cache.addTeam(team);
		this.cache.addTeamMembers(team.teamId, msg.attach.members);
	 	var accounts = msg.attach.accounts,
            array=[],
            that=this;
        for(var i=0;i<accounts.length;i++){
            if(!this.cache.getUserById(accounts[i])){
                array.push(accounts[i])
            }
        }
        if(array.length>0){
            this.mysdk.getUsers(array,function(err,data){
                for (var i = data.length - 1; i >= 0; i--) {
                    that.cache.updatePersonlist(data[i]);
                };
                //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
                that.cache.addMsgs(msg);
                //再次重绘
                yunXin.buildConversations();
                callback(); 
            })
        }else{
            this.cache.addMsgs(msg);
            callback();
        }
		
	},

	/**
	* 群主/管理员 移除成员
	* @param team: 群（普通/高级）对象
	* @param msg: 消息对象
	*/
	removeMember: function(msg,callback) {  
		var accounts = msg.attach.accounts,
            array=[],
            kickme = false,
            that = this;
        for(var i=0;i<accounts.length;i++){
            if(!this.cache.getUserById(accounts[i])){
                array.push(accounts[i])
            }
            if (accounts[i]===userUID) {
            	kickme = true;
            };
        }
        this.cache.removeTeamMembers(msg.attach.team.teamId, accounts);
        if(array.length>0){
            this.mysdk.getUsers(array,function(err,data){
                for (var i = data.length - 1; i >= 0; i--) {
                    that.cache.updatePersonlist(data[i]);
                };
                //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
                that.cache.addMsgs(msg);
                
                if(kickme){
        			that.cache.removeTeamById(msg.to);
        		}
        		//再次重绘
                yunXin.buildConversations();
                callback(); 
            })
        }else{
        	if(kickme){
        		this.cache.removeTeamById(msg.to);
        	}
            this.cache.addMsgs(msg);
            callback();
        }
	},

	/**
	* 退群
	*/
	leaveTeam: function(msg,callback) {
		if(msg.from===userUID){
			// 从漫游消息中删除
			var teamId = msg.to;
			this.cache.removeTeamById(teamId);
			yunXin.buildTeams();
			if($('#j-chatEditor').data('to') === msg.to) { 
				$('#j-chatEditor').data({to:""});
				$('#j-rightPanel').addClass('hide');
			}

		}
		this.cache.addMsgs(msg);
	 	callback();	
	},

	/**
	* 更新群名字
	*/
	updateTeam: function(msg,callback) {
		var team = msg.attach.team;
		var teamName = team.name;
		if(teamName){
			if($('#j-chatEditor').data('to') === msg.to){
				$('#j-nickName').text(teamName);
			}
		}
		this.cache.updateTeam(msg.to,team);
    	yunXin.buildTeams();
		this.cache.addMsgs(msg); 
        callback();
	},

	/**
	* 用户接受入群邀请
	*/
	acceptTeamInvite: function(msg,callback) {
		if(msg.from===userUID){
			this.cache.addTeam(msg.attach.team);
			yunXin.buildTeams();
			yunXin.buildConversations();
		}
        this.cache.addMsgs(msg);
        callback();
	},

	/**
	* 群主/管理员 同意入群邀请
	*/
	passTeamApply: function(msg,callback) {
		if(msg.from===msg.attach.account||msg.attach.account===userUID){
			this.cache.addTeam(msg.attach.team);
			yunXin.buildTeams();
			yunXin.buildConversations();
		}
	 	this.cache.addMsgs(msg);
        callback();
	},

	/**
	 * 解散群
	 */
	dismissTeam:function(msg,callback) {
		this.cache.addMsgs(msg);
		var teamId = msg.target;
		this.cache.removeTeamById(teamId);
		yunXin.buildTeams();
        callback();
	},
	/**
	 * 禁言群成员
	 */
	updateTeamMute:function(msg,callback) {
		this.cache.addMsgs(msg);
		this.cache.updateTeamMemberMute(msg.target,msg.attach.account,msg.attach.mute);
        callback();
	}
};