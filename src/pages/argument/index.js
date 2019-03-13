import Taro, {Component} from '@tarojs/taro'
import {View, RichText} from '@tarojs/components'
import './index.scss'

import {argument} from './argument'

class ServiceArgument extends Component {
  config = {
    navigationBarTitleText: '用户服务协议'
  }

  render() {
    return (
      <View className='argument-page'>
        <RichText nodes={argument} />
      </View>
    )
  }
}

export default ServiceArgument
