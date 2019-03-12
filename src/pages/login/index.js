import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input, Button} from '@tarojs/components'
import './index.scss'

import WxShare from '../../components/WxShare/index'
import * as Utils from '../../utils/utils'
import * as Api from '../../store/user/newService'

import logoIcon from '../../images/login/logo.png'
import phoneIcon from '../../images/login/phone.png'
import codeIcon from '../../images/login/code.png'
import weiXinBtn from '../../images/login/weixinBtn.png'

class Login extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }

  constructor() {
    super(...arguments)
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      remainTime: 60,
      codeMsg: '获取验证码',
      timerId: null,
      mobile: '',
      btnState: false,
      isRegister: true,
    }
  }

  onInputHandler(type, e) {
    const {mobile, code} = this.state
    let btnState = true
    const value = e.detail.value
    if (type === 'mobile') {
      if (!value || !Utils.isMobile(value)) {
        btnState = false;
      }
      if (!code || !Utils.isNumber(code)) {
        btnState = false;
      }
    }
    if (type === 'code') {
      if (!mobile || !Utils.isMobile(mobile)) {
        btnState = false;
      }
      if (!value || !Utils.isNumber(value)) {
        btnState = false;
      }
    }
    this.setState({
      [type]: value,
      btnState: btnState
    })
  }

  showToast = (msg) => {
    Taro.showToast({
      title: msg,
      icon: 'none',
      mask: true,
    })
  }

  onSendCodeHandler = () => {
    const {mobile, hasSendCode, remainTime} = this.state
    if (!hasSendCode) { //发送验证码
      if (!mobile || mobile.length != 11) {
        this.showToast('请输入正确的手机号')
        return false;
      }
      Api.sendRegCode({mobile}).then(data => {
        if (data && data.code == 200) {
          const {registered} = data.body
          this.showToast('验证码发送成功')
          let timeId = setInterval(() => this.countDown(), 1000)
          this.setState({
            hasSendCode: true,
            codeMsg: `倒计时${remainTime}秒`,
            timerId: timeId,
            isRegister: registered.toString() === '1' ? true : false,
          })
        }
      })
    }
  }

  countDown = () => {
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

  onLoginHandler() {
    const {isRegister, mobile, code} = this.state
    if (!isRegister) { //未注册，完善个人信息
      Api.checkRegCode({mobile, code}).then(data => {
        if (data.code == 200) { //校验验证码
          Taro.navigateTo({
            url: `/pages/wxBind/mobileIndex?mobile=${mobile}&code=${code}`
          })
        } else if (data.code == 10031) { //验证码错误
          this.showToast('验证码错误')
        }
      })
    } else { //已注册，登录
      let versionNo = Utils.getVersionNo()
      let from = Utils.getFrom()
      Api.mobileLogin({mobile, code, versionNo, from}).then(data => {
        if (data.code == 200) { //登录成功
          this.checkLogin(data.sid)
        } else if (data.code == 10031) { //验证码错误
          this.showToast('登录失败，请重新登录')
        }
      })
    }
  }

  onToWeiXinLogin() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      window.location = WX_WEB
    }
  }

  render() {
    const {windowHeight, scale, codeMsg, btnState} = this.state
    const quickLoginHeight = 120 * scale
    const remainHeight = windowHeight - quickLoginHeight

    return (
      <View className='login-container'>
        {process.env.TARO_ENV === 'h5' ? <WxShare /> : ''}

        <View className='current-login' style={{height: `${remainHeight}px`}}>
          <Image className='bln-logo' src={logoIcon} mode='widthFix' />
          <View className='input-container input-top'>
            <View className='input-left'>
              <Image className='icon' src={phoneIcon} mode='widthFix' />
              <Input className='input-box'
                placeholderClass='placeholder'
                placeholder='输入手机号'
                maxLength={11}
                onInput={this.onInputHandler.bind(this, 'mobile')}
              />
            </View>
            <View className='input-right' />
          </View>

          <View className='input-container'>
            <View className='input-left'>
              <Image className='icon' src={codeIcon} mode='widthFix' />
              <Input className='input-box'
                placeholderClass='placeholder'
                placeholder='输入验证码'
                maxLength={11}
                onInput={this.onInputHandler.bind(this, 'code')}
              />
            </View>
            <View className='input-right' onClick={this.onSendCodeHandler.bind(this)}>
              <View className='code-desc'>{codeMsg}</View>
            </View>
          </View>

          <View className={btnState ? 'login-btn' : 'login-btn login-btn--disabled'} onClick={this.onLoginHandler.bind(this)}>
            登录
          </View>
        </View>

        <View className='quick-login' style={{height: `${quickLoginHeight }`}}>
          <View className='quick-title'>
            <View className='quick-line' />
            <View className='quick-desc'>社交账号登录</View>
            <View className='quick-line' />
          </View>
          <View className='quick-btn'>
            <Button className='quick-button' openType='getUserInfo' onClick={this.onToWeiXinLogin.bind(this)}>
              <Image className='quick-icon' src={weiXinBtn} mode='widthFix' />
            </Button>
          </View>
        </View>


      </View>
    )
  }
}

export default Login
