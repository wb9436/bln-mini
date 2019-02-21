import Taro, {Component} from '@tarojs/taro'
import {View, Image, ScrollView, Button} from '@tarojs/components'
import './index.scss'

import WxShare from '../../components/WxShare'
import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'

import inviteTitle from '../../images/friend/inviteTitle.png'
import how from '../../images/friend/how.png'
import inviteDesc from '../../images/friend/inviteDesc.png'
import shareBtn from '../../images/public/shareBtn.png'
import blnShare from '../../images/public/bln_share.png'
import avatar from '../../images/public/avatar.png'

class InviteFriend extends Component {
  config = {
    navigationBarTitleText: '邀请好友'
  }

  constructor() {
    super(...arguments)
    let scale = Taro.getSystemInfoSync().windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //当前屏幕宽度与设计宽度的比例
      userId: Taro.getStorageSync('userId'),
      navType: 0,//0=邀请指导, 1=好友列表
      friendList: [],
      totalFriends: 0,
      curPageNum: 1,
      pageSize: 10,
      loadAll: false,
    }
  }

  componentWillMount() {
    const {curPageNum, pageSize} = this.state
    Api.userFriends({curPageNum, pageSize}).then(res => {
      const {code, body} = res
      if (code == 200) {
        this.setState({
          friendList: body.array,
          totalFriends: body.paging.totalRows,
          loadAll: body.paging.last,
        })
      }
    })
  }

  onCheckNavBar(checkType) {
    const {navType} = this.state
    if(checkType != navType) {
      this.setState({
        navType: checkType
      })
    }
  }

  onInviteFriend() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.showToast({
        icon: 'none',
        title: '点击微信右上角，选择分享好友!!!',
        duration: 2000,
      })
    } else {
      this.onShareAppMessage()
    }
  }

  onShareAppMessage() {
    return {
      title: '了解您身边的生活资讯信息，更有拼多多优惠券等你来拿！！！',
      imageUrl: blnShare,
      path: '/pages/home/index?inviter=' + Taro.getStorageSync('userId')
    }
  }

  render() {
    const {windowHeight, scale, userId, navType, friendList, totalFriends} = this.state
    let titleHeight = 161 * scale
    let navHeight = 41 * scale
    let checkBorder = 2 * scale
    let shareBtnHeight = 50 * scale
    let scrollHeight = windowHeight - titleHeight - navHeight - checkBorder
    if (navType == 0) {
      scrollHeight -= shareBtnHeight
    }

    const friendContent = friendList.map((item, index) => {
      return <View key={index} className='friend-info'>
        <Image className='friend-avatar' src={item.avatar || avatar} mode='widthFix' />
        <View className='friend-data'>
          <View className='friend-nickname'>
            <View className='nickname'>{item.nickname}</View>
          </View>
          <View className='friend-desc'>
            <View className='desc'>{item.signature}</View>
            <View className='date'>{Utils.formatTime(new Date(item.createTime))}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='friend-page'>
        {process.env.TARO_ENV === 'h5' ? <WxShare /> : ''}

        <View className='invite-title' style={{height: `${titleHeight}px`}}>
          <Image className='title-icon' style={{height: `${titleHeight}px`}} src={inviteTitle} mode='aspectFit' />
          <View className='invite-code'>{`邀请码：${userId}`}</View>
        </View>
        <View className='invite-nav' style={{height: `${navHeight + checkBorder}px`}}>
          <View className={navType == 0 ? 'nav-item nav-checked' : 'nav-item'}
            style={navType == 0 ? {borderBottomColor: '#EE735D', color: '#EE735D'} : ''}
            onClick={this.onCheckNavBar.bind(this, 0)}
          >邀请好友</View>
          <View className={navType == 1 ? 'nav-item nav-checked' : 'nav-item'}
            style={navType == 1 ? {borderBottomColor: '#EE735D', color: '#EE735D'} : ''}
            onClick={this.onCheckNavBar.bind(this, 1)}
          >{`好友列表(${totalFriends})`}</View>
        </View>
        <View className='invite-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
          >
            {navType == 0 ?
              <View className='invite-desc'>
                <Image className='invite-desc-icon' src={inviteDesc} mode='widthFix' />
                <View className='desc'>
                  <View className='desc-item'>1.邀请您的家人、朋友、同学、同事成功率最高。</View>
                  <View className='desc-item'>2.分享到3个以上微信群，成功邀请的几率提高200%。</View>
                </View>
              </View> : ''
            }

            {navType == 0 ?
              <View className='invite-how'>
                <Image className='invite-how-icon' src={how} mode='widthFix' />
              </View> : ''
            }

            {navType == 1 ?
              friendContent : ''
            }
          </ScrollView>
        </View>

        {navType == 0 ?
          <Button className='invite-share' openType='share' style={{height: `${shareBtnHeight}px`}} onClick={this.onInviteFriend.bind(this)}>
            <Image className='invite-share-icon' src={shareBtn} mode='widthFix' />
            <View className='invite-share-title'>立即分享</View>
          </Button> : ''
        }
      </View>
    )
  }
}

export default InviteFriend
