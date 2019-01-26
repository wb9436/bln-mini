import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/profit/service'
import cardImg from '../../images/auth/auth-card.png'

class IdAuth extends Component {
  config = {
    navigationBarTitleText: '实名认证'
  }
  constructor() {
    super(...arguments)
    this.state = {

    }
  }

  onInputHandler(type, e) {
    console.log(type, e)
  }

  componentDidMount() {

  }


  render() {
    return (
      <View className='auth-page'>

        <View className='auth-item'>
          <View className='auth-name'>真实姓名：</View>
          <Input className='input-box'
            placeholderClass='placeholder'
            maxLength={18}
            onInput={this.onInputHandler.bind(this, 'name')}
          />
        </View>

        <View className='auth-item'>
          <View className='auth-name'>身份证号：</View>
          <Input className='input-box'
            placeholderClass='placeholder'
            maxLength={18}
            onInput={this.onInputHandler.bind(this, 'cardId')}
          />
        </View>

        <View className='auth-img'>
          <View className='auth-desc'>手持身份证照</View>
          <Image className='auth-card' src={cardImg} mode='widthFix' />
        </View>

        <View className='auth-submit'>提交</View>

      </View>
    )
  }
}

export default IdAuth
