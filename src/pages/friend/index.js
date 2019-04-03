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
      pageSize: 20,
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

  onLoadDataHandler() {
    const {navType, curPageNum, pageSize, loadAll, friendList} = this.state
    if (navType == 1 && !loadAll) {
      Api.userFriends({curPageNum: curPageNum + 1, pageSize}).then(res => {
        const {code, body} = res
        if (code == 200) {
          this.setState({
            friendList: friendList.concat(body.array),
            totalFriends: body.paging.totalRows,
            curPageNum: curPageNum + 1,
            loadAll: body.paging.last,
          })
        }
      })
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
          <Image className='title-icon' src={inviteTitle} mode='aspectFit' />
          <View className='invite-code'>{`邀请码：${userId}`}</View>
        </View>
        <View className='invite-nav' style={{height: `${navHeight + checkBorder}px`}}>
          <View className={navType == 0 ? 'nav-item nav-checked' : 'nav-item'}
            style={{height: `${navHeight}px`, borderBottomWidth: `${checkBorder}px`}} onClick={this.onCheckNavBar.bind(this, 0)}
          >邀请好友</View>
          <View className={navType == 1 ? 'nav-item nav-checked' : 'nav-item'}
            style={{height: `${navHeight}px`, borderBottomWidth: `${checkBorder}px`}} onClick={this.onCheckNavBar.bind(this, 1)}
          >{`好友列表(${totalFriends})`}</View>
        </View>
        <View className='invite-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScrollToLower={this.onLoadDataHandler.bind(this)}
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

            {navType == 0 ?
              <View className='blank-view'></View> : ''
            }

            {navType == 1 ?
              friendContent : ''
            }
          </ScrollView>
        </View>

        {navType == 0 ?
          <Button className='invite-share' openType='share' plain style={{height: `${shareBtnHeight}px`}} onClick={this.onInviteFriend.bind(this)}>
            <Image className='invite-share-icon' src={shareBtn} mode='widthFix' />
            <View className='invite-share-title'>立即分享</View>
          </Button> : ''
        }
      </View>
    )
  }
}

export default InviteFriend
