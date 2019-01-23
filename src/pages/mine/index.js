import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'

import './index.scss'

import authImg from '../../images/mine/authen.png'

class Mine extends Component {
  config = {
    navigationBarTitleText: '我的'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      windowHeight -= 53
    }
    this.state = {
      windowHeight: windowHeight
    }
  }


  componentWillMount() {
  }

  render() {
    const {windowHeight} = this.state
    let infoHeight = 135
    let remainHeight = windowHeight - infoHeight

    return (
      <View className='mine-page'>
        <View className='user-info' style={{height: `${infoHeight}px`}}>
          <View className='base-info'>
            <Image className='avatar' src='http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqaJBY7icGB3GAhfsIoK55xqnfy3pVXvvKcIiaDXjtR3Iq7wicE6Ftaxy8QOVEFKW34a8xInWz45ymTw/132' mode='widthFix' />
            <View className='info'>
              <View className='nickname'>依凡</View>
              {/*<Image className='auth-btn' src={authen} mode='widthFix' />*/}

              <View className='auth-btn' style={{backgroundImage: `url(${authImg})`}}>未认证</View>

            </View>

          </View>



        </View>
        <View className='data-column' style={{height: `${remainHeight}px`}}>



        </View>


      </View>
    )
  }
}

export default Mine
