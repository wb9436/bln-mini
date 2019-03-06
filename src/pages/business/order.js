import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './order.scss'

import * as Utils from '../../utils/utils'
import * as Api from '../../store/business/service'

import complete from '../../images/public/complete.png'
import doing from '../../images/public/doing.png'

class BusinessOrder extends Component {
  config = {
    navigationBarTitleText: '我的推广'
  }
  constructor() {
    super(...arguments)
    this.state = {
      activityList: [],
      pageSize: 10,
      curPageNum: 1,
      loadAll: false,
    }
  }


  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.businessActList({pageSize, curPageNum}).then(res => {
      console.log(res)
      const {code, body} = res
      if(code == 200) {
        this.setState({
          activityList: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  render() {
    return (
      <View className='business-act-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
        >

          <View className='act-order-item'>
            <View className='order-content'>
              <View className='order-act'>
                <Image className='order-act-icon' src='http://upload.viplark.com/bln/activity_icon/275_408752.jpg' mode='scaleToFill' />
                <View className='order-act-content'>
                  <View className='order-act-title'>【官方】百灵鸟，一个了解城市生活的窗口</View>
                  <View className='order-act-state'>
                    <View className='act-state'>
                      <Image className='act-icon' src={doing} mode='widthFix' />
                      <View className='act-state-desc font-disabled'>进行中</View>
                    </View>
                    <View className='act-money'>{`￥${Utils.formatPricePoint(0.3)}`}</View>
                  </View>
                </View>
              </View>
              <View className='order-act-data'>
                <View className='data-item act-hit'>
                  <View className='data-item-title'>点击量：</View>
                  <View className='data-info'>1000000000</View>
                </View>
                <View className='data-item act-share'>
                  <View className='data-item-title'>转发数：</View>
                  <View className='data-info'>1000000000</View>
                </View>
                <View className='data-item act-effect'>
                  <View className='data-item-title'>有效阅读数：</View>
                  <View className='data-info'>10000/10000</View>
                </View>
              </View>

              <View className='order-act-btn'>
                <View className='order-btn-item order-data-stat'>数据统计</View>
                <View className='order-btn-item order-invoice'>申请发票</View>
              </View>

            </View>
          </View>

          <View className='act-order-item'>
            <View className='order-content'>
              <View className='order-act'>
                <Image className='order-act-icon' src='http://upload.viplark.com/bln/activity_icon/275_408752.jpg' mode='scaleToFill' />
                <View className='order-act-content'>
                  <View className='order-act-title'>【官方】百灵鸟，一个了解城市生活的窗口</View>
                  <View className='order-act-state'>
                    <View className='act-state'>
                      <Image className='act-icon' src={doing} mode='widthFix' />
                      <View className='act-state-desc font-disabled'>进行中</View>
                    </View>
                    <View className='act-money'>{`￥${Utils.formatPricePoint(0.3)}`}</View>
                  </View>
                </View>
              </View>
              <View className='order-act-data'>
                <View className='data-item act-hit'>
                  <View className='data-item-title'>点击量：</View>
                  <View className='data-info'>1000000000</View>
                </View>
                <View className='data-item act-share'>
                  <View className='data-item-title'>转发数：</View>
                  <View className='data-info'>1000000000</View>
                </View>
                <View className='data-item act-effect'>
                  <View className='data-item-title'>有效阅读数：</View>
                  <View className='data-info'>10000/10000</View>
                </View>
              </View>

              <View className='order-act-btn'>
                <View className='order-btn-item order-data-stat'>数据统计</View>
                <View className='order-btn-item order-invoice'>申请发票</View>
              </View>

            </View>
          </View>

        </ScrollView>
      </View>
    )
  }
}

export default BusinessOrder
