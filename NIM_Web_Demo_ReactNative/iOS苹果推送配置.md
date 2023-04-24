# iOS苹果推送配置
## 创建应用 App ID
 * 登陆 iOS Dev Center 选择进入 Certificates,Identifiers & Profiles。
 
 <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_0.jpg" width="400"/>
 
 * 点击左栏 iOS Apps IDs ,进入 Identifiers - App IDs 列表
  
 <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_1.jpg" height="400"/>
 

 * 点击右侧 “+” 号，创建 App ID

 <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_2.jpg"  width="400"/>

 
## 为 App 开启 Push Notification 功能
 * 点击创建好的 App，选择 Edit 按钮。
 * 勾选 Push Notifications 功能，点击配置证书按钮，进入配置证书页面。请注意开发证书的种类，开发证书供开发调试使用，生产证书供发布使用。
 
   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_3.jpg"  width="400"/>

## 配置证书
 *   在 OSX 系统中点击“钥匙串访问”，生成请求证书。
 
   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_5.jpg"  width="400"/>
   
 *  在证书信息中填入常用邮件地址，选择保存到磁盘。

   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_6.jpg"  width="400"/>

 *   在上一节进入的配置证书页，点击 Continue。
 
   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_4.jpg"  width="400"/>
   
 *   将刚刚生成的请求证书上传，点击 Generate。
 
   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_7.jpg"  width="400"/>
   
 *   完成后下载并打开证书，会将证书自动导入钥匙串。
     
     在“钥匙串访问中”的“我的证书”里可以找到刚刚导入的证书。

## 导出推送所需 p12 文件

 *   选择刚刚导进来的证书，选择右键菜单中的导出选项。
 
   <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_8.jpg"  width="400"/>

 *	 保存 p12 文件时，请设置密码，上传证书时需要填写密码。

	<img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_10.jpg"  width="400"/>

	<img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_11.jpg"  width="400"/>

        
         
## 上传网易云信服务器
 *   进入网易云信管理中心，选择 appkey 对应的应用，点击“应用配置”选项。
 *   按图中所示，上传刚刚导出的 p12 文件。可以上传多个 p12 文件，以上传时所填入的证书名称做区分。
 *   开发环境或生产环境，请选择与该证书生成时相同的环境类型。
 
    <img src="http://yx-web.nosdn.127.net/webdoc/im/ios/p12_9.jpg"  width="400"/>
