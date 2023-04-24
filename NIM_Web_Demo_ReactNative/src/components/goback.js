import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { headerStyle } from '../themes';

export default class Component extends React.Component {
  goBack = () => {
    if (this.props.callback) {
      this.props.callback();
    }
    this.props.navigation.goBack();
  }
  render() {
    return (
      <TouchableOpacity onPress={this.goBack}>
        <Icon name="ios-arrow-back" type="ionicon" color="#fff" iconStyle={headerStyle.icon} />
      </TouchableOpacity>
    );
  }
}
