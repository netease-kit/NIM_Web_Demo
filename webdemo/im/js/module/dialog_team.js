/** 
 * 选择/添加成员的弹框组件
 * 用途：
 * 1. 群列表中添加朋友进群
 * 2. 多人音视频中选择群成员开启音视频
 * 
 * @param {object} option 开启弹框的属性配置
 * @param {string} option.type 打开弹窗的类型，不同类型打开不同的模板: 'list-select'(默认值) / 'list'
 * @param {num} option.limit 成员上限限制, 可以不传, 默认0
 * @param {boolean} option.isCompleteList 回调数据是否是完整的数据，即：完整就是所有选中的（包含初始传进来的selectedlist） / 还是当前手动选中的!, 可以不传, 默认false
 * @param {Array} option.list 待选择的成员列表
 * @param {string} option.selectedlist 已选择的成员列表
 * @param {object} option.env 执行环境，如果有的话，回调时需要重新绑定环境
 * @param {object} option.yx 缓存yx实例
 * @param {fn} option.cbConfirm 确认回调
 * @param {fn} option.cbCancel 取消回调
 */

YX.fn.dialog = {
    open: function (option) {

        this.limit = option.limit || 0;
        this.isCompleteList = option.isCompleteList || false;
        this.cbConfirm = option.cbConfirm || function () { };
        this.cbCancel = option.cbCancel || function () { };

        var $dialog = this.$dialog = $('#dialogTeamContainer'), that = this;

        this.type = option.type || 'list-select';
        that.yx = option.yx;
        that.env = option.env || that;
        that.selectedlist = {};
        that.load(option.list, option.selectedlist);
        that.selectedNum = 0;

        this.isOpen = true;

        // 事件绑定一次就行了
        if (that.isInited) return;

        $dialog.on('click', '.user-list li', function (e) {
            that.selectUser.call(that, e);
        });
        $dialog.on('click', '.j-close', function (e) {
            e.preventDefault();
            that.cbCancel.call(that.env);
            that.close();
        })
        $dialog.on('click', '.j-confirm', function (e) {
            e.preventDefault();
            if ($(this).hasClass('disabled')) return;
            that.close();
            if (!that.isCompleteList) {
                return that.cbConfirm.call(that.env, that.selectedlist);
            }
            var tmpList = {};
            $dialog.find('#addUserList li.selected').each(function (index, item) {
                item = $(item).data('account');
                tmpList[item] = item;
            });
            return that.cbConfirm.call(that.env, tmpList);
        });

        that.isInited = true;

    },
    /** dom渲染流程 */
    load: function (list, selectedlist) {
        var that = this;
        var dialog = that.$dialog;
        var fname = that.fname = that.type === 'list-select' ? 'teamMember' : 'speakBan';

        dialog.load('./' + fname + '.html', function () {
            if ($("#devices")) {
                $("#devices").addClass('hide')
            }
            dialog.removeClass('hide')
            that.yx.$mask.removeClass('hide')
            var $addIcon = $('#userList .first'),
                $addUserUl = $('#addUserList ul'),
                tmpHtml = '',
                members = []

            // 所有成员
            for (var i = 0, l = list.length; i < l; ++i) {

                var tmp = list[i];

                /** 奇怪的数据略过 */
                if (tmp.constructor !== Object) continue;
                /** 自己略过 */
                if (tmp.account === that.yx.accid) continue;

                var tmpUser = that.yx.cache.getUserById(tmp.account);
                tmp.avatar = tmpUser.avatar;
                tmp.name = tmp.nickInTeam;
                // tmp.nick = getNick(tmp.account);
                // tmp.nick = tmp.nick === tmp.account ? "" : tmp.nick;
                tmpHtml += appUI['build' + fname + 'UI'](tmp);
            }
            $addUserUl.html(tmpHtml);

            /** 禁言UI，放开按钮 */
            if (fname === 'speakBan') {
                dialog.find('.j-confirm').removeClass('disabled')
            }

            if (selectedlist) {
                that.loadSelected(selectedlist);
            }
        });
    },
    /**
     *  已选中的进行加载
     * 
     * @param {any} members object或者array都可以
     */
    loadSelected: function (members) {
        var fname = this.fname;

        if (!members) return;

        /** 对象转数组 */
        if (members.constructor === Object) {
            var arr = [];
            for (var i in members) {
                arr.push({
                    account: i
                });
            }
            members = arr;
        }

        /** 如果禁言，UI处理不一样 */
        if (fname === 'speakBan' && members.length > 0) {
            var $dialog = this.$dialog;
            for (var i = 0; i < members.length; i++) {
                var account = members[i].account
                $dialog.find('[data-account="' + account + '"]').addClass('selected')
                $dialog.find('[data-account="' + account + '"] i').addClass('cur')
            }
            // enable和disable按钮
            return;
        }

        /** 已选的ui */
        $('#addedUserNum').text(this.limit ? 0 + "/8" : 0)

        var $addUserUl = $('#addUserList ul');
        for (var i = 0; i < members.length; i++) {
            var account = members[i].account
            $addUserUl.find('[data-account="' + account + '"] i').addClass('cur2')
        }
    },
    /** 成员选择事件 */
    selectUser: function (e) {
        var that = this;
        // that.selectedNum = that.selectedNum || 0;
        var $this = $(e.target).closest('li'),
            $checkIcon = $this.find('i'),
            $addedUserNum = $('#addedUserNum'),
            $addedUserListUl = $('#addedUserList ul'),
            account = $this.data('account'),
            name = $this.data('nick'),
            icon = $this.data('icon'),
            addedNum = that.selectedNum
        // 不能被选择的人不响应事件
        if (!$checkIcon.hasClass('cur2')) {

            var str = '<li data-account="' + account + '" data-account="' + name + '" data-icon="' + icon + '"><img src="' + getAvatar(icon) + '" width="56" height="56"/><p class="name">' + name + '</p></li>'
            if (!$checkIcon.hasClass('cur')) {

                // 人数上限
                if (that.limit && addedNum >= that.limit) {
                    that.yx.myNetcall.showTip('人数已达上限', 2000);
                    return;
                }

                that.selectedlist[account] = name
                $addedUserListUl.append(str)
                addedNum++
            } else {
                delete that.selectedlist[account]
                $addedUserListUl.find('[data-account=' + account + ']').remove()
                addedNum--
            }

            $checkIcon.toggleClass('cur')
            $this.toggleClass('selected')
            $addedUserNum.text(that.limit ? addedNum + "/8" : addedNum)
            that.selectedNum = addedNum

            if (that.fname === 'speakBan') return;
            // enable和disable按钮
            that.$dialog.find('.j-confirm').toggleClass('disabled', addedNum <= 0)
        }

    },
    /** 关闭弹框 */
    close: function () {
        this.isOpen = false;
        this.$dialog && this.$dialog.addClass('hide')
        this.yx && this.yx.$mask && this.yx.$mask.addClass('hide')
    }
}