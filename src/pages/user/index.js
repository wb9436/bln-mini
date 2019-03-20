import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

class UserInfo extends Component {
  config = {
    navigationBarTitleText: '我的资料'
  }

  render() {
    return (
      <View className='user-page'>
        <ScrollView className='scroll-container' scrollY scrollWithAnimation >



        </ScrollView>
      </View>
    )
  }
}

export default UserInfo
