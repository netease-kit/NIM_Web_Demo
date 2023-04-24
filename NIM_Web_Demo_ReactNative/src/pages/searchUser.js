import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { View } from 'react-navigation';
import { ListItem, Input, Header, Button } from 'react-native-elements';
import GoBack from '../components/goback';
import { headerStyle, globalStyle, baseBlueColor } from '../themes';
import { RVW, RFT } from '../common';
import configs from '../configs';

@inject('nimStore', 'userInfo')
@observer
export default class Page extends Component {
  constructor(props) {
    super(props);
    const scene = this.props.navigation.getParam('scene');
    if (scene === 'p2p') {
      this.title = '添加好友';
    }
    this.state = {
      account: '',
      users: null,
    };
  }
  setAccount = (text) => {
    this.setState({ account: text });
  }
  searchUser = () => {
    const { account } = this.state;
    if (account) {
      this.props.userInfo.getUserInfo(account, (user) => {
        if (user === null) {
          this.setState({
            users: [],
          });
        } else {
          this.setState({
            users: [user],
          });
        }
      });
    }
  }
  renderUsers = () => {
    if (this.state.users === null) {
      return <View />;
    } else if (this.state.users.length === 0) {
      return <View style={{ padding: 20 }}><Text style={{ textAlign: 'center', fontSize: 3 * RFT }}>无记录</Text></View>;
    } else if (this.state.users[0].account === this.props.nimStore.userID) {
      return <View style={{ padding: 20 }}><Text style={{ textAlign: 'center', fontSize: 3 * RFT }}>就是你自己</Text></View>;
    }
    return this.state.users.map((item) => {
      const {
        avatar, nick, account,
      } = item;
      return (
        <ListItem
          roundAvatar
          key={account}
          leftAvatar={{ source: { uri: avatar || configs.defaultUserIcon } }}
          chevron
          chevronColor={baseBlueColor}
          title={account}
          subtitle={nick}
          containerStyle={{ padding: 10 }}
          bottomDivider
          onPress={() => {
              this.props.navigation.navigate('namecard', { account });
            }}
        />
      );
    });
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          leftComponent={<GoBack navigation={navigation} />}
          centerComponent={{ text: this.title, style: headerStyle.center }}
        />
        <Input
          inputContainerStyle={{
            backgroundColor: '#fff',
            marginVertical: 20,
            width: 100 * RVW,
            borderBottomWidth: 0,
            padding: 10,
          }}
          inputStyle={{ color: '#333', top: 2 }}
          leftIcon={{ type: 'meterial', name: 'search', color: '#999' }}
          placeholder="请输入账号"
          placeholderTextColor="#999"
          onChangeText={this.setAccount}
          value={this.state.account}
        />
        <Button
          title="查找"
          titleStyle={{ color: '#fff' }}
          onPress={this.searchUser}
          buttonStyle={{
            left: 5 * RVW,
            width: 90 * RVW,
            backgroundColor: baseBlueColor,
            borderRadius: 3,
          }}
        />
        <ScrollView style={{ marginTop: 20 }}>
          {this.renderUsers()}
        </ScrollView>
      </View>
    );
  }
}
