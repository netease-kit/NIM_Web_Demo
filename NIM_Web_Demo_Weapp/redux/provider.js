import { assign, warning } from './util.js'

function checkStoreShape(store) {
  const missingMethods = ['subscribe', 'dispatch', 'getState'].filter(m => !store.hasOwnProperty(m));

  if (missingMethods.length > 0) {
    warning(`非标准Redux Store:缺少如下方法: ${missingMethods.join(', ')}`)
  }
}
function Provider(store) {
  checkStoreShape(store)
  return function (appConfig) {
    return assign({}, appConfig, { store })
  }
}

module.exports = Provider
