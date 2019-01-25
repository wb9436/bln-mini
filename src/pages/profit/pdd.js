import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/profit/service'
import * as Utils from '../../utils/utils'

class PddProfit extends Component {
  config = {
    navigationBarTitleText: '拼多多'
  }
  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('user').userId,
      page: 1,
      pageSize: 10,
      loadAll: false,
      list: [],
    }
  }

  componentDidMount() {
    const {userId, page, pageSize} = this.state
    Api.pddProfit({page, pageSize, userId}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          loadAll: body.totalPage >= page ? true : false,
          list: body.orderList,
        })
      }
    })
  }

  onLoadHandler() {
    const {userId, pageSize, loadAll, list} = this.state
    if (!loadAll) {
      let page = this.state.page + 1
      Api.pddProfit({page, pageSize, userId}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            loadAll: body.totalPage >= page ? true : false,
            list: list.concat(body.orderList)
          })
        }
      })
    }
  }

  render() {
    const {loadAll, list} = this.state

    const content = list.map((item, index) => {
      return <View key={index} className='pdd-item'>
        <Image className='pdd-img' src={item.thumbnailUrl} mode='widthFix' />
        <View className='pdd-content'>
          <View className='pdd-detail'>
            <View className='goods-name'>{item.goodsName}</View>
            <View className='user-amount'>预计收益
              <View className='account-money'>{`¥${Utils.formatPrice(item.userAmount)}`}</View>
            </View>
          </View>
          <View className='pdd-state'>
            <View className='account-desc'>好友确认收货后15天内无退货即可获得佣金</View>
            <View className='state-desc'>{Utils.ddkOrderState(item.divideStatus)}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='pdd-page'>
        <ScrollView className='scroll-container pdd-list'
          scrollY
          scrollLeft='0'
          scrollTop='0'
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {content}

          {loadAll && <LoadAll />}
        </ScrollView>

      </View>
    )
  }
}

export default PddProfit
