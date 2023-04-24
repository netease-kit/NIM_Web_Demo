import React, { Component } from 'react';
import { FlatList, Text, View, TouchableOpacity, InteractionManager } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import { inject, observer } from 'mobx-react/native';
import util from '../util';
import uuid from '../util/uuid';
import { headerStyle, globalStyle, chatStyle, contactStyle } from '../themes';
import { RVW } from '../common';
import GoBack from '../components/goback';
import { ChatLeft, ChatRight } from '../components/chatMsg';
import { ChatBox } from '../components/chatBox';

const constObj = {
  chatListRef: null,
};

@inject('nimStore', 'msgAction', 'sessionAction')
@observer
export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      refreshing: false,
    };
    this.toAccount = '';
    this.scene = '';
    const sessionId = this.props.navigation.getParam('sessionId') || '';
    this.sessionId = sessionId;
    this.toast = null;
    this.scrollTimer = null;
    this.props.sessionAction.setCurrentSession(this.sessionId);
    this.props.msgAction.getLocalMsgs(this.sessionId, { reset: true });
    this.notScroll = false;
  }
  componentDidMount() {
    clearTimeout(this.scrollTimer);
    // this.scrollTimer = setTimeout(() => {
    InteractionManager.runAfterInteractions(() => {
      this.scrollToEnd();
    });
    // }, 200);
  }
  componentWillUnmount() {
    clearTimeout(this.scrollTimer);
  }
  scrollToEnd = (animated = false) => {
    if (this.notScroll) {
      return;
    }
    util.debounce(200, () => {
      if (constObj.chatListRef) {
        // console.log('do');
        constObj.chatListRef.scrollToEnd({ animated });
      }
    });
  }
  loadMore = () => {
    let end = Infinity;
    if (this.props.nimStore.currentSessionMsgs.length > 1) {
      end = this.props.nimStore.currentSessionMsgs[1].time;
    }
    this.setState({
      refreshing: true,
    });
    this.props.msgAction.getLocalMsgs(this.sessionId, {
      end,
      done: () => {
        this.notScroll = true;
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
        // InteractionManager.runAfterInteractions(() => {
          this.notScroll = false;
        // });
        }, 1000);
        this.setState({
          refreshing: false,
        });
      },
    });
  }
  sessionName = () => {
    const { sessionId } = this;
    const { userInfos } = this.props.nimStore;
    if (/^p2p-/.test(sessionId)) {
      const user = sessionId.replace(/^p2p-/, '');
      this.toAccount = user;
      this.scene = 'p2p';
      if (user === this.props.userID) {
        return '我的电脑';
      }
      const userInfo = userInfos[user] || {};
      return util.getFriendAlias(userInfo);
    } else if (/^team-/.test(sessionId)) {
      const team = sessionId.replace(/^team-/, '');
      this.toAccount = team;
      this.scene = 'team';
      return '群会话';
    }
    return sessionId;
  }
  renderMore = () => {
    if (this.state.showMore) {
      return (
        <View style={contactStyle.menuBox}>
          <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('chatHistroy', { sessionId: this.sessionId });
              this.setState({ showMore: false });
            }}
          >
            <Text style={contactStyle.menuLine}>云端历史记录</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
              this.props.msgAction.deleteLocalMsgs({
                scene: this.scene,
                to: this.toAccount,
                done: (error) => {
                  if (error) {
                    this.toast.show(JSON.stringify(error));
                  }
                },
              });
              this.setState({ showMore: false });
            }}
          >
            <Text style={contactStyle.menuLine}>清空本地历史记录</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
  renderItem = ((item) => {
    const msg = item.item;
    if (msg.type === 'tip') {
      return <Text style={chatStyle.tip}>{msg.tip}</Text>;
    } else if (msg.flow === 'in') {
      return (<ChatLeft
        msg={msg}
        nimStore={this.props.nimStore}
        navigation={this.props.navigation}
      />);
    } else if (msg.flow === 'out') {
      return (<ChatRight
        msg={msg}
        msgAction={this.props.msgAction}
        nimStore={this.props.nimStore}
        resendTextMag={this.resendTextMag}
      />);
    } else if (msg.type === 'timeTag') {
      return <Text style={chatStyle.timetag}>----  {msg.text}  ----</Text>;
    }
    return null;
  })
  resendTextMag = (msg) => {
    if (!msg) {
      return
    }
    this.props.msgAction.resendTextMsg(msg);
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          centerComponent={{ text: this.sessionName(), style: headerStyle.center }}
          leftComponent={
            <GoBack navigation={navigation} callback={this.props.sessionAction.resetCurrSession} />}
          rightComponent={<Icon
            type="evilicon"
            name="clock"
            size={9 * RVW}
            color="#fff"
            onPress={() => { this.setState({ showMore: !this.state.showMore }); }}
          />}
        />
        <FlatList
          style={{ marginVertical: 20 }}
          data={this.props.nimStore.currentSessionMsgs}
          keyExtractor={item => (item.idClient || item.idClientFake || item.key || uuid())}
          renderItem={this.renderItem}
          ref={(ref) => { constObj.chatListRef = ref; }}
          onContentSizeChange={() => this.scrollToEnd()}
          onRefresh={this.loadMore}
          refreshing={this.state.refreshing}
        />
        <ChatBox
          action={this.props.msgAction}
          options={{
            scene: this.scene,
            toAccount: this.toAccount,
          }}
          toast={this.toast}
          chatListRef={constObj.chatListRef}
        />
        {this.renderMore()}
        <Toast ref={(ref) => { this.toast = ref; }} position="center" />
      </View>
    );
  }
}
