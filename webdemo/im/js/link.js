/**
 * SDK连接 功能相关
 */

var SDKBridge = function (ctr,data) {
  var sdktoken = readCookie('sdktoken'),
    userUID = readCookie('uid'),
    that = this;
  if(!sdktoken){
      window.location.href = './index.html';
      return;
  }
  //缓存需要获取的用户信息账号
  this.person = {};
  //缓存需要获取的群组账号
  this.team =[];
  this.person[userUID] = true;
  this.controller = ctr;
  this.cache = data;
  window.nim = ctr.nim = this.nim = new SDK.NIM({
    //控制台日志，上线时应该关掉
    debug: true || { api: 'info', style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)' },
        promise: true,
        appKey: CONFIG.appkey,
        account: userUID,
        token: sdktoken,
        // syncSessionUnread: true,
        //连接
        onconnect: onConnect.bind(this),
        ondisconnect: onDisconnect.bind(this),
        onerror: onError.bind(this),
        onwillreconnect: onWillReconnect.bind(this),
        // 多端登录变化
        onloginportschange:onLoginPortsChange.bind(this),
        // 群
        onteams: onTeams.bind(this),
        syncTeamMembers: false,//全成员先不同步了
        // onupdateteammember: onUpdateTeamMember.bind(this),
        // onteammembers: onTeamMembers.bind(this),
        //消息
        onmsg: onMsg.bind(this), 
        onroamingmsgs: saveMsgs.bind(this),
        onofflinemsgs: saveMsgs.bind(this),
        //会话
        // 同步会话未读数
        syncSessionUnread: true,
        onsessions: onSessions.bind(this),
        onupdatesession: onUpdatesession.bind(this),
      //同步完成
        // onsyncteammembersdone: onSyncTeamMembersDone.bind(this),
        onsyncdone: onSyncDone.bind(this),
       
        //个人信息
        onmyinfo:onMyInfo.bind(this),
        onupdatemyinfo:onMyInfo.bind(this),
        //系统通知
        onsysmsg: onSysMsg.bind(this,1),
      onofflinesysmsgs: onOfflineSysmsgs.bind(this),
      onupdatesysmsg:onSysMsg.bind(this,0),
      oncustomsysmsg:onCustomSysMsg.bind(this),
      onofflinecustomsysmsgs:onOfflineCustomSysMsgs.bind(this),
        // 静音，黑名单，好友
        onmutelist:onMutelist.bind(this),
        onblacklist: onBlacklist.bind(this),
        onfriends:onFriends.bind(this),
        onsynccreateteam:onSyncCreateteam.bind(this),
        onsyncmarkinblacklist:onSyncMarkinBlacklist.bind(this),
        onsyncmarkinmutelist:onSyncMarkinMutelist.bind(this),
        onsyncfriendaction:onSyncFriendAction.bind(this),
        // 监听订阅事件列表
        onpushevents:onPushEvents.bind(this)
    });
  function onConnect() {
    $('errorNetwork').addClass('hide');
    this.teamMemberDone = false;
    this.sysMsgDone = false;
      console&&console.log('连接成功');
  };

  function onKicked(obj) {
      this.iskicked = true;
    
  };

  function onWillReconnect(obj){
    // 此时说明 `SDK` 已经断开连接，请开发者在界面上提示用户连接已断开，而且正在重新建立连接
    $('errorNetwork').removeClass('hide');
  };

  function onError(error) {
      console.log('错误信息' + error);
  };
  function onDisconnect(error) {
    // 此时说明 `SDK` 处于断开状态，开发者此时应该根据错误码提示相应的错误信息，并且跳转到登录页面
    var that = this;
    console.log('连接断开');
      if (error) {
          switch (error.code) {
          // 账号或者密码错误, 请跳转到登录页面并提示错误
          case 302:
            alert(error.message);
          delCookie('uid');
          delCookie('sdktoken');
          window.location.href = './index.html'; 
              break;
          // 被踢, 请提示错误后跳转到登录页面
          case 'kicked':
            var map={
          PC:"电脑版",
          Web:"网页版",
          Android:"手机版",
          iOS:"手机版",
          WindowsPhone:"手机版"
        };
        var str =error.from;
            alert("你的帐号于"+dateFormat(+new Date(),"HH:mm")+"被"+(map[str]||"其他端")+"踢出下线，请确定帐号信息安全!");
          delCookie('uid');
          delCookie('sdktoken');
          window.location.href = './index.html';  
              break;
          default:
              break;
          }
      }
  };
  function onLoginPortsChange(loginPorts) {
      console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
      this.controller.loginPorts(loginPorts);
  };
  function onTeams(teams) {
    var teamlist = this.cache.getTeamlist();
    teamlist = this.nim.mergeTeams(teamlist, teams);    
    teamlist = this.nim.cutTeams(teamlist, teams.invalid);
    this.cache.setTeamList(teamlist);
  };
  function onFriends(friends){
    var friendlist = this.cache.getFriends();
    friendlist = this.nim.mergeFriends(friendlist, friends);    
    friendlist = this.nim.cutFriends(friendlist, friends.invalid);
    this.cache.setFriends(friendlist);
    // 订阅好友账号
    var subscribeAccounts = []
    for(var i = 0;i<friendlist.length;i++){
      this.person[friendlist[i].account] = true;
      subscribeAccounts.push(friendlist[i].account)
    }
    // 订阅好友事件
    that.subscribeMultiPortEvent(subscribeAccounts)
  };
  function onSessions(sessions){
    var old = this.cache.getSessions();
    this.cache.setSessions(this.nim.mergeSessions(old, sessions));
    for(var i = 0;i<sessions.length;i++){
        if(sessions[i].scene==="p2p"){
          var tmpUser = sessions[i].to
          // 如果会话列表不是好友，需要订阅关系
          if (!this.cache.isFriend(tmpUser)) {
            that.subscribeMultiPortEvent([tmpUser])
          }
          this.person[tmpUser] = true;
        }else{
          this.team.push(sessions[i].to);
          var arr = getAllAccount(sessions[i].lastMsg);
          if(!arr){
            continue;
          }
          for(var j = arr.length -1; j >= 0; j--){
            this.person[arr[j]] = true;
          }
        }
    }
  };
  
  function onUpdatesession(session){
    var id = session.id||"";
    var old = this.cache.getSessions();
    this.cache.setSessions(this.nim.mergeSessions(old, session));
    this.controller.buildSessions(id);      
  };

  function saveMsgs(msgs) {
    msgs = msgs.msgs;
      this.cache.addMsgs(msgs);
      for(var i = 0;i<msgs.length;i++){
        if(msgs[i].scene==="p2p"){
          this.person[msgs[i].from!==userUID?msgs[i].from:msgs[i].to] = true;
        }
    }
  };

  function onSyncDone() {
    console.log('消息同步完成');  
    var ctr = this.controller;
      ctr.initInfo(this.person,this.team);
  };
  // function onSyncTeamMembersDone() {
  //  console.log('群成员同步完成');
  //  var ctr = this.controller;
  //     this.teamMemberDone = true;
  //     //如果用户消息等拉取完毕，UI开始呈现
  //     if(this.sysMsgDone){
  //      ctr.initInfo(this.person,this.team);
  //     }
  // };


  // function onTeamMembers(obj) {
  //  this.cache.setTeamMembers(obj.teamId,obj.members);
  //  var members = obj.members;
  //     for(var i = 0;i<members.length;i++){
 //       this.person[members[i].account] = true; 
  //  }
  // };
  function onMsg(msg) {
    //涉及UI太多放到main.js里去处理了
      this.controller.doMsg(msg);
  };
  function onOfflineSysmsgs(sysMsgs){
    var data = this.cache.getSysMsgs();
    var array = [];
    for (var i = sysMsgs.length - 1; i >= 0; i--) {
      if(sysMsgs[i].category==="team"){
        array.push(sysMsgs[i]);
      }
    };
    array =this.nim.mergeSysMsgs(data, array).sort(function(a,b){
      return b.time-a.time;
    });
    this.cache.setSysMsgs(array);
    this.cache.addSysMsgCount(array.length);
  }
  function onSysMsg(newMsg, msg) {
    var type = msg.type,
      ctr = this.controller,
      cache = this.cache;
      data = cache.getSysMsgs();
    if(msg.type==="deleteMsg"){
      ctr.backoutMsg(msg.deletedIdClient, msg)
      return
    }
    data =this.nim.mergeSysMsgs(data, msg).sort(function(a,b){
      return b.time-a.time;
    });
    this.cache.setSysMsgs(data);
    if(msg.category!=="team"){
      switch (type) {
              case 'deleteFriend':
                  cache.removeFriend(msg.from);
                  ctr.buildFriends();
                  break;
              case 'addFriend':
                  if(!this.cache.getUserById(msg.from)){
                      this.getUser(msg.from,function(err,data){
                        if(!err){
                          cache.addFriend(data);
                          cache.updatePersonlist(data);
                          ctr.buildFriends(); 
                        }
                      })
                  }else{
                    // 订阅好友登录事件
                    that.subscribeMultiPortEvent([msg.friend])
                    cache.addFriend(msg.friend);
                    ctr.buildFriends();   
                  }
                  break;
              default:
                console.log("系统消息---->"+msg);
                  break;
          }     
    }else{
      if(newMsg){
        this.cache.addSysMsgCount(1);
        ctr.showSysMsgCount();
      }
      ctr.buildSysNotice();
    }
  };

  function onCustomSysMsg(msg){
    //多端同步 正在输入自定义消息类型需要过滤
    var id = JSON.parse(msg.content).id;
    if(id==1){
      return;
    }
    var ctr = this.controller;
    this.cache.addCustomSysMsgs([msg]);
    this.cache.addSysMsgCount(1);
    ctr.showSysMsgCount();
    ctr.buildCustomSysNotice();
  };
  function onOfflineCustomSysMsgs(msgs){
    this.cache.addCustomSysMsgs(msgs);
    this.cache.addSysMsgCount(msgs.length);
  };
  // 黑名单
  function onBlacklist(blacklist){
    var list = this.cache.getBlacklist();
    list = this.nim.mergeRelations(list, blacklist);
      list = this.nim.cutRelations(list, blacklist.invalid);
    this.cache.setBlacklist(list);
    
    for(var i = 0;i<list.length;i++){
      this.person[list[i]] = true;
    }
  };
  //静音
  function onMutelist(mutelist){
    var list = this.cache.getMutelist();
    list = this.nim.mergeRelations(list, mutelist);
      list = this.nim.cutRelations(list, mutelist.invalid);
    this.cache.setMutelist(list);
    for(var i = 0;i<list.length;i++){
      this.person[list[i]] = true;
    }
  };

  function onMyInfo(data){
    this.cache.updatePersonlist(data);
    this.controller.showMe();
  };

  function onSyncCreateteam(data){
    this.cache.addTeam(data);
    this.controller.buildTeams();
  };
  // 多端同步好友关系
  function onSyncFriendAction(data){
    var that =  this,
            type = data.type;
        switch (type) {
            case 'deleteFriend':
                this.cache.removeFriend(data.account);
                this.controller.buildFriends();
                break;
            case 'addFriend':
                this.cache.addFriend(data.friend);
                if(!this.cache.getUserById(data.account)){
                    this.getUser(account,function(err,data){
                        if(!err){
                            that.cache.updatePersonlist(data);
                            that.controller.buildFriends();      
                        }
                    })
                }else{
                    this.controller.buildFriends();   
                }
                break;
            default:
                console.log(data);
                break;
        }
  };

  function onSyncMarkinBlacklist(param){
    if(param.isAdd){
      this.cache.addToBlacklist(param.record);
    }else {
      this.cache.removeFromBlacklist(param.account);
    }
    this.controller.buildSessions();
        this.controller.buildFriends();     
  };

  function onSyncMarkinMutelist(param){
    if(param.isAdd){
      this.cache.addToMutelist(param.record);
    }else {
      this.cache.removeFromMutelist(param.account);
    }
  };

  // 订阅的事件，这里会用于同步多端登录状态
  function onPushEvents(param){
    if (param.msgEvents) {
      var msgEvents = param.msgEvents
      for (var i = 0; i < msgEvents.length; i++) {
        var msgEvent = msgEvents[i]
        this.cache.updatePersonSubscribe(msgEvent)
      }
      var ctr = this.controller
      ctr.buildFriends()
      ctr.buildSessions()
      var account = ctr.crtSessionAccount
      if (account) {
        $('#nickName').text(ctr.getNick(account) + ' ' + (this.cache.getMultiPortStatus(account) || ''))
      }
      console.log('订阅事件', param.msgEvents)
    }
  }
}

