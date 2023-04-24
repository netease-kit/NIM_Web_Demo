/*
 * @Author: 消息逻辑
 */

'use strict';

YX.fn.message = function() {
  this.$sendBtn = $('#sendBtn');
  this.$messageText = $('#messageText');
  this.$chooseFileBtn = $('#chooseFileBtn');
  this.$fileInput = $('#uploadFile');
  this.$toRecord = $('#toRecord');
  this.$recordTimeBox = $('#toRecordBox')
  this.$recordTimeDuration = $('#toRecordTime')
  this.$cancelRecord = $('#toRecordCancle')
  this.$showNetcallAudioLink = $('#showNetcallAudioLink')
  this.$showNetcallVideoLink = $('#showNetcallVideoLink')
  this.$showWhiteboard = $('#showWhiteboard')
  this.$forwardBtn = $('#forwardBtn')
  this.$forwardCancelBtn = $('#forwardCancelBtn')
  try {
    this.audioContext = new Recorder.AudioContext;
  } catch (e) {
    console.log(e);
  }
  YX.fn.recorder = null;
  YX.fn.recordTimeout = '';
  YX.fn.recordTime = 0;
  this.$sendBtn.on('click', this.sendTextMessage.bind(this));
  this.$messageText.on('keydown', this.inputMessage.bind(this));
  this.$chooseFileBtn.on('click', 'a', this.chooseFile.bind(this));
  this.$fileInput.on('change', this.uploadFile.bind(this));
  this.$toRecord.on('click', this.recordAudio.bind(this));
  this.$cancelRecord.on('click', this.cancelRecordAudio.bind(this));
  this.$showNetcallAudioLink.on('click', this.stopRecordAndAudio.bind(this));
  this.$showNetcallVideoLink.on('click', this.stopRecordAndAudio.bind(this));
  this.$showWhiteboard.on('click', this.stopRecordAndAudio.bind(this));
  this.$forwardBtn.on('click', this.chooseFriends.bind(this));
  this.$forwardCancelBtn.on('click', this.hideForwardBtn.bind(this));  
  //消息重发
  this.$chatContent.delegate('.j-resend', 'click', this.doResend.bind(this));
  //语音播发
  this.$chatContent.delegate('.j-mbox', 'click', this.playAudio);
  // 查看合并转发消息 
  this._mergeMsgsOffset = []
  this.$chatContent.delegate('.j-merge-box', 'click', this.showMergeMsg.bind(this))
  var mergeMsgsContainer = $('#mergeMsgsContainer')
  mergeMsgsContainer.delegate('.j-merge-box','click',this.showMergeMsg.bind(this))
  mergeMsgsContainer.delegate('.j-backBtn', 'click', this.closeMergeMsgsContainer.bind(this));
  mergeMsgsContainer.delegate('.j-mbox','click',this.playAudio)
  //聊天面板右键菜单
  $.contextMenu({
    selector: '.j-msg',
    callback: function(key, options) {
      if (key === 'delete') {
        var id = options.$trigger.parent().data('id');
        var msg = this.cache.findMsg(this.crtSession, id);
        if (!msg || options.$trigger.hasClass('j-msg')) {}
        if (msg.flow !== 'out' && msg.scene === 'p2p') {
          alert('点对点场景，只能撤回自己发的消息');
          return;
        }
        if (
          !this.cache.isCurSessionTeamManager &&
          msg.flow !== 'out' &&
          msg.scene === 'team'
        ) {
          alert('群会话场景，非管理员不能撤回别人发的消息');
          return;
        }
        options.$trigger.removeClass('j-msg');
        this.nim.deleteMsg({
          msg: msg,
          done: function(err) {
            options.$trigger.addClass('j-msg');
            if (err) {
              if (err.code === 508) {
                alert('发送时间超过2分钟的消息，不能被撤回');
              } else {
                alert(err.message || '操作失败');
              }
            } else {
              msg.opeAccount = userUID;
              this.backoutMsg(id, {
                msg: msg
              });
            }
          }.bind(this)
        });
      } else if (key === 'multiple') {
        // 每一条记录前面添加 checkbox 多选框
        document.querySelectorAll('#chatContent>div.item').forEach((item) => {
          var id = item.dataset.id;
          var checkboxElement = document.createElement('input');
          checkboxElement.name = id;
          checkboxElement.type = 'checkbox';
          checkboxElement.className = 'forward-checkbox';
          if(!item.querySelector('input')){
            item.insertBefore(checkboxElement,item.firstChild);
          }
        });
        $('#chatForwrdContainer').removeClass('hide');
      }
    }.bind(this),
    items: {
      delete: {
        name: '撤回',
        icon: 'delete'
      },
      multiple: {
        name: '多选',
        icon: 'multiple'
      }
    }
  });

  //表情贴图模块
  this.initEmoji();
};
/**
 * 处理收到的消息
 * @param  {Object} msg
 * @return
 */
