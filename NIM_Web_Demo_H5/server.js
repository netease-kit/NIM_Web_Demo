const path = require('path')
const express = require('express')
var https = require('https');
var http = require('http');
const ejs = require('ejs')
const fs = require('fs')
const app = express()

//同步读取密钥和签名证书
var options = {
  key:fs.readFileSync('./ssh/key.pem'),
  cert:fs.readFileSync('./ssh/cert.pem')
}

var httpsServer = https.createServer(options, app)
var httpServer = http.createServer(app)

// 将请求响应解析到body的中间件
const bodyParser = require('body-parser')
// 解析 Content-Type:application/x-www-form-urlencoded 的请求到 req.body
// app.use(bodyParser.urlencoded({extended: false}))
// 解析 Content-Type:json 的请求到 req.body
app.use(bodyParser.json())

// 读写cookie的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// 静态文件资源，做静态文件服务器，js、css、html资源等
const projPath = process.cwd()
// js,css资源
app.use('/webdemo/h5/dist', express.static(path.join(projPath, 'dist')))
// 图片资源
app.use('/webdemo/h5/res', express.static(path.join(projPath, 'res')))

// 设置html作为渲染器
app.engine('html', ejs.__express);
app.set('view engine', 'html')

app.get('/webdemo/h5/login.html', function (req, res, next) {
  res.render(path.join(projPath, 'login'))
})

app.get('/webdemo/h5/regist.html', function (req, res, next) {
  res.render(path.join(projPath, 'regist'))
})

// 单页应用页面
app.get('/webdemo/h5/index.html', function (req, res, next) {
  res.render(path.join(projPath, 'index'))
})

app.get('/', function (req, res, next) {
  res.redirect('/webdemo/h5/index.html')
})

app.post('/webdemo/h5/getlogger', (req, res) => {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', chunk => {
    req.rawBody += chunk;
  });
  req.on('end', () => {
    let body = req.rawBody;
    fs.appendFile('sdklog.log', body, () => {
      res.end();
    });
  });
});

httpsServer.listen(2000);
httpServer.listen(2001);

console.info(`Https Listen on Port 2000`)
console.info(`Http Listen on Port 2001`)
