import { connect } from '../../redux/index.js'
const app = getApp()
let store = app.globalData.store

const pageConfig = {
  data: {
    num: 10
  },
  onLoad() {
    console.log('onload')
  }
 }
const mapStateToData = (state) => {
  return {
    num: state.num
  }
}
const mapDispatchToPage = (dispatch) => ({
  plusOne: () => {
    return dispatch({
      type: 'INCREMENT'
    })
  },
  minusOne: () => {
    return dispatch({
      type: 'DECREMENT'
    })
  }
})
const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(nextPageConfig)