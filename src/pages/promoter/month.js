import Taro, {Component} from '@tarojs/taro'
import {Input, ScrollView, View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'
import {AtIcon} from "taro-ui";

class BusinessMonthData extends Component {
  config = {
    navigationBarTitleText: '商圈每月数据'
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
      input: '',
    }
  }

  componentDidMount() {
    const {userId} = this.$router.params
    this.setState({businessUserId: userId})
    console.log('userId: ' + userId)
  }

  onInputHandler(e) {
    this.setState({
      input: e.detail.value
    })
  }

  onInputConfirm() {
    const {input, curPageNum, pageSize} = this.state
    if(Utils.isNumber(input)) {
      Api.agentBusinessList({curPageNum, pageSize, input}).then(data => {
        console.log(data)
        const {code, body} = data
        if (code == 200) {
          this.setState({
            businessList: body.array,
            loadAll: body.paging.last
          })
        }
      })
    }
  }

  render() {
    const {windowHeight} = this.state
    const headerHeight = 55
    const titleHeight = 30
    const scrollHeight = windowHeight - headerHeight - titleHeight

    return (
      <View className='promoter-business-page' style={{height: `${windowHeight}px`}}>
        <View className='promoter-header' style={{height: `${headerHeight}px`}}>
          <View className='header-input'>
            <AtIcon value='search' color='#B5B5B5' size='18' />
            <Input className='search-input' placeholder='输入商家编号' placeholderClass='input-placeholder'
              type='number' onInput={this.onInputHandler.bind(this)}
              onBlur={this.onInputConfirm.bind(this)} onConfirm={this.onInputConfirm.bind(this)}
            />
          </View>
        </View>
        <View className='list-title' style={{height: `${titleHeight}px`}}>
          <View className='title-container'>
            <View className='title-id'>日期</View>
            <View className='title-name'>商家编号</View>
            <View className='title-ba'>订单数</View>
            <View className='title-state'>总金额</View>
            <View className='title-act'>达标</View>
          </View>
        </View>

        <View className='business-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
          </ScrollView>
        </View>

      </View>
    )
  }
}

export default BusinessMonthData
