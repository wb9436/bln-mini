import Taro, {Component} from '@tarojs/taro'
import {Image, View, ScrollView} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui'
import 'taro-ui/dist/style/components/action-sheet.scss'
import {connect} from '@tarojs/redux'
import './reply.scss'

import TextInput from '../../components/TextArea'

import * as Api from '../../store/topic/service'
import * as Utils from '../../utils/utils'

import commentBtn from '../../images/topic/comment.png'
import praiseYes from '../../images/public/praise_yes.png'
import praiseNo from '../../images/public/praise_no.png'

@connect(({topicReply, loading}) => ({
  ...topicReply,
  ...loading
}))
class CommentReply extends Component {
  config = {
    navigationBarTitleText: '评论回复'
  }

  constructor() {
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      actType: 0, //0=评论动作, 1=回复动作
      isOpenAct: false, //是否打开动作面板
      replyAct: false, //回复面板
      replyType: 0, //回复类型:0=话题评论, 1=评论回复
      id: '',
      myself: 0,
      index: 0,
    }
  }

  componentDidMount() {
    const {id, data} = this.$router.params
    let comment = JSON.parse( decodeURIComponent(data))
    this.props.dispatch({
      type: 'topicReply/onInitData',
      payload: {id, comment}
    })
    this.props.dispatch({
      type: 'topicReply/onLoadReplyList'
    })
  }

  onCommentPraise(e) {
    e.stopPropagation()
    this.props.dispatch({
      type: 'topicReply/onCommentPraise'
    })
  }

  onReplyPraise(id, index, praise, e) {
    e.stopPropagation()
    this.props.dispatch({
      type: 'topicReply/onReplayPraise',
      payload: {id, index, praise}
    })
  }

  onReplyDelete() {
    const {id, index} = this.state
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'topicReply/onReplyDelete',
      payload: {id, index}
    })
  }

  onOpenReplyAction(replyType, id, e) {
    e.stopPropagation()
    this.setState({isOpenAct: false, replyType, id, replyAct: true})
  }

  onCloseReplyAction() {
    this.setState({replyAct: false})
  }

  onConfirm(content) {
    const {id, replyType} = this.state
    this.setState({replyAct: false})
    if (id && id != '') {
      if (!content || content.trim() == '') {
        Taro.showToast({
          icon: 'none',
          title: '请输入回复内容',
        })
        return
      }
      if (replyType == 0) {
        this.addCommentReply(id, content)
      } else {
        this.addReplyReply(id, content)
      }
    }
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
          type: 'topicReply/onReloadReplyList'
        })
      }
    })
  }

  addReplyReply(id, content) {
    Api.replyCommentReply({id, content}).then(data => {
      const {code} = data
      if (code == 200) {
        Taro.showToast({
          icon: 'success',
          title: '发送成功',
        })
        this.props.dispatch({
          type: 'topicReply/onReloadReplyList'
        })
      }
    })
  }

  onOpenCommentAction(id, index, myself, actType) {
    this.setState({id, index, myself, actType, isOpenAct: true})
  }

  onCloseAction() {
    this.setState({isOpenAct: false})
  }

  onScroll(e) {
    let scrollTop = e.detail.scrollTop
    if (scrollTop <= -80) {
      this.props.dispatch({
        type: 'topicReply/onReloadReplyList'
      })
    }
  }

  appendNextPageList() {
    const {curPageNum, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'topicReply/save',
        payload: {
          curPageNum: curPageNum + 1
        }
      })
      this.props.dispatch({
        type: 'topicReply/onLoadReplyList'
      })
    }
  }

  render() {
    const {windowHeight, actType, isOpenAct, replyAct, id, myself} = this.state
    const {comment, replyList} = this.props

    const replyContent = replyList.map((item, index) => {
      return <View key={index} className='comment-item comment-item_reply' onClick={this.onOpenCommentAction.bind(this, item.id, index, item.myself, 1)}>
        <View className='comment-author'>
          <Image className='author-avatar' mode='widthFix' src={item.avatar} />
        </View>
        <View className='content-container'>
          <View className='reply-data'>
            <View className='reply-info'>
              <View className='author-nickname'>{item.nickname}</View>
              <View className='comment-time'>{Utils.formatTime(new Date(item.createTime))}</View>
            </View>
            <View className='reply-btn'>
              {/*<Image className='comment-icon' src={commentBtn} mode='widthFix' onClick={this.onOpenReplyAction.bind(this, 1, item.id)} />*/}
              <View className={item.praise == 1 ? 'praise-btn has-praised' : 'praise-btn'} onClick={this.onReplyPraise.bind(this, item.id, index, item.praise)}>
                <Image className='praise-icon' src={item.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
                {item.praiseNum}
              </View>
            </View>
          </View>
          <View className='comment-content'>
            {item.oldNickname ? '回复' : ''}
            {item.oldNickname ? <View className='reply-name'>{`@${item.oldNickname}：`}</View> : ''}
            {item.content}
          </View>
        </View>
      </View>
    })

    return (
      <View className='topic-reply-page'>
        <View className='topic-reply-scroll' style={{height: `${windowHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScroll={this.onScroll.bind(this)}
            onScrollToLower={this.appendNextPageList.bind(this)}
          >
            <View className='comment-item' onClick={this.onOpenCommentAction.bind(this, comment.id, 0, comment.myself, 0)}>
              <View className='comment-author'>
                <Image className='author-avatar' mode='widthFix' src={comment.avatar} />
              </View>
              <View className='content-container'>
                <View className='reply-data'>
                  <View className='reply-info'>
                    <View className='author-nickname'>{comment.nickname}</View>
                    <View className='comment-time'>{Utils.formatTime(new Date(comment.createTime))}</View>
                  </View>
                  <View className='reply-btn'>
                    <Image className='comment-icon' src={commentBtn} mode='widthFix' onClick={this.onOpenReplyAction.bind(this, 0, comment.id)} />
                    <View className={comment.praise == 1 ? 'praise-btn has-praised' : 'praise-btn'} onClick={this.onCommentPraise.bind(this)}>
                      <Image className='praise-icon' src={comment.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
                      {comment.praiseNum}
                    </View>
                  </View>
                </View>
                <View className='comment-content'>
                  {comment.content}
                </View>
              </View>
            </View>

            {replyContent}
          </ScrollView>
        </View>

        {/*书写评论弹窗*/}
        <TextInput isOpened={replyAct} maxLength={180} placeholder='写评论'
          onCancel={this.onCloseReplyAction.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
        />

        {/*删除弹窗*/}
        <AtActionSheet isOpened={isOpenAct}
          onClose={this.onCloseAction.bind(this)}
          onCancel={this.onCloseAction.bind(this)}
          cancelText='取消'
        >
          {actType == 0 ?
            <AtActionSheetItem onClick={this.onOpenReplyAction.bind(this, 0, comment.id)}>
              回复
            </AtActionSheetItem> : ''
          }
          {(actType == 1 && myself == 1) ?
            <AtActionSheetItem onClick={this.onReplyDelete.bind(this)}>
              删除回复
            </AtActionSheetItem> : ''
          }
          {actType == 1 ?
            <AtActionSheetItem onClick={this.onOpenReplyAction.bind(this, 1, id)}>
              回复
            </AtActionSheetItem> : ''
          }
        </AtActionSheet>

      </View>
    )
  }
}

export default CommentReply
