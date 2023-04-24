import {NativeModules} from 'react-native'

export default NativeModules.NIMPushModule

export function getDeviceInfo (callback) {
  if (NativeModules.NIMPushModule) {
    NativeModules.NIMPushModule.getDeviceInfo(callback)
  } else {
    callback()
  }
}

export function onLogin ({account, pushType, hasPushed = false, lastDeviceId = ''}) {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.onLogin(account, pushType, hasPushed, lastDeviceId)
}

export function showNotification ({icon, title, content, time}) {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.showNotification(icon, title, content, time)
}

export function clearNotification () {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.clearNotification()
}

export function registerPush ({
  xmAppId,
  xmAppKey,
  xmCertificateName,
  hwAppId,
  hwCertificateName,
  mzAppId,
  mzAppKey,
  mzCertificateName,
  fcmCertificateName,
  vivoCertificateName,
  oppoAppId,
  oppoAppKey,
  oppoAppSercet,
  oppoCertificateName,
  tokenCallback}) {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.init(xmAppId, xmAppKey, 
  xmCertificateName, hwAppId,
    hwCertificateName, mzAppId, mzAppKey, mzCertificateName, fcmCertificateName, vivoCertificateName,
    oppoAppId, oppoAppKey, oppoAppSercet, oppoCertificateName, tokenCallback)
}

export function onLogout () {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.onLogout()
}

export function setDeviceId (deviceId) {
  NativeModules.NIMPushModule && NativeModules.NIMPushModule.setDeviceId(deviceId)
}