YX.fn.doMsg = function(msg) {
  var that = this,
    who = msg.to === userUID ? msg.from : msg.to,
    updateContentUI = function() {
      //如果当前消息对象的会话面板打开
      if (that.crtSessionAccount === who) {
        that.sendMsgRead(who, msg.scene);
        that.cache.dealTeamMsgReceipts(msg, function() {
          var msgHtml = appUI.updateChatContentUI(msg, that.cache);
          that.$chatContent.find('.no-msg').remove();
          that.$chatContent.append(msgHtml).scrollTop(99999);
        })
      }
    };
  //非群通知消息处理
  if (/text|image|file|audio|video|geo|custom|tip|robot/i.test(msg.type)) {
    this.cache.addMsgs(msg);
    var account = msg.scene === 'p2p' ? who : msg.from;
    //用户信息本地没有缓存，需存储
    if (!this.cache.getUserById(account)) {
      this.mysdk.getUser(account, function(err, data) {
        if (!err) {
          that.cache.updatePersonlist(data);
          updateContentUI();
        }
      });
    } else {
      this.buildSessions();
      updateContentUI();
    }
  } else {
    // 群消息处理
    this.messageHandler(msg, updateContentUI);
  }
};
/*****************************************************************
 * emoji模块
 ****************************************************************/
YX.fn.initEmoji = function() {
  this.$showEmoji = $('#showEmoji');
  this.$showEmoji.on('click', this.showEmoji.bind(this));
  var that = this,
    emojiConfig = {
      emojiList: emojiList, //普通表情
      pinupList: pinupList, //贴图
      width: 500,
      height: 300,
      imgpath: './images/',
      callback: function(result) {
        that.cbShowEmoji(result);
      }
    };
  this.$emNode = new CEmojiEngine($('#emojiTag')[0], emojiConfig);
  this.$emNode._$hide();
};
/**
 * 选择表情回调
 * @param  {objcet} result 点击表情/贴图返回的数据
 */
YX.fn.cbShowEmoji = function(result) {
  if (!!result) {
    var scene = this.crtSessionType,
      to = this.crtSessionAccount;
    // 贴图，发送自定义消息体
    if (result.type === 'pinup') {
      var index = Number(result.emoji) + 1;
      var content = {
        type: 3,
        data: {
          catalog: result.category,
          chartlet: result.category + '0' + (index >= 10 ? index : '0' + index)
        }
      };
      this.mysdk.sendCustomMessage(
        scene,
        to,
        content,
        this.sendMsgDone.bind(this)
      );
    } else {
      // 表情，内容直接加到输入框
      this.$messageText[0].value = this.$messageText[0].value + result.emoji;
    }
  }
};

YX.fn.showEmoji = function() {
  this.$emNode._$show();
};
/*************************************************************************
 * 发送消息逻辑
 *
 ************************************************************************/
YX.fn.uploadFile = function() {
  var that = this,
    scene = this.crtSessionType,
    to = this.crtSessionAccount,
    fileInput = this.$fileInput.get(0);
  if (fileInput.files[0].size == 0) {
    alert('不能传空文件');
    return;
  }
  this.mysdk.sendFileMessage(scene, to, fileInput, this.sendMsgDone.bind(this));
};

YX.fn.chooseFile = function() {
  this.$fileInput.click();
};

YX.fn.sendTextMessage = function() {
  var self = this
  if (self.$toRecord.hasClass('recording') || self.$toRecord.hasClass('recorded')) {
    if (YX.fn.recordTime < 2) {
      alert('语音消息最短2s')
      return
    }
    self.stopRecordAudio()
    self.sendRecordAudio()
    return
  }
  var scene = this.crtSessionType,
    to = this.crtSessionAccount,
    text = this.$messageText.val().trim();
  if (!!to && !!text) {
    if (text.length > 500) {
      alert('消息长度最大为500字符');
    } else if (text.length === 0) {
      return;
    } else {
      var options = {
        scene: scene || 'p2p',
        to: to,
        text: text,
        done: this.sendMsgDone.bind(this)
      };
      // 客户端反垃圾检查
      var ret = nim.filterClientAntispam({
        content: text
      });

      switch (ret.type) {
        case 0:
          // console.log('没有命中反垃圾词库', ret.result);
          break;
        case 1:
          // console.log('已对特殊字符做了过滤', ret.result);
          options.text = ret.result;
          break;
        case 2:
          // console.log('建议拒绝发送', ret.result);
          this.mysdk.sendTipMsg({
            scene: scene,
            to: to,
            tip: '命中敏感词，拒绝发送'
          });
          return;
        case 3:
          // console.log('建议服务器处理反垃圾，发消息带上字段clientAntiSpam';
          options.clientAntiSpam = true;
          break;
      }
      if (
        this.crtSessionType === 'team' &&
        this.crtSessionTeamType === 'advanced'
      ) {
        if ($('#needTeamMsgReceipt') && $('#needTeamMsgReceipt')[0].checked) {
          options.needMsgReceipt = true;
        }
      }
      this.nim.sendText(options);
    }
  }
};

