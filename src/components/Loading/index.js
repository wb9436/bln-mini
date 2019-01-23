import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'

class Loading extends Component {

  render() {
    return (
      <View className='loadMoreGif'>
        <View className='zan-loading'></View>
        <View className='text'>加载中...</View>
      </View>
    )
  }
}

export default Loading
