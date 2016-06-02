(function () {
	function readCookie(name) { 
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)){
	        return unescape(arr[2]); 
	    }else{
	        return null;
	    }
	        
	} 
 	function getAvatar(url) {
        var re=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
        if(re.test(url)){
            return url+"?imageView&thumbnail=80x80&quality=85";
        }else{
            return "./images/default-icon.png"
        } 
    }
	var sdktoken = readCookie('sdktoken');
	if(!sdktoken){
     	window.location.href = '../index.html';
	}
	var $ = function(id){
		return document.getElementById(id);
	};
	$("nickName").innerHTML = readCookie("nickName");
	$("avatar").src = getAvatar(readCookie("avatar"));	
})();