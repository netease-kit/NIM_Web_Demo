import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { baseBlueColor } from '../themes';
import { RVW, RFT } from '../common';

const localStyle = {
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: 12 * RVW,
  },
  label: {
    fontSize: 3.6 * RFT,
    lineHeight: 12 * RVW,
    textAlign: 'center',
  },
};

export default (props) => {
  const { navigation } = props;
  const { routeName } = navigation.state;
  const lightBlueColor = '#f0f3fb';
  return (
    <View style={localStyle.wrapper}>
      <TouchableOpacity style={[localStyle.tab, { backgroundColor: routeName === 'session' ? '#fff' : lightBlueColor }]} onPress={() => { navigation.navigate('session'); }}>
        <Text style={[localStyle.label, { color: routeName === 'session' ? baseBlueColor : '#333' }]}>最近会话</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[localStyle.tab, { backgroundColor: routeName === 'contact' ? '#fff' : lightBlueColor }]} onPress={() => { navigation.navigate('contact'); }}>
        <Text style={[localStyle.label, { color: routeName === 'contact' ? baseBlueColor : '#333' }]}>通讯录</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[localStyle.tab, { backgroundColor: routeName === 'general' ? '#fff' : lightBlueColor }]} onPress={() => { navigation.navigate('general'); }}>
        <Text style={[localStyle.label, { color: routeName === 'general' ? baseBlueColor : '#333' }]}>设置</Text>
      </TouchableOpacity>
    </View>
  );
}
