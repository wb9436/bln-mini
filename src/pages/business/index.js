import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './index.scss'

import * as Api from '../../store/business/service'

import addBtn from '../../images/business/add.png'
import popupImg from '../../images/business/popup.png'

class Business extends Component {
  config = {
    navigationBarTitleText: '商家推广'
  }
  constructor() {
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      mealList: [], //套餐列表
      mealId: -1, //套餐编号
      popup: false, //是否弹窗
      isBusiness: 0, //是否为商家
      businessId: 0, //商家ID
    }
  }

  componentDidMount() {
    let packageList = []
    let mealList = []
    Api.mealPackageList().then(res => {
      const {code, body} = res
      if (code === 200) {
        console.log(body)
        packageList = body
        if (packageList && packageList.length > 0) {
          packageList.map(item => {
            Api.mealList({packageId: item.id}).then(result => {
              if (result.code === 200) {
                mealList = result.body
                this.setState({mealList})
              }
            })
          })
        }
      }
    })
  }

  componentDidShow() {
    Api.businessInfo().then(res => {
      const {code, body} = res
      if (code === 200) {
        this.setState({
          isBusiness: body.state === 0 ? 0 : 1,
          businessId: body.businessId,
        })
      }
    })
  }

  onCheckMeal(id) {
    const {mealId} = this.state
    if (id === mealId) {
      this.setState({mealId: -1})
    } else {
      this.setState({mealId: id})
    }
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
      if (isBusiness === 1) { //是否是商家
        url = '/pages/business/info'
      } else {
        url = '/pages/business/apply?from=index'
      }
    } else if (type === 'order') {
      url = '/pages/business/order'
    } else if (type === 'code') {
      url = '/pages/business/payCode?isBusiness=' + isBusiness + '&businessId=' + businessId
    }
    Taro.navigateTo({
      url: url
    })
  }

  render() {
    const {windowHeight, mealList, mealId, popup} = this.state
    let btnHeight = 40
    let scrollHeight = windowHeight - btnHeight

    const mealContent = mealList.map((item, index) => {
      return <View key={index} className='meal-item' onClick={this.onCheckMeal.bind(this, item.id)}>
        <View className='meal-type'>
          <View className='meal-check'>
            {item.id == mealId ? <AtIcon size={16} value='check' color='#F07A76' /> : ''}
          </View>
          <View className='type-title'>{item.name}</View>
        </View>
        <View className='line' />
        <View className='meal-content'>
          <View className='meal-title'>效果评估</View>
          {item.mealValueGoodsList.map((val, idx) => {
            return <View key={idx} className='meal-value'>{val.content}</View>
          })}
          <View className='meal-title'>服务内容</View>
          <View className='meal-value'>{item.content}</View>
        </View>
      </View>
    })

    return (
      <View className='business-page'>
        <View className='meal-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
            {mealContent}
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
