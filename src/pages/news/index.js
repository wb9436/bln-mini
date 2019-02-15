import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Utils from '../../utils/utils'

import LoadAll from '../../components/LoadAll'
import blnShare from '../../images/public/bln_share.png'

@connect(({news}) => ({
  ...news,
}))
class Hot extends Component {
  config = {
    navigationBarTitleText: '段子手'
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'news/refreshNews'
    })
  }

  onShareAppMessage() {
    return {
      title: '了解您身边的生活资讯信息，更有拼多多优惠券等你来拿！！！',
      imageUrl: blnShare,
      path: '/pages/home/index?inviter=' + Taro.getStorageSync('userId')
    }
  }

  onLoadHandler() {
    const {loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'news/loadNews',
      })
    }
  }

  onNewsClick(actId, title, imageUrl) {
    Taro.navigateTo({
      url: `/pages/activityDetail/index?type=1&title=${title}&actId=${actId}&imageUrl=${imageUrl}`
      // url: `/pages/activityDetail/task?type=1&title=${title}&actId=${actId}&userId=${Taro.getStorageSync('userId')}`
    })
  }

  render() {
    const {newsList, loadAll} = this.props

    const newsContent = newsList.map((item, index) => {
      return <View key={index} className='news-item' onClick={this.onNewsClick.bind(this, item.id, item.title, item.imageUrl)}>
        <View className='news-img'>
          <Image className='img-container' mode='scaleToFill' lazyLoad src={item.imageUrl} />
        </View>
        <View className='news-content'>
          <View className='news-title'>
            <View className='news-title_content'>
              {item.title}
            </View>
          </View>
          <View className='news-time'>
            <View className='news-source'>
              <Image className='avatar' mode='widthFix' lazyLoad src={item.avatarUrl} />
              <View className='source'>{item.source}</View>
            </View>
            <View className='time'>{Utils.timeDesc(item.publishTime)}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='news-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {newsContent}

          {loadAll && <LoadAll />}
        </ScrollView>
      </View>
    )
  }
}

export default Hot
