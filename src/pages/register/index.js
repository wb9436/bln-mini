import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/service'
import AddressDialog from '../../components/Address/index'

import map from '../../images/public/map.png'
import logo from '../../images/login/logo.png'
import phone from '../../images/login/phone.png'
import pwd from '../../images/login/pwd.png'
import codePng from '../../images/login/code.png'
import seeNo from '../../images/login/see_no.png'
import seeYes from '../../images/login/see_yes.png'

class ForgetPassword extends Component {
  config = {
    navigationBarTitleText: '用户注册'
  }

  constructor() {
    super(...arguments)
    this.state = {
      mobile: '',
      password: '',
      code: '',
      isPassword: true,
      hasSendCode: false,
      remainTime: 60,
      codeMsg: '获取验证码',
      timerId: null,
      isCheck: true,
      btnMsg: '下一步',
      isOpened: false,
      address: '上海市 上海市 浦东新区',
    }
  }

  componentWillMount() {
    const {inviter} = this.$router.params
    if(inviter) {
      Taro.setStorageSync('inviter', inviter)
    }
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

  componentWillUnmount() {
    const {timerId} = this.state
    if (timerId) {
      clearInterval(timerId)
    }
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onSendCodeHandler() {
    const {mobile, hasSendCode, remainTime} = this.state
    if (!hasSendCode) { //发送验证码
      if (!mobile || mobile.length != 11) {
        this.showToast('请输入正确的手机号')
        return false;
      }
      Api.sendRegisterCode({mobile}).then(data => {
        if (data && data.code == 200) {
          this.showToast('验证码发送成功')
          let timeId = setInterval(() => this.countDown(), 1000)
          this.setState({
            hasSendCode: true,
            codeMsg: `倒计时${remainTime}秒`,
            timerId: timeId
          })
        }
      })
    }
  }

  countDown() {
    const {remainTime, timerId} = this.state
    if (remainTime >= 1) {
      this.setState({
        remainTime: remainTime - 1,
        codeMsg: `倒计时${remainTime - 1}秒`
      })
    } else {
      this.setState({
        hasSendCode: false,
        remainTime: 60,
        codeMsg: `重新获取`,
        timerId: null,
      })
      clearInterval(timerId)
    }
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

  onSwitch() {
    const {isPassword} = this.state
    this.setState({
      isPassword: !isPassword
    })
  }

  onRegisterHandler(isCheck) {
    const {mobile, password, code, address} = this.state
    if (!mobile || mobile.length != 11) {
      this.showToast('请输入正确的手机号')
      return false;
    }
    if (isCheck) { //验证手机号, 验证验证码
      if (!code) {
        this.showToast('请输入验证码')
        return false;
      }
      this.onCheckMobile(mobile, code)
    } else { //用户注册
      if (!password) {
        this.showToast('请输入新密码')
        return false;
      }
      this.onMobileRegister(mobile, password, address)
    }
  }

  onCheckMobile(mobile, code) {
    Api.toMobileRegister({mobile, code}).then(data => {
      if(data && data,code == 200) {
        let address = data.body.address || '上海市 上海市 浦东新区'
        this.setState({
          isCheck: false,
          btnMsg: '立即注册',
          address: address
        })
      }
    })
  }

  onMobileRegister(mobile, password, address) {
    let src = ''
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      src = 'web'
    } else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      src = 'mini'
    }
    let id = Taro.getStorageSync('inviter') || 0
    Api.mobileRegister({mobile, address, password, id, src}).then(data => {
      if (data && data.code == 200) {
        this.showToast('注册成功，请去登录')
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  }

  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      mask: true,
    })
  }

  onOtherHandler(handlerType) {
    if (handlerType === 'updatePwd') {
      Taro.navigateTo({
        url: '/pages/forget/index'
      })
    } else if (handlerType === 'login') {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    }
  }

  render() {
    const {isPassword, codeMsg, isLogin, isCheck, btnMsg, isOpened, address} = this.state

    return (
      <View className='login-container'>
        <Image className='logo' src={logo} mode='widthFix' />

        <View className='input phone'>
          <Image className='icon' src={phone} mode='widthFix' />
          <Input className='input-box'
            placeholderClass='placeholder'
            placeholder='输入手机号'
            maxLength={11}
            disabled={!isCheck}
            onInput={this.onInputHandler.bind(this, 'mobile')}
          />
        </View>

        {isCheck ?
          <View className='input code'>
            <Image className='icon' src={codePng} mode='widthFix' />
            <Input className='input-box code-input'
              placeholderClass='placeholder'
              placeholder='输入验证码'
              maxLength={8}
              onInput={this.onInputHandler.bind(this, 'code')}
            />
            <View className='code-btn' onClick={this.onSendCodeHandler.bind(this)}>
              {codeMsg}
            </View>
          </View> : ''
        }

        {!isCheck ?
          <View className='input address'>
            <Image className='icon' src={map} mode='widthFix' />
            <View className='input-box' onClick={this.onOpenAddressUpdate.bind(this)}>{address}</View>
          </View> : ''
        }

        {!isCheck ?
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
          </View> : ''
        }

        <View className='login-btn' onClick={this.onRegisterHandler.bind(this, isCheck)}>
          {btnMsg}
        </View>

        {isLogin ? '' :
          <View className='other-btn'>
            <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'updatePwd')}>忘记密码?</View>
            <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'login')}>立即登录</View>
          </View>
        }

        <AddressDialog isOpened={isOpened} address={address} onCancel={this.onCancelAddress.bind(this)}
          onConfirmAddress={this.onConfirmAddress.bind(this)}
        />

      </View>
    )
  }
}

export default ForgetPassword
