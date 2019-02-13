import Taro, {Component} from '@tarojs/taro'
import {View, RichText, ScrollView, Button} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Api from '../../store/activity/service'
import ParseComponent from './wxParseComponent'
import * as Utils from '../../utils/utils'

@connect(({activity}) => ({
  ...activity
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
    Taro.setNavigationBarTitle({title: title})
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
      type: 'activity/initActivity'
    })
    this.props.dispatch({
      type: 'activity/save',
      payload: {
        userId, type, actId, title, openTime, unionid
      }
    })
    if (type == 0) {
      this.props.dispatch({
        type: 'activity/loadActivityContent'
      })
      this.props.dispatch({
        type: 'activity/loadActivityBrief'
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
        type: 'activity/loadNewsContent'
      })
    }
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
                type: 'activity/getWeiXinOpenid',
                payload: {code}
              })
            }
          }
        })
      }
    }
  }

  checkTaskStatus() {
    const {slideTimes, readTime, scrollTop, scrollHeight, screenHeight, openTime, sendStatus} = this.props
    if (slideTimes > 0 && readTime > 0 && scrollHeight > 0 && scrollTop > 0) {
      if (!sendStatus) {
        let defScroll = 100 * slideTimes//认为每次滑动距离超过100
        let nowTime = Number.parseInt((new Date().getTime() - openTime) / 1000)
        let totalTop = scrollHeight - screenHeight

        if (nowTime >= readTime && (scrollTop >= totalTop || scrollTop >= defScroll)) {
          this.props.dispatch({
            type: 'activity/activityEffect',
          })
        }
      } else {
        clearInterval(this.checkTaskTimerID)
      }
    }
  }

  componentDidHide() {
    clearInterval(this.checkTaskTimerID)
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
        type: 'activity/save',
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
      type: 'activity/getDecryptData',
      payload: {encryptedData, iv}
    })
  }

  render() {
    const {title, content, unionid} = this.props
    let hasTitle = (!title || title.length == 0) ? false : true
    const {click} = this.state
    let canScrollTemp = (unionid && unionid.length > 0) ? true : this.state.canScroll

    return (
      <View className='detail-container'>
        <ScrollView
          className={canScrollTemp ? 'detail-scroll' : 'detail-scroll scroll-stop'}
          scrollY
          scrollWithAnimation
          onScroll={this.onScroll.bind(this)}
        >
          {hasTitle ?
            <View className='title'>
              <View>{title}</View>
            </View> : ''
          }

          {Taro.getEnv() === Taro.ENV_TYPE.WEAPP ?
            <ParseComponent nodes={content} /> : <View className='rich-text'><RichText nodes={content} /></View>
          }
        </ScrollView>

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
        </View>

        {/*小程序需要授权*/}
        {!canScrollTemp ?
          <View className='detail-mark'>
            <Button className='authorize-btn' openType='getUserInfo'
              onGetUserInfo={this.onGetUserInfo.bind(this)}
            >点击继续阅读</Button>
          </View> : ''
        }
      </View>
    )
  }
}

export default ActivityTask
