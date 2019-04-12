import Taro, {Component} from '@tarojs/taro'
import {View, RichText, ScrollView} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './detail.scss'

import ParseComponent from '../activityDetail/wxParseComponent'

@connect(({newsDetail}) => ({
  ...newsDetail
}))
class NewsDetail extends Component {
  config = {
    navigationBarTitleText: '文章内容'
  }

  componentDidMount() {
    const {id, title, imageUrl} = this.$router.params
    let userId = Taro.getStorageSync('userId')
    this.props.dispatch({
      type: 'newsDetail/save',
      payload: {
        userId, id, title, imageUrl
      }
    })
    this.props.dispatch({
      type: 'newsDetail/loadNewsContent'
    })
  }

  render() {
    const {title, content} = this.props

    return (
      <View className='news-detail-page'>
        <ScrollView
          className='scroll-container'
          scrollY
          scrollWithAnimation
        >
          <View className='act-detail'>
            <View className='act-title'>
              <View className='act-desc'>{title}</View>
              <View className='act-date'>
                <View className='date-title'>百灵鸟</View>
                <View className='date'></View>
              </View>
            </View>

            {process.env.TARO_ENV === 'weapp' ?
              <ParseComponent nodes={content} /> :
              <View className='rich-text'><RichText nodes={content} /></View>
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default NewsDetail
