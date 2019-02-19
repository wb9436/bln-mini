import Taro, {Component} from '@tarojs/taro'
import {Image, View, ScrollView} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui'
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
      height: Taro.getSystemInfoSync().windowHeight,
      id: '',
      hideModal: true,
      content: '',//评论内容
      dialogType: 0,//0=回复评论,1=回复回复
      isOpened: false,//是否打开弹窗
      index: 0,
    }
  }

  componentDidMount() {
    const {id, data} = this.$router.params
    let comment = JSON.parse(data)
    this.props.dispatch({
      type: 'topicReply/onInitData',
      payload: {id, comment}
    })
    this.props.dispatch({
      type: 'topicReply/onLoadReplyList'
    })
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
          title: '请输入回复内容',
        })
        return
      }
      if (dialogType == 0) {
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
        this.setState({
          content: '',
          hideModal: true
        })
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
        this.setState({
          content: '',
          hideModal: true
        })
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

  onCommentPraise(e) {
    this.props.dispatch({
      type: 'topicReply/onCommentPraise'
    })
    e.stopPropagation()
  }

  onReplayPraise(id, index, praise, e) {
    this.props.dispatch({
      type: 'topicReply/onReplayPraise',
      payload: {id, index, praise}
    })
    e.stopPropagation()
  }

  onShowDeleteReply(id, myself, index) {
    if(myself == 1) {
      this.setState({
        id: id,
        isOpened: true,
        index: index
      })
    }
  }

  onCancelReplyDelete() {
    this.setState({
      isOpened: false
    })
  }

  onConfirmReplyDelete() {
    const {id, index} = this.state
    this.setState({
      id: '',
      isOpened: false,
      index: 0
    })
    this.props.dispatch({
      type: 'topicReply/onReplyDelete',
      payload: {id, index}
    })
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
    const {hideModal, content, isOpened, height} = this.state
    const {comment, replyList} = this.props

    const replyContent = replyList.map((item, index) => {
      return <View key={index} className='reply-item reply-item--reply' onClick={this.onShowDeleteReply.bind(this, item.id, item.myself, index)}>
        <View className='user-avatar'>
          <View className='avatar-container'>
            <Image mode='widthFix' src={item.avatar} />
          </View>
        </View>
        <View className='content'>
          <View className='nickname'>{item.nickname}</View>
          <View className='content-detail'>{item.content}</View>
          <View className='reply-data'>
            <View className='time'>{Utils.formatTime(new Date(item.updateTime))}</View>
            <View className='btn'>
              <View className='reply-data' onClick={this.onShowReplyModal.bind(this, item.id, 1)}>
                <View className='reply-btn'>
                  <Image src={commentBtn} mode='widthFix' />
                </View>
              </View>
              <View className='praise-data' onClick={this.onReplayPraise.bind(this, item.id, index, item.praise)}>
                <View className='praise-btn'>
                  <Image src={item.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
                </View>
                <View className='praise-num'>{item.praiseNum}</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='reply-container'>
        <ScrollView className='reply-scroll'
          scrollY
          scrollWithAnimation
          style={{height: `${height}Px`}}
          onScroll={this.onScroll.bind(this)}
          onScrollToLower={this.appendNextPageList.bind(this)}
        >
          <View className='reply-item'>
            <View className='user-avatar'>
              <View className='avatar-container'>
                <Image mode='widthFix' src={comment.avatar} />
              </View>
            </View>
            <View className='content'>
              <View className='nickname'>{comment.nickname}</View>
              <View className='content-detail'>{comment.content}</View>
              <View className='reply-data'>
                <View className='time'>{Utils.formatTime(new Date(comment.updateTime))}</View>
                <View className='btn'>
                  <View className='reply-data' onClick={this.onShowReplyModal.bind(this, comment.id, 0)}>
                    <View className='reply-btn'>
                      <Image src={commentBtn} mode='widthFix' />
                    </View>
                  </View>
                  <View className='praise-data' onClick={this.onCommentPraise.bind(this)}>
                    <View className='praise-btn'>
                      <Image src={comment.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
                    </View>
                    <View className='praise-num'>{comment.praiseNum}</View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {replyContent}
        </ScrollView>

        {/*书写评论弹窗*/}
        <TextInput isOpened={!hideModal} maxLength={180} placeholder='写回复'
          onCancel={this.onHideReplyModal.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
        />

        {/*删除弹窗*/}
        <AtActionSheet isOpened={isOpened}
          onClose={this.onCancelReplyDelete.bind(this)}
          onCancel={this.onCancelReplyDelete.bind(this)}
          cancelText='取消'
        >

          <AtActionSheetItem onClick={this.onConfirmReplyDelete.bind(this)}>
            删除回复
          </AtActionSheetItem>

        </AtActionSheet>

      </View>
    )
  }
}

export default CommentReply
