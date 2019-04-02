import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Video} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui'
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
    this.state = {
      windowHeight: Utils.windowHeight(false),
      nickname: '',
      avatar: '',
      id: '', //话题ID
      index: 0, //话题序号
      actType: 0, //动作类型: 0=删除, 1=查看, 2=投诉
      isOpenAct: false, //是否打开动作面板
      myself: 0, //是否是我的
      attention: 0, //是否关注
    }
  }

  componentDidMount() {
    const {userId, nickname, avatar} = this.$router.params
    this.setState({nickname, avatar : (avatar && avatar !== 'null') ? avatar : ''})
    this.props.dispatch({
      type: 'myTopic/onInitData',
      payload: {userId: userId}
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

  onOpenAction(index, id, myself, attention, e) {
    e.stopPropagation()
    let actType = 1
    let isOpenAct = true
    this.setState({index, id, myself, attention, actType, isOpenAct})
  }

  onOpenReportAction() {
    let actType = 2
    let isOpenAct = true
    this.setState({actType, isOpenAct})
  }

  onCloseAction = () => {
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

  onTopicAttention(index, id, myself, attention, e) {
    e.stopPropagation()
    let isOpenAct = false
    let actType = 0
    if (myself == 1) {
      isOpenAct = true
      this.setState({index, id, actType, isOpenAct})
    } else {
      const {type} = this.state
      this.props.dispatch({
        type: 'myTopic/onTopicAttention',
        payload: {type, index, id, attention}
      })
      this.onCloseAction()
    }
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

  onTopicReport(id, reason) {
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'myTopic/onTopicReport',
      payload: {id, reason}
    })
  }

  onTopicDetail(id) {
    this.onCloseAction()
    Taro.navigateTo({
      url: '/pages/topic/detail?id=' + id
    })
  }

  render() {
    const {windowHeight, nickname, avatar, id, actType, isOpenAct, myself, attention} = this.state
    const topicIndex  = this.state.index

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
            <Image className='author-avatar' mode='widthFix' src={item.avatar || avatarDef} />
            <View className='author-info'>
              <View className='author-name'>{item.nickname}</View>
              <View className='topic-date'>{Utils.timeDesc(parseInt(item.createTime / 1000))}</View>
            </View>
          </View>
          <View className='topic-btn'>
            {item.myself == 1 ?
              <View className='topic-follow' onClick={this.onTopicAttention.bind(this, index, item.id, item.myself, item.attention)}>
                删除
              </View> : ''
            }
            {(item.myself == 0 && item.attention == 0) ?
              <View className='topic-follow' onClick={this.onTopicAttention.bind(this, index, item.id, item.myself, item.attention)}>
                关注
              </View> : ''
            }
            <View className='topic-more' onClick={this.onOpenAction.bind(this, index, item.id, item.myself, item.attention)}>
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

        {(actType == 0 && isOpenAct) ?
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            <AtActionSheetItem onClick={this.onTopicDelete.bind(this)}>
              删除话题
            </AtActionSheetItem>
          </AtActionSheet> : ''
        }

        {(actType == 1 && isOpenAct) ?
          <AtActionSheet isOpened={isOpenAct}
            onClose={this.onCloseAction.bind(this)}
            onCancel={this.onCloseAction.bind(this)}
            cancelText='取消'
          >
            {(myself == 0 && attention == 1) ?
              <AtActionSheetItem onClick={this.onTopicAttention.bind(this, topicIndex, id, myself, attention)}>
                取消关注
              </AtActionSheetItem> : ''
            }
            <AtActionSheetItem onClick={this.onTopicDetail.bind(this, id)}>
              评论
            </AtActionSheetItem>
            {myself == 0 ?
              <AtActionSheetItem onClick={this.onOpenReportAction.bind(this)}>
                投诉
              </AtActionSheetItem> : ''
            }
          </AtActionSheet> : ''
        }

        {(actType == 2 && isOpenAct) ?
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
          </AtActionSheet> : ''
        }

      </View>
    )
  }
}

export default MyTopic
