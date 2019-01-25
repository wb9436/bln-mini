import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/profit/service'
import * as Utils from '../../utils/utils'

class Classify extends Component {
  config = {
    navigationBarTitleText: '账户明细'
  }
  constructor() {
    super(...arguments)
    this.state = {
      curPageNum: 1,
      pageSize: 15,
      loadAll: false,
      list: [],
    }
  }

  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.accountLog({pageSize, curPageNum}).then(data => {
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
      Api.accountLog({pageSize, curPageNum}).then(data => {
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
      return <View key={index} className='account-item'>
        <View className='account-data'>
          <View className='data-name'>{Utils.accountLogType(item.type)}</View>
          <View className='data-num'>{parseFloat(item.money) > 0 ? '+' : ''}{Utils.formatPricePoint(item.money)}</View>
        </View>
        <View className='account-desc'>
          <View className='data-desc'>{item.remark}</View>
          <View className='data-date'>{Utils.formatSimpleTime(new Date(item.updateTime))}</View>
        </View>
      </View>
    })

    return (
      <View className='account-page'>
        <ScrollView className='scroll-container account-list'
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

export default Classify
