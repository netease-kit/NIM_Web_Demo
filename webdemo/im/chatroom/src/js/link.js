/**
 * 聊天室连接相关
 */

var LinkRoom = function (ctr,data) {
    var that = this,
        info = data;
    this.data = {};
    this.data.person={};
    this.nick = info.chatroomNick;
    this.account = info.account;
    this.ctr = ctr;

    //拿连接room的地址
    $.ajax({
        url: CONFIG.url+"/api/chatroom/requestAddress",
        contentType:"application/json",
        type: 'POST',
        beforeSend: function (req) {
            req.setRequestHeader('appkey', CONFIG.appkey);
        },
        data:JSON.stringify({
            roomid:info.id,
            uid:info.account
        })
    }).done(function(data) {
        if(data.res===200){
           that.address = data.msg.addr;
           doLink(info);
        }else{
            alert("获取连接房间地址失败");
        }   
    })
    //连接link
    var doLink = function(data){
        that.room = new SDK.Chatroom({
            appKey: data.appKey,
            account: data.account,
            token: data.token,
            chatroomId: data.id,
            chatroomAddresses: that.address,
            onconnect:function(msg) {
                $("#room .j-chat").html("");
                that.data.roomInfo = msg.chatroom;
                that.data.person[that.account] = msg.member;
                that.getHistoryMsgs(cbGetHistoryMsgs.bind(that));
                that.ctr.initReady(msg);
            },
            onmsgs:function(msgs){
                that.ctr.buildChat(msgs,'msgs');
            },
            onerror: function(error, obj){
                $("#linkStatus").text("连接已断开").removeClass("hide");
                $("#room .j-chat").html("");
                console.log('发生错误', error, obj);
            },
            onwillreconnect: function(obj){
                $("#linkStatus").text("重连中。。。").removeClass("hide");
                // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
                console.log('即将重连', obj);
            },
            ondisconnect: function(error) {
                $("#linkStatus").text("连接已断开").removeClass("hide");
                // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                console.log('连接断开', error);
                if (error) {
                    switch (error.code) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                    case 302:
                        break;
                    case 13003:
                        $("#linkStatus").text("抱歉，你已被主播拉入了黑名单");
                        break;
                    // 被踢, 请提示错误后跳转到登录页面
                    case 'kicked':
                        if(error.reason==="managerKick"){
                            util.setCookie("kickReason",'你已被管理员移出|'+that.data.roomInfo.name);   
                        }else if(error.reason==="blacked"){
                             util.setCookie("kickReason",'你已被管理员拉入黑名单，不能再进入|'+that.data.roomInfo.name); 
                        }
                        location.href="./list.html";
                        break;
                    default:
                        console.log(error.message);
                        break;
                    }
                }
            }
        }) 
    }
    

    var cbGetHistoryMsgs = function(err,data){
        if(!err){
           that.ctr.buildChat(data.msgs,'historyMsgs');
        }else{
            alert(err);
        }
    }  
};
var LinkRoomFn = LinkRoom.prototype;
/**
 * 发送文本
 * @param  {String}   text     内容
 * @param  {String}   custom   扩展字段json序列化{type:0} 0游客，1正常 2房主 3管理员 4受限制的
 * @param  {Function} callback 回调
 * @return {void}         
 */
LinkRoomFn.sendText = function(text,callback){
    var type = util.parseMemberType(this.data.person[this.account]);
    this.room.sendText({
        custom:JSON.stringify({type:type}),
        text:text,
        done:callback
    })
}

/**
 * 发送自定义消息
 * @param  {Object}   content   自定义消息内容
 * @param  {String}   custom   扩展字段json序列化{type:0} 0游客，1正常 2房主 3管理员 4受限制的
 * @param  {Function} callback  回调
 * @return {void}         
 */
LinkRoomFn.sendCustomMessage = function (content , callback) {
    var type = util.parseMemberType(this.data.person[this.account]);
    this.room.sendCustomMsg({
        custom:JSON.stringify({type:type}),
        content: JSON.stringify(content),
        done: callback
    });
};

