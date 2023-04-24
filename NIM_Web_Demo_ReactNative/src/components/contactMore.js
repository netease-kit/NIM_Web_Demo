import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { headerStyle } from '../themes';

export default props =>
  (
    <TouchableOpacity onPress={props.onPress}>
      {/* <Icon name="ios-menu" type="ionicon" color="#fff" iconStyle={headerStyle.icon} /> */}
      <Icon name="add-to-list" type="entypo" color="#fff" iconStyle={headerStyle.icon} />
    </TouchableOpacity>
  );