/********** 这里通过原型链封装了sdk的方法，主要是为了方便快速阅读sdkAPI的使用 *********/

/**
 * 订阅用户登录状态事件
 * @param {StringArray} accounts 
 */
SDKBridge.prototype.subscribeMultiPortEvent = function (accounts) {
  this.nim.subscribeEvent({
    // type 1 为登录事件，用于同步多端登录状态
    type: 1,
    accounts: accounts,
    subscribeTime: 3600 * 24 * 30,
    // 同步订阅事件，保证每次登录时会收到推送消息
    sync: true,
    done: function onSubscribeEvent (err, res) {
      if (err) {
        console.error('订阅好友事件失败', err)
      } else {
        console.info('订阅好友事件', res)
      }
    }
  });
};

/**
 * 取消订阅用户登录状态事件
 * @param {StringArray} accounts 
 */
SDKBridge.prototype.unSubscribeMultiPortEvent = function (accounts) {
  this.nim.unSubscribeEventsByAccounts({
    type: 1,
    accounts: accounts,
    done: function onUnSubscribeEventDone (err, res) {
      if (err) {
        console.error('取消订阅好友事件失败', err)
      } else {
        console.info('取消订阅好友事件', res)
      }
    }
  });
};


/**
 * 设置当前会话，当前会话未读数会被置为0，同时开发者会收到 onupdatesession回调
 * @param {String} scene 
 * @param {String} to    
 */
