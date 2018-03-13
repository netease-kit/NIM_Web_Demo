var ExtendsFn = {
  showZZ: function (id) {     //展示转账记录
    
  },
  showXYBG: function (phone) {  //展示信用报告
    
  },
  showJT: function (id) {     //展示借条
    
  },
  showQT: function (id) {     //展示欠条

  },
}




var ExtendTransference = {
  showTransference: function () {
    $("#extend-transference-iframe")
    .attr('src', function (index, value) {
      return value ? '' : './transference/transference.html';
    });
    $("#extend-transference").toggleClass("extend-close")
  },
  //移除客户 （只是页面上和本地数据中删除，并不处理后台数据，后台数据在后台修改）
  removeCustomer: function (person) {
    $('#friends').find('[data-account="' + person + '"]').remove();
    $('#sessions').find('[data-account="' + person + '"]').remove();
  }
}

var ExtendSearch = {
  userUID: null,
  personlist: null,
  list: null,
  refreshData: function () {
    this.list = [];
    this.personlist = yunXin.cache.personlist;
    this.userUID = readCookie('uid');
    delete this.personlist[userUID];
  },
  search: function (_this) {
    var self = this;
    self.refreshData();
    var keyword = _this.value;  //获取关键字
    
    //遍历对比
    for (var person in self.personlist) {
      var result = self.personlist[person].nick.indexOf(keyword) + person.indexOf(keyword);
      if (result > -2) this.list.push(person);
    }

    $('#friends>ul>li').each(function (index, dom) {
      $(this).attr('data-account', function (index, attr) {
        
        // console.log(self.list.indexOf(attr));
        
        switch (self.list.indexOf(attr)) {
          case -1:
            // console.log(this);
            $(this).attr('class', 'panel_item hide');
            break;
          default:
            // console.log(this);
            $(this).attr('class', 'panel_item');
        }      
      });
    });

    $('#sessions>ul>li').each(function (index, dom) {
      $(this).attr('data-account', function (index, attr) {

        // console.log(self.list.indexOf(attr));

        switch (self.list.indexOf(attr)) {
          case -1:
            // console.log(this);
            $(this).attr('class', 'panel_item hide');
            break;
          default:
            // console.log(this);
            $(this).attr('class', 'panel_item');
        }
      });
    });
  }
}

var ExtendChat = {
  copy: function (_this) {
    $(_this).find('.f-maxWid').text(function (index, content) {
      $('#messageText').val(content);
    });
  },
};

var ExtendQuickSend = {
  textarea: $('#entry-textarea'),
  input: $('#messageText'),
  sendBtn: $('#sendBtn'),
  list: $('#extends-quickSend-list'),
  max: 0,
  current: 0,
  content: {},
  type: 'add',
  init: function () {
    var self = this;
    var data = localStorage.getItem("quickSend");
    if (!data || data == '{}') {
      this.content = {};
    }
    else {
      this.content = JSON.parse(data);
    }
    var htmlStr = "";
    for (var index in this.content) {
      htmlStr += this.setHtml(index, self.content[index]);
      this.max = index * 1 > this.max ? index * 1 : this.max;
    }
    this.list.html(htmlStr);
  },
  send: function (_this) {
    if ($('#rightPanel').hasClass('hide')) return;
    var self = this;
    this.input.val($(_this).find('.item-content').text());
    this.sendBtn.click();
  },
  add: function () {
    var self = this;
    var content = this.textarea.val();
    this.textarea.val('');
    $('#extends-quickSend-btn').text('添加');
    if (!content) {
      this.type = 'add';
      alert('内容不能为空，请重试');
      return;
    }
    switch (this.type) {
      case 'add':
        this.content[++this.max] = content;
        var html = this.setHtml(self.max, content);
        this.list.append(html);
        break;
      case 'modify':
        this.content[this.current] = content;
        $('#extends-QuickSend-' + this.current).find('.item-content').text(content);
        $('#extends-QuickSend-' + this.current).attr('title', content);
        break;
    }
    this.type = 'add';
    localStorage.setItem('quickSend', JSON.stringify(self.content));
  },
  remove: function (_this) {
    var self = this;
    var index = $(_this).attr('data-index');
    delete self.content[index];
    localStorage.setItem('quickSend', JSON.stringify(self.content));
    $('#extends-QuickSend-' + index).remove();
  },
  modify: function (_this) {
    this.type = 'modify';
    this.current = $(_this).attr('data-index');
    var self = this;
    var content = $('#extends-QuickSend-' + self.current).find('.item-content').text();
    this.textarea.val(content);
    $('#extends-quickSend-btn').text('修改');
  },
  setHtml: function (index, content) {
    var htmlStr = '<li class="list-item" title="' + content + '" id="extends-QuickSend-' + index + '" ondblclick="javascript: ExtendQuickSend.send(this);">' +
      '<p class="item-content">' + content + '</p>' +
      '<div class="item-operation">' +
        '<div class="operation-group">' +
          '<div class="iconfont-wrap" title="修改" data-index="' + index + '" onclick="javascript: ExtendQuickSend.modify(this);">' +
            '<i class="iconfont icon-xiugai-copy"></i>' +
          '</div>' +
          '<div class="iconfont-wrap" title="删除" data-index="' + index + '" onclick="javascript: ExtendQuickSend.remove(this);">' +
            '<i class="iconfont icon-shanchu3"></i>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</li>';
    return htmlStr;
  },
}

var ExtendInformationReport = {
  show: function () { //展示
    //当前聊天对象
    var account = yunXin.crtSessionAccount;
    $('#extends-information-report-content').removeClass('hide');
  },
  close: function () {  //关闭
    $('#extends-information-report-content').addClass('hide');
  },
  fillContent: function (data) {  //插入html
    var htmlStr = '<li class="table-item">' +
      '<div class="item-unit">状态</div>' +
      '<div class="item-unit">笔数</div>' +
      '<div class="item-unit">金额</div>' +
    '</li>';

    for (var i = 0; i < data.length; i++) {
      htmlStr += this.setHtml(data[i]);
    }
    $('#extends-information-report-content-table').html(htmlStr);
  },
  setHtml: function (data) {    //设置html字符串
    return '<li class="table-item">' +
      '<div class="item-unit">' + data.state + '</div>' +
      '<div class="item-unit">' + data.count + '</div>' +
      '<div class="item-unit">' + data.money + '</div>' +
    '</li>';
  }
}




ExtendQuickSend.init();

