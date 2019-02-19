import Taro, {Component} from '@tarojs/taro'
import {View, Image, Video, ScrollView, RichText} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './detail.scss'

import LoadAll from '../../components/LoadAll'

import * as Constant from '../../config/index'
import * as Utils from '../../utils/utils'

import commentImg from '../../images/topic/comment.png'
import laudSelect from '../../images/public/praise_yes.png'
import laud from '../../images/public/praise_no.png'
import topicBg from '../../images/topic/topic_bg.png'
import avatar from '../../images/public/avatar.png'

@connect(({topicComment, loading}) => ({
  ...topicComment,
  ...loading
}))
class TopicShareDetail extends Component {
  config = {
    navigationBarTitleText: '同城正文'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    this.state = {
      windowHeight: windowHeight,
    }
  }

  componentDidMount() {
    const {id} = this.$router.params
    this.props.dispatch({
      type: 'topicComment/onInitData',
      payload: {id}
    })
    this.props.dispatch({
      type: 'topicComment/onLoadTopicDetail',
    })
    this.props.dispatch({
      type: 'topicComment/onLoadCommentList',
    })
  }

  onPreviewImage(sourceUrl, index) {
    if (sourceUrl && sourceUrl.length > 0) {
      Taro.previewImage({
        current: sourceUrl[index],
        urls: sourceUrl
      })
    }
  }

  onScroll(e) {
    let scrollTop = e.detail.scrollTop
    if (scrollTop <= -80) {
      this.props.dispatch({
        type: 'topicComment/onReLoadComment'
      })
    }
  }

  appendNextPageList() {
    const {curPageNum, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'topicComment/save',
        payload: {
          curPageNum: curPageNum + 1
        }
      })
      this.props.dispatch({
        type: 'topicComment/onLoadCommentList'
      })
    }
  }

  onOpenHome() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      window.location.href = Constant.downloadUrl
    }
  }

  render() {
    const {windowHeight} = this.state
    const {topic, commentList, loadAll} = this.props
    let existTopic = topic.id == null ? false : true
    let scrollHeight = windowHeight

    const commentContent = commentList.map((item,index) => {
      return <View key={index} className='comment-item'>
        <View className='comment-author'>
          <Image className='author-avatar' mode='widthFix' src={item.avatar} />
        </View>
        <View className='content-container'>
          <View className='author-nickname'>{item.nickname}</View>
          <View className='comment-content'>{item.content}</View>

          {item.replyNum > 0 &&
            <View className='comment-reply'>
              <View className='last-play'>{`${item.lastReplyNickname}`}</View>
              <View className='other-title'>等人</View>
              <View className='reply-num'>{`共${item.replyNum}条回复`}</View>
            </View>
          }

          <View className='reply-data'>
            <View className='comment-time'>{Utils.formatTime(new Date(item.createTime))}</View>
            <View className='replay-btn'>
              <Image className='comment-icon' src={commentImg} mode='widthFix' />
              <View className='praise-btn'>
                <Image className='praise-icon' src={item.praise == 1 ? laudSelect : laud} mode='widthFix' />
                {item.praiseNum}
              </View>
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='topic-detail-page'>
        <View className='topic-detail-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScroll={this.onScroll.bind(this)}
            onScrollToLower={this.appendNextPageList.bind(this)}
          >
            {/*话题详情*/}
            <View className='topic-detail'>
              <View className='topic-author'>
                <View className='author-info'>
                  <Image className='author-avatar' mode='widthFix' src={topic.avatar || avatar} />
                  <View className='author-info'>
                    <View className='author-name'>{topic.nickname}</View>
                    <View className='author-desc'>{Utils.timeDesc(parseInt(topic.createTime / 1000))}</View>
                  </View>
                </View>
                <View className='topic-btn'>
                  <View className='topic-follow' onClick={this.onOpenHome.bind(this)}>
                    打开
                  </View>
                  <View className='topic-more'>
                    {/*<Image className='more-icon' src={moreBtn} mode='widthFix' />*/}
                  </View>
                </View>
              </View>
              <View className='topic-content'>
                {Taro.getEnv() === Taro.ENV_TYPE.WEB && <RichText nodes={topic.content} />}
                {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && topic.content}
              </View>
              <View className='topic-media'>
                {topic.type == 2 && topic.sourceUrl.length > 0 > 0 ?
                  <Video
                    src={topic.sourceUrl[0]}
                    controls
                    poster='http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
                    initialTime='0'
                    id='video'
                    loop
                    muted
                  /> : ''
                }
                {topic.type == 1 && topic.sourceUrl.length > 0 ?
                  <View className='topic-img-list'>
                    {topic.sourceUrl.map((imageUrl, idx) => (
                      <View key={idx} className='topic-img-box'>
                        <Image className='topic-img' src={imageUrl} mode='aspectFill' onClick={this.onPreviewImage.bind(this, topic.sourceUrl, idx)} />
                      </View>
                    ))}
                  </View> : ''
                }
              </View>
              <View className='topic-hit'> {`${topic.hitNum}次浏览`} </View>
            </View>
            {/*话题评论详情*/}
            <View className='comment-detail'>
              <View className='comment-header'>
                <View>
                  评论 {topic.commentNum}
                </View>
                <View>
                  赞 {topic.praiseNum}
                </View>
              </View>
              <View className='comment-list'>
                {commentContent}
                {loadAll && <LoadAll />}
              </View>
            </View>

          </ScrollView>
        </View>

      </View>
    )
  }
}

export default TopicShareDetail