SDKBridge.prototype.setCurrSession = function(scene,to){
  this.nim.setCurrSession(scene+"-"+to);
}

/**
* 发送普通文本消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param text：发送的消息文本
* @param isLocal：是否是本地消息
* @param callback：回调
*/
SDKBridge.prototype.sendTextMessage = function (scene, to, text ,isLocal, callback) {
    isLocal = !!isLocal;
    this.nim.sendText({
        scene: scene || 'p2p',
        to: to,
        text: text,
        isLocal: isLocal,
        done: callback
    });
};

/**
* 发送自定义消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param content：消息内容对象
* @param callback：回调
*/
SDKBridge.prototype.sendCustomMessage = function (scene, to, content , callback) {
    this.nim.sendCustomMsg({
        scene: scene || 'p2p',
        to: to,
        content: JSON.stringify(content),
        done: callback
    });
};

/**
* 发送文件消息
* @param scene：场景，分为：P2P点对点对话，team群对话,callback回调
* @param to：消息的接收方
* @param text：发送的消息文本
* @param callback：回调
*/
SDKBridge.prototype.sendFileMessage = function (scene, to, fileInput , callback) {
  var that = this,
    value = fileInput.value,
    ext = value.substring(value.lastIndexOf('.') + 1, value.length),
    type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
    this.nim.sendFile({
        scene: scene,
        to: to,
    type: type,
        fileInput: fileInput,
        uploadprogress: function (data) {
           console && console.log(data.percentageText);
        },
        uploaderror: function () {
            console && console.log('上传失败');
        },
      uploaddone: function(error, file) {
          console.log(error);
          console.log(file);
          console.log('上传' + (!error?'成功':'失败'));
      },
        beforesend: function (msgId) {
            console && console.log('正在发送消息, id=' + msgId);
        },
        done: callback
    });
}
/**
 * 获取云记录消息
 * @param  {Object} param 数据对象
 * @return {void}       
 */
