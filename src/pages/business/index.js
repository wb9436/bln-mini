import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/business/service'

import addBtn from '../../images/business/add.png'
import popupImg from '../../images/business/popup.png'

class Business extends Component {
  config = {
    navigationBarTitleText: '推广'
  }
  constructor() {
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      configList: [],
      popup: false, //是否弹窗
      isBusiness: 0, //是否为商家
      businessId: 0, //商家ID
    }
  }

  componentDidMount() {
    Api.businessConfig().then(data => {
      if(data.code == 200) {
        this.setState({
          configList: data.body
        })
      }
    })
  }

  componentDidShow() {
    Api.businessInfo().then(res => {
      const {code, body} = res
      if (code === 200) {
        this.setState({
          isBusiness: body.state === 0 ? 1 : 0,
          businessId: body.businessId,
        })
      }
    })
  }

  onConfirmPutMeal() {
    const {mealId} = this.state
    if (mealId == -1) {
      Taro.showToast({
        icon: 'none',
        title: '请选择推广套餐',
      })
      return false
    }
  }

  onShowPopup() {
    const {popup} = this.state
    this.setState({
      popup: !popup
    })
  }

  onPopupHandler(type) {
    const {isBusiness, businessId} = this.state
    let url = ''
    if (type === 'info') {
      url = '/pages/business/info'
    } else if (type === 'order') {
      url = '/pages/business/order'
    } else if (type === 'code') {
      url = '/pages/business/payCode?isBusiness=' + isBusiness + '&businessId=' + businessId
    }
    Taro.navigateTo({
      url: url
    })
  }

  onOpenLink(title, url) {
    if (url && url.trim() !== '') {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        Taro.setStorageSync('WebUrl', url)
        Taro.navigateTo({
          url: '/pages/web/index?title=' + encodeURI(title)
        })
      } else if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        window.location = url
      }
    }
  }

  render() {
    const {windowHeight, configList, popup} = this.state
    let btnHeight = 40
    let scrollHeight = windowHeight - btnHeight

    const configContent = configList.map((item, index) => {
      return <View key={index} className='config-item' onClick={this.onOpenLink.bind(this, item.name, item.linkUrl)}>
        <Image className='config-image' src={item.imgUrl} mode='widthFix' />
      </View>
    })

    return (
      <View className='business-page'>
        <View className='meal-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
            {configContent}
          </ScrollView>
        </View>

        <View className='meal-btn' onClick={this.onConfirmPutMeal.bind(this)}
          style={{height: `${btnHeight}px`, lineHeight: `${btnHeight}px`}}
        >我要投放</View>

        {popup ?
          <View className={popup ? 'popup-layout popup-layout--active' : 'popup-layout'} onClick={this.onShowPopup.bind(this)}>
            <View className='business-popup'>
              <Image className='popup-icon' src={popupImg} mode='widthFix' />

              <View className='popup-content'>
                <View className='popup-item popup-item--border' onClick={this.onPopupHandler.bind(this, 'info')}>商家信息</View>
                <View className='popup-item popup-item--border' onClick={this.onPopupHandler.bind(this, 'order')}>订单</View>
                <View className='popup-item' onClick={this.onPopupHandler.bind(this, 'code')}>收款码</View>
              </View>
            </View>
          </View> : ''
        }

        <Image className='business-add' src={addBtn} mode='widthFix' onClick={this.onShowPopup.bind(this)} />

      </View>
    )
  }
}

export default Business
