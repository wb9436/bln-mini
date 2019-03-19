import Taro, {Component} from '@tarojs/taro'
import {View, Image, ScrollView} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'
import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'

import logo from '../../images/public/logo.png'
import receiveNo from '../../images/redBag/receive-no.png'
import receiveYes from '../../images/redBag/receive-yes.png'

class RedBag extends Component {
  config = {
    navigationBarTitleText: '我的红包'
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      curPageNum: 1,
      pageSize: 10,
      loadAll: false,
    }
  }

  componentDidMount() {
    const {curPageNum, pageSize} = this.state
    Api.awardList({curPageNum, pageSize}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          list: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  onLoadHandler() {
    const {list, curPageNum, pageSize, loadAll} = this.state
    if (!loadAll) {
      Api.awardList({curPageNum: curPageNum + 1, pageSize}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            list: list.concat(body.array),
            loadAll: body.paging.last,
            curPageNum: curPageNum + 1
          })
        }
      })
    }
  }

  onOpenRedAward(index, id, state) {
    if (state != 1) {
      const {list} = this.state
      Api.awardReceive({id}).then(data => {
        if (data.code == 200) {
          list[index].state = 1
          this.setState({
            list: list
          })
        }
      })
    }
  }

  render() {
    const {list, loadAll} = this.state
    const lastIndex = (list && list.length > 0) ? (list.length - 1) : 0

    const listContent = list.map((item, index) => {
      let isLast = (index == lastIndex) ? true : false
      return <View key={index} className={isLast ? 'red-item red-item_last' : 'red-item'}>
        <Image className='logo-avatar' src={logo} mode='widthFix' />
        <View className='red-receive'>
          <Image className='red-state-img' src={item.state == 1 ? receiveYes : receiveNo} mode='widthFix' />
          <View className='red-content' onClick={this.onOpenRedAward.bind(this, index, item.id, item.state)}>
            <View className='red-money'>
              <View className='red-desc'>
                {item.state == 1 ? `已领取${Utils.formatPricePoint(item.money)}元红包` : item.msg}
              </View>
              <View className='red-time'>{Utils.formatTime(new Date(item.createTime))}</View>
            </View>
            <View className='red-type'>{Utils.redType(item.type)}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='red-page'>
        <ScrollView className='scroll-container'
          scrollY
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {listContent}

          <LoadAll loadAll={loadAll} />
        </ScrollView>
      </View>
    )
  }
}

export default RedBag
