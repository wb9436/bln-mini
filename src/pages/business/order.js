import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './order.scss'

import * as Api from '../../store/business/service'

class BusinessOrder extends Component {
  config = {
    navigationBarTitleText: '我的推广'
  }

  render() {
    return (
      <View className='business-act-page'>
      </View>
    )
  }
}

export default BusinessOrder
