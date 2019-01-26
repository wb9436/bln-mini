import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {AtIcon} from 'taro-ui'
import './index.scss'

import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'

import authImg from '../../images/mine/authBtn.png'
import msgBtn from '../../images/mine/msgBtn.png'

import wallet from '../../images/mine/wallet.png'
import account from '../../images/mine/account.png'
import friend from '../../images/mine/friend.png'
import mine from '../../images/mine/mine.png'
import task from '../../images/mine/task.png'
import auth from '../../images/mine/auth.png'
import rank from '../../images/mine/rank.png'
import business from '../../images/mine/business.png'
import help from '../../images/mine/help.png'
import setup from '../../images/mine/setup.png'

import avatar from '../../images/mine/avatar.png'
import discCircular from '../../images/public/disc-circular.png'
import AddressDialog from "../../components/Address";

@connect(({user}) => ({
  ...user
}))
class Mine extends Component {
  config = {
    navigationBarTitleText: '我的'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      windowHeight -= 53
    }
    this.state = {
      windowHeight: windowHeight,
      isOpened: false,
      area: '',
      address: '',
      columnItem: [
        {name: '我的钱包',type: 'wallet', icon: wallet, page: '/pages/wallet/index'},
        {name: '账号绑定',type: 'account',  icon: account, page: ''},
        {name: '邀请好友',type: 'friend',  icon: friend, page: ''},
        {name: '我的话题',type: 'topic',  icon: mine, page: ''},
        {name: '日常任务',type: 'task',  icon: task, page: '/pages/task/index'},
        {name: '排行榜',type: 'rank',  icon: rank, page: '/pages/rank/index'},
        {name: '实名认证',type: 'auth',  icon: auth, page: '/pages/auth/index'},
        {name: '商家推广',type: 'business',  icon: business, page: ''},
        {name: '帮助中心',type: 'help',  icon: help, page: ''},
        {name: '系统设置',type: 'setup',  icon: setup, page: '/pages/setup/index'},
      ]
    }
  }

  componentDidShow() {
    this.props.dispatch({
      type: 'user/setMineData'
    })
    this.loadAreaData()
  }

  loadAreaData() {
    let address = Taro.getStorageSync('address')
    let area = ''
    let addArr = address.split(' ')
    switch (addArr.length) {
      case 3:
        area = addArr[2]
        break;
      case 2:
        area = addArr[1]
        break;
      case 1:
        area = addArr[0]
        break;
    }
    this.setState({
      address: address,
      area: area
    })
  }

  openAddress() {
    this.setState({
      isOpened: true
    })
  }

  onCancelAddress(isOpened) {
    this.setState({
      isOpened: isOpened
    })
  }

  onConfirmAddress(address) {
    Api.updateUserInfo({address}).then(data => {
      const {code} = data
      if(code == 200) {
        this.setState({
          isOpened: false
        })
        Taro.setStorageSync('address', address)
        this.loadAreaData()
      }
    })
  }

  onLookPageHandler(page) {
    const {userAccount, userSign} = this.props
    if (page) {
      if (page.indexOf('wallet') > -1) {
        page = page + '?amount=' + userAccount.amount + '&money=' + userAccount.money
      } else if (page.indexOf('task') > -1) {
        page = page + '?signTime=' + userSign.signTime
      }
      Taro.navigateTo({
        url: page
      })
    }
  }

  onOpenMsgHandler() {
    Taro.navigateTo({
      url: '/pages/message/index'
    })
  }

  render() {
    const {windowHeight, columnItem, area, address, isOpened} = this.state
    let infoHeight = 135
    let remainHeight = windowHeight - infoHeight
    const {isAuth, userData, userAccount, userSign} = this.props

    const columnContent = columnItem.map((item, index) => {
      let signMessage = false
      if (item.type === 'wallet' && userAccount.money > 0) {
        signMessage = true
      } else if (item.type === 'task' && userSign.signTime) {
        if (!Utils.isTodayDay(new Date(userSign.signTime))) {
          signMessage = true
        }
      }
      return <View key={index} className='column-item' onClick={this.onLookPageHandler.bind(this, item.page)}>
        <View className='column-left'>
          <Image className='column-icon' src={item.icon} mode='widthFix' />
          <View className='column-name'>{item.name}</View>
        </View>
        <View className='column-right'>
          {signMessage && item.type === 'wallet' ?
            <View className='wallet-money'>
              {userAccount.money}
              <View className='money-name'>元</View>
            </View> : ''
          }
          {signMessage && item.type === 'task' ?
            <Image className='task-sign' src={discCircular} mode='widthFix' /> : ''
          }
          <AtIcon value='chevron-right' size={28} color='#EfEEf4' />
        </View>
      </View>
    })

    return (
      <View className='mine-page'>
        <View className='user-info' style={{height: `${infoHeight}px`}}>
          <View className='user-base-info'>
            <Image className='avatar' src={userData.avatar || avatar} mode='widthFix' />
            <View className='info'>
              <View className='nickname'>{userData.nickname}</View>
              <View className='auth-btn' style={{backgroundImage: `url(${authImg})`}}
                onClick={this.onLookPageHandler.bind(this, '/pages/auth/index')}
              >{isAuth}</View>
            </View>
            <View className='user-msg'>
              <Image className='msg-btn' src={msgBtn} mode='widthFix' onClick={this.onOpenMsgHandler.bind(this)} />
              <View className='address-info' onClick={this.openAddress.bind(this)}>{area}</View>
            </View>
          </View>
          <View className='user-data-info'>
            <View className='data-item'>
              <View className='data-num'>{userAccount.credits}</View>
              <View className='data-desc'>信用积分</View>
            </View>
            <View className='data-item'>
              <View className='data-num'>{userAccount.point}</View>
              <View className='data-desc'>阅点</View>
            </View>
            <View className='data-item'>
              <View className='data-num'>{userSign.countSign}</View>
              <View className='data-desc'>签到</View>
            </View>
          </View>
        </View>

        <View className='data-column' style={{height: `${remainHeight}px`}}>
          {columnContent}
        </View>

        <AddressDialog isOpened={isOpened} address={address} onCancel={this.onCancelAddress.bind(this)}
          onConfirmAddress={this.onConfirmAddress.bind(this)}
        />

      </View>
    )
  }
}

export default Mine
