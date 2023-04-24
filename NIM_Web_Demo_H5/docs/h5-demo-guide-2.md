# WEB DEMO - alpha (HTML5-VUE版本) 源码导读 - 登堂入市
## 概述
该部分主要向开发者介绍h5 demo的主要页面结构和主要数据层交互，使得开发者可以高度定制h5 demo的UI及交互。如果开发者在阅读本章时有一些配置上的困难，可以回过头去阅读[牛刀小试](./h5-demo-guide-1.md)

## 页面逻辑结构
- h5 demo的所有交互页面均放在src/pages文件夹下
- components文件夹则是一些可复用组件的集合，诸如表情控件、聊天记录组件、导航条、加载框等。
- 本demo在UI交互上大量使用了vux封装了的组件库，参考[vux教程](https://vux.li/#/)。用户也可以根据自己的需求对此进行重新封装或者重写，以满足自身业务需求。

## vue开发相关
- 整个h5 demo所使用的vue框架，在程序编写及数据展示上面，相比于React、Angular2等mvvm框架，会显得更贴近于传统前端的开发习惯。
  - 每一个.vue文件由template、script、style三部分组成，script是必须的，template可以塞入script标签内，也可以独立(本h5 demo都是独立展示的)，style可不展示。是不是特别像一个标准的html结构呢？
  - vue的核心思想即数据驱动，可以把computed、data的数据直接塞入模板中，而不需要像传统前端编程中，需要通过取节点-塞数据完成（框架帮你完成啦~）。
  - 相比于Angular/React的数据流绑定，借助vuex的vue显得更加灵活。通过全局注册vuex插件，任何组件都可以通过this.$store.state共享全局数据，也可以通过this.$store.dispatch申请提交数据请求。而不必困扰于多级组件的数据交互问题。
  - vue的交互方式。参见[vue事件处理](https://cn.vuejs.org/v2/guide/events.html)
  - vue的生命周期。参见[vue生命周期](https://cn.vuejs.org/v2/guide/instance.html#生命周期图示)
  - 页面交互都是业务逻辑，就不一一赘述。需要了解h5 demo数据层的可以移步[出神入化](./h5-demo-guide-3.md)

## 工程目录结构
- 前端工程构建文件夹 build
  - 诸如webpack、postcss的配置文件

- 图片资源文件 res
  - (目前nos的资源全在网易的cdn服务器上，这里是给开发者的一个备份示例)，在res文件夹下会有一个备份

- 生成脚本代码 dist
  - js 通过npm run dev/npm run prod 生成的目标js文件
  - css 通过npm run dev/npm run prod 生成的目标css文件
  - nim 从云信官网上下载的[web sdk](http://netease.im/im-sdk-demo)

- 工程开发目录 src
  - main.js 应用页面主入口
  - App.vue 应用页面模板入口，即被main.js挂载
  - login.js
  - regist.js

  - 工具函数 utils
    - cookie.js 读写cookie工具
    - md5.js md5加密工具
    - page.js 页面跳转工具，以及判断路由是否是主导航页
    - index.js 其他通用工具函数

  - VUE插件 plugins
    - 触摸插件，vue-touch不支持vue 2.0 用plugins/touchEvent

  - 配置文件 configs
    - configs demo基本配置

  - pages demo具体页面UI逻辑
    - components demo UI组件，如聊天控件、表情控件等

  - router 前端路由

  - store h5 demo数据驱动的管理中心
    - index.js vuex数据中心入口
    - state.js 数据中心变量声明
    - actions 异步数据变更请求提交
    - mutations 同步操作数据变更

  - themes h5 demo的主要公共UI样式库
    - themes.css / themes1.css ... 直接可替换的公共皮肤配置
    - common
      - animation.css 切页动画及其他css3动画
      - base.css 基准样式
      - grid.css 布局样式，一般以g-开头
      - module.css 模块样式，一般以m-开头
      - unit.css 单元样式，一般以u-开头
      - weui.css 用于重置vux/weUi默认样式