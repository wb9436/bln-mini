import Taro, {Component} from '@tarojs/taro'
import {Image, Input, View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/newService'
import * as Utils from '../../utils/utils'
import AddressDialog from '../../components/Address/index'

import userIcon from '../../images/login/user.png'
import mapIcon from '../../images/login/map.png'

class MobileRegister extends Component {
  config = {
    navigationBarTitleText: '完善个人信息'
  }
  constructor() {
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      mobile: '',
      code: '',
      inviter: '',
      isOpened: false,
      address: '上海市 上海市 浦东新区',
    }
  }

  componentWillMount() {
    const {mobile, code} = this.$router.params
    let inviter = Taro.getStorageSync('inviter') || ''
    this.setState({mobile, code, inviter})
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value,
    })
  }

  onOpenAddressUpdate() {
    this.setState({
      isOpened: true
    })
  }

  onCancelAddress() {
    this.setState({
      isOpened: false
    })
  }

  onConfirmAddress(address) {
    this.setState({
      isOpened: false,
      address: address
    })
  }

  onLoginHandler() {
    let versionNo = Utils.getVersionNo()
    const {mobile, code, inviter, address} = this.state
    Api.mobileBindWeiXinRegister({code, mobile, id: inviter, address, versionNo}).then(data => {
      if (data.code == 200) {
        this.checkLogin(data.body.sid)
      } else {
        this.showToast('登录出错，请返回重新登录')
      }
    })
  }

  checkLogin = (sid) => {
    let baseUrl = BASE_API
    Taro.request({
      url: baseUrl + '/api/user/getUserBySid',
      method: 'POST',
      data: {sid: sid},
      header: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      const {data} = res
      if (data && data.body.user && data.code == 200) {
        this.toHome(data, sid)
      } else {
        this.toLogin()
      }
    }).catch(e => {
      console.log(e)
      this.toLogin()
    })
  }

  toLogin = () => {
    Taro.removeStorageSync('sid')
    Taro.removeStorageSync('address')
    Taro.removeStorageSync('user')
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  toHome = (data, sid) => {
    let address = data.body.address
    let user = data.body.user
    let userId = user.userId

    Taro.setStorageSync('sid', sid)
    Taro.setStorageSync('address', address)
    Taro.setStorageSync('user', user)
    Taro.setStorageSync('userId', userId)
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.redirectTo({
        url: '/pages/home/index'
      })
    }
  }

  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      mask: true,
    })
  }

  render() {
    const {windowHeight, scale, isOpened, address} = this.state
    const quickLoginHeight = 145 * scale
    const remainHeight = windowHeight - quickLoginHeight

    return (
      <View className='wx-bind-page'>
        <View className='current-login' style={{height: `${remainHeight}px`}}>
          <View className='logo-title'>完善个人信息</View>

          <View className='input-container input-top'>
            <View className='input-left'>
              <Image className='icon' src={userIcon} mode='widthFix' />
              <Input className='input-box'
                type='number'
                placeholderClass='placeholder'
                placeholder='推荐人UID'
                maxLength={11}
                onInput={this.onInputHandler.bind(this, 'inviter')}
              />
            </View>
            <View className='input-right' />
          </View>

          <View className='input-container'>
            <View className='input-left'>
              <Image className='icon' src={mapIcon} mode='widthFix' />
              <View className='input-address' onClick={this.onOpenAddressUpdate.bind(this)}>{address}</View>
            </View>
            <View className='input-right' />
          </View>

          <View className='login-btn' onClick={this.onLoginHandler.bind(this)} >
            登录
          </View>
        </View>
        <View className='quick-login' style={{height: `${quickLoginHeight}px`}} />

        <AddressDialog isOpened={isOpened} address={address} onCancel={this.onCancelAddress.bind(this)}
          onConfirmAddress={this.onConfirmAddress.bind(this)}
        />
      </View>
    )
  }
}

export default MobileRegister
