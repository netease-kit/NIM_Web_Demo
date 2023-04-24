import { observable, action } from 'mobx';

class Stores {
  @observable isLogin = true
  @observable isLoading = false
  // 全屏显示的原图
  @observable isFullscreenImgShow = false
  @observable fullscreenImgSrc = ''

  @action
  reset() {
    this.isLogin = false;
  }
}

export default new Stores();
