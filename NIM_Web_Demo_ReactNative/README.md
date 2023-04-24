0.57.x 的 RN demo 将不在维护，新的 demo 工程参见 [NIM_ReactNative_Demo_0.61.5](https://github.com/netease-im/NIM_ReactNative_Demo_0.61.5)

0.57.x RN demo will not be maintained. About the new demo project, see [NIM_ReactNative_Demo_0.61.5](https://github.com/netease-im/NIM_ReactNative_Demo_0.61.5)

# 云信 WebSDK ReactNative Demo 导读

## 初始化
- 本demo建议使用react-native >=0.51 的版本 

### 项目初始化及调试

1. 配置iOS/Android相关运行环境，可以参考：[ReactNative搭建开发环境](https://reactnative.cn/docs/0.51/getting-started.html)
2. 下载demo工程至本地
3. 通过`yarn`或`npm`安装js包依赖，即工程目录下，命令行执行：`yarn`或`npm install`
4. Demo工程已对依赖做过了相应的配置，**无需再执行 react-native link 命令**，否则会报重复依赖的错误！！！
5. 打开模拟器或者连接真机调试：
  - iOS环境：
    - iOS需要实现保证已安装XCode
    - 控制台执行 `react-native run-ios`
  - 安卓环境：
    - 打开android-studio => 打开已有工程 => 选择`<工程文件夹>/android`目录
    - 点击android-studio右上方 同步(sync)按钮
    - (首次运行需要)根据提示，需要额外安装sdk-24, sdk-25, sdk-26的版本库(如果之前没有装过)
    - 打开安卓模拟器(android-studio右上角绿色三角形符号)
    - 控制台执行 `react-native run-android`
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/android-studio.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/android-tools.png)
6. 控制台日志输出：
  - iOS环境： `react-native log-ios`
  - 安卓环境： `react-native log-android`
7. 更多调试方法参看：[调试RN](https://reactnative.cn/docs/0.51/debugging.html#content)


### iOS工程初始化的一些问题

#### Print: Entry, ":CFBundleIdentifier", Does Not Exist
一般通过`react-native run-ios`，会去下载`boost`、`double-conversion`、`folly`、`glog`等4个包，由于国内镜像源资源有所损坏，所以可能编译报错，开发者可以替换`node_modules/react-native/third-party`中的报内容。

相应的包，demo工程已经放到nim目录下供开发者参考

### 线上Release包发布
**线上发布环境，云信sdk初始化配置`debug`选项务必设置为`false`，否则`console.error`可能会导致应用崩溃**

#### iOS发布
1.双击 <工程目录>/ios 目录下的 `NIM_ReactNative_Demo.xcodeproj` 工程
2.选择 build device -> Generic iOS Device, 然后 clean 一下工程，选择 Product -> Archive
3.等待一段时间，出现如下界面
![](http://yx-web.nos.netease.com/webdoc/default/archive.png)
4.选择 Export 后出现选择发布的方式，这里我们的证书对应 enterprise，因此这样选择，具体选择请参考自己申请的证书类型 
![](http://yx-web.nos.netease.com/webdoc/default/distribution.png)
5.接下来这个页面可以保持默认
![](http://yx-web.nos.netease.com/webdoc/default/default.png)
6.选择对应的 distribution 证书
![](http://yx-web.nos.netease.com/webdoc/default/cer.png)
这样就导出了 ipa 包用于发布于一些第三方管理平台例如蒲公英，如果需要发布 App Store 配置基本类似，这里不赘述。

#### android发布
1. 打开控制台，进入app/android文件夹
2. 执行命令：`./gradlew assembleRelease`
3. 安卓签名请参考[打包APK](https://reactnative.cn/docs/signed-apk-android.html#content)


## Demo工程项目
### 项目结构
- 项目入口：
  - index.js
    - 全局使用 global.__IOS__ / global.__ANDROID 判断是哪个平台
  - App.js
    - 被index.js挂载，用于初始化页面状态管理器mobx
  - android 安卓编译及运行工程
  - ios iOS编译及运行工程
  - src - 项目代码编写的地方
    - index.js
      - 页面入口，用于路由管理
    - components/navBottom.js
      - 导航栏组件，在功能页中引入
    - page
      - 页面编写，所有需要被使用的页面 均需被注册在 src/pages/index.js 中，方便 src/index.js及src/tabNavigator.js所引用
      - 引入方式如 import Pages from './pages' => Pages.Login Pages.Session ...
    - components
      - UI组件
    - store
      - mobx 状态中心管理地址
      - actions
        - mobx全局提交事件，其中`link.js`为云信sdk全局连接状态管理
      - stores
        - 云信sdk的连接、收发消息、存储管理等一切事件所存储的数据
    - themes
      - css 样式文件，所有需要被使用的样式 均需被注册在 src/themes/index.js，方便页面及组件所引用
      - 引入方式如 import { globalStyle } from '../themes'
    - res
      - 图片等资源文件
    - configs
      - 配置信息
    - common
      - 设备信息等公共信息
    - util
      - 一些功能方法，诸如贴图表情、md5、数组操作、时间处理等等

### RN TextInput输入中文Bug解决
- React-Native 升级到0.55.4以后，TextInput不支持输入中文，需要额外对ios做特殊处理，具体参考源码 src/component/chatBox.js

## 云信SDK的使用

### 简述
- 云信WebSDK-ReactNative(以下简称RN-SDK)的大部分API使用方法与SDK在Web浏览器环境使用相同，以减少开发者使用SDK所带来的障碍。
- 开发文档参见：
  - [云信WebSDK开发集成]http://dev.yunxin.163.com/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E6%A6%82%E8%A6%81%E4%BB%8B%E7%BB%8D
- 相比于Web浏览器环境及微信小程序环境，React-Native版本的SDK在以下应用场景上会略有不同。

#### 本地数据库
RN-SDK同时支持含数据库和不含数据库的使用方式，根据开发者的业务场景，可自行处理。

- 不使用数据库，即在sdk初始化时对`db`设为`false`即可，如：

``` javascript
  const nim = NIM.getInstance({
    // debug: true,
    appKey: 'appKey',
    account: 'account',
    token: 'token',
    db: false,
    onconnect: onConnect,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError
  });
```

- 使用数据库，需要开发者安装使用`realm`，[realm](https://realm.io/docs/javascript/latest/#getting-started)，RN-SDK目前不支持但不限制使用`sqlite3`作为本地数据库，开发者可以根据自己的需要，额外做存储处理。
- RN-SDK可以通过`usePlugin`方法将数据库挂在到sdk实例上，用法如下：

``` javascript
  const SDK = require('NIM_Web_SDK_v5.*.js');
  const Realm = require('realm');
  // 此处将外置的realm数据库挂载到sdk上，供sdk使用
  SDK.usePlugin({
    db: Realm,
  });
  const nim = SDK.NIM.getInstance({
    // debug: true,
    appKey: 'appKey',
    account: 'account',
    token: 'token',
    db: true,
    onconnect: onConnect,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError
  });
```


#### 消息推送
- iOS推送
  - iOS 端推送配置首先需要开发者去苹果官网申请具有推送能力的证书，可参考 [iOS 推送配置](./iOS苹果推送配置.md)
  - 配置完证书后，按照 [RN 推送配置](https://reactnative.cn/docs/pushnotificationios.html)添加相关能力
- 安卓推送
  - 参考demo的安卓推送(java)文件目录在 ./android/nimpush，
  - 参考demo的安卓推送(js)文件目录在 ./nim/NIM_Android_Push.js
  - 配置参见[安卓推送配置](./安卓推送配置.md)

``` javascript
  // iOS/安卓端外推送代码
  const iosPushConfig = {
    tokenName: 'push_online',
  };
  const androidPushConfig = {
    xmAppId: '2882303761517806219',
    xmAppKey: '5971780672219',
    xmCertificateName: 'RN_MI_PUSH',
    hwCertificateName: 'RN_HW_PUSH',
    mzAppId: '113798',
    mzAppKey: 'b74148973e6040c6abbda2af4c2f6779',
    mzCertificateName: 'RN_MZ_PUSH',
    fcmCertificateName: 'RN_FCM_PUSH',
  };
  var nim = SDK.NIM.getInstance({
    // ...
    iosPushConfig,
    androidPushConfig,
    // ...
  })

  // 安卓端内推送示例代码
  import { showNotification } from '../nim/NIM_Android_Push';
  showNotification({
    icon: '', title: msg.from, content: showText, time: `${msg.time}`,
  });
```

#### 发送文件/图片等

由于RN-SDK发送文件消息需要额外获取文件消息的属性一起发送，所以不建议直接使用`sendFile`接口发送文件，而是先通过`previewFile`获取文件的句柄，通过其他api方法将文件属性添加回文件对象，最后再使用`sendFile`接口发送文件。以下为发送图片文件的示例：

``` javascripte
  nim.previewFile({
    type: 'image',
    filePath: options.filePath,
    uploadprogress(obj) {
      // ...
    },
    done: (error, file) => {
      // 通过其他API接口获取到长、宽、大小等图片属性
      file.w = options.width;
      file.h = options.height;
      file.md5 = options.md5;
      file.size = options.size;
      const { scene, to } = options;
      if (!error) {
        constObj.nim.sendFile({
          type: 'image',
          scene,
          to,
          file,
          done: (err, msg) => {
            if (err) {
              return;
            }
            this.appendMsg(msg);
          },
        });
      }
    },
  });
```

- 消息需要额外附加属性列表：
  - 图片对象
    - size: 大小, 单位byte
    - md5: md5
    - w: 宽, 单位px
    - h: 高, 单位px
  - 音频对象
    - size: 大小, 单位byte
    - md5: md5
    - dur: 长度, 单位ms
  - 视频对象
    - size: 大小, 单位byte
    - md5: md5
    - w: 宽, 单位px
    - h: 高, 单位px
    - dur: 长度, 单位ms
  - 文件对象
    - size: 大小, 单位byte
    - md5: md5
  
参见[消息对象](http://dev.yunxin.163.com/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E6%B6%88%E6%81%AF%E6%94%B6%E5%8F%91#图片对象)

#### 全局属性注入
由于浏览器环境的全局变量为window，而react-native的全局变量为global，其属性不尽相同，为了做到兼容及适配，RN-SDK会mock一些属性，诸如global.navigator, global.location, global.io等，一般不影响用户正常使用


## 常用配置

### 应用图标更改

- iOS更改目录
<项目路径>/ios/NIM_ReactNative_Demo/Images.xcassets/AppIcon.appiconset

- Android更改目录
<项目路径>/android/app/src/main/res

### 应用显示名称更改

- iOS更改地址
更改图中 Display Name
![](http://yx-web.nos.netease.com/webdoc/default/displayname.png)
或者修改 info.plist 配置

    ```objc
<dict>
	//... other keys
	<key>CFBundleDisplayName</key>
	<string>更换你想替换的名称</string>
	//...
</dict>
```

- Android更改地址
<项目路径>/android/app/src/main/res/values/strings.xml
``` xml
  <resources>
    <string name="app_name">{所需更改的APP名}</string>
  </resources>
```

### NPM镜像库配置（国内淘宝镜像）

- npm config set registry https://registry.npm.taobao.org --global
- npm config set disturl https://npm.taobao.org/dist --global
- npm install -g yarn react-native-cli
- yarn config set registry https://registry.npm.taobao.org --global
- yarn config set disturl https://npm.taobao.org/dist --global

### 第三方依赖
- `mobx` React状态管理
  - https://cn.mobx.js.org/
- `react-navigation` ReactNative路由管理
  - https://reactnavigation.org/docs/en/getting-started.html
- `react-native-elements` UI组件及图标
  - https://react-native-training.github.io/react-native-elements/
  - https://oblador.github.io/react-native-vector-icons/
- `react-native-easy-toast` UI组件,提示框
  - https://github.com/crazycodeboy/react-native-easy-toast
- `react-native-image-picker` 图片选择及摄像头拍照
  - https://www.npmjs.com/package/react-native-image-picker
- `react-native-audio` 语音录制
  - https://www.npmjs.com/package/react-native-audio
- `react-native-sound` 语音播放
  - https://www.npmjs.com/package/react-native-sound
- `react-native-fs` 获取本地文件信息
  - https://www.npmjs.com/package/react-native-fs
- `react-native-video` 视频播放器,demo未实现
  - https://www.npmjs.com/package/react-native-video
- `realm` 本地数据库,用于云信SDK存储本地数据及消息
  - https://realm.io/docs/javascript/latest

### 其他参考阅读
- react 教程
  - https://reactjs.org/
- react-native 中文教程：
  - https://reactnative.cn/docs/0.51/getting-started.html
- 样式flex布局：
  - https://weibo.com/1712131295/CoRnElNkZ?ref=collection&type=comment#_rnd1526607580991
- 错误解决
  - https://stackoverflow.com/questions/45954209/issues-with-resources-generated-by-react-in-android-studio-3


## Demo展示
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/login.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/session.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/chat.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/contact.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/friends.png)
![](https://yx-web.nos-hz.163yun.com/demo/reactnative/namecard.png)


**推荐客户得京东卡，首次推荐成单得3000元京东卡，连续推荐4500元/单，上不封顶。点击参与https://yunxin.163.com/promotion/recommend**

![main](https://github.com/netease-kit/NIM_iOS_UIKit/blob/master/activity-1.png)
