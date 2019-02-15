import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import './styles/base.scss'

//配置store
import store from './store/index'


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
  require('nerv-devtools')
}

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/home/index',
      'pages/city/index',
      'pages/classify/index',
      'pages/mine/index',
      'pages/login/index',
      'pages/forget/index',
      'pages/register/index',
      'pages/address/index',
      'pages/setup/index',
      'pages/wallet/index',
      'pages/account/index',
      'pages/profit/day',
      'pages/profit/task',
      'pages/profit/pdd',
      'pages/cash/index',
      'pages/task/index',
      'pages/message/index',
      'pages/auth/index',
      'pages/rank/index',
      'pages/activityDetail/index',
      'pages/activityDetail/task',
      'pages/news/index',
      'pages/pdd/index',
    ],
    tabBar: {
      "color": "#929292",
      "selectedColor": "#EE735D",
      "backgroundColor": "#ffffff",
      "borderStyle": "#000",
      "list": [
        {
          "pagePath": "pages/home/index",
          "iconPath": "images/tab/index.png",
          "selectedIconPath": "images/tab/index_select.png",
          "text": "首页"
        },
        {
          "pagePath": "pages/city/index",
          "iconPath": "images/tab/city.png",
          "selectedIconPath": "images/tab/city_select.png",
          "text": "同城"
        },
        {
          "pagePath": "pages/classify/index",
          "iconPath": "images/tab/classify.png",
          "selectedIconPath": "images/tab/classify_select.png",
          "text": "发现"
        },
        {
          "pagePath": "pages/mine/index",
          "iconPath": "images/tab/mine.png",
          "selectedIconPath": "images/tab/mine_select.png",
          "text": "我的"
        }
      ]
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '百灵鸟',
      navigationBarTextStyle: 'black'
    },
    navigateToMiniProgramAppIdList: [
      'wx32540bd863b27570',
    ]
  }

  componentDidMount() {
    try {
      const {inviter} = this.$router.params
      if (inviter) {
        console.log(`inviter: ${this.$router}`)
        Taro.setStorageSync('inviter', inviter)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
