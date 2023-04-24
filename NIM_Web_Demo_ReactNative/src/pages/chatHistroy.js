import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import { inject } from 'mobx-react/native';
import { Animated, FlatList, View, Text, InteractionManager } from 'react-native';
import { headerStyle, globalStyle, chatStyle } from '../themes';
import { ChatLeft, ChatRight } from '../components/chatMsg';
import GoBack from '../components/goback';
import util from '../util';
import uuid from '../util/uuid';
// import { RVH } from '../common';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

@inject('nimStore', 'msgAction')
export default class Page extends Component {
  constructor(props) {
    super(props);
    const sessionId = this.props.navigation.getParam('sessionId') || '';
    this.sessionId = sessionId;
    if (/^[^-]+-/.test(this.sessionId)) {
      this.scene = /^[^-]+-/.exec(this.sessionId);
      this.scene = this.scene[0];
      this.to = this.sessionId.replace(this.scene, '');
      this.scene = this.scene.replace('-', '');
    }
    this.state = {
      historyMsgs: [],
      refreshing: false,
    };
  }
  componentWillMount() {
    const { scene, to } = this;
    this.props.msgAction.getHistoryMsgs({
      scene,
      to,
      done: (msgs) => {
        this.setState({
          historyMsgs: this.sortMsgs(msgs),
        });
        InteractionManager.runAfterInteractions(() => {
          this.scrollToEnd();
        });
      },
    });
  }
  scrollToEnd = () => {
    // if (this.chatListRef) {
    //   this.chatListRef.scrollTo({ x: 0, y: 100 * RVH });
    // }
  }
  loadMore = () => {
    let endTime = this.state.historyMsgs[0].time;
    if (!endTime) {
      endTime = this.state.historyMsgs[1].time;
    }
    this.setState({
      refreshing: true,
    });
    const { scene, to } = this;
    this.props.msgAction.getHistoryMsgs({
      scene,
      to,
      endTime,
      done: (msgs) => {
        this.setState({
          refreshing: false,
        });
        if (!msgs || msgs.length <= 0) {
          return;
        }
        const currHistoryMsgs = this.sortMsgs(msgs);
        this.state.historyMsgs.forEach((item) => {
          currHistoryMsgs.push(item);
        });
        this.setState({
          historyMsgs: currHistoryMsgs,
        });
        InteractionManager.runAfterInteractions(() => {
          this.scrollToEnd();
        });
      },
    });
  }
  sortMsgs = (origMsgs) => {
    const msgLen = origMsgs.length;
    const msgs = [];
    if (msgLen > 0) {
      origMsgs = origMsgs.sort((a, b) => a.time - b.time);
      let lastMsgTime = 0;
      origMsgs.forEach((msg) => {
        if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
          msgs.push({
            type: 'timeTag',
            text: util.formatDate(msg.time, false),
            key: uuid(),
          });
          lastMsgTime = msg.time;
        }
        msgs.push(msg);
      });
    }
    return msgs;
  }
  renderItem = ((item) => {
    const msg = item.item;
    if (msg.flow === 'in') {
      return (<ChatLeft
        key={msg.idClient}
        msg={msg}
        nimStore={this.props.nimStore}
        navigation={this.props.navigation}
      />);
    } else if (msg.flow === 'out') {
      return <ChatRight key={msg.idClient} msg={msg} nimStore={this.props.nimStore} />;
    } else if (msg.type === 'timeTag') {
      return <Text key={msg.text} style={chatStyle.timetag}>----  {msg.text}  ----</Text>;
    }
    return null;
  })
  render() {
    const { navigation } = this.props;
    const { historyMsgs } = this.state;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          centerComponent={{ text: '云消息记录', style: headerStyle.center }}
          leftComponent={<GoBack navigation={navigation} />}
        />
        {
          (historyMsgs && historyMsgs.length > 0) ?
            <AnimatedFlatList
              style={{ marginVertical: 20 }}
              data={this.state.historyMsgs}
              keyExtractor={item => (item.idClient || item.key || item.text)}
              renderItem={this.renderItem}
              ref={(ref) => { this.chatListRef = ref; }}
              onRefresh={this.loadMore}
              refreshing={this.state.refreshing}
            /> :
            <Text style={{ padding: 20, textAlign: 'center' }}>无历史消息</Text>
        }
      </View>
    );
  }
}
