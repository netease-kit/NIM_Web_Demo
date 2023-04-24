import { observable, action, set } from 'mobx';
import { Alert } from 'react-native';
import constObj from '../constant';
import nimStore from '../stores/nim';
import util from '../../util';
import uuid from '../../util/uuid';

class Actions {
  @observable nimStore

  generateFakeMsg = (options = {}) => {
    const {
      scene, to, type, pendingUrl,
    } = options;
    const msg = {
      sessionId: `${scene}-${to}`,
      scene,
      from: nimStore.userID,
      to,
      flow: 'out',
      type,
      file: {
        pendingUrl,
        w: options.width,
        h: options.height,
      },
      idClientFake: uuid(),
      status: 'sending',
      time: (new Date()).getTime(),
    };
    return msg;
  }


  @action
  appendSessionMsg = (msg) => {
    const { sessionId } = msg;
    const tempMsgs = [];
    // if (nimStore.msgsMap[sessionId]) {
    //   nimStore.msgsMap[sessionId].push(msg);
    // }
    if (sessionId === nimStore.currentSessionId) {
      const msgLen = nimStore.currentSessionMsgs.length;
      if (msgLen > 0) {
        const lastMsgTime = nimStore.currentSessionMsgs[msgLen - 1].time;
        if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
          tempMsgs.push({
            type: 'timeTag',
            text: util.formatDate(msg.time, false),
            key: uuid(),
          });
        }
      } else {
        tempMsgs.push({
          type: 'timeTag',
          text: util.formatDate(msg.time, false),
          key: uuid(),
        });
      }
      tempMsgs.push(msg);
      nimStore.currentSessionMsgs = nimStore.currentSessionMsgs.concat(tempMsgs);
    }
  }

  // 替换消息列表消息，如消息撤回
  @action replaceSessionMsg = (obj) => {
    const {
      sessionId, idClient, idClientFake, msg,
    } = obj;
    if (sessionId === nimStore.currentSessionId) {
      const tempMsgs = nimStore.currentSessionMsgs || [];
      if (tempMsgs.length > 0) {
        const lastMsgIndex = tempMsgs.length - 1;
        for (let i = lastMsgIndex; i >= 0; i -= 1) {
          const currMsg = tempMsgs[i];
          if (idClientFake && idClientFake === currMsg.idClientFake) {
            tempMsgs.splice(i, 1, msg);
            break;
          } else if (idClient && idClient === currMsg.idClient) {
            tempMsgs.splice(i, 1, msg);
            break;
          }
        }
        nimStore.currentSessionMsgs = util.simpleClone(tempMsgs);
      }
    }
  }

  @action
  updateSessionMsg = (msg) => {
    const { sessionId, idClient, idClientFake } = msg;
    if (sessionId === nimStore.currentSessionId) {
      const msgLen = nimStore.currentSessionMsgs.length;
      if (msgLen > 0) {
        for (let i = msgLen - 1; i >= 0; i -= 1) {
          if (idClientFake) {
            if (nimStore.currentSessionMsgs[i].idClientFake === idClientFake) {
              set(nimStore.currentSessionMsgs[i], msg);
              nimStore.currentSessionMsgs = nimStore.currentSessionMsgs.concat([]);
              break;
            }
          } else if (idClient) {
            if (nimStore.currentSessionMsgs[i].idClient === idClient) {
              set(nimStore.currentSessionMsgs[i], msg);
              nimStore.currentSessionMsgs = nimStore.currentSessionMsgs.concat([]);
              break;
            }
          }
        }
      }
    }
  }

  @action
  resendTextMsg = (options) => {
    console.log('准备重发消息：', options);
    if (constObj.nim) {
      constObj.nim.resendMsg({
        msg: options,
        done: (error, newMsg, data) => {
          console.log('重发消息回调：', error, newMsg, data);
          if (error) {
            Alert.alert('提示', error.message, [
              { text: '确认' },
            ]);
            newMsg.status = 'fail';
          }
          this.replaceSessionMsg({
            sessionId: newMsg.sessionId,
            idClient: newMsg.idClient,
            msg: newMsg,
          });
        },
      });
    }
  };

  @action
  sendTextMsg = (options) => {
    if (constObj.nim) {
      const {
        scene, to, text,
      } = options;
      const msg = constObj.nim.sendText({
        scene,
        to,
        text,
        done: (error, newMsg) => {
          if (error) {
            Alert.alert('提示', error.message, [
              { text: '确认' },
            ]);
            newMsg.status = 'fail';
          }
          this.replaceSessionMsg({
            sessionId: newMsg.sessionId,
            idClient: newMsg.idClient,
            msg: newMsg,
          });
        },
      });
      this.appendSessionMsg(msg);
    }
  };

  @action
  sendCustomMsg = (options) => {
    if (constObj.nim) {
      const { scene, to, content } = options;
      const msg = constObj.nim.sendCustomMsg({
        scene,
        to,
        content: JSON.stringify(content),
        done: (error, newMsg) => {
          if (error) {
            Alert.alert('提示', error.message, [
              { text: '确认' },
            ]);
            newMsg.status = 'fail';
          }
          this.replaceSessionMsg({
            sessionId: newMsg.sessionId,
            idClient: newMsg.idClient,
            msg: newMsg,
          });
        },
      });
      this.appendSessionMsg(msg);
    }
  };

  @action
  sendImageMsg = (options) => {
    if (constObj.nim) {
      // 本地的图片先显示了，并转菊花
      options.type = 'image';
      const prevMsg = this.generateFakeMsg(options);
      this.appendSessionMsg(prevMsg);
      if (options.callback instanceof Function) {
        options.callback();
      }
      constObj.nim.previewFile({
        type: 'image',
        filePath: options.filePath,
        uploadprogress(obj) {
          console.log(`文件总大小: ${obj.total}bytes`);
          console.log(`已经上传的大小: ${obj.loaded}bytes`);
          console.log(`上传进度: ${obj.percentage}`);
          console.log(`上传进度文本: ${obj.percentageText}`);
        },
        done: (error, { name, url, ext }) => {
          const file = {
            name,
            url,
            w: options.width,
            h: options.height,
            md5: options.md5,
            size: options.size,
            ext,
          };
          const { scene, to } = options;
          if (!error) {
            const msg = constObj.nim.sendFile({
              type: 'image',
              scene,
              to,
              file,
              done: (err, newMsg) => {
                if (err) {
                  newMsg.status = 'fail';
                }
                // newMsg.file.pendingUrl = prevMsg.file.pendingUrl;
                this.replaceSessionMsg({
                  sessionId: newMsg.sessionId,
                  idClient: newMsg.idClient,
                  msg: newMsg,
                });
              },
            });
            // 替换本地假消息
            const tempMsg = util.simpleClone(msg);
            // tempMsg.file.pendingUrl = prevMsg.file.pendingUrl;
            this.replaceSessionMsg({
              sessionId: msg.sessionId,
              // idClient: msg.idClient,
              idClientFake: prevMsg.idClientFake,
              msg: tempMsg,
            });
            if (options.callback instanceof Function) {
              options.callback();
            }
          }
        },
      });
    }
  };

  @action
  sendAudioMsg = (options) => {
    if (constObj.nim) {
      constObj.nim.previewFile({
        type: 'audio',
        filePath: options.filePath,
        uploadprogress(obj) {
          console.log(`文件总大小: ${obj.total}bytes`);
          console.log(`已经上传的大小: ${obj.loaded}bytes`);
          console.log(`上传进度: ${obj.percentage}`);
          console.log(`上传进度文本: ${obj.percentageText}`);
        },
        done: (error, { name, url, ext }) => {
          const file = {
            name,
            url,
            dur: options.dur,
            md5: options.md5,
            size: options.size,
            ext,
          };
          const { scene, to } = options;
          if (!error) {
            const msg = constObj.nim.sendFile({
              type: 'audio',
              scene,
              to,
              file,
              done: (err, newMsg) => {
                if (err) {
                  newMsg.status = 'fail';
                }
                // newMsg.file.pendingUrl = prevMsg.file.pendingUrl;
                this.replaceSessionMsg({
                  sessionId: newMsg.sessionId,
                  idClient: newMsg.idClient,
                  msg: newMsg,
                });
              },
            });
            this.appendSessionMsg(msg);
            if (options.callback instanceof Function) {
              options.callback();
            }
          }
        },
      });
    }
  };

  @action sendMsgReceipt = (options = {}) => {
    const { msg } = options;
    constObj.nim.sendMsgReceipt({
      msg,
      done: function sendMsgReceiptDone(error) {
        if (error) {
          Alert.alert('提示', error.message, [
            { text: '确认' },
          ]);
        }
      },
    });
  }

  @action onBackoutMsg = (error, msg) => {
    // console.log(msg.to, msg.sessionId);
    if (error) {
      console.log(error);
      return;
    }
    let tip = '';
    let toAccount = '';
    if (msg.from === nimStore.userID) {
      tip = '你撤回了一条消息';
      toAccount = msg.to;
    } else {
      const userInfo = nimStore.userInfos[msg.from];
      if (userInfo) {
        tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`;
      } else {
        tip = '对方撤回了一条消息';
      }
      toAccount = msg.from;
    }
    constObj.nim.sendTipMsg({
      isLocal: true,
      scene: msg.scene,
      to: msg.target,
      tip,
      time: msg.time,
      done: (tipErr, tipMsg) => {
        if (tipErr) {
          console.log(tipErr);
          return;
        }
        const idClient = msg.deletedIdClient || msg.idClient;
        const { sessionId } = msg;
        this.replaceSessionMsg({
          sessionId,
          idClient,
          msg: tipMsg,
        });
      },
    });
  };

  @action backoutMsg = (msg) => {
    constObj.nim.deleteMsg({
      msg,
      done: (error) => {
        // Alert.alert('提示', '撤回一条消息', [
        //   { text: '确认' },
        // ]);
        this.onBackoutMsg(error, msg);
      },
    });
  }

  @action getLocalMsgs =(sessionId, options = {}) => {
    const { reset, end, done } = options;
    constObj.nim.getLocalMsgs({
      sessionId,
      limit: 10,
      end,
      desc: true,
      done: (err, obj) => {
        if (!err) {
          const tempMsgs = [];
          if (sessionId === nimStore.currentSessionId) {
            let lastMsgTime = 0;
            obj.msgs = obj.msgs.sort((a, b) => a.time - b.time);
            obj.msgs.forEach((msg) => {
              if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                lastMsgTime = msg.time;
                tempMsgs.push({
                  type: 'timeTag',
                  text: util.formatDate(msg.time, false),
                  key: uuid(),
                });
              }
              tempMsgs.push(msg);
            });
            if (!reset) {
              nimStore.currentSessionMsgs.forEach((item) => {
                tempMsgs.push(item);
              });
            }
            nimStore.currentSessionMsgs = tempMsgs;
          }
        }
        if (done instanceof Function) {
          done();
        }
      },
    });
  }

  @action
  deleteLocalMsgs = (options) => {
    const { scene, to } = options;
    constObj.nim.deleteLocalMsgsBySession({
      scene,
      to,
      done: (error) => {
        nimStore.currentSessionMsgs = [];
        if (options.done instanceof Function) {
          options.done(error);
        }
      },
    });
  }
  @action
  getHistoryMsgs = ({
    scene, to, endTime, done,
  }) => {
    constObj.nim.getHistoryMsgs({
      scene,
      to,
      endTime,
      reverse: false,
      asc: true,
      limit: 10,
      done(error, obj) {
        if (error) {
          Alert.alert('提示', error.message, [
            { text: '确认' },
          ]);
          return;
        }
        if (done instanceof Function) {
          done(obj.msgs);
        }
      },
    });
  }

  @action
  clearSysMsgs = () => {
    nimStore.sysMsgs = [];
  }
}

export default new Actions();
