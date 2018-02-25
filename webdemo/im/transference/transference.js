var customerList = {};
var waiterList = {};
var removeList = {};
var friends = window.parent.yunXin.cache.friendslist;
var persons = window.parent.yunXin.cache.personlist;
var oldDom = null;
var waiter = null;

function selectedCustomer (_this) {
  $(_this).find('.circular').toggleClass('active');
  $(_this).attr('data-account', function (index, account){
    removeList[account] ? delete removeList[account] : removeList[account] = persons[account];
  });
}

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

function setCustomerList () {
  for (var i = 0; i < friends.length; i++) {
    var key = friends[i].account;
    customerList[key] = persons[key];
  }
  rander('customer');
}

function setWaiterList () {
  waiterList = "";
  waiterList = customerList;
  rander('waiter');
}

function rander (type) {
  var list = window[type + 'List'];
  var htmlStr = '';
  var fn = type === 'customer' ? 'selectedCustomer' : 'selectedWaiter';
  for (var key in list) {
    var item = list[key];
    htmlStr += '<li class="panel_item" data-account="' + item.account + '" onclick="javascript: ' + fn + '(this);">' +
      '<div class="panel_avatar">' +
        '<img class="panel_image" src="' + (item.avatar ? item.avatar : '../images/default-icon.png' ) + '">' +
      '</div>' +
      '<div class="panel_text">' +
        '<div class="panel_single-row">' +
          '<span>' + (item.nick ? item.nick + '-' : '') + item.account +'</span>' +
          '<div class="circular"></div>' +
        '</div>' +
      '</div>' +
    '</li>';
  }
  $('#' + type + '-list').html(htmlStr);
}


function cancel() {
  window.parent.ExtendTransference.showTransference();
}

init();