import Taro, {Component} from '@tarojs/taro'
import {View, RichText, ScrollView, Button, Image, Video} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Api from '../../store/activity/service'
import ParseComponent from './wxParseComponent'
import * as Utils from '../../utils/utils'

import praiseBtn from '../../images/public/praise_yes.png'

@connect(({activityDetail}) => ({
  ...activityDetail
}))
class ActivityTask extends Component {
  config = {
    navigationBarTitleText: '百灵鸟'
  }

  constructor() {
    super(...arguments)
    this.state = {
      click: false,
      canScroll: true,
    }
  }

  componentDidMount() {
    const {userId, type, actId, title} = this.$router.params
    // Taro.setNavigationBarTitle({title: title})
    let unionid = this.$router.params.unionid
    // console.log(`Activity Task: ${JSON.stringify(this.$router.params)}`)
    if (userId) {
      Taro.setStorageSync('inviter', userId)
    }
    if (!unionid) {
      unionid = Taro.getStorageSync('unionid')
    } else {
      Taro.setStorageSync('unionid', unionid)
    }
    let openTime = new Date().getTime()
    this.props.dispatch({
      type: 'activityDetail/initActivity'
    })
    this.props.dispatch({
      type: 'activityDetail/save',
      payload: {
        userId, type, actId, title, openTime, unionid
      }
    })
    this.props.dispatch({
      type: 'activityDetail/loadAdData'
    })
    if (type == 0) {
      this.props.dispatch({
        type: 'activityDetail/loadActivityData'
      })
      this.props.dispatch({
        type: 'activityDetail/loadActAdData'
      })
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        this.checkUnionid(type, unionid)
      }
      /*点阅任务: 开启定时器*/
      this.checkTaskTimerID = setInterval(
        () => this.checkTaskStatus(),
        1000
      )
    } else if (type == 1) {
      this.props.dispatch({
        type: 'activityDetail/loadNewsContent'
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkTaskTimerID)
  }

  componentDidHide() {
    clearInterval(this.checkTaskTimerID)
  }

  checkUnionid(type, unionid) {
    const that = this
    if (type == 0 && Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      if (!unionid) {
        Taro.login({
          success: function (res) {
            let code = res.code
            if (code) {
              that.props.dispatch({
                type: 'activityDetail/getWeiXinOpenid',
                payload: {code}
              })
            }
          }
        })
      }
    }
  }

  checkTaskStatus() {
    const {slideTimes, readTime, scrollTop, scrollHeight, screenHeight, openTime, sendStatus, actId, unionid} = this.props
    let that = this
    if (slideTimes > 0 && readTime > 0 && scrollHeight > 0 && scrollTop > 0) {
      if (!sendStatus) {
        let defScroll = 100 * slideTimes//认为每次滑动距离超过100
        let nowTime = Number.parseInt((new Date().getTime() - openTime) / 1000)
        let totalTop = scrollHeight - screenHeight

        if (nowTime >= readTime && (scrollTop >= totalTop || scrollTop >= defScroll)) {
          Api.activityEffect({actId, unionid}).then(res => {
            const {code, msg} = res
            if (code == 200) {
              that.props.dispatch({
                type: 'activityDetail/save',
                payload: {sendStatus: true}
              })
            } else {
              console.log('非有效任务...: ' + msg)
              if (msg.indexOf('任务地址') > -1) {
                clearInterval(this.checkTaskTimerID)
              }
            }
          })
        }
      } else {
        clearInterval(this.checkTaskTimerID)
      }
    }
  }

  onScroll(e) {
    let top = this.props.scrollTop
    const {scrollTop, scrollHeight} = e.detail
    if (scrollTop > top) {
      if (top == 0) {
        const {unionid, userId, type, actId} = this.props
        if (type == 0) {
          let sign = Utils.md5(actId + unionid + userId)
          Api.recordActivity({actId, unionid, userId, sign})
        }
      }
      this.props.dispatch({
        type: 'activityDetail/save',
        payload: {
          scrollTop, scrollHeight
        }
      })
    }
  }

  onGuideBtnClick() {
    const {click} = this.state
    this.setState({
      click: !click
    })
  }

  onGoHome() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
  }

  onGetUserInfo(e) {
    this.setState({
      canScroll: true
    })
    const {encryptedData, iv} = e.detail
    this.props.dispatch({
      type: 'activityDetail/getDecryptData',
      payload: {encryptedData, iv}
    })
  }

