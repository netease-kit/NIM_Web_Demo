import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AsyncStorage, NetInfo } from 'react-native';
import { Header } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import { inject, observer } from 'mobx-react/native';
// import { SafeView } from 'react-navigation';
import SessionItem from '../components/sessionItem';
import NavBottom from '../components/navBottom';
import configs from '../configs';
import util from '../util';
import MD5 from '../util/md5';
import { globalStyle, headerStyle } from '../themes';
import constObj from '../store/constant';

@inject('linkAction', 'nimStore', 'userInfo', 'sessionAction')
@observer
export default class Page extends Component {
  constructor(props) {
    super(props);
    this.sessionItems = {};
  }
  componentWillMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.initLogin();
      } else {
        this.toast.show('网络状况不佳');
      }
    });
    // this.initLogin();
    // 很诡异，会出现AsyncStorage不执行的情况
    this.promiseTimer = setTimeout(() => {
      clearTimeout(this.promiseTimer);
      this.props.navigation.navigate('login');
    }, 1000);
  }
  componentWillUnmount() {
    clearTimeout(this.promiseTimer);
  }
  initLogin() {
    if (constObj.nim) {
      return;
    }
    AsyncStorage.getItem('isLogin').then((isLogin) => {
      if (isLogin !== 'true') {
        this.props.navigation.navigate('login');
        return Promise.resolve();
      }
      return Promise.all([
        AsyncStorage.getItem('account'),
        AsyncStorage.getItem('password'),
      ]).then((arr) => {
        clearTimeout(this.promiseTimer);
        const [account, password] = arr;
        if (!account || !password) {
          this.props.navigation.navigate('login');
        } else {
          const token = MD5(password);
          this.props.linkAction.login(account, token, (error) => {
            if (error) {
              // this.toast.show(util.parseDisconnectMsg(error));
              this.props.navigation.navigate('login');
            } else {
              this.forceUpdate();
            }
          });
        }
      });
    });
  }

  // 可以理解为一个compute方法-。-
  genSession() {
    const {
      sessionlist, userInfos, userID,
    } = this.props.nimStore;
    const list = [];

    for (let i = 0; i < sessionlist.length; i += 1) {
      const item = { ...sessionlist[i] };
      item.name = '';
      item.avatar = '';
      // 没有最新会话的不展示
      if (!item.lastMsg) {
        continue;
      }
      if (item.scene === 'p2p') {
        if (item.to === userID) {
          continue;
        }
        if (userInfos[item.to]) {
          item.name = util.getFriendAlias(userInfos[item.to]);
          item.avatar = util.genAvatar(userInfos[item.to].avatar || configs.defaultUserIcon);
        } else {
          this.props.userInfo.getUserInfo(item.to, () => {
            this.forceUpdate();
          });
        }
      } else {
        continue;
      }
      const lastMsg = item.lastMsg || {};
      if (lastMsg.type === 'text') {
        item.lastMsgShow = lastMsg.text || '';
      } else if (lastMsg.type === 'custom') {
        item.lastMsgShow = util.parseCustomMsg(lastMsg);
        // } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
        //   item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
      } else if (util.mapMsgType(lastMsg)) {
        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
      } else {
        item.lastMsgShow = '';
      }
      item.lastMsgShow = util.shortenWord(item.lastMsgShow, 20);
      if (item.lastMsg.time) {
        item.updateTimeShow = util.formatDate(item.lastMsg.time, true);
      }
      list.push(item);
    }
    return list;
  }
  resetDeleteBar = () => {
    // Object.keys(this.sessionItems).forEach((sessionId) => {
    //   console.log(sessionId);
    // });
  }
  render() {
    const sessionlist = this.genSession();
    const { navigation } = this.props;
    return (
      // 适配iphoneX用safeView
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          centerComponent={{ text: '云信RN', style: headerStyle.center }}
        />
        <TouchableOpacity
          style={globalStyle.container}
          onPress={this.resetDeleteBar}
          activeOpacity={1}
        >
          <ScrollView style={{ backgroundColor: '#f0f0f0' }}>
            {
              sessionlist.length === 0 ?
                <Text style={{ padding: 20, textAlign: 'center' }}>当前没有会话！！！！</Text>
                : sessionlist.map(item =>
                (<SessionItem
                  key={item.id}
                  ref={(child) => { this.sessionItems[item.id] = child; }}
                  session={item}
                  navigation={navigation}
                  onPress={this.resetDeleteBar}
                />))
            }
          </ScrollView>
        </TouchableOpacity>
        <NavBottom navigation={navigation} />
        <Toast ref={(ref) => { this.toast = ref; }} position="center" />
      </View>
    );
  }
}
