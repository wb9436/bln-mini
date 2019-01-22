import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'

import './index.scss'

class Mine extends Component {
  config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() {
  }

  onLogoutHandler() {
    Taro.showModal({
      content: '确定退出登录吗？',
      confirmColor: '#EE735D',
    }).then(res => {
      if (res.confirm) {
        Taro.removeStorageSync('sid')
        Taro.removeStorageSync('user')
        Taro.removeStorageSync('userId')
        Taro.removeStorageSync('address')

        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  }

  render() {
    return (
      <View className='index'>

        <Button onClick={this.onLogoutHandler.bind(this)}>退出登录</Button>

      </View>
    )
  }
}

export default Mine
