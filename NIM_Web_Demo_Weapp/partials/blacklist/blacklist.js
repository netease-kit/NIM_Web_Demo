import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
  },
  /**
   * 切换到个人页面
   */
  switchToPersonCard(e) {
    let account = e.currentTarget.dataset.user.account
    let user = store.getState().friendCard[account]
    let self = this
    if(user.isFriend == true) { // 名片信息较多，说明是好友下拉黑
      wx.navigateTo({
        url: '../personcard/personcard?account=' + account
      })
    } else { // 名片信息较少，非好友状态下拉黑
      app.globalData.nim.getUser({
        account: account,
        done: function (err, userCard) {
          if (err) {
            console.log(err)
            return
          }
          store.dispatch({
            type: 'FriendCard_Update_InfoCard',
            payload: userCard
          })
          wx.navigateTo({
            url: '../strangercard/strangercard?account=' + account,
          })
        }
      })
    }
  },
  /**
   * 生成黑名单列表指定数据
   * {account: {account,isBlack}}
   */
  generateBlackListToRender(blackList) {
    let resultArr = []
    for (let account in blackList) {
      if (blackList[account].isBlack == true) { // 黑名单
        resultArr.push({
          account,
          nick: blackList[account].nick || account,
          createTime: blackList[account].createTime,
          updateTime: blackList[account].updateTime,
          avatar: blackList[account].avatar || app.globalData.PAGE_CONFIG.defaultUserLogo
        })
      }
    }
    return resultArr
  }
}
let mapStateToData = (state) => {
  return {
    blackListArr: pageConfig.generateBlackListToRender(state.friendCard)
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)