import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import 'taro-ui/dist/style/components/action-sheet.scss'
import 'taro-ui/dist/style/components/swipe-action.scss'
import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/calendar.scss'
import Index from './pages/index'
import './styles/base.scss'

//配置store
import store from './store/index'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

import IndexIcon from './images/tab/index.png'
import IndexSelectIcon from './images/tab/index_select.png'
import CityIcon from './images/tab/city.png'
import CitySelectIcon from './images/tab/city_select.png'
import ClassifyIcon from './images/tab/classify.png'
import ClassifySelectIcon from './images/tab/classify_select.png'
import MineIcon from './images/tab/mine.png'
import MineSelectIcon from './images/tab/mine_select.png'

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/home/index',
      'pages/city/index',
      'pages/classify/index',
      'pages/mine/index',
      'pages/login/index',
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
      'pages/activityDetail/detail',
      'pages/news/index',
      'pages/pdd/index',
      'pages/pdd/search',
      'pages/pddDetail/index',
      'pages/pddDetail/buy',
      'pages/topic/add',
      'pages/topic/detail',
      'pages/topic/share',
      'pages/topic/reply',
      'pages/myTopic/index',
      'pages/friend/index',
      'pages/help/index',
      'pages/help/web',
      'pages/business/index',
      'pages/business/info',
      'pages/business/advert',
      'pages/business/advertApply',
      'pages/business/payCode',
      'pages/business/order',
      'pages/wxBind/webIndex',
      'pages/wxBind/miniIndex',
      'pages/wxBind/mobileIndex',
      'pages/argument/index',
      'pages/web/index',
      'pages/promoter/index',
      'pages/promoter/info',
      'pages/promoter/day',
      'pages/promoter/month',
      'pages/redBag/index',
      'pages/user/index',
    ],
    tabBar: {
      "custom": false,
      "color": "#929292",
      "selectedColor": "#EE735D",
      "backgroundColor": "#ffffff",
      "borderStyle": "black",
      "list": [
        {
          "pagePath": "pages/home/index",
          "iconPath": process.env.TARO_ENV === 'h5' ? IndexIcon : "images/tab/index.png",
          "selectedIconPath": process.env.TARO_ENV === 'h5' ? IndexSelectIcon : "images/tab/index_select.png",
          "text": "首页"
        },
        {
          "pagePath": "pages/city/index",
          "iconPath": process.env.TARO_ENV === 'h5' ? CityIcon : "images/tab/city.png",
          "selectedIconPath": process.env.TARO_ENV === 'h5' ? CitySelectIcon : "images/tab/city_select.png",
          "text": "同城"
        },
        {
          "pagePath": "pages/classify/index",
          "iconPath": process.env.TARO_ENV === 'h5' ? ClassifyIcon : "images/tab/classify.png",
          "selectedIconPath": process.env.TARO_ENV === 'h5' ? ClassifySelectIcon : "images/tab/classify_select.png",
          "text": "发现"
        },
        {
          "pagePath": "pages/mine/index",
          "iconPath": process.env.TARO_ENV === 'h5' ? MineIcon : "images/tab/mine.png",
          "selectedIconPath": process.env.TARO_ENV === 'h5' ? MineSelectIcon : "images/tab/mine_select.png",
          "text": "我的"
        }
      ]
    },
    usingComponents: {},
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
      const {inviter, marketId} = this.$router.params
      if (inviter && inviter.toString().trim() !== '') {
        Taro.setStorageSync('inviter', inviter)
      }
      if (marketId && marketId.toString().trim() !== '') {
        Taro.setStorageSync('marketId', marketId)
      }
    } catch (e) {
      console.log(e)
    }

    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              confirmColor: '#EE735D',
              success: function (result) {
                if (result.confirm) {
                  updateManager.applyUpdate() //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            Taro.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
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