YX.fn.sendRecordAudio = function() {
  var self = this
  YX.fn.recorder.exportWAV(function(blob) {
    self.$toRecord.addClass('uploading');
    self.nim.sendFile({
      scene: self.crtSessionType,
      to: self.crtSessionAccount,
      type: 'audio',
      blob: blob,
      uploadprogress: function(obj) {
        console.log('文件总大小: ' + obj.total + 'bytes');
        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
        console.log('上传进度: ' + obj.percentage);
        console.log('上传进度文本: ' + obj.percentageText);
        if (obj.percentage === 100) {
          self.$toRecord.removeClass('uploading');
          self.$toRecord.removeClass('recorded');
        }
      },
      done: self.sendMsgDone.bind(self)
    });
  });
  self.cancelRecordAudio()
};

YX.fn.stopRecordAndAudio = function () {
  YX.fn.stopRecordAudio()
  YX.fn.stopPlayAudio()
};

YX.fn.recordAudio = function() {
  YX.fn.stopPlayAudio()
  var self = this
  if (location.protocol === 'http:') {
    alert('请使用https协议');
    return
  }
  if (!self.audioContext) {
    alert('当前浏览器不支持录音!');
    return
  }
  if (!self.$toRecord.hasClass('recording') && !self.$toRecord.hasClass('recorded')) {
    if (YX.fn.recorder) {
      YX.fn.recorder.clear();
      YX.fn.recorder.record();
      self.showRecorderTime()
    } else {
      Recorder.mediaDevices.getUserMedia({
        audio: true
      }).then(function(stream) {
        var input = self.audioContext.createMediaStreamSource(stream);
        YX.fn.recorder = new Recorder(input);
        YX.fn.recorder.record();
        if (~self.audioContext.state.indexOf('suspend')) {
          self.audioContext.resume().then(function () {
            YX.fn.recorder.record();
            self.showRecorderTime()
            console.log('audioContext suspend state resume');
          })
        } else {
          self.showRecorderTime()
        }
      }).catch(function(err) {
        alert('您没有可用的麦克风输入设备')
        self.$toRecord.addClass('disabled')
        console.log('No live audio input: ' + err, err.name + ": " + err.message);
      });
    }
  }
};

YX.fn.showRecorderTime = function () {
  var self = this
  if (YX.fn.recorder) {
    self.$recordTimeBox.show()
    self.$toRecord.addClass('recording');
    YX.fn.recordTime = 0;
    YX.fn.recordTimeout = setTimeout(self.recordTimeRun.bind(self), 1000)
  }
};

YX.fn.recordTimeRun = function () {
  var self = this
  YX.fn.recordTimeout = setTimeout(self.recordTimeRun.bind(self), 1000)
  YX.fn.recordTime++;
  if (YX.fn.recordTime >= 60) {
    clearTimeout(YX.fn.recordTimeout)
    self.stopRecordAudio()
  }
  self.$recordTimeDuration.html('00:' + (YX.fn.recordTime > 9 ? YX.fn.recordTime : '0' + YX.fn.recordTime))
};

YX.fn.stopRecordAudio = function() {
  var $toRecord = $('#toRecord')
  var isRecording = $toRecord.hasClass('recording');
  if (isRecording) {
    $toRecord.removeClass('recording');
    $toRecord.addClass('recorded');
    if (YX.fn.recorder) {
      clearTimeout(YX.fn.recordTimeout)
      YX.fn.recorder.stop();
    }
  }
};

YX.fn.cancelRecordAudio = function () {
  var $toRecord = $('#toRecord')
  var isRecording = $toRecord.hasClass('recording') || $toRecord.hasClass('recorded');
  var $recordTimeBox = $('#toRecordBox')
  var $recordTimeDuration = $('#toRecordTime')
  if (isRecording && YX.fn.recorder) {
    clearTimeout(YX.fn.recordTimeout)
    YX.fn.recorder.stop();
    YX.fn.recorder.clear();
    $recordTimeBox.hide()
    $toRecord.removeClass('recording');
    $toRecord.removeClass('recorded');
    $recordTimeDuration.html('00:00')
    YX.fn.recordTime = 0
  }
};

