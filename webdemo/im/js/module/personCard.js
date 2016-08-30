'use strict'
YX.fn.personCard = function () {
	// 初始化节点事件
	this.myInfoEvt()
    this.personInfoEvt()
    //日期控件
    $("#datepicker").datepicker({dateFormat: "yy-mm-dd"})
}
/*****************************
 * 个人信息相关
 ******************************/
YX.fn.myInfoEvt = function () {
	//个人信息
    this.$myInfo = $('#myInfo')

    //修改头像
    this.$modifyAvatar = $('#modifyAvatar')
    //弹出我的信息
    $('#showMyInfo').on('click',this.showMyInfo.bind(this))
    this.$myInfo.delegate('.j-close', 'click', this.hideMyInfoBox.bind(this))
    this.$myInfo.delegate('.operate .j-edit', 'click', this.showEditMyInfo.bind(this))
    this.$myInfo.delegate('.operate .j-cancel', 'click', this.hideEditMyInfo.bind(this))
    this.$myInfo.delegate('.operate .j-save', 'click', this.saveEditMyInfo.bind(this))
    this.$myInfo.delegate('.j-modifyAvatar', 'click', this.showModifyAvatar.bind(this,"my"))
    //修改头像
    this.$modifyAvatar.delegate('.j-close', 'click', this.hideModifyAvatar.bind(this))
    this.$modifyAvatar.delegate('.j-choseFile, .j-reupload', 'click', this.doClickModifyAvatar.bind(this))
    this.$modifyAvatar.delegate('.j-save', 'click', this.doSaveAvatar.bind(this))
    this.$modifyAvatar.delegate('.j-upload','change', this.viewAvatar.bind(this))
    
}
YX.fn.showMyInfo = function () {
    var user = this.cache.getUserById(userUID)
    var $node = this.$myInfo.data({info:user})
    $node.find(".u-icon").attr('src', getAvatar(user.avatar))
    $node.find(".j-nick").text(user.nick)
    $node.find(".j-nickname").text(user.nick)
    var avatarSrc=""
    if(user.gender&&user.gender!=="unknown"){
        avatarSrc = 'images/'+user.gender+'.png'
        $node.find(".j-gender").removeClass("hide")
    }else{
        $node.find(".j-gender").addClass("hide")
    }
    $node.find(".j-gender").attr('src',avatarSrc)
    $node.find(".j-username").text("帐号："+user.account)
    $node.find(".j-birth").text(user.birth ===undefined?"--":user.birth||"--")
    $node.find(".j-tel").text(user.tel ===undefined?"--":user.tel||"--")
    $node.find(".j-email").text(user.email ===undefined?"--":user.email||"--")
    $node.find(".j-sign").text(user.sign ===undefined?"--":user.sign||"--")
    $node.removeClass('hide')
    this.$mask.removeClass('hide')
}
YX.fn.hideMyInfoBox = function(){
    this.$myInfo.addClass('hide')
    this.$myInfo.removeClass('edit')
    this.$mask.addClass('hide')
}
YX.fn.showEditMyInfo = function(){
    var $node = this.$myInfo,
        user = $node.data("info")
    $node.find(".e-nick").val(user.nick)
    $node.find(".e-gender").val(user.gender)
    if(user.birth !==undefined){
        $node.find(".e-birth").val(user.birth)
    }
    if(user.tel !==undefined){
        $node.find(".e-tel").val(user.tel)
    }
    if(user.email !==undefined){
        $node.find(".e-email").val(user.email)
    }
    if(user.sign !==undefined){
        $node.find(".e-sign").val(user.sign)
    }
    this.$myInfo.addClass('edit')
}
YX.fn.hideEditMyInfo = function(){
    this.$myInfo.removeClass('edit')
}

YX.fn.saveEditMyInfo = function(){
    var $node = this.$myInfo
    var nick = $node.find(".e-nick").val().trim()
    if(!nick){
        alert("昵称不能为空")
        return
    }
    var gender = $node.find(".e-gender").val()
    var birth = $node.find(".e-birth").val().trim()
    var tel = $node.find(".e-tel").val().trim()
    var email = $node.find(".e-email").val().trim()
    if(email&&!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)){
         alert("email格式不正确")
        return
    }
    var sign  = $node.find(".e-sign").val().trim()
    this.mysdk.updateMyInfo(nick,gender,birth,tel,email,sign,this.cbSaveMyInfo.bind(this))
}

YX.fn.cbSaveMyInfo = function(err,data){
    if(err){
        alert(err)
    }else{
        data.account = userUID
        this.cache.updatePersonlist(data)
        this.showMe()
        this.$myInfo.removeClass("edit")
        this.showMyInfo()

    }
}
/*****************************
 * 用户信息
 ******************************/
