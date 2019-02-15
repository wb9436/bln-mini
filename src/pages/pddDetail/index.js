import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Swiper, SwiperItem, Image, ScrollView} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import WxShare from '../../components/WxShare/index'
import * as Utils from '../../utils/utils'

@connect(({pddDetail}) => ({
  ...pddDetail,
}))
class PddDetail extends Component {
  static options = {
    addGlobalClass: true
  }
  config = {
    navigationBarTitleText: '商品详情'
  }

  componentDidMount() {
    let userId = Taro.getStorageSync('userId')
    const {goodsId} = this.$router.params
    this.props.dispatch({
      type: 'pddDetail/detailSearch',
      payload: {
        userId: userId,
        goodsId: goodsId
      }
    })
    if(process.env.TARO_ENV === 'weapp') {
      this.props.dispatch({
        type: 'pddDetail/initPromotionData',
        payload: {
          userId: userId,
          goodsId: goodsId
        }
      })
    }
  }

  onWebBuyGoods(buyUrl) {
    window.location.href = buyUrl
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

  onShareAppMessage() {
    const {userId, goodsId, goodsName, thumbnailUrl} = this.props
    return {
      title: goodsName,
      imageUrl: thumbnailUrl,
      desc: '我在百灵鸟发现一个不错的商品，点开看看',
      path: '/pages/pddBuy/index?inviter=' + userId + '&goodsId=' + goodsId
    }
  }

  render() {
    let height = Utils.windowHeight(false)
    height -= 60

    const {goodsName, galleryUrls, groupPrice, couponDiscount, couponRemainQuantity,
      groupPromotePrice, soldQuantity, buyUrl, thumbnailUrl} = this.props

    const bannerContent = galleryUrls.map((item, index) => {
      return <SwiperItem key={index}>
        <Image src={item} className='swiper__item' mode='widthFix'></Image>
      </SwiperItem>
    })

    return (
      <View className='detail-container'>
        {/*微信分享*/}
        {process.env.TARO_ENV === 'h5' ? <WxShare link={buyUrl} desc={goodsName} imgUrl={thumbnailUrl} /> : ''}

        <ScrollView className='goods-detail'
          style={{height: `${height}px`}}
          scrollY
          scrollWithAnimation
        >
          <Swiper
            className='detail_wrapper'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay
          >
            {bannerContent}
          </Swiper>

          <View className='goods-data'>
            <View className='goods-price'>
              <View className='price1'>
                <View className='title'>券后价</View>
                <View className='data'>赚 | ¥{Utils.formatPrice(groupPromotePrice)}元</View>
              </View>
              <View className='price1'>
                <View>
                  ¥<Text className='present-price'>{Utils.formatPrice(groupPrice - couponDiscount)}</Text>
                  <Text className='original-price' style=''>¥{Utils.formatPrice(groupPrice)}</Text>
                </View>
                <View className='sales'>销量: {soldQuantity}</View>
              </View>
            </View>
            <View className='goods-desc'>
              {goodsName}
            </View>
            <View className='goods-sales'>
              <View className='name'>券</View>
              <Text className='price'>{Utils.formatPrice(couponDiscount)}元</Text>
              <Text className='remain'>券剩余: {couponRemainQuantity}</Text>
            </View>
          </View>

          <View className='task-desc'>
            <View className='desc-title'>任务说明：</View>
            <View className='desc-content'>
              <View>1.本商品由拼多多合作伙伴百灵鸟精心为您挑选。</View>
              <View>2.好友每购买一单您就可获得一笔佣金提成，上不封顶！</View>
              <View>3.好友确认收货后15天内无退货即可获得佣金。</View>
            </View>
          </View>
        </ScrollView>

        {process.env.TARO_ENV === 'weapp' ?
          <View className='goods-btn' style={{height: `60px`}}>
            <Button className='btn-buy' onClick={this.onWeAppBuyGoods.bind(this)}>
              <View className='btn-name'>
                自己买
              </View>
              <View className='btn-desc'>
                省{Utils.formatPrice(couponDiscount + groupPromotePrice)}元（券+佣金）
              </View>
            </Button>
            <Button className='btn-share' openType='share'>
              <View className='btn-name'>
                分享
              </View>
              <View className='btn-desc'>
                赚{Utils.formatPrice(groupPromotePrice)}元
              </View>
            </Button>
          </View> : ''
        }
        {process.env.TARO_ENV === 'h5' ?
          <View className='goods-btn' style={{height: `60px`}}>
            <Button className='btn-buy-now' onClick={this.onWebBuyGoods.bind(this, buyUrl)}>
              <View className='btn-name'>
                立即购买
              </View>
              <View className='btn-desc'>
                省{Utils.formatPrice(couponDiscount + groupPromotePrice)}元（券+佣金）
              </View>
            </Button>
          </View> : ''
        }
      </View>
    )
  }
}

export default PddDetail