/**
 * 发送消息完毕后的回调
 * @param error：消息发送失败的原因
 * @param msg：消息主体，类型分为文本、文件、图片、地理位置、语音、视频、自定义消息，通知等
 */
YX.fn.sendMsgDone = function(error, msg) {
  if (error && error.code === 7101) {
    alert('被拉黑');
    msg.blacked = true;
  }
  this.cache.addMsgs(msg);
  if (msg.type === 'text') {
    this.$messageText.val('');
  }
  this.$chatContent.find('.no-msg').remove();
  this.cache.dealTeamMsgReceipts(msg, function() {
    var msgHtml = appUI.updateChatContentUI(msg, this.cache);
    this.$chatContent.append(msgHtml).scrollTop(99999);
    $('#uploadForm')
      .get(0)
      .reset();
  }.bind(this))
};

YX.fn.inputMessage = function(e) {
  var ev = e || window.event;
  if ($.trim(this.$messageText.val()).length > 0) {
    if (ev.keyCode === 13 && ev.ctrlKey) {
      this.$messageText.val(this.$messageText.val() + '\r\n');
    } else if (ev.keyCode === 13 && !ev.ctrlKey) {
      this.sendTextMessage();
    }
  }
};
// 重发
YX.fn.doResend = function(evt) {
  var $node;
  if (evt.target.tagName.toLowerCase() === 'span') {
    $node = $(evt.target);
  } else {
    $node = $(evt.target.parentNode);
  }
  var sessionId = $node.data('session');
  var idClient = $node.data('id');
  var msg = this.cache.findMsg(sessionId, idClient);
  this.mysdk.resendMsg(
    msg,
    function(err, data) {
      if (err) {
        alert(err.message || '发送失败');
      } else {
        this.cache.setMsg(sessionId, idClient, data);
        var msgHtml = appUI.buildChatContentUI(sessionId, this.cache);
        this.$chatContent.html(msgHtml).scrollTop(99999);
        $('#uploadForm')
          .get(0)
          .reset();
      }
    }.bind(this)
  );
};
/************************************************************
 * 获取当前会话消息
 * @return {void}
 *************************************************************/
YX.fn.getHistoryMsgs = function(scene, account) {
  var id = scene + '-' + account;
  var sessions = this.cache.findSession(id);
  var msgs = this.cache.getMsgs(id);
  //标记已读回执
  this.sendMsgRead(account, scene);
  if (!!sessions) {
    // if (sessions.unread >= msgs.length) {
    // var end = msgs.length > 0 ? msgs[0].time : false;
    // }
    // if (sessions.lastMsg) {
    //   var end = sessions.lastMsg.time || false
    // }
    var end = false
    this.mysdk.getLocalMsgs(id, end, this.getLocalMsgsDone.bind(this));
    return;
    // }
  }
  this.doChatUI(id);
};
//拿到历史消息后聊天面板UI呈现
YX.fn.doChatUI = function(id) {
  this.cache.dealTeamMsgReceipts(id, function() {
    var temp = appUI.buildChatContentUI(id, this.cache);
    this.$chatContent.html(temp);
    this.$chatContent.scrollTop(9999);
    //已读回执UI处理
    this.markMsgRead(id);
  }.bind(this));
};

YX.fn.getLocalMsgsDone = function(err, data) {
  if (!err) {
    var reset = true
    this.cache.addMsgsByReverse(data.msgs, true);
    var id = data.sessionId;
    var array = getAllAccount(data.msgs);
    var that = this;
    this.checkUserInfo(array, function() {
      that.doChatUI(id);
    });
  } else {
    alert('获取历史消息失败');
  }
};

