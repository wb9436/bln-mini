import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './month.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

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

  render() {
    return (
      <View>
        BusinessDayData
      </View>
    )
  }
}

export default BusinessMonthData
