import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class LoadAll extends Component {
  static propTypes = {
    loadAll: PropTypes.bool,
  }
  static defaultProps = {
    loadAll: false,
  }

  render() {
    const {loadAll} = this.props

    return (
      <View className='loadAll-page'>
        {loadAll ?
          <View className='loadMoreGif'>
            <View className='text'>已加载全部数据...</View>
          </View> : ''
        }
      </View>
    )
  }
}

export default LoadAll
