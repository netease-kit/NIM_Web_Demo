var appUI = {
    /**
     * 当前会话聊天面板UI
     */
    buildChatContentUI:function(id,cache){
    	var msgHtml = "",
    		msgs = cache.getMsgs(id);
    	if(msgs.length===0){
    		 msgHtml = '<div class="no-msg tc"><span class="radius5px">暂无消息</span></div>';
    	}else{
    		for (var i = 0, l = msgs.length; i < l; ++i) {
			 	var message = msgs[i],
					user = cache.getUserById(message.from);
                if(message.attach && message.attach.netcallType !== undefined && ( message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) {
                    // 隐藏掉netcall相关的系统消息
                    continue;
                }
				//消息时间显示
			 	if(i == 0){
                        msgHtml += this.makeTimeTag(transTime(message.time));
                }else{
                    if(message.time-msgs[i-1].time>5*60*1000){
                        msgHtml += this.makeTimeTag(transTime(message.time));
                    }
                }
                msgHtml += this.makeChatContent(message,user); 	        
            }
        }
        return msgHtml;
    },

    /**
     * 更新当前会话聊天面板UI
     */
    updateChatContentUI:function(msg,cache){
	 	var lastItem =$("#chatContent .item").last(),
        	msgHtml="",
        	user =cache.getUserById(msg.from);
	 	var message = msg;
        if(message.attach && message.attach.netcallType !== undefined && ( message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) return ''; // 隐藏掉netcall相关的系统消息
        if(lastItem.length==0){
            msgHtml += this.makeTimeTag(transTime(msg.time));
        }else{
            if(msg.time-parseInt(lastItem.attr('data-time'))>5*60*1000){
                msgHtml += this.makeTimeTag(transTime(msg.time));
            }
        }
        msgHtml += this.makeChatContent(msg,user);
        return msgHtml;
    },

    /**
     * 通用消息内容UI
     */
    makeChatContent:function(message,user){
    	var msgHtml;
    	//通知类消息

		if (message.attach && message.attach.type && (message.attach.netcallType === undefined || (message.attach.type !== "netcallBill" && message.attach.type !== "netcallMiss"))) {
            if(message.attach.netcallType !== undefined) return ''; // 隐藏掉netcall相关的系统通知消息
                var notificationText = transNotification(message);
                msgHtml =  '<p class="u-notice tc item" data-time="'+ message.time +'" data-id="'+ message.idClient +'" data-idServer="'+ message.idServer +'"><span class="radius5px">'+notificationText+'</span></p>';
        }else{	
			//聊天消息
			var type = message.type,
				from = message.from,
                avatar = user.avatar,
				showNick = message.scene === 'team' && from !== userUID,
                msgHtml;
            if(type==="tip"){
                msgHtml = ['<div data-time="'+ message.time +'" data-id="'+ message.idClient +'" id="'+ message.idClient +'" data-idServer="'+ message.idServer +'">',
                                '<p class="u-notice tc item '+ (from == userUID&&message.idServer ? "j-msgTip":"") +'" data-time="'+ message.time +'" data-id="'+ message.idClient +'" data-idServer="'+ message.idServer +'"><span class="radius5px">'+getMessage(message)+'</span></p>',
                            '</div>'].join('');
            }else{
    			msgHtml = ['<div data-time="'+ message.time +'" data-id="'+ message.idClient +'" id="'+ message.idClient +'" data-idServer="'+ message.idServer +'" class="item item-' + buildSender(message) + '">',
    						'<img class="img j-img" src="'+getAvatar(avatar)+'" data-account="' + from + '"/>',
    						showNick?'<p class="nick">' + getNick(from) + '</p>':'',
    						'<div class="msg msg-text j-msg">',
    							'<div class="box">',
    								'<div class="cnt">',
    									getMessage(message),
    								'</div>',
    							'</div>',
    						'</div>',
    						message.status === "fail"?'<span class="error j-resend" data-session="'+ message.sessionId +'" data-id="'+ message.idClient +'"><i class="icon icon-error"></i>发送失败,点击重发</span>':'',
                           '<span class="readMsg"><i></i>已读</span>',
    					'</div>'].join('');           
            }
        }
        return msgHtml;
			
    },

    /**
     * 云记录面板UI
     */
    buildCloudMsgUI:function(msg,cache){
         var msgHtml = '',
            len = msg.length,
            meessage;
        for (var i = len - 1; i >= 0; --i) {
            message = msg[i];
            if(i == (len -1)){
                msgHtml += this.makeTimeTag(transTime(message.time));
            }else{
                if(message.time-msg[i+1].time>5*60*1000){
                    msgHtml += this.makeTimeTag(transTime(message.time));
                }
            }
            msgHtml += this.makeChatContent(message,cache.getUserById(message.from))
        }
        return msgHtml;
    },

    /**
     * 群成员列表
     */
    buildTeamMemberList:function(list){
        return ['<li data-icon="' + list.avatar + '" data-account="' + list.account + '" data-account="' + list.nick + '">',
                    '<i class="icon icon-radio"></i>',
                    '<img src="'+getAvatar(list.avatar)+'">',
                    '<span class="name">' + getNick(list.account) + '</span>',
                '</li>'].join('');
    },

    /**
     * 黑名单
     */
    buildBlacklist:function(data,cache){
        var html="";
        if(data.length===0){
            return '';
        }
        for(var i = 0;i<data.length;i++){
            var user = cache.getUserById(data[i].account); 
            html += ['<li class="items f-cb">',
                        '<img src="'+getAvatar(user.avatar)+'" class="head">',
                        '<span class="nick">'+user.nick+'</span>',
                        '<button class="btn radius4px btn-ok j-rm" data-id="'+user.account+'">解除</button>',
                    '</li>'].join('');
        }
        return html;
    },

    /**
     * 系统消息
     */
    buildSysMsgs:function(data,cache){
        var html="",
            item,
            team,
            action,
            content;
        if(data.length===0){
            return '';
        }
        for(var i = 0;i<data.length;i++){
            item = data[i];
            if(item.category=="team"){     
                team = item.attach?item.attach.team:cache.getTeamMapById(item.to);
                //拿不到群信息就过滤吧
                if(!team){
                    continue;
                }
                if(item.type==="teamInvite"){
                    content = getNick(item.from) + "邀请你入群";
                    if(item.state ==="init"){
                        action = '<a class="j-apply">同意</a><a class="j-reject">拒绝</a>';
                    }else if(item.state==="rejected"){
                        action = '已拒绝'; 
                    }else if(item.state==="passed"){
                        action = '已同意';
                    }else{
                        action = '已失效';
                    }
                }else if(item.type==="applyTeam"){
                    content = getNick(item.from)+ "申请加入群";
                    if(item.state ==="init"){
                        action = '<a class="j-apply">同意</a><a class="j-reject">拒绝</a>';
                    }else if(item.state==="rejected"){
                        action = '已拒绝'; 
                    }else if(item.state==="passed"){
                        action = '已同意';
                    }else{
                        action = '已失效';
                    }
                }else if(item.type==="rejectTeamApply"||item.type==="rejectTeamInvite"){
                    content = getNick(item.from) + "拒绝了你的入群邀请";
                    action = '已拒绝';;
                }else{
                     content ="未知";
                     action = "";
                }
                html += ['<div class="item">',
                            '<img src="images/advanced.png">',
                            '<div class="text">',
                                '<p><span>'+(team?team.name:item.to)+'</span><b class="time">'+transTime2(item.time)+'</b></p>',
                                '<p><span class="first-msg">'+content+'</span><b class="action" data-type="'+item.type+'" data-idServer="'+item.idServer+'" data-id="'+team.teamId+'" data-from="'+item.from+'">'+action+'</b></p>',
                            '</div>',
                        '</div>'].join('');            
            }else if(item.category=="friend"){
                //处理好友的系统通知
                //本demo为了方便演示默认加好友直接通过，好友的系统通知不处理
            }
        }
        return html;
    },
    // 自定义系统通知
    buildCustomSysMsgs:function(data,cache){
        var html = "",
            content,
            from,
            scene,
            to,
            nick,
            avatar;
        if(data.length===0){
            return html;
        }
        data = data.sort(function(a,b){
            return b.time-a.time;
        });
        for(var i = 0;i<data.length;i++){
            scene = data[i].scene;
            content = JSON.parse(data[i].content).content;
            from = data[i].from;
            to = data[i].to;
            if(scene==="p2p"){
                nick = getNick(from);
                avatar = getAvatar(cache.getUserById(from)?cache.getUserById(from).avatar:"");
            }else{
                var teamInfo = cache.getTeamById(to+"");
                if(teamInfo){
                    nick = teamInfo.name+"-->"+getNick(from);
                    avatar = "images/"+teamInfo.type+".png";
                }else{
                    nick = to+"-->"+getNick(from);
                    avatar = "images/normal.png";
                }   
            }
            html += ['<div class="item">',
                            '<img src="'+avatar+'">',
                            '<div class="text">',
                                '<p><span>'+nick+'</span><b class="time">'+transTime2(data[i].time)+'</b></p>',
                                '<p><span class="first-msg">'+content+'</span></p>',
                            '</div>',
                        '</div>'].join('');    
        }
        return html;
    },
    //聊天消息中的时间显示
    makeTimeTag : function(time){
    	return '<p class="u-msgTime">- - - - -&nbsp;'+time+'&nbsp;- -- - -</p>';
	}

}