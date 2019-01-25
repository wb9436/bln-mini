import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll'

import * as Api from '../../store/profit/service'
import * as Utils from '../../utils/utils'

class CashRecord extends Component {
  config = {
    navigationBarTitleText: '提现记录'
  }
  constructor() {
    super(...arguments)
    this.state = {
      curPageNum: 1,
      pageSize: 20,
      loadAll: false,
      list: [],
    }
  }

  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.cashRecord({pageSize, curPageNum}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          loadAll: body.paging.last,
          list: body.array,
        })
      }
    })
  }

  onLoadHandler() {
    const {pageSize, loadAll, list} = this.state
    if (!loadAll) {
      let curPageNum = this.state.curPageNum + 1
      Api.cashRecord({pageSize, curPageNum}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            loadAll: body.paging.last,
            list: list.concat(body.array),
          })
        }
      })
    }
  }

  render() {
    const {loadAll, list} = this.state

    const content = list.map((item, index) => {
      return <View key={index} className='cash-item'>
        <View className='cash-date'>{Utils.formatTime(new Date(item.createTime))}</View>
        <View className='cash-money'>¥{Utils.formatPricePoint(item.money)}</View>
        <View className='cash-state'>{item.state == 1 ? '成功' : '失败'}</View>
      </View>
    })

    return (
      <View className='cash-page'>
        <ScrollView className='scroll-container cash-list'
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

export default CashRecord
