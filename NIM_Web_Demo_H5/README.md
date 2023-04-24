# WEB DEMO - alpha (HTML5-VUE版本) 源码导读

## 介绍
云信WEB DEMO HTML5-VUE版本 (以下简称h5 demo)，是一套使用[网易云信WEB端SDK](http://dev.netease.im/docs/product/IM即时通讯/SDK开发集成/Web开发集成)，以[VUE前端框架](https://cn.vuejs.org/v2/guide/)作为前端UI及缓存数据框架，进行开发的手机移动端适配DEMO。
h5 demo的推出，使得云信SDK的开发者们可以更便捷的利用移动端渠道推广他们的即时通讯产品(如微信、手机微博、手机浏览器等)，或通过WebView嵌入到嵌入式设备中，作为混合APP进行发布。
- h5 demo 体验地址：[体验地址](https://yiyong.netease.im/yiyong-static/statics/web-im-h5/login.html)
- h5 demo 工程地址：[工程地址](https://github.com/netease-im/NIM_Web_Demo_H5)
- ![demo示例](http://yx-web-nosdn.netease.im/webdoc/h5/docs/h5demo-example-1.jpg)
- h5 demo 快速部署：从工程地址中下载源码，进入目录运行命令行"npm run server"，访问"http://127.0.0.1:2001/webdemo/h5/index.html"即可。

## 起步
为了给不同接入程度的开发者都能更好的利用后h5 demo进行移动端开发，云信 WEB DEMO HTML5版本的工程也做了一些考虑与设计，利用VUE及其配套框架，为开发者们设计了以下几种借鉴模式：

1. 牛刀小试
  - 使用该种模式，开发者只需要通过工程独立抽出的公共样式、配置文件、路由结构，就可以完成简单的换APPKEY、换界面皮肤、换LOGO等，轻轻松松将h5 demo转化成自己的应用
  - 可参考教程[牛刀小试](./docs/h5-demo-guide-1.md)

2. 登堂入室
  - 使用该种模式，开发者需要深入阅读h5 demo的页面结构与样式组成，将其更换为自己所需的前端页面(包括路由规则、样式布局、增添组件等)，最好对webpack + postcss的工程化构建有一些了解，将h5 demo从视觉、交互层面转化为自己的应用
  - 可参考教程[登堂入市](./docs/h5-demo-guide-2.md)

3. 出神入化
  - 使用该种模式，开发者还需要熟练掌握vue + vuex + vue-router + vux框架的实现原理及使用，最好还能熟悉一些常用的ES5/ES6相关的js标准，直接修改包括h5 demo的数据管理层、UI层、组件等等在内的示例代码，将h5 demo完全打造成自己的应用
  - 可参考教程[出神入化](./docs/h5-demo-guide-3.md)

4. 惊世骇俗
  - 使用该种模式，h5 demo对于开发者而言仅仅是一个示例而已，开发者完全可以根据自己的喜好，使用熟悉的框架如Angular、React、Sencha Touch等等，甚至觉得示例代码写得不够优雅而用VUE进行重构，开发出最适合自己的IM产品。

## 工程初始化
### 开发环境部署
- 开发环境前端实时编译
  - 本示例由于使用了let、箭头描述符等，需要使用nodejs 6及以上版本
  - 本示例demo使用webpack + babel作为前端模块化管理和打包工具
    - 控制台执行 `npm install` 安装相关依赖（仅需在工程第一次初始化时运行）
    - 控制台执行 `npm run devbuild` 运行工程打包工作 (如果想开发实时编译，请运行 `npm run dev`, watch源代码)
      - **如果编译报postcss 未定义的错误**，控制台执行 npm install postcss-cli -g 用于demo皮肤及个性化样式生成，不报错则无需执行

- 开发环境后端服务
  - 本示例demo使用nodejs作为示例后台服务编程语言
    - 控制台执行 node server 运行后台服务，默认端口为2001，可在server.js文件中修改
    - 浏览器访问http://localhost:2001/webdemo/h5/index.html

- 开发环境真机调试
  - 控制台执行 npm install weinre -g
  - 进入demo根目录，控制台执行 weinre --httpPort 2002 -boundHost -all-
  - 获取本电脑局域网ip地址(同一路由器网段也可以)，如：192.168.0.146，windows环境下可通过ipconfig查看
  - 在webdemo工程的index.html/login.html/regist.html文件中加入以下代码：
    ``` html
    <!-- 192.168.0.146 为举例，填写开发者的局域网IP地址 --> 
    <script src="http://192.168.0.146:2002/target/target-script-min.js#anonymous"></script>
    ```
  - 手机访问，例如：http://192.168.0.146:2001/webdemo/h5/index.html网址即可真机调试(此网址为工程web服务地址)
  - [参考资料](https://www.npmjs.com/package/weinre)

### 生产环境部署
- 生产环境前端代码生成
  - 如果没有安装过npm包，请事先控制台执行npm install 以及 npm install postcss-cli -g
  - 控制台执行 npm run prod
   - **相比开发环境部署，生成环境会对js及css代码进行打包压缩**

- 生产环境后端代码生成
  - 开发者可以根据自己项目需要，随意的使用python、ruby、nodejs、php、java、c#等编程工具搭建后端应用。
  - 注意；**不同的后端路由规则可能会影响到资源文件的访问**
  - 可通过工程目录下的 src/configs/index.js 进行静态资源路径的全局化配置

### SDK的引入
  - SDK使用CommonJS的模式进行引入，使用webpack的dynamic requires标准进行动态加载
  - 示例代码：
  ```javascript
    import config from '@/configs'
    const SDK = require('@/sdk/' + config.sdk)
  ```
  - 注意，为防止sdk被二次打包，需要在webpack配置中加入exclude


### SDK版本替换及升级
  - SDK文件放在 src/sdk目录下，可直接做替换
  - 替换sdk源文件以后，需要在src/configs/index.js中sdk属性字段进行文件名替换

### 开发调试工具
- h5 demo使用了vue全家桶进行开发，推荐使用chrome浏览器加相应的插件(Vue.js devtools)进行调试。
  - 如果谷歌被墙，可以从该地址下载[https://github.com/vuejs/vue-devtools](https://github.com/vuejs/vue-devtools)
  - ![vue-devtool-1](http://yx-web-nosdn.netease.im/webdoc/h5/docs/vue-devtool-1.png)
  - ![vue-devtool-2](http://yx-web-nosdn.netease.im/webdoc/h5/docs/vue-devtool-2.png)
- 于此同时，开发者也可以在webpack配置文件(build/webpack.config.js)中开启自己喜欢的source-map，对代码进行断点调试。
  - h5 demo 默认配置的是在开发环境中使用"source-map"
  - ![vue-sourcemap-1](http://yx-web-nosdn.netease.im/webdoc/h5/docs/vue-sourcemap-1.png)
- 为了方便开发者在手机上调试，在webdemo的index.html增加了vconsole.js调试工具，可以在手机端查看console.log输出
- 利用服务器端调试
  - 对于某些安卓机型或者WebView环境，上述调试工具会产生兼容性问题或者其他不方便调试的情况，可以使用sdk提供的`LoggerPlugin`插件，将相关日志`post`到服务器，使用文件日志的方式存储下来。
  - Demo在`store/actions/initNimSDK.js`文件中已经做了示例（已注释），用户可以进行相关尝试。
  - 相关文档详见：[web sdk 日志分析](https://dev.yunxin.163.com/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E5%88%9D%E5%A7%8B%E5%8C%96)

## h5 demo 所使用的开发工具
### vue
vue的目标是通过尽可能简单的API实现"响应的数据绑定"和"组合的视图组件"。

- 如果您使用过诸如Angular、React这类MVVM模式的前端框架，那么vue对您而言，也仅仅是小菜一碟而已。详细的对比可以参考[Angular React 和 Vue的比较](https://cn.vuejs.org/v2/guide/comparison.html)或百度之
- 如果您一直简单的使用诸如Jquery这一类插件式编程框架，或一直借用后端页面渲染(如python-django、php、jsp...)来开发前端的，vue简单的工程结构也不会让您觉得陌生。一个.vue是由template、javascript、style三个部分组成，分别对应于html、js、css，是不是很熟悉？详细可参考[vue教程](https://cn.vuejs.org/v2/guide/)

### vuex
vuex借鉴了flux、redux的设计思想，将应用的状态和组件内状态进行了区分，将应用的公共状态汇聚到了一处统一管理，避免了组件之间的状态传递。
您仍然可以按照MVVM常规的利用组件间的数据绑定进行数据传递，也可以尝试使用vuex，把组件的共享状态抽取出来，以一个全局单例模式管理。在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

### vue-router
使用vue-router可以轻松的管理SPA页面路由。
- 可参考教程[vue-router教程](https://router.vuejs.org/zh-cn/essentials/getting-started.html)

### vux
Vux是基于WeUI和Vue(2.x)开发的移动端UI组件库，对一些常用的组件诸如alert/confirm/日历/导航等做了移动端上的封装，方便开发者快速生成自己的应用
- 可参考教程[vux教程](https://vux.li/#/)

### webpack
如果您一直使用的是诸如RequireJS这类AMD框架进行工程化组织，那么不妨尝试一下CommonJS的编码规范。利用npm + webpack作为工程化构建方式，一定会让你欣喜。
它可以轻松的通过import/require的方式进行模块化编程，可以让您体验到es6/es7标准的便利，可以让您在不同环境打包相应的代码...
- 可参考教程[webpack教程](https://webpack.js.org/guides/)

### postcss
PostCSS，可以直观的理解为：它就是一个平台~ 通过这个平台，可以轻松使用大家熟悉的less/sass/stylus等样式预处理器，可以使用prefixer自动对浏览器样式兼容...
本demo中所使用的是sass作为通用样式预处理器
- 可参考教程[postcss教程](https://github.com/postcss/postcss)
- 可参考教程[sass教程](http://sass-lang.com/guide)

## 工程结构概览
### 主要目录结构
h5 demo主要工程目录结构如下：
``` shell
  |- root
    |- build 前端工程构建文件夹，诸如webpack、postcss的配置文件

  |- dist 前端生成的资源文件
    |- js 通过npm run dev/npm run prod 生成的目标js文件
    |- css 通过npm run dev/npm run prod 生成的目标css文件
    |- nim 从云信官网上下载的[web sdk](http://netease.im/im-sdk-demo)

  |- res 图片资源文件(目前nos的资源全在网易的cdn服务器上，这里是给开发者的一个备份示例)

  |- src h5 demo 开发工程
    |- main.js 应用页面主入口
    |- App.vue 应用页面模板入口，即被main.js挂载
    |- login.js
    |- regist.js

    |- configs demo基本配置，可参考教程[牛刀小试](./docs/h5-demo-guide-1.md)

    |- pages demo具体页面UI逻辑，可参考教程[登堂入市](./docs/h5-demo-guide-2.md)
      |- components demo UI组件，如聊天控件、表情控件等

    |- plugins 适配于vue的插件

    |- router 前端路由

    |- store h5 demo数据驱动的管理中心，可参考教程[出神入化](./docs/h5-demo-guide-3.md)
      |- index.js vuex数据中心入口
      |- state.js 数据中心变量声明
      |- actions 异步数据变更请求提交
      |- mutations 同步操作数据变更

    |- themes h5 demo的主要公共UI样式库，可参考教程[牛刀小试](./docs/h5-demo-guide-1.md)

    |- utils 工具函数

  |- login.html 登录页面
  |- regist.html 注册页面
  |- index.html 主页面
  |- server.js 开发环境后端服务脚本
```

### 进入开发
#### 牛刀小试
该部分主要向开发者介绍h5 demo的主要配置项、样式构成、路由结构，使得开发者只要通过修改配置、样式、图片等方式，即生成自己的demo，而无需更改代码底层。
- [牛刀小试](./docs/h5-demo-guide-1.md)

#### 登堂入市
该部分主要向开发者介绍h5 demo的主要页面结构和主要数据层交互，使得开发者可以高度定制h5 demo的UI及交互。
- [登堂入市](./docs/h5-demo-guide-2.md)

#### 出神入化
该部分主要向开发者介绍h5 demo的数据结构及数据驱动层，使得开发者可以依据[web sdk](http://dev.netease.im/docs/product/IM即时通讯/SDK开发集成/Web开发集成)，深度订制自己崭新的业务功能。
- [出神入化](./docs/h5-demo-guide-3.md)

## 移动端 html5 开发小技巧
### 移动浏览器上fixed样式问题
- 问题：在ios下，一个页面如果有fixed浮层，并且浮层里面有input，那么当input focused的时候，fiexed层的位置就会错乱。
- 解决：在h5 demo中全盘放弃了fixed样式，而以父元素样式absolute替代，并占满全屏。
  - (以.app样式为例)
  - css 样式
  ``` css
    body {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .app {
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-top: 4rem; /* 该处就可以留给导航tab位置 */
      ...
    }
    .app .main {
      position: relative;
      width: 100%;
      height: 100%;
      scroll-y: scroll; /* 该元素内部就可以留给滚动条了 */
    }
  ```
  - html 结构
  ``` html
    <body>
      <!-- 导航 -->
      <div class="app">
        <div class="main"></div>
      </div>
    </body>
  ```

### 滑动迟滞问题
- 问题：在ios下，非body下直接出现的滚动条，出现滑动迟滞
- 解决：添加样式："-webkit-overflow-scrolling: touch;" 可以让页面在Native端滚动时模拟原生的弹性滚动效果

### HTML切页过渡动效
- 问题：在移动端页面上为了更贴近于原生应用般的交互模式，如何制作切页动效
- 解决：首先我们确定切页动效的基本思路是由css3的transform实现：
  - 例如：在页面进入前瞬间对父元素添加样式forward-enter，再在进入一段时间以后替换样式forward-enter-to
    ``` css
      .forward-enter-active {
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.5s;
        z-index: 0;
      }
      .forward-enter {
        transform: translate3d(100%, 0, 0);
      }
      .forward-enter-to {
        transform: translate3d(0, 0, 0);
      }
    ```
  - 本h5 demo 利用了vue-router插件，充分利用了页面路由加载时机，配合css3做了动效管理。可以参见：src/App.vue、src/themes/common/animation.css
  - 参考阅读：[vue-router过渡动效](https://router.vuejs.org/zh-cn/advanced/transitions.html)

### 异步数据请求等待
- 问题：异步组件加载，在网络慢时等待时间会很长
- 解决：显示Loading状态缓解一下用户等待情绪十分重要。h5 demo中设置了全局Loading组件，通过数据中心管理是否显示。异步请求前触发showLoading事件，而得到回调以后触发hideLoading事件。

### 数据很多的处理
- 问题：单页应用中，如果一次加载数据过多，极易造成页面卡顿
- 解决：传统PC端解决方式是数据分页。但在移动端分页不太符合移动端交互习惯。h5 demo在历史记录的设计中，使用了分页加载更多的交互。同时与服务端约定新加载数据以lastMsg-idServer做去重校验。

### js和css资源过大，加载很慢
- 问题：将所有页面组件一次性加载是一个很浪费资源和考验用户耐心的做法，尤其在移动端。
- 解决：webpack 提供了code splitting，可以实现当切换到特定路由时才加载代码。在h5 demo 的 build/webpack.config.js中就有相应配置。
