import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'


class HelpCenter extends Component {
  config = {
    navigationBarTitleText: '帮助中心'
  }

  constructor() {
    super(...arguments)
    this.state = {

    }
  }

  componentWillMount() {

  }


  render() {
    return (
      <View className='help-page'>

      </View>
    )
  }
}

export default HelpCenter
