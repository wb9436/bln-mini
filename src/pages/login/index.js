import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import WxShare from '../../components/WxShare/index'

import {userMobileLogin as UserLogin, getUserDataBySid as CheckUserSid} from '../../store/user/service'

import logo from '../../images/login/logo.png'
import phone from '../../images/login/phone.png'
import pwd from '../../images/login/pwd.png'
import seeNo from '../../images/login/see_no.png'
import seeYes from '../../images/login/see_yes.png'

class Login extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }

  componentDidShow() {
    let sid = Taro.getStorageSync('sid')
    let user = Taro.getStorageSync('user')
    if (sid && user) {
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
  }

  constructor() {
    super(...arguments)
    this.state = {
      mobile: '',
      password: '',
      isPassword: true
    }
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onSwitch() {
    const {isPassword} = this.state
    this.setState({
      isPassword: !isPassword
    })
  }

  onLoginHandler() {
    const {mobile, password} = this.state
    if (!mobile || mobile.length != 11) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        mask: true,
      })
      return false;
    }
    if (!password) {
      Taro.showToast({
        title: '请输入登录密码',
        icon: 'none',
        mask: true,
      })
      return false;
    }
    let from = ''
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      from = 'web'
    } else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      from = 'mini'
    }
    UserLogin({mobile, password, from}).then(res => {
      if (res && res.code == 200) {
        let sid = res.body.sid
        CheckUserSid({sid, from}).then((data) => {
          if (data.code == 200) {
            let address = data.body.address
            let user = data.body.user

            Taro.setStorageSync('sid', sid)
            Taro.setStorageSync('address', address)
            Taro.setStorageSync('user', user)
            Taro.setStorageSync('userId', user.userId)

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
        })
      }
    })
  }

  onOtherHandler(handlerType) {
    if (handlerType === 'updatePwd') {
      Taro.navigateTo({
        url: '/pages/forget/index'
      })
    } else if (handlerType === 'register') {
      Taro.navigateTo({
        url: '/pages/register/index'
      })
    }
  }

  render() {
    const {isPassword} = this.state

    return (
      <View className='login-container'>
        {process.env.TARO_ENV === 'h5' ? <WxShare /> : ''}

        <Image className='logo' src={logo} mode='widthFix' />
        <View className='input phone'>
          <Image className='icon' src={phone} mode='widthFix' />
          <Input className='input-box'
            placeholderClass='placeholder'
            placeholder='输入手机号'
            maxLength={11}
            onInput={this.onInputHandler.bind(this, 'mobile')}
          />
        </View>

        <View className='input pwd'>
          <Image className='icon' src={pwd} mode='widthFix' />
          <Input className='input-box'
            placeholderClass='placeholder'
            placeholder='输入密码'
            password={isPassword}
            onInput={this.onInputHandler.bind(this, 'password')}
          />
          <Image className='see-icon' src={isPassword ? seeNo : seeYes} mode='widthFix'
            onClick={this.onSwitch.bind(this)}
          />
        </View>

        <View className='login-btn' onClick={this.onLoginHandler.bind(this)}>
          登录
        </View>

        <View className='other-btn'>
          <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'updatePwd')}>忘记密码?</View>
          <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'register')}>立即注册</View>
        </View>

      </View>
    )
  }
}

export default Login
