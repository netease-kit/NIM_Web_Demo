import {formatUserInfo} from './userInfo'

export function resetSearchResult ({state, commit}) {
  commit('updateSearchlist', {
    type: 'user',
    list: []
  })
  commit('updateSearchlist', {
    type: 'team',
    list: []
  })
}

export function searchUsers ({state, commit}, obj) {
  let {accounts, done} = obj
  const nim = state.nim
  if (!Array.isArray(accounts)) {
    accounts = [accounts]
  }
  nim.getUsers({
    accounts,
    done: function searchUsersDone (error, users) {
      if (error) {
        alert(error)
        return
      }
      commit('updateSearchlist', {
        type: 'user',
        list: users
      })
      let updateUsers = users.filter(item => {
        let account = item.account
        if (item.account === state.userUID) {
          return false
        }
        let userInfo = state.userInfos[account] || {}
        if (userInfo.isFriend) {
          return false
        }
        return true
      })
      updateUsers = updateUsers.map(item => {
        return formatUserInfo(item)
      })
      commit('updateUserInfo', updateUsers)
      if (done instanceof Function) {
        done(users)
      }
    }
  })
}

export function searchTeam ({ state, commit }, obj) {
  let { teamId, done } = obj
  const nim = state.nim
  nim.getTeam({
    teamId: teamId,
    done: function searchTeamDone (error, teams) {
      if (error) {
        if (error.code === 803) {
          // 群不存在或未发生变化
          teams = []
        } else {
          alert(error)
          return
        }
      }
      if (!Array.isArray(teams)) {
        teams = [teams]
      }
      teams.forEach(team => {
        if (team.avatar && team.avatar.indexOf('nim.nosdn.127') > 0 && team.avatar.indexOf('?imageView') === -1) {
          team.avatar = team.avatar + '?imageView&thumbnail=300y300'
        }
      })
      commit('updateSearchlist', {
        type: 'team',
        list: teams
      })
      if (done instanceof Function) {
        done(teams)
      }
    }
  })
}
