import Taro, {Component} from '@tarojs/taro'
import {Button, Image, Input, View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/newService'
import * as Utils from '../../utils/utils'
import AddressDialog from '../../components/Address/index'

import logoIcon from '../../images/login/logo.png'
import phoneIcon from '../../images/login/phone.png'
import codeIcon from '../../images/login/code.png'
import userIcon from '../../images/login/user.png'
import mapIcon from '../../images/login/map.png'
import phoneBtn from '../../images/login/phoneBtn.png'
import weiXinBtn from '../../images/login/weixinBtn.png'

class WebWxBind extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }

  constructor() {
    super(...arguments)
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    let isWeiXin = Utils.isWeiXin()
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      isWeiXin: isWeiXin, //是否是微信
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
      if (!Utils.isMobile(mobile)) {
        this.showToast('请输入正确的手机号')
        return false;
      }
      Api.sendRegCode({mobile}).then(data => {
        if (data && data.code == 200) {
          const {isbind, registered} = data.body
          this.showToast('验证码已发送')
          let timeId = setInterval(() => this.countDown(), 1000)
          this.setState({
            hasSendCode: true,
            codeMsg: `${remainTime}秒`,
            timerId: timeId,
            isBind: isbind.toString() === '1' ? true : false,
            isRegister: registered.toString() === '1' ? true : false,
          })
        } else {
          this.showToast('验证码发送失败，请稍后再试')
        }
      })
    }
  }

  countDown = () => {
    const {remainTime, timerId} = this.state
    if (remainTime >= 1) {
      this.setState({
        remainTime: remainTime - 1,
        codeMsg: `${remainTime - 1}秒`
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
    const {isWeiXin, mobile, code, inviter, address, unionid, openid, nickname, headimgurl, isBind, isRegister} = this.state
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
    if (isWeiXin) { //微信内
      if (isRegister && !isBind) {//进行微信绑定手机号登录
        this.onMobileBindWeiXinLogin(nickname, headimgurl, unionid, openid, code, mobile)
      } else {//微信绑定手机号注册
        this.onMobileBindWeiXinRegister(nickname, headimgurl, unionid, openid, code, mobile, inviter, address)
      }
    } else {//非微信
      this.onMobileLogin(isRegister, mobile, code)
    }
  }

  /*手机号绑定微信登录*/
  onMobileBindWeiXinLogin = (nickname, headimgurl, wxUnionid, webOpenid, code, mobile) => {
    Api.mobileBindWeiXinLogin({nickname, headimgurl, wxUnionid, webOpenid, code, mobile}).then(data => {
      if (data.code === 200) {
        this.checkLogin(data.body.sid)
      } else {
        this.showToast(data.msg)
      }
    })
  }

  /*手机号绑定微信注册*/
  onMobileBindWeiXinRegister = (nickname, headimgurl, wxUnionid, webOpenid, code, mobile, id, address) => {
    let versionNo = Utils.getVersionNo()
    Api.mobileBindWeiXinRegister({nickname, headimgurl, wxUnionid, webOpenid, code, mobile, id, address, versionNo}).then(data => {
      if (data.code == 200) {
        this.checkLogin(data.body.sid)
      } else {
        this.showToast(data.msg)
      }
    })
  }

  onMobileLogin = (isRegister, mobile, code) => {
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
          this.checkLogin(data.body.sid)
        } else if (data.code == 10031) { //验证码错误
          this.showToast('登录失败，请重新登录')
        }
      })
    }
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

  onToWeiXinLogin() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      window.location = WX_WEB
    }
  }

  onOpenServiceArgument() {
    Taro.navigateTo({
      url: '/pages/argument/index'
    })
  }

  render() {
    const {windowHeight, scale, isWeiXin, isRegister, isOpened, address, codeMsg, btnState} = this.state
    const quickLoginHeight = 145 * scale
    const remainHeight = windowHeight - quickLoginHeight

    return (
      <View className='wx-bind-page'>
        <View className='current-login' style={{height: `${remainHeight}px`}}>
          {isWeiXin ?
            <View className='logo-title'>绑定手机号</View> : <Image className='bln-logo' src={logoIcon} mode='widthFix' />
          }

          <View className='input-container input-top'>
            <View className='input-left'>
              <Image className='icon' src={phoneIcon} mode='widthFix' />
              <Input className='input-box'
                type='number'
                placeholderClass='input-placeholder'
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
                type='number'
                placeholderClass='input-placeholder'
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
          {(!isRegister && isWeiXin && btnState) ?
            <View className='input-container'>
              <View className='input-left'>
                <Image className='icon' src={userIcon} mode='widthFix' />
                <Input className='input-box'
                  type='number'
                  placeholderClass='input-placeholder'
                  placeholder='推荐人UID'
                  maxLength={11}
                  onInput={this.onInputHandler.bind(this, 'inviter')}
                />
              </View>
              <View className='input-right' />
            </View> : ''
          }

          {/*未注册填写任务地址*/}
          {(!isRegister && isWeiXin && btnState) ?
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
            {isWeiXin ? '绑定' : '登录'}
          </View>
        </View>

        <View className='quick-login' style={{height: `${quickLoginHeight}px`}}>
          <View className='quick-title'>
            <View className='quick-line' />
            <View className='quick-desc'>快捷登录</View>
            <View className='quick-line' />
          </View>
          <View className='quick-btn'>
            {isWeiXin ?
              <Button className='quick-button' plain onClick={this.onToMobileLogin.bind(this)} >
                <Image className='quick-icon' src={phoneBtn} mode='widthFix' onClick={this.onToMobileLogin.bind(this)} />
              </Button>
              :
              <Button className='quick-button' plain onClick={this.onToMobileLogin.bind(this)} >
                <Image className='quick-icon' src={weiXinBtn} mode='widthFix' onClick={this.onToWeiXinLogin.bind(this)} />
              </Button>
            }
          </View>
          <View className='service-agreement'>
            <View className='service-desc'>默认您已同意本平台</View>
            <View className='service-btn' onClick={this.onOpenServiceArgument.bind(this)}>《用户服务协议》</View>
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

export default WebWxBind
