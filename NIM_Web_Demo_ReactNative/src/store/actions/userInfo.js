import { observable, action } from 'mobx';
import nimStore from '../stores/nim';
import constObj from '../constant';

class Actions {
  @observable nimStore

  @action
  getUserInfo = (account, callback) => {
    if (constObj.nim) {
      constObj.nim.getUser({
        account,
        sync: true,
        done: (error, user) => {
          if (!error) {
            const userInfo = nimStore.userInfos[account];
            if (userInfo) {
              nimStore.userInfos[account] = Object.assign(userInfo, user);
            } else {
              nimStore.userInfos[account] = user;
            }
            if (callback instanceof Function) {
              callback(nimStore.userInfos[account]);
            }
          }
        },
      });
    }
  }
}

export default new Actions();
