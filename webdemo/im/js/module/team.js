/**
 * 群组相关
 */
'use strict'

YX.fn.team = function () {
	this.$teamInfo = $('#teamInfo')
	this.$teamInfoContainer = $('#teamInfoContainer')
	this.$createTeamContainer = $('#createTeamContainer')
	this.$createTeamContainer.delegate('.user-list li', 'click', this.checkedUser)
	this.$createTeamContainer.delegate('.j-close', 'click', this.closeCreateTeamView.bind(this))
	this.$createTeamContainer.on('click', '.j-add', this.createTeam.bind(this))
	//搜索群面板
	this.$searchBox = $('#searchTeamBox')
	this.$searchBox.delegate('.j-close', 'click', this.hideTeamSearch.bind(this))
	this.$searchBox.delegate('.j-search', 'click', this.doTeamSearch.bind(this))
	this.$searchBox.delegate('.j-back', 'click', this.resetTeamSearch.bind(this))
	this.$searchBox.delegate('.j-chat', 'click', this.doTeamChat.bind(this))
	this.$searchBox.delegate('.j-add', 'click', this.doTeamAdd.bind(this))
	// 左侧面板群组中的三个按钮
	$('#createTeam').on('click',this.showTeamView.bind(this,0,0))
	$('#createAdvanceTeam').on('click',this.showTeamView.bind(this,0,1))
	$('#searchAdvanceTeam').on('click',this.showTeamSearch.bind(this,0,1))
	//群资料
	this.$teamInfo.on('click', this.showTeamInfo.bind(this))
	this.$teamInfoContainer.delegate('.j-backBtn', 'click', this.hideTeamInfo.bind(this))
	this.$teamInfoContainer.delegate('#teamMemberList .first', 'click', this.showTeamView.bind(this,1))
	this.$teamInfoContainer.delegate('#teamMemberList .hover', 'click', this.removeTeamMember.bind(this))
	this.$teamInfoContainer.delegate('#teamName', 'click', this.editTeamInfo)
	this.$teamInfoContainer.delegate('#teamDesc', 'click', this.editTeamInfo)
	this.$teamInfoContainer.delegate('.j-exitTeam', 'click', this.exitTeam.bind(this))
	this.$teamInfoContainer.delegate('.j-dismissTeam', 'click', this.doDismissTeam.bind(this))
	this.$teamInfoContainer.delegate('#teamNameInput', 'blur', this.saveTeamName.bind(this))
	this.$teamInfoContainer.delegate('#teamDescInput', 'blur', this.saveTeamDesc.bind(this))
	this.$teamInfoContainer.delegate('.j-teamAvatar', 'click', this.showModifyAvatar.bind(this,"team"))
	this.$teamInfoContainer.delegate('.j-joinMode', 'change', this.setJoinMode.bind(this))
	this.$teamInfoContainer.delegate('.j-inviteMode', 'change', this.setInviteMode.bind(this))
	this.$teamInfoContainer.delegate('.j-beInviteMode', 'change', this.setBeInviteMode.bind(this))
	this.$teamInfoContainer.delegate('.j-updateTeamMode', 'change', this.setUpdateTeamMode.bind(this))
}
/**
 * 最近联系人显示
 * @return {void}
 */
YX.fn.buildTeams = function(id) {
    var data = {
        teams:this.cache.getTeamlist()
    }
    if(!this.teams){
        var options = {
            data:data,
            infoprovider:this.infoProvider.bind(this),
            onclickavatar:this.clickTeamAvatar.bind(this),
            onclickitem:this.openChatBox.bind(this)

        } 
        this.teams = new NIMUIKit.TeamList(options)
        this.teams.inject($('#teams').get(0))
    }else{
        this.teams.update(data)
    }                  
    this.doPoint()
}

/**
 * 主动去拿群列表
 */
YX.fn.getTeamMembers = function (id,callback) {
    var that = this
    this.mysdk.getTeamMembers(id, function (err,obj) {
    	if(!err){
        	that.cache.setTeamMembers(id,obj)
        	callback()
    	}else{
    		alert(err.message)
    	}
    })
}
/**
 * 点击群组列表头像
 * demo里跟点击列表处理一致了
 */
