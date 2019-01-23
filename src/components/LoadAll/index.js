import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'

class LoadAll extends Component {

  render() {
    return (
      <View className='loadMoreGif'>
        <View className='text'>已加载全部数据...</View>
      </View>
    )
  }
}

export default LoadAll
