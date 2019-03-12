import Taro, {Component} from '@tarojs/taro'
import {Image, Input, View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/newService'
import * as Utils from '../../utils/utils'
import AddressDialog from '../../components/Address/index'

import phoneIcon from '../../images/login/phone.png'
import codeIcon from '../../images/login/code.png'
import userIcon from '../../images/login/user.png'
import mapIcon from '../../images/login/map.png'
import phoneBtn from '../../images/login/phoneBtn.png'

class MiniWxBind extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }

  constructor() {
    super(...arguments)
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      inviter: '', //邀请人ID
      unionid: '',
      openid: '',
      nickname: '',
      headimgurl: '',
      isBind: false, //手机号是否已绑定微信
      isRegister: true, //手机号是否是注册
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
    this.setState({
      inviter: inviter,
      unionid: unionid ? decodeURI(unionid) : '',
      openid: openid ? decodeURI(openid) : '',
      nickname: nickname ? decodeURI(nickname) : '',
      headimgurl: headimgurl ? decodeURI(headimgurl) : '',
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
      Api.sendRegCode({mobile}).then(data => {
        if (data && data.code == 200) {
          const {isbind, registered} = data.body
          this.showToast('验证码发送成功')
          let timeId = setInterval(() => this.countDown(), 1000)
          this.setState({
            hasSendCode: true,
            codeMsg: `倒计时${remainTime}秒`,
            timerId: timeId,
            isBind: isbind.toString() === '1' ? true : false,
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

  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      mask: true,
    })
  }

  onLoginHandler() {
    const {mobile, code, inviter, address, unionid, openid, nickname, headimgurl, isBind, isRegister} = this.state
    if (!Utils.isMobile(mobile)) {
      return false;
    }
    if (!Utils.isNumber(code)) {
      return false;
    }
    if (isRegister && isBind) { //手机号已注册切已绑定，提示已绑定
      this.showToast('手机号已绑定其他微信！')
      return false;
    }
    if (isRegister && !isBind) {//进行微信绑定手机号登录
      this.onMobileBindWeiXinLogin(nickname, headimgurl, unionid, openid, code, mobile)
    } else {//微信绑定手机号注册
      this.onMobileBindWeiXinRegister(nickname, headimgurl, unionid, openid, code, mobile, inviter, address)
    }
  }

  /*手机号绑定微信登录*/
  onMobileBindWeiXinLogin = (nickname, headimgurl, wxUnionid, miniOpenid, code, mobile) => {
    Api.mobileBindWeiXinLogin({nickname, headimgurl, wxUnionid, miniOpenid, code, mobile}).then(data => {
      if (data.code === 200) {
        this.checkLogin(data.body.sid)
      } else {
        this.showToast(data.msg)
      }
    })
  }

  /*手机号绑定微信注册*/
  onMobileBindWeiXinRegister = (nickname, headimgurl, wxUnionid, miniOpenid, code, mobile, id, address) => {
    let versionNo = Utils.getVersionNo()
    Api.mobileBindWeiXinRegister({nickname, headimgurl, wxUnionid, miniOpenid, code, mobile, id, address, versionNo}).then(data => {
      if (data.code == 200) {
        this.checkLogin(data.body.sid)
      } else {
        this.showToast(data.msg)
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

  onToMobileLogin() {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  render() {
    const {windowHeight, scale, isRegister, isOpened, address, codeMsg, btnState} = this.state
    const quickLoginHeight = 120 * scale
    const remainHeight = windowHeight - quickLoginHeight

    return (
      <View className='wx-bind-page'>
        <View className='current-login' style={{height: `${remainHeight}px`}}>
          <View className='logo-title'>绑定手机号</View>
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

          {/*未注册填写邀请人UID*/}
          {(!isRegister && btnState) ?
            <View className='input-container'>
              <View className='input-left'>
                <Image className='icon' src={userIcon} mode='widthFix' />
                <Input className='input-box'
                  placeholderClass='placeholder'
                  placeholder='推荐人UID'
                  maxLength={11}
                  onInput={this.onInputHandler.bind(this, 'inviter')}
                />
              </View>
              <View className='input-right' />
            </View> : ''
          }

          {/*未注册填写任务地址*/}
          {(!isRegister && btnState) ?
            <View className='input-container'>
              <View className='input-left'>
                <Image className='icon' src={mapIcon} mode='widthFix' />
                <View className='input-address' onClick={this.onOpenAddressUpdate.bind(this)}>{address}</View>
              </View>
              <View className='input-right' />
            </View> : ''
          }

          {/*登录按钮*/}
          <View className={btnState ? 'login-btn' : 'login-btn login-btn--disabled'}
            onClick={this.onLoginHandler.bind(this)}
          >
            绑定
          </View>
        </View>

        <View className='quick-login' style={{height: `${quickLoginHeight }`}}>
          <View className='quick-title'>
            <View className='quick-line' />
            <View className='quick-desc'>快捷登录</View>
            <View className='quick-line' />
          </View>
          <View className='quick-btn'>
            <Image className='quick-icon' src={phoneBtn} mode='widthFix' onClick={this.onToMobileLogin.bind(this)} />
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

export default MiniWxBind
