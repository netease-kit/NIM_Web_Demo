import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { chatStyle, emojiStyle } from '../themes';
import { RVW } from '../common';
// import emojiObj from '../util/emoji';
import emojiObj from '../res/emoji';

function genEmojiList(type, emojiList) {
  const result = {};
  Object.keys(emojiList).forEach((name) => {
    const emojiMap = emojiList[name];
    const list = [];
    Object.keys(emojiMap).forEach((key) => {
      list.push({
        type,
        name,
        key,
        img: emojiMap[key].img,
      });
    });
    if (list.length > 0) {
      result[name] = {
        type,
        name,
        list,
        album: list[0].img,
      };
    }
  });

  return result;
}

export default class ChatEmoji extends React.Component {
  static defaultProps = {
    onSelectEmoji() {},
  }
  constructor(props) {
    super(props);
    this.emoji = genEmojiList('emoji', emojiObj.emojiList);
    this.pinup = genEmojiList('pinup', emojiObj.pinupList);
    this.state = {
      currType: 'emoji',
      currAlbum: 'emoji',
    };
    this.emojiScrollView = null;
  }
  selectAlbum = (item) => {
    this.setState({
      currType: item.type,
      currAlbum: item.name,
    });
    if (this.emojiScrollView) {
      this.emojiScrollView.scrollTo({ x: 0 });
    }
  }
  selectEmoji = (item) => {
    this.props.onSelectEmoji({
      type: this.state.currType,
      name: this.state.currAlbum,
      key: item.key,
    });
  }
  renderEmoji = () => {
    const emojis = this.emoji[this.state.currAlbum];
    return (
      <View style={emojiStyle.emojiWrapper}>
        {
          emojis.list.map(item => (
            <TouchableOpacity
              key={item.key}
              style={emojiStyle.emoji}
              onPress={() => { this.selectEmoji({ key: item.key }); }}
            >
              <Image source={item.img} key={item.key} style={{ width: 6 * RVW, height: 6 * RVW }} />
            </TouchableOpacity>
          ))
        }
      </View>
    );
  }
  renderPinup = () => {
    const pinups = this.pinup[this.state.currAlbum];
    return (
      <View style={emojiStyle.emojiWrapper}>
        {
          pinups.list.map(item => (
            <TouchableOpacity
              key={item.key}
              style={emojiStyle.pinup}
              onPress={() => { this.selectEmoji({ key: item.key }); }}
            >
              <Image key={item.key} source={item.img} style={{ width: 10 * RVW, height: 10 * RVW }} />
            </TouchableOpacity>
          ))
        }
      </View>
    );
  }
  render() {
    return (
      <View style={[chatStyle.chatItemWraper, { paddingVertical: 0 }]}>
        <ScrollView
          horizontal
          ref={(scrollView) => { this.emojiScrollView = scrollView; }}
        >
          { this.state.currType === 'emoji' ? this.renderEmoji() : this.renderPinup()}
        </ScrollView>
        <View style={[chatStyle.chatItemRow, { backgroundColor: '#fff', justifyContent: 'flex-start' }]}>
          {
            Object.keys(this.emoji).map((name) => {
              const emoji = this.emoji[name].list[0];
              return (
                <TouchableOpacity key={name} style={[emojiStyle.album, { backgroundColor: (this.state.currAlbum === name ? '#f0f0f0' : '#fff') }]} onPress={() => { this.selectAlbum({ type: 'emoji', name }); }}>
                  <Image source={emoji.img} style={{ width: 6 * RVW, height: 6 * RVW }} />
                </TouchableOpacity>
              );
            })
          }
          {
            Object.keys(this.pinup).map((name) => {
              const pinup = this.pinup[name].list[0];
              return (
                <TouchableOpacity key={name} style={[emojiStyle.album, { backgroundColor: (this.state.currAlbum === name ? '#f0f0f0' : '#fff') }]} onPress={() => { this.selectAlbum({ type: 'pinup', name }); }}>
                  <Image source={pinup.img} style={{ width: 6 * RVW, height: 6 * RVW }} />
                </TouchableOpacity>
              );
            })
          }
        </View>
      </View>
    );
  }
}
