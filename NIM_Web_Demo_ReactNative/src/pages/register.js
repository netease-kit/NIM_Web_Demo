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
import configs from '../configs';
import util from '../util';

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
      nickname: '',
      password: '',
    };
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
  setNickname = (text) => {
    this.setState({
      nickname: text,
    });
  }
  checkNickname = () => {
    let { nickname } = this.state;
    if (nickname.trim() === '' || nickname.length > 10) {
      this.toast.show('昵称长度错误');
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
  register = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.doRegister();
      } else {
        this.toast.show('网络状况不佳');
      }
    });
  }
  doRegister = () => {
    if (!this.checkAccount() || !this.checkNickname() || !this.checkPwd()) {
      return
    }
    let { account, nickname, password } = this.state;
    const sdktoken = MD5(password)
    let accountLowerCase = account.toLowerCase()
    fetch(`${configs.postUrl}/api/createDemoUser`,{
       method:'POST',
       mode: 'cors',
       headers:{
         'Content-Type': 'application/x-www-form-urlencoded',
         'appkey': configs.appkey
       },
       body: util.object2query({
         username: accountLowerCase,
         nickname: nickname,
         password: sdktoken
       })
     }).then((response) => {
       if(response.ok){
         return response.json()
       }
     }).then((json) => {
       if (json.res === 200) {
         this.toast.show('注册成功')
         AsyncStorage.setItem('account', accountLowerCase);
         this.props.navigation.push('login');
         this.setState({
           account: '',
           nickname: '',
           password: '',
         });
       } else {
         this.toast.show(json.errmsg)
       }
     }).catch(error => {
       this.toast.show('网络断开或其他未知错误')
     }).done()
  }
  toLoginPage = () => {
    this.props.navigation.navigate('login');
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
            onPress={this.register}
            disabled={this.state.account.trim() === '' || this.state.nickname.trim() === '' || this.state.password.trim() === ''}  buttonStyle={{
              width: 12 * RVW,
              height: 7 * RFT,
              backgroundColor: '#fff',
              borderRadius: 3
            }}
          />}
          centerComponent={{ text: '注册', style: headerStyle.center }}
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
              inputStyle={{ color: '#fff', top: 2 }}
              leftIcon={{ type: 'font-awesome', name: 'user', color: '#9ac6f7' }}
              placeholder="账号：限20位字母或者数字"
              maxLength={20}
              placeholderTextColor="#e0e0e0"
              onChangeText={this.setAccount}
              onBlur={this.checkAccount}
              value={this.state.account}
              selectionColor="#fff"
            />
            <Input
              inputContainerStyle={{ width: 80 * RVW }}
              inputStyle={{ color: '#fff', top: 2 }}
              leftIcon={{ type: 'font-awesome', name: 'user-o', color: '#9ac6f7' }}
              placeholder="昵称：限10位汉字、字母或者数字"
              maxLength={10}
              placeholderTextColor="#e0e0e0"
              onChangeText={this.setNickname}
              onBlur={this.checkNickname}
              value={this.state.nickname}
              selectionColor="#fff"
            />
            <Input
              secureTextEntry
              inputContainerStyle={{ width: 80 * RVW }}
              inputStyle={{ color: '#fff', top: 2 }}
              leftIcon={{ type: 'font-awesome', name: 'lock', color: '#9ac6f7' }}
              placeholder="密码：6~20位字母或者数字"
              maxLength={20}
              placeholderTextColor="#e0e0e0"
              onChangeText={this.setToken}
              onFocus={this.clearPwd}
              onBlur={this.checkPwd}
              value={this.state.password}
              selectionColor="#fff"
            />
            <TouchableOpacity onPress={this.toLoginPage} >
              <Text style={{
                marginTop: 10 * RVW,
                color: '#fff',
                textAlign: 'center'
              }}>已有账号？直接登录</Text>
            </TouchableOpacity>
          </View>
          <Toast ref={(ref) => { this.toast = ref; }} position="center" />
        </View>
      </View>
    );
  }
}
