# WEB DEMO - alpha (HTML5-VUE版本) 源码导读 - 牛刀小试
## 概述
该部分主要向开发者介绍h5 demo的主要配置项、样式构成，使得开发者只要通过修改配置、样式、图片等方式，即生成自己的demo，而无需更改代码底层。

## 基本配置项
1. 资源文件的配置
  - AppKey、登录注册页面、自定义图片的配置
    - 在src/configs中，可进行相关配置
    - 由于不同的开发者会有不同的后端路由结构设计，所以h5 demo特意提炼出了loginUrl、registUrl、homeUrl方便开发者进行配置
    - 由于不同的开发者会有个性化logo、图标的需求，以及资源和应用分布式部署的需求，配置文件也对此进行了提取
  - 用户自定义表情包
    - 在src/configs中，用户可以配置自己所需的表情包

2. 样式文件的配置
  - h5 demo 的公共样式入口均为 src/themes/theme.css，其对应生成的文件为dist/css/theme.css
  - common中的文件均会通过import的形式被theme.css所引用，但不会直接在生成文件中被直接使用
  - 为了方便开发者自定义自己希望的皮肤，h5 demo对一些常用配置做了抽象(按照scss预处理语法)
    - 以下则为通过更换不同theme.css文件生成的皮肤示例
  - 主题示例1
    ![主题示例1](http://yx-web-nosdn.netease.im/webdoc/h5/docs/h5demo-theme-1.jpg)
  - 主题示例2
    ![主题示例2](http://yx-web-nosdn.netease.im/webdoc/h5/docs/h5demo-theme-2.jpg)
  - 主题示例3
    ![主题示例3](http://yx-web-nosdn.netease.im/webdoc/h5/docs/h5demo-theme-3.jpg)
  - 如果开发者仅仅需要更改特定页面的样式而不希望影响到公共组件，则可以到src/pages/*.vue直接更改style标签

3. 路由的配置
  - 根据客户不同的需求，会需要对页面导航进行调整，去掉某些功能等，此时就会涉及到路由规则
  - h5 demo的路由文件为 src/router/index.js文件，内部描述了不同的页面url所对应展示的页面组件
  - 如果开发者需要对导航条进行修改，还需要修改两个文件
    1. NavBar组件，即导航条组件，在src/pages/components/NavBar.vue，可以更改导航条文案、图标甚至是路由关系
    2. main.js入口，及src/main.js，该处会挂载App.vue，App.vue为实际vue模板入口
    3. App入口，即src/App.vue，在script中的computed属性中，确认哪些页面需要展示导航条

## 更多设置
- 恭喜你，已经可以自由的更改应用配置和皮肤啦，希望能对页面交互进行深入订制，请移步[登堂入市](./h5-demo-guide-2.md)