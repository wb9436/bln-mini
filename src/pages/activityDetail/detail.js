import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Video} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import RichView from '../../components/RichView'
import * as Utils from '../../utils/utils'
import praiseBtn from '../../images/public/praise_yes.png'

@connect(({activityDetail}) => ({
  ...activityDetail
}))
class ActivityDetailIOS extends Component {

  componentDidMount() {
    const {actId} = this.$router.params
    let type = 0
    this.props.dispatch({
      type: 'activityDetail/initActivity'
    })
    this.props.dispatch({
      type: 'activityDetail/save',
      payload: {
        type, actId
      }
    })
    // this.props.dispatch({
    //   type: 'activityDetail/loadAdData'
    // })
    this.props.dispatch({
      type: 'activityDetail/loadActivityData'
    })
  }

  onActivityPraise() {
    this.props.dispatch({
      type: 'activityDetail/activityPraise'
    })
  }

  render() {
    const {type, title, content, refreshTime, hits, praise, scrollTop} = this.props
    const {isAd, isImage, isVideo, picUrl, videoUrl, adTitle, subTitle, btnTitle} = this.props

    let existAct = false
    if(content && content.trim() !== '') {
      existAct = true
    }
    let scrollHeight = Utils.windowHeight(false)

    return (
      <View className='activity-page'>
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
            <RichView nodes={content} />
          </View>

          {type == 0 && existAct &&
            <View className='act-data'>
              <View className='act-hits'>
                阅读量
                <View className='hits-data'>{hits}</View>
              </View>
              <View className='act-praise' onClick={this.onActivityPraise.bind(this)}>
                <Image className='praise-btn' mode='widthFix' src={praiseBtn} />
                <View className='praise-data'>{praise}</View>
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
        </ScrollView>
      </View>
    )
  }
}

export default ActivityDetailIOS