YX.fn.personInfoEvt = function () {
    //用户信息
    this.$personCard = $('#personCard')
    //聊天内容 点击头像
    this.$chatContent.delegate('.j-img','click',this.showInfoInChat)
    //聊天面板外头像
    $("#headImg").on('click',this.showInfo2.bind(this))
    // 帐号信息面板事件
    this.$personCard.delegate('.j-close', 'click', this.hideInfoBox.bind(this))
    this.$personCard.delegate('.j-saveAlias', 'click', this.addFriendAlias.bind(this))
    this.$personCard.delegate('.j-add', 'click', this.addFriendInBox.bind(this))
    this.$personCard.delegate('.j-del', 'click', this.removeFriend.bind(this))
    this.$personCard.delegate('.j-chat', 'click', this.doChat.bind(this))
    this.$personCard.delegate('.mutelist>.u-switch', 'click', this.doMutelist.bind(this))
    this.$personCard.delegate('.blacklist>.u-switch', 'click', this.doBlacklist.bind(this))
    this.$personCard.delegate('.mute>.u-switch', 'click', this.doMute.bind(this))
}
 // 好友备注
YX.fn.addFriendAlias = function () {
    var account = this.$personCard.data("account")
    var alias = this.$personCard.find(".e-alias").val().trim()
    this.mysdk.updateFriend(account,alias,this.cbAddFriendAlias.bind(this))
}
YX.fn.cbAddFriendAlias = function(err,data){
    if(!err){
        alert("修改备注成功")
        this.$personCard.find(".e-alias").val(data.alias)
        this.cache.updateFriendAlias(data.account,data.alias)
        this.$personCard.find(".j-nick").text(this.getNick(data.account))
        if (this.crtSessionAccount === data.account) { 
            this.$nickName.text(this.getNick(data.account))
        }
        // 左边版本重绘下
        if(this.buildSessions){
            this.buildSessions()    
        } 
        if(this.buildFriends){
            this.buildFriends()    
        }
    }else{
        alert("修改备注失败")
    }
}
YX.fn.addFriendInBox = function(){
    // if(this.$personCard.is(".blacklist")){
    //     return
    // }
    var account = this.$personCard.data("account")
    this.mysdk.addFriend(account,this.cbAddFriendInBox.bind(this))
}
YX.fn.cbAddFriendInBox = function(error, params){
    if(!error){
       this.hideInfoBox()
       this.cache.addFriend(params.friend)
       if(this.buildFriends){
            this.buildFriends()    
        }
   }else{
        alert("添加好友失败")
   }
}
YX.fn.removeFriend = function(){
    if(window.confirm("确定要删除")){
        var account = this.$personCard.data("account")
        this.mysdk.deleteFriend(account,this.cbRemoveFriend.bind(this))
    }
    
}
YX.fn.cbRemoveFriend = function(error, params){
   if(!error){
       this.hideInfoBox()
       this.cache.removeFriend(params.account)
        if (this.crtSessionAccount === params.account) { 
            this.$nickName.text(this.getNick(params.account))
        }   
        if(this.buildFriends){
            this.buildFriends()    
        }
   }else{
    alert("删除好友失败")
   }
}
YX.fn.doChat = function(){
    var account = this.$personCard.data("account")
    this.hideInfoBox()
    var $container
    if(!this.$sessionsWrap.is('.hide')){
        $container = this.$sessionsWrap
    }else if(!this.$friendsWrap.is('.hide')){
        $container = this.$friendsWrap
    }else{
       this.openChatBox(account,"p2p")
       return
    }
    var $li = $container.find('.m-panel li[data-account="'+account+'"]')
    if($li.length>0){
        $li.find(".count").addClass("hide")
        $li.find(".count").text(0)
    }

    this.openChatBox(account,"p2p")
}
YX.fn.doMutelist = function () {
    if(this.$personCard.is(".blacklist")){
        return
    }
    var account = this.$personCard.data("account"),
        status = !this.$personCard.data("inMutelist")
    this.mysdk.markInMutelist(account,status,this.cbDoMutelist.bind(this))

}
YX.fn.cbDoMutelist = function(err,data){
    if(!err){
        if(data.isAdd){
            this.cache.addToMutelist(data.record)
            this.$personCard.data("inMutelist",true)
        }else{
            this.cache.removeFromMutelist(data.account)
            this.$personCard.data("inMutelist",false)
        }
        this.$personCard.find(".mutelist .u-switch").toggleClass("off")          
    }else{
        alert("操作失败")
    }
}
YX.fn.doBlacklist = function(){
    var account = this.$personCard.data("account"),
        status = !this.$personCard.data("inBlacklist")
        this.mysdk.markInBlacklist(account,status,this.cbDoBlacklist.bind(this))
}
YX.fn.cbDoBlacklist = function(err,data){
    if(!err){
        if(data.isAdd){
            this.cache.addToBlacklist(data.record)
            this.$personCard.data("inBlacklist",true)
            this.$personCard.addClass("blacklist")
        }else{
            this.cache.removeFromBlacklist(data.account)
            this.$personCard.data("inBlacklist",false)
            this.$personCard.removeClass("blacklist")
        }
        this.$personCard.find(".blacklist .u-switch").toggleClass("off")
        // 左边版本重绘下黑名单要藏起来
        if(this.buildSessions){
            this.buildSessions()    
        } 
        if(this.buildFriends){
            this.buildFriends()    
        }       
    }else{
        alert("操作失败")
    }
}
//群静音
YX.fn.doMute = function(){
    var account = this.$personCard.data("account"),
        status = !this.$personCard.data("teamMute")
    this.mysdk.updateMuteStateInTeam(this.crtSessionAccount,account,status,this.cbDoMute.bind(this))

}
YX.fn.cbDoMute = function(err,data){
    if(!err){
        var status = data.mute?true:false
        this.$personCard.data('teamMute',status)
        this.$personCard.find(".mute .u-switch").toggleClass("off")          
    }else{
        alert("操作失败")
    }
}
/*******************
 * 修改头像相关
 ********************/
