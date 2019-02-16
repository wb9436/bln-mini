import Taro, {Component} from '@tarojs/taro'
import {View, Swiper, SwiperItem, Image} from '@tarojs/components'
import './index.scss'

import p1 from '../../images/guide/p1.png'
import p2 from '../../images/guide/p2.png'
import p3 from '../../images/guide/p3.png'

class Index extends Component {
  config = {
    navigationBarTitleText: '百灵鸟'
  }

  constructor() {
    super(...arguments)
    this.state = {
      remain: 3, //剩余
      skip: false //点击跳过
    }
  }

  componentWillMount() {
    this.skipTimerID = setInterval(
      () => this.onUpdateRemain(),
      2000
    )
  }

  componentWillUnmount() {
    clearInterval(this.skipTimerID)
  }

  onUpdateRemain() {
    let remain = this.state.remain
    if (remain > 0) {
      remain -= 1
      this.setState({
        remain: remain
      })
      if (remain == 0) {
        clearInterval(this.skipTimerID)
        this.onCheckLogin()
      }
    }
  }

  onSkip() {
    const {skip} = this.state
    if (!skip) {
      this.setState({
        skip: true
      })
      clearInterval(this.skipTimerID)
      this.onCheckLogin()
    }
  }

  onCheckLogin() {
    let sid = Taro.getStorageSync('sid')
    if (!sid) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    } else {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        Taro.reLaunch({
          url: '/pages/home/index'
        })
      } else {
        Taro.redirectTo({
          url: '/pages/home/index'
        })
      }
    }
  }

  render() {
    const {remain} = this.state

    return (
      <View className='index-page'>
        <Swiper className='guide-swiper' autoplay circular interval={2000}
          duration={1000}
        >
          <SwiperItem className='guide-swiper-item'>
            <Image className='guide-image' src={p1} mode='widthFix' />
          </SwiperItem>
          <SwiperItem>
            <Image className='guide-image' src={p2} mode='widthFix' />
          </SwiperItem>
          <SwiperItem>
            <Image className='guide-image' src={p3} mode='widthFix' />
          </SwiperItem>
        </Swiper>

        <View className='skip-btn' onClick={this.onSkip.bind(this)}>
          {`跳过 ${remain}`}
        </View>

      </View>
    )
  }
}

export default Index
