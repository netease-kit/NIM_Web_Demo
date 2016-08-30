/*
* 好友相关
*/

'use strict'

YX.fn.friend = function () {
     //添加好友
    this.$addFriend = $('#addFriend')
    this.$addFriendBox = $('#addFriendBox')
    this.$addFriend.on('click',this.showAddFriend.bind(this))
    this.$addFriendBox.delegate('.j-close', 'click', this.hideAddFriend.bind(this))
    this.$addFriendBox.delegate('.j-search','click',this.searchFriend.bind(this))
    this.$addFriendBox.delegate('.j-back','click',this.resetSearchFriend.bind(this))
    this.$addFriendBox.delegate('.j-add','click',this.addFriend.bind(this))
    this.$addFriendBox.delegate('.j-blacklist','click',this.rmBlacklist.bind(this))
    this.$addFriendBox.delegate('.j-chat','click',this.beginChat.bind(this)) 
    this.$addFriendBox.delegate('.j-account','keydown',this.inputAddFriend.bind(this))
    //黑名单
    this.$blacklist = $('#blacklist')  
    $("#showBlacklist").on('click',this.showBlacklist.bind(this))
    this.$blacklist.delegate('.j-close', 'click', this.hideBlacklist.bind(this))
    this.$blacklist.delegate('.items .j-rm', 'click', this.removeFromBlacklist.bind(this))
    //我的手机
    $("#myPhone").on('click',this.sendToMyPhone.bind(this))
}
/**
 * 通讯录列表显示
 * @param  {object} 数据对象
 * @return {void}
 */
YX.fn.buildFriends = function () {
    var data = {
        friends:this.cache.getFriendslistOnShow(),
        account:userUID
    }
    if(!this.friends){
        var options = {
            data:data,
            onclickavatar:this.showInfo.bind(this),
            onclickitem:this.openChatBox.bind(this),
            infoprovider:this.infoProvider.bind(this)

        } 
        this.friends = new NIMUIKit.FriendList(options)
        this.friends.inject($('#friends').get(0))
    }else{
        this.friends.update(data)
    }     
    this.doPoint()
}
/**
 * 添加好友相关
 * 
 */
YX.fn.showAddFriend = function(){
    this.friendData = null
    this.$addFriendBox.removeClass("hide")
    this.$mask.removeClass('hide')
    this.$addFriendBox.find(".j-account").focus()
}
YX.fn.hideAddFriend = function(){
    this.resetSearchFriend()
    this.$addFriendBox.addClass("hide")
    this.$mask.addClass('hide')
}
YX.fn.searchFriend = function(){
    var account =  $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    if(account!==""){
        this.mysdk.getUser(account,this.cbGetUserInfo.bind(this))
    }  
}
YX.fn.beginChat = function(){
    var account = $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    this.hideAddFriend()
    this.openChatBox(account,"p2p")
}
YX.fn.resetSearchFriend = function(){
    this.$addFriendBox.attr('class',"m-dialog")
    this.$addFriendBox.find(".j-account").val("")
}
YX.fn.addFriend = function(){
    var id  = $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    this.mysdk.addFriend(id,this.cbAddFriend.bind(this))
}
YX.fn.rmBlacklist = function(){
    var id  = $.trim(this.$addFriendBox.find(".j-account").val().toLowerCase())
    this.mysdk.markInBlacklist(id,false,this.cbRmBlacklist.bind(this))
}
YX.fn.cbRmBlacklist = function(err,data){
    if(!err){
        var account = data.account
        this.cache.removeFromBlacklist(account)
        this.buildFriends()
        var isFriend = this.cache.isFriend(account)
        if(!isFriend){
            this.friendData = data
        }
        this.$addFriendBox.removeClass('blacklist')
        this.$addFriendBox.addClass(isFriend ? "friend" : "noFriend")    
    }
}
YX.fn.inputAddFriend = function(evt){
    if(evt.keyCode==13){
        $("#addFriendBox .j-account").blur()
        this.searchFriend()
    }
}
YX.fn.cbAddFriend = function(error, params) {
    if(!error){
        this.$addFriendBox.find(".tip").html("添加好友成功！")
        this.$addFriendBox.attr('class',"m-dialog done")
        this.cache.addFriend(params.friend)
        this.cache.updatePersonlist(this.friendData)
        this.buildFriends()
    }else{
        this.$addFriendBox.find(".tip").html("该帐号不存在，请检查你输入的帐号是否正确")
        this.$addFriendBox.attr('class',"m-dialog done")          
    }
    
}
YX.fn.cbGetUserInfo = function(err,data){
    if(err){
        alert(err)
    }
    if(!!data){
        var $info = this.$addFriendBox.find(".info"),
            user = data,
            account = data.account
        $info.find("img").attr("src",getAvatar(user.avatar))
        $info.find(".j-nickname").html(user.nick)
        $info.find(".j-username").html("帐号："+ account)
        if(account == userUID){
            this.$addFriendBox.find(".tip").html("别看了就是你自己")
            this.$addFriendBox.attr('class',"m-dialog done")   
        }else{
            var isFriend = this.cache.isFriend(account),
                inBlacklist = this.cache.inBlacklist(account)
            if(!isFriend){
                this.friendData = data
            }
            if(inBlacklist){
                 this.$addFriendBox.addClass("blacklist")    
            }else{
                this.$addFriendBox.addClass(isFriend?"friend":"noFriend")    
            }
        }
        
    }else{
        this.$addFriendBox.find(".tip").html("该帐号不存在，请检查你输入的帐号是否正确")
        this.$addFriendBox.attr('class',"m-dialog done")      
    }
}
/************************
 * 黑名单列表相关
 ************************/
YX.fn.showBlacklist = function() {
    var data = this.cache.getBlacklist()
    var html = appUI.buildBlacklist(data,this.cache)
    this.$blacklist.find('.list').html(html)
    this.$blacklist.removeClass('hide')
    this.$mask.removeClass("hide")
    document.documentElement.style.overflow='hidden'
}
YX.fn.hideBlacklist = function() {
    $("#blacklist").addClass('hide')
    this.$mask.addClass("hide")
    document.documentElement.style.overflow=''
},
YX.fn.removeFromBlacklist = function(evt){
    var id = $(evt.target).attr("data-id")
    this.mysdk.markInBlacklist(id,false, this.cbRemoveFromBlacklist.bind(this))
}
YX.fn.cbRemoveFromBlacklist = function (err,data) {
    if(!err){
        this.cache.removeFromBlacklist(data.account)
        var html = appUI.buildBlacklist(this.cache.getBlacklist(),this.cache)
        this.$blacklist.find('.list').html(html)
        this.buildFriends()
    }else{
        alert("操作失败")
    }
}

/**
 * 我的手机
 */
YX.fn.sendToMyPhone = function () {
    this.openChatBox(userUID,"p2p")
}