import store from '../'
import {onUpdateFriend, onDeleteFriend} from './friends'
import {onRevocateMsg} from './msgs'

export function onSysMsgs (sysMsgs) {
  store.commit('updateSysMsgs', sysMsgs)
}

export function onSysMsg (sysMsg) {
  switch (sysMsg.type) {
    // 在其他端添加或删除好友
    case 'addFriend':
      onUpdateFriend(null, {
        account: sysMsg.from
      })
      store.commit('updateSysMsgs', [sysMsg])
      break
    case 'deleteFriend':
      onDeleteFriend(null, {
        account: sysMsg.from
      })
      break
    // 对方消息撤回
    case 'deleteMsg':
      if(sysMsg.scene === 'p2p') {
        sysMsg.sessionId = `p2p-${sysMsg.from}`
      } else {
        sysMsg.sessionId = `team-${sysMsg.to}`
      }
      onRevocateMsg(null, sysMsg)
      break
    case 'teamInvite': //被邀请入群
    case 'applyTeam':  // 申请入群
    case 'rejectTeamApply':  // 申请入群被拒绝
    case 'rejectTeamInvite': // 拒绝入群邀请
      store.commit('updateSysMsgs', [sysMsg])
      break
  }
  store.commit('updateSysMsgState', sysMsg)
}

export function onSysMsgUnread (obj) {
  store.commit('updateSysMsgUnread', obj)
}

export function onCustomSysMsgs (customSysMsgs) {
    console.log(customSysMsgs)
  if (!Array.isArray(customSysMsgs)) {
    customSysMsgs = [customSysMsgs]
  }
  customSysMsgs = customSysMsgs.filter(msg => {
    if (msg.type === 'custom') {
      if (msg.content) {
        try {
          let content = JSON.parse(msg.content)
          // 消息正在输入中
          if ((content.id + '') === '1') {
            return false
          }
        } catch (e) {}
      }
    }
    return true
  })
  if (customSysMsgs.length > 0) {
    store.commit('updateCustomSysMsgs', customSysMsgs)
  }
}

// 不传obj则全部重置
export function markSysMsgRead ({state, commit}, obj) {
  const nim = state.nim
  let sysMsgs = []
  if (obj && obj.sysMsgs) {
    sysMsgs = obj.sysMsgs
  } else {
    sysMsgs = state.sysMsgs
  }
  if (Array.isArray(sysMsgs) && sysMsgs.length > 0) {
    nim.markSysMsgRead({
      sysMsgs,
      done: function (error, obj) {
      }
    })
  }
}

export function markCustomSysMsgRead ({state, commit}) {
  commit('updateCustomSysMsgUnread', {
    type: 'reset'
  })
}

export function resetSysMsgs ({state, commit}, obj) {
  commit('resetSysMsgs', obj)
}

export function deleteSysMsgs({commit}, obj) {
  commit('deleteSysMsgs', obj)
}