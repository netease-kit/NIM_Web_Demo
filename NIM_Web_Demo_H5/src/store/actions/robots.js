import store from '../'

export function onRobots (robots) {
  store.commit('updateRobots', robots)
}
