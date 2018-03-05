var customerList = {};
var waiterList = {};
var removeList = {}; // 要删除（转接）的客户都在里面
var friends = window.parent.yunXin.cache.friendslist;
var persons = window.parent.yunXin.cache.personlist;
var oldDom = null;
var waiter = null;    //选中的客服

//选择客户
function selectedCustomer (_this) {
  $(_this).find('.circular').toggleClass('active');
  $(_this).attr('data-account', function (index, account){
    removeList[account] ? delete removeList[account] : removeList[account] = persons[account];
  });
}


//选择客服
function selectedWaiter (_this) {
  try {
    oldDom.find('.circular').toggleClass('active');
  } catch (error) {}
  $(_this).find('.circular').toggleClass('active').attr('data-account', function (index, account) {
  });
  oldDom = $(_this).attr('data-account', function (index, account) {
    waiter = account;
  });
}


function init () {
  setCustomerList();
  setWaiterList();
}

//初始化客户列表
function setCustomerList () {
  for (var i = 0; i < friends.length; i++) {
    var key = friends[i].account;
    customerList[key] = persons[key];
  }
  rander('customer');
}

//初始化客服列表
function setWaiterList () {
  waiterList = "";
  //TODO 获取客服列表
  waiterList = customerList;
  rander('waiter');
}

//渲染
function rander (type) {
  var list = window[type + 'List'];
  var htmlStr = '';
  var fn = type === 'customer' ? 'selectedCustomer' : 'selectedWaiter';
  for (var key in list) {
    var item = list[key];
    htmlStr += '<li class="panel_item" data-name="' + item.nick + '" data-account="' + item.account + '" onclick="javascript: ' + fn + '(this);">' +
      '<div class="panel_avatar">' +
        '<img class="panel_image" src="' + (item.avatar ? item.avatar : '../images/default-icon.png' ) + '">' +
      '</div>' +
      '<div class="panel_text">' +
        '<div class="panel_single-row" style="width: 90%">' +
          '<span>' + (item.nick ? item.nick + '-' : '') + item.account +'</span>' +
          '<div class="circular"></div>' +
        '</div>' +
      '</div>' +
    '</li>';
  }
  $('#' + type + '-list').html(htmlStr);
}

//取消
function cancel() {
  window.parent.ExtendTransference.showTransference();
}

//移除客户 （只是页面上和本地数据中删除，并不处理后台数据，后台数据在后台修改）
function removeCustomer() {
  for (var person in removeList) {
    delete window.parent.yunXin.cache.friendslist[person];
    delete window.parent.yunXin.cache.personlist[person];

    window.parent.$('#friends>ul>li [data-account="' + person + '"]').remove();
    window.parent.$('#sessions>ul>li [data-account="' + person + '"]').remove();
  }
}

function searchCustomer(_this) {
  var keyword = _this.value;  //获取关键字
  
  $('#customer-list>li').each(function (index, dom) {
    var accountNum = $(this).attr('data-account').indexOf(keyword);
    var nameNum = $(this).attr('data-name').indexOf(keyword);
    if (accountNum + nameNum > -2) {
      $(this).attr('class', 'panel_item');
    }
    else {
      $(this).attr('class', 'panel_item hide');
    }
  });
}

function searchWaitet(_this) {
  var keyword = _this.value;  //获取关键字

  $('#waiter-list>li').each(function (index, dom) {
    var accountNum = $(this).attr('data-account').indexOf(keyword);
    var nameNum = $(this).attr('data-name').indexOf(keyword);
    if (accountNum + nameNum > -2) {
      $(this).attr('class', 'panel_item');
    }
    else {
      $(this).attr('class', 'panel_item hide');
    }
  });
}


var ExtendSearch = {
  userUID: null,
  personlist: null,
  list: null,
  search: function (_this) {
    // var self = this;
    // self.refreshData();


  }
}

init();