import store from '../'

// 收到群列表及更新群列表接口
export function onTeams(teams) {
  if (!Array.isArray(teams)) {
    teams = [teams]
  }
  teams = teams.filter(item => !!item)
  teams.forEach(team=>{
    if (team.validToCurrentUser === undefined) {
      team.validToCurrentUser = true
    }
    if (team.avatar && team.avatar.indexOf('nim.nosdn.127') >0 && team.avatar.indexOf('?imageView')===-1) {
      team.avatar = team.avatar + '?imageView&thumbnail=300y300'
    }
  })
  store.commit('updateTeamList', teams)
}

// 收到群成员及更新群成员接口
export function onTeamMembers(obj) {
  store.commit('updateTeamMembers', obj)
}

export function onCreateTeam(team) {
  onTeams(team)
  onTeamMembers({
    teamId: team.teamId,
    members: []
    // members: [team.owner]
  })
}

export function onSynCreateTeam(team){
  onTeams(team)
}

export function onDismissTeam(obj) {
  store.commit('updateTeamList', {
    invalid: { teamId: obj.teamId }
  })
}

export function onUpdateTeam(team) {
  onTeams(team)
}

export function onTeamNotificationMsg({state, commit}, msg) {
  if (msg.attach.type === 'updateTeam' && msg.attach.team) {
    store.commit('updateTeamInfo', msg.attach.team)
  }
  if (msg.attach.type === 'transferTeam') {
    onTeamMembers({
      teamId: msg.attach.team.teamId,
      members: msg.attach.members
    })
  }
}

export function onAddTeamMembers(obj) {
  obj.accounts.forEach(account=>{
    // 自己被拉入群时更新群列表
    if (account === store.state.userUID) {
      let team = [obj.team]
      onTeams(team)
    }
  })
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onRemoveTeamMembers(obj) {
  obj.accounts.forEach(account => {
    // 自己被移出群时，更新群列表
    if (account === store.state.userUID) {
      obj.team.validToCurrentUser = false
      let team = [obj.team]
      onTeams(team)
    }
  })
  store.commit('removeTeamMembersByAccounts', {
    teamId: obj.team.teamId,
    accounts: obj.accounts
  })
}

export function onUpdateTeamMember(teamMember) {
  onTeamMembers({
    teamId: teamMember.teamId,
    members: teamMember
  })
}

export function onUpdateTeamMembersMute(obj) {
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onUpdateTeamManagers(obj) {
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onTeamMsgReceipt(obj) {
  obj.teamMsgReceipts.forEach(item => {
    if (item.teamId === store.state.currReceiptQueryTeamId) {
      store.commit('updateSingleTeamMsgReads', item)
    }
  })
  console.log('群消息回执通知' + obj)
}

// 进入可配置的群信息设置页，进入前改变state中的配置信息，进入页面后读取配置信息更新视图
export function enterSettingPage({commit}, obj) {
  commit('updateTeamSettingConfig', obj)
  setTimeout(() => {
    location.href = `#/teamsetting`
  }, 20)
}


/* 
* 代理nim sdk中对群组的操作方法
* @functionName  nim sdk中的方法名
* @options 传递给sdk方法的参数
*/
export function delegateTeamFunction({state}, {functionName, options}) {
  const nim = state.nim
  if (functionName && nim[functionName] && typeof nim[functionName] === 'function') {
    nim[functionName](options)
  } else {
    throw(`There is not property of '${functionName}' in nim or '${functionName}' is not a function`)
  }
}

export function getTeamMembers({ state }, teamId) {
  const nim = state.nim
  if (!nim) {
    // 防止nim未初始化
    setTimeout(() => {
      getTeamMembers(store, teamId)
    }, 200);
    return 
  }
  nim.getTeamMembers({
    teamId: teamId,
    done: (err, obj) => {
      if (obj.members) {
        onTeamMembers({
          teamId: obj.teamId,
          members: obj.members
        })
      } else {
        setTimeout(() => {
          getTeamMembers(store, teamId)
        }, 200);
      }
    }
  })
}

export function checkTeamMsgReceipt({state}, msgs) {
  var result = /team-(\d+)/.exec(state.currSessionId)
  if (!result) {
    return null
  }
  var teamId = result[1]

  var needToPeceiptList= getMsgNeedToReceipt(state, teamId, msgs)
  if (needToPeceiptList && needToPeceiptList.length>0) {
    nim.sendTeamMsgReceipt({
      teamMsgReceipts: needToPeceiptList,
      done: (err, obj, content) => {
        console.log('标记群组消息已读' + (!err ? '成功' : '失败'));
        if (!err) {
          store.commit('updateSentReceipedMap', needToPeceiptList)
        }
      }
    })
  }

  store.commit('updateReceiptQueryList', {
    teamId: teamId,
    msgs: msgs
  })
}

// 查询需要发送回执的消息
function getMsgNeedToReceipt(state, teamId, msgs) {
  var sentReceipedList = state.sentReceipedMap[teamId] || []
  var needToReceipt = msgs.filter(msg => {
    // 需要回执，且未发送过
    return msg.needMsgReceipt && msg.from !== state.myInfo.account &&  !sentReceipedList.find(id => id === msg.idServer)     
  }).map(msg => {
    return {
      teamId: teamId,
      idServer: msg.idServer
    }
  })
  return needToReceipt
}

export function getTeamMsgReads({ state }, needQuery) {
  nim.getTeamMsgReads({
    teamMsgReceipts: needQuery,
    done: (error, obj, content) => {
      if (error) {
        console.log('获取群组消息已读' + error)
      }else {
        console.log('获取群组消息已读：', content)
        store.commit('updateTeamMsgReads', content)
      }
    }
  })
}
