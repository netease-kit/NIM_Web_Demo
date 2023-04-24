import { connect } from '../../redux/index.js'
import { showToast, formatDate } from '../../utils/util.js'
import { iconRightArrow } from '../../utils/imageBase64.js'
import { validStringType } from '../../utils/util.js'

let app = getApp()
let store = app.store

let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    limit: false, // 是否有权限修改
    teamId: '', // 群id
    title: '',
    content: '',
    newTitle: '',
    newContent: '',
    account: '',
    datetime: '',
    isEditing: false,
    isSaving: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let limit = options.limit === 'true'
    let teamId = options.teamId
    let card = this.data.groupList[teamId]
    var info = {}
    try {
      info = JSON.parse(card.announcement)
    } catch (e) {
      console.error('群公告不是json格式无法解析')
      info.content = card.announcement || ''
    }
    this.setData({
      limit,
      teamId,
      ...info
    })
  },
  /**
   * 标题变化
   */
  titleChange(e) {
    this.setData({
      newTitle: e.detail.value
    })
  },
  /**
   * 内容变化
   */
  contentChange(e) {
    this.setData({
      newContent: e.detail.value
    })
  },
  /**
   * 创建群公告
   */
  edit() {
    this.setData({
      isEditing: true
    })
  },
  /**
   * 统一提交保存
   */
  submit() {
    let self = this
    let title = self.data.newTitle.trim()
    let content = self.data.newContent.trim()
    let data = { teamId: this.data.teamId }
    if (!title || !content) {
      showToast('text', '群公告标题和内容不能为空')
      return
    }
    // 设置loading状态
    self.setData({
      isSaving: true
    })
    data.announcement = JSON.stringify({
      title,
      content,
      account: this.data.userInfo.account,
      datetime: formatDate(new Date())
    })
    data['done'] = (error, team) => {
      if (error) {
        self.setData({
          isSaving: false
        })
        showToast('error', '更新群公告失败')
        return
      }
      self.setData({
        isSaving: false,
        isEditing: false
      })
      wx.navigateBack()
    }
    app.globalData.nim.updateTeam(data)
  },
}
let mapStateToData = (state) => {
  return {
    groupList: state.groupList,
    userInfo: state.userInfo
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)
