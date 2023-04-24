import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { View } from 'react-navigation';

import { globalStyle } from '../themes';
// import { RVW } from '../common';

@inject('chatroomStore')
@observer
export default class Page extends Component {
  render() {
    return (
      <View style={globalStyle.container}>
        <Text>聊天室</Text>
      </View>
    );
  }
}
