import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {AtSwipeAction} from 'taro-ui'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/message/service'
import * as Utils from '../../utils/utils'
import discCircular from '../../images/public/disc-circular.png'

class Message extends Component {
  config = {
    navigationBarTitleText: '消息中心'
  }

  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    this.state = {
      windowHeight: windowHeight,
      options: [
        {
          text: '标记已读',
          style: {
            backgroundColor: '#C6C5CA'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#FF4949'
          }
        }
      ],
      scrollTop: 0,
      type: 0, // 0-我的消息 1-系统通知
      curPageNum: 1,
      pageSize: 15,
      loadAll: false,
      list: [],
      openId: -1
    }
  }

  componentDidMount() {
    this.onRefreshHandler()
  }

  onChangMsgType(curType) {
    const {type} = this.state
    if(type != curType) {
      this.setState({
        type: curType
      }, () => {
        this.onRefreshHandler()
      })
    }
  }

  onRefreshHandler() {
    const {type, pageSize} = this.state
    let curPageNum = this.state.curPageNum
    Api.getMsgList({type, pageSize, curPageNum}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          scrollTop: 0,
          curPageNum: curPageNum,
          loadAll: body.paging.last,
          list: body.array,
        })
      }
    })
  }

  onLoadHandler() {
    const {type, pageSize, loadAll, list} = this.state
    if (!loadAll) {
      let curPageNum = this.state.curPageNum + 1
      Api.getMsgList({type, pageSize, curPageNum}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            loadAll: body.paging.last,
            list: list.concat(body.array),
          })
        }
      })
    }
  }

  onOpenHandler(openId) {
    this.setState({openId})
  }

  onMsgClickHandler(id, index, state, e) {
    this.setState({
      openId: -1
    })
    const {list} = this.state
    let text = e.text
    if (text === '标记已读') {
      if (state != 2) { //2=已读
        Api.readMsgDetail({id}).then(data => {
          if (data.code == 200) {
            list[index].state = 2
            this.setState({
              list: list
            })
          }
        })
      }
    } else if (text === '删除') {
      if (id === list[index].id) {
        Api.deleteMsg({id}).then(data => {
          if (data.code == 200) {
            list.splice(index, 1) //删除index位置一个元素
            this.setState({
              list: list
            })
          }
        })
      }
    }
  }

  render() {
    const {windowHeight, scrollTop, type, loadAll, list, options, openId} = this.state
    let tabHeight = 40
    let border = 1
    let scrollHeight = windowHeight - tabHeight - border

    const content = list.map((item, index) => {
      return <AtSwipeAction key={index} autoClose options={options}
        isOpened={openId == item.id ? true : false}
        onOpened={this.onOpenHandler.bind(this, item.id)}
        onClick={this.onMsgClickHandler.bind(this, item.id, index, item.state)}
      >
        <View className='message-item'>
          <View className='msg-content'>
            <View className='msg-title'>{item.title}</View>
            <View className='msg-date'>{Utils.formatTime(new Date(item.createTime))}</View>
          </View>
          <View className='msg-content'>
            <View className='msg-desc'>{item.content}</View>
            <View className='msg-state'>
              {item.state != 2 && <Image className='state-img' src={discCircular} mode='widthFix' />}
            </View>
          </View>
        </View>
      </AtSwipeAction>
    })

    return (
      <View className='message-page'>
        <View className='msg-tab' style={{height: `${tabHeight}px`, borderBottom: `${border}px solid #EfEEf4`}}>
          <View className={type == 0 ? 'tab-item tab_checked' : 'tab-item'} onClick={this.onChangMsgType.bind(this, 0)}>我的消息</View>
          <View className={type == 1 ? 'tab-item tab__left tab_checked' : 'tab-item tab__left'} onClick={this.onChangMsgType.bind(this, 1)}>系统消息</View>
        </View>

        <ScrollView className='scroll-container message-list'
          style={{height: `${scrollHeight}px`}}
          scrollY
          scrollLeft='0'
          scrollTop={scrollTop}
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {content}

          {loadAll && <LoadAll />}
        </ScrollView>

      </View>
    )
  }
}

export default Message
