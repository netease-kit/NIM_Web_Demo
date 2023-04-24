import React, { Component } from 'react';
import { Text, View, SectionList, TouchableOpacity } from 'react-native';
import { Header, ListItem } from 'react-native-elements';
// import { SafeView } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import More from '../components/contactMore';
import LeftAvatar from '../components/leftAvatar';
import NavBottom from '../components/navBottom';
import { globalStyle, headerStyle, contactStyle, baseBlueColor } from '../themes';
import getPinyin from '../util/pinyin';
import util from '../util';
import configs from '../configs';

@inject('nimStore')
@observer
export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }
  componentWillMount() {
    this.setState({
      showMore: false,
    });
  }
  getFriendList() {
    const uinfos = this.props.nimStore.userInfos || {};
    let friendList = this.props.nimStore.friendslist;
    friendList = friendList.filter((item) => {
      // const isFriend = this.props.nimStore.friendFlags[item.account];
      const isFriend = this.props.nimStore.friendFlags.has(item.account);
      if (isFriend) {
        return true;
      }
      return false;
    });
    const list = friendList.map((item) => {
      const friend = Object.assign({}, item);
      const uid = friend.account;
      const user = uinfos[uid];
      const alias = user != null && user.alias ? user.alias.trim() : null;
      friend.alias = alias || (user != null && user.nick) || uid;
      friend.pinyin = getPinyin(friend.alias, '').toUpperCase();
      friend.avatar = util.genAvatar((user != null && user.avatar) || configs.defaultUserIcon);
      let firstLetter = friend.pinyin[0];
      firstLetter = firstLetter >= 'A' && firstLetter <= 'Z' ? firstLetter : '#';
      friend.letter = firstLetter;
      return friend;
    });
    list.sort((a, b) => (a.pinyin < b.pinyin ? -1 : (a.pinyin > b.pinyin ? 1 : 0)));
    return list;
  }

  letterFriendMap() {
    const map = Object.create(null);
    this.getFriendList().forEach((friend) => {
      const firstLetter = friend.letter;
      if (map[firstLetter] === undefined) {
        map[firstLetter] = [];
      }
      map[firstLetter].push(friend);
    });
    return map;
  }

  groupFriendList() {
    const map = this.letterFriendMap();
    const groups = [];
    Object.keys(map).forEach((key) => {
      groups.push({
        title: key,
        key,
        data: map[key],
      });
    });
    return groups;
  }

  toggleMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  }

  addFriend = () => {
    this.props.navigation.navigate('searchUser', { scene: 'p2p' });
    this.toggleMore();
  }

  renderMore = () => {
    if (this.state.showMore) {
      return (
        <View style={contactStyle.menuBox}>
          <TouchableOpacity onPress={this.addFriend}>
            <Text style={contactStyle.menuLine}>添加好友</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Text style={contactStyle.menuLine}>搜索高级群</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={contactStyle.menuLine}>创建高级群</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={contactStyle.menuLine}>创建普通群</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
    return null;
  }

  renderItemView = (info, index) => {
    const txt = info.item.alias;
    return (<ListItem
      leftAvatar={<LeftAvatar uri={info.item.avatar} />}
      chevron={false}
      title={txt}
      key={index}
      onPress={() => {
        this.props.navigation.navigate('namecard', { account: info.item.account });
      }}
    />);
  }

  renderSectionView = (info) => {
    const txt = info.section.title;
    return (<Text style={contactStyle.section} key={txt}>{txt}</Text>);
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ ...globalStyle.container, flex: 1 }}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          rightComponent={<More
            navigation={navigation}
            onPress={() => { navigation.navigate('searchUser', { scene: 'p2p' }); }}
          />}
          centerComponent={{ text: '通讯录', style: headerStyle.center }}
        />
        <ListItem
          key="notice"
          leftAvatar={<LeftAvatar uri={configs.noticeIcon} />}
          chevron
          chevronColor={baseBlueColor}
          title="系统通知"
          onPress={() => {
            navigation.navigate('sysmsg');
          }}
        />
        <SectionList
          renderItem={this.renderItemView}
          renderSectionHeader={this.renderSectionView}
          keyExtractor={(item, index) => `key-${index}`}
          sections={this.groupFriendList()}
          ItemSeparatorComponent={() => <View style={contactStyle.separatorLine} />}
        />
        {this.renderMore()}
        <NavBottom navigation={navigation} />
      </View>
    );
  }
}
