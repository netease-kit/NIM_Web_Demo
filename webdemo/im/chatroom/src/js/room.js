/**
 * 聊天室逻辑
 */
var page = {
	init:function () {
		var options= {
			appKey: CONFIG.appkey,
	        account: util.readCookie("uid"),
	        id: util.getIdTag(),
	        token: util.readCookie("sdktoken"),
	        chatroomNick:util.readCookie("nickName"),
	        chatroomAvatar:util.readCookie("avatar")
    	}
    	this.account = util.readCookie("uid");
    	this.offsetTime = 0;
    	this.initNode();
    	this.initEmoji();
		this.initEvt();
		var link = this.link = window.link =new LinkRoom(this,options);
		this.data = link.data;
		this.initVideo();
		
	},
	//sdk连接后初始化页面
	initReady:function(data){
		var chatroom = data.chatroom,
			member = data.member,
			total,
			that = this;
		$("#linkStatus").addClass("hide");
		//聊天室信息
		$("#roomTitle").text(chatroom.name);
		this.link.getChatroomMembersInfo([chatroom.creator],function(err,item){
			// 缓存起来说不定以后要用
			if(!that.data.person[item.members[0].account]){
				that.data.person[item.members[0].account] = item.members[0];
			}
			$("#roomCreator").text(item.members[0].nick);
			$("#roomAvatar")[0].src=util.getAvatar(item.members[0].avatar);
		})
		if(chatroom.onlineMemberNum > 10000){
			var value = new Number(chatroom.onlineMemberNum/10000);
			total = value.toFixed(1)+"万";
		}else{
			total = chatroom.onlineMemberNum;
		}
		$("#roomOnlineMemberNum").text(total);
		$("#roomAnnouncement").text(chatroom.announcement||"暂无公告");
		// 设置我的权限
		this.setMyRole();
	},
	initNode:function(){
		this.$tab = $("#room .j-tab");
		this.$pannel = $("#room .j-pannel");
		this.$customBtn =$("#customBtn");
		this.$chat = $("#room .j-chat");
		this.$member = $("#room .j-member");
		this.$more = $("#room .j-more");
		this.$menu = $("#menu");
		this.$showEmoji = $("#emoji");
		this.$sendText = $("#sentText");
		this.$editText = $("#editText");
	},
	initEvt:function(){
		var that = this;
		this.$tab.on("click",this.switchTab.bind(this));
		this.$sendText.on("click",this.sendText.bind(this));
		this.$editText.keydown(function (e) {
			if (e.ctrlKey && e.keyCode == 13) {
				that.sendText();
			}
		});
		this.$more.on("click",this.loadMoreMembers.bind(this));
		this.$customBtn.on("click",this.showLaowang.bind(this));
		this.$chat.delegate(".j-nick","click",this.showMenu.bind(this));
		this.$menu.mouseleave(this.hideMenu.bind(this));
		this.$menu.delegate(".j-item","click",this.dealCommand.bind(this));
		this.$showEmoji.on('click', this.showEmoji.bind(this)); 
	},
	//目前图片写死代替
	initVideo:function(){
		$("#video")[0].src = "./images/image"+util.getIdTag()+".jpg";
		$("#video").removeClass("hide");
	},
	initEmoji:function(){
        var that = this,
            emojiConfig = {
            'emojiList':emojiList,  //普通表情
            'width': 350,
            'height':300,
            'imgpath':'./images/',     
            'callback':function(result){        
                that.cbShowEmoji(result);
            }
        }
        this.$emNode = new CEmojiEngine($('#emojiTag')[0],emojiConfig); 
    },
    setMyRole:function(){
    	var member = this.data.person[this.account];
    	if(member.type ==='owner'){
			this.$chat.addClass("owner");
			this.$menu.addClass("owner");
			this.myRole = 3;
		}else if(member.type==='manager'){
			this.myRole = 2;
			this.$chat.addClass("manager");
		}else{
			this.myRole = 1;
			this.$chat.removeClass("manager");
		}
    },
    //切换tab
	switchTab:function(evt){
		if($(evt.target).attr("data-value")!==$("#room .j-tab.crt").attr("data-value")){
			//点击在线成员重新拉下名单
			if($(evt.target).attr("data-value")==="member"){
				this.link.getChatroomMembers(false,0,20,this.cbGetChatroomMembers.bind(this));
			}else{
				this.$pannel.toggleClass("hide");
				this.$tab.toggleClass("crt");		
			}

		}
	},
	// 拉取固定成员回调
	cbGetChatroomMembers:function(err,data){
        if(!err){
        	// 渲染列表
           this.buildChatMember(data.members);
        }else{
            alert(err);
        }
    },
    //发送自定义消息（定义好data格式与解析方式，实现自定义的消息比如猜拳，送花等）
	showLaowang:function(){
		var content ={
			type:1,
			data:{
				value:Math.ceil(Math.random()*3)
			}
		};
		this.link.sendCustomMessage(content,function(err,data){
			if(err){
				alert(err.message);
			}else{
				this.buildChat([data],"msgs");
			}
		}.bind(this))
	},
	// 操作菜单
	showMenu:function(evt){
		var that = this,
			info,
			type = evt.currentTarget.getAttribute("data-role"),
			ownerOperate = (that.myRole===3&&type!=="owner"),
			account = that.crtAccount = evt.currentTarget.getAttribute("data-account");
			managerOperate = (that.myRole===2&&type!=="owner");
		if(account===this.account){
			return;
		}
		var show = function(item){
			if(item.account){
				that.$menu.find(".j-gag").text(item.gaged?"解除禁言":"禁言");
				that.$menu.find(".j-black").text(item.blacked?"解除拉黑":"拉黑该用户");
				that.$menu.find(".j-admin").text(item.type==="manager"?"解除管理员":"任命管理员");
			}
			if(!ownerOperate&&item.type&&item.type==="manager"){
				return;
			}
			if(ownerOperate||managerOperate){
				var x = evt.clientX+(window.scrollX||window.pageXOffset),
				 	y = evt.clientY+(window.scrollY||window.pageYOffset);
				that.$menu.css({"top":y-10,"left":x-10,"display":"block"});			
			}		
		}	
		if(this.data.person[account]){
			info = this.data.person[account];
			show(info);
		}else{
			this.link.getChatroomMembersInfo([account],function(err,data){
				if(!err){
					var member;
		           if(data.members.length){
		           		info = that.data.person[account] = data.members[0];
		           		show(info)
		           }else{
		           		info = that.data.person[account] = {};
		           		show(info);
		           }
		        }else{
		            alert(err);
		        }
			})
		}
	},
	hideMenu:function(){
		this.crtAccount = null;
		this.$menu.css("display","none");
		this.$menu.find(".j-gag").text("禁言");
		this.$menu.find(".j-black").text("拉黑该用户");
		this.$menu.find(".j-admin").text("任命管理员");	
	},
	dealCommand:function(evt){
		var type = evt.target.getAttribute("data-type"),
			that = this,
			account = this.crtAccount;
		if(account){
			this.link.dealCommand(type,account,this.data.person[account]);
		}
		this.crtAccount = null;
		that.$menu.css("display","none");
	},
	showEmoji:function(){
		this.$emNode._$show();
	},
	cbShowEmoji:function(data){
		this.$editText.val(this.$editText.val()+data.emoji);
	},
	sendText:function(){
		var text = this.$editText.val().trim();
	 	if (text.length > 500) {
            alert('消息长度最大为500字符');
        }else if(text.length===0){
        	return;
        }else{
			this.link.sendText(text,function(err,data){
				if(err){
					alert(err.message);
				}else{
					this.$editText.val("");
					this.buildChat([data],"msgs");
				}
			}.bind(this))
        }
	},
	// 聊天页面绘制
	buildChat:function(data,type){
		var html="",
			item,
			prepend = false;
		data.sort(function(a,b){
			return a.time - b.time;
		});
		if(type==="msgs"){
			for (var i = 0;i < data.length;i++) {
				item = data[i];
				if(this.$chat.find('.item[data-id="'+item.idClient+'"]').length){
					continue;
				}
				if(item.type!=="notification"){
					html += this.buildMsgUI(item);		
				}else{
					//对于系统通知，更新下用户信息的状态
					if(item.attach.type==="blackMember"||item.attach.type==="unblackMember"||item.attach.type==="gagMember"||item.attach.type==="ungagMember"||item.attach.type==="addManager"||item.attach.type==="removeManager"){
						this.updatePersonInfo(item.attach.to[0]);	
					}
					html += this.buildSysMsgUI(item);
				}
			}
			this.$chat.append(html);
		}else{
			// 历史消息
			for (var i = 0;i < data.length;i++) {
				item = data[i];
				if(this.$chat.find('.item[data-id="'+item.idClient+'"]').length){
					continue;
				}
				if(item.type!=="notification"){
					html += this.buildMsgUI(item);				
				}else{
					html += this.buildSysMsgUI(item);
				}	
			}
			this.$chat.prepend(html);
		}	
		//这里可以做是否自动滚动的效果 
		this.scrollToBottom();
	},
	//消息UI绘制
	buildMsgUI:function(item){
		var info = item.custom?JSON.parse(item.custom):{},
			type = util.parseMemberTypeToString(info.type),
			role = type==="owner"||type==="manager",
			roleClass = role?"roles":"";
		return ['<div class="item" data-id="'+item.idClient+'">',
					'<p class="nick '+type+' j-nick '+roleClass+'" data-role="'+type+'" data-account="'+item.from+'">'+((type==="owner"||type==="manager")?'<b class="role role-'+type+'"></b>':"")+item.fromNick+'</p>',
					'<p class="text">'+util.buildMsg(item)+'</p>',
				'</div>'].join("");
	},
	//系统消息UI绘制
	buildSysMsgUI:function(item){
		return ['<div class="item" data-id="'+item.idClient+'">',
					'<p class="text sys">'+util.buildSysMsg(item)+'</p>',
				'</div>'].join("");
	},
	//成员列表UI绘制
	buildChatMemberUI:function(data){
		var type = data.type;
		return  ['<div class="item" data-id="'+data.account+'">',
						'<div class="avatar">',
							'<img src="'+util.getAvatar(data.avatar)+'"/>',
						'</div>',
						'<div class="nick">'+data.nick+'</div>',
						(type==="owner"||type==="manager")?'<b class="role role-'+type+'"></b>':'',
					'</div>'].join("");
	},
	//显示在线成员逻辑
	buildChatMember:function(data){
		this.memberCount = 0;
		this.offsetTime = 0;
		this.loadGuest = false;
		var that = this;
		//列表数据，是否是游客
		this.$member.html(this.buildFixedMemberList(data));
		//有数据在切换列表
		this.$pannel.toggleClass("hide");
		this.$tab.toggleClass("crt");

		if(this.memberCount<20){
			this.nextLoadGuest();
		}			
	},
	nextLoadGuest:function(){
		var that = this;
		this.loadGuest = true;
		this.offsetTime = 0;
		this.link.getChatroomMembers(true,this.offsetTime,20-this.memberCount,function(err,data){
			if(!err){
	           	var members = data.members;
	           	if(members.length<(20-that.memberCount)){
					$(".j-more").addClass("hide");
				}else{
					$(".j-more").removeClass("hide");
				}
           		that.$member.append(that.bulidGuestList(members));
	        }else{
	            alert(err);
	        }
		});
	},
	//渲染固定成员列表
	buildFixedMemberList:function(data){
		var html ="",
			html1="",
			html2 ="",
			html3 ="",
			temp,
		    item;
		for (var i = 0;i<data.length;i++) {
			if(i===0){
				this.offsetTime = data[i].updateTime;
			}
			item = data[i];
			this.data.person[item.account] = item;
			if(item.type==="owner"){
				html += this.buildChatMemberUI(item);	
			}else if(item.type==="manager"){
				html1 += this.buildChatMemberUI(item);	
			}else if(item.type==="common"){
				html2 += this.buildChatMemberUI(item);	
			}else{
				html3 += this.buildChatMemberUI(item);	
			}
			this.memberCount++;
		}
		temp = '<div class="j-ownerList">'+html+'</div>'+'<div class="j-managerList">'+html1+'</div>'+'<div class="j-normalList">'+html2+'</div>'+'<div class="j-otherList">'+html3+'</div>';
		return temp;	
	},
	// 渲染游客列表
	bulidGuestList:function(data){
		var html ="",
		    item,
		    temp;
		for (var i = 0;i<data.length;i++) {
			if(i===data.length-1){
				this.offsetTime = data[i].enterTime;
			}
			item = data[i];
			this.data.person[item.account] = item;
			html += this.buildChatMemberUI(item);
			this.memberCount++;
		}
		temp ='<div class="j-guestList">'+html+'</div>'
		return temp;	
	},
	// 更新成员信息
	updatePersonInfo:function(account){
		var that = this;
		this.link.getChatroomMembersInfo([account],function(err,data){
			if(!err){
				var member;
				if(data.members.length){
					that.data.person[account] = data.members[0];
				}else{
					that.data.person[account] = {};
				}
				if(that.account===account){
					that.setMyRole();
				}
			}else{
				alert(err);
			}
		})
	},
	//更新聊天室成员UI（通知消息进入出去）（干掉了，根据消息去画不如点击重新去拉）
	// updateMemberUI:function(account,type){	
	// 	var that = this;
	// 	if(type==="in"){
	// 		if(!this.data.person[account]){
	// 			this.link.getChatroomMembersInfo([account],function(err,items){
	// 				// 缓存起来说不定以后要用
	// 				if(!err){
	// 					that.data.person[items.members[0].account] = items.members[0];
	// 					var item = that.$member.find(".item[data-id="+account+"]");
	// 					if(item.length){
	// 						item.removeClass("hide");
	// 					}else{
	// 						that.$member.append(that.buildChatMemberUI(items.members[0]));
	// 					}			
	// 				}else{
	// 					alert(err);
	// 				}
	// 			})		
	// 		}else{
	// 			var item = that.$member.find(".item[data-id="+account+"]");
	// 			if(item.length){
	// 					item.removeClass("hide");
	// 			}else{
	// 				that.$member.append(that.buildChatMemberUI(this.data.person[account]));
	// 			}
	// 		}
	// 	}else{
	// 		that.$member.find(".item[data-id="+account+"]").addClass("hide");
	// 	}	
	// },
	
	// 加载跟多成员
	loadMoreMembers:function(){
		this.link.getChatroomMembers(this.loadGuest,this.offsetTime,20,this.cbLoadMoreMembers.bind(this));
	},
	cbLoadMoreMembers:function(err,data){
		if(!err){
			var html = "",
				members = data.members,
				$ownerList = this.$member.find(".j-ownerList"),
				$managerList = this.$member.find(".j-managerList"),
				$normalList = this.$member.find(".j-normalList"),
				$otherList = this.$member.find(".j-otherList"),
				$guestList = this.$member.find(".j-guestList"),
		    	item;
			for (var i = 0;i<members.length;i++) {
				if(i===members.length-1){
					this.offsetTime = members[i].enterTime;
				}
				item = members[i];
				this.data.person[item.account] = item;
				if(item.type==="owner"){
					$ownerList.append(this.buildChatMemberUI(item));	
				}else if(item.type==="manager"){
					$managerList.append(this.buildChatMemberUI(item));	
				}else if(item.type==="common"){
					$normalList.append(this.buildChatMemberUI(item));	
				}else{
					$guestList.append(this.buildChatMemberUI(item));
				}
			}
			if(members.length<20){
				if(!this.loadGuest){
					this.nextLoadGuest();
				}else{
					$(".j-more").addClass("hide");
				}
			}else{
				$(".j-more").removeClass("hide");
			}
		}else{
			alert(err);
		}
	},
	// 来消息是否滚动 可以设置一个开关在这个函数实现逻辑
	scrollToBottom:function(){
		if(true){
			this.$chat.scrollTop(99999);	
		}
	}
};
page.init();