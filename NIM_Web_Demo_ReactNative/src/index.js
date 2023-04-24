import { createStackNavigator } from 'react-navigation';

import Pages from './pages';
// import TabNavigator from './tabNavigator';

const App = createStackNavigator(
  {
    login: {
      screen: Pages.login,
    },
    register: {
      screen: Pages.register,
    },
    // home: {
    //   screen: TabNavigator,
    // },
    session: {
      screen: Pages.session,
    },
    contact: {
      screen: Pages.contact,
    },
    general: {
      screen: Pages.general,
    },
    chat: {
      screen: Pages.chat,
    },
    chatHistroy: {
      screen: Pages.chatHistroy,
    },
    sysmsg: {
      screen: Pages.sysmsg,
    },
    namecard: {
      screen: Pages.namecard,
    },
    searchUser: {
      screen: Pages.searchUser,
    },
    // 个人信息页
    myinfo: {
      screen: Pages.myinfo,
    },
    about: {
      screen: Pages.about,
    },
    test: {
      screen: Pages.test,
    },
  },
  {
    initialRouteName: 'session',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    mode: 'card',
  },
);

export default App;
