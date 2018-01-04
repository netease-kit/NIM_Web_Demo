/** 
 * 技术方案选择的弹框
 * 用途：
 * 1. 发起通话时提供方案选择:WebRTC和PC Agent
 * 
 * @param {string} option.callMethod 方法选择
 * @param {boolean} option.isWebRTCEnable 是否开启webrtc
 * @param {fn} option.cbConfirm 确认回调
 * @param {fn} option.cbCancel 取消回调
 */

NetcallBridge.fn.dialog_call = {
    open: function (option) {

        this.callMethod = option.callMethod
        this.isWebRTCEnable = option.isWebRTCEnable
        this.cbConfirm = option.cbConfirm || function () { };
        this.cbCancel = option.cbCancel || function () { };
        this.yx = option.yx || {}
        this.env = option.env || this;
        this.isWhiteboard = option.isWhiteboard || false

        var $dialog = this.$dialog = $('#dialogCallMethod'), that = this;

        that.load();
        that.selectedNum = 0;

        this.isOpen = true;

        // 事件绑定一次就行了
        if (that.isInited) return;

        $dialog.on('click', '.j-confirm', function (e) {
            e.preventDefault();
            if ($(this).hasClass('disabled')) return;

            var type = $('.J-all-type-box .radio.active').data('type')
            var isWebRTCEnable = !!$('.J-all-type-box .J-webrtc.active').length
            var isRemeber = !!('.J-all-type-box .J-remember.active').length
            that.close()

            that.cbConfirm.call(that.env, { type: type, isWebRTCEnable: isWebRTCEnable, isRemeber: isRemeber });

        });
        $dialog.on('click', '.j-close', function (e) {
            e.preventDefault();
            that.close();

            that.cbCancel.call(that.env);

        });

        $dialog.on('click', '.radio', function (e) {
            e.preventDefault();
            $dialog.find('.radio').toggleClass('active', false)
            $(e.target).toggleClass('active', true)

            $dialog.find('.j-confirm').toggleClass('disabled', false)
            var type = $(e.target).data('type');
            $dialog.find('.J-webrtc').toggleClass('hide', type === 'webrtc')

        });

        $dialog.on('click', '.checkbox', function (e) {
            e.preventDefault();
            $(e.target).toggleClass('active')
        });

        that.isInited = true;

    },
    /** dom渲染流程 */
    load: function (list, selectedlist) {
        var that = this;
        var $dialog = that.$dialog;
        var fname = 'selectCallMethod';

        $dialog.load('./' + fname + '.html', function () {
            if ($("#devices")) {
                $("#devices").addClass('hide')
            }
            if(that.callMethod){
                $('.radio[data-type=' + that.callMethod + ']').addClass('active')
            }

            if(!that.isWhiteboard){
                $('#whiteboard-tip').addClass('hide')
            }
            
            $dialog.find('.J-webrtc').toggleClass('hide', !that.callMethod || that.callMethod === 'webrtc')
            $('.J-webrtc').toggleClass('active', that.isWebRTCEnable)
            $dialog.removeClass('hide')
            that.yx.$mask.removeClass('hide')
            $dialog.find('.j-confirm').toggleClass('disabled', $dialog.find('.radio.active').length === 0)
        });
    },
    /** 关闭弹框 */
    close: function () {
        this.isOpen = false;
        this.$dialog && this.$dialog.addClass('hide')
        this.yx && this.yx.$mask && this.yx.$mask.addClass('hide')
    }
}