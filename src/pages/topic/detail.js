import Taro, {Component} from '@tarojs/taro'
import {View, Image, Video, ScrollView, Button, RichText} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui';
import {connect} from '@tarojs/redux'
import './detail.scss'
import TextInput from '../../components/TextArea/index'

import * as Api from '../../store/topic/service'
import {formatTime} from '../../utils/utils'

import share from '../../images/topic/share.png'
import commentImg from '../../images/topic/comment.png'
import laudSelect from '../../images/public/praise_yes.png'
import laud from '../../images/public/praise_no.png'
import topicBg from '../../images/topic/topic_bg.png'
import blnShare from '../../images/public/bln_share.png'
import avatar from "../../images/public/avatar.png";
import * as Utils from "../../utils/utils";
import moreBtn from "../../images/topic/more.png";

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
      hideModal: true,
      content: '',//评论内容
      id: 0,//评论ID
      isOpened: false,//删除话题弹窗
      isMySelf: 0,//是否是我的
      dialogType: 0, //弹窗类型 0=删除话题;1=删除评论
      dialogTitle: '删除话题',
      idx: 0,//评论index
    }
  }

  onShareAppMessage = () => {
    const {id} = this.props
    let userId = Taro.getStorageSync('userId')
    return {
      title: '更多热门话题, 尽在百灵鸟, 快来参与互动吧',
      imageUrl: blnShare,
      path: `/pages/topic/share?id=${id}&userId=${userId}`
    }
  }

  componentDidMount() {
    const {id} = this.$router.params
    this.props.dispatch({
      type: 'topicComment/onInit',
      payload: {id}
    })
    this.props.dispatch({
      type: 'topicComment/onLoadTopicDetail',
    })
    this.props.dispatch({
      type: 'topicComment/onLoadCommentList',
    })
  }

  previewImage = (sourceUrl, index) => {
    if(sourceUrl && sourceUrl.length > 0) {
      Taro.previewImage({
        current: sourceUrl[index],
        urls: sourceUrl
      })
    }
  }

  onTopicAttention = () => {
    this.props.dispatch({
      type: 'topicComment/onTopicAttention',
    })
  }

  onTopicPraise = () => {
    this.props.dispatch({
      type: 'topicComment/onTopicPraise',
    })
  }

  onDeleteClick = (id, dialogType, isMySelf, idx, e) => {
    e.stopPropagation()
    this.setState({
      id: id,
      isOpened: true,
      isMySelf: isMySelf,
      dialogType: dialogType,
      dialogTitle: dialogType == 0 ? '删除话题' : '删除评论',
      idx: idx
    })
  }

  onCancelTopicDelete() {
    this.setState({
      isOpened: false
    })
  }

  onConfirmTopicDelete() {
    const {id, dialogType, idx} = this.state
    if (dialogType == 0) {//删除话题
      Api.deleteTopic({id}).then(data => {
        const {code} = data
        if (code == 200) {
          if (process.env.TARO_ENV === 'weapp') {
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
    } else {//删除评论
      this.setState({
        isOpened: false
      })
      let index = idx
      this.props.dispatch({
        type: 'topicComment/onCommentDelete',
        payload: {index, id}
      })
    }
  }

  onCommentPraise = (index, id, praise, e) => {
    this.props.dispatch({
      type: 'topicComment/onCommentPraise',
      payload: {index, id, praise}
    })
    e.stopPropagation()
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

  onShowReplyModal = (id, dialogType, e) => {
    this.setState({
      id: id,
      dialogType: dialogType,//回复评论
      hideModal: false
    })
    e.stopPropagation()
  }

  onHideReplyModal() {
    this.setState({
      id: '',
      content: '',
      dialogType: 0,//评论话题
      hideModal: true
    })
  }

  onInput(e) {
    this.setState({
      content: e.detail.value
    })
  }

  onConfirm(content) {
    const {id, dialogType} = this.state
    this.setState({
      id: '',
      content: '',
      dialogType: 0,//评论话题
      hideModal: true
    })
    if (id && id != '') {
      if (!content || content.trim() == '') {
        Taro.showToast({
          icon: 'none',
          title: '请输入评论内容',
        })
        return
      }
      if (dialogType == 0) {
        this.addComment(id, content)
      } else {
        this.addCommentReply(id, content)
      }
    }
  }

  addComment(id, content) {
    Api.addComment({id, content}).then(data => {
      const {code} = data
      if (code == 200) {
        this.setState({
          content: '',
          hideModal: true
        })
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
        this.setState({
          content: '',
          hideModal: true
        })
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

  onViewReply() {
    const {id, idx} = this.state
    const {commentList} = this.props
    let data = JSON.stringify(commentList[idx])
    Taro.navigateTo({
      url: '/pages/topic/reply?id=' + id + '&data=' + data
    })
    this.onCancelTopicDelete()
  }

  render() {
    const {windowHeight, hideModal, isOpened, isMySelf, dialogType, dialogTitle, content} = this.state
    const {id, topic, commentList} = this.props
    let existTopic = topic.id == null ? false : true
    let scrollHeight = windowHeight
    let topicDataHeight = 53
    if (existTopic) {//border=1px
      scrollHeight = windowHeight - topicDataHeight - 1
    }

    const commentContent = commentList.map((item,index) => {
      console.log('updateTime: ' + item.updateTime)
      return <View key={index} className='comment-item' onClick={this.onDeleteClick.bind(this, item.id, 1, item.myself, index)}>
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
            <View className='comment-time'>{formatTime(new Date(item.createTime))}</View>
            <View className='replay-btn'>
              <Image className='comment-icon' src={commentImg} mode='widthFix' onClick={this.onShowReplyModal.bind(this, item.id, 1)} />
              <View className='praise-btn' onClick={this.onCommentPraise.bind(this, index, item.id, item.praise)}>
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
                  <View className='topic-follow'>
                    {topic.myself == 1 && '删除'}
                    {topic.myself == 0 && `${topic.attention == 1 ? '已关注' : '关注' }`}
                  </View>
                </View>
              </View>
              <View className='topic-content'> {topic.content} </View>
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
                        <Image className='topic-img' src={imageUrl} mode='aspectFill' onClick={this.previewImage.bind(this, topic.sourceUrl, idx)} />
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
              </View>
            </View>

          </ScrollView>
        </View>

        {/*评论底部按钮*/}
        {existTopic ?
          <View className='topic-data' style={{height: `${topicDataHeight}px`, borderTop: `1px solid #EfEEf4`}}>
            <Button className='data-item' openType='share'  >
              <View className='data-img'>
                <Image src={share} mode='widthFix' />
              </View>
              <View className='data'>分享</View>
            </Button>
            <Button className='data-item' onClick={this.onShowReplyModal.bind(this, topic.id, 0)}>
              <View className='data-img'>
                <Image src={commentImg} mode='widthFix' />
              </View>
              <View className='data'>评论</View>
            </Button>
            <Button className='data-item' onClick={this.onTopicPraise.bind(this)}>
              <View className='data-img'>
                <Image src={topic.praise == 1 ? laudSelect : laud} mode='widthFix' />
              </View>
              <View className='data'>赞</View>
            </Button>
          </View> : ''
        }

        {/*书写评论弹窗*/}
        <TextInput isOpened={!hideModal} maxLength={180} placeholder='写评论'
          onCancel={this.onHideReplyModal.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
        />

        {/*删除弹窗*/}
        <AtActionSheet isOpened={isOpened}
          onClose={this.onCancelTopicDelete.bind(this)}
          onCancel={this.onCancelTopicDelete.bind(this)}
          cancelText='取消'
        >
          {dialogType == 1 ?
            <AtActionSheetItem onClick={this.onViewReply.bind(this)}>
              查看回复
            </AtActionSheetItem> : ''
          }

          {isMySelf == 1 ?
            <AtActionSheetItem onClick={this.onConfirmTopicDelete.bind(this)}>
              {dialogTitle}
            </AtActionSheetItem> : ''
          }

        </AtActionSheet>

      </View>
    )
  }
}

export default TopicDetail
