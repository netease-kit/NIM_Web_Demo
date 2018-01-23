
# 网易云信web demo简介
网易云信demo工程基于网易云信[webSDK](/docs/product/IM即时通讯/SDK开发集成/Web开发集成/概要介绍)，演示了SDK聊天，群组，点对点音视频等功能。用户可参照该demo，将网易云信SDK接入自己的app。

## 预览demo
demo地址https://github.com/netease-im/NIM_Web_Demo

将工程克隆到本地，使用静态服务启动本工程。

#### 例：node环境工程部署
1. `npm install` 
2. `node app`
3. 在浏览器中访问 http://127.0.0.1:8182/webdemo/index.html

** 注：必须启服务预览demo文件（node服务只是一个例子，并非必须）**

## IM功能

### 源码结构

依赖SDK文件 Web_SDK_Base.js, Web_SDK_MIN.js(版本号这里略去了)，此外demo依赖jQuery ,并使用了部分JQueryUI插件
* link.js：初始化SDK，以及封装SDK相关功能的方法

* cache.js：负责业务数据层相关操作（数据包括消息对象，好友列表，回话列表，群等）

* main.js：功能入口
* module/*.js  webdemo各个模块文件的目录 其实base.js是入口文件  其他功能模块文件按需加载即可

* util.js：包含一些公用的工具方法

* ui.js：处理页面数据渲染（开发者可以自行选取模板来处理）

* login.js,register.js：登陆，注册相关逻辑处理

* widget/uiKit.js [云信的ui组件库](https://github.com/netease-im/NIM_Web_UIKit)，开发这可以使用该组件来快速开发工程

### 功能点指引
#### SDK初始化
用正确地appKey（在管理后台可以查看应用的appKey），account（帐号），token（帐号的token，用于建立连接，demo中使用md5加密的方式来登录，而管理后台创建的测试帐号直接使用即可）以及自定义回调方法来连接SDK并将sdk返回的消息，好友，群等数据保存到自己的数据缓存中。

在SDK同步数据完成后，开始页面渲染。

#### 缓存数据

cache.js中封装各种数据的增删改查

friendslist:好友列表

personlist:用户信息map

teamlist:群列表

teamMap:群信息map

msgs：消息对象集合

sessions:当前会话列表

blacklist,mutelist:黑名单静音列表

sysMsgs,customSysMsgs :系统消息 ，自定义系统消息




#### 消息处理
message.js的doMsg方法处理sdk的onmsg方法回调。如果消息的类型为群通知，则转交给noticication.js来处理。在收到消息后，调用cache.js的addMsg方法，缓存数据，最后刷新会话、聊天UI。

流程如下：收到消息 ---> 消息存储 ---> UI渲染

#### 发送消息处理
message.js里sendTextMsg,uploadFile方法提供发送文本，文件功能。发送后通过sendMsgDone回调方法来处理发送后的业务逻辑，同消息处理。

## 聊天室功能

源码位于webdemo/chartroom下

### 源码结构

依赖SDK文件 Web_SDK_Base.js, Web_SDK_Chartroom.js(版本号这里略去了)

##### 目录简介
* dist：代码产出位置（源码代码看这里）

* font：字体图标

* images：图片位置

* src：开发环境位置（不需要关心此处）

#### 核心代码
* link.js: 连接SDK实例代码，SDKAPI业务上再次封装
* room.js:聊天室的主要业务逻辑

#### 开发思路

[初始化SDK](/docs/product/IM即时通讯/SDK开发集成/Web开发集成/初始化)

监听消息通知  —> UI渲染

## 点对点(pcAgent、WebRTC)音视频

源码位于`webdemo/im/js/module`下

## 多人(pcAgent、WebRTC)音视频

源码位于`webdemo/im/js/module`下

#### 源码结构

依赖SDK文件 `Web_SDK_Netcall.js` (版本号这里略去了)
依赖SDK文件 `Web_SDK_WebRTC.js` (版本号这里略去了)

#### 核心代码
* netcall.js: 调用agent、webrtc点对点音视频功能核心代码
* netcall_ui.js: 音视频UI操作相关代码

## 点对点白板

源码位于`webdemo/im/js/module`下

#### 源码结构

依赖SDK文件 `Web_SDK_WhiteBoard.js` (版本号这里略去了)

Demo中白板额外加入了音频通话的功能，因此需要依赖音频相关的SDK，进行开发时也可以只使用白板本身，不使用音频功能。
音频部分依赖SDK文件 `Web_SDK_Netcall.js` (版本号这里略去了)
以及 `Web_SDK_WebRTC.js` (版本号这里略去了)

另外为了简化代码，白板界面通过Vue框架编写，源码中尽可能减少UI操作逻辑，只包含业务逻辑。

#### 核心代码
* whiteboard.js: 包含白板通话建立流程以及功能操作等内容

## 修改代码为已用

网易云信demo实现了一个IM软件的所有基础功能，开发者可直接以demo为基础，自定义相关样式，开发自己的IM软件，也可以参考demo中[sdk API](http://dev.netease.im/docs/interface/即时通讯Web端/NIMSDK-Web/)使用方式自行开发。

注：云信只提供消息通道，并不包含用户资料逻辑。开发者需要在管理后台或通过服务器接口将用户账号和token同步到云信服务器。
