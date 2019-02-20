import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './index.scss'

import WxShare from '../../components/WxShare/index'

import * as Api from '../../store/game/service'

import Mall from '../../images/classify/mall.png'
import Pdd from '../../images/classify/pdd.png'
import Hot from '../../images/classify/hot.png'
import Diamond from '../../images/classify/diamond.png'

import * as Constant from  '../../config/index'

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
        //type: 0=本程序页面, 1=web页面, 2=小程序页面
        {title: '阅点商城', desc: '阅点可以兑换商品', icon: Mall, page: Constant.pointShopUrl + '?sid=' + Taro.getStorageSync('sid'), type: 1},
        {title: '拼多多', desc: '随时随地拼多多', icon: Pdd, page: '/pages/pdd/index', type: 0},
        {title: '段子手', desc: '段子手', icon: Hot, page: '/pages/news/index', type: 0},
        {title: '兑换钻石', desc: '阅点可以兑换游戏钻石', icon: Diamond, page: Constant.diamondShopUrl + '?sid=' + Taro.getStorageSync('sid'), type: 1},
      ],
    }
  }

  componentDidMount() {
    const {classifyItems} = this.state
    Api.gameList().then(res => {
      const {code, body} = res
      if (code == 200) {
        body.map(item => {
          let classifyItem = {
            title: item.name,
            desc: item.desc,
            icon: item.iconUrl,
            page: item.linkUrl,
            type: item.type,
          }
          classifyItems.push(classifyItem)
        })
        this.setState({
          classifyItems
        })
      }
    })
  }

  onOpenPage(page, type) {
    if (page && page.trim() !== '') {
      if (type == 0) {
        Taro.navigateTo({
          url: page
        })
      } else if (type == 1) {
        window.location = page
      } else if (type == 2) {
        //TODO
      }
    }
  }

  render() {
    const {windowHeight, classifyItems} = this.state
    const scrollContent = classifyItems.map((item, index) => {
      let isShow = true
      if (item.type == 1 && Taro.getEnv() !== Taro.ENV_TYPE.WEB) {
        isShow = false
      } else if (item.type == 2 && Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) {
        isShow = false
      }
      return <View key={index} className={isShow ? 'classify-item' : 'classify-item hidden'}
        onClick={this.onOpenPage.bind(this, item.page, item.type)}
      >
        <View className='item-icon'>
          <Image className='icon' src={item.icon} mode='scaleToFill' />
        </View>
        <View className='item-content'>
          <View className='title'>{item.title}</View>
          <View className='desc'>{item.desc}</View>
        </View>
      </View>
    })

    return (
      <View className='classify-page' style={{height: `${windowHeight}px`}}>
        {Taro.getEnv() === Taro.ENV_TYPE.WEB && <WxShare />}

        <ScrollView className='scroll-container'
          scrollY
          scrollLeft='0'
          scrollTop='0'
          scrollWithAnimation
        >
          {scrollContent}

        </ScrollView>
      </View>
    )
  }
}

export default Classify
