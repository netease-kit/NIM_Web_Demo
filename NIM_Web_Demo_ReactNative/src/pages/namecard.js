import React, { Component } from 'react';
import { ScrollView, Text, Alert, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { View } from 'react-navigation';
import { ListItem, Avatar, Header, Button } from 'react-native-elements';
import GoBack from '../components/goback';
import { headerStyle, globalStyle, baseBlueColor, baseRedColor } from '../themes';
import { RVW, RFT } from '../common';
import util from '../util';
import configs from '../configs';

const CardTitle = props => (
  <View>
    <Text style={{ fontSize: 5 * RFT }}>{props.userInfo.showAlias}</Text>
    <Text style={{ fontSize: 3.6 * RFT }}>账号：{props.userInfo.account}</Text>
    <Text style={{ fontSize: 3.6 * RFT }}>昵称：{props.userInfo.nick}</Text>
  </View>
);

const localStyle = {
  button: {
    width: 90 * RVW,
    marginLeft: 5 * RVW,
    backgroundColor: baseBlueColor,
    borderRadius: 3,
  },
};

@inject('nimStore', 'userInfo', 'friendAction')
@observer
export default class Page extends Component {
  constructor(props) {
    super(props);
    const account = this.props.navigation.getParam('account');
    this.state = {
      // muteVal: false,
      account,
      alias: '',
      showAlias: '',
      avatar: configs.defaultUserIcon,
      nick: '',
      phone: '',
      email: '',
    };
  }
  componentWillMount = () => {
    const { account } = this.state;
    this.props.userInfo.getUserInfo(account, (userInfo) => {
      this.setState({
        avatar: userInfo.avatar || configs.defaultUserIcon,
        alias: userInfo.alias || '',
        showAlias: util.getFriendAlias(userInfo),
        nick: userInfo.nick,
        phone: userInfo.tel,
        email: userInfo.email,
      });
    });
  }
  // setMuteVal = (val) => {
  //   this.setState({
  //     muteVal: val,
  //   });
  // }
  delFriend = () => {
    Alert.alert('提示', '删除好友后，将解除与对方的好友关系', [
      { text: '取消' },
      { text: '确认删除', onPress: () => { this.props.friendAction.delFriend(this.state.account); } },
    ]);
  }
  renderBtnWhenFriend = () => (
    <View style={{ marginTop: 20 }}>
      <Button
        title="聊天"
        titleStyle={{ color: '#fff' }}
        onPress={() => { this.props.navigation.navigate('chat', { sessionId: `p2p-${this.state.account}` }); }}
        buttonStyle={localStyle.button}
      />
      <Button
        title="删除好友"
        titleStyle={{ color: '#fff' }}
        onPress={this.delFriend}
        buttonStyle={[localStyle.button, {
          marginTop: 20,
          backgroundColor: baseRedColor,
        }]}
      />
    </View>
  )
  renderBtnWhenNotFriend = () => (
    <View style={{ marginTop: 20 }}>
      <Button
        title="加为好友"
        titleStyle={{ color: '#fff' }}
        onPress={() => { this.props.friendAction.addFriend(this.state.account); }}
        buttonStyle={localStyle.button}
      />
      <Button
        title="聊天"
        titleStyle={{ color: '#333' }}
        onPress={() => { this.props.navigation.navigate('chat', { sessionId: `p2p-${this.state.account}` }); }}
        buttonStyle={[localStyle.button, {
          marginTop: 20,
          backgroundColor: '#fff',
        }]}
      />
    </View>
  )
  render() {
    const {
      account, avatar, showAlias, alias, nick, phone, email,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          leftComponent={<GoBack navigation={navigation} />}
          centerComponent={{ text: '个人名片', style: headerStyle.center }}
        />
        <ScrollView>
          <ListItem
            key={0}
            leftAvatar={<Avatar
              source={{ uri: avatar }}
              size="large"
              rounded
            />}
            title={<CardTitle userInfo={{
              account,
              showAlias,
              nick,
            }}
            />}
            containerStyle={{ height: 30 * RVW, backgroundColor: '#f0f0ff' }}
          />
          <ListItem
            key={1}
            leftElement={
              <Text style={{ fontSize: 4 * RFT }}>备注名：</Text>
            }
            title={alias}
            topDivider
            bottomDivider
          />
          <ListItem
            key={2}
            leftElement={
              <Text style={{ fontSize: 4 * RFT }}>手机号：</Text>
            }
            title={phone}
            bottomDivider
          />
          <ListItem
            key={3}
            leftElement={
              <Text style={{ fontSize: 4 * RFT }}>邮箱名：</Text>
            }
            title={email}
            bottomDivider
          />
          {/* <ListItem
            key={4}
            leftElement={
              <Text style={{ fontSize: 4 * RFT }}>消息提醒：</Text>
            }
            rightElement={
              <Switch
                style={{ marginLeft: 60 * RVW }}
                value={this.state.muteVal}
                onValueChange={this.setMuteVal}
              />
            }
            topDivider
            bottomDivider
          /> */}
          {
            this.props.nimStore.friendFlags.has(this.state.account) ?
              this.renderBtnWhenFriend() :
              this.renderBtnWhenNotFriend()
          }
        </ScrollView>
      </View>
    );
  }
}
