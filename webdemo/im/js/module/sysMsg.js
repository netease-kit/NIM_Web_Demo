/**
 * 系统消息
 */
'use strict'
YX.fn.sysMsg = function () {
	//消息中心
	this.$notice = $('#notice')
	$("#showNotice").on('click',this.clickNotice.bind(this))
    this.$notice.delegate('.j-close', 'click', this.hideNotice.bind(this))
    this.$notice.delegate('.j-reject', 'click', this.rejectNotice.bind(this))
    this.$notice.delegate('.j-apply', 'click', this.acceptNotice.bind(this))
    this.$notice.delegate('.j-rmAllSysNotice', 'click', this.rmAllSysNotice.bind(this))
    this.$notice.delegate('.tab li', 'click', this.changeNotice.bind(this))
}
/*********************************************
 * 消息中心红点
 *********************************************/
YX.fn.showSysMsgCount = function () {
    var $node = $("#showNotice .count")
    var count = this.cache.getSysMsgCount()
    if(this.$notice.hasClass("hide")){
        if(count>0){
            $node.removeClass("hide").text(count)
        }else{
            $node.addClass("hide").text(count)
        }
    }else{
        this.cache.setSysMsgCount(0)
    }
}
YX.fn.clickNotice = function () {
    var that = this
    this.cache.setSysMsgCount(0)
    this.showSysMsgCount()
    if(this.firstLoadSysMsg){
        this.mysdk.getLocalSysMsgs(function(error, obj){
            if(!error){
                if(obj.sysMsgs.length>0){
                    that.cache.setSysMsgs(obj.sysMsgs) 
                }
                that.firstLoadSysMsg = false
                that.showNotice()
            }else{
                alert("获取系统消息失败")
            }
        })
    }else{
        this.showNotice()
    }    
}
YX.fn.showNotice = function(){
    this.buildSysNotice()
    this.buildCustomSysNotice()
    this.$notice.removeClass('hide')
    this.$mask.removeClass("hide")
    document.documentElement.style.overflow = 'hidden'
}
YX.fn.buildSysNotice = function () {
    var data = this.cache.getSysMsgs(),
        array = [],
        that = this
    //确保用户信息存在缓存中
    for(var i=0; i<data.length; i++){
        if(!this.cache.getUserById(data[i].from)){
            array.push(data[i].from)
        }
    }
    if(array.length>0){
        this.mysdk.getUsers(array,function(err,data){
            for (var i = data.length - 1; i >= 0; i--) {
                that.cache.setPersonlist(data[i])
            }
        })
    }
    var html = appUI.buildSysMsgs(data,this.cache)
    this.$notice.find('.j-sysMsg').html(html)
}
YX.fn.buildCustomSysNotice = function(){
    var data = this.cache.getCustomSysMsgs()
    var html = appUI.buildCustomSysMsgs(data,this.cache)
    this.$notice.find('.j-customSysMsg').html(html)
},
YX.fn.hideNotice = function () {
    this.$notice.addClass('hide')
    this.$mask.addClass("hide")
    document.documentElement.style.overflow=''
},
YX.fn.changeNotice = function (evt) {
    var $node = this.$notice
    var $crt = $(evt.target)
    $node.find(".tab li").removeClass("crt")
    $crt.addClass("crt")
    if($crt.attr("data-value")==="sys"){
        $node.find(".j-sysMsg").removeClass("hide")
        $node.find(".j-customSysMsg").addClass("hide")
    }else{
        $node.find(".j-sysMsg").addClass("hide")
        $node.find(".j-customSysMsg").removeClass("hide")
    }
},
YX.fn.acceptNotice = function (evt) {
    var $node = $(evt.target).parent(),
        teamId = $node.attr("data-id"),
        from = $node.attr("data-from"),
        type = $node.attr("data-type"),
        idServer = $node.attr("data-idServer")
    if(type ==="teamInvite"){
        this.mysdk.acceptTeamInvite(teamId,from,idServer)
    }else{
        this.mysdk.passTeamApply(teamId,from,idServer)     
    }      
    
},       
YX.fn.rejectNotice = function (evt) {
    var $node = $(evt.target).parent(),
        teamId = $node.attr("data-id"),
        from = $node.attr("data-from"),
        type = $node.attr("data-type"),
        idServer = $node.attr("data-idServer")
    if(type ==="teamInvite"){
        this.mysdk.rejectTeamInvite(teamId,from,idServer)      
    }else{
        this.mysdk.rejectTeamApply(teamId,from,idServer) 
    }
},
YX.fn.rmAllSysNotice = function (){
    var that = this
    var type = this.$notice.find(".tab .crt").attr("data-value")
    if(type ==="sys"){
        this.mysdk.deleteAllLocalSysMsgs(function(err,obj){
            if(err){
                alert("删除失败")
            }else{
               that.cache.setSysMsgs([])
               that.buildSysNotice()
            }
        })
   }else{
    this.cache.deleteCustomSysMsgs()
    this.buildCustomSysNotice()
   }
}