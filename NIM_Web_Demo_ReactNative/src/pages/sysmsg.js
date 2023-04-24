import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { View } from 'react-navigation';
import { ListItem, Button, Header, Icon } from 'react-native-elements';
import GoBack from '../components/goback';
import LeftAvatar from '../components/leftAvatar';
import { globalStyle, headerStyle, baseBlueColor, baseRedColor } from '../themes';
import { RFT, RVW } from '../common';
import configs from '../configs';
import util from '../util';


const SysmsgTitle = props => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ color: '#000', fontSize: 4.2 * RFT }}>{props.alias}</Text>
    <Text style={{ marginLeft: 10, fontSize: 4.2 * RFT }}>{props.time}</Text>
  </View>
);

@inject('nimStore', 'linkAction', 'friendAction', 'msgAction')
@observer
export default class Page extends Component {
  renderAccept(sysmsg) {
    if (sysmsg.type !== 'applyFriend') {
      return null;
    }
    if (sysmsg.state === 'init') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            buttonStyle={{ backgroundColor: baseBlueColor }}
            title="同意"
            titleStyle={{ color: '#fff' }}
            onPress={() => {
              this.props.friendAction.passFriendApply(sysmsg);
            }}
          />
          <Button
            buttonStyle={{ backgroundColor: baseRedColor, marginLeft: 10 }}
            title="拒绝"
            titleStyle={{ color: '#fff' }}
            onPress={() => {
              this.props.friendAction.rejectFriendApply(sysmsg);
            }}
          />
        </View>
      );
    } else if (sysmsg.state === 'passed') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            buttonStyle={{ backgroundColor: '#999' }}
            title="已同意"
            titleStyle={{ color: '#fff' }}
            disabled
          />
        </View>
      );
    } else if (sysmsg.state === 'rejected') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            buttonStyle={{ backgroundColor: '#999' }}
            title="已拒绝"
            titleStyle={{ color: '#fff' }}
            disabled
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const { navigation } = this.props;
    const { userInfos, sysMsgs } = this.props.nimStore;
    return (
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          leftComponent={<GoBack navigation={navigation} />}
          centerComponent={{ text: '系统通知', style: headerStyle.center }}
          rightComponent={<Icon
            name="trash"
            type="font-awesome"
            color="#fff"
            size={6 * RVW}
            iconStyle={{ marginRight: 10 }}
            onPress={() => { this.props.msgAction.clearSysMsgs(); }}
          />}
        />
        <ScrollView>
          {(sysMsgs && sysMsgs.length > 0) ?
            sysMsgs.map((sysmsg) => {
              const uinfo = userInfos[sysmsg.from] || {};
              let showText = '';
              switch (sysmsg.type) {
                case 'addFriend':
                  showText = '已添加您为好友';
                  break;
                case 'applyFriend':
                  showText = '申请添加您为好友';
                  break;
                case 'passFriendApply':
                  showText = '对方通过了您的好友申请';
                  break;
                case 'rejectFriendApply':
                  showText = '对方拒绝了您的好友申请';
                  break;
                case 'deleteFriend':
                  showText = '将您从好友列表中删除';
                  break;
                default:
                  showText = '未知系统通知';
              }
              return (<ListItem
                key={sysmsg.idServer}
                leftAvatar={<LeftAvatar uri={uinfo.avatar || configs.defaultUserIcon} />}
                title={<SysmsgTitle alias={sysmsg.from} time={util.formatDate(sysmsg.time)} />}
                subtitle={showText}
                rightElement={this.renderAccept(sysmsg)}
                containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
              />);
            }) :
            <Text style={{ padding: 20, textAlign: 'center' }}>无系统通知</Text>
          }
        </ScrollView>
      </View>
    );
  }
}
