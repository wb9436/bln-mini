import Taro, {Component} from '@tarojs/taro'
import {View, RichText, Button, ScrollView, Image, Video} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Utils from '../../utils/utils'
import WxShare from '../../components/WxShare'
import ParseComponent from './wxParseComponent'

import praiseBtn from '../../images/public/praiseBtn.png'
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
    if(type == 0) {
      this.props.dispatch({
        type: 'activityDetail/loadActivityData'
      })
      this.props.dispatch({
        type: 'activityDetail/loadAdData'
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

  render() {
    const {title, content, link, desc, imageUrl, refreshTime, hits, praise, praiseState, scrollTop} = this.props
    const {isAd, isImage, isVideo, picUrl, videoUrl, accessUrl, adTitle, subTitle, btnTitle, id, actList} = this.props

    let height = Utils.windowHeight(false)
    let shareBtnHeight = 50
    let scrollHeight = height - 50
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      scrollHeight -= 50
    }

    const actContent = actList.map((item, index) => {
      return <View key={index} className='activity-item'>
        <View className='item-image'>
          <Image className='act-logo' src={item.iconUrl} mode='widthFix' />
        </View>
        <View className='item-content'>
          <View className='item-title'>{`【${item.title}】${item.subTitle}`}</View>
          <View className='item-desc'>
            {item.state != 2 && item.money > 0 ? `每增加一次阅读可获得${item.money}元` : ''}
          </View>
          <View className='item-data'>
            <View className='data-detail'>
              {item.hot == 1 && <View className='title-icon hot'> 热 </View>}
              {item.hot == 2 && <View className='title-icon new'> 新 </View>}
              {item.hits}人阅读
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='detail-container' style={{height: `${height}px`}}>
        {/*微信分享*/}
        {Taro.getEnv() === Taro.ENV_TYPE.WEB ? <WxShare link={link} title={title} desc={desc} imgUrl={imageUrl} /> : ''}

        <ScrollView
          className='detail-scroll'
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
                <View className='date'>{Utils.formatSimpleTime(new Date(refreshTime))}</View>
              </View>
            </View>

            {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && <ParseComponent nodes={content} />}
            {Taro.getEnv() === Taro.ENV_TYPE.WEB && <View className='rich-text'><RichText nodes={content} /></View>}
          </View>

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

          {isAd &&
            <View className='act-ad'>
              <View className='ad-media'>
                {isImage &&
                  <Image style='width: 100%; height: auto;display: block;' src={picUrl} mode='widthFix' />
                }
                {isVideo &&
                  <Video style='width: 100%; height: auto;display: block;' controls='controls' src={videoUrl} poster={picUrl} />
                }
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
            {actContent}
          </View>


        </ScrollView>

        <Button className='share-btn' openType='share' style={{height: `${shareBtnHeight}px`}}>
          <Image className='btn-img' src={shareBtn} mode='widthFix' />
          <View>立即分享</View>
        </Button>

        {Taro.getEnv() === Taro.ENV_TYPE.WEAPP ?
          <Button className='share-btn' openType='share' style={{height: `${shareBtnHeight}px`}}>
            <Image className='btn-img' src={shareBtn} mode='widthFix' />
            <View>立即分享</View>
          </Button> : ''
        }
      </View>
    )
  }
}

export default ActivityDetail
