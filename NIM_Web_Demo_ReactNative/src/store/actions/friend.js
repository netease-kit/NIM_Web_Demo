import { observable, action } from 'mobx';
import { Alert } from 'react-native';
import nimStore from '../stores/nim';
import constObj from '../constant';

class Actions {
  @observable nimStore

  @action
  addFriend = (account) => {
    if (constObj.nim) {
      constObj.nim.addFriend({
        account,
        ps: '',
        done: (error, friend) => {
          if (!error) {
            nimStore.friendslist = constObj.nim.mergeFriends(nimStore.friendslist, friend);
            nimStore.friendFlags.set(account, true);
          } else {
            Alert.alert('提示', '添加好友失败', [
              { text: '确认' },
            ]);
          }
        },
      });
    }
  }

  @action
  delFriend = (account) => {
    if (constObj.nim) {
      constObj.nim.deleteFriend({
        account,
        done: (error) => {
          if (!error) {
            // set(nimStore.friendFlags, account, false);
            nimStore.friendFlags.delete(account);
          } else {
            Alert.alert('提示', '删除好友失败', [
              { text: '确认' },
            ]);
          }
        },
      });
    }
  }

  @action
  passFriendApply = (sysMsg) => {
    if (constObj.nim) {
      const account = sysMsg.from;
      constObj.nim.passFriendApply({
        idServer: sysMsg.idServer,
        account,
        ps: '',
        done: (error, friend) => {
          if (!error) {
            nimStore.friendslist = constObj.nim.mergeFriends(nimStore.friendslist, friend);
            nimStore.friendFlags.set(account, true);
          } else {
            Alert.alert('提示', '好友验证失败', [
              { text: '确认' },
            ]);
          }
        },
      });
    }
  }

  @action
  rejectFriendApply = (sysMsg) => {
    if (constObj.nim) {
      const account = sysMsg.from;
      constObj.nim.rejectFriendApply({
        idServer: sysMsg.idServer,
        account,
        ps: '',
      });
    }
  }
}

export default new Actions();
