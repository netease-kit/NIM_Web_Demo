import { observable, action } from 'mobx';
import { Alert } from 'react-native';
import nimStore from '../stores/nim';
import constObj from '../constant';

class Actions {
  @observable nimStore

  @action
  setCurrentSession = (id) => {
    constObj.nim.setCurrSession(id);
    nimStore.currentSessionId = id;
  }

  @action
  resetCurrSession = () => {
    constObj.nim.resetCurrSession();
    nimStore.currentSessionId = null;
  }

  @action
  deleteLocalSession = (sessionId) => {
    constObj.nim.deleteLocalSession({
      id: sessionId,
      done: (error) => {
        if (error) {
          Alert.alert('提示', '删除好友失败', [
            { text: '确认' },
          ]);
          return;
        }
        nimStore.sessionlist = constObj.nim.cutSessionsByIds(nimStore.sessionlist, [sessionId]);
      },
    });
  }
}

export default new Actions();
