import Taro, {Component} from '@tarojs/taro'
import {View, RichText, Button, ScrollView} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Utils from '../../utils/utils'
import WxShare from '../../components/WxShare'
import ParseComponent from './wxParseComponent'

@connect(({activity}) => ({
  ...activity
}))
class ActivityDetail extends Component {
  config = {
    navigationBarTitleText: '文章内容'
  }

  componentDidMount() {
    const {type, actId, title, imageUrl} = this.$router.params
    Taro.setNavigationBarTitle({title: title})
    let userId = Taro.getStorageSync('userId')
    let link = `http://api.viplark.com/api/web/share?userId=${userId}&type=${type}&actId=${actId}`
    let desc = '更多有趣的段子，尽在百灵鸟平台'
    if (type == 0) {
      desc = '更多生活资讯、优惠信息，尽在百灵鸟平台'
    }
    this.props.dispatch({
      type: 'activity/initActivity'
    })
    this.props.dispatch({
      type: 'activity/save',
      payload: {
        userId, type, actId, title, link, desc, imageUrl
      }
    })
    if(type == 0) {
      this.props.dispatch({
        type: 'activity/loadActivityContent'
      })
    } else if(type == 1) {
      this.props.dispatch({
        type: 'activity/loadNewsContent'
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

  render() {
    const {title, content, link, desc, imageUrl} = this.props
    let height = Utils.windowHeight(false)

    return (
      <View className='detail-container' style={{height: `${height}px`}}>
        {/*微信分享*/}
        {Taro.getEnv() === Taro.ENV_TYPE.WEB ? <WxShare link={link} title={title} desc={desc} imgUrl={imageUrl} /> : ''}

        <ScrollView
          className={Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? 'detail-scroll detail-scroll-bottom' : 'detail-scroll'}
          scrollY
          scrollWithAnimation
          scrollTop='0'
        >
          <View className='title'>
            <View>{title}</View>
          </View>

          {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && <ParseComponent nodes={content} />}
          {Taro.getEnv() === Taro.ENV_TYPE.WEB && <View className='rich-text'><RichText nodes={content} /></View>}

        </ScrollView>

        {Taro.getEnv() === Taro.ENV_TYPE.WEAPP ?
          <Button className='share-btn' openType='share'>
            <View className='share-icon'>
              <AtIcon value='share' size='30' />
            </View>
            <View>立即分享</View>
          </Button> : ''
        }
      </View>
    )
  }
}

export default ActivityDetail
