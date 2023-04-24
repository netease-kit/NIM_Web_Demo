import React from 'react';
import { inject, observer } from 'mobx-react/native';
// import { SafeView } from 'react-navigation';
import { View, Image, AsyncStorage, NetInfo, TouchableOpacity, Text } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import { globalStyle, baseBlueColor, headerStyle } from '../themes';
import { RVW, RFT } from '../common';
import MD5 from '../util/md5';
import constObj from '../store/constant';

const localStyle = {
  wrapper: {
    backgroundColor: baseBlueColor,
  },
};

@inject('nimStore', 'linkAction')
@observer
export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
    };
  }
  componentWillMount = () => {
    AsyncStorage.getItem('account').then((account) => {
      if (account) {
        this.setState({
          account,
        });
        this.inputText.focus()
      }
    });
    AsyncStorage.getItem('password').then((password) => {
      if (password) {
        this.setState({
          password,
        });
      }
    });
  }
  setAccount = (text) => {
    this.setState({
      account: text,
    });
  }
  checkAccount = () => {
    let { account } = this.state;
    if (account.trim() === '' || account.length > 20) {
      this.toast.show('账号长度错误');
      return
    }
    if (/[^a-zA-Z0-9]/.test(account)) {
      this.toast.show('账号限字母或数字')
      return
    }
    return true
  }
  setToken = (text) => {
    this.setState({
      password: text,
    });
  }
  checkPwd = () => {
    let { password } = this.state;
    if (password.trim() === '' || password.length < 6 || password.length > 20) {
      this.toast.show('密码长度错误');
      return
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
      this.toast.show('密码限字母或数字')
      return
    }
    return true
  }
  clearPwd = () => {
    this.setState({
      password: '',
    });
  }
  login = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.doLogin();
      } else {
        this.toast.show('网络状况不佳');
      }
    });
  }
  doLogin = () => {
    if (this.props.nimStore.userId && constObj.nim) {
      this.props.navigation.navigate('session');
      return;
    }
    if (!this.checkAccount() || !this.checkPwd()) {
      return
    }
    let { account, password } = this.state;
    account = account.toLowerCase();
    AsyncStorage.setItem('account', account);
    AsyncStorage.setItem('password', password);
    const token = MD5(this.state.password);
    // if (this.props.)
    this.props.linkAction.login(account, token, (error) => {
      if (error) {
        // if (this.toast) {
        //   this.toast.show(util.parseDisconnectMsg(error));
        // }
        this.props.navigation.navigate('login');
      } else {
        if (this.props.navigation.state.routeName === 'login') {
          this.props.navigation.navigate('session');
        }
        AsyncStorage.setItem('isLogin', 'true');
      }
    });
  }
  toRegisterPage = () => {
    this.props.navigation.navigate('register');
  }
  render() {
    return (
      // View 用以适配iPhoneX
      <View style={globalStyle.container}>
        <Header
          outerContainerStyles={headerStyle.wrapper}
          rightComponent={<Button
            title="完成"
            titleStyle={{
              padding: 0,
              lineHeight: 7 * RFT,
              fontSize: 3.6 * RFT,
              color: baseBlueColor,
            }}
            onPress={this.login}
            disabled={this.state.account.trim() === '' || this.state.password.trim() === ''}
            buttonStyle={{
              width: 12 * RVW,
              height: 7 * RFT,
              backgroundColor: '#fff',
              borderRadius: 3
            }}
          />}
          centerComponent={{ text: '登录', style: headerStyle.center }}
        />
        <View
          style={[globalStyle.container, globalStyle.center, localStyle.wrapper]}
        >
          <View
            style={{
              width: 80 * RVW,
            }}
          >
            <View style={{ marginVertical: 3 * RVW, flexDirection: 'row', justifyContent: 'center' }} >
              <Image style={{ width: 50 * RVW, height: 20 * RVW }} source={require('../res/logo.png')} />
            </View>
            <Input
              inputContainerStyle={{ width: 80 * RVW }}
              inputStyle={{ color: '#fff', top: 2, height: 50 }}
              leftIcon={{ type: 'font-awesome', name: 'user', color: '#9ac6f7' }}
              placeholder="请输入账号"
              placeholderTextColor="#e0e0e0"
              onChangeText={this.setAccount}
              onBlur={this.checkAccount}
              value={this.state.account}
              maxLength={20}
              selectionColor="#fff"
            />
            <Input
              secureTextEntry
              inputContainerStyle={{ width: 80 * RVW }}
              inputStyle={{ color: '#fff', top: 2, height: 50 }}
              leftIcon={{ type: 'font-awesome', name: 'lock', color: '#9ac6f7' }}
              placeholder="请输入密码"
              placeholderTextColor="#e0e0e0"
              onChangeText={this.setToken}
              onFocus={this.clearPwd}
              onBlur={this.checkPwd}
              value={this.state.password}
              maxLength={20}
              selectionColor="#fff"
              ref={(ref) => { this.inputText = ref; }}
            />
            <TouchableOpacity onPress={this.toRegisterPage} >
              <Text style={{
                marginTop: 10 * RVW,
                color: '#fff',
                textAlign: 'center'
              }}>注册</Text>
            </TouchableOpacity>
          </View>
          <Toast ref={(ref) => { this.toast = ref; }} position="center" />
        </View>
      </View>
    );
  }
}