/**
 * 获取聊天室成员
 * @param  {Boolean}   guest  true获取游客 false固定成员
 * @param  {Int}   time   上一个记录的时间戳 0为当前
 * @param {Int} limit 限制
 * @param  {Function} callback 回调
 * @return {Void} 
 */
LinkRoomFn.getChatroomMembers = function(guest,time,limit,callback){
    this.room.getChatroomMembers({
        guest: guest,
        time: time,
        onlyOnline:true,
        limit: limit,
        done: callback
    });
}

/**
 * 获取历史消息
 * @param  {Function} callback 回调
 * @return {Void} 
 */
LinkRoomFn.getHistoryMsgs = function(callback){
    this.room.getHistoryMsgs({
        limit: 10,
        done: callback
    });   
}

/**
 * 踢人
 * @param  {string}   account   账号
 * @param  {Function} callback 回调
 * @return {Void} 
 */
LinkRoomFn.kickChatroomMember = function(account,callback){
    this.room.kickChatroomMember({
        account:account,
        done: callback
    });
}
/**
 * 标记黑名单
 * @param  {string}   account  账号
 * @param  {Boolean}  isAdd    添加移除
 * @param  {Function} callback 回调
 * @return {void}           
 */
LinkRoomFn.markChatroomBlacklist = function(account,isAdd,callback){
    this.room.markChatroomBlacklist({
        account: account,
        isAdd: isAdd,
        done: callback
    });    
}
/**
 * 标记禁言名单
 * @param  {string}   account  账号
 * @param  {Boolean}  isAdd    添加移除
 * @param  {Function} callback 回调
 * @return {void}           
 */
LinkRoomFn.markChatroomGaglist = function(account,isAdd,callback){
    this.room.markChatroomGaglist({
        account: account,
        isAdd: isAdd,
        done: callback
    });    
}
/**
 * 标记管理员
 * @param  {string}   account  账号
 * @param  {Boolean}  isAdd    添加移除
 * @param  {Function} callback 回调
 * @return {void}           
 */
LinkRoomFn.markChatroomManager = function(account,isAdd,callback){
    this.room.markChatroomManager({
        account: account,
        isAdd: isAdd,
        done: callback
    });    
}
/**
 * 设置聊天室成员等级
 * @param  {string}   account  账号
 * @param  {Boolean}  level    等级
 * @param  {Function} callback 回调
 * @return {void}           
 */
// LinkRoomFn.markChatroomCommonMember = function(account,level,callback){
//     this.room.markChatroomCommonMember({
//         account: account,
//         level:level,
//         done: callback
//     });    
// }
/**
 * 处理菜单命令
 * @param  {Int} type    类型
 * @param  {String} account 账号
 * @param  {Object} data    成员信息
 * @return {Void}      
 */
LinkRoomFn.dealCommand = function(type,account,data){
    var isadd = true;
    var callback = function(err,data){
        if(err){
            alert(err);
        }
    }
    switch(type){
        case "0":
            this.kickChatroomMember(account,callback);
            break;
        case "1":
            if(data.account){
                isadd = !data.gaged;
            }
            this.markChatroomGaglist(account,isadd,callback);
            break;
        case "2":
            if(data.account){
                isadd = !data.blacked;
            }
            this.markChatroomBlacklist(account,isadd,callback);
            break;
        case "3":
             if(data.account){
                isadd = !(data.type==="manager");
            }
            this.markChatroomManager(account,isadd,callback);
            break;
        default:
            break;
    }
}
/**
 * 获取聊天室群成员信息
 * @param  {Array}   account  需要获取信息的成员队列
 * @param  {Function} callback 回调方法
 * @return {void}            
 */
LinkRoomFn.getChatroomMembersInfo = function(account,callback){
    this.room.getChatroomMembersInfo({
        accounts: account,   
        done: callback
    });
}
 
