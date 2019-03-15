import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './advert.scss'

import LoadAll from '../../components/LoadAll/index'
import * as Utils from '../../utils/utils'
import * as Api from '../../store/business/service'

import complete from '../../images/public/complete.png'
import doing from '../../images/public/doing.png'

class BusinessOrder extends Component {
  config = {
    navigationBarTitleText: '广告服务'
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
    const {activityList, loadAll} = this.state
    const actContent = activityList.map((item, index) => {
      return <View key={index} className='act-order-item'>
        <View className='order-content'>
          <View className='order-act'>
            <Image className='order-act-icon' src={item.iconUrl} mode='scaleToFill' />
            <View className='order-act-content'>
              <View className='order-act-title'>{`【${item.title}】${item.subTitle}`}</View>
              <View className='order-act-state'>
                <View className='act-state'>
                  <Image className='act-icon' src={item.state == 1 ? doing : complete} mode='widthFix' />
                  <View className={item.state == 1 ? 'act-state-desc' : 'act-state-desc font-disabled'}>
                    {item.state == 1 ? '进行中' : '已完成'}
                  </View>
                </View>
                <View className='act-money'>{`￥${Utils.formatPricePoint(item.receivedMoney)}`}</View>
              </View>
            </View>
          </View>
          <View className='order-act-data'>
            <View className='data-item act-hit'>
              <View className='data-item-title'>点击量：</View>
              <View className='data-info'>{item.hits}</View>
            </View>
            <View className='data-item act-share'>
              <View className='data-item-title'>转发数：</View>
              <View className='data-info'>{item.share}</View>
            </View>
            <View className='data-item act-effect'>
              <View className='data-item-title'>有效阅读数：</View>
              <View className='data-info'>{`${item.progress}/${item.plan}`}</View>
            </View>
          </View>
          <View className='order-act-btn'>
            <View className='order-btn-item order-data-stat'>数据统计</View>
            <View className={item.receivedMoney > 0 ? 'order-btn-item order-invoice' : 'order-btn-item order-invoice bg-disabled'}>
              申请发票
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='business-act-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
        >
          {actContent}

          <LoadAll loadAll={loadAll} />
        </ScrollView>
      </View>
    )
  }
}

export default BusinessOrder