SDKBridge.prototype.getHistoryMsgs = function(param){
  this.nim.getHistoryMsgs (param);
}
/**
 * 获取本地历史记录消息  
 */
SDKBridge.prototype.getLocalMsgs = function(sessionId,end,done){
  if(end){
    this.nim.getLocalMsgs ({
      sessionId:sessionId,
      end:end,
      limit:20,
      done:done
    });
  }else{
    this.nim.getLocalMsgs ({
      sessionId:sessionId,
      limit:20,
      done:done
    });
  }
  
}
SDKBridge.prototype.getLocalTeams = function(teamIds,done){
  this.nim.getLocalTeams ({
    teamIds:teamIds,
    done:done
  });
}
/**
 * 获取本地系统消息记录
 * @param  {Funciton} done 回调
 * @return {void}       
 */
SDKBridge.prototype.getLocalSysMsgs = function(done){
  this.nim.getLocalSysMsgs({
    done:done
  });
}

/**
 * 获取删除本地系统消息记录
 * @param  {Funciton} done 回调
 * @return {void}       
 */
SDKBridge.prototype.deleteAllLocalSysMsgs = function(done){
  this.nim.deleteAllLocalSysMsgs({
        done: done
    });
}

/**
 * 通过入群申请
 */
SDKBridge.prototype.passTeamApply = function(teamId,from,idServer){
  this.nim.passTeamApply({
    teamId:teamId,
    from:from,
    idServer:idServer,
    done:function(err,data){

    }
  });
}

