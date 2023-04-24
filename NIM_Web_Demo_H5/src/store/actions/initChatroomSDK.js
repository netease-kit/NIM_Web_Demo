/* 
 * 聊天室SDK，依赖于nim sdk
 */

import config from '@/configs'
import pageUtil from '@/utils/page'
import util from '@/utils'
import store from '../'
import {onChatroomMsgs} from './chatroomMsgs'

const SDK = require('@/sdk/' + config.sdk)

// 切换聊天室之前需要断开连接，原因是移动端不断累积连接实例，消息并发较大时会有性能问题
// 重新初始化 NIM SDK
export function initChatroomSDK ({ state, commit, dispatch }, obj) {
  let {chatroomId, address} = obj
  if (chatroomId && address) {
    if (state.chatroomInsts[chatroomId]) {
      state.chatroomInsts[chatroomId].connect()
    } else {
      state.chatroomInsts[chatroomId] = SDK.Chatroom.getInstance({
        appKey: config.appkey,
        account: state.userUID,
        token: state.sdktoken,
        transports: ['websocket'],
        chatroomId,
        chatroomAddresses: address,
        onconnect: function onChatroomConnect (chatroom) {
          dispatch('hideLoading')
          commit('setCurrChatroom', chatroomId)
        },
        onerror: function onChatroomError (error, obj) {
          dispatch('hideLoading')
          if (error) {
            alert('网络连接状态异常')
            location.href='#/room'
          }
        },
        onwillreconnect: function onChatroomWillReconnect (obj) {
          // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
          console.log('即将重连', obj)
        },
        ondisconnect: function onChatroomDisconnect (error) {
          // 此时说明 `SDK` 处于断开状态, 切换聊天室也会触发次回调
          dispatch('hideLoading')
          if (error) {
            switch (error.code) {
              // 账号或者密码错误, 请跳转到登录页面并提示错误
              case 302:
                // 此逻辑与nim sdk错误逻辑相同，复用nim sdk的
                // 如果单用聊天室功能需要在此做处理
                break;
              case 13003:
                alert('抱歉，你已被主播拉入了黑名单')
                location.href='#/room'
                break
                // 被踢, 请提示错误后跳转到登录页面
              case 'kicked':
                if (error.reason === 'managerKick') {
                  alert('你已被管理员移出聊天室')
                  location.href='#/room'
                } else if (error.reason === 'blacked') {
                  alert('你已被管理员拉入黑名单，不能再进入')
                  location.href='#/room'
                }
                break;
              default:
                console.log(error.message);
                break
            }
          }
        },
        // 聊天室消息
        onmsgs: onChatroomMsgs 
      })
    }
  } else {
    alert('没有聊天室地址')
  }
}

export function resetChatroomSDK ({state, commit, dispatch}, chatroomId) {
  if (chatroomId) {
    state.chatroomInsts[chatroomId].disconnect()
  } else {
    for (let tempRoomId in state.chatroomInsts) {
      state.chatroomInsts[tempRoomId].disconnect()
    }
  }
  commit('resetCurrChatroom')
}
