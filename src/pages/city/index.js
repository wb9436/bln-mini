import Taro, {Component} from '@tarojs/taro'
import {View, Image, ScrollView, Video} from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'

import AddressDialog from '../../components/Address'
import Loading from '../../components/Loading/index'
import LoadAll from '../../components/LoadAll/index'

import * as Utils from '../../utils/utils'

import avatar from '../../images/public/avatar.png'
import addressImg from '../../images/topic/address.png'
import addBtn from '../../images/topic/addBtn.png'
import shareBtn from '../../images/topic/share.png'
import commentBtn from '../../images/topic/comment.png'
import praiseYes from '../../images/public/praise_yes.png'
import praiseNo from '../../images/public/praise_no.png'
import moreBtn from '../../images/topic/more.png'

@connect(({cityTopic, loading}) => ({
  ...cityTopic,
  ...loading
}))
class CityTopic extends Component {
  config = {
    navigationBarTitleText: '同城'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      windowHeight -= 53
    }
    this.state = {
      windowHeight: windowHeight,//可使用窗口高度
      area: '', //话题地址
      city: '浦东新区', //当前城市
      type: 0, //话题类型: 0=话题, 1=关注
      id: '', //话题ID
      index: 0, //话题序号
      actType: 0, //动作类型: 0=删除, 1=查看, 2=投诉
      isOpenAct: false, //是否打开动作面板
      isOpenAdd: false, //是否打开地址修改
    }
  }

  componentWillMount() {
    let area = Taro.getStorageSync('topicAddress') || Taro.getStorageSync('address') || '上海市 上海市 浦东新区'
    let cityArr = area.split(' ')
    let city = cityArr[cityArr.length - 1]
    this.setState({area, city})
    this.props.dispatch({
      type: 'cityTopic/onInitData',
      payload: {area}
    })
    this.props.dispatch({
      type: 'cityTopic/onLoadTopicList'
    })
  }

  onCheckTopicType(typeValue) {
    const {type, area} = this.state
    if (typeValue !== type) {
      this.setState({type: typeValue})
      this.props.dispatch({
        type: 'cityTopic/onInitData',
        payload: {area}
      })
      if (typeValue == 0) {
        this.props.dispatch({
          type: 'cityTopic/onLoadTopicList'
        })
      } else {
        this.props.dispatch({
          type: 'cityTopic/onLoadAttentionTopicList'
        })
      }
    }
  }

  onOpenAddress() {
    this.setState({isOpenAdd: true})
  }

  onCancelAddress() {
    this.setState({isOpenAdd: false})
  }

  onConfirmAddress(address) {
    const {area, type} = this.state
    if (area !== address) {
      Taro.setStorageSync('topicAddress', address)
      let cityArr = area.split(' ')
      let city = cityArr[cityArr.length - 1]
      this.setState({area: address, city: city, isOpenAdd: false})
      this.props.dispatch({
        type: 'cityTopic/onChangArea',
        payload: {area: address}
      })
      if (type == 0) {
        this.props.dispatch({
          type: 'cityTopic/save',
          payload: {loadAll: false, curPageNum: 1, topicList: []}
        })
        this.props.dispatch({
          type: 'cityTopic/onLoadTopicList'
        })
      }
    }
  }

  appendNextPageList() {
    const {curPageNum, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'cityTopic/save',
        payload: {curPageNum: curPageNum + 1}
      })
      const {type} = this.state
      if (type == 0) {
        this.props.dispatch({
          type: 'cityTopic/onLoadTopicList'
        })
      } else {
        this.props.dispatch({
          type: 'cityTopic/onLoadAttentionTopicList'
        })
      }
    }
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
        type: 'cityTopic/onTopicAttention',
        payload: {type, index, id, attention}
      })
    }
  }

  onOpenAction(index, id, myself, e) {
    e.stopPropagation()
    let actType = 1
    let isOpenAct = true
    this.setState({index, id, myself, actType, isOpenAct})
  }

  onOpenReportAction() {
    let actType = 2
    let isOpenAct = true
    this.setState({actType, isOpenAct})
  }

  onCloseAction() {
    this.setState({isOpenAct: false})
  }

  onTopicReport(id, reason) {
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'cityTopic/onTopicReport',
      payload: {id, reason}
    })
  }

  onTopicDelete() {
    const {index, id} = this.state
    this.setState({isOpenAct: false})
    this.props.dispatch({
      type: 'cityTopic/onTopicDelete',
      payload: {index, id}
    })
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

  onTopicPraise(index, id, praise, e) {
    e.stopPropagation()
    this.props.dispatch({
      type: 'cityTopic/onTopicPraise',
      payload: {
        index, id, praise
      }
    })
  }

  onTopicDetail(id) {
    Taro.navigateTo({
      url: '/pages/topic/detail?id=' + id
      // url: '/pages/topic/share?id=' + id
    })
  }

  onAddTopic() {
    Taro.navigateTo({
      url: '/pages/topic/add'
    })
  }

  render() {
    const {windowHeight, area, city, type, id, myself, actType, isOpenAct, isOpenAdd} = this.state
    const {topicList, loadAll, effects} = this.props
    let navHeight = 43
    let scrollHeight = windowHeight - 45

    const topicContent = topicList.map((item, index) => {
      let sourceUrl = []
      if ((item.type == 1 || item.type == 2) && item.sourceUrl.length > 0) {
        sourceUrl = item.sourceUrl
      }
      return <View key={index} className='topic-item' onClick={this.onTopicDetail.bind(this, item.id)}>
        <View className='topic-author'>
          <View className='author-info'>
            <Image className='author-avatar' mode='widthFix' src={item.avatar || avatar} />
            <View className='author-info'>
              <View className='author-name'>{item.nickname}</View>
              <View className='author-desc'>{Utils.timeDesc(parseInt(item.createTime / 1000))}</View>
            </View>
          </View>
          <View className='topic-btn'>
            <View className='topic-follow' onClick={this.onTopicAttention.bind(this, index, item.id, item.myself, item.attention)}>
              {item.myself == 1 ? '删除' : ''}
              {item.myself == 0 ? `${item.attention == 1 ? '已关注' : '关注' }` : ''}
            </View>
            <View className='topic-more' onClick={this.onOpenAction.bind(this, index, item.id, item.myself)}>
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
        <View className='topic-hit'> {`${item.hitNum}次浏览`} </View>
        <View className='topic-data'>
          <View className='topic-data-item' >
            <Image className='topic-data-icon' src={shareBtn} mode='widthFix' />
            <View className='item-data'>{item.shareNum}</View>
          </View>
          <View className='topic-data-item'>
            <Image className='topic-data-icon' src={commentBtn} mode='widthFix' />
            <View className='item-data'>{item.commentNum}</View>
          </View>
          <View className='topic-data-item' onClick={this.onTopicPraise.bind(this, index, item.id, item.praise)}>
            <Image className='topic-data-icon' src={item.praise == 1 ? praiseYes : praiseNo} mode='widthFix' />
            <View className={item.praise == 1 ? 'item-data item-data_checked' : 'item-data'}>{item.praiseNum}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='city-topic-page'>
        <View className='topic-nav' style={{height: `${navHeight}px`}}>
          <View className='topic-city' onClick={this.onOpenAddress.bind(this)}>
            <Image className='nav-icon' src={addressImg} mode='widthFix' />
            <View className='city-name'>{city}</View>
          </View>
          <View className='topic-type'>
            <View className={type == 0 ? 'type-item type-item_active' : 'type-item'} onClick={this.onCheckTopicType.bind(this, 0)}>话题</View>
            <View className={type == 1 ? 'type-item type-item_active' : 'type-item'} onClick={this.onCheckTopicType.bind(this, 1)}>关注</View>
          </View>
          <View className='topic-add' onClick={this.onAddTopic.bind(this)}>
            <Image className='nav-icon' src={addBtn} mode='widthFix' />
          </View>
        </View>

        <View className='topic-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className={isOpenAdd ? 'scroll-container stop-scroll' : 'scroll-container'}
            scrollY
            scrollWithAnimation
            onScrollToLower={this.appendNextPageList.bind(this)}
          >
            {topicContent}
            <Loading loading={effects['cityTopic/onLoadTopicList'] || effects['cityTopic/onLoadAttentionTopicList']} />
            <LoadAll loadAll={loadAll} />
          </ScrollView>
        </View>

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
            <AtActionSheetItem onClick={this.onTopicDetail.bind(this, id)}>
              评论
            </AtActionSheetItem>
            {myself == 0 ?
              <AtActionSheetItem onClick={this.onOpenReportAction.bind(this)}>
                投诉
              </AtActionSheetItem> : ''
            }
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

        {/*话题地址修改*/}
        <AddressDialog isOpened={isOpenAdd} address={area} onCancel={this.onCancelAddress.bind(this)}
          onConfirmAddress={this.onConfirmAddress.bind(this)}
        />
      </View>
    )
  }
}

export default CityTopic
