import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './order.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

class BusinessOrder extends Component {
  config = {
    navigationBarTitleText: '商家订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      curPageNum: 1,
      pageSize: 10,
      orderList: [],
      loadAll: false,
    }
  }

  componentDidMount() {
    const {curPageNum, pageSize} = this.state
    Api.businessOrder({curPageNum, pageSize}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          orderList: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  onLoadHandler() {
    const {curPageNum, pageSize, orderList, loadAll} = this.state
    if (!loadAll) {
      Api.businessOrder({curPageNum: curPageNum + 1, pageSize}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            curPageNum: curPageNum + 1,
            orderList: orderList.concat(body.array),
            loadAll: body.paging.last
          })
        }
      })
    }
  }

  render() {
    const {orderList} = this.state
    const orderContent = orderList.map((item, index) => {
      return <View key={index} className='order-item'>
        <View className='order-data'>
          <View className='data-title'>订单编号：</View>
          <View className='data-value'>{item.orderSn}</View>
        </View>
        <View className='order-data'>
          <View className='data-title'>下单时间：</View>
          <View className='data-value'>{Utils.formatTime(new Date(item.payTime))}</View>
        </View>
        <View className='order-data'>
          <View className='data-title'>订单金额：</View>
          <View className='data-value data-money'>{`￥${Utils.formatPricePoint(item.money)}`}</View>
        </View>
        {item.state == 1 ?
          <View className='order-data'>
            <View className='data-title'>是否到账：</View>
            <View className='data-value'>{item.businessAcceptState == 1 ? '已到账' : '未到账'}</View>
          </View> :
          <View className='order-data'>
            <View className='data-title'>支付状态：</View>
            <View className='data-value'>{item.state == 1 ? '已支付' : '未支付'}</View>
          </View>
        }
      </View>
    })

    return (
      <View className='business-order-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {orderContent}

        </ScrollView>

      </View>
    )
  }
}

export default BusinessOrder