YX.fn.clickTeamAvatar = function (account,type) {
    $("#teams").find("li.active").removeClass("active")
    this.openChatBox(account, type)
}
/**
 * 联系人选择界面展示
 * @param  {int} type 0为新建群添加成员，1为在已有群的情况下添加成员
 * @param  {int} teamType 高级群1 普通群 0
 * @return {void}      
 */
YX.fn.showTeamView = function(type,teamType) {
	var that = this
	this.teamType = teamType
	this.$createTeamContainer.load('./createTeam.html', function() {
		if($("#devices")){
			$("#devices").addClass('hide')	
		}
		that.$createTeamContainer.removeClass('hide')
		that.$mask.removeClass('hide')
		var $addIcon = $('#userList .first'),
			$addUserUl = $('#addUserList ul'),
			list = that.cache.getFriendslistOnShow(),
			tmp = '',
		 	teamId = '', 
		 	members = []
			// 好友列表
		for (var i = 0,l = list.length; i < l; ++i) {
			tmp += appUI.buildTeamMemberList(list[i])
		}
		$addUserUl.html(tmp)
		if (type !== 0) {
			var teamId = that.crtSessionAccount
			that.mysdk.getTeamMembers(
				teamId,
				function(error, obj) {
					if(error){
						return
					}
					//给已经在群的好友标记
					members = obj.members
					for (var i = 0, l = members.length; i < l; ++i) {
						var account = members[i].account
						$addUserUl.find('[data-account="' + account + '"] i').addClass('cur2')
					}
				}
			)
			//用来区分是否创群
			that.addTeamMemberTag = true
		} else {
			that.addTeamMemberTag = false
		}
		
	})
}
YX.fn.closeCreateTeamView = function() {
	this.$createTeamContainer.addClass('hide')
	this.$mask.addClass('hide')
}
/**
 * 创建群
 */
YX.fn.createTeam = function() {
	var accounts = [], 
		names = [], 
		$items = $('#addedUserList ul li'),
		teamId = this.addTeamMemberTag&&this.crtSessionAccount, 
		that = this
	if($items.length===0){
		this.$createTeamContainer.addClass('hide')
		this.$teamInfoContainer.addClass('hide')
		this.$mask.addClass('hide')
		return
	}
	$items.map(function(){
		accounts.push($(this).attr("data-account"))
		names.push($(this).attr("data-account"))
	})

	if (!!teamId) {	// 如果存在群id，则为新添加成员
		this.mysdk.addTeamMembers({
			teamId: teamId,
			accounts: accounts,
			ps: '',
			done: function(error, params) {
				if (error) {alert('添加成员失败')}
			}
		})
	} else { // 创建普通群
		var owner = this.cache.getUserById(userUID).nick
		names = [owner].concat(names).join('、').slice(0,20)
		if(that.teamType === 0){
			this.mysdk.createTeam({
				type: 'normal',
				name: names + '等人',
				accounts: accounts,
				done: function(error, t) {
					if (!error) {
						that.cache.addTeam(t.team)
						that.buildTeams()
						$('#teamsWrap .j-normalTeam li[data-account="'+t.team.teamId+'"]').click()
						
					}else{
						alert("创建失败")
					}
				}
			})			
		}else{
			this.mysdk.createTeam({
				type: 'advanced',
				name: names + '等人',
				accounts: accounts,
				joinMode: 'needVerify',
				done: function(error, t) {
					if (!error) {
						that.cache.addTeam(t.team)
						that.buildTeams()
						$('#teamsWrap .j-advanceTeam li[data-account="'+t.team.teamId+'"]').click()
						
					}else{
						alert(error.message)
					}
				}
			})			
		}
	}
	this.$createTeamContainer.addClass('hide')
	this.$teamInfoContainer.addClass('hide')
	this.$mask.addClass('hide')
}
//选择好友
YX.fn.checkedUser =  function(o) {
	var $this = $(this),
		$checkIcon = $this.find('i'),
		$addedUserNum = $('#addedUserNum'),
		$addedUserListUl = $('#addedUserList ul'),
		account = $this.attr('data-account'),
		name = $this.data('account'),
		icon = $this.data('icon'),
		addedNum = $addedUserNum.text()
	if (!$checkIcon.hasClass('cur2')) {  // 已是群成员，无法选择
		$checkIcon.toggleClass('cur')
		var str = '<li data-account="' + account + '" data-account="' + name + '" data-icon="' + icon + '"><img src="' + getAvatar(icon) + '" width="56" height="56"/><p class="name">' + name + '</p></li>'
		if ($checkIcon.hasClass('cur')) {
			$addedUserListUl.append(str)
			addedNum++
		} else {
			$addedUserListUl.find('[data-account=' + account + ']').remove()
			addedNum--
		}
		$addedUserNum.text(addedNum)
	}
}
/***************************
 * 搜索高级群
 ***************************/
