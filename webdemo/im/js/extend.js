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