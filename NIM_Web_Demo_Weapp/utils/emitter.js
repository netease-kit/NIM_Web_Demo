
export default class EventEmitter {
  constructor() {
    this.eventReset()
  }
  eventReset() {
    if (this._eventListeners) {
      Object.keys(this._eventListeners).forEach(key => {
        delete this._eventListeners[key]
      })
    }
    this._eventListeners = {}
    if (this._eventOnceListener) {
      Object.keys(this._eventOnceListener).forEach(key => {
        delete this._eventOnceListener[key]
      })
    }
    this._eventOnceListener = {}
  }
  on(funKey, callback) {
    if (!funKey) {
      throw Error({
        message: 'event listener funkey undefined',
        callFunc: 'adapter:_on'
      })
    }
    if (!(callback instanceof Function)) {
      throw Error({
        message: 'event listener next param should be function',
        callFunc: 'adapter:_on'
      })
    }
    this._eventListeners[funKey] = callback
  }
  off(funKey) {
    if (!funKey) {
      throw Error({
        message: 'event listener funkey undefined',
        callFunc: 'adapter:_off'
      })
    }
    if (this._eventListeners[funKey]) {
      delete this._eventListeners[funKey]
    } else {
      throw Error({
        message: 'event listener unbind failed!',
        callFunc: 'adapter:_off'
      })
    }
  }
  once(funKey, callback) {
    if (!funKey) {
      throw Error({
        message: 'event once listener funkey undefined',
        callFunc: 'adapter:_once'
      })
    }
    if (!(callback instanceof Function)) {
      throw Error({
        message: 'event once listener next param should be function',
        callFunc: 'adapter:_once'
      })
    }
    this._eventOnceListener[funKey] = callback
  }
  emit(funKey, params) {
    if (this._eventOnceListener && (this._eventOnceListener[funKey] instanceof Function)) {
      this._eventOnceListener[funKey](params)
      delete this._eventOnceListener[funKey]
    }
    if (this._eventListeners && (this._eventListeners[funKey] instanceof Function)) {
      this._eventListeners[funKey](params)
    }
  }
}
