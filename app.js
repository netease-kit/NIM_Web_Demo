var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var prettyjson = require('prettyjson');
var multer = require('multer');

var app = express();

app.use(express.static('./'));
app.use(express.static('node_modules'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, AppKey, Nonce, CurTime, CheckSum');
    // res.header('Access-Control-Max-Age', 604800);
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// app.use(function (req, res, next) {
//     res.status(404).send('404')
// })

app.get('timeout', function (req, res) {
    console.log('timeout');
});

var options = {
    key: fs.readFileSync('./ssh/key.pem'),
    cert: fs.readFileSync('./ssh/cert.pem')
};

var httpServer = http.createServer(app);
httpServer.listen(8182, function () {
    console.info('server start at ' + 8182)
    logAddress(httpServer, 'http');
});
var httpsServer = https.createServer(options, app);
httpsServer.listen(7182, function () {
    logAddress(httpsServer, 'https');
});

function logAddress(server, type) {
    var address = server.address();
    address = type + '://localhost:' + address.port;
    // console.log('vcloud');
    // console.log(address + '/webdemo/vcloud/room.html?type=edu&roomid=36168');
    log();
}

function log(obj) {
    if (!obj) return
    if (typeof obj === 'string') {
        if (obj.length > 100) {
            return;
        }
        obj = [obj];
    }
    console.log(prettyjson.render(obj));
}