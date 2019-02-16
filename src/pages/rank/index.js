import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'

import first from '../../images/rank/first.png'
import second from '../../images/rank/second.png'
import third from '../../images/rank/third.png'
import level from '../../images/rank/level.png'
import avatar from '../../images/public/avatar.png'

class UserRank extends Component {
  config = {
    navigationBarTitleText: '排行榜'
  }
  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    this.state = {
      windowHeight: windowHeight,
      type: 7,//查询类型 1-日榜 2-总榜 3-阅点 4-等级 5-收益金额总榜 7-总阅读榜
      curPageNum: 1,
      pageSize: 15,
      loadAll: false,
      list: [],
      mine: {
        avatar: '',
        growthValue: 0,
        nickname: '',
        readNum: 0,
        sendNum: 0,
        sequence: 0,
        userId: 0,
      },
    }
  }

  componentDidMount() {
    const {type, pageSize, curPageNum} = this.state
    Api.userRankList({type, pageSize, curPageNum}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          loadAll: body.paging.last,
          list: body.totalReadRank,
          mine: {
            avatar: body.mine.avatar,
            growthValue: body.mine.growthValue,
            nickname: body.mine.nickname,
            readNum: body.mine.readNum,
            sendNum: body.mine.sendNum,
            sequence: body.mine.sequence,
            userId: body.mine.userId,
          }
        })
      }
    })
  }

  onLoadHandler() {
    const {type, pageSize, loadAll, list, mine} = this.state
    if (!loadAll) {
      let curPageNum = this.state.curPageNum + 1
      Api.userRankList({type, pageSize, curPageNum}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            loadAll: body.paging.last,
            list: list.concat(body.totalReadRank),
            mine: {
              avatar: body.mine.avatar,
              growthValue: body.mine.growthValue,
              nickname: body.mine.nickname,
              readNum: body.mine.readNum,
              sendNum: body.mine.sendNum,
              sequence: body.mine.sequence,
              userId: body.mine.userId,
            }
          })
        }
      })
    }
  }

  render() {
    const {windowHeight, loadAll, list, mine} = this.state
    let mineHeight = 70
    let scrollHeight = windowHeight - mineHeight

    let myLevelImg = level
    let myLevelMsg = mine.sequence
    if (mine.sequence == 1) {
      myLevelImg = first
      myLevelMsg = ''
    } else if (mine.sequence == 2) {
      myLevelImg = second
      myLevelMsg = ''
    } else if (mine.sequence == 3) {
      myLevelImg = third
      myLevelMsg = ''
    }

    const content = list.map((item, index) => {
      let levelImg = level
      let levelMsg = item.sequence
      if (item.sequence == 1) {
        levelImg = first
        levelMsg = ''
      } else if (item.sequence == 2) {
        levelImg = second
        levelMsg = ''
      } else if (item.sequence == 3) {
        levelImg = third
        levelMsg = ''
      }

      return <View key={index} className='rank-item'>
        <View className='rank-data'>
          <View className='rank-avatar'>
            <Image className='avatar' src={item.avatar || avatar} mode='widthFix' />
          </View>
          <View className='rank-content'>
            <View className='rank-info'>
              <View className='rank-name'>{item.nickname}</View>
              <View className='rank-share'>{`转发数：${item.sendNum}`}</View>
            </View>
            <View className='rank-level'>
              <Image className='level-img' mode='aspectFill' src={levelImg} />
              <View className='level-data'>{`阅读数 ${item.readNum}`}</View>
              <View className='level'>{levelMsg}</View>
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='rank-page'>
        <ScrollView className='scroll-container rank-list'
          style={{height: `${scrollHeight}px`}}
          scrollY
          scrollLeft='0'
          scrollTop='0'
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {content}

          {loadAll && <LoadAll />}
        </ScrollView>

        <View className='mine-rank' style={{height: `${mineHeight}px`}}>
          <View className='user-data'>
            <Image className='avatar' src={mine.avatar || avatar} mode='widthFix' />
            <View className='rank-info'>
              <View className='rank-name'>{mine.nickname}</View>
              <View className='rank-share'>{`转发数：${mine.sendNum}`}</View>
            </View>
          </View>
          <View className='rank-level'>
            <Image className='level-img' mode='aspectFill' src={myLevelImg} />
            <View className='level-data'>{`阅读数 ${mine.readNum}`}</View>
            <View className='level'>{myLevelMsg}</View>
          </View>
        </View>

      </View>
    )
  }
}

export default UserRank
