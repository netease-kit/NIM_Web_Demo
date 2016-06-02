/**
 * 群组功能
 * @type {Object}
 */
var myTeam = {
	init: function(cache,sdk) {
		this.cache = cache;
		this.sdk = sdk;
		this.initNode();
		this.addEvent();
	},
	initNode: function() {
		this.$teamPanel = $('#j-loadTeams');
		this.$teamInfo = $('#j-teamInfo');
		this.$rightPanel = $('#j-rightPanel');
		this.$mask = $('#j-mask');
		this.$teamInfoContainer = $('#j-teamInfoContainer');
		this.$createTeamContainer = $('#j-createTeamContainer');
		this.$searchBox = $('#searchTeamBox');
	},

	addEvent: function() {
		this.$teamPanel.delegate('#createTeam', 'click', this.showUserList.bind(this,0,0));
		this.$teamPanel.delegate('#createAdvanceTeam', 'click', this.showUserList.bind(this,0,1));
		this.$teamPanel.delegate('#searchAdvanceTeam', 'click', this.showSearch.bind(this,0,1));
		this.$teamInfoContainer.delegate('.j-backBtn', 'click', this.closeTeamPanel.bind(this));
		this.$teamInfoContainer.delegate('#j-userList .first', 'click', this.showUserList.bind(this,1));
		this.$teamInfoContainer.delegate('#j-userList .hover', 'click', this.removeUser.bind(this));
		this.$teamInfoContainer.delegate('#j-teamName', 'click', this.editTeamName);
		this.$teamInfoContainer.delegate('#j-desc', 'click', this.editDesc);
		this.$teamInfoContainer.delegate('.j-exitTeam', 'click', this.exitTeam.bind(this));
		this.$teamInfoContainer.delegate('.j-dismissTeam', 'click', this.dismissTeam.bind(this));
		this.$teamInfoContainer.delegate('#j-nameInput', 'blur', this.saveTeamName.bind(this));
		this.$teamInfoContainer.delegate('#j-descInput', 'blur', this.saveTeamDesc.bind(this));
		this.$teamInfoContainer.delegate('.j-teamAvatar', 'click', yunXin.showModifyAvatar.bind(yunXin,"team"));

		this.$teamInfoContainer.delegate('.j-joinMode', 'change', this.setJoinMode);
		this.$teamInfoContainer.delegate('.j-inviteMode', 'change', this.setInviteMode);
		this.$teamInfoContainer.delegate('.j-beInviteMode', 'change', this.setBeInviteMode);
		this.$teamInfoContainer.delegate('.j-updateTeamMode', 'change', this.setUpdateTeamMode);

		this.$createTeamContainer.delegate('.user-list li', 'click', this.checkedUser);
		this.$createTeamContainer.delegate('.icon-close', 'click', this.closeDialog.bind(this));
		this.$createTeamContainer.on('click', '#j-btnAdd', this.createTeam.bind(this));
		this.$createTeamContainer.on('click', '#j-btnCancel', this.closeDialog.bind(this));
		this.$teamInfo.on('click', this.showTeamInfo.bind(this, this.$teamInfo));
		this.$searchBox.delegate('.j-close', 'click', this.hideSearch.bind(this));
		this.$searchBox.delegate('.j-search', 'click', this.doSearch.bind(this));
		this.$searchBox.delegate('.j-back', 'click', this.resetSearch.bind(this));
		this.$searchBox.delegate('.j-chat', 'click', this.doChat.bind(this));
		this.$searchBox.delegate('.j-add', 'click', this.doAdd.bind(this));
	},


	closeDialog: function() {
		this.$createTeamContainer.addClass('hide');
		this.$mask.addClass('hide');
	},

	editTeamName: function() {
		var $this = $(this);
		if ($this.hasClass('owner')) {
			$this.parent('.wrap').addClass('active');
			$this.parent('.wrap').find("input").focus();
		}
	},

	editDesc:function(){
		var $this = $(this);
		if ($this.hasClass('owner')) {
			$this.parent('.wrap').addClass('active');
			$this.parent('.wrap').find("input").focus();
		}
	},

	saveTeamName: function() {
		var $input = $('#j-nameInput'),
			$teams = $('#j-teams'),
			name = $input.val().trim(),
			that = this,
			teamId = this.$teamInfo.data('team-id');
		if (name.length > 0) {
			this.sdk.updateTeam({
				teamId: teamId,
				name: name,
				done: function(error, params) {
					if (!error) {
						var name = params.name;
						$('#j-teamName .name').text(name);
						$input.val('').parents('.wrap').removeClass('active');
					} else {
						alert('群名称修改失败');
					}
				}
			});
		}else{
			$input.parents('.wrap').removeClass('active');
		}
	},

	saveTeamDesc: function() {
		var $input = $('#j-descInput'),
			$teams = $('#j-teams'),
			name = $input.val().trim(),
			that = this,
			teamId = this.$teamInfo.data('team-id');
		if (name.length > 0) {
			this.sdk.updateTeam({
				teamId: teamId,
				intro: name,
				done: function(error, params) {
					if (!error) {
						var name = params.intro;
						$('#j-desc .name').text(name);
						$input.val('').parents('.wrap').removeClass('active');
					} else {
						alert('修改群介绍失败');
					}
				}
			});
		}else{
			$input.parents('.wrap').removeClass('active');
		}
	},

	/**
	 * 创建群
	 */
	createTeam: function() {
		var accounts = [], 
			names = [], 
			$items = $('#j-addedUserList ul li'),
			teamId = this.addTag&&this.$teamInfo.data('team-id'), 
			that = this;
		if($items.length===0){
			this.$createTeamContainer.addClass('hide');
			this.$teamInfoContainer.addClass('hide');
			this.$mask.addClass('hide');
			return;
		}
		$items.map(function(){
			accounts.push($(this).attr("data-uid"));
			names.push($(this).attr("data-account"));
		});

		if (!!teamId) {	// 如果存在群id，则为新添加成员
			this.sdk.addTeamMembers({
				teamId: teamId,
				accounts: accounts,
				ps: '',
				done: function(error, params) {
					if (error) {alert('添加成员失败')}
				}
			});
		} else { // 创建普通群
			var owner = this.getUserById(userUID).nick;
			names = [owner].concat(names).join('、').slice(0,20);
			if(that.teamType === 0){
				this.sdk.createTeam({
					type: 'normal',
					name: names + '等人',
					accounts: accounts,
					done: function(error, t) {
						if (!error) {
							that.cache.addTeam(t.team);
							yunXin.buildTeams();
							$('#j-loadTeams .j-normalTeam li[data-account="'+t.team.teamId+'"]').click();
							
						}else{
							alert("创建失败");
						}
					}
				});			
			}else{
				this.sdk.createTeam({
					type: 'advanced',
					name: names + '等人',
					accounts: accounts,
					joinMode: 'needVerify',
					done: function(error, t) {
						if (!error) {
							that.cache.addTeam(t.team);
							yunXin.buildTeams();
							$('#j-loadTeams .j-advanceTeam li[data-account="'+t.team.teamId+'"]').click();
							
						}else{
							alert(error.message);
						}
					}
				});			
			}
		}
		this.$createTeamContainer.addClass('hide');
		this.$teamInfoContainer.addClass('hide');
		this.$mask.addClass('hide');
	},

	getUsers: function(arr, type) {
		var members = [];
		for (var i = 0, l = arr.length; i < l; ++i) {
			var a = this.getUserById(arr[i]);
			if (type === 0) {
				a.type = i > 0 ? 'normal' : 'owner';
			} else {
				a.type = 'normal';
			}
			members.push(a);
		}
		return members;
	},

	/**
	 * 联系人选择界面展示
	 * @param  {int} type 0为新建群添加成员，1为在已有群的情况下添加成员
	 * @param  {int} teamType 高级群1 普通群 0
	 * @return {void}      
	 */
	showUserList: function(type,teamType) {
		var that = this;
		this.teamType = teamType;
		this.$createTeamContainer.load('./create-team.html', function() {
			$("#j-devices").addClass('hide');
			that.$createTeamContainer.removeClass('hide');
			that.$mask.removeClass('hide');
			var $addIcon = $('#j-userList .first'),
				$addUserUl = $('#j-addUserList ul'),
				list = that.cache.getFriendslistOnShow(),
				tmp = '',
			 	teamId = '', 
			 	members = [];
 			// 好友列表
			for (var i = 0, l = list.length; i < l; ++i) {
				if (list[i].uid !== userUID) { // 除自己以外
					tmp += appUI.buildTeamMemberList(list[i]);
				}
			}
			$addUserUl.html(tmp);
			if (type !== 0) {
				teamId = $addIcon.data('team-id');
				that.sdk.getTeamMembers({
					teamId: teamId,
					done: function(error, obj) {
						//给已经在群的好友标记
						members = error ? getMembersById(teamId) : obj.members; // 群成员列表
						for (var i = 0, l = members.length; i < l; ++i) {
							var uid = members[i].account || members[i].uid;
							$addUserUl.find('[data-uid="' + uid + '"] i').addClass('cur2');
						}
					}
				});
				//用来区分是否创群
				that.addTag = true;
			} else {
				that.addTag = false;
			}
			
		});
	},

	showTeamInfo: function(o) {
		var $this = $(o),
	 		that = this;
		this.$teamInfoContainer.load('./team-info.html', function() {
			// 获取群成员
			var teamId = $this.data('team-id'),
				teamInfo = that.cache.getTeamById(teamId);
			if(!teamInfo){
				return;
			}
			var	type = teamInfo.type,
				teamName = teamInfo.name,
				teamOwner = teamInfo.owner,
				intro = teamInfo.intro||"",
				joinMode = teamInfo.joinMode||"",
				beInviteMode = teamInfo.beInviteMode||"",
				inviteMode = teamInfo.inviteMode||"",
				updateTeamMode = teamInfo.updateTeamMode||"",
				myTeamInfo = that.cache.getTeamMemberInfo(userUID,teamId),
				members = [],
				html = '',
				$userList = $('#j-userList'),
				$teamId = that.$teamInfoContainer.find(".j-teamId"),
				$teamAvatar = that.$teamInfoContainer.find(".j-teamAvatar"),
				$teamName = $('#j-teamName'),
				$teamDesc = $('#j-desc');
			if(type==="advanced"){
				//其本信息
				that.$teamInfoContainer.removeClass("normal").find('.j-advanced').removeClass("hide");
				$teamDesc.find('.name').text(intro);
				var avatarUrl = teamInfo.avatar?(teamInfo.avatar+"?imageView&thumbnail=40y40"):"images/advanced.png";
				$teamAvatar[0].src = avatarUrl;
				if(myTeamInfo.type==="owner"||(myTeamInfo.type==="manager")){
					that.$teamInfoContainer.find('.j-joinMode[value='+joinMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-beInviteMode[value='+beInviteMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-inviteMode[value='+inviteMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-updateTeamMode[value='+updateTeamMode+']').attr("checked", 'checked');
					$teamName.addClass('owner');
					$teamDesc.addClass('owner');
					$teamAvatar.addClass('active');
				}else{
					that.$teamInfoContainer.find('.j-joinMode').attr("disabled", 'disabled').filter('[value='+joinMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-beInviteMode').attr("disabled", 'disabled').filter('[value='+beInviteMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-inviteMode').attr("disabled", 'disabled').filter('[value='+inviteMode+']').attr("checked", 'checked');
					that.$teamInfoContainer.find('.j-updateTeamMode').attr("disabled", 'disabled').filter('[value='+updateTeamMode+']').attr("checked", 'checked');
				}
				if(userUID === teamOwner){
					that.$teamInfoContainer.find('.j-dismissTeam').removeClass("hide");
					that.$teamInfoContainer.find('.j-exitTeam').addClass("hide");
				}
				if(updateTeamMode==="all"){
					$teamName.addClass('owner');
					$teamDesc.addClass('owner');
					$teamAvatar.addClass('active');
				}
			}else{
				//讨论组
				that.$teamInfoContainer.addClass("normal").find('.j-exitTeam').text("退出讨论组");
				$teamName.addClass('owner');
				$teamDesc.addClass('owner');
				$teamAvatar[0].src = "images/normal.png";
			}
			
			members = that.cache.getTeamMembers(teamId).members;
			$teamName.find('.name').text(teamName);
			$teamId.text(teamId);
			var showMember = function(members){
				that.sortMembers(members);  // 需要把群主放在第一个位置
				var array=[];
				var showUI = function(){
					if (type === 'normal' || myTeamInfo.type!=="normal" || inviteMode==="all") { // 是群主
						html += '<li class="first add-item tc radius-circle" data-team-type="' + type + '" data-team-id="' + teamId + '"><i class="icon icon-plus"></i><p></p></li>';
					}
					for (var i = 0, l = members.length; i < l; ++i) {
						var member = members[i],
							uid = member.account || member.uid,
							avatar = getAvatar(that.getUserById(uid)?that.getUserById(uid).avatar:""),
							nick = getNick(uid);
						html += '<li data-uid="' + uid + '"><a href="javascript:;"><img src="'+avatar+'"/>';
						if (member.type === 'owner') {
							html += '<i class="icon radius-circle icon-user"></i>';
						} else {
							html += '<span class="hover" data-nick="' + nick + '" data-team-name="' + teamName + '" data-uid="' + uid + '" data-team-id="' + teamId + '">移除</span>';
						}
						html += '</a><p class="text">' + nick + '</p></li>';
					}
					$userList.html(html);
					if (myTeamInfo.type!=="normal") {
						$userList.addClass('owner');
					}
				}
				for(var i = 0;i<members.length;i++){
					if(!that.getUserById(members[i].account)){
						array.push(members[i].account)
					};
				}
				if(array.length>0){
					yunXin.mysdk.getUsers(array,function(err,data){
						if(!err){
							for(var j = 0;j<data.length;j++){
								that.cache.updatePersonlist(data[j]);
							}
							showUI();
						}else{
							alert("获取用户信息失败");
						}
					})
				}else{
					showUI();
				}
			}
			showMember(members)
			that.$teamInfoContainer.removeClass('hide');
		});
	},

	getUserById:function(uid){
		return this.cache.getUserById(uid);
	},

	getTeamById:function(teamId){
		return this.cache.getTeamById(teamId);
	},

	getMembersById:function(id){
		return this.cache.getMembersById(id);
	},

	sortMembers: function(members) {
		if (!members || !members.length) return;
		members.sort(function(x, y) {
			if(x.type==="owner"){
				return -1;
			}else if(y.type==="owner"){
				return 1;
			}else if(x.type==="manager"){
				return -1;
			}else if(y.type==="manager"){
				return 1;
			}else{
				return 0;
			}
		});
	},

	checkedUser: function(o) {
		var $this = $(this),
			$checkIcon = $this.find('i'),
			$addedUserNum = $('#j-addedUserNum'),
			$addedUserListUl = $('#j-addedUserList ul'),
			uid = $this.attr('data-uid'),
			name = $this.data('account'),
			icon = $this.data('icon'),
			addedNum = $addedUserNum.text();
		if (!$checkIcon.hasClass('cur2')) {  // 已是群成员，无法选择
			$checkIcon.toggleClass('cur');
			var str = '<li data-uid="' + uid + '" data-account="' + name + '" data-icon="' + icon + '"><img src="' + getAvatar(icon) + '" width="56" height="56"/><p class="name">' + name + '</p></li>';
			if ($checkIcon.hasClass('cur')) {
				$addedUserListUl.append(str);
				addedNum++;
			} else {
				$addedUserListUl.find('[data-uid=' + uid + ']').remove();
				addedNum--;
			}
			$addedUserNum.text(addedNum);
		}
	},

	removeUser: function(event) {	// 移除成员
		var ev = event || window.event,
			$target = $(ev.target),
			that = this,
			uid = $target.attr('data-uid'),
			teamId = $target.data('team-id'),
			teamType = $('#j-userList .first').data('team-type');
		this.sdk.removeTeamMembers({
			teamId: teamId,
			accounts: [uid],
			done: function(error, params) {
				if (error) {
					alert('移除成员失败');
				}else{
					$target.parents('li').remove();
				}
					
			}
		});
	},

	buildTeamName: function(members) {
		var names = [];
		for (var i = 0, l = members.length; i < l; ++i) {
			var uid = members[i].uid || members[i].account,
				user = this.getUserById(uid);
			names.push(user.name);
		}
		return names.join('、') + '等人';
	},

	setJoinMode:function(){
		var joinMode = $(this).val(),
			teamId = myTeam.$teamInfo.data('team-id');
		myTeam.sdk.updateTeam({
			teamId: teamId,
		    joinMode: joinMode,
		    done: function(error, params){
		    	if (!error) {
				} else {
					alert(error.message);
				}
		    }
		});
	},
	setInviteMode:function(){
		var inviteMode = $(this).val(),
			teamId = myTeam.$teamInfo.data('team-id');
		myTeam.sdk.updateTeam({
			teamId: teamId,
		    inviteMode: inviteMode,
		    done: function(error, params){
		    	if (!error) {
				} else {
					alert(error.message);
				}
		    }
		});
	},
	setBeInviteMode:function(){
		var beInviteMode = $(this).val(),
			teamId = myTeam.$teamInfo.data('team-id');
		myTeam.sdk.updateTeam({
			teamId: teamId,
		    beInviteMode: beInviteMode,
		    done: function(error, params){
		    	if (!error) {
				} else {
					alert(error.message);
				}
		    }
		});
	},
	setUpdateTeamMode:function(){
		var updateTeamMode = $(this).val(),
			teamId = myTeam.$teamInfo.data('team-id');
		myTeam.sdk.updateTeam({
			teamId: teamId,
		    updateTeamMode: updateTeamMode,
		    done: function(error, params){
		    	if (!error) {
				} else {
					alert(error.message);
				}
		    }
		});
	},
	exitTeam: function() {	// 普通群（任何人）/高级群（非群主），退出群
		var that = this,
			teamId = this.$teamInfo.data('team-id');
		this.sdk.leaveTeam({
			teamId: teamId,
			done: function(error, params) {
				if (!error) {
					$('#j-chatEditor').data({to:""});
					that.$teamInfoContainer.addClass('hide');
					that.$rightPanel.addClass('hide');
					removeChatVernier(teamId);
				} else {
					alert(error.message);
				}
			}
		});
	},
	//高级群解散
	dismissTeam: function() {	
		var that = this,
			teamId = this.$teamInfo.data('team-id');
		this.sdk.dismissTeam({
			teamId: teamId,
			done: function(error, params) {
				if (!error) {
					$('#j-chatEditor').data({to:""});
					that.$teamInfoContainer.addClass('hide');
					that.$rightPanel.addClass('hide');
					removeChatVernier(teamId);
				} else {
					alert(error.message);
				}
			}
		});
	},

	closeTeamPanel: function() {	// 返回到群聊天面板
		this.$teamInfoContainer.addClass('hide');
		this.$mask.addClass('hide');
	},
	// 搜索高级群
	showSearch:function(){
 		this.searchData = null;
        this.$searchBox.removeClass("hide");
        this.$mask.removeClass('hide');
        this.$searchBox.find(".j-account").focus();
	},
    hideSearch:function(){
        this.resetSearch();
        this.$searchBox.addClass("hide");
        this.$mask.addClass('hide');
    },
    doSearch:function(){
        var account =  $.trim(this.$searchBox.find(".j-account").val());
        if(/^\d+$/.test(account)){
            this.sdk.getTeam(account,this.cbDoSearch.bind(this))
        }else{
        	alert("输入有误（群ID必须是数字）");
        } 
    },
    cbDoSearch:function(err,data){
    	if(err){
    		alert(err.message);
    	}else{
    		if(data.type==="normal"||data.valid===false){
    			alert("群不存在");
    			return;
    		}
    		var $info = this.$searchBox.find(".info");
    		var teamId = data.teamId;
            $info.find(".j-name").html(data.name);
            $info.find(".j-teamId").html(data.teamId);
            if(this.cache.hasTeam(teamId)){
            	this.$searchBox.addClass("inTeam");    
            }else{
            	this.$searchBox.addClass("notInTeam");    
            }
    	}
    },
    resetSearch:function(){
        this.$searchBox.attr('class',"m-dialog");
        this.$searchBox.find(".j-account").val("");
    },
    doChat:function(){
    	var account =  $.trim(this.$searchBox.find(".j-account").val());
    	yunXin.openChatBox(account,"team");
    	this.hideSearch();
    },
     doAdd:function(){
    	var account =  $.trim(this.$searchBox.find(".j-account").val());
    	this.sdk.applyTeam(account);
    },
};

