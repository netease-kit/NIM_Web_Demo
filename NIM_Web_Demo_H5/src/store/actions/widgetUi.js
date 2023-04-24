import pageUtil from '../../utils/page'

// 显示加载中进度条
export function showLoading ({state, commit}) {
  commit('updateLoading', true)
}

// 隐藏加载中进度条
export function hideLoading ({state, commit}) {
  commit('updateLoading', false)
}

// 显示原图片
export function showFullscreenImg ({state, commit}, obj) {
  if (obj) {
    obj.type = 'show'
    commit('updateFullscreenImage', obj)
  }
}

// 隐藏原图片
export function hideFullscreenImg ({state, commit}) {
  commit('updateFullscreenImage', {
    type: 'hide'
  })
}
