import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class Loading extends Component {
  static propTypes = {
    loading: PropTypes.bool,
  }
  static defaultProps = {
    loading: false,
  }

  render() {
    const {loading} = this.props

    return (
      <View className='loading-page'>
        {loading ?
          <View className='loadMoreGif'>
            <View className='zan-loading'></View>
            <View className='text'>加载中...</View>
          </View> : ''
        }
      </View>
    )
  }
}

export default Loading
