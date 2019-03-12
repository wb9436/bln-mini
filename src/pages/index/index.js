import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './index.scss'

import * as Utils from '../../utils/utils'
import loading from '../../images/public/loading.gif'

  class Index extends Component {
    config = {
      navigationBarTitleText: '百灵鸟'
    }

    componentWillMount() {
      const params = this.$router.params
      let sid = params.sid || Taro.getStorageSync('sid')
      if (sid) { //已登录
        this.checkLogin(sid) //验证登录
      } else { //校验是否是微信登录
        const isWeiXin = Utils.isWeiXin()
        const {unionid, openid} = params
        if (isWeiXin && unionid && openid && unionid.trim() !== '' && openid.trim() !== '') {
          this.toWeiXinLogin(params)
        } else {
          this.toLogin()
        }
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

    toWeiXinLogin = (params) => { //微信注册绑定
      const {unionid, openid, headimgurl, nickname} = params
      Taro.redirectTo({
        url: '/pages/wxBind/webIndex?unionid=' + unionid + '&openid=' + openid + '&headimgurl=' + headimgurl + '&nickname=' + nickname
      })
    }

    render() {
      const windowHeight = Taro.getSystemInfoSync().windowHeight
      let height = windowHeight / 5 * 1.6

      return (
        <View className='index-page'>
          <Image className='loading-icon' style={{marginTop: `${height}px`}} src={loading} mode='widthFix' />
        </View>
      )
    }
  }

export default Index
