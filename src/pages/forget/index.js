import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/service'

import btn from '../../images/login/btn.png'
import logo from '../../images/login/logo.png'
import phone from '../../images/login/phone.png'
import pwd from '../../images/login/pwd.png'
import codePng from '../../images/login/code.png'
import seeNo from '../../images/login/see_no.png'
import seeYes from '../../images/login/see_yes.png'

class ForgetPassword extends Component {
  config = {
    navigationBarTitleText: '修改密码'
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
      isLogin: true //登录状态:已登录=修改密码;未登录=忘记密码
    }
  }

  componentWillMount() {
    let sid = Taro.getStorageSync('sid')
    let user = Taro.getStorageSync('user')
    if (!sid || !user) {
      this.setState({
        isLogin: false
      })
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
      Api.sendForgetCode({mobile}).then(data => {
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

  onSwitch() {
    const {isPassword} = this.state
    this.setState({
      isPassword: !isPassword
    })
  }

  onUpdatePwdHandler() {
    const {mobile, password, code} = this.state
    if (!mobile || mobile.length != 11) {
      this.showToast('请输入正确的手机号')
      return false;
    }
    if (!code) {
      this.showToast('请输入验证码')
      return false;
    }
    if (!password) {
      this.showToast('请输入新密码')
      return false;
    }
    Api.updatePwd({mobile, code, password}).then(data => {
      if (data && data.code == 200) {
        this.showToast('修改成功，请重新登录')
        Taro.removeStorageSync('sid')
        Taro.removeStorageSync('user')
        Taro.removeStorageSync('address')

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
    if (handlerType === 'login') {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    } else if (handlerType === 'register') {
      Taro.navigateTo({
        url: '/pages/register/index'
      })
    }
  }

  render() {
    const {isPassword, codeMsg, isLogin} = this.state

    return (
      <View className='login-container'>
        <Image className='logo' src={logo} mode='widthFix' />

        <View className='input phone'>
          <Image className='icon' src={phone} mode='widthFix' />
          <Input className='input-box'
            placeholderClass='placeholder'
            placeholder='注册的手机号'
            maxLength={11}
            onInput={this.onInputHandler.bind(this, 'mobile')}
          />
        </View>

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
        </View>

        <View className='input pwd'>
          <Image className='icon' src={pwd} mode='widthFix' />
          <Input className='input-box'
            placeholderClass='placeholder'
            placeholder='输入新密码'
            password={isPassword}
            onInput={this.onInputHandler.bind(this, 'password')}
          />
          <Image className='see-icon' src={isPassword ? seeNo : seeYes} mode='widthFix'
            onClick={this.onSwitch.bind(this)}
          />
        </View>

        <View className='login-btn' style={{backgroundImage: `url(${btn})`}} onClick={this.onUpdatePwdHandler.bind(this)}>
          立即修改
        </View>

        {isLogin ? '' :
          <View className='other-btn'>
            <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'login')}>返回登录</View>
            <View className='other-desc' onClick={this.onOtherHandler.bind(this, 'register')}>重新注册</View>
          </View>
        }

      </View>
    )
  }
}

export default ForgetPassword
