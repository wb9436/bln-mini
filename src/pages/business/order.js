import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './order.scss'

import * as Api from '../../store/business/service'

class BusinessOrder extends Component {
  config = {
    navigationBarTitleText: '我的推广'
  }
  constructor() {
    super(...arguments)
    this.state = {
      activityList: [],
      pageSize: 5,
      curPageNum: 1,
    }
  }


  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.businessActList({pageSize, curPageNum}).then(res => {
      console.log(res)

    })
  }


  render() {
    return (
      <View className='business-act-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
        >


        </ScrollView>
      </View>
    )
  }
}

export default BusinessOrder