YX.fn.showModifyAvatar = function (type) {
    if(type==="my"){
        this.$myInfo.addClass("hide")
        this.$modifyAvatar.removeClass("hide")
        this.$modifyAvatar.addClass("j-my")
    }else if(type==="team"){
        if($(".j-teamAvatar").hasClass("active")&&this.$teamInfo.data('gtype')==='advanced'){
            this.$modifyAvatar.removeClass("hide")
            this.$modifyAvatar.addClass("j-team")
            this.$mask.removeClass('hide')
        }
    }
}
YX.fn.hideModifyAvatar = function () {
    this.resetCorpAvatar()
    if(this.$modifyAvatar.hasClass('j-my')){
        this.$modifyAvatar.addClass("hide")
        this.$myInfo.removeClass("hide") 
        this.$modifyAvatar.removeClass("j-my")     
    }else{
        this.$modifyAvatar.addClass("hide")
        this.$mask.addClass('hide')
        this.$modifyAvatar.removeClass("j-team")  
    }
}
YX.fn.resetCorpAvatar = function () {
    this.corpParameters = null
    this.avatarUrl = null
    if(!!this.modifyAvatar){
        this.modifyAvatar.disable()     
    }
    this.$modifyAvatar.find(".big img").attr("src","").addClass("hide")
    this.$modifyAvatar.find(".small img").attr("src","").addClass("hide")
    $('#cropImg img').attr("src","").addClass("hide")
    this.$modifyAvatar.find(".choseFileCtn").removeClass("hide")
}
YX.fn.viewAvatar = function () {
    var fileInput = this.$modifyAvatar.find(".j-upload").get(0)
    if(fileInput.files.length === 0){
        return
    }
    this.mysdk.previewImage({fileInput:fileInput,callback:this.cbUploadAvatar.bind(this)})
}
YX.fn.cbUploadAvatar = function (err,data) {
    if(err){
        alert(err)
        return
    }else{
        if(data.w<300||data.h<300){
            alert("图片长宽不能小于300")
            return
        }
        this.showPreAvatar(data.url)
    }
}
YX.fn.showPreAvatar = function (url) {
    var that = this,
        preUrl,
        $choseFileCtn = this.$modifyAvatar.find(".choseFileCtn"),
        $preBig = this.$modifyAvatar.find(".big img"),
        $preSmall = this.$modifyAvatar.find(".small img"),
        $cropImgContainer = $('#cropImg'),
        $cropImg = $cropImgContainer.find("img")
    $choseFileCtn.addClass("hide")
    this.avatarUrl =url
    preUrl = url+"?imageView&thumbnail=300y300"
    $preBig.attr("src",preUrl).removeClass("hide")
    $preSmall.attr("src",preUrl).removeClass("hide")
    $cropImg.attr("src",preUrl).removeClass("hide")
     $preBig.css({
        width:160,
        height:160
    })
    $preSmall.css({
        width:40,
        height:40
    })
}
YX.fn.doClickModifyAvatar = function () {
    //置空节点避免2次上传无响应
    this.$modifyAvatar.find(".j-uploadForm").get(0).reset()
    this.$modifyAvatar.find(".j-choseFile").val(null)
    this.$modifyAvatar.find(".j-upload").click()

}
YX.fn.doSaveAvatar = function () {
    var url
    var that = this
    if(!!this.avatarUrl){
        if(this.$modifyAvatar.hasClass('j-my')){
            this.mysdk.updateMyAvatar(this.avatarUrl,this.cbSaveMyAvatar.bind(this))
        }else{
            this.mysdk.updateTeam({
                teamId: this.crtSessionAccount,
                avatar: this.avatarUrl,
                done: function(error, data) {
                    if (!error) {
                        var url = data.avatar
                        $(".j-teamAvatar")[0].src = url+"?imageView&thumbnail=40y40"
                        $("#headImg")[0].src = url+"?imageView&thumbnail=56y56"
                        that.hideModifyAvatar()
                    } else {
                        alert('修改群头像失败')
                    }
                }
            })
        }
    }else{
        alert("请上传一张头像")
    }
}
YX.fn.cbSaveMyAvatar = function (err,data) {
    if(err){
        alert("修改头像失败")
        console.log(err)
    }else{
        this.cache.updateAvatar(data.avatar)
        this.hideModifyAvatar()
        this.showMyInfo()
        this.showMe()
    }
}
/**
 * 用户名片
 */
