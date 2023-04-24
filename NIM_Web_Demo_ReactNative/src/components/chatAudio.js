import React from 'react';
import { View, Text, PanResponder, Alert, PermissionsAndroid, InteractionManager } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { chatStyle } from '../themes';

const holdRecordText = '按住 说话';
const releaseRecordText = '松开 结束';
const abortRecordText = '滑动取消语音发送';

export default class ChatBox extends React.Component {
  static defaultProps = {
    sendAudio() {},
  }

  constructor(props) {
    super(props);
    this.state = {
      needSend: false,
      recordText: holdRecordText,
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      audioPath: `${AudioUtils.DocumentDirectoryPath}/nim_voice.aac`,
      hasPermission: undefined,
    };
    this._panResponder = {};
  }
  componentWillMount() {
    const self = this;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        self.startRecord();
      },
      onPanResponderMove: () => {
        // self.abortRecord();
      },
      onPanResponderRelease: () => {
        self.endRecord();
      },
      onPanResponderTerminate: () => {
        self.endRecord();
      },
    });
  }
  componentDidMount() {
    this.checkRecordingPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({ currentTime: data.currentTime });
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (global.ISIOS) {
          this.finishedRecording(data.status === 'OK', data.audioFileURL);
        }
      };
    });
  }
  componentWillUnmount() {
    clearTimeout(this._scrollTimer);
  }
  startRecord = () => {
    if (this.state.recording) {
      console.log('Already recording!');
      return Promise.resolve();
    }

    if (!this.state.hasPermission) {
      console.log('Can\'t record, no permission granted!');
      return Promise.resolve();
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({
      needSend: false,
      recording: true,
      recordText: releaseRecordText,
    });
    if (this.props.toast) {
      this.props.toast.show('松开发送语音消息,\n语音时长最短2秒，\n语音录制中...', 2000);
    }
    return AudioRecorder.startRecording();
  }
  abortRecord = () => {
    if (!this.state.recording) {
      console.log('Can\'t abort, not recording!');
      return Promise.resolve();
    }
    this.setState({
      needSend: false,
      stoppedRecording: true,
      recording: false,
      recordText: abortRecordText,
    });
    return AudioRecorder.stopRecording();
  }
  endRecord = () => {
    if (!this.state.recording) {
      this.setState({
        recordText: holdRecordText,
      });
      return Promise.resolve();
    }
    this.setState({
      needSend: true,
      stoppedRecording: true,
      recording: false,
      recordText: holdRecordText,
    });
    if (global.ISANDROID) {
      return AudioRecorder.stopRecording().then((filePath) => {
        this.finishedRecording(true, filePath);
      });
    }
    AudioRecorder.stopRecording();
    return Promise.resolve();
  }
  checkRecordingPermission() {
    if (global.ISIOS) {
      return Promise.resolve(true);
    }

    const rationale = {
      title: 'Microphone Permission',
      message: 'AudioExample needs access to your microphone so you can record audio.',
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }
  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 44100.0,
      Channels: 1,
      AudioQuality: 'Medium', // 'Low' 'High'
      AudioEncoding: 'aac',
      OutputFormat: 'aac_adts',
      AudioEncodingBitRate: 32000,
    });
  }
  finishedRecording(didSucceed, filePath) {
    if (!didSucceed) {
      Alert.alert('语音录制失败');
      return;
    } else if (this.state.currentTime < 2) {
      Alert.alert('不能发送时间小于2秒的语音');
      return;
    } else if (this.state.currentTime > 120) {
      Alert.alert('不能发送时间大于2分钟的语音');
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      if (this.state.needSend && (this.props.sendAudio instanceof Function)) {
        this.props.sendAudio(filePath, this.state.currentTime);
      }
    });
  }
  render() {
    return (
      <View
        style={chatStyle.chatBtn}
        {...this._panResponder.panHandlers}
      >
        <Text style={chatStyle.chatBtnText}>{this.state.recordText}</Text>
      </View>
    );
  }
}