/**
 * 拒绝入群申请
 */
SDKBridge.prototype.rejectTeamApply = function(teamId,from,idServer){
  this.nim.rejectTeamApply({
    teamId:teamId,
    from:from,
    idServer:idServer,
    done:function(err,data){
      
    }
  });
}

/**
 * 拒绝入群邀请
 */
SDKBridge.prototype.rejectTeamInvite = function(teamId,from,idServer){
  this.nim.rejectTeamInvite({
    teamId:teamId,
    from:from,
    idServer:idServer,
    done:function(err,data){
    }
  });
}

/**
 * 接受入群邀请
 */
SDKBridge.prototype.acceptTeamInvite = function(teamId,from,idServer){
  this.nim.acceptTeamInvite({
    teamId:teamId,
    from:from,
    idServer:idServer,
    done:function(err,data){
      
    }
  });
}
/**
 * 踢人
 * @param  {int} type  设备端
 * @return {void}     
 */
SDKBridge.prototype.kick = function(type){
  var deviceIds = (type ===0?this.mobileDeviceId:this.pcDeviceId);
  this.nim.kick({
      deviceIds: [deviceIds],
      done: function(error, obj){
        alert('踢'+(type===0?'移动':'PC')+'端' + (!error?'成功':'失败'));
        console.log(error);
        console.log(obj);
      }
  });
}
// 获取群信息
SDKBridge.prototype.getTeam = function(account,done){
  this.nim.getTeam({
    teamId: account,
    done: done
  });
}
//申请加入高级群
SDKBridge.prototype.applyTeam = function(account){
  this.nim.applyTeam({
    teamId: account,
    done: function(err,data){
      if(err){
        alert(err.message);
      }else{
        alert("入群申请已发出");
      }
    }
  });
}

SDKBridge.prototype.createTeam = function(param){
  this.nim.createTeam(param);
} 
SDKBridge.prototype.getTeamMembers = function(id, callback){
  this.nim.getTeamMembers({
    teamId: id,
      done:callback
  });
}
SDKBridge.prototype.updateTeam = function(param){
  this.nim.updateTeam(param);
}
SDKBridge.prototype.leaveTeam = function(param){
  this.nim.leaveTeam(param);
}
SDKBridge.prototype.dismissTeam = function(param){
  this.nim.dismissTeam(param);
}
SDKBridge.prototype.addTeamMembers= function(param){
  this.nim.addTeamMembers(param);
}
SDKBridge.prototype.removeTeamMembers = function(param){
  this.nim.removeTeamMembers(param);
}

