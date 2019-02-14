import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

import Mall from '../../images/classify/mall.png'
import Pdd from '../../images/classify/pdd.png'
import Hot from '../../images/classify/hot.png'
import Diamond from '../../images/classify/diamond.png'

class Classify extends Component {
  config = {
    navigationBarTitleText: '发现'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      windowHeight -= 53
    }
    this.state = {
      windowHeight: windowHeight,
      classifyItems: [
        {title: '阅点商城', desc: '阅点可以兑换商品', icon: Mall, page: '', onlyWeb: true},
        {title: '拼多多', desc: '随时随地拼多多', icon: Pdd, page: '', onlyWeb: false},
        {title: '段子手', desc: '段子手', icon: Hot, page: '', onlyWeb: false},
        {title: '兑换钻石', desc: '阅点可以兑换游戏钻石', icon: Diamond, page: '', onlyWeb: true},
      ],
    }
  }

  render() {
    return (
      <ScrollView className='classify-page'>



      </ScrollView>
    )
  }
}

export default Classify