YX.fn.showTeamSearch = function(){
	this.searchData = null
    this.$searchBox.removeClass("hide")
    this.$mask.removeClass('hide')
    this.$searchBox.find(".j-account").focus()
}
YX.fn.hideTeamSearch = function(){
    this.resetTeamSearch()
    this.$searchBox.addClass("hide")
    this.$mask.addClass('hide')
}
YX.fn.doTeamSearch = function(){
    var account =  $.trim(this.$searchBox.find(".j-account").val())
    if(/^\d+$/.test(account)){
        this.mysdk.getTeam(account,this.cbDoTeamSearch.bind(this))
    }else{
    	alert("输入有误（群ID必须是数字）")
    } 
}
YX.fn.cbDoTeamSearch = function(err,data){
	if(err){
		alert(err.message)
	}else{
		if(data.type==="normal"||data.valid===false){
			alert("群不存在")
			return
		}
		var $info = this.$searchBox.find(".info")
		var teamId = data.teamId
        $info.find(".j-name").html(data.name)
        $info.find(".j-teamId").html(data.teamId)
        if(this.cache.hasTeam(teamId)){
        	this.$searchBox.addClass("inTeam")    
        }else{
        	this.$searchBox.addClass("notInTeam")    
        }
	}
}
YX.fn.resetTeamSearch = function(){
    this.$searchBox.attr('class',"m-dialog")
    this.$searchBox.find(".j-account").val("")
}
YX.fn.doTeamChat = function(){
	var account =  $.trim(this.$searchBox.find(".j-account").val())
	this.openChatBox(account,"team")
	this.hideTeamSearch()
}
YX.fn.doTeamAdd = function(){
	var account =  $.trim(this.$searchBox.find(".j-account").val())
	this.mysdk.applyTeam(account)
}
/********************************************************************
 * 群资料
********************************************************************/
YX.fn.showTeamInfo = function() {
	var that = this
	this.$teamInfoContainer.load('./teamInfo.html', function() {
		// 获取群成员
		var teamId = that.crtSessionAccount,
			teamInfo = that.cache.getTeamById(teamId)
		if(!teamInfo){
			return
		}
		var	type = teamInfo.type,
			teamName = teamInfo.name,
			teamOwner = teamInfo.owner,
			intro = teamInfo.intro||"",
			joinMode = teamInfo.joinMode||"",
			beInviteMode = teamInfo.beInviteMode||"",
			inviteMode = teamInfo.inviteMode||"",
			updateTeamMode = teamInfo.updateTeamMode||"",
			myTeamInfo,
			html = '',
			$userList = $('#teamMemberList'),
			$teamId = that.$teamInfoContainer.find(".j-teamId"),
			$teamAvatar = that.$teamInfoContainer.find(".j-teamAvatar"),
			$teamName = $('#teamName'),
			$teamDesc = $('#teamDesc')
		var members;
		// 高级群
		var showRole = function () {
			myTeamInfo = that.cache.getTeamMemberInfo(userUID,teamId)
			if(type === "advanced"){
				//其本信息
				that.$teamInfoContainer.removeClass("normal").find('.j-advanced').removeClass("hide")
				$teamDesc.find('.name').text(intro)
				var avatarUrl = teamInfo.avatar?(teamInfo.avatar+"?imageView&thumbnail=40y40"):"images/advanced.png"
				$teamAvatar[0].src = avatarUrl
				if(myTeamInfo.type==="owner"||(myTeamInfo.type==="manager")){
					that.$teamInfoContainer.find('.j-joinMode[value='+joinMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-beInviteMode[value='+beInviteMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-inviteMode[value='+inviteMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-updateTeamMode[value='+updateTeamMode+']').attr("checked", 'checked')
					$teamName.addClass('owner')
					$teamDesc.addClass('owner')
					$teamAvatar.addClass('active')
				}else{
					that.$teamInfoContainer.find('.j-joinMode').attr("disabled", 'disabled').filter('[value='+joinMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-beInviteMode').attr("disabled", 'disabled').filter('[value='+beInviteMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-inviteMode').attr("disabled", 'disabled').filter('[value='+inviteMode+']').attr("checked", 'checked')
					that.$teamInfoContainer.find('.j-updateTeamMode').attr("disabled", 'disabled').filter('[value='+updateTeamMode+']').attr("checked", 'checked')
				}
				if(userUID === teamOwner){
					that.$teamInfoContainer.find('.j-dismissTeam').removeClass("hide")
					that.$teamInfoContainer.find('.j-exitTeam').addClass("hide")
				}
				if(updateTeamMode==="all"){
					$teamName.addClass('owner')
					$teamDesc.addClass('owner')
					$teamAvatar.addClass('active')
				}
			}else{
				//讨论组
				that.$teamInfoContainer.addClass("normal").find('.j-exitTeam').text("退出讨论组")
				$teamName.addClass('owner')
				$teamDesc.addClass('owner')
				$teamAvatar[0].src = "images/normal.png"
			}
		}
		$teamName.find('.name').text(teamName)
		$teamId.text(teamId)
		var showMember = function(){	
			members = that.cache.getTeamMembers(teamId).members	
			var array=[]
			for(var i = 0; i<members.length; i++){
				if(!that.cache.getUserById(members[i].account)){
					array.push(members[i].account)
				}
			}
			if(array.length>0){
				getInfo(array)
			}else{
				showUI()
			}
		}
		var showUI = function(){
			showRole()
			that.sortTeamMembers(members)
			if (type === 'normal' || myTeamInfo.type!=="normal" || inviteMode==="all") { // 是群主
				html += '<li class="first add-item tc radius-circle" data-team-type="' + type + '" data-team-id="' + teamId + '"><i class="icon icon-plus"></i><p></p></li>'
			}
			for (var i = 0, l = members.length; i < l; ++i) {
				var member = members[i],
					account = member.account,
					avatar = getAvatar(that.cache.getUserById(account)?that.cache.getUserById(account).avatar:""),
					nick = getNick(account)
				html += '<li data-account="' + account + '"><a href="javascript:"><img src="'+avatar+'"/>'
				if (member.type === 'owner') {
					html += '<i class="icon radius-circle icon-user"></i>'
				} else {
					html += '<span class="hover" data-nick="' + nick + '" data-team-name="' + teamName + '" data-account="' + account + '" data-team-id="' + teamId + '">移除</span>'
				}
				html += '</a><p class="text">' + nick + '</p></li>'
			}
			$userList.html(html)
			if (myTeamInfo.type!=="normal") {
				$userList.addClass('owner')
			}
		}
		var getInfo = function (array) {
			that.mysdk.getUsers(array,function(err,data){
				if(!err){
					for(var j = 0;j<data.length; j++){
						that.cache.updatePersonlist(data[j])
					}
					showUI()
				}else{
					alert("获取用户信息失败")
				}
			})
		}
	 	that.getTeamMembers(teamId,showMember)
		that.$teamInfoContainer.removeClass('hide')
	})
}
YX.fn.sortTeamMembers = function(members) {
	if (!members || !members.length) return;
	members.sort(function(x, y) {
		if(x.type==="owner"){
			return -1
		}else if(y.type==="owner"){
			return 1
		}else if(x.type==="manager"){
			return -1
		}else if(y.type==="manager"){
			return 1
		}else{
			return 0
		}
	})
}
YX.fn.hideTeamInfo = function() {
	this.$teamInfoContainer.addClass('hide')
	this.$mask.addClass('hide')
}
YX.fn.removeTeamMember = function(event) {
	var ev = event || window.event,
		$target = $(ev.target),
		that = this,
		account = $target.attr('data-account'),
		teamId = $target.data('team-id'),
		teamType = $('#teamMemberList .first').data('team-type')
	this.mysdk.removeTeamMembers({
		teamId: teamId,
		accounts: [account],
		done: function(error, params) {
			if (error) {
				alert('移除成员失败')
			}else{
				$target.parents('li').remove()
			}
				
		}
	})
}

YX.fn.editTeamInfo = function() {
	var $this = $(this)
	if ($this.hasClass('owner')) {
		$this.parent('.wrap').addClass('active')
		$this.parent('.wrap').find("input").focus()
	}
}

YX.fn.saveTeamName = function() {
	var $input = $('#teamNameInput'),
		name = $input.val().trim(),
		that = this,
		teamId = this.crtSessionAccount
	if (name.length > 0) {
		this.mysdk.updateTeam({
			teamId: teamId,
			name: name,
			done: function(error, params) {
				if (!error) {
					var name = params.name
					$('#teamName .name').text(name)
					$input.val('').parents('.wrap').removeClass('active')
				} else {
					alert('群名称修改失败')
				}
			}
		})
	}else{
		$input.parents('.wrap').removeClass('active')
	}
}

YX.fn.saveTeamDesc = function() {
	var $input = $('#teamDescInput'),
		name = $input.val().trim(),
		that = this,
		teamId = this.crtSessionAccount
	if (name.length > 0) {
		this.mysdk.updateTeam({
			teamId: teamId,
			intro: name,
			done: function(error, params) {
				if (!error) {
					var name = params.intro
					$('#teamDesc .name').text(name)
					$input.val('').parents('.wrap').removeClass('active')
				} else {
					alert('修改群介绍失败')
				}
			}
		})
	}else{
		$input.parents('.wrap').removeClass('active')
	}
}
YX.fn.setJoinMode = function(evt){
	var joinMode = $(evt.target).val(),
		teamId = this.crtSessionAccount
	this.mysdk.updateTeam({
		teamId: teamId,
	    joinMode: joinMode,
	    done: function(error, params){
	    	if (!error) {
			} else {
				alert(error.message)
			}
	    }
	})
}
YX.fn.setInviteMode = function(evt){
	var inviteMode = $(evt.target).val(),
		teamId = this.crtSessionAccount
	this.mysdk.updateTeam({
		teamId: teamId,
	    inviteMode: inviteMode,
	    done: function(error, params){
	    	if (!error) {
			} else {
				alert(error.message)
			}
	    }
	})
}
YX.fn.setBeInviteMode = function(evt){
	var beInviteMode = $(evt.target).val(),
		teamId = this.crtSessionAccount
	this.mysdk.updateTeam({
		teamId: teamId,
	    beInviteMode: beInviteMode,
	    done: function(error, params){
	    	if (!error) {
			} else {
				alert(error.message)
			}
	    }
	})
}
YX.fn.setUpdateTeamMode = function(evt){
	var updateTeamMode = $(evt.target).val(),
		teamId = this.crtSessionAccount
	this.mysdk.updateTeam({
		teamId: teamId,
	    updateTeamMode: updateTeamMode,
	    done: function(error, params){
	    	if (!error) {
			} else {
				alert(error.message)
			}
	    }
	})
}
// 普通群（任何人）/高级群（非群主），退出群
YX.fn.exitTeam = function() {
	var that = this,
		teamId = this.crtSessionAccount
	this.mysdk.leaveTeam({
		teamId: teamId,
		done: function(error, params) {
			if (!error) {
				that.$teamInfoContainer.addClass('hide')
				that.$rightPanel.addClass('hide')
				removeChatVernier(teamId)
			} else {
				alert(error.message)
			}
		}
	})
}
//高级群解散
YX.fn.doDismissTeam = function() {	
	var that = this,
		teamId = this.crtSessionAccount
	this.mysdk.dismissTeam({
		teamId: teamId,
		done: function(error, params) {
			if (!error) {
				that.$teamInfoContainer.addClass('hide')
				that.$rightPanel.addClass('hide')
				removeChatVernier(teamId)
			} else {
				alert(error.message)
			}
		}
	});
}
