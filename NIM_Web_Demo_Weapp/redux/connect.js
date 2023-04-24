import wrapActionCreators from './wrapActionCreators.js'
import { assign, warning, shallowEqual } from './util.js'

const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({ dispatch })

function connect(mapStateToProps, mapDispatchToProps) {
  const shouldSubscribe = Boolean(mapStateToProps)
  const mapState = mapStateToProps || defaultMapStateToProps
  const app = getApp()

  let mapDispatch
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps)
  }
  return function wrapWithConnect(pageConfig) {
    const {
      onLoad: _onLoad,
      onUnload: _onUnload,
    } = pageConfig
    function handleChange(options) {
      if (!this.unsubscribe) {
        return
      }
      const state = this.store.getState()
      const mappedState = mapState(state, options);
      if (!this.data || shallowEqual(this.data, mappedState)) {
        return;
      }
      this.setData(mappedState)
    }
    function onLoad(options) {
      this.store = app.store;
      if (!this.store) {
        warning("Store对象不存在!")
      }
      if (shouldSubscribe) {
        this.unsubscribe = this.store.subscribe(handleChange.bind(this, options));
        handleChange.call(this, options)
      }
      typeof _onLoad === 'function' && _onLoad.call(this, options)
    }
    function onUnload() {
      typeof _onUnload === 'function' && _onUnload.call(this)
      typeof this.unsubscribe === 'function' && this.unsubscribe()
    }
    return assign({}, pageConfig, mapDispatch(app.store.dispatch), { onLoad, onUnload })
  }
}
module.exports = connect
