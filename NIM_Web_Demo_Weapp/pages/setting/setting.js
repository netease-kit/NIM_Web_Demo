import { connect } from '../../redux/index.js'
import { showToast, correctData } from '../../utils/util.js'
import { iconRightArrow } from '../../utils/imageBase64.js'
let app = getApp()
let store = app.store
let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    loginUser: {}, // 显示在页面上
    iconRightArrow: iconRightArrow
  },
  /**
   * 登录后获取设置界面数据
   */
  onLoad(options) {
  },
  /**
   * 生日选择
   */
  dateChange(e) {
    let birth = e.detail.value
    // 更新服务器数据
    app.globalData.nim.updateMyInfo({ birth })
    // 更新本地数据
    store.dispatch({
      type: 'UserInfo_Update_Birthday',
      payload: birth
    })
    // 用户提示
    showToast('success', '修改成功')
  },
  /**
   * 修改用户头像
   */
  chooseLogo() {
    let self = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 上传文件到nos
        app.globalData.nim.previewFile({
          type: 'image',
          wxFilePath: res.tempFilePaths[0],
          done: function (err, file) {
            if (err) {
              // 用户提示
              showToast('error', '上传失败')
              return
            }
            // 更新服务器数据
            app.globalData.nim.updateMyInfo({
              avatar: file.url
            })
            // 更新本地数据
            store.dispatch({
              type: 'UserInfo_Update_Avatar',
              payload: res.tempFilePaths[0]
            })
            // 用户提示
            showToast('success', '修改成功')
          }
        })
      },
    })
  },
  /**
   * 个人信息详情修改
   */
  detailTapHandler: function (e) {
    let type = e.target.dataset.type
    switch (type) {
      case 'nick':
        wx.navigateTo({
          url: '../../partials/modifyAccountInfo/modifyAccountInfo?type=nick',
        })
        break;
      case 'gender':
        wx.navigateTo({
          url: '../../partials/modifyAccountInfo/modifyAccountInfo?type=gender',
        })
        break;
      case 'birth':
        break;
      case 'tel':
        wx.navigateTo({
          url: '../../partials/modifyAccountInfo/modifyAccountInfo?type=tel',
        })
        break;
      case 'email':
        wx.navigateTo({
          url: '../../partials/modifyAccountInfo/modifyAccountInfo?type=email',
        })
        break;
      case 'sign':
        wx.navigateTo({
          url: '../../partials/modifyAccountInfo/modifyAccountInfo?type=sign',
        })
        break;
      default:
        break;
    }
  },
  /**
   * 登出
   */
  logout: function () {
    wx.showLoading({
      title: '注销中...',
    })
    app.globalData.nim.destroy({
      done: function () {
        console.log('destroy nim done !!!')
        wx.clearStorage()
        wx.hideLoading()
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })
  }
}
let mapStateToData = (state) => {
  return {
    loginUser: correctData(state.userInfo)
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)
