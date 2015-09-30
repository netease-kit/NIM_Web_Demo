var appUI = {
    /**
     * 当前会话聊天面板UI
     */
    buildChatContentUI:function(to,cache){
    	var msgHtml = "",
    		msgs = cache.getMsgs(to);
    	if(msgs.length===0){
    		 msgHtml = '<div class="no-msg tc"><span class="radius5px">暂无消息</span></div>';
    	}else{
    		for (var i = 0, l = msgs.length; i < l; ++i) {
			 	var message = msgs[i],
					user = cache.getUserById(message.from);
				//消息时间显示
			 	if(i == 0){
                        msgHtml += this.makeTimeTag(transTime(message.time));
                }else{
                    if(message.time-msgs[i-1].time>5*60*1000){
                        msgHtml += this.makeTimeTag(transTime(message.time));
                    }
                }
                msgHtml+=this.makeChatContent(message,user); 	        
            }
        }
        return msgHtml;
    },

    /**
     * 更新当前会话聊天面板UI
     */
    updateChatContentUI:function(msg,cache){
	 	var lastItem =$("#j-chatContent .item").last(),
        	msgHtml="",
        	user =cache.getUserById(msg.from);
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
		if (message.attach && message.attach.type) {
                var notificationText = transNotification(message);
                msgHtml =  '<p class="u-notice tc item" data-time="'+ message.time +'" data-id="'+ message.idClient +'" data-idServer="'+ message.idServer +'"><span class="radius5px">'+notificationText+'</span></p>';
        }else{	
			//聊天消息
			var type = message.type,
				from = message.from,
                avatar = user.avatar,
				showNick = message.scene === 'team' && from !== userUID,
				fromNick = message.fromNick || user.nick;
			msgHtml = ['<div data-time="'+ message.time +'" data-id="'+ message.idClient +'" data-idServer="'+ message.idServer +'" class="item item-' + buildSender(message) + '">',
						'<img class="img j-img" src="'+getAvatar(avatar)+'" data-account="' + from + '"/>',
						showNick?'<p class="nick">' + fromNick + '</p>':'',
						'<div class="msg msg-text">',
							'<div class="box">',
								'<div class="cnt">',
									getMessage(message),
								'</div>',
							'</div>',
						'</div>',
						message.status === -1?'<span class="error"><i class="icon icon-error"></i>发送失败</span>':'',
					'</div>'].join('');    
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
        return ['<li data-icon="' + list.avatar + '" data-uid="' + list.account + '" data-account="' + list.nick + '">',
                    '<i class="icon icon-radio"></i>',
                    '<img src="'+getAvatar(list.avatar)+'">',
                    '<span class="name">' + list.nick + '</span>',
                '</li>'].join('');
    },
    buildBlacklist:function(data,cache){
        var html="";
        if(data.length===0){
            return '';
        }
        for(var i = 0;i<data.length;i++){
            var user = cache.getUserById(data[i]); 
            html += ['<li class="items f-cb">',
                        '<img src="'+getAvatar(user.avatar)+'" class="head">',
                        '<span class="nick">'+user.nick+'</span>',
                        '<button class="btn radius4px btn-ok j-rm" data-id="'+user.account+'">解除</button>',
                    '</li>'].join('');
        }
        return html;
    },
    //聊天消息中的时间显示
    makeTimeTag : function(time){
    	return '<p class="u-msgTime">- - - - -&nbsp;'+time+'&nbsp;- -- - -</p>';
	}

}