import Taro, {Component} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './index.scss'

import {downloadUrl} from '../../config/index'

import moreBtn from '../../images/public/moreBtn.png'
import logout from '../../images/setup/logout.png'
import pwd from '../../images/setup/pwd.png'

class Setup extends Component {
  config = {
    navigationBarTitleText: '设置中心'
  }

  onUpdatePwdHandler() {
    Taro.navigateTo({
      url: '/pages/forget/index'
    })
  }

  onLogoutHandler() {
    Taro.showModal({
      content: '确定退出登录吗？',
      confirmColor: '#EE735D',
    }).then(res => {
      if (res.confirm) {
        Taro.removeStorageSync('sid')
        Taro.removeStorageSync('user')
        Taro.removeStorageSync('userId')
        Taro.removeStorageSync('address')

        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  }

  onDownloadHandler() {
    if(Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      window.location = downloadUrl
    }
  }

  render() {
    return (
      <View className='setup-page'>
        <View className='column-item' onClick={this.onUpdatePwdHandler.bind(this)}>
          <View className='column-left'>
            <Image className='column-icon' src={pwd} mode='widthFix' />
            <View className='column-name'>修改密码</View>
          </View>
          <View className='column-right'>
            <Image className='more-btn' src={moreBtn} mode='widthFix' />
          </View>
        </View>
        <View className='column-item' onClick={this.onLogoutHandler.bind(this)}>
          <View className='column-left'>
            <Image className='column-icon' src={logout} mode='widthFix' />
            <View className='column-name'>退出登录</View>
          </View>
          <View className='column-right'>
            <Image className='more-btn' src={moreBtn} mode='widthFix' />
          </View>
        </View>

        {Taro.getEnv() === Taro.ENV_TYPE.WEB ?
          <View className='column-item' onClick={this.onDownloadHandler.bind(this)}>
            <View className='column-left'>
              <AtIcon value='download' size={20} color='#EE735D' />
              <View className='column-name at-column'>下载百灵鸟APP</View>
            </View>
            <View className='column-right'>
              <Image className='more-btn' src={moreBtn} mode='widthFix' />
            </View>
          </View> : ''
        }


      </View>
    )
  }
}

export default Setup
