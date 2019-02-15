import Taro, {Component} from '@tarojs/taro'
import {Button, Image, ScrollView, Swiper, SwiperItem, Text, View} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'

import * as Utils from '../../utils/utils'

@connect(({pddDetail}) => ({
  ...pddDetail,
}))
class PddBuy extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      click: false,
    }
  }

  componentDidMount() {
    const {inviter, goodsId} = this.$router.params
    this.props.dispatch({
      type: 'pddDetail/detailSearch',
      payload: {
        userId: inviter,
        goodsId: goodsId
      }
    })
    this.props.dispatch({
      type: 'pddDetail/initPromotionData',
      payload: {
        userId: inviter,
        goodsId: goodsId
      }
    })
  }

  onShareAppMessage () {
    const {userId, goodsId, goodsName, thumbnailUrl} = this.props
    return {
      title: goodsName,
      imageUrl: thumbnailUrl,
      desc: '我在百灵鸟发现一个不错的商品，点开看看',
      path: '/pages/pddDetail/buy?inviter=' + userId + '&goodsId=' + goodsId
    }
  }

  onWeAppBuyGoods() {
    const {promotionData} = this.props
    if (promotionData && promotionData.weappInfo) {
      Taro.navigateToMiniProgram({
        appId: promotionData.weappInfo.appid,
        path: promotionData.weappInfo.pagePath,
        envVersion: 'release',
      })
    } else {
      Taro.showToast({
        icon: 'none',
        title: '数据加载异常，请重新打开',
      })
    }
  }

  onGuideBtnClick() {
    const {click} = this.state
    this.setState({
      click: !click
    })
  }

  onGoHome() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
  }

  render() {
    let windowHeight = Utils.windowHeight(false)
    let btnHeight = 60
    let goodsHeight = windowHeight - btnHeight

    const {click} = this.state
    const {goodsName, galleryUrls, groupPrice, couponDiscount, couponRemainQuantity,
      groupPromotePrice, soldQuantity, buyUrl} = this.props

    const bannerContent = galleryUrls.map((item, index) => {
      return <SwiperItem key={index}>
        <Image className='goods-banner' src={item} mode='widthFix'></Image>
      </SwiperItem>
    })

    return (
      <View className='pdd-detail-page'>

        <View className='goods-content' style={{height: `${goodsHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
            <Swiper className='goods-banner-swiper'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
            >
              {bannerContent}
            </Swiper>

            <View className='goods-discount'>
              <View className='discount-title'>券后价</View>
              <View className='discount-receive'>赚 | ¥{Utils.formatPrice(groupPromotePrice)}元</View>
            </View>

            <View className='goods-discount'>
              <View>
                ¥<Text className='present-price'>{Utils.formatPrice(groupPrice - couponDiscount)}</Text>
                <Text className='original-price' style=''>¥{Utils.formatPrice(groupPrice)}</Text>
              </View>
              <View className='goods-sales'>销量: {soldQuantity}</View>
            </View>

            <View className='goods-desc'>
              {goodsName}
            </View>

            <View className='goods-coupon-data'>
              <View className='coupon-name'>券</View>
              <Text className='coupon-price'>{Utils.formatPrice(couponDiscount)}元</Text>
              <Text className='coupon-remain'>券剩余: {couponRemainQuantity}</Text>
            </View>

            <View className='task-content'>
              <View className='task-title'>任务说明：</View>
              <View className='task-desc'>
                <View>1.本商品由拼多多合作伙伴百灵鸟精心为您挑选。</View>
                <View>2.好友每购买一单您就可获得一笔佣金提成，上不封顶！</View>
                <View>3.好友确认收货后15天内无退货即可获得佣金。</View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View className='guide-container pdd-guide'>
          <View className='guide-btn' onClick={this.onGuideBtnClick.bind(this)}>
            <AtIcon value={click ? 'chevron-right' : 'chevron-left'} size='15' />
            <View className='btn-name'>{click ? '收起' : '快速导航'}</View>
          </View>

          {click ?
            <View className='guide-content'>
              <View className='guide-home' onClick={this.onGoHome}>
                <AtIcon value='home' size='20' color='#FFF' />
                <View>首页</View>
              </View>
            </View> : ''
          }
        </View>

        <View className='goods-btn'>
          <Button className='btn-buy-now' onClick={this.onWeAppBuyGoods.bind(this, buyUrl)}>
            <View className='btn-name'>
              立即购买
            </View>
            <View className='btn-desc'>
              省{Utils.formatPrice(couponDiscount + groupPromotePrice)}元（券+佣金）
            </View>
          </Button>
        </View>
      </View>
    )
  }
}

export default PddBuy
