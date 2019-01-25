import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/profit/service'
import * as Utils from '../../utils/utils'

class DayProfit extends Component {
  config = {
    navigationBarTitleText: '每日收益'
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
    Api.dayProfit({pageSize, curPageNum}).then(data => {
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
      Api.dayProfit({pageSize, curPageNum}).then(data => {
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
      return <View key={index} className='day-item'>
        <View className='day-date'>{item.day}</View>
        <View className='day-num'>{Utils.formatPricePoint(item.money)}</View>
      </View>
    })

    return (
      <View className='day-page'>
        <ScrollView className='scroll-container day-list'
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

export default DayProfit
