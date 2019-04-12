import Taro, {Component} from '@tarojs/taro'
import {View, RichText} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class RichView extends Component {
  static defaultProps = {
    nodes: '',
  }
  static propTypes = {
    nodes: PropTypes.string,
  }

  render() {
    const {nodes} = this.props
    return (
      <View className='rich-content'>
        <RichText nodes={nodes} />
      </View>
    )
  }
}

export default RichView
