import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Video} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui'
import 'taro-ui/dist/style/components/action-sheet.scss'
import {connect} from '@tarojs/redux'
import './index.scss'

import * as Utils from '../../utils/utils'

import avatarDef from '../../images/public/avatar.png'
import moreBtn from '../../images/topic/more.png'
import shareBtn from '../../images/topic/share.png'
import commentBtn from '../../images/topic/comment.png'
import praiseYes from '../../images/public/praise_yes.png'
import praiseNo from '../../images/public/praise_no.png'
import none from '../../images/topic/none.png'

@connect(({myTopic, loading}) => ({
  ...myTopic,
  ...loading
}))
class MyTopic extends Component {
  config = {
    navigationBarTitleText: '我的话题'
  }

  constructor() {
    super(...arguments)
    let userInfo = Taro.getStorageSync('user')
    this.state = {
      windowHeight: Utils.windowHeight(false),
      nickname: userInfo.nickname,
      avatar: userInfo.avatar,
      id: '', //话题ID
      index: 0, //话题序号
      actType: 0, //动作类型: 0=删除, 1=查看, 2=投诉
      isOpenAct: false, //是否打开动作面板
    }
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'myTopic/onInitData',
    })
    this.props.dispatch({
      type: 'myTopic/onLoadTopicList'
    })
  }

  componentDidShow() {
    this.props.dispatch({
      type: 'myTopic/onInitData',
    })
    this.props.dispatch({
      type: 'myTopic/onLoadTopicList'
    })
  }

  appendNextPageList() {
    const {curPageNum, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'myTopic/save',
        payload: {curPageNum: curPageNum + 1}
      })
      this.props.dispatch({
        type: 'myTopic/onLoadTopicList'
      })
    }
  }

  onPreviewImage(sourceUrl, idx, e) {
    e.stopPropagation()
    if(sourceUrl && sourceUrl.length > 0) {
      Taro.previewImage({
        current: sourceUrl[idx],
        urls: sourceUrl
      })
    }
  }

  onTopicDetail(id) {
    Taro.navigateTo({
      url: '/pages/topic/detail?id=' + id
    })
  }

  onOpenAction(index, id, e) {
    e.stopPropagation()
    let actType = 1
    let isOpenAct = true
    this.setState({index, id, actType, isOpenAct})
  }

  onCloseAction() {
    this.setState({isOpenAct: false})
  }

  onTopicDelete() {
    const {index, id} = this.state
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'myTopic/onTopicDelete',
      payload: {index, id}
    })
  }

  onTopicPraise(index, id, praise, e) {
    e.stopPropagation()
    this.props.dispatch({
      type: 'myTopic/onTopicPraise',
      payload: {
        index, id, praise
      }
    })
  }

  render() {
    const {windowHeight, nickname, avatar, id, actType, isOpenAct} = this.state
    const {attentionNum, topicNum, topicList} = this.props
    let infoHeight = 140
    let totalHeight = 30
    let scrollHeight = windowHeight - infoHeight - totalHeight
    let noTopic = true
    if(topicList && topicList.length > 0) {
      noTopic = false
    }

    const topicContent = topicList.map((item, index) => {
      let sourceUrl = []
      if ((item.type == 1 || item.type == 2) && item.sourceUrl.length > 0) {
        sourceUrl = item.sourceUrl
      }
      return <View key={index} className='topic-item list-item' onClick={this.onTopicDetail.bind(this, item.id)}>
        <View className='topic-author'>
          <View className='author-info'>
            <Image className='author-avatar' mode='widthFix' src={item.avatar || avatar} />
            <View className='author-info'>
              <View className='author-name'>{item.nickname}</View>
              <View className='topic-date'>{Utils.timeDesc(parseInt(item.createTime / 1000))}</View>
            </View>
          </View>
          <View className='topic-btn'>
            <View className='topic-more' onClick={this.onOpenAction.bind(this, index, item.id)}>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
        </View>
        <View className='topic-content'> {item.content ? item.content : ''} </View>
        <View className='topic-media'>
          {item.type == 2 && sourceUrl.length > 0 ?
            <Video
              src={item.sourceUrl[0]}
              controls
              poster='http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
              initialTime='0'
              id='video'
              loop
              muted
            /> : ''
          }
          {item.type == 1 ?
            <View className='topic-img-list'>
              {sourceUrl.map((imageUrl, idx) => (
                <View key={idx} className='topic-img-box'>
                  <Image className='topic-img' src={imageUrl} mode='aspectFill' onClick={this.onPreviewImage.bind(this, sourceUrl, idx)} />
                </View>
              ))}
            </View> : ''
          }
        </View>
        <View className='topic-hits'> {`${item.hitNum}次浏览`} </View>
        <View className='topic-data'>
          <View className='topic-data-item' >
            <Image className='topic-data-icon' src={shareBtn} mode='widthFix' />
            <View className='topic-data-num'>{item.shareNum}</View>
          </View>
          <View className='topic-data-item'>
            <Image className='topic-data-icon' src={commentBtn} mode='widthFix' />
            <View className='topic-data-num'>{item.commentNum}</View>
          </View>
          <View className='topic-data-item' onClick={this.onTopicPraise.bind(this, index, item.id, item.praise)}>
            <Image className='topic-data-icon' src={item.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
            <View className={item.praise == 1 ? 'topic-data-num topic-data-item_checked' : 'topic-data-num'}>{item.praiseNum}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='my-topic-page'>
        <View className='my-info' style={{height: `${infoHeight}px`}}>
          <Image className='avatar' src={avatar || avatarDef} mode='widthFix' />
          <View className='nickname'>{nickname}</View>
          <View className='my-topic'>
            <View className='my-attention'>{`我的关注 ${attentionNum}`}</View>
            <View className='line'></View>
            <View className='topic-num'>{`全部话题 ${topicNum}`}</View>
          </View>
        </View>
        <View className='total-topic' style={{height: `${totalHeight}px`, lineHeight: `${totalHeight}px`}}>{`全部话题（${topicNum}）`}</View>

        <View className='topic-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScrollToLower={this.appendNextPageList.bind(this)}
          >
            {topicContent}

            {noTopic ?
              <View className='no-topic'>
                <Image className='none-icon' src={none} mode='widthFix' />
                <View className='none-title'>暂无话题</View>
              </View> : ''
            }
          </ScrollView>
        </View>

        {actType == 1 &&
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onTopicDetail.bind(this, id)}>
              评论
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.onTopicDelete.bind(this)}>
              删除话题
            </AtActionSheetItem>
          </AtActionSheet>
        }

      </View>
    )
  }
}

export default MyTopic