//检查用户信息有木有本地缓存 没的话就去拿拿好后在执行回调
YX.fn.checkUserInfo = function(array, callback) {
  var arr = [];
  var that = this;
  for (var i = array.length - 1; i >= 0; i--) {
    if (!this.cache.getUserById(array[i])) {
      arr.push(array[i]);
    }
  }
  if (arr.length > 0) {
    this.mysdk.getUsers(arr, function(error, data) {
      if (!error) {
        that.cache.setPersonlist(data);
        callback();
      } else {
        alert('获取用户信息失败');
      }
    });
  } else {
    callback();
  }
};
//发送已读回执
YX.fn.sendMsgRead = function(account, scene) {
  if (scene === 'p2p') {
    var id = scene + '-' + account;
    var sessions = this.cache.findSession(id);
    this.mysdk.sendMsgReceipt(sessions.lastMsg, function(err, data) {
      if (err) {
        console.log(err);
      }
    });
  }
};
//UI上标记消息已读
YX.fn.markMsgRead = function(id) {
  if (!id || this.crtSession !== id) {
    return;
  }
  var msgs = this.cache.getMsgs(id);
  for (var i = msgs.length - 1; i >= 0; i--) {
    var message = msgs[i];
    // 目前不支持群已读回执
    if (message.scene === 'team') {
      return;
    }
    if (message.type !== 'tip' && window.nim.isMsgRemoteRead(message)) {
      $('.item.item-me.read').removeClass('read');
      $('#' + message.idClient).addClass('read');
      break;
    }
  }
};
//撤回消息
YX.fn.backoutMsg = function(id, data) {
  var msg = data ? data.msg : this.cache.findMsg(this.crtSession, id);
  var to = msg.target;
  var session = msg.sessionId;
  var opeAccount = msg.opeAccount || msg.from;
  var opeNick = getNick(opeAccount);
  if (msg.scene === 'team') {
    var teamId = msg.to || this.crtSessionAccount;
    var teamInfo = this.cache.getTeamById(teamId);
    if (teamInfo && opeAccount !== msg.from) {
      if (teamInfo.owner === opeAccount) {
        opeNick = '群主' + opeNick;
      } else if (teamInfo.type === 'advanced') {
        opeNick = '管理员' + opeNick;
      }
    }
  }

  this.nim.sendTipMsg({
    isLocal: true,
    idClient: msg.idClient || null,
    scene: msg.scene,
    to: to,
    tip: (userUID === opeAccount ? '你' : opeNick) + '撤回了一条消息',
    time: msg.time,
    done: function(err, data) {
      if (!err) {
        this.cache.backoutMsg(session, id, data);
        if (this.crtSession === session) {
          var msgHtml = appUI.buildChatContentUI(this.crtSession, this.cache);
          this.$chatContent.html(msgHtml).scrollTop(99999);
          //已读回执UI处理
          this.markMsgRead(this.crtSession);
        }
      } else {
        alert('操作失败');
      }
    }.bind(this)
  });
};

/*********************************多人音视频模块********************************* */
/** 发送群视频tip消息
 * @param {object} option
 * @param {string} option.teamId 群id
 * @param {string} option.account 发送群视频的uid
 * @param {string} option.message tip消息
 */
YX.fn.sendTeamNetCallTip = function(option) {
  var tmpUser = this.cache.getTeamMemberInfo(option.account, option.teamId);
  option.nick = tmpUser.nickInTeam || getNick(option.account);

  option.isLocal = option.isLocal === undefined ? true : option.isLocal;
  /** 远程 先禁掉 */
  this.nim.sendTipMsg({
    isLocal: option.isLocal,
    scene: 'team',
    to: option.teamId,
    tip: getNick(option.nick) + option.message,
    time: Date.now(),
    isPushable: false,
    isHistoryable: false,
    isRoamingable: false,
    done: function(err, data) {
      // err && console.log(err)
      // this.buildSessions();
      // var msgHtml = appUI.buildChatContentUI(this.crtSession, this.cache)
      this.cache.addMsgs(data);
      var msgHtml = appUI.updateChatContentUI(data, this.cache);
      this.$chatContent.append(msgHtml).scrollTop(99999);
    }.bind(this)
  });
};

/** 对列表用户进行点对点发送自定义系统通知
 * @param {Array} list
 * @param {object} option
 * @param {string} option.caller 主叫人
 * @param {string} option.type 视频还是音频, 如果为空，则取消呼叫!
 * @param {string} option.list 被呼叫uid的列表
 * @param {string} option.teamId 群id
 * @param {string} option.channelName 房间id
 */
YX.fn.sendCustomMessage = function(option) {
  var that = this;
  option.list = option.list || [];

  var tmpUser = this.cache.getTeamMemberInfo(option.caller, option.teamId);
  option.nick = tmpUser.nickInTeam || getNick(option.caller);

  option.list.forEach(function(uid) {
    // this.mysdk.sendCustomMessage('p2p', item, content, this.sendMsgDone.bind(this))
    that.nim.sendCustomSysMsg({
      scene: 'p2p',
      to: uid,
      enablePushNick: false,
      content: JSON.stringify({
        id: 3,
        members: option.list,
        teamId: option.teamId,
        room: option.channelName,
        type: option.type
      }),
      isPushable: true,
      sendToOnlineUsersOnly: false,
      apnsText: option.nick + '正在呼叫您',
      done: function(error, msg) {
        console.log(msg);
      }
    });
  });
};

/**
 * 关闭当前合并转发消息详情页
 */

YX.fn.closeMergeMsgsContainer = function (e, a) {
  var target = $(e.target)
  target.parents('.merge-msgs-sub-container').remove()
  this._mergeMsgsOffset.pop()
  if (this._mergeMsgsOffset.length === 0) {
    $('#mergeMsgsContainer').addClass('hide')
    /** 通话中的设置 */
    var tmp = this.myNetcall;
    tmp.$goNetcall.toggleClass("hide", true);
  }
}

/**
 * 展示合并转发消息详情页（复用云记录的样式和模版）
 * @param {Object} msg 收到的合并消息
 */
YX.fn.showMergeMsg = function (e) {
  var self = this
  var mergeMsgsData = e.currentTarget.dataset

  var mergeMsgsContainer = $('#mergeMsgsContainer')
  var subContainer = document.createElement('div')
  subContainer = $(subContainer)
  subContainer.addClass('merge-msgs-sub-container')
  subContainer.load('./cloudMsg.html', function () {
    mergeMsgsContainer.removeClass('hide')
    $("#cloudMsgTitle").html(mergeMsgsData.sessionname)
    self._mergeMsgsOffset.push(0)
    self.loadMergeMsgs(mergeMsgsData, subContainer)
  })

  mergeMsgsContainer.append(subContainer)
  subContainer.delegate('.j-loadMore-mergeMsgs', 'click', this.loadMergeMsgs.bind(this, mergeMsgsData, subContainer))
};

YX.fn.loadMergeMsgs = function (data, $parent) {
  var self = this
  var i = self._mergeMsgsOffset.length - 1
  // 先获取源链，只有是短链时才用获取，getNosOriginUrl内部会校验
  nim.getNosOriginUrl({
    safeShortUrl: data.url,
    done: function (err, res) {
      if (!err) data.url = res
      $.ajax({
        type: "post",
        url: CONFIG.url + "/api/message/get",
        data: {
          url: data.url,
          md5: data.md5,
          password: data.password,
          encrypted: data.encrypted !== "false",
          limit: 10,
          offset: self._mergeMsgsOffset[i]
        },
        success: cbGetMsgs.bind(self),
        error: function (e) {
          console && console.error(e)
          $("#mergeMsgsContainer .u-status span").html('获取消息详情失败') 
        }
      })
      self._mergeMsgsOffset[i]++
    }
  })
  // 解析并展示消息，调整最上面的提示内容
  function cbGetMsgs (res) {
    var promiseArr = [], self = this
    if (!res.msg) return

    res.msg.body.forEach(function (item, i) {
      promiseArr.push(reverseMsg(item))
    })
    Promise.all(promiseArr).then(function (msgs) {
      console.log(msgs)
      var $node = $parent.find("#cloudMsgList"),
          $tip = $("#mergeMsgsContainer .u-status span")
      if (msgs.length === 0) {
        $tip.html('没有更多的消息了')          
      } else {
        if(msgs.length < 10){
          $tip.html('没有更多的消息了') 
        }else{
          $tip.html('<a class="j-loadMore-mergeMsgs">加载更多消息</a>')
        }
        var msgHtml = appUI.buildCloudMsgUI(msgs, self.cache)
        $(msgHtml).prependTo($node)
      }
    })
  }
  // TODO 该成支持低版本浏览器的方法
  function reverseMsg (raw) {
    var msg = parseMsg(JSON.parse(raw))
    // 调用SDK解析消息的方法 nim.options.Message.reverse
    msg = self.nim.options.Message.prototype.reverse(msg)
    if (msg.file && msg.file.url &&  msg.file.url.indexOf('_im_url=1')) {
      // 若开启了文件安全校验，需要将短链转成长链
      return new Promise(function (resolve, reject) {
        nim.getNosOriginUrl({
          safeShortUrl: msg.file.url,
          done: function (err, res) {
            if (!err) msg.file.url = res
            resolve(msg)
          }
        })
      })
    }
    return Promise.resolve(msg)
  }
  function parseMsg (rowMsg) {
    var msgMap = {
      "0": "scene",
      "1": "to",
      "2": "from",
      "4": "fromClientType",
      "5": "fromDeviceId",
      "6": "fromNick",
      "7": "time",
      "8": "type",
      "9": "body",
      "10": "attach",
      "11": "idClient",
      "12": "idServer",
      "13": "resend",
      "14": "userUpdateTime",
      "15": "custom",
      "16": "pushPayload",
      "17": "pushContent",
      "18": "apnsAccounts",
      "19": "apnsContent",
      "20": "apnsForcePush",
      "21": "yidunEnable",
      "22": "antiSpamContent",
      "23": "antiSpamBusinessId",
      "24": "clientAntiSpam",
      "25": "antiSpamUsingYidun",
      "26": "needMsgReceipt",
      "28": "needUpdateSession",
      "100": "isHistoryable",
      "101": "isRoamingable",
      "102": "isSyncable",
      "104": "isMuted",
      "105": "cc",
      "106": "isInBlackList",
      "107": "isPushable",
      "108": "isOfflinable",
      "109": "isUnreadable",
      "110": "needPushNick",
      "111": "isReplyMsg",
      "112": "tempTeamMemberCount"
    }
    var msg = {}
    Object.keys(rowMsg).forEach(function (item) {
      msg[msgMap[item]] = rowMsg[item]
    })
    return msg
  }
};

