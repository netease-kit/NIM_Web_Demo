var fs = require("fs");
var prompt = require("prompt");
var version,
	deploy,
	imPath = "./webdemo/im/main.html",
	chatroomPath = "./webdemo/im/chatroom/room.html"

prompt.start();
prompt.get(['version'], function (err, result) {
	version = result.version
	deploy = 'online'
  console.log("版本是：" + version + '环境是：'+ deploy);
  
	var str2 = "_v" + version;
	fs.readFile(imPath, 'utf8', function (err, data) {
		console.log("处理imSDK路径");
		data = data.replace(/NIM_Web_SDK.*\.js/, "NIM_Web_SDK" + str2 + ".js");
		data = data.replace(/NIM_Web_Netcall.*\.js/, "NIM_Web_Netcall" + str2 + ".js");
		data = data.replace(/NIM_Web_WebRTC.*\.js/, "NIM_Web_WebRTC" + str2 + ".js");
		data = data.replace(/NIM_Web_WhiteBoard.*\.js/, "NIM_Web_WhiteBoard" + str2 + ".js");
		fs.writeFile(imPath, data, 'utf8', function (err, data) {
			if (err) throw err;
		});
	});

	fs.readFile(chatroomPath, 'utf8', function (err, data) {
		console.log("处理chatroom路径");
		data = data.replace(/NIM_Web_SDK.*\.js/, "NIM_Web_SDK" + str2 + ".js");
		fs.writeFile(chatroomPath, data, 'utf8', function (err, data) {
			if (err) throw err;
			console.log("处理chatroom环境是 " + deploy);
		});
	});
})


