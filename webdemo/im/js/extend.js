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
      .toggleClass("extend-close")
      .attr('src', function (index, value) {
        return value ? '' : './transference/transference.html';
      });
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
    console.log(keyword);
    
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
    
  }
}