import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './index.scss'

import * as Api from '../../store/user/service'

class HelpCenter extends Component {
  config = {
    navigationBarTitleText: '帮助中心'
  }

  constructor() {
    super(...arguments)
    this.state = {
      itemList: [
        {title: '百灵鸟平台是什么？', page: ''},
        {title: '如何下载、注册？', page: ''},
        {title: '如何赚钱？', page: ''},
        {title: '如何提现绑定？', page: ''},
        {title: '如何提现？', page: ''},
      ],
      pageSize: 15,
      curPageNum: 1,
    }
  }

  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.questionList({pageSize, curPageNum}).then(res => {
      const {code, body} = res
      if(code == 200) {
        this.setState({
          itemList: body.array
        })
      }
    })
  }

  onCallMobile(mobile) {
    if(Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.makePhoneCall({
        phoneNumber: mobile
      })
    }
  }

  onOpenUrl(accessUrl) {
    accessUrl = 'https://share.viplucky.com/shorten/goto?url=http%3A%2F%2Fapi.viplark.com%2Fapi%2Fquestion%2Finfo%3FuserId%3D100180%26id%3D1'
    if (accessUrl && accessUrl.trim() !== '') {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        window.location = accessUrl
      } else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        // Taro.navigateTo({
        //   url: '/pages/help/web?url=' + encodeURIComponent(accessUrl)
        // })
      }
    }
  }

  render() {
    const {itemList} = this.state
    const itemContent = itemList.map((item, index) => {
      return <View key={index} className='help-item' onClick={this.onOpenUrl.bind(this, item.accessUrl)}>
        <View className='item-title'>{item.title}</View>
        <AtIcon value='chevron-right' size={28} color='#EfEEf4' />
      </View>
    })

    return (
      <View className='help-page'>
        {itemContent}

        <View className='customer-service'>
          <View className='customer-item'>
            <View className='customer-title'>客服：        联系电话</View>
            <View className='customer-content mobile' onClick={this.onCallMobile.bind(this, '13761372019')}>13761372019</View>
          </View>
          <View className='customer-item'>
            <View className='customer-title'>在线时间</View>
            <View className='customer-content'>09:00~12:00 14:00~22:00</View>
          </View>

        </View>

      </View>
    )
  }
}

export default HelpCenter
