import nimStore from './stores/nim';
import chatroomStore from './stores/chatroom';
import globalStatus from './stores/status';
import linkAction from './actions/link';
import msgAction from './actions/msg';
import userInfo from './actions/userInfo';
import friendAction from './actions/friend';
import sessionAction from './actions/session';

export default {
  globalStatus,
  nimStore,
  linkAction,
  userInfo,
  friendAction,
  msgAction,
  sessionAction,
  chatroomStore,
};
