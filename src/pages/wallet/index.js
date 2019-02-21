import Taro, {Component} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './index.scss'

import * as Utils from '../../utils/utils'

import cash from '../../images/wallet/cash.png'
import bind from '../../images/wallet/bind.png'
import detail from '../../images/wallet/detail.png'
import day from '../../images/wallet/day.png'
import task from '../../images/wallet/task.png'
import pdd from '../../images/wallet/pdd.png'
import record from '../../images/wallet/record.png'
import walletBg from '../../images/wallet/walletBg.png'

class Wallet extends Component {
  config = {
    navigationBarTitleText: '我的钱包'
  }
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      money: '',
      wxGzhOpenid: '',
      walletItem: []
    }
  }

  componentDidMount() {
    const {amount, money, wxGzhOpenid} = this.$router.params
    let walletItem = [
      // {name: '我要提现', icon: cash, page: '/pages/applyCash/index'},
      // {name: '提现绑定', icon: bind, page: '/pages/cashBind/index'},
      {name: '账户明细', icon: detail, page: '/pages/account/index'},
      {name: '每日收益', icon: day, page: '/pages/profit/day'},
      {name: '任务收益', icon: task, page: '/pages/profit/task'},
      {name: '拼多多', icon: pdd, page: '/pages/profit/pdd'},
      {name: '提现记录', icon: record, page: '/pages/cash/index'},
    ]

    this.setState({
      amount: Utils.formatPricePoint(amount),
      money: Utils.formatPricePoint(money),
      wxGzhOpenid: wxGzhOpenid,
      walletItem: walletItem
    })
  }

  onLookPageHandler(page) {
    Taro.navigateTo({
      url: page
    })
  }

  render() {
    const {amount, money, walletItem} = this.state

    const walletContent = walletItem.map((item, index) => {
      return <View key={index} className='column-item' onClick={this.onLookPageHandler.bind(this, item.page)}>
        <View className='column-left'>
          <Image className='column-icon' src={item.icon} mode='widthFix' />
          <View className='column-name'>{item.name}</View>
        </View>
        <View className='column-right'>
          <AtIcon value='chevron-right' size={28} color='#EfEEf4' />
        </View>
      </View>
    })

    return (
      <View className='wallet-page'>

        <View className='wallet-data'>
          <Image className='bg-icon' src={walletBg} mode='widthFix' />
          <View className='user-wallet'>
            <View className='item-data'>
              <View className='item-desc'>总收益</View>
              <View className='item-num'>{amount}</View>
            </View>
            <View className='line'></View>
            <View className='item-data'>
              <View className='item-desc'>余额</View>
              <View className='item-num'>{money}</View>
            </View>
          </View>

        </View>

        {walletContent}

      </View>
    )
  }
}

export default Wallet
