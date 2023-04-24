import { AppRegistry, Platform } from 'react-native';
import App from './App';

global.ISIOS = false;
global.ISANDROID = false;
if (Platform.OS.toLowerCase() === 'android') {
  global.ISANDROID = true;
} else if (Platform.OS.toLowerCase() === 'ios') {
  global.ISIOS = true;
}

AppRegistry.registerComponent('NIM_ReactNative_Demo', () => App);
