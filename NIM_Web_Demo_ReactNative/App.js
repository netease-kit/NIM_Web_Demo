import React, { Component } from 'react';
import { BackHandler, NetInfo, Alert } from 'react-native';
import { Provider } from 'mobx-react/native';
import stores from './src/store';
import App from './src';

// const NimApp = () => (
//   <Provider {...stores}>
//     <App />
//   </Provider>
// );

const handleConnectivityChange = () => {
  NetInfo.isConnected.fetch().then((isConnected) => {
    if (!isConnected) {
      Alert.alert('提示', '网络已断开，请连接网络重试');
    }
  });
};

export default class NimApp extends Component {
  constructor(props) {
    super(props);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid,
    );
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleConnectivityChange,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid,
    );
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      handleConnectivityChange,
    );
  }
  onBackButtonPressAndroid = () => true
  render() {
    return (
      <Provider {...stores}>
        <App />
      </Provider>
    );
  }
}
