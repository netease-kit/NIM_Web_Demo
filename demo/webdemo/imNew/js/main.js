/**
 * 主要业务逻辑相关
 */
var userUID = readCookie("uid")
/**
 * 实例化
 * @see module/base/js
 */
var yunXin
// 等待私有化配置请求完毕
if (CONFIG.usePrivateEnv === 1) {
 function waitPrivateConf() {
   if (CONFIG.privateConf || CONFIG.usePrivateEnv === 2) {
     yunXin = new YX(userUID)
   } else {
     setTimeout(waitPrivateConf, 1000)
   }
 }
 waitPrivateConf()
} else {
  yunXin = new YX(userUID)
}
