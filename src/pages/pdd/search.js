import Taro, {Component} from '@tarojs/taro'
import {View, Input, ScrollView, Image} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'

import WxShare from '../../components/WxShare'
import LoadAll from '../../components/LoadAll/index'

import SortList from '../../components/SortList'
import * as Utils from "../../utils/utils";

@connect(({pdd}) => ({
  ...pdd
}))
class PddSearch extends Component {
  config = {
    navigationBarTitleText: '商品搜索'
  }

  goBack() {
    this.props.dispatch({
      type: 'pdd/initData',
    })
    Taro.navigateBack()
  }

  onKeywordInput(e) {
    this.props.dispatch({
      type: 'pdd/save',
      payload: {
        keyword: e.detail.value
      }
    })
  }

  onSearchByKeyword() {
    const {keyword} = this.props
    if (keyword != null && keyword.trim() != '') {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          page: 1,
          goodsList: [],
          showSort: true
        }
      })
      this.props.dispatch({
        type: 'pdd/keywordsSearch'
      })
    } else {
      Taro.showToast({
        title: '请输入关键词',
        icon: 'none',
        duration: 2000
      })
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
        type: 'pdd/keywordsSearch'
      })
    }
  }

  appendNextPageList() {
    const {page, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          page: page + 1
        }
      })
      this.props.dispatch({
        type: 'pdd/keywordsSearch'
      })
    }
  }

  render() {
    const {showSort, goodsList, loadAll} = this.props
    const isH5 = (process.env.TARO_ENV === 'h5' ? true : false)

    let windowHeight = Utils.windowHeight(false) //可用窗口高度
    let searchHeight = 50 //搜索栏高度
    let goodsHeight = windowHeight - searchHeight //商品展示高度
    let sortHeight = 35 //排序高度
    let scrollHeight = goodsHeight //滑动高度
    if (showSort) {
      scrollHeight = goodsHeight - sortHeight
    }

    const goodsContent = goodsList.map((item) => {
      return <View key={item.goodsId} className='goods-item'>
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

        <View className='search-btn' style={{height: `${searchHeight}px`}} >
          <View className='btn-back' onClick={this.goBack.bind(this)} hidden={!isH5}>
            <AtIcon value='chevron-left' color='#FFF' size='30' />
          </View>
          <View className='search-input'>
            <View className='search-icon'>
              <AtIcon value='search' color='#B5B5B5' size='20' />
            </View>
            <View className='search-value'>
              <Input placeholder='搜索' focus autoFocus maxLength='16' onInput={this.onKeywordInput.bind(this)}
                onChange={this.onKeywordInput.bind(this)}
              />
            </View>
          </View>
          <View className='btn-search' onClick={this.onSearchByKeyword.bind(this)}>搜索</View>
        </View>

        <View className='goods-container' style={{height: `${goodsHeight}px`}}>
          {showSort &&
          <View className='sort-btn' style={{height: `${sortHeight}px`, background: '#F2F2F2'}}>
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

export default PddSearch