/**
 * 群成员静音
 */
SDKBridge.prototype.updateMuteStateInTeam = function(id,account,mute,callback){
  this.nim.updateMuteStateInTeam({
    teamId:id,
    account: account,
      mute: mute,
      done: callback
  });
}
/**
 * 加好友（不需要验证）
 * @param  {String}   uid       
 * @param  {Function} callback 
 * @return             
 */
SDKBridge.prototype.addFriend = function(account,callback){
  var that = this
  this.nim.addFriend({
    account: account,
    done: callback
  });
}
/**
 * 删好友
 * @param  {[type]}   account  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
SDKBridge.prototype.deleteFriend = function(account,callback){
  this.nim.deleteFriend({
    account: account,
    done: callback
  });
}

/**
 * 静音
 */
SDKBridge.prototype.markInMutelist = function(account,isAdd,callback){
  this.nim.markInMutelist({
      account: account,
      isAdd:isAdd,
      done: callback
  });
}

/**
 * 黑名单
 */
SDKBridge.prototype.markInBlacklist = function(account,isAdd,callback){
  this.nim.markInBlacklist({
    account: account,
    // true表示加入黑名单，false表示从黑名单移除
    isAdd: isAdd,
    done: callback
  });
}


/**
 * 获取用户信息（如果用户信息让SDK托管）上层限制每次拉取150条
 */
SDKBridge.prototype.getUsers = function(accounts, callback){
  var arr1 = accounts.slice(0,150)
  var arr2 = accounts.slice(150)
  var datas = []
  var that = this
  var getInfo = function () {
    that.nim.getUsers({
      accounts: arr1,
      done: function(err,data){
        if (err) {
          callback(err)
        } else {
          datas = datas.concat(data)
          if(arr2.length > 0){
            arr1 = arr2.slice(0, 150)
            arr2 = arr2.slice(150)
            getInfo()
          }else{
            callback(err,datas)
          }
        }
      }     
    })
  }
  getInfo()
};
SDKBridge.prototype.getUser = function(account,callback){
  this.nim.getUser({
    account: account,
    done: callback
  });
};

SDKBridge.prototype.updateMyInfo = function(nick,gender,birth,tel,email,sign,callback){
  this.nim.updateMyInfo({
    nick:nick,
    gender:gender,
    birth:birth,
    tel:tel,
    email:email,
    sign:sign,
    done: callback
  });
}
SDKBridge.prototype.updateMyAvatar = function(avatar,callback){
  this.nim.updateMyInfo({
    avatar:avatar,
    done: callback
  });
}
SDKBridge.prototype.updateFriend = function(account,alias,callback){
  this.nim.updateFriend({
      account: account,
      alias: alias,
      done: callback
  });
}
// SDKBridge.prototype.thumbnailImage = function (options) {
//  return this.nim.thumbnailImage({
//    url:options.url,
//    mode:options.mode,
//    width:options.width,
//    height:options.height
//  })
// }

// SDKBridge.prototype.cropImage = function(option){
//  return this.nim.cropImage(option);
// }

SDKBridge.prototype.previewImage = function(option){
  this.nim.previewFile({
      type: 'image',
      fileInput: option.fileInput,
      uploadprogress: function(obj) {
          console.log('文件总大小: ' + obj.total + 'bytes');
          console.log('已经上传的大小: ' + obj.loaded + 'bytes');
          console.log('上传进度: ' + obj.percentage);
          console.log('上传进度文本: ' + obj.percentageText);
      },
      done: option.callback
  });
}
/**
 * 已读回执
 */
SDKBridge.prototype.sendMsgReceipt = function(msg,done){
  this.nim.sendMsgReceipt({
      msg:msg,
      done: done
  });
}
/**
 * 消息重发
 */
SDKBridge.prototype.resendMsg = function(msg, done){
  this.nim.resendMsg({
      msg:msg,
      done: done
  });
}