/**
 * 选择转发到个人或者群组
 */
YX.fn.chooseFriends = function () {
  console.log(this);

	var friendList = this.cache.getFriendslistOnShow()
  var teamList = this.cache.getTeamlist()
  this.forwardDialog.open({ friendList: friendList, teamList:teamList, cbConfirm: this.handleChooseForwardCallback, env: this, yx: this })
}

/**
 * 取消转发
 */
 YX.fn.hideForwardBtn = function () {
  document.querySelectorAll('#chatContent>div.item').forEach((item) => {
    var checkboxElement = item.querySelector('input');
    if(checkboxElement){
      item.removeChild(checkboxElement);
    }
  });
  
  $('#chatForwrdContainer').addClass('hide');
}

/**
 * 选择转发完成回调
 */
 YX.fn.handleChooseForwardCallback = function (selectedObj) {
  var that = this;
  
  function getPassward() {
    var $chars = '0123456789abcdef';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < 16; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  function serializeMsg (obj) {
    var map = {
      "scene": 0,
      "to": 1,
      "from": 2,
      "fromClientType": 4,
      "fromDeviceId": 5,
      "fromNick": 6,
      "time": 7,
      "type": 8,
      "body": 9,
      "attach": 10,
      "idClient": 11,
      "idServer": 12,
      "resend": 13,
      "userUpdateTime": 14,
      "custom": 15,
      "pushPayload": 16,
      "pushContent": 17,
      "apnsAccounts": 18,
      "apnsContent": 19,
      "apnsForcePush": 20,
      "yidunEnable": 21,
      "antiSpamContent": 22,
      "antiSpamBusinessId": 23,
      "clientAntiSpam": 24,
      "antiSpamUsingYidun": 25,
      "needMsgReceipt": 26,
      "needUpdateSession": 28,
      "replyMsgFromAccount": 29,
      "replyMsgToAccount": 30,
      "replyMsgTime": 31,
      "replyMsgIdServer": 32,
      "replyMsgIdClient": 33,
      "threadMsgFromAccount": 34,
      "threadMsgToAccount": 35,
      "threadMsgTime": 36,
      "threadMsgIdServer": 37,
      "threadMsgIdClient": 38,
      "delete": 39,
      "callbackExt": 40,
      "subType": 41,
      "yidunAntiCheating": 42,
      "env": 43,
      "isHistoryable": 100,
      "isRoamingable": 101,
      "isSyncable": 102,
      "isMuted": 104,
      "cc": 105,
      "isInBlackList": 106,
      "isPushable": 107,
      "isOfflinable": 108,
      "isUnreadable": 109,
      "needPushNick": 110,
      "isReplyMsg": 111,
      "tempTeamMemberCount": 112
    };

    var sceneMap = {
      // 单人聊天
      p2p: 0,
      // 群聊
      team: 1,
      // 超大群
      superTeam: 5
    }
    var fromClientTypeMap = {
      'Android':1,
      'iOS':2,
      'PC':4,
      'WindowsPhone':8,
      'Web':16,
      'Server':32,
      'Mac':64
    }
    var typeMap = {
      text: 0,
      image: 1,
      audio: 2,
      video: 3,
      geo: 4,
      notification: 5,
      file: 6,
      tip: 10,
      robot: 11, // robotIn
      // robotOut: 12,
      g2: 12,
      custom: 100
    }

    if(obj.text){
      obj.body = obj.text;
    }
    if(obj.scene){
      obj.scene = sceneMap[obj.scene]
    }
    if(obj.fromClientType){
      obj.fromClientType = fromClientTypeMap[obj.fromClientType]
    }
    if(obj.type){
      obj.type = typeMap[obj.type]
    }

    if(typeof obj.file === 'object'){
      obj.attach = JSON.stringify(obj.file)
    }

    var data = {}
    for (var p in map) {
      if (obj.hasOwnProperty(p)) {
        data[map[p]] = obj[p]
      }
    }
  return data
  }

  var selectedTeams = [];
  var selectedFriends = [];
  
  for (var key in selectedObj) {
    if (Object.hasOwnProperty.call(selectedObj, key)) {
      var item = selectedObj[key];
      if (item.nodeType === 'team'){
        selectedTeams.push(item);
      }
      if (item.nodeType === 'friend'){
        selectedFriends.push(item);
      }
    }
  }

  var selectedItems = document.querySelectorAll('#chatContent>.item>input:checked');
  var serializedMsgs = [];
  var messageAbstract = [];
  for (var i = 0; i < selectedItems.length; i++) {
    var item = selectedItems[i];
    var contentId = $(item).parent().data('id');
    var msg = this.cache.findMsg(this.crtSession, contentId);

    if(messageAbstract.length < 2){
      messageAbstract.push({
        message: msg.type === 'text' ? msg.text : {
          'file': '[文件]',
          'image': '[图片]',
          'audio': '[语音]',
          'video': '[视频]',
          'geo': '[定位]',
          'tip': '[提示]',
          'notification': '[通知]',
          'robot': '[机器人]',
          'custom': '[自定义]',
        }[msg.type],
        sender: msg.fromNick
      })
    }

    for (var key in msg) {
      if (Object.hasOwnProperty.call(msg, key)) {
        var prop = msg[key];
        if (typeof prop === 'boolean'){
          msg[key] = Number(prop);
        }
        if (prop === undefined) {delete msg[key]}
      }
    }
    var serializedMsg = serializeMsg(msg)
    serializedMsgs.push(serializedMsg)
  }

  var fileHeader = {
    version:0,
    message_count: serializedMsgs.length
  }

  var fileString = '';
  var encoder = new TextEncoder();
  var password = getPassward();
  var rc4 = new RC4(password);

  // 文件内容字符串拼接
  fileString = fileString + JSON.stringify(fileHeader);
  for (var i = 0; i < serializedMsgs.length; i++) {
    var msg = serializedMsgs[i];
    fileString = fileString + '\n' + JSON.stringify(msg);
  }

  // 转 utf8 字节码
  fileString = encoder.encode(fileString);
  // rc4 加密
  fileString = rc4.encrypt(fileString);
  // 字节码 转 unit8array
  fileString = new Uint8Array(fileString);

  var blob = new Blob([fileString], { type: "application/octet-stream" });   
  var browserMD5 = new browserMD5File();
  browserMD5.md5(
    blob,
    (err, fileStringMd5) => {
      if(err){
        console.log('err:', err);
      }else{
        nim.getNosToken({
          callback: (_error, tokenData)=>{
            var fileUrl = 'https://wanproxy-web.127.net/' + tokenData.bucket + '/' + tokenData.objectName + '?offset=0&complete=true&version=1.0';
      
            var xhr = new XMLHttpRequest();
            xhr.open('post', fileUrl)
      
            xhr.setRequestHeader('x-nos-token', tokenData.token);
            xhr.setRequestHeader('content-type', 'application/octet-stream');
            xhr.send(blob);
            xhr.onreadystatechange = function() {
              if (xhr.readyState !== 4) {
                return;
              }     
              if (xhr.status === 200) {
                nim.getUser({
                  account: that.accid,
                  sync: true,
                  done: function(err, selfInfo) {
                    var contentInfo = {
                      data: {
                        compressed: false,
                        encrypted: true,
                        md5: fileStringMd5,
                        messageAbstract: messageAbstract,
                        password: password,
                        url: 'https://nim-nosdn.netease.im/' + decodeURIComponent(tokenData.objectName),
                        sessionID: that.crtSessionAccount,
                        sessionName: selfInfo.nick || '',
                      },
                      type: 15,
                    };
                    var contentString = JSON.stringify(contentInfo);
            
                    selectedTeams.length && selectedTeams.map((team)=>{
                      nim.sendCustomMsg({
                        scene: "team",
                        to: team.teamid,
                        text: "[聊天记录]",
                        content: contentString,
                        pushContent: "[聊天记录]",
                        done: function(err, obj) {
                          console.log('call sendCustomMsg finish: ', err, obj);
                          that.hideForwardBtn.bind(that)();
                        }
                      })  
                    });
                    selectedFriends.length && selectedFriends.map((friend)=>{
                      nim.sendCustomMsg({
                        scene: "p2p",
                        to: friend.account,
                        text: "[聊天记录]",
                        content: contentString,
                        pushContent: "[聊天记录]",
                        done: function(err, obj) {
                          console.log('call sendCustomMsg finish: ', err, obj);
                          that.hideForwardBtn.bind(that)();
                        }
                      })  
                    });    
                  }
                });
              }
            };
          },
          nosToken: {
            nosScene: 'im',
            nosSurvivalTime: 86400
          },
          responseBody: {
            type: 'file'
          }
        });  
      }
    },
    progress => {
      console.log('progress number:', progress);
    },
  );
}
