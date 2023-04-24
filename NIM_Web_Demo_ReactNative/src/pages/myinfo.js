import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { View } from 'react-navigation';
import { ListItem, Button, Header } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import GoBack from '../components/goback';
import LeftAvatar from '../components/leftAvatar';
import { globalStyle, headerStyle, baseRedColor } from '../themes';
import { RVW } from '../common';

@inject('nimStore', 'linkAction')
@observer
export default class Page extends Component {
  logout = () => {
    this.props.linkAction.logout();
  }
  render() {
    const myInfo = this.props.nimStore.myInfo || {};
    let gender = '未知';
    if (myInfo.gender === 'female') {
      gender = '女';
    } else if (myInfo.gender === 'male') {
      gender = '男';
    }
    const { navigation } = this.props;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          leftComponent={<GoBack navigation={navigation} />}
          centerComponent={{ text: '个人信息', style: headerStyle.center }}
        />
        <ListItem
          key={0}
          leftAvatar={<LeftAvatar uri={myInfo.avatar} />}
          title={myInfo.nick}
          subtitle={`账号：${myInfo.account}`}
          containerStyle={{ marginVertical: 20 }}
        />
        <ScrollView>
          <ListItem
            key={1}
            title="昵称"
            rightTitle={myInfo.nick}
            rightTitleStyle={globalStyle.listItemRight}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />
          <ListItem
            key={2}
            title="性别"
            rightTitle={gender}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />
          <ListItem
            key={3}
            title="生日"
            rightTitle={myInfo.birth}
            rightTitleStyle={globalStyle.listItemRight}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />
          <ListItem
            key={4}
            title="手机"
            rightTitle={myInfo.tel}
            rightTitleStyle={globalStyle.listItemRight}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />
          <ListItem
            key={5}
            title="邮箱"
            rightTitle={myInfo.email}
            rightTitleStyle={globalStyle.listItemRight}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />
          <ListItem
            key={6}
            title="签名"
            rightTitle={myInfo.sign}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          />

          <Button
            title="注销"
            titleStyle={{ color: '#fff' }}
            onPress={this.logout}
            buttonStyle={{
              marginLeft: 10 * RVW,
              width: 80 * RVW,
              backgroundColor: baseRedColor,
              marginVertical: 20,
              borderRadius: 3,
            }}
          />
        </ScrollView>
        <Toast ref={(ref) => { this.toast = ref; }} position="center" />
      </View>
    );
  }
}
