import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import uuid from '../util/uuid';
import { globalStyle } from '../themes';
import { RVW } from '../common';

const fileType = 2;
let fileList = [
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU4NTkzXzE1MzExMDY4OTg5NDJfZWY4MzM0ZTctM2NhNS00MjJhLTg1ZDEtMmQxYzEyN2Q2YTA2' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU4NTkzXzE1MzExMDY5MTQ5MDdfOWVkZTYzOWMtNTdiNC00NWQ4LWFhNGQtYmE2NDVmMzRhNjhj' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU4NTkzXzE1MzExMDY5MzAzODRfNDIwNzkyZjItMGUxZi00ZmE1LTliMTMtYWUyMmUzMzFhY2Uy' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU4NTkzXzE1MzExMDY5NDM0ODJfZmYwYmZjNmMtMmZkZC00OGQ0LWEyMzQtNTllOGMyZTc5NGZh' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU4NTkzXzE1MzExMDcwMjI1NDBfYjczZWFmY2YtNDc2Ni00NTI0LTk1NzgtMGM5Njk5YWJkOWFj' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU5NTMyXzE1MzExMDcwMzk3MDBfNTc3YzJmNjktOGNkMy00NmM1LWEzYzQtZjFkOTZhMzYxMjRh' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU5NTMyXzE1MzExMTc1NTU3NDFfYmE4Nzc2ZGYtMWVmYS00MzMyLWJhZWQtY2Q2ODAzNjAyNGY0' } },
  { file: { url: 'https://nim.nosdn.127.net/MTAxMTAwMg==/bmltYV8xMDU5NTMyXzE1MzExMTc2Mjk2NzBfYWUwZDcxMzgtMjJiYy00NWE2LTg2MTItYTNlZjc4OWIxMDI4' } },
];
if (fileType !== 1) {
  fileList = [
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422319&di=9f7c41a7fe17815041cb33dc8a816a92&imgtype=0&src=http%3A%2F%2Fb.zol-img.com.cn%2Fdesk%2Fbizhi%2Fimage%2F5%2F960x600%2F141774615961.jpg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422319&di=52ff47e4cace0aa9f952a8203f73af0d&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F32%2F07%2F39P58PIC9wJ_1024.png' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422319&di=8ee28422731d2aaf55ea82ebf55f6df9&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fb2de9c82d158ccbf79d70ffa1cd8bc3eb0354182.jpg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422319&di=e2ae3410c9cd657ffbdf0be568b62aac&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201408%2F01%2F20140801224215_VNPR4.jpeg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422320&di=df67c0b3c3b2a4eda12576662d351a25&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0186e25944bcc0a8012193a3678c96.jpg%402o.jpg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422319&di=bb3b52207ee089e9fa76ba2bea2e6a51&imgtype=0&src=http%3A%2F%2Fa3.topitme.com%2Fa%2F0b%2F42%2F1161343925b5a420bao.jpg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531132003883&di=8210a28a5a5fc5070449efff7809ab07&imgtype=0&src=http%3A%2F%2Fa3.topitme.com%2F2%2F67%2F74%2F11489000958d174672o.jpg' } },
    { file: { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531127422318&di=a46fb414d40b31fabf0f5fd220e1cac1&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Fg5%2FM00%2F02%2F0C%2FChMkJ1bK2qeIE4GgAAk2vN9cRagAALJ4wFjdm4ACTbU281.jpg' } },
  ];
}

@inject('nimStore', 'msgAction', 'sessionAction')
@observer
export default class Page extends Component {
  renderItem = ((item) => {
    const msg = item.item;
    if (msg.file) {
      // console.log(msg.file.url);
      return (
        <View key={uuid()}>
          <Image key={uuid()} source={{ uri: msg.file.url }} style={{ width: 80 * RVW, height: 20 * RVW, backgroundColor: '#f0f' }} />
          <Text>{msg.file.url}</Text>
        </View>
      );
    }
    return null;
  })
  render() {
    return (
      <View style={globalStyle.container}>
        <ScrollView
          style={{ marginVertical: 20 }}
        >
          {fileList.map(item => this.renderItem({ item }))}
        </ScrollView>
      </View>
    );
  }
}
