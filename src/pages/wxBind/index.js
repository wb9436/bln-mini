import Taro, {Component} from '@tarojs/taro'
import {Image, Input, View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'
import AddressDialog from '../../components/Address/index'

import logoIcon from '../../images/login/logo.png'
import phoneIcon from '../../images/login/phone.png'
import codeIcon from '../../images/login/code.png'
import userIcon from '../../images/login/user.png'
import mapIcon from '../../images/login/map.png'
import weiXinIcon from '../../images/login/weixin.png'

class WeiXinBind extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }

  constructor() {
    super(...arguments)
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      loginType: 1, //登录类型：0=手机号登录；1=微信绑定手机号登录
      isWeiXin: false, //是否是微信
      inviter: '', //邀请人ID
      unionid: '',
      openid: '',
      nickname: '',
      headimgurl: '',
      isRegister: false, //是否是注册
      isOpened: false,
      address: '上海市 上海市 浦东新区',
      code: '',
      remainTime: 60,
      codeMsg: '获取验证码',
      timerId: null,
      mobile: '',
      btnState: false,
    }
  }

  componentDidMount() {
    const {unionid, openid, headimgurl, nickname} = this.$router.params
    let inviter = this.$router.params.inviter || Taro.getStorageSync('inviter') || ''
    if (inviter && inviter.toString().trim() !== '') { //邀请人ID
      Taro.setStorageSync('inviter', inviter)
    }
    const isWeiXin = Utils.isWeiXin()
    let loginType = 1
    if (Utils.isWeiXin() && unionid && openid && unionid.trim() !== '' && openid.trim() !== '') {
      loginType = 1
    } else {
      loginType = 0
    }
    this.setState({
      loginType: loginType,
      isWeiXin: isWeiXin,
      inviter: inviter,
      unionid: loginType == 1 ? decodeURI(unionid) : '',
      openid: loginType == 1 ? decodeURI(openid) : '',
      nickname: loginType == 1 ? decodeURI(nickname) : '',
      headimgurl: loginType == 1 ? decodeURI(headimgurl) : '',
    })
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

  onSendCodeHandler = () => {
    const {mobile, hasSendCode, remainTime} = this.state
    if (!hasSendCode) { //发送验证码
      if (!mobile || mobile.length != 11) {
        this.showToast('请输入正确的手机号')
        return false;
      }
      Api.newSendRegCode({mobile}).then(data => {
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

  render() {
    const {windowHeight, scale, loginType, isWeiXin, inviter, isRegister, isOpened, address, codeMsg, btnState} = this.state
    const quickLoginHeight = 120 * scale
    const remainHeight = windowHeight - quickLoginHeight

    return (
      <View className='wx-bind-page'>
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

          <View className='input-container'>
            <View className='input-left'>
              <Image className='icon' src={userIcon} mode='widthFix' />
              <Input className='input-box'
                placeholderClass='placeholder'
                placeholder='输入邀请人ID'
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

          <View className={btnState ? 'login-btn' : 'login-btn login-btn--disabled'}>
            登录
          </View>
        </View>

        <View className='quick-login' style={{height: `${quickLoginHeight }`}}>
          <View className='quick-title'>
            <View className='quick-line' />
            <View className='quick-desc'>快捷登录</View>
            <View className='quick-line' />
          </View>

          <View className='quick-btn'>
            <Image className='quick-icon' src={weiXinIcon} mode='widthFix' />
          </View>
        </View>

        {isRegister ?
          <AddressDialog isOpened={isOpened} address={address} onCancel={this.onCancelAddress.bind(this)}
            onConfirmAddress={this.onConfirmAddress.bind(this)}
          /> : ''
        }
      </View>
    )
  }
}

export default WeiXinBind
