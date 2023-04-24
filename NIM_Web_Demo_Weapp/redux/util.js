const assign = function (target) {
  'use strict';
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var length=arguments.length, index = 1; index<length; index++) {
    var source = arguments[index];
    // 检测assign的每一个参数的有效性
    if (source !== undefined && source !== null) {
      // 拷贝每个Object，注意不是深拷贝
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
};
const ActionTypes = {
  INIT:
  '@@redux/INIT' +
  Math.random().toString(36).substring(7).split('').join('.'),
  REPLACE:
  '@@redux/REPLACE' +
  Math.random().toString(36).substring(7).split('').join('.')
}
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  try {
    throw new Error(message)
    /* eslint-disable no-empty */
  } catch (e) { }
  /* eslint-enable no-empty */
}
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }
  function removeBugKeyArr(originArr) {
    // 实际机器，不会有 __webviewId__ 这个参数，调试机器会有，会造成某种特殊情况下面的报错。
    // 例如，reducer 中直接更改 redux 的某个对象值里面某个属性，page 那边会直接是对象引用，没 shallowEqual 的 hasOwn 检测还是一样，永远返回 true 。
    const removeBugKeyArrList = ['__webviewId__'];
    const arr = [];
    originArr.map(elem => {
      if (!removeBugKeyArrList.includes(elem) && !arr.includes(elem)) {
        arr.push(elem);
      }
    });
    return arr;
  }
  const keysA = removeBugKeyArr(Object.keys(objA));
  const keysB = removeBugKeyArr(Object.keys(objB));
  if (keysA.length !== keysB.length) {
    return false
  }
  const hasOwn = Object.prototype.hasOwnProperty
  for (let l=keysA.length, i=0; i<l; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
      objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }
  return true
}
module.exports = {
  isPlainObject,
  ActionTypes,
  warning,
  shallowEqual,
  assign: assign
}