YX.fn.showInfo = function (account,type) {
	if(type=="p2p"){
        var user = this.cache.getUserById(account)
        this.showInfoBox(user) 
    }
}
// 从聊天面板头部头像点进去
YX.fn.showInfo2 = function(){
    if(this.crtSessionType==="p2p"){
        var account = this.crtSessionAccount
        var user = this.cache.getUserById(account)
        this.showInfoBox(user) 
    }
}
// 从聊天面板头像点进去
YX.fn.showInfoInChat = function(account){
    var account = $(this).attr('data-account'),
        user = yunXin.cache.getUserById(account)
    if(account==userUID){
        return
    }
    if(yunXin.$teamInfo.data('gtype')==='advanced'){
        yunXin.showInfoBox(user,'team') 
    }else{
        yunXin.showInfoBox(user) 
    }
}

YX.fn.showInfoBox = function(user,type){
    if(user.account === userUID){
        this.showMyInfo()
        return
    }
    //高级群禁言功能
    var teamMute = false
    if(type==="team"){
        var isManager = this.cache.isTeamManager(userUID,this.crtSessionAccount)
        if(isManager){
            $('#setTeamMute').removeClass('hide')
            teamMute = this.cache.getTeamMemberInfo(user.account,this.crtSessionAccount).mute
        }else{
            $('#setTeamMute').addClass('hide')
        }
    }else{
        $('#setTeamMute').addClass('hide')
    }
    var isFriend = this.cache.isFriend(user.account)
    var inMutelist = this.cache.inMutelist(user.account)
    var inBlacklist = this.cache.inBlacklist(user.account)
    var $node = this.$personCard.data({account:user.account,inMutelist:inMutelist?true:false,inBlacklist:inBlacklist?true:false,teamMute:teamMute})
    $node.find(".u-icon").attr('src', getAvatar(user.avatar))
    $node.find(".j-nickname").text("昵称："+user.nick)
    $node.find(".j-nick").text(this.getNick(user.account))
    var avatarSrc =""
    if(user.gender&&user.gender!=="unknown"){
        avatarSrc = 'images/'+user.gender+'.png'
        $node.find(".j-gender").removeClass("hide")
    }else{
        $node.find(".j-gender").addClass("hide")
    }
    $node.find(".j-gender").attr('src',avatarSrc)
    $node.find(".j-username").text("帐号："+user.account)
    $node.find(".j-birth").text(user.birth ===undefined?"--":user.birth)
    $node.find(".j-tel").text(user.tel ===undefined?"--":user.tel)
    $node.find(".j-email").text(user.email ===undefined?"--":user.email)
    $node.find(".j-sign").text(user.sign ===undefined?"--":user.sign)
    if(inMutelist){
         $node.find(".mutelist>.u-switch").addClass('off')
    }
    if(!inBlacklist){
        $node.find(".blacklist>.u-switch").addClass('off')
    }else{
        $node.addClass('blacklist')
    }
    if(!isFriend){
        $node.addClass("notFriend")
    }else{
        var alias = this.cache.getFriendAlias(user.account)
        $node.find(".e-alias").val(alias)
    }
    if(teamMute){
        $node.find(".mute>.u-switch").removeClass('off')
    }else{
        $node.find(".mute>.u-switch").addClass('off')
    }
    $node.removeClass('hide')
    this.$mask.removeClass('hide')
}
YX.fn.hideInfoBox = function(){
    this.$personCard.addClass('hide')
    this.$mask.addClass('hide')
    this.$personCard.removeClass('notFriend')
    this.$personCard.removeClass('blacklist')
    this.$personCard.find(".mutelist .u-switch").removeClass('off')
    this.$personCard.find(".blacklist .u-switch").removeClass('off')        
}
