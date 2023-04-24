import React from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, InteractionManager } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import ChatAudio from './chatAudio';
import { chatStyle } from '../themes';
import ChatEmoji from './chatEmoji';
import { RVW, RFT } from '../common';
import uuid from '../util/uuid';

export const ChatItem = (props) => {
  const typeMap = {
    location: 'location-on',
    camera: 'camera-alt',
    album: 'photo-size-select-actual',
    file: 'attach-file',
    play: 'thumbs-up-down',
  };
  return (
    <TouchableOpacity style={chatStyle.chatItem} onPress={props.onPress}>
      <Icon type="material" name={typeMap[props.itemType]} size={6 * RVW} iconStyle={{ color: '#666' }} />
    </TouchableOpacity>
  );
};

export class ChatBox extends React.Component {
  static defaultProps = {
    options: {
      scene: 'p2p',
      toAccount: '',
    },
    chatListRef: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      msgText: '',
      isTextMsg: true,
      isExtraShown: false,
      isEmojiShown: false,
    };
    this._scrollTimer = null;
  }
  componentWillUnmount() {
    clearTimeout(this._scrollTimer);
  }
  showVoice = () => {
    this.setState({
      isTextMsg: false,
      isExtraShown: false,
      isEmojiShown: false,
    });
  }
  hideVoice = () => {
    this.setState({
      isTextMsg: true,

    });
  }
  showEmoji = (isEmoji = false) => {
    this.inputText.blur();
    this.setState({
      isEmojiShown: isEmoji,
      isExtraShown: false,
      msgText: this.inputText._lastNativeText,
    });
    this.scrollToEnd();
  }
  showExtra = () => {
    this.inputText.blur();
    this.setState({
      isExtraShown: !this.state.isExtraShown,
      isEmojiShown: false,
    });
    this.scrollToEnd();
  }
  sendTextMsg = (event) => {
    const { text } = event.nativeEvent;
    if (text === '') {
      return;
    }
    // this.setState({
    //   msgText: text,
    // });
    const options = {
      text,
      scene: this.props.options.scene,
      to: this.props.options.toAccount,
    };
    this.props.action.sendTextMsg(options);
    // 触发value diff
    InteractionManager.runAfterInteractions(() => {
    // clearTimeout(this._scrollTimer);
      this.inputText._lastNativeText = '';
      this.setState({
        msgText: '',
      });
      this.scrollToEnd();
    // }, 300);
    });
  }
  sendEmojiMsg = (item) => {
    const options = {
      content: {
        type: 3,
        data: item,
      },
      scene: this.props.options.scene,
      to: this.props.options.toAccount,
    };
    this.props.action.sendCustomMsg(options);
    this.scrollToEnd();
  }
  sendPlayMsg = () => {
    this.showExtra();
    const options = {
      content: {
        type: 1,
        data: {
          value: Math.ceil(Math.random() * 3),
        },
      },
      scene: this.props.options.scene,
      to: this.props.options.toAccount,
    };
    this.props.action.sendCustomMsg(options);
    this.scrollToEnd();
  }
  sendVoiceMsg = (filePath, duration) => {
    const fileOptions = {
      scene: this.props.options.scene,
      to: this.props.options.toAccount,
      filePath,
      size: 1, // stat.size,
      md5: uuid(),
      dur: Math.round(duration * 1000),
      callback: () => {
        this.scrollToEnd();
      },
    };
    this.props.action.sendAudioMsg(fileOptions);
  }
  sendImgMsg = () => {
    this.showExtra();
    const photoOptions = {
      title: '请选择',
      quality: 0.8,
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      allowsEditing: true,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(photoOptions, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const fileOptions = {
          scene: this.props.options.scene,
          to: this.props.options.toAccount,
          filePath: response.uri,
          width: response.width,
          height: response.height,
          size: 1, // stat.size,
          md5: uuid(), // MD5(fileData),
          // pendingUrl: `data:${response.type};base64,${response.data}`,
          callback: () => {
            this.scrollToEnd();
          },
        };
        this.props.action.sendImageMsg(fileOptions);
        // RNFS.stat(filePath).then((stat) => {
        //   fileOptions.size = stat.size;
        // }).catch((error) => {
        //   console.log(filePath, error);
        // }).finally(() => {
        //   this.props.action.sendImageMsg(fileOptions);
        // });
      }
    });
  }
  sendGeoMsg = () => {
    this.showExtra();
    this.props.toast.show('Demo暂不支持发送地理位置消息');
  }
  sendFileMsg = () => {
    this.showExtra();
    this.props.toast.show('Demo暂不支持发送文件消息');
  }
  scrollToEnd = () => {
    if (this.props.chatListRef) {
      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          this.props.chatListRef.scrollToEnd();
        });
      }, 500);
    }
  }
  renderEmoji = () => {
    if (this.state.isEmojiShown) {
      return (
        <ChatEmoji onSelectEmoji={(item) => {
          if (item.type === 'emoji') {
            this.inputText._lastNativeText = `${this.inputText._lastNativeText}${item.key}`;
            // console.log(this.inputText._lastNativeText);
            // this.setState({
            //   msgText: `${this.state.msgText}${item.key}`,
            // });
            this.showEmoji(true);
          } else if (item.type === 'pinup') {
            this.sendEmojiMsg({
              catalog: item.name,
              chartlet: item.key,
            });
            this.inputText.blur();
            this.showEmoji();
          }
        }}
        />
      );
    }
    return <View />;
  }
  renderExtra = () => {
    if (this.state.isExtraShown) {
      return (
        <View style={chatStyle.chatItemWraper}>
          <View style={chatStyle.chatItemRow}>
            <ChatItem key={0} itemType="album" onPress={this.sendImgMsg} />
            <ChatItem key={1} itemType="camera" onPress={this.sendImgMsg} />
            {/* <ChatItem key={2} itemType="location" onPress={this.sendGeoMsg} />
            <ChatItem key={3} itemType="file" onPress={this.sendFileMsg} /> */}
            <ChatItem key={4} itemType="play" onPress={this.sendPlayMsg} />
          </View>
        </View>
      );
    }
    return (<View />);
  }
  renderBox = () => {
    const icm = 8 * RFT;
    const icColor = '#999';
    return (
      <View style={chatStyle.chatBoxWrapper}>
        {this.state.isTextMsg ?
          <View style={[chatStyle.chatBox, chatStyle.center]}>
            <Icon
              key={0}
              type="material"
              name="keyboard-voice"
              color={icColor}
              size={icm}
              style={chatStyle.iconSmall}
              onPress={this.showVoice}
            />
            <TextInput
              style={chatStyle.chatText}
              blurOnSubmit={false}
              defaultValue=""
              value={this.state.msgText}
              onSubmitEditing={this.sendTextMsg}
              underlineColorAndroid="transparent"
              ref={(ref) => { this.inputText = ref; }}
              onChangeText={(text) => {
                // if (global.ISANDROID) {
                  this.setState({
                    msgText: text,
                  });
                // }
              }}
              onFocus={() => {
                this.setState({
                  isExtraShown: false,
                  isEmojiShown: false,
                });
                this.scrollToEnd();
              }}
            />
            <Icon
              key={1}
              type="material"
              name="tag-faces"
              color={icColor}
              size={icm}
              style={chatStyle.iconSmall}
              onPress={this.showEmoji}
            />
            <Icon
              key={2}
              type="material"
              name="add-circle-outline"
              color={icColor}
              size={icm}
              style={chatStyle.iconSmall}
              onPress={this.showExtra}
            />
          </View> :
          <View style={[chatStyle.chatBox, chatStyle.center]}>
            <Icon
              key={0}
              type="material"
              name="keyboard"
              color={icColor}
              size={icm}
              style={chatStyle.iconSmall}
              onPress={this.hideVoice}
            />
            <ChatAudio
              sendAudio={this.sendVoiceMsg}
              toast={this.props.toast}
            />
          </View>
        }
        {this.renderExtra()}
        {this.renderEmoji()}
      </View>
    );
  }
  render() {
    if (global.ISIOS) {
      return (
        <KeyboardAvoidingView behavior="padding">
          {this.renderBox()}
        </KeyboardAvoidingView>
      );
    }
    return this.renderBox();
  }
}