  onActivityPraise() {
    this.props.dispatch({
      type: 'activityDetail/activityPraise'
    })
  }

  onActivityClick(actId, title) {
    const {userId} = this.props
    Taro.navigateTo({
      url: `/pages/activityDetail/task?type=0&title=${title}&actId=${actId}&userId=${userId}`
    })
  }

  render() {
    const {type, title, content, unionid, refreshTime, hits, praise, praiseState} = this.props
    const {isAd, isImage, isVideo, picUrl, videoUrl, adTitle, subTitle, btnTitle, actList} = this.props

    let existAct = false
    if(content && content.trim() !== '') {
      existAct = true
    }
    let scrollHeight = Utils.windowHeight(false)
    const {click} = this.state
    let canScrollTemp = (unionid && unionid.length > 0) ? true : this.state.canScroll

    const actContent = actList.map((item, index) => {
      return <View key={index} className='activity-item' onClick={this.onActivityClick.bind(this, item.actId, item.subTitle)}>
        <View className='activity-view'>
          <Image className='activity-logo' src={item.iconUrl} mode='scaleToFill' />
        </View>
        <View className='activity-content'>
          <View className='activity-title'>
            {item.hot == 1 && <View className='font-icon hot'> 热 </View>}
            {item.hot == 2 && <View className='font-icon new'> 新 </View>}
            {`【${item.title}】${item.subTitle}`}
          </View>
          <View className='activity-profit'>
            {(item.free === 0 && item.money > 0) ? `每增加一次阅读可获得${item.money}元` : ''}
          </View>
          <View className='activity-data'>
            <View className='activity-hits'>
              {item.hits}人阅读
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='activity-page'>

        <ScrollView
          className='act-scroll'
          style={{height: `${scrollHeight}px`}}
          scrollY
          scrollWithAnimation
          onScroll={this.onScroll.bind(this)}
        >
          <View className='act-detail'>
            <View className='act-title'>
              <View className='act-desc'>{title}</View>
              <View className='act-date'>
                <View className='date-title'>百灵鸟</View>
                <View className='date'>{type == 0 ? Utils.formatSimpleTime(new Date(refreshTime)) : ''}</View>
              </View>
            </View>

            {Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? <ParseComponent nodes={content} /> : ''}
            {Taro.getEnv() === Taro.ENV_TYPE.WEB ? <View className='rich-text'><RichText nodes={content} /></View> : ''}
          </View>

          {type == 0 && existAct &&
            <View className='act-data'>
              <View className='act-hits'>
                阅读量
                <View className='hits-data'>{hits}</View>
              </View>
              <View className='act-praise' onClick={this.onActivityPraise.bind(this)}>
                <Image className='praise-btn' mode='widthFix' src={praiseBtn} />
                <View className={praiseState === 1 ? 'praise-data praise-state' : 'praise-data'}>{praise}</View>
              </View>
            </View>
          }

          {isAd && existAct && Taro.getEnv() === Taro.ENV_TYPE.WEB &&
            <View className='act-ad'>
              <View className='ad-media'>
                {isImage && <Image className='media-style' src={picUrl} mode='widthFix' />}
                {isVideo && <Video className='media-style' controls src={videoUrl} poster={picUrl} />}
              </View>
              <View className='ad-container'>
                <View className='ad-content'>
                  <View className='ad-title'>
                    {adTitle}
                  </View>
                  <View className='ad-desc'>
                    {subTitle}
                  </View>
                </View>
                <View className='ad-btn'>
                  {btnTitle}
                </View>
              </View>
            </View>
          }

          <View className='act-list'>
            {existAct ? actContent : ''}
          </View>

        </ScrollView>

        {existAct ?
          <View className='guide-container'>
            <View className='guide-btn' onClick={this.onGuideBtnClick.bind(this)}>
              <AtIcon value={click ? 'chevron-right' : 'chevron-left'} size='15' />
              <View className='btn-name'>{click ? '收起' : '快速导航'}</View>
            </View>

            {click ?
              <View className='guide-content'>
                <View className='guide-home' onClick={this.onGoHome}>
                  <AtIcon value='home' size='20' color='#FFF' />
                  <View>首页</View>
                </View>
              </View> : ''
            }
          </View> : ''
        }

        {/*小程序需要授权*/}
        {!canScrollTemp ?
          <View className='detail-mark'>
            <Button className='authorize-btn' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this)}>点击继续阅读</Button>
          </View> : ''
        }
      </View>
    )
  }
}

export default ActivityTask
