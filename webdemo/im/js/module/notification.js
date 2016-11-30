/**
 * 群通知处理
 */

YX.fn.notification =  function() {
	
}
YX.fn.messageHandler = function(msg,callback) {
	var type = msg.attach.type,
		team = msg.attach.team
	switch (type) {
		case 'addTeamMembers':		// 添加成员
			this.addTeamMembersNotification(msg,callback)
			break
		case 'removeTeamMembers':	// 移除成员
			this.removeMembersNotification(msg,callback)
			break
		case 'leaveTeam':		// 离开群
			this.leaveTeamNotification(msg,callback)
			break
		case 'updateTeam':		// 更新群
			this.updateTeamNotification(msg,callback)
			break
		case 'acceptTeamInvite':	// 接受入群邀请
			this.acceptTeamInviteNotification(msg,callback)
			break
		case 'passTeamApply':		// 群主/管理员 通过加群邀请
			this.passTeamApplyNotification(msg,callback)
			break
		case 'dismissTeam':
			this.dismissTeamNotification(msg,callback)
			break
		case 'updateTeamMute':
			this.updateTeamMuteNotification(msg,callback)
			break
		default:				// 其他
			console.log("type-->" + type)
			this.cache.addMsgs(msg)
    		callback()
			break
	}
}

/**
 * 添加成员
 */
YX.fn.addTeamMembersNotification = function(msg,callback) {
	var team = msg.attach.team
	this.cache.addTeam(team)
	this.cache.addTeamMembers(team.teamId, msg.attach.members)
 	var accounts = msg.attach.accounts,
        array=[],
        that=this
    for(var i=0; i<accounts.length; i++){
        if(!this.cache.getUserById(accounts[i])){
            array.push(accounts[i])
        }
    }
    if(array.length>0){
        this.mysdk.getUsers(array,function(err,data){
            for (var i = data.length - 1; i >= 0; i--) {
                that.cache.updatePersonlist(data[i])
            }
            //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
            that.cache.addMsgs(msg)
            //再次重绘
           	that.buildSessions()
            callback() 
        })
    }else{
        this.cache.addMsgs(msg)
        callback()
    }
	
}

/**
* 群主/管理员 移除成员
* @param team: 群（普通/高级）对象
* @param msg: 消息对象
*/
YX.fn.removeMembersNotification = function(msg,callback) {  
	var accounts = msg.attach.accounts,
        array=[],
        kickme = false,
        that = this
    for(var i=0; i<accounts.length; i++){
        if(!this.cache.getUserById(accounts[i])){
            array.push(accounts[i])
        }
        if (accounts[i]===userUID) {
        	kickme = true
        }
    }
    this.cache.removeTeamMembers(msg.attach.team.teamId, accounts)
    if(array.length>0){
        this.mysdk.getUsers(array,function(err,data){
            for (var i = data.length - 1; i >= 0; i--) {
                that.cache.updatePersonlist(data[i])
            }
            //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
            that.cache.addMsgs(msg)
            
            if(kickme){
    			that.cache.removeTeamById(msg.to)
    		}
    		//再次重绘
           	that.buildSessions()
        	callback() 
        })
    }else{
    	if(kickme){
    		this.cache.removeTeamById(msg.to)
    	}
        this.cache.addMsgs(msg)
        callback()
    }
},

/**
* 退群
*/
YX.fn.leaveTeamNotification = function(msg,callback) {
	if(msg.from===userUID){
		// 从漫游消息中删除
		var teamId = msg.to
		this.cache.removeTeamById(teamId)
		this.buildTeams()
		if($('#j-chatEditor').data('to') === msg.to) { 
			$('#j-chatEditor').data({to:""})
			$('#j-rightPanel').addClass('hide')
		}

	}
	this.cache.addMsgs(msg)
 	callback()	
}

/**
* 更新群名字
*/
YX.fn.updateTeamNotification = function(msg,callback) {
	var team = msg.attach.team
	var teamName = team.name
	if(teamName){
		if($('#j-chatEditor').data('to') === msg.to){
			$('#j-nickName').text(teamName)
		}
	}
	this.cache.updateTeam(msg.to,team)
	this.buildTeams()
	this.cache.addMsgs(msg) 
    callback()
}

/**
* 用户接受入群邀请
*/
YX.fn.acceptTeamInviteNotification = function(msg,callback) {
	if(msg.from===userUID){
		this.cache.addTeam(msg.attach.team)
		this.buildTeams()
		this.buildSessions()
	}
    this.cache.addMsgs(msg)
    callback()
}

/**
* 群主/管理员 同意入群邀请
*/
YX.fn.passTeamApplyNotification = function(msg,callback) {
	if(msg.from===msg.attach.account||msg.attach.account===userUID){
		this.cache.addTeam(msg.attach.team)
		this.buildTeams()
		this.buildSessions()
	}
 	this.cache.addMsgs(msg)
    callback()
}

/**
 * 解散群
 */
YX.fn.dismissTeamNotification = function(msg,callback) {
	this.cache.addMsgs(msg)
	var teamId = msg.target
	this.cache.removeTeamById(teamId)
	this.buildTeams()
    callback()
}
/**
 * 禁言群成员
 */
YX.fn.updateTeamMuteNotification = function(msg,callback) {
	this.cache.addMsgs(msg)
	this.cache.updateTeamMemberMute(msg.target,msg.attach.account,msg.attach.mute)
    callback()
}
