import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './info.scss'

class BusinessInfo extends Component {
  config = {
    navigationBarTitleText: '基本信息'
  }

  render() {
    return (
      <View>
        BusinessInfo
      </View>
    )
  }
}

export default BusinessInfo
