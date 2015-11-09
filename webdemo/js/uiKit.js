(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NIMUIKit"] = factory();
	else
		root["NIMUIKit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * NIM_UI      云信web UI库
	 * ------------------------------------------------------------
	 */

	'use strict';

	var uiKit = {};

	/**
	 * list
	 */

	uiKit.SessionList = __webpack_require__(1);
	uiKit.FriendList = __webpack_require__(4);
	uiKit.TeamList = __webpack_require__(5);


	module.exports = uiKit;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * SesstionList      会话面板UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);
	var ACCOUNT;

	/**
	 * 判断会话的对象
	 * @param  {Object} msg 消息
	 * @return {String} 会话的对象
	 */
	function switchConversationUser(msg){
	    if(msg.from === msg.to){
	        return "我的手机";
	    }else{
		   return msg.to === ACCOUNT ? msg.from : msg.to;      
	    }
	}
	/**
	 * 会话列表控件
	 * @param {Object} options 控件初始化参数
	 * @property {String||Node}  parent 父节点
	 * @property {String} clazz 样式名称
	 * @property {Function} onclickitem 点击列表回调
	 * @property {Function} onclickavatar 点击列表头像回调
	 * @property {Object} data 消息数据 data.msgs 消息数据 data.unreadmsgs 未读数据 data.unreadmsgs['iostest']={count:99} data.userinfo 用户信息 data.teamInfo 群信息 data.account 当前用户账号
	 */
	var SessionList = function(options){
		var parent = options.parent,
			data = options.data,
			cbClickList = options.onclickitem||function(account,type){console.log('account:'+account+'---type:'+type);},
			cbClickPortrait = options.onclickavatar||function(account,type){console.log('account:'+account+'---type:'+type);};
		ACCOUNT = data.account;
		this._body = document.createElement('ul');
		this._body.className = options.clazz||"m-panel" +" j-session";	

		util.addEvent(this._body,'click',function(e){
			var self = this,
				evt = e||window.event,
				account,
				type,
	            target = evt.srcElement||evt.target;
	        while(self!==target){
	        	if (target.tagName.toLowerCase() === "img") {
	                var item = target.parentNode;
	                account = item.getAttribute("data-account");
	                type = item.getAttribute("data-type");
	                cbClickPortrait(account,type);
	                return;
	            }else if(target.tagName.toLowerCase() === "li"){
	        	 	account = target.getAttribute("data-account");
	                type = target.getAttribute("data-type");
	                util.removeClass(util.getNode(".j-session li.active"),'active');
	                util.addClass(target,"active");
	                var countNode = target.querySelector('.count');
	                util.addClass(countNode,"hide");
	                countNode.innerHTML = 0;
	                cbClickList(account,type);
	                return;
	            }
	            target = target.parentNode;
	        }    
		});
		this.update(data);
		if(!!parent){
			this.inject(parent);
		}
	};
	/** --------------------------public------------------------------ */

	/**
	 * 插入控件
	 * @param  {Node｜String} node 插入控件的节点
	 * @return {Void}      
	 */
	SessionList.prototype.inject = function(node){
	    var injectNode = util.getNode(node);
		injectNode.innerHTML = "";
		injectNode.appendChild(this._body);
	};

	/**
	 * 更新视图
	 * @param  {Object} data 
	 * @return {Void}   
	 */
	SessionList.prototype.update = function(data){
		var html = '',
			msgs = data.msgs,
			unreadMsg = data.unreadmsgs,
			info = data.userinfo,
			team = data.teamInfo,
			msg,nick,type,avatar,time,who,
			count,isShow;
		if (msgs.length === 0) {
			html += '<p class="empty">暂无最近联系人哦</p>';
		}else{
			for (var i = 0;i<msgs.length;i++) {
				msg = msgs[i];
				who = switchConversationUser(msg);
	            time = msg.time;
	            isShow = false;
	            count = 0;
				if (unreadMsg.hasOwnProperty(who)) {
					count = unreadMsg[who].count > 99 ? '99+' : unreadMsg[who].count;
				}
	            isShow = count === '99+' || count > 0;
				if (msg.scene === 'team') {
					nick = team[who].name||who;
					type = team[who].type||'normal';
					avatar = "images/"+type+".png";
				} else {
					nick = info[who].nick;
					avatar = util.getAvatar(info[who].avatar);
				}
	            var str = ['<li data-gtype="' + type + '" data-type="' + msg.scene + '" data-account="' + who + '">',
	                            '<img src="'+avatar+'"/>',
	                            '<div class="text">',
	                                '<p>',
	                                '<span>' + nick + '</span>',
	                                    '<b class="time">' + util.transTime2(msg.time) + '</b>',
	                                '</p>',
	                                '<p>',
	                                    '<span class="first-msg">' + buildSessionMsg(msg,info,ACCOUNT) + '</span>',
	                                    '<b class="count ' + (isShow ? '' : 'hide') + '">' + count + '</b>',
	                                '</p>',
	                            '</div>',
	                        '</li>'].join("");
				html += str;
			}    
		}
		this._body.innerHTML = html;
	};

	/**
	 * 控件销毁
	 * @return {void} 
	 */
	SessionList.prototype.destory = function(){
		//预留
	};

	/**
	* 构造第一条消息，显示在最近联系人昵称的下面
	* @param msg：消息对象
	*/
	var buildSessionMsg = function(msg,info,account) {
	    var text = (msg.scene!=='p2p'?msg.fromNick+":":""), type = msg.type;
	    if (!/text|image|file|audio|video|geo|custom|notification/i.test(type)){
	        return '';
	    }
	    switch (type) {
	        case 'text':
	            text += util.safeHtml(msg.text);
	            text = util.buildEmoji(text);
	            break;
	        case 'image':
	            text += '[图片]';
	            break;
	        case 'file':
	            if (!/exe|bat/i.test(msg.file.ext)) {
	                text += '[文件]';
	            } else {
	                text += '[非法文件，已被本站拦截]';
	            }
	            break;
	        case 'audio':
	            text += '[语音]';
	            break;
	        case 'video':
	            text += '[视频]';
	            break;
	        case 'geo':
	            text += '[位置]';
	            break;
	        case 'custom':
	            var content = JSON.parse(msg.content);
	            if(content.type===1){
	                text += '[猜拳]';
	            }else if(content.type===2){
	                text +='[阅后即焚]';
	            }else if(content.type===3){
	                text +='[贴图]';
	            }else if(content.type===4){
	                text +='[白板]';
	            }else{
	                text += '[自定义消息]';
	            }
	            break;
	        case 'notification':
	            text = '['+util.transNotification(msg,info,account)+']';
	            break;
	        default:
	            text += '[未知消息类型]';
	            break;
	    }
	    return text;
	};




	module.exports = SessionList;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * util     工具库
	 * ------------------------------------------------------------
	 */

	'use strict';
	var CONST  = __webpack_require__(3),
		emoji = CONST.emoji;

	var util = {
		getNode: function(ipt){
			if(this.isString(ipt)){
				return document.querySelector(ipt);	
			}else if(this.isElement(ipt)){
				return ipt;
			}else{
				console.error("输入参数必须为node||String");
			}
		},
		getNodes: function(string){
			return document.querySelectorAll(string);
		},
		isString: function(data){
	        return typeof(data)==='string';
	    },
	    isElement:function(obj){
	    	return !!(obj && obj.nodeType === 1);
	    },
	    isArray:Array.isArray|| function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
	  	},

		addEvent: function(node,type,callback){
			if(window.addEventListener){
				node.addEventListener(type,callback,false);
			}else{
				node.attachEvent("on"+type,callback);
			}
		},

		hasClass: function(elem, cls){
		    cls = cls || '';
		    if(cls.replace(/\s/g, '').length === 0){
		    	return false;
		    }
		    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
		},

		addClass: function(elem, cls){
			if(!elem){
				return;
			}
		    if(!this.hasClass(elem, cls)){
		        elem.className += ' ' + cls;
		    }
		},
		removeClass: function(elem, cls){
			if(!elem){
				return;
			}
		    if(this.hasClass(elem, cls)){
		        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
		        while(newClass.indexOf(' ' + cls + ' ') >= 0){
		            newClass = newClass.replace(' ' + cls + ' ', ' ');
		        }
		        elem.className = newClass.replace(/^\s+|\s+$/g, '');
		    }
		},
		safeHtml: (function(){
		    var reg = /<br\/?>$/,
		        map = {
		            r:/<|>|\&|\r|\n|\s|\'|\"/g,
		            '<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;',
		            '"':'&quot;',"'":'&#39;','\n':'<br/>','\r':''
		        };
		    return function(content){
		        content = _$encode(map,content);
		        return content.replace(reg,'<br/><br/>');
		    };
		})(),
		getAvatar:function(url){
			var re=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
			if(re.test(url)){
				return url;
			}else{
				return "images/default-icon.png";
			}
		},
		/**
		* 通过正则替换掉文本消息中的emoji表情
		* @param text：文本消息内容
		*/
		buildEmoji:function(text) {
			var re = /\[([^\]\[]*)\]/g;
			var matches = text.match(re) || [];
			for (var j = 0, len = matches.length; j < len; ++j) {
				if(emoji[matches[j]]){
					text = text.replace(matches[j], '<img class="emoji" src="images/emoji/' + emoji[matches[j]].file + '" />');
				}		
			}
			return text;
		},
		/**
		 * 群通知处理
		 * @param  {Object} item 
		 * @return {String}    
		 */
		transNotification:function(item,info,myAccount) {
		    var type = item.attach.type,
		        from = (item.from === myAccount?true:false),
		        str,
		        accounts,
		        member=[],
		        i;
		    switch (type) {
		        case 'addTeamMembers':
		            accounts = item.attach.accounts;
		            for(i = 0;i<accounts.length;i++){
		                if(accounts[i]===myAccount){
		                    member.push("你");
		                }else{
		                    member.push(info[accounts[i]].nick);
		                }
		                
		            }
		            member =  member.join(",");
		            str = from?"你将"+member+"加群":member+"加入群";
		            break;
		        case 'removeTeamMembers':
		            accounts = item.attach.accounts;
		            for(i = 0;i<accounts.length;i++){
		                if(accounts[i]===myAccount){
		                    member.push("你");
		                }else{
		                    member.push(info[accounts[i]].nick);                    
		                }
		            }
		            member =  member.join(",");
		            str = from?("你将"+member+"移除群"):(member+"被移除群");
		            break;
		        case 'leaveTeam':
		            member =  (item.from ===myAccount)?"你":item.fromNick;
		            str = member+"退出了群";
		            break;
		        case 'updateTeam':
		            var user =  (item.from ===myAccount)?"你":(item.fromNick||item.from);
		            str = user+"更新群名为"+ item.attach.team.name;
		            break;
		        default:
		            str = '群消息';
		            break;
		    }
		    return str;
		},
		/**
		 * 时间戳转化为日期（用于消息列表）
		 * @return {string} 转化后的日期
		 */
		transTime:(function(){
		    var getDayPoint = function(time){
		        time.setMinutes(0);
		        time.setSeconds(0);
		        time.setMilliseconds(0);
		        time.setHours(0);
		        var today = time.getTime();
		        time.setMonth(1);
		        time.setDate(1);
		        var yearDay = time.getTime();
		        return [today,yearDay];
		    };
		    return function(time){
		        var check = getDayPoint(new Date());
		        if (time>=check[0]){
		            return dateFormat(time,"HH:mm");
		        }else if(time<check[0]&&time>=check[1]){
		            return dateFormat(time,"MM-dd HH:mm");
		        }else{
		            return dateFormat(time,"yyyy-MM-dd HH:mm");
		        }
		    };
		})(),
		/**
		 * 时间戳转化为日期(用于左边面板)
		 * @return {string} 转化后的日期
		 */
		transTime2 :(function(){
		    var getDayPoint = function(time){
		        time.setMinutes(0);
		        time.setSeconds(0);
		        time.setMilliseconds(0);
		        time.setHours(0);
		        var today = time.getTime();
		        time.setMonth(1);
		        time.setDate(1);
		        var yearDay = time.getTime();
		        return [today,yearDay];
		    };
		    return function(time){
		        var check = getDayPoint(new Date());
		        if (time>=check[0]){
		            return dateFormat(time,"HH:mm");
		        }else if(time>=check[0]-60*1000*60*24){
		            return "昨天";
		        }else if(time>=(check[0]-2*60*1000*60*24)){
		            return "前天";
		        }else if(time>=(check[0]-7*60*1000*60*24)){
		            return "星期"+dateFormat(time,"w");
		        }else if(time>=check[1]){
		            return dateFormat(time,"MM-dd");
		        }else{
		            return dateFormat(time,"yyyy-MM-dd");
		        }
		    };
		})()
	};
	var _$encode = function(_map,_content){
	    _content = ''+_content;
	    if (!_map||!_content){
	        return _content||'';
	    }
	    return _content.replace(_map.r,function($1){
	        var _result = _map[!_map.i?$1.toLowerCase():$1];
	        return _result!=null?_result:$1;
	    });
	};
	/**
	 * 日期格式化
	 * @return string
	 */
	var dateFormat = (function(){
	    var _map = {i:!0,r:/\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g},
	        _12cc = ['上午','下午'],
	        _12ec = ['A.M.','P.M.'],
	        _week = ['日','一','二','三','四','五','六'],
	        _cmon = ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
	        _emon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
	    var _fmtnmb = function(_number){
	        _number = parseInt(_number,10)||0;
	        return (_number<10?'0':'')+_number;
	    };
	    var _fmtclc = function(_hour){
	        return _hour<12?0:1;
	    };
	    return function(_time,_format,_12time){
	        if (!_time||!_format){
	        	 return '';
	        }    
	        _time = new Date(_time);
	        _map.yyyy = _time.getFullYear();
	        _map.yy   = (''+_map.yyyy).substr(2);
	        _map.M    = _time.getMonth()+1;
	        _map.MM   = _fmtnmb(_map.M);
	        _map.eM   = _emon[_map.M-1];
	        _map.cM   = _cmon[_map.M-1];
	        _map.d    = _time.getDate();
	        _map.dd   = _fmtnmb(_map.d);
	        _map.H    = _time.getHours();
	        _map.HH   = _fmtnmb(_map.H);
	        _map.m    = _time.getMinutes();
	        _map.mm   = _fmtnmb(_map.m);
	        _map.s    = _time.getSeconds();
	        _map.ss   = _fmtnmb(_map.s);
	        _map.ms   = _time.getMilliseconds();
	        _map.w    = _week[_time.getDay()];
	        var _cc   = _fmtclc(_map.H);
	        _map.ct   = _12cc[_cc];
	        _map.et   = _12ec[_cc];
	        if (!!_12time){
	            _map.H = _map.H%12;
	        }
	        return _$encode(_map,_format);
	    };
	})();

	module.exports = util;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * ------------------------------------------------------------
	 * const    常量
	 * ------------------------------------------------------------
	 */

	'use strict';

	var CONST  = {};
	CONST.emoji={"[大笑]":{file:"emoji_0.png"},"[可爱]":{file:"emoji_01.png"},"[色]":{file:"emoji_02.png"},"[嘘]":{file:"emoji_03.png"},"[亲]":{file:"emoji_04.png"},"[呆]":{file:"emoji_05.png"},"[口水]":{file:"emoji_06.png"},"[汗]":{file:"emoji_145.png"},"[呲牙]":{file:"emoji_07.png"},"[鬼脸]":{file:"emoji_08.png"},"[害羞]":{file:"emoji_09.png"},"[偷笑]":{file:"emoji_10.png"},"[调皮]":{file:"emoji_11.png"},"[可怜]":{file:"emoji_12.png"},"[敲]":{file:"emoji_13.png"},"[惊讶]":{file:"emoji_14.png"},"[流感]":{file:"emoji_15.png"},"[委屈]":{file:"emoji_16.png"},"[流泪]":{file:"emoji_17.png"},"[嚎哭]":{file:"emoji_18.png"},"[惊恐]":{file:"emoji_19.png"},"[怒]":{file:"emoji_20.png"},"[酷]":{file:"emoji_21.png"},"[不说]":{file:"emoji_22.png"},"[鄙视]":{file:"emoji_23.png"},"[阿弥陀佛]":{file:"emoji_24.png"},"[奸笑]":{file:"emoji_25.png"},"[睡着]":{file:"emoji_26.png"},"[口罩]":{file:"emoji_27.png"},"[努力]":{file:"emoji_28.png"},"[抠鼻孔]":{file:"emoji_29.png"},"[疑问]":{file:"emoji_30.png"},"[怒骂]":{file:"emoji_31.png"},"[晕]":{file:"emoji_32.png"},"[呕吐]":{file:"emoji_33.png"},"[拜一拜]":{file:"emoji_160.png"},"[惊喜]":{file:"emoji_161.png"},"[流汗]":{file:"emoji_162.png"},"[卖萌]":{file:"emoji_163.png"},"[默契眨眼]":{file:"emoji_164.png"},"[烧香拜佛]":{file:"emoji_165.png"},"[晚安]":{file:"emoji_166.png"},"[强]":{file:"emoji_34.png"},"[弱]":{file:"emoji_35.png"},"[OK]":{file:"emoji_36.png"},"[拳头]":{file:"emoji_37.png"},"[胜利]":{file:"emoji_38.png"},"[鼓掌]":{file:"emoji_39.png"},"[握手]":{file:"emoji_200.png"},"[发怒]":{file:"emoji_40.png"},"[骷髅]":{file:"emoji_41.png"},"[便便]":{file:"emoji_42.png"},"[火]":{file:"emoji_43.png"},"[溜]":{file:"emoji_44.png"},"[爱心]":{file:"emoji_45.png"},"[心碎]":{file:"emoji_46.png"},"[钟情]":{file:"emoji_47.png"},"[唇]":{file:"emoji_48.png"},"[戒指]":{file:"emoji_49.png"},"[钻石]":{file:"emoji_50.png"},"[太阳]":{file:"emoji_51.png"},"[有时晴]":{file:"emoji_52.png"},"[多云]":{file:"emoji_53.png"},"[雷]":{file:"emoji_54.png"},"[雨]":{file:"emoji_55.png"},"[雪花]":{file:"emoji_56.png"},"[爱人]":{file:"emoji_57.png"},"[帽子]":{file:"emoji_58.png"},"[皇冠]":{file:"emoji_59.png"},"[篮球]":{file:"emoji_60.png"},"[足球]":{file:"emoji_61.png"},"[垒球]":{file:"emoji_62.png"},"[网球]":{file:"emoji_63.png"},"[台球]":{file:"emoji_64.png"},"[咖啡]":{file:"emoji_65.png"},"[啤酒]":{file:"emoji_66.png"},"[干杯]":{file:"emoji_67.png"},"[柠檬汁]":{file:"emoji_68.png"},"[餐具]":{file:"emoji_69.png"},"[汉堡]":{file:"emoji_70.png"},"[鸡腿]":{file:"emoji_71.png"},"[面条]":{file:"emoji_72.png"},"[冰淇淋]":{file:"emoji_73.png"},"[沙冰]":{file:"emoji_74.png"},"[生日蛋糕]":{file:"emoji_75.png"},"[蛋糕]":{file:"emoji_76.png"},"[糖果]":{file:"emoji_77.png"},"[葡萄]":{file:"emoji_78.png"},"[西瓜]":{file:"emoji_79.png"},"[光碟]":{file:"emoji_80.png"},"[手机]":{file:"emoji_81.png"},"[电话]":{file:"emoji_82.png"},"[电视]":{file:"emoji_83.png"},"[声音开启]":{file:"emoji_84.png"},"[声音关闭]":{file:"emoji_85.png"},"[铃铛]":{file:"emoji_86.png"},"[锁头]":{file:"emoji_87.png"},"[放大镜]":{file:"emoji_88.png"},"[灯泡]":{file:"emoji_89.png"},"[锤头]":{file:"emoji_90.png"},"[烟]":{file:"emoji_91.png"},"[炸弹]":{file:"emoji_92.png"},"[枪]":{file:"emoji_93.png"},"[刀]":{file:"emoji_94.png"},"[药]":{file:"emoji_95.png"},"[打针]":{file:"emoji_96.png"},"[钱袋]":{file:"emoji_97.png"},"[钞票]":{file:"emoji_98.png"},"[银行卡]":{file:"emoji_99.png"},"[手柄]":{file:"emoji_100.png"},"[麻将]":{file:"emoji_101.png"},"[调色板]":{file:"emoji_102.png"},"[电影]":{file:"emoji_103.png"},"[麦克风]":{file:"emoji_104.png"},"[耳机]":{file:"emoji_105.png"},"[音乐]":{file:"emoji_106.png"},"[吉他]":{file:"emoji_107.png"},"[火箭]":{file:"emoji_108.png"},"[飞机]":{file:"emoji_109.png"},"[火车]":{file:"emoji_110.png"},"[公交]":{file:"emoji_111.png"},"[轿车]":{file:"emoji_112.png"},"[出租车]":{file:"emoji_113.png"},"[警车]":{file:"emoji_114.png"},"[自行车]":{file:"emoji_115.png"}};

	module.exports = CONST;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * FriendList      好友列表UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);

	var ACCOUNT;

	/**
	 * 好友列表控件
	 * @param {Object} options 控件初始化参数
	 * @property {String||Node}  parent 父节点
	 * @property {String} clazz 样式名称
	 * @property {Function} onclickitem 点击列表回调
	 * @property {Function} onclickavatar 点击列表头像回调
	 * @property {Object} data 消息数据 data.friends 好友数据 data.friends  data.userinfo 用户信息 data.account 当前用户账号
	 */
	var FriendList = function(options){
		var parent = options.parent,
			data = options.data,
			cbClickList = options.onclickitem||function(account,type){console.log('account:'+account+'---type:'+type);},
			cbClickPortrait = options.onclickavatar||function(account,type){console.log('account:'+account+'---type:'+type);};
		ACCOUNT = data.account;
		this._body = document.createElement('ul');
		this._body.className = options.clazz||"m-panel" +" j-friend";	

		util.addEvent(this._body,'click',function(e){
			var self = this,
				evt = e||window.event,
				account,
				type,
	            target = evt.srcElement||evt.target;
	        while(self!==target){
	        	if (target.tagName.toLowerCase() === "img") {
	                var item = target.parentNode;
	                account = item.getAttribute("data-account");
	                type = item.getAttribute("data-type");
	                cbClickPortrait(account,type);
	                return;
	            }else if(target.tagName.toLowerCase() === "li"){
	        	 	account = target.getAttribute("data-account");
	                type = target.getAttribute("data-type");
	                util.removeClass(util.getNode(".j-friend li.active"),'active');
	                util.addClass(target,"active");
	                cbClickList(account,type);
	                return;
	            }
	            target = target.parentNode;
	        }    
		});
		this.update(data);
		if(!!parent){
			this.inject(parent);
		}
	};
	/** --------------------------public------------------------------ */

	/**
	 * 插入控件
	 * @param  {Node｜String} node 插入控件的节点
	 * @return {Void}      
	 */
	FriendList.prototype.inject = function(node){
		var injectNode = util.getNode(node);
		injectNode.innerHTML = "";
		injectNode.appendChild(this._body);
	};

	/**
	 * 更新视图
	 * @param  {Object} data 
	 * @return {Void}   
	 */
	FriendList.prototype.update = function(data){
		var html="",
			list = data.friends;
		for (var i = 0; i < list.length; i++) {
			if (list[i].account !== ACCOUNT) {
	            html += ['<li data-type="p2p" data-account="' + list[i].account + '">',
	                        '<img src="'+util.getAvatar(list[i].avatar)+'"/>',
	                        '<div class="text">',
	                            '<p class="nick">',
	                                '<span>' + list[i].nick+'</span>',
	                            '</p>',
	                        '</div>',
	                    '</li>'].join("");
			}	
		}
		this._body.innerHTML = html;
	};

	/**
	 * 控件销毁
	 * @return {void} 
	 */
	FriendList.prototype.destory = function(){
		//预留
	};




	module.exports = FriendList;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * TeamList      群组列表UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);

	/**
	 * 群组列表控件
	 * @param {Object} options 控件初始化参数
	 * @property {String||Node}  parent 父节点
	 * @property {String} clazz 样式名称
	 * @property {Function} onclickitem 点击列表回调
	 * @property {Function} onclickavatar 点击列表头像回调
	 * @property {Object} data 消息数据 data.teams 群组数据
	 */
	var TeamList = function(options){
		var parent = options.parent,
			data = options.data,
			cbClickList = options.onclickitem||function(account,type){console.log('account:'+account+'---type:'+type);},
			cbClickPortrait = options.onclickavatar||function(account,type){console.log('account:'+account+'---type:'+type);};

		this._body = document.createElement('ul');
		this._body.className = options.clazz||"m-panel" +" j-team";	

		util.addEvent(this._body,'click',function(e){
			var self = this,
				evt = e||window.event,
				account,
				type,
	            target = evt.srcElement||evt.target;
	        while(self!==target){
	        	if (target.tagName.toLowerCase() === "img") {
	                var item = target.parentNode;
	                account = item.getAttribute("data-account");
	                type = item.getAttribute("data-type");
	                cbClickPortrait(account,type);
	                return;
	            }else if(target.tagName.toLowerCase() === "li"){
	        	 	account = target.getAttribute("data-account");
	                type = target.getAttribute("data-type");
	                util.removeClass(util.getNode(".j-team li.active"),'active');
	                util.addClass(target,"active");
	                cbClickList(account,type);
	                return;
	            }
	            target = target.parentNode;
	        }    
		});
		this.update(data);
		if(!!parent){
			this.inject(parent);
		}
	};

	/** --------------------------public------------------------------ */

	/**
	 * 插入控件
	 * @param  {Node｜String} node 插入控件的节点
	 * @return {Void}      
	 */
	TeamList.prototype.inject = function(node){
		var injectNode = util.getNode(node);
	    injectNode.innerHTML = "";
	    injectNode.appendChild(this._body);
	};

	/**
	 * 更新视图
	 * @param  {Object} data 
	 * @return {Void}   
	 */
	TeamList.prototype.update = function(data){
		var tmp1 = '<div class="team normal-team"><div class="team-title">普通群</div><ul id="normalTeam">',
	        tmp2 = '<div class="team advanced-team"><div class="team-title">高级群</div><ul id="advanceTeam">',
	        flag1 = false,
	        flag2 = false,
	        html = '',
	        teams = data.teams;
	        if (teams && teams.length > 0) {
	            for (var i = 0, l = teams.length; i < l; ++i) {
	                if (teams[i].type === 'normal') {
	                    flag1 = true;
	                    tmp1 += '<li data-gtype="normal" data-type="team" data-account="' + teams[i].teamId + '"><img src="images/normal.png"/><div class="text">';
	                    tmp1 += '<p class="nick"><span>' + teams[i].name||teams[i].teamId + '</span><b class="hide count"></b></p><p class="first-msg"></p></div></li>';
	                } else if (teams[i].type === 'advanced') {
	                    flag2 = true;
	                    tmp2 += '<li data-gtype="advanced" data-type="team" data-account="' + teams[i].teamId + '"><img src="images/advanced.png"/><div class="text">';
	                    tmp2 += '<p class="nick"><span>' + teams[i].name||teams[i].teamId + '</span><b class="hide count"></b></p><p class="first-msg"></p></div></li>';
	                }
	            }
	            tmp1 += '</ul></div>';
	            tmp2 += '</ul></div>';
	            if (flag1 && flag2) {
	                html = tmp2 + tmp1;
	            } else if (flag1 && !flag2) {
	                html = tmp1;
	            } else if (!flag1 && flag2) {
	                html = tmp2;
	            } else {
	                html = '<p>暂时还没有群哦</p>';
	            }
	        } else {
	            html = '<p>暂时还没有群哦</p>';
	        }
		this._body.innerHTML = html;
	};

	/**
	 * 控件销毁
	 * @return {void} 
	 */
	TeamList.prototype.destory = function(){
		//预留
	};




	module.exports = TeamList;

/***/ }
/******/ ])
});
;