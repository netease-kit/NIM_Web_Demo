/*
* 云记录
*/

'use strict'

YX.fn.cloudMsg = function () {
	this.$cloudMsg = $('#cloudMsg')
	this.$cloudMsgContainer = $('#cloudMsgContainer')
 	this.$cloudMsg.on('click', this.showCloudMsg.bind(this, this.$cloudMsg));
    this.$cloudMsgContainer.delegate('.j-backBtn', 'click', this.closeCloudMsgContainer.bind(this));
    this.$cloudMsgContainer.delegate('.j-loadMore', 'click', this.loadMoreCloudMsg.bind(this))
    this.$cloudMsgContainer.delegate('.j-mbox','click',this.playAudio)
}
/**
 * 查看云记录
 */
YX.fn.showCloudMsg = function () {
    var that = this
    this.$cloudMsgContainer.load('./cloudMsg.html', function() {
        that.$cloudMsgContainer.removeClass('hide')
        var id = that.crtSessionAccount,
            scene = that.crtSessionType,
            param ={
                scene:scene,
                to:id,
                lastMsgId:0,
                limit:20,
                reverse:false,
                done:that.cbCloudMsg.bind(that)
            }
        that.mysdk.getHistoryMsgs(param)
    })
}
YX.fn.closeCloudMsgContainer = function () {
    this.$cloudMsgContainer.addClass('hide')
},

/**
 * 加载更多云记录
 */
YX.fn.loadMoreCloudMsg = function () {
    var id = this.crtSessionAccount,
        scene = this.crtSessionType,
        lastItem = $("#cloudMsgList .item").first(),
        param ={
            scene:scene,
            to:id,
            beginTime:0,
            endTime:parseInt(lastItem.attr('data-time')),
            lastMsgId:parseInt(lastItem.attr('data-idServer')),//idServer 服务器用于区分消息用的ID，主要用于获取历史消息
            limit:20,
            reverse:false,
            done:this.cbCloudMsg.bind(this)
        }
    this.mysdk.getHistoryMsgs(param)
}

/**
 * 云记录获取回调
 * @param  {boolean} error 
 * @param  {object} obj 云记录对象
 */
YX.fn.cbCloudMsg = function (error,obj) {
    var $node = $("#cloudMsgList"),
        $tip = $("#cloudMsgContainer .u-status span")
    if (!error) {
        if (obj.msgs.length === 0) {
            $tip.html('没有更早的聊天记录')          
        } else {
            if(obj.msgs.length<20){
                 $tip.html('没有更早的聊天记录') 
             }else{
                 $tip.html('<a class="j-loadMore">加载更多记录</a>')
             }
            var msgHtml = appUI.buildCloudMsgUI(obj.msgs,this.cache)       
            $(msgHtml).prependTo($node)
        }
    } else {
        console && console.error('获取历史消息失败')
        $tip.html('获取历史消息失败') 
    }
}