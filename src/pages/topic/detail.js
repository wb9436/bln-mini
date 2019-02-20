import Taro, {Component} from '@tarojs/taro'
import {View, Image, Video, ScrollView, Button, RichText} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui';
import {connect} from '@tarojs/redux'
import './detail.scss'

import TextInput from '../../components/TextArea/index'
import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/topic/service'
import * as Utils from '../../utils/utils'

import shareBtn from '../../images/topic/share.png'
import commentBtn from '../../images/topic/comment.png'
import praiseYes from '../../images/public/praise_yes.png'
import praiseNo from '../../images/public/praise_no.png'
import blnShare from '../../images/public/bln_share.png'
import avatar from '../../images/public/avatar.png'
import moreBtn from '../../images/topic/more.png'

@connect(({topicComment, loading}) => ({
  ...topicComment,
  ...loading
}))
class TopicDetail extends Component {
  config = {
    navigationBarTitleText: '同城正文'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    this.state = {
      windowHeight: windowHeight,
      myself: 0, //是否是我的
      actType: 0, //动作类型: 0=删除, 1=查看, 2=投诉, 3=查看回复
      isOpenAct: false, //是否打开动作面板
      actId: 0, //话题id或评论id
      index: 0, //评论index
      replyType: 0, //回复类型:0=话题评论, 1=评论回复
      replyAct: false, //回复面板
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
      type: 'topicComment/onInitCommentList',
    })
  }

  componentDidShow() {
    this.props.dispatch({
      type: 'topicComment/onInitCommentList',
    })
  }

  onShareAppMessage = () => {
    const {id} = this.props
    let userId = Taro.getStorageSync('userId')
    return {
      title: '更多热门话题, 尽在百灵鸟, 快来参与互动吧',
      imageUrl: blnShare,
      path: `/pages/topic/share?id=${id}&inviter=${userId}`
    }
  }

  onPreviewImage(sourceUrl, index) {
    if (sourceUrl && sourceUrl.length > 0) {
      Taro.previewImage({
        current: sourceUrl[index],
        urls: sourceUrl
      })
    }
  }

  onTopicAttention(myself) {
    let isOpenAct = false
    let actType = 0
    if (myself == 1) {
      isOpenAct = true
      this.setState({actType, isOpenAct})
    } else {
      this.props.dispatch({
        type: 'topicComment/onTopicAttention',
      })
    }
  }

  onTopicPraise() {
    this.props.dispatch({
      type: 'topicComment/onTopicPraise',
    })
  }

  onOpenAction() {
    let actType = 1
    let isOpenAct = true
    this.setState({actType, isOpenAct})
  }

  onOpenReportAction() {
    let actType = 2
    let isOpenAct = true
    this.setState({actType, isOpenAct})
  }

  onOpenCommentAction(id, index, myself) {
    let actType = 3
    let isOpenAct = true
    this.setState({myself, actType, isOpenAct, actId: id, index})
  }

  onCloseAction() {
    this.setState({isOpenAct: false})
  }

  onTopicReport(id, reason) {
    this.setState({isOpenAct: false})
    Api.reportTopic({id, reason}).then(res => {
      const {code} = res
      if (code == 200) {
        console.log('已举报该话题...')
      }
    })
  }

  onTopicDelete() {
    const {id} = this.props
    this.setState({isOpenAct: false})
    Api.deleteTopic({id}).then(data => {
      const {code} = data
      if (code == 200) {
        if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
          Taro.reLaunch({
            url: '/pages/city/index'
          })
        } else {
          Taro.navigateTo({
            url: '/pages/city/index'
          })
        }
      } else {
        Taro.showToast({
          icon: 'none',
          title: '删除失败'
        })
      }
    })
  }

  onOpenTopicComment(id) {
    this.setState({actId: id, replyType: 0, replyAct: true, isOpenAct: false})
  }

  onCommentPraise(index, id, praise, e) {
    this.props.dispatch({
      type: 'topicComment/onCommentPraise',
      payload: {index, id, praise}
    })
    e.stopPropagation()
  }

  onCommentDelete() {
    const {actId, index} = this.state
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'topicComment/onCommentDelete',
      payload: {index, id: actId}
    })
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

  onOpenReplyAction(id, e) {
    e.stopPropagation()
    this.setState({actId: id, replyType: 1, replyAct: true})
  }

  onCloseReplyAction() {
    this.setState({replyType: 0, replyAct: false})
  }

  onConfirm(content) {
    const {actId, replyType} = this.state
    this.setState({replyType: 0, replyAct: false})
    if (actId && actId != '') {
      if (!content || content.trim() == '') {
        Taro.showToast({
          icon: 'none',
          title: '请输入评论内容',
        })
        return
      }
      if (replyType == 0) {
        this.addComment(actId, content)
      } else {
        this.addCommentReply(actId, content)
      }
    }
  }

  addComment(id, content) {
    Api.addComment({id, content}).then(data => {
      const {code} = data
      if (code == 200) {
        Taro.showToast({
          icon: 'success',
          title: '发送成功',
        })
        this.props.dispatch({
          type: 'topicComment/onReLoadComment'
        })
      }
    })
  }

  addCommentReply(id, content) {
    Api.addCommentReply({id, content}).then(data => {
      const {code} = data
      if (code == 200) {
        Taro.showToast({
          icon: 'success',
          title: '发送成功',
        })
        this.props.dispatch({
          type: 'topicComment/onReLoadComment'
        })
      }
    })
  }

  onLookCommentReply() {
    const {actId, index} = this.state
    this.setState({isOpenAct: false})
    const {commentList} = this.props
    let data = JSON.stringify(commentList[index])
    Taro.navigateTo({
      url: '/pages/topic/reply?id=' + actId + '&data=' + data
    })
  }

  render() {
    const {windowHeight, myself, isOpenAct, actType, replyAct} = this.state
    const {id, topic, commentList, loadAll} = this.props
    let existTopic = topic.id == null ? false : true
    let scrollHeight = windowHeight
    let topicDataHeight = 53
    if (existTopic) {//border=1px
      scrollHeight = windowHeight - topicDataHeight - 1
    }

    const commentContent = commentList.map((item,index) => {
      return <View key={index} className='comment-item' onClick={this.onOpenCommentAction.bind(this, item.id, index, item.myself)}>
        <View className='comment-author'>
          <Image className='author-avatar' mode='widthFix' src={item.avatar} />
        </View>
        <View className='content-container'>
          <View className='author-nickname'>{item.nickname}</View>
          <View className='comment-content'>{item.content ? item.content : ''}</View>
          {item.replyNum > 0 &&
            <View className='comment-reply'>
              <View className='last-play'>{`${item.lastReplyNickname}`}</View>
              <View className='other-title'>等人</View>
              <View className='reply-num'>{`共${item.replyNum}条回复`}</View>
            </View>
          }
          <View className='reply-data'>
            <View className='comment-time'>{Utils.formatTime(new Date(item.createTime))}</View>
            <View className='reply-btn'>
              <Image className='comment-icon' src={commentBtn} mode='widthFix' onClick={this.onOpenReplyAction.bind(this, item.id)} />
              <View className='praise-btn' onClick={this.onCommentPraise.bind(this, index, item.id, item.praise)}>
                <Image className='praise-icon' src={item.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
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
                    <View className='author-name'>{topic.nickname || '百灵鸟'}</View>
                    <View className='author-desc'>{Utils.timeDesc(parseInt(topic.createTime / 1000))}</View>
                  </View>
                </View>
                <View className='topic-btn'>
                  <View className='topic-follow' onClick={this.onTopicAttention.bind(this, topic.myself)}>
                    {topic.myself == 1 ? '删除' : ''}
                    {topic.myself == 0 ? `${topic.attention == 1 ? '已关注' : '关注' }` : ''}
                  </View>
                  <View className='topic-more' onClick={this.onOpenAction.bind(this)}>
                    <Image className='more-icon' src={moreBtn} mode='widthFix' />
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
                {loadAll ? <LoadAll /> : ''}
              </View>
            </View>

          </ScrollView>
        </View>

        {/*评论底部按钮*/}
        {existTopic ?
          <View className='topic-data' style={{height: `${topicDataHeight}px`, borderTop: `1px solid #EfEEf4`}}>
            <Button className='data-item' openType='share'  >
              <View className='data-img'>
                <Image src={shareBtn} mode='widthFix' />
              </View>
              <View className='data'>分享</View>
            </Button>
            <Button className='data-item' onClick={this.onOpenTopicComment.bind(this, id)}>
              <View className='data-img'>
                <Image src={commentBtn} mode='widthFix' />
              </View>
              <View className='data'>评论</View>
            </Button>
            <Button className='data-item' onClick={this.onTopicPraise.bind(this)}>
              <View className='data-img'>
                <Image src={topic.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
              </View>
              <View className='data'>赞</View>
            </Button>
          </View> : ''
        }

        {actType == 0 &&
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onTopicDelete.bind(this)}>
              删除话题
            </AtActionSheetItem>
          </AtActionSheet>
        }

        {actType == 1 &&
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onOpenTopicComment.bind(this, id)}>
              评论
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onOpenReportAction.bind(this)}>
              投诉
            </AtActionSheetItem>
          </AtActionSheet>
        }

        {actType == 2 &&
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onTopicReport.bind(this, id, '垃圾营销')}>
              垃圾营销
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onTopicReport.bind(this, id, '涉黄信息')}>
              涉黄信息
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onTopicReport.bind(this, id, '有害信息')}>
              有害信息
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onTopicReport.bind(this, id, '违法信息')}>
              违法信息
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onTopicReport.bind(this, id, '侵犯人身权益')}>
              侵犯人身权益
            </AtActionSheetItem>
          </AtActionSheet>
        }

        {actType == 3 &&
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onLookCommentReply.bind(this)}>
              查看回复
            </AtActionSheetItem>
            {myself == 1 &&
              <AtActionSheetItem onClick={this.onCommentDelete.bind(this)}>
                删除评论
              </AtActionSheetItem>
            }
          </AtActionSheet>
        }

        {/*书写评论弹窗*/}
        <TextInput isOpened={replyAct} maxLength={180} placeholder='写评论'
          onCancel={this.onCloseReplyAction.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
        />

      </View>
    )
  }
}

export default TopicDetail
