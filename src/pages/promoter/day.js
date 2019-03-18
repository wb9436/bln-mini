import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View} from '@tarojs/components'
import {AtIcon, AtCalendar} from 'taro-ui'
import './index.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

class BusinessDayData extends Component {
  config = {
    navigationBarTitleText: '商圈每日数据'
  }

  constructor() {
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      businessUserId: '',
      list: [],
      pageSize: 20,
      curPageNum: 1,
      loadAll: false,
      popup: false,
      currentDate: '',
    }
  }

  componentDidMount() {
    const {userId} = this.$router.params
    this.setState({businessUserId: userId})
    const {curPageNum, pageSize} = this.state
    Api.businessDayData({businessUserId: userId, curPageNum, pageSize}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          list: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  onShowPopup() {
    const {popup} = this.state
    this.setState({
      popup: !popup,
    })
  }

  onDayClick = (e) => {
    const date = e.value
    const {businessUserId, pageSize, curPageNum, currentDate} = this.state
    if (date !== currentDate) {
      this.setState({currentDate: date})
      Api.businessDayData({businessUserId, curPageNum, pageSize, input: date}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            list: body.array,
            loadAll: body.paging.last
          })
        }
      })
    }
  }

  onLoadHandler() {
    const {businessUserId, curPageNum, pageSize, list, loadAll, currentDate} = this.state
    if (!loadAll) {
      Api.businessDayData({businessUserId, curPageNum: curPageNum + 1, pageSize, input: currentDate}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            list: list.concat(body.array),
            loadAll: body.paging.last,
            curPageNum: curPageNum + 1
          })
        }
      })
    }
  }

  render() {
    const {windowHeight, popup, currentDate, list} = this.state
    const headerHeight = 55
    const titleHeight = 30
    const scrollHeight = windowHeight - headerHeight - titleHeight
    const hasCheckDate = (currentDate && currentDate.trim() !== '') ? true : false
    const listContent = list.map((item, index) => {
      return <View key={index} className='list-item'>
        <View className='item-container item-container_content'>
          <View className='day-date'>{item.day}</View>
          <View className='day-id'>{item.servicerUserId}</View>
          <View className='day-order'>{item.orders}</View>
          <View className='day-money'>{Utils.formatPricePoint(item.totalMoney)}</View>
          <View className='day-state'>{item.isStandard == 1 ? '达标' : '未达标'}</View>
        </View>
      </View>
    })

    return (
      <View className='promoter-business-page' style={{height: `${windowHeight}px`}}>
        <View className='promoter-header' style={{height: `${headerHeight}px`}}>
          <View className='header-input'>
            {hasCheckDate ? '' : <AtIcon value='search' color='#B5B5B5' size='18' />}
            <View className='search-date' onClick={this.onShowPopup.bind(this)}>{currentDate || '输入日期'}</View>
          </View>
        </View>
        <View className='list-title' style={{height: `${titleHeight}px`}}>
          <View className='item-container item-container_title'>
            <View className='day-date'>日期</View>
            <View className='day-id'>商家编号</View>
            <View className='day-order'>订单数</View>
            <View className='day-money'>总金额</View>
            <View className='day-state'>达标</View>
          </View>
        </View>

        <View className='list-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            {listContent}
          </ScrollView>
        </View>

        {popup ?
          <View className={popup ? 'popup-layout popup-layout--active' : 'popup-layout'} onClick={this.onShowPopup.bind(this)}>
            <View className='date-popup'>
              <AtCalendar isVertical hideArrow currentDate={currentDate || Utils.formatSimpleTime(new Date())}
                onDayClick={this.onDayClick.bind(this)}
              />
            </View>
          </View> : ''
        }

      </View>
    )
  }
}

export default BusinessDayData
