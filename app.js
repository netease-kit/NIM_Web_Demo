var http = require("http"),
	url = require("url"),
	fs = require("fs");
http.createServer(function(req,res){
	console.log(pathname);
	var pathname = url.parse(req.url).pathname;
	console.log(pathname);
 	fs.readFile("."+pathname, function readData(err, data) {
        res.writeHead(200);
        res.end(data);
    });
}).listen(8888);
console.log('Server running at http://localhost:8888/');
console.log('please visit:');
console.log('http://localhost:8888/webdemo/index.html');
