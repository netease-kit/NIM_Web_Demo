var myTeam = {
	init: function(cache,sdk) {
		this.cache = cache;
		this.sdk = sdk;
		this.initNode();
		this.addEvent();
	},

	addEvent: function() {
		this.$teamPanel.delegate('#j-createTeam', 'click', this.addUser.bind(this, 0));
		this.$teamInfoContainer.delegate('.j-backBtn', 'click', this.closeTeamPanel.bind(this));
		this.$teamInfoContainer.delegate('#j-userList .first', 'click', this.addUser.bind(this, 1));
		this.$teamInfoContainer.delegate('#j-userList .hover', 'click', this.removeUser.bind(this));
		this.$teamInfoContainer.delegate('#j-teamName', 'click', this.editTeamName);
		this.$teamInfoContainer.delegate('#j-exitTeam', 'click', this.exitTeam.bind(this));
		this.$teamInfoContainer.delegate('#j-nameInput', 'blur', this.saveTeamName.bind(this));
		this.$createTeamContainer.delegate('.user-list li', 'click', this.checkedUser);
		this.$createTeamContainer.delegate('.icon-close', 'click', this.closeDialog.bind(this));
		this.$createTeamContainer.on('click', '#j-btnAdd', this.createTeam.bind(this));
		this.$createTeamContainer.on('click', '#j-btnCancel', this.closeDialog.bind(this));
		this.$teamInfo.on('click', this.showTeamInfo.bind(this, this.$teamInfo));
	},

	initNode: function() {
		this.$teamPanel = $('#j-loadTeams');
		this.$teamInfo = $('#j-teamInfo');
		this.$rightPanel = $('#j-rightPanel');
		this.$mask = $('#j-mask');
		this.$teamInfoContainer = $('#j-teamInfoContainer');
		this.$createTeamContainer = $('#j-createTeamContainer');
	},

	closeDialog: function() {
		this.$createTeamContainer.addClass('hide');
		this.$mask.addClass('hide');
	},

	editTeamName: function() {
		var $this = $(this);
		if ($this.hasClass('owner')) {
			$this.parent('.wrap').addClass('active');
			$this.next('input').removeClass('hide');
		}
	},

	saveTeamName: function() {
		var $input = $('#j-nameInput'),
			$teams = $('#j-teams'),
			name = $input.val(),
			that = this,
			teamId = this.$teamInfo.data('team-id');
		if ($.trim(name).length > 0) {
			this.sdk.updateTeam({
				teamId: teamId,
				name: name,
				done: function(error, params) {
					if (!error) {
						var name = params.name;
						$('#j-teamName .name').text(name);
						$input.val('').addClass('hide').parents('.wrap').removeClass('active');
					} else {
						alert('群名称修改失败');
					}
				}
			});
		}
	},

	/**
	 * 创建群 注： 建群 UI在回调处理，其他群消息UI在推送群通知 （notification）后处理
	 * @return 
	 */
	createTeam: function() {
		var accounts = [], 
			names = [], 
			$items = $('#j-addedUserList ul li'),
			teamId = this.addTag&&this.$teamInfo.data('team-id'), 
			that = this, 
			type = 0;
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
			type = 1;
			this.sdk.addTeamMembers({
				teamId: teamId,
				accounts: accounts,
				ps: '',
				done: function(error, params) {
					if (error) {alert('添加成员失败')}
				}
			});
		} else { // 创建普通群
			type = 0;
			var owner = this.getUserById(userUID).nick;
			names = [owner].concat(names).join('、').slice(0,20);
			this.sdk.createTeam({
				type: 'normal',
				name: names + '等人',
				accounts: accounts,
				done: function(error, t) {
					if (!error) {
						that.cache.addTeam(t.team);
						yunXin.buildTeams();
						$('#normalTeam li[data-account]="'+t.team.teamId+'"').click();
						// var html = '<li data-gtype="normal" data-type="team" data-account="' + t.team.teamId + '"><img class="radius-circle" src="images/normal.png" width="44" height="44"><div class="text"><p class="nick"><span>' + t.team.name + '</span></p></div></li>',
						// 	$normalTeam = $('#normalTeam'),
						// 	$teams = $('#j-teams .teams');
						// if ($teams.find('.team').length > 0) {
						// 	if ($normalTeam.length > 0) {
						// 		$(html).prependTo($normalTeam).click();
						// 	} else {
						// 		$teams.append('<div class="team normal-team"><div class="team-title">普通群</div><ul id="normalTeam"></ul></div>');
						// 		$(html).appendTo($('#normalTeam')).click();
						// 	}
						// } else {
						// 	$teams.html('<div class="team normal-team"><div class="team-title">普通群</div><ul id="normalTeam"></ul></div>');
						// 	$(html).appendTo($('#normalTeam')).click();
						// }
						
					}else{
						alert("创建失败");
					}
				}
			});
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
	* @param type: 0为新建群添加成员，1为在已有群的情况下添加成员
	**/
	addUser: function(type) {
		var that = this;
		this.$createTeamContainer.load('/webdemo/create-team.html', function() {
			$("#j-devices").addClass('hide');
			that.$createTeamContainer.removeClass('hide');
			that.$mask.removeClass('hide');
			var $addIcon = $('#j-userList .first'),
				$addUserUl = $('#j-addUserList ul'),
				list = that.cache.getFriendslistOnShow(),
				tmp = '', teamId = '', members = [];
			if (type !== 0) {
				teamId = $addIcon.data('team-id');
				that.sdk.getTeamMembers({
					teamId: teamId,
					done: function(error, obj) {
						members = error ? getMembersById(teamId) : obj.members; // 群成员列表
						for (var i = 0, l = members.length; i < l; ++i) {
							var uid = members[i].account || members[i].uid;
							$addUserUl.find('[data-uid="' + uid + '"] i').addClass('cur2');
						}
					}
				});
				that.addTag = true;
			} else {
				that.addTag = false;
			}
			for (var i = 0, l = list.length; i < l; ++i) {
				if (list[i].uid !== userUID) { // 除自己以外
					tmp += appUI.buildTeamMemberList(list[i]);
				}
			}
			$addUserUl.html(tmp);
		});
	},


	showTeamInfo: function(o) {
		var $this = $(o),
	 		that = this;
		this.$teamInfoContainer.load('/webdemo/team-info.html', function() {
			that.$teamInfoContainer.removeClass('hide');

			// 获取群成员
			var teamId = $this.data('team-id'),
				type = $this.data('gtype'),
				teamName = $('#j-nickName').text(),
				members = [],
				html = '',
				$userList = $('#j-userList'),
				$teamName = $('#j-teamName');
			that.sdk.getTeamMembers({
				teamId: teamId,
				done: function(error, obj) {
					if (!error) {
						members = obj.members;
						$teamName.find('.name').text(teamName);
						that.sortMembers(members);  // 需要把群主放在第一个位置
						var teamOwner = members[0].account || members[0].uid,
							array=[];
						var showUI = function(){
							if (type === 'normal' || userUID === teamOwner) { // 是群主
								html += '<li class="first add-item tc radius-circle" data-team-type="' + type + '" data-team-id="' + teamId + '"><i class="icon icon-plus"></i><p></p></li>';
							}
							for (var i = 0, l = members.length; i < l; ++i) {
								var member = members[i],
									uid = member.account || member.uid,
									user = that.getUserById(uid),
									nick = user.nick;
								html += '<li data-uid="' + uid + '"><a href="javascript:;"><img src="'+getAvatar(user.avatar)+'"/>';
								if (member.type === 'owner') {
									html += '<i class="icon radius-circle icon-user"></i>';
								} else {
									html += '<span class="hover" data-nick="' + nick + '" data-team-name="' + teamName + '" data-uid="' + uid + '" data-team-id="' + teamId + '">移除</span>';
								}
								html += '</a><p class="text">' + nick + '</p></li>';
							}
							$userList.html(html);
							if (type === 'normal' || teamOwner === userUID) {
								$teamName.addClass('owner');
							}
							if (teamOwner === userUID) {
								$userList.addClass('owner');
							}
						}
						for(var i = 0;i<members.length;i++){
							if(!that.getUserById(members[i].account)){
								array.push({uid:members[i].account})
							};
						}
						if(array.length>0){
							yunXin.getUser(array,function(data){
								for(var j = 0;j<data.list.length;j++){
									that.cache.updatePersonlist(data.list[j]);
								}
								showUI();
							})
						}else{
							showUI();
						}
						
					} else {
						console && console.error('获取群成员失败');
					}
				}
			});
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
			if (x.type > y.type) {
				return -1;
			} else {
				return 1;
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
		if (teamType === 'normal') {
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
		} else { // 高级群
			this.sdk.removeMembers({
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
		}
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

	exitTeam: function() {	// 普通群（任何人）/高级群（非群主），退出群
		var that = this,
			teamId = this.$teamInfo.data('team-id'),
			type = $('.team li.active').data('gtype'),
			$team = $('#j-teams .' + type + '-team');
		this.sdk.leaveTeam({
			teamId: teamId,
			done: function(error, params) {
				if (!error) {
					$('#j-chatEditor').data({to:""});
					that.$teamInfoContainer.addClass('hide');
					that.$rightPanel.addClass('hide');
					removeChatVernier(teamId);
				} else {
					console && console.error(error);
					alert('退群失败');
				}
			}
		});
	},

	closeTeamPanel: function() {	// 返回到群聊天面板
		this.$teamInfoContainer.addClass('hide');
		this.$mask.addClass('hide');
	}
};

