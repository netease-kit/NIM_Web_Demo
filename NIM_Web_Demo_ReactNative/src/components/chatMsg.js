import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import Sound from 'react-native-sound';
import { chatStyle } from '../themes';
import { RVW, RFT } from '../common';
import util from '../util';
// import emojiObj from '../util/emoji';
import emojiObj from '../res/emoji';
import playObj from '../res/play';
import configs from '../configs';
import constObj from '../store/constant';
import res from '../res';

// const soundFile = 'https://yx-web.nos-hz.163yun.com/demo%2Freactnative%2Ftest.mp3'; // require('./test.mp3');

const AvatarItem = (props) => {
  let { avatar } = props;
  if (!avatar) {
    avatar = configs.defaultUserIcon;
  }
  return (
    <View style={{
      width: 12 * RVW,
      height: 12 * RVW,
      borderRadius: 6 * RVW,
      borderWidth: 1,
      borderColor: '#ccc',
    }}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: 12 * RVW, height: 12 * RVW, borderRadius: 6 * RVW,
        }}
      />
    </View>);
};

const ChatContent = (props) => {
  const { msg = {} } = props;
  const { emoji } = emojiObj.emojiList;
  if (msg.type === 'text') {
    let showText = msg.text;
    const showTextArray = [];
    if (/\[[^\]]+\]/.test(showText)) {
      const emojiItems = showText.match(/\[[^\]]+\]/g);
      emojiItems.forEach((item) => {
        const wordIndex = showText.indexOf(item);
        if (wordIndex > 0) {
          showTextArray.push(showText.substr(0, wordIndex));
          showText = showText.substr(wordIndex);
        }
        showTextArray.push(item);
        showText = showText.substr(item.length);
      });
    }
    if (showText.length > 0) {
      showTextArray.push(showText);
    }
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
      >{
          showTextArray.map((item, index) => {
            const id = `${item}${index}`;
            if (emoji[item]) {
              return (<Image
                key={id}
                source={emoji[item].img}
                style={{
                  width: 5 * RFT, height: 5 * RFT,
                }}
              />);
            }
            return <Text key={id} style={chatStyle.text}>{item}</Text>;
          })
        }
      </View>
    );
  } else if (msg.type === 'custom') {
    const content = JSON.parse(msg.content);
    // type 1 为猜拳消息
    if (content.type === 1) {
      const { data } = content;
      const playImg = playObj[`play${data.value}`];
      return (<Image source={playImg} style={chatStyle.play} />);
      // type 3 为贴图表情
    } else if (content.type === 3) {
      const { data } = content;
      if (emojiObj.pinupList[data.catalog]) {
        const emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet];
        // return (<Image source={{ uri: emojiCnt.img }} style={chatStyle.emoji} />);
        return (<Image source={emojiCnt.img} style={chatStyle.emoji} />);
      }
      return (
        <Text style={chatStyle.text}>[未知贴图表情]</Text>);
    }
    const showMsg = util.parseCustomMsg(msg);
    return (<Text style={chatStyle.text}>[{showMsg}]</Text>);
  } else if (msg.type === 'image') {
    const { file } = msg;
    const width = 50 * RVW;
    const height = file.h > 0 ? ((width / file.w) * file.h) : 50 * RVW;
    let viewUrl = res.loadingImg;
    if (file.pendingUrl) {
      viewUrl = { uri: file.pendingUrl };
    } else if (file.url) {
      viewUrl = { uri: file.url };
      // console.log(viewUrl);
      viewUrl = {
        uri: constObj.nim.viewImageSync({
          url: file.url, // 必填
          quality: 75, // 图片质量 0 - 100 可选填
          thumbnail: { // 生成缩略图， 可选填
            width: Math.min(file.w, 20 * RVW),
            mode: 'cover',
          },
        }),
      };
    }
    return (<Image source={viewUrl} style={{ width, height }} />);
  } else if (msg.type === 'audio') {
    let duration = 1;
    if (msg.file && msg.file.dur) {
      duration = Math.floor(msg.file.dur / 1000);
    }
    const soundUrl = msg.file.url; // msg.file.ext === 'mp3' ? msg.file.url : msg.file.mp3Url;
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => {
          if (constObj.sound) {
            constObj.sound.stop(() => {
              constObj.sound.release();
              constObj.sound = null;
            });
          } else {
            constObj.sound = new Sound(soundUrl, null, (error) => {
              if (error) {
                Alert.alert('网络不通');
                constObj.sound.release();
                constObj.sound = null;
                return;
              }
              constObj.sound.play((success) => {
                console.log(success, constObj.sound);
                if (!success) {
                  Alert.alert('文件已损坏');
                  return;
                }
                constObj.sound.release();
                constObj.sound = null;
              });
            });
          }
        }}
      >
        <Icon
          type="material"
          name="record-voice-over"
          color="#666"
          size={3.5 * RFT}
        />
        <Text>{`  ${duration}"`}</Text>
      </TouchableOpacity>
    );
  }
  const showMsg = util.mapMsgType(msg);
  return (<Text style={chatStyle.text}>[{showMsg}]</Text>);
};

const getThumbnail = (props) => {
  const { msg } = props;
  const account = msg.from;
  let userInfo = {};
  if (props.nimStore.userID === account) {
    // 自己
    userInfo = props.nimStore.myInfo;
  } else {
    userInfo = props.nimStore.userInfos[account];
  }
  let avatar = configs.defaultUserIcon;
  if (userInfo.avatar) {
    avatar = constObj.nim.viewImageSync({
      url: userInfo.avatar, // 必填
      quality: 80, // 图片质量 0 - 100 可选填
      thumbnail: { // 生成缩略图， 可选填
        width: 5 * RVW,
        mode: 'cover',
      },
    });
  }
  return avatar;
};


export const ChatLeft = (props) => {
  const { msg } = props;
  const avatar = getThumbnail(props);
  return (
    <View
      style={[chatStyle.wrapper, chatStyle.left]}
    >
      <TouchableOpacity
        onPress={() => { props.navigation.navigate('namecard', { account: msg.from }); }}
      >
        <AvatarItem
          avatar={avatar}
        />
      </TouchableOpacity>
      <View style={[chatStyle.content, chatStyle.contentLeft]}>
        <ChatContent msg={msg} />
      </View>
    </View>
  );
};


export const ChatRight = (props) => {
  const { msg, resendTextMag } = props;
  const avatar = getThumbnail(props);
  return (
    <View style={[chatStyle.wrapper, chatStyle.right]}>
      { msg.status === 'fail' ?
        <Icon
          name="exclamation-circle"
          type="font-awesome"
          size={5 * RFT}
          color="#f00"
          iconStyle={chatStyle.icon}
          onPress={() => { resendTextMag(msg) }}
        />
        :
        null
      }
      { msg.status === 'sending' ?
        <Image source={res.loadingMsg} style={chatStyle.icon} />
        :
        null
      }
      <TouchableOpacity
        style={[chatStyle.content, chatStyle.contentRight]}
        activeOpacity={1}
        onLongPress={() => {
          if (props.msgAction) {
            const currentTime = (new Date()).getTime();
            if (currentTime - msg.time > 120 * 1000) {
              return;
            }
            Alert.alert('提示', '只能撤回发送2分钟以内的消息，确认要撤回', [
              { text: '取消' },
              { text: '确认撤回', onPress: () => { props.msgAction.backoutMsg(msg); } },
            ]);
          }
        }}
      >
        <ChatContent msg={msg} />
      </TouchableOpacity>
      <AvatarItem
        avatar={avatar}
      />
    </View>
  );
};

