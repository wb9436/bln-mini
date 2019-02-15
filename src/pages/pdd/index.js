import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Utils from '../../utils/utils'

import WxShare from '../../components/WxShare/index'
import LoadAll from '../../components/LoadAll/index'

import OptList from '../../components/OptionList/index'
import SortList from '../../components/SortList/index'

@connect(({pdd}) => ({
  ...pdd,
}))
class Pdd extends Component {
  config = {
    navigationBarTitleText: '拼多多'
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'pdd/initData',
    })
    this.props.dispatch({
      type: 'pdd/recommendSearch',
    })
  }

  onOptChecked(value) {
    const {optId} = this.props
    if (value != optId) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          loadAll: false,
          optId: value,
          page: 1,
          showSort: value != -1 ? true : false,
          goodsList: [],
        }
      })
      if(value == -1) {
        this.props.dispatch({
          type: 'pdd/recommendSearch'
        })
      }else{
        this.props.dispatch({
          type: 'pdd/optSearch'
        })
      }
    }
  }

  onSortChecked(value) {
    const {sortType} = this.props
    if (value != sortType) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          loadAll: false,
          page: 1,
          sortType: value,
          goodsList: [],
        }
      })
      this.props.dispatch({
        type: 'pdd/optSearch'
      })
    }
  }

  appendNextPageList() {
    const {optId, page, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          page: page + 1
        }
      })
      if(optId == -1) {
        this.props.dispatch({
          type: 'pdd/recommendSearch'
        })
      }else{
        this.props.dispatch({
          type: 'pdd/optSearch'
        })
      }
    }
  }

  onSearchGoods() {
    Taro.navigateTo({
      url: '/pages/pdd/search'
    })
  }

  onLookGoodsDetail(goodsId) {
    Taro.navigateTo({
      url: '/pages/pddDetail/index?goodsId=' + goodsId
      // url: '/pages/pddDetail/buy?goodsId=' + goodsId + '&inviter=' + Taro.getStorageSync('userId')
    })
  }

  render() {
    const {goodsList, loadAll, showSort} = this.props
    let windowHeight = Utils.windowHeight(false) //可用窗口高度
    let searchHeight = 50 //搜索栏高度
    let optHeight = 40 //类目高度
    let goodsHeight = windowHeight - searchHeight - optHeight //商品展示高度
    let sortHeight = 35 //排序高度
    let scrollHeight = goodsHeight //滑动高度
    if (showSort) {
      scrollHeight = goodsHeight - sortHeight
    }

    const goodsContent = goodsList.map((item) => {
      return <View key={item.goodsId} className='goods-item' onClick={this.onLookGoodsDetail.bind(this, item.goodsId)}>
        <Image className='goods-icon' lazyLoad mode='widthFix' src={item.thumbnailUrl} />
        <View className='goods-name'>
          {item.goodsName}
        </View>
        <View className='goods-data-1'>
          <View className='goods-coupon'>券</View>
          <View className='coupon-money'>¥{Utils.formatPrice(item.couponDiscount)}</View>
          <View className='goods-sale'>销售{item.soldQuantity}件</View>
        </View>
        <View className='goods-data-2'>
          <View className='goods-price'>¥{Utils.formatPrice(item.groupPrice-item.couponDiscount)}</View>
          <View className='goods-comm'>{`赚 ${Utils.formatPrice(item.groupPromotePrice)}`}</View>
        </View>
      </View>
    })

    return (
      <View className='pdd-page'>
        {/*微信分享*/}
        {Taro.getEnv() === Taro.ENV_TYPE.WEB && <WxShare />}

        <View className='search-btn' style={{height: `${searchHeight}px`}} onClick={this.onSearchGoods.bind(this)} >
          <View className='search-input'>
            <View className='search-icon'>
              <AtIcon value='search' color='#B5B5B5' size='20' />
            </View>
            <View className='search-value'>搜索</View>
          </View>
        </View>

        <View className='opt-btn' style={{height: `${optHeight}px`}}>
          <OptList onOptChecked={this.onOptChecked.bind(this)} />
        </View>

        <View className='goods-container' style={{height: `${goodsHeight}px`}}>
          {showSort &&
            <View className='sort-btn' style={{height: `${sortHeight}px`}}>
              <SortList onSortChecked={this.onSortChecked.bind(this)} />
            </View>
          }

          <View className='goods-scroll' style={{height: `${scrollHeight}px`}}>
            <ScrollView className='scroll-container'
              scrollY
              scrollWithAnimation
              onScrollToLower={this.appendNextPageList.bind(this)}
            >
              <View className='goods-list'>
                {goodsContent}
              </View>

              {loadAll && <LoadAll />}
            </ScrollView>
          </View>

        </View>

      </View>
    )
  }
}

export default Pdd
