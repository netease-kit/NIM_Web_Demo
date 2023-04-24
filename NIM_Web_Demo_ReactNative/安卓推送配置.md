### Android 手动配置

#### 手动link

请在 app gradle 文件 dependencies 添加此模块。

#### AndroidManifest.xml 配置

- 权限部分
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.GET_TASKS" />
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

- 小米推送

自定义权限

```xml
<permission
        android:name="你的应用包名.permission.MIPUSH_RECEIVE"
        android:protectionLevel="signature" />
<uses-permission android:name="你的应用包名.permission.MIPUSH_RECEIVE" />
```

推送服务和广播

```xml
<service
    android:name="com.xiaomi.push.service.XMJobService"
    android:enabled="true"
    android:exported="false"
    android:permission="android.permission.BIND_JOB_SERVICE"
    android:process=":mixpush" />

<service
    android:name="com.xiaomi.push.service.XMPushService"
    android:enabled="true"
    android:process=":mixpush" />

<receiver
    android:name="com.xiaomi.push.service.receivers.PingReceiver"
    android:exported="false"
    android:process=":mixpush">
    <intent-filter>
        <action android:name="com.xiaomi.push.PING_TIMER" />
    </intent-filter>
</receiver>

<receiver
    android:name="com.xiaomi.push.service.receivers.NetworkStatusReceiver"
    android:exported="true">
    <intent-filter>
        <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</receiver>

<service
    android:name="com.xiaomi.mipush.sdk.PushMessageHandler"
    android:enabled="true"
    android:exported="true" />

<service
    android:name="com.xiaomi.mipush.sdk.MessageHandleService"
    android:enabled="true" />

<receiver
    android:name="com.netease.nimlib.mixpush.mi.MiPushReceiver"
    android:exported="true">
    <intent-filter android:priority="0x7fffffff">
        <action android:name="com.xiaomi.mipush.RECEIVE_MESSAGE" />
        <action android:name="com.xiaomi.mipush.MESSAGE_ARRIVED" />
        <action android:name="com.xiaomi.mipush.ERROR" />
    </intent-filter>
</receiver>
```

- 华为推送

appId 配置

```xml
<meta-data
        android:name="com.huawei.hms.client.appid"
        android:value="填写你在华为推送平台申请的appId" />
```

推送服务和广播

```xml
<provider
    android:name="com.huawei.hms.update.provider.UpdateProvider"
    android:authorities="你的应用包名.hms.update.provider"
    android:exported="false"
    android:grantUriPermissions="true" />

<!-- 第三方相关 :接收Push消息（注册、Push消息、Push连接状态）广播 -->
<receiver android:name="com.netease.nimlib.mixpush.hw.HWPushReceiver">
    <intent-filter android:priority="0x7fffffff">
        <!-- 必须,用于接收token -->
        <action android:name="com.huawei.android.push.intent.REGISTRATION" />
        <!-- 必须，用于接收消息 -->
        <action android:name="com.huawei.android.push.intent.RECEIVE" />
        <!-- 可选，用于点击通知栏或通知栏上的按钮后触发onEvent回调 -->
        <action android:name="com.huawei.android.push.intent.CLICK" />
        <!-- 可选，查看push通道是否连接，不查看则不需要 -->
        <action android:name="com.huawei.intent.action.PUSH_STATE" />
    </intent-filter>
    <meta-data
        android:name="CS_cloud_ablitity"
        android:value="successRateAnalytics" />
</receiver>

<receiver android:name="com.huawei.hms.support.api.push.PushEventReceiver">
    <intent-filter>
        <!-- 接收通道发来的通知栏消息，兼容老版本Push -->
        <action android:name="com.huawei.intent.action.PUSH" />
    </intent-filter>
</receiver>
```

- 魅族推送

自定义权限

```xml
<!-- 兼容flyme5.0以下版本，魅族内部集成pushSDK必填，不然无法收到消息-->
<uses-permission android:name="com.meizu.flyme.push.permission.RECEIVE" />
<permission android:name="你的应用包名.push.permission.MESSAGE"
            android:protectionLevel="signature"/>
<uses-permission android:name="你的应用包名.push.permission.MESSAGE" />
<!--  兼容flyme3.0配置权限-->
<uses-permission android:name="com.meizu.c2dm.permission.RECEIVE" />
<permission android:name="你的应用包名.permission.C2D_MESSAGE"
            android:protectionLevel="signature" />
<uses-permission android:name="你的应用包名.permission.C2D_MESSAGE"/>
```

推送服务和广播

```xml
<receiver android:name="com.netease.nimlib.mixpush.mz.MZPushReceiver">
    <intent-filter android:priority="0x7fffffff">
        <!-- 接收push消息 -->
        <action android:name="com.meizu.flyme.push.intent.MESSAGE" />
        <!-- 接收register消息 -->
        <action android:name="com.meizu.flyme.push.intent.REGISTER.FEEDBACK" />
        <!-- 接收unregister消息-->
        <action android:name="com.meizu.flyme.push.intent.UNREGISTER.FEEDBACK" />
        <!-- 兼容低版本Flyme3推送服务配置 -->
        <action android:name="com.meizu.c2dm.intent.REGISTRATION" />
        <action android:name="com.meizu.c2dm.intent.RECEIVE" />
        <category android:name="你的应用包名" />
    </intent-filter>
</receiver>
```

- FCM 谷歌推送

```xml
<service android:name="com.netease.nimlib.mixpush.fcm.FCMTokenService">
    <intent-filter>
        <action android:name="com.google.firebase.INSTANCE_ID_EVENT" />
    </intent-filter>
</service>

<!--设置收到 fcm 通知展示的图标和颜色-->
<meta-data
    android:name="com.google.firebase.messaging.default_notification_icon"
    android:resource="@drawable/xxx" />
<meta-data
    android:name="com.google.firebase.messaging.default_notification_color"
    android:resource="@color/xxx" />
```

#### 推送 SDK 引入

- 小米推送

请至官网下载 MiPush_SDK_Client_3_6_2.jar，添加到 app 的libs 目录下。

- 华为推送

请在 app gradle 文件 dependencies 添加 
    `implementation 'com.huawei.android.hms:push:2.6.0.301'`；此外，在工程根目录的 gradle 文件，allprojects的 repositories 节点下，添加 `maven {url 'http://developer.huawei.com/repo'}`。

- 魅族推送

请在 app gradle 文件 dependencies 添加 
    `implementation 'com.meizu.flyme.internet:push-internal:3.6.3@aar'`；

- FCM 推送

请在 app gradle 文件 dependencies 添加

```groovy
implementation 'com.google.firebase:firebase-messaging:11.6.0'
implementation 'com.google.android.gms:play-services-base:11.6.0'
```
，在 app gradle 文件末尾添加

```groovy
apply plugin: 'com.google.gms.google-services'
```

将FCM 生成的 `goole-services.json` 添加到 app 根目录。


