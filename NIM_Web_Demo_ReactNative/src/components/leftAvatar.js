import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { globalStyle } from '../themes';

export default (props) => {
  if (props.onPress) {
    return (
      <TouchableOpacity style={globalStyle.avatarWrapper} onPress={props.onPress}>
        <Image source={{ uri: props.uri }} style={globalStyle.avatar} />
      </TouchableOpacity>
    );
  }
  return (
    <View style={globalStyle.avatarWrapper}>
      <Image source={{ uri: props.uri }} style={globalStyle.avatar} />
    </View>
  );
};
