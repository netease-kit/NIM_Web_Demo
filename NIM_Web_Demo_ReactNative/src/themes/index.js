import { RVW, RFT, RPX } from '../common';

export const baseBlueColor = '#0091e4';
export const lightBlueColor = '#a5d8ff';
export const baseRedColor = '#f04d64';

export const globalStyle = {
  container: {
    flex: 1,
    paddingVertical: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  avatarWrapper: {
    width: (9 * RVW) + 1,
    height: (9 * RVW) + 1,
    borderRadius: (9 * RVW) / 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: 9 * RVW,
    height: 9 * RVW,
    borderRadius: (9 * RVW) / 2,
  },
  listItemRight: {
    width: 60 * RVW,
    textAlign: 'right',
  },
};

export const headerStyle = {
  tabBar: {
    height: 12 * RVW,
    backgroundColor: '#fff',
  },
  tabLabel: {
    lineHeight: 9 * RVW,
    fontSize: 3.6 * RFT,
  },
  wrapper: {
    paddingVertical: 0,
    minHeight: Math.round(14 * RVW),
    backgroundColor: baseBlueColor,
    borderBottomWidth: 0,
  },
  center: {
    color: '#fff',
    fontSize: 5 * RFT,
  },
  icon: {
    fontSize: 8 * RFT,
    width: 10 * RFT,
    height: 10 * RFT,
    lineHeight: 10 * RFT,
    textAlign: 'center',
  },
  iconSlim: {
    fontSize: 6 * RFT,
  },
  buttonGroup: {
    top: 2 * RVW,
    width: 30 * RVW,
    height: 8 * RVW,
    borderRadius: 6,
  },
};

export const contactStyle = {
  item: {
    height: 60,
    textAlignVertical: 'center',
    backgroundColor: '#ffffff',
    color: '#5C5C5C',
    fontSize: 15,
  },
  section: {
    height: 20,
    paddingLeft: 10,
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: '#bcbec1',
    color: 'white',
    fontSize: 14,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#bcbec1',
  },
  menuBox: {
    position: 'absolute',
    right: 0,
    top: 14 * RVW,
    width: 40 * RVW,
    backgroundColor: '#fff',
    borderLeftWidth: 2 * RPX,
    borderLeftColor: '#999',
  },
  menuLine: {
    fontSize: 3.6 * RFT,
    textAlign: 'center',
    borderBottomWidth: 2 * RPX,
    borderBottomColor: '#999',
    lineHeight: 10 * RFT,
  },
};

export const actionBarStyle = {
  titleText: {
    color: '#111111',
    fontSize: 16,
    textAlign: 'center',
  },
};

export const chatStyle = {
  chatBoxWrapper: {
    margin: 0,
    padding: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  chatBox: {
    flexDirection: 'row',
    margin: 0,
    padding: 10,
  },
  chatText: {
    padding: 0,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 4.5 * RFT,
    width: 64 * RVW,
    height: 9 * RFT,
  },
  chatBtn: {
    padding: 0,
    width: 84 * RVW,
    height: 9 * RFT,
    shadowOpacity: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  chatBtnText: {
    textAlign: 'center',
    lineHeight: 9 * RFT,
    fontSize: 3 * RFT,
  },
  chatItemWraper: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#999',
    paddingVertical: 20,
  },
  chatItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chatItem: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 12 * RVW,
    height: 12 * RVW,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 2 * RVW,
  },
  iconSmall: {
    width: 10 * RFT,
    height: 10 * RFT,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    padding: 10,
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  center: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginTop: 2 * RVW,
    marginRight: 10,
    width: 5 * RFT,
    height: 5 * RFT,
  },
  content: {
    padding: 10,
    borderRadius: 6,
    flexWrap: 'wrap',
    maxWidth: 60 * RVW,
  },
  contentLeft: {
    marginLeft: 10,
    backgroundColor: lightBlueColor,
  },
  contentRight: {
    marginRight: 10,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 3.2 * RFT,
  },
  emoji: {
    width: 16 * RFT,
    height: 16 * RFT,
  },
  play: {
    width: 10 * RFT,
    height: 10 * RFT,
  },
  timetag: {
    padding: 4,
    // backgroundColor: '#f9f9ff',
    color: '#679',
    textAlign: 'center',
    maxWidth: 80 * RVW,
    marginLeft: 10 * RVW,
    marginVertical: 10,
    borderRadius: 4,
  },
  tip: {
    padding: 4,
    backgroundColor: '#f9f9ff',
    textAlign: 'center',
    maxWidth: 40 * RVW,
    marginLeft: 30 * RVW,
    marginVertical: 10,
    borderRadius: 4,
  },
};

export const emojiStyle = {
  album: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 10 * RVW,
    height: 10 * RVW,
    borderWidth: 2 * RPX,
    borderColor: '#ccc',
    borderLeftWidth: 0,
  },
  emojiWrapper: {
    height: 50 * RVW,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emoji: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 10 * RVW,
    height: 10 * RVW,
    borderWidth: 1 * RPX,
    borderColor: '#ccc',
    borderLeftWidth: 0,
  },
  pinup: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 12.5 * RVW,
    height: 12.5 * RVW,
    borderWidth: 1 * RPX,
    borderColor: '#ccc',
    borderLeftWidth: 0,
  },

};

