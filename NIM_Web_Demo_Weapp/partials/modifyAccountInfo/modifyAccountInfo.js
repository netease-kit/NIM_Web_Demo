import { connect } from '../../redux/index.js'
import { showToast, firstLetterUpper } from '../../utils/util.js'
import { iconRightArrow } from '../../utils/imageBase64.js'
import { validStringType } from '../../utils/util.js'

let app = getApp()
let store = app.store
let loginUser = app.globalData.loginUser

const navigationBarTitle = {
  'nick': '昵称',
  'gender': '性别',
  'birth': '我的',
  'tel': '手机',
  'email': '邮箱',
  'sign': '签名'
}
let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    isSaving: false, // 保存按钮上的菊花
    type: '', // 修改的用户数据类型
    gender: 'unknown', // 性别
    nick: '', // 昵称
    tel: '', // 电话
    email: '', // 邮箱
    sign: '' // 签名
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    wx.setNavigationBarTitle({
      title: navigationBarTitle[type],
    })
    this.setData({
      type,
      sign: this.data.userInfo.sign || ''
    })
    // 初始化默认性别
    if (type === 'gender') {
      this.setData({
        gender: this.data.userInfo.gender || ''
      })
    }
  },
  /**
   * 昵称变化
   */
  nickChange(e) {
    this.setData({
      nick: e.detail.data
    })
  },
  /**
   * 手机号变化
   */
  telChange(e) {
    this.setData({
      tel: e.detail.data
    })
  },
  /**
   * 邮箱变化
   */
  emailChange(e) {
    this.setData({
      email: e.detail.data
    })
  },
  /**
   * 签名变化
   */
  signChange(e) {
    this.setData({
      sign: e.detail.value
    })
  },
  /**
   * 性别变化
   */
  genderChange(e) {
    let self = this
    let gender = e.currentTarget.dataset.gender
    self.setData({ gender })
    // 全局存储
    if (self.data.type == 'gender' && self.data.gender != self.data.userInfo.gender) {
      // 更新服务器数据
      app.globalData.nim.updateMyInfo({
        gender: self.data.gender,
        done: (error, obj) => {
          if (error) {
            showToast('error', '修改失败')
            return
          }
          // 更新本地数据
          store.dispatch({
            type: 'UserInfo_Update_Gender',
            payload: self.data.gender
          })
          wx.navigateBack({})
        }
      })
    }
  },
  /**
   * 统一提交保存
   */
  submit() {
    let self = this
    let paraObj = {}
    // 组装更新服务器请求参数
    if (self.data.type == 'email') {
      if (!validStringType(self.data[self.data.type], 'email')) {
        showToast('error', '请输入有效邮箱格式')
        return
      }
    }
    // 设置loading状态
    self.setData({
      isSaving: true
    })
    paraObj[self.data.type] = self.data[self.data.type]
    paraObj['done'] = () => {
      self.setData({
        isSaving: false
      })
      // 更新本地数据
      store.dispatch({
        type: 'UserInfo_Update_' + firstLetterUpper(self.data.type),
        payload: self.data[self.data.type]
      })
      wx.navigateBack()
    }
    // 更新服务端数据
    app.globalData.nim.updateMyInfo(paraObj)
  },
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)
