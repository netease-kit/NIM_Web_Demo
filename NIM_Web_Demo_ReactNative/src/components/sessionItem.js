import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { inject } from 'mobx-react/native';
import { ListItem } from 'react-native-elements';
import LeftAvatar from '../components/leftAvatar';
import { RFT, RVW } from '../common';
import configs from '../configs';

@inject('nimStore', 'sessionAction', 'msgAction')
export default class SessionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionLeft: new Animated.Value(0),
      isDeleteBarShown: false,
    };
  }
  deleteSession = () => {
    Alert.alert('提示', '确认删除会话？', [
      { text: '取消', onPress: () => { this.setState({ isDeleteBarShown: false }); } },
      { text: '确认删除', onPress: () => { this.props.sessionAction.deleteLocalSession(this.props.session.id); } },
    ]);
    Animated.timing(
      this.state.positionLeft,
      {
        toValue: 0,
        duration: 0,
      },
    ).start();
  }
  showDeleteBar = () => {
    if (this.state.isDeleteBarShown) {
      return;
    }
    Animated.timing(
      this.state.positionLeft,
      {
        toValue: -20 * RVW,
        duration: 100,
      },
    ).start();
    this.setState({
      isDeleteBarShown: true,
    });
  }
  hideDeleteBar = () => {
    if (!this.state.isDeleteBarShown) {
      return;
    }
    Animated.timing(
      this.state.positionLeft,
      {
        toValue: 0,
        duration: 100,
      },
    ).start();
    this.setState({
      isDeleteBarShown: false,
    });
  }
  gotoChat = (session) => {
    const sessionId = session.id;
    if (this.state.isDeleteBarShown) {
      this.hideDeleteBar();
      return;
    }
    if (session.lastMsg && session.lastMsg) {
      this.props.msgAction.sendMsgReceipt({ msg: session.lastMsg });
    }
    this.props.navigation.navigate('chat', { sessionId });
  }
  render() {
    const columnHeight = 16 * RVW;
    const item = this.props.session;
    if (!item.avatar) {
      item.avatar = configs.defaultUserIcon;
    }
    return (
      <Animated.View style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          left: this.state.positionLeft,
        }}
      >
        <ListItem
          key={this.props.key}
          leftAvatar={<LeftAvatar
            uri={item.avatar}
            onPress={() => {
              const sessionId = item.id;
              if (/^p2p-/.test(sessionId)) {
                this.props.navigation.navigate('namecard', { account: sessionId.replace(/^p2p-/, '') });
              }
            }}
          />}
          title={item.name}
          subtitle={item.lastMsg && item.lastMsgShow}
          subtitleStyle={{ flexWrap: 'nowrap', width: 50 * RVW }}
          rightTitle={item.updateTimeShow}
          containerStyle={{ backgroundColor: '#fff', width: 100 * RVW, height: columnHeight }}
          badge={{
              value: item.unread,
              textStyle: { color: '#fff' },
              containerStyle: { backgroundColor: '#f00', display: item.unread === 0 ? 'none' : 'flex' },
            }}
          onPress={() => { this.gotoChat(item); }}
          onLongPress={this.showDeleteBar}
          bottomDivider
        />
        <TouchableOpacity onPress={this.deleteSession}>
          <View style={{
              width: 20 * RVW,
              height: columnHeight,
              backgroundColor: '#f00',
            }}
          >
            <Text style={{
                textAlign: 'center',
                lineHeight: columnHeight,
                fontSize: 4 * RFT,
                color: '#fff',
              }}
            >
              删除
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
