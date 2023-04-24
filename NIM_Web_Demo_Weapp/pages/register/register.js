import { post, validStringType, showToast } from '../../utils/util.js'
import { iconLogo } from '../../utils/imageBase64.js'
import IMController from '../../controller/im.js'
import MD5 from '../../vendors/md5.js'
import { connect } from '../../redux/index.js'

let app = getApp()
let store = app.store

let pageConfig = {
  data: {
    iconLogo: '',
    account: '',//账号
    nickname: '',// 昵称
    password: '',//密码
    // isRegister: false,//登录菊花,
    errorMessage: ''//提示错误信息
  },
  onLoad() {
    this.setData({
      iconLogo
    })
  },
  /**
   * 存储表单填入数据
   */
  inputHandler: function (e) {
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },

  /**
   * 执行注册逻辑
   */
  doRegister: function () {
    let errorMessage = ''
    let username = this.data.account
    let nickname = this.data.nickname
    let password = this.data.password
    let self = this 
    // 校验输入
    if (!validStringType(username, 'string-number')) {
      errorMessage = '账号限字母或数字'
    }
    if (!validStringType(nickname, 'string-number-hanzi')) {
      errorMessage = '昵称限汉字、字母或数字'
    }
    if ((password.length < 6) || !validStringType(password, 'string-number')) {
      errorMessage = '密码限6~20位字母或数字'
    }
    if (errorMessage.length > 0) {//显示错误信息
      showToast('error', errorMessage)
      return
    }
    // 更新本地视图
    store.dispatch({
      type: 'Register_StartRegister'
    })
    // 发送请求
    post({
      url: app.globalData.ENVIRONMENT_CONFIG.url + '/api/createDemoUser',
      data: {
        username,
        password: MD5(password),
        nickname
      },
      header: {
        'appkey': app.globalData.ENVIRONMENT_CONFIG.appkey,
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(data => {
      // 更新本地视图
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      if (data.data.data.res == 414) {
        showToast('error', '该账号已注册')
        return
      }
      if (data.data.data.res == 200) {
        // 注册成功
        new IMController({
          token: password,
          account: username
        })
      } else {
        // 给出本地出错提示
        self.setData({
          errorMessage: data.data.data.errmsg
        })
      }
    }, err => {
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      showToast('error', '注册失败，请重试！')
      console.log(err)
    })
  },
  /**
   * 单击登录,跳转到注册页
   */
  registerLoginTap: function () {
    wx.navigateBack({
      url: '../login/login',
    })
  }
}

let mapStateToData = (state) => {
  return {
    isRegister: state.isRegister || store.getState().isRegister || state.isLogin || store.getState().isLogin
  }
}
const mapDispatchToPage = (dispatch) => ({
  registerSubmit: function () {
    this.doRegister()
    return
  }
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)
