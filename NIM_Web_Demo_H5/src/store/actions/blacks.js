/*
 * 黑名单及静音列表
 */

import store from '../'

// 完成添加/删除黑名单，初始化获取黑名单列表，都会触发此函数
export function onBlacklist (blacks) {
  blacks = blacks.map(item => {
    if (typeof item.isBlack !== 'boolean') {
      item.isBlack = true
    }
    return item
  })
  // 更新黑名单列表
  store.commit('updateBlacklist', blacks)
  // 在好友身上打上标记
  store.commit('updateFriends', blacks)
  // 更新好友信息字典
  store.commit('updateUserInfo', blacks)
}

export function onMarkInBlacklist (obj) {
  obj = obj || obj2
  let account = obj.account
  // 说明是自己，被别人加入黑名单
  if (account === store.state.userUID) {

  } else {
    // 说明是别人的帐号，黑名单通知
    if (typeof obj.isAdd === 'boolean') {
      onBlacklist([{
        account,
        isBlack: obj.isAdd
      }])
    }
  }
}

export function updateBlack ({state}, {account, isBlack}) {
  const nim = state.nim
  if (account && (typeof isBlack === 'boolean')) {
    nim.markInBlacklist({
      account,
      // `true`表示加入黑名单, `false`表示从黑名单移除
      isAdd: isBlack,
      done: function (error, obj) {
        if (error) {
          alert(error)
          return
        }
        onMarkInBlacklist(obj)
      }
    })
  }
}