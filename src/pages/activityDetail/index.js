import Taro, {Component} from '@tarojs/taro'
import {View, Button, ScrollView, Image, Video} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import RichView from '../../components/RichView'
import WxShare from '../../components/WxShare/index'

import * as Utils from '../../utils/utils'
import ParseComponent from '../../components/wxParse/wxParseComponent'

import praiseBtn from '../../images/public/praise_yes.png'
import shareBtn from '../../images/public/shareBtn.png'

@connect(({activityDetail}) => ({
  ...activityDetail
}))
class ActivityDetail extends Component {
  config = {
    navigationBarTitleText: '文章内容'
  }

  componentDidMount() {
    const {type, actId, title, imageUrl} = this.$router.params
    let userId = Taro.getStorageSync('userId')
    let link = `http://api.viplark.com/api/web/share?userId=${userId}&type=${type}&actId=${actId}`
    let desc = '更多有趣的段子，尽在百灵鸟平台'
    if (type == 0) {
      desc = '更多生活资讯、优惠信息，尽在百灵鸟平台'
    }
    this.props.dispatch({
      type: 'activityDetail/initActivity'
    })
    this.props.dispatch({
      type: 'activityDetail/save',
      payload: {
        userId, type, actId, title, link, desc, imageUrl
      }
    })
    this.props.dispatch({
      type: 'activityDetail/loadAdData'
    })
    if(type == 0) {
      this.props.dispatch({
        type: 'activityDetail/loadActivityData'
      })
      this.props.dispatch({
        type: 'activityDetail/loadActAdData'
      })
    } else if(type == 1) {
      this.props.dispatch({
        type: 'activityDetail/loadNewsContent'
      })
    }
  }

  onShareAppMessage() {
    const {userId, type, actId, title, desc, imageUrl} = this.props
    return {
      title: title,
      imageUrl: imageUrl,
      desc: desc,
      path: `/pages/activityDetail/task?userId=${userId}&type=${type}&actId=${actId}&title=${title}`
    }
  }

  onActivityPraise() {
    this.props.dispatch({
      type: 'activityDetail/activityPraise'
    })
  }

  onActivityClick(actId, title, iconUrl) {
    let scrollTop = 0
    let type = 0
    const {userId} = this.props
    let link = `http://api.viplark.com/api/web/share?userId=${userId}&type=${type}&actId=${actId}`
    let desc = '更多有趣的段子，尽在百灵鸟平台'
    if (type == 0) {
      desc = '更多生活资讯、优惠信息，尽在百灵鸟平台'
    }
    this.props.dispatch({
      type: 'activityDetail/initActivity'
    })
    this.props.dispatch({
      type: 'activityDetail/save',
      payload: {
        userId, actId, title, link, desc, imageUrl: iconUrl, scrollTop
      }
    })
    this.props.dispatch({
      type: 'activityDetail/loadActivityData'
    })
    this.props.dispatch({
      type: 'activityDetail/loadAdData'
    })
    this.props.dispatch({
      type: 'activityDetail/loadActAdData'
    })
  }

  render() {
    const {type, title, content, link, desc, imageUrl, refreshTime, hits, praise, praiseState, scrollTop} = this.props
    const {isAd, isImage, isVideo, picUrl, videoUrl, adTitle, subTitle, btnTitle, actList} = this.props

    let existAct = false
    if(content && content.trim() !== '') {
      existAct = true
    }
    let shareBtnHeight = 50
    let scrollHeight = Utils.windowHeight(false)
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && existAct) {
      scrollHeight -= 50
    }

    const actContent = actList.map((item, index) => {
      return <View key={index} className='activity-item' onClick={this.onActivityClick.bind(this, item.actId, item.subTitle, item.iconUrl)}>
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
            {(item.free == 0 && item.money > 0) ? `每增加一次阅读可获得${item.money}元` : ''}
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
        {process.env.TARO_ENV === 'h5' ? <WxShare link={link} title={title} desc={desc} imgUrl={imageUrl} /> : ''}

        <ScrollView
          className='act-scroll'
          style={{height: `${scrollHeight}px`}}
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
        >
          <View className='act-detail'>
            <View className='act-title'>
              <View className='act-desc'>{title}</View>
              <View className='act-date'>
                <View className='date-title'>百灵鸟</View>
                <View className='date'>{type == 0 ? Utils.formatSimpleTime(new Date(refreshTime)) : ''}</View>
              </View>
            </View>

            {process.env.TARO_ENV === 'weapp' ?
              <ParseComponent nodes={content} /> :
              <RichView nodes={content} />
            }
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

        {(existAct && Taro.getEnv() === Taro.ENV_TYPE.WEAPP) ?
          <Button className='share-btn' plain openType='share' style={{height: `${shareBtnHeight}px`}}>
            <Image className='btn-img' src={shareBtn} mode='widthFix' />
            <View>立即分享</View>
          </Button> : ''
        }
      </View>
    )
  }
}

export default ActivityDetail
