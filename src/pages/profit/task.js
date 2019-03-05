import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import './index.scss'

import LoadAll from '../../components/LoadAll/index'

import * as Api from '../../store/profit/service'
import * as Utils from '../../utils/utils'

import complete from '../../images/public/complete.png'
import doing from '../../images/public/doing.png'

class TaskProfit extends Component {
  config = {
    navigationBarTitleText: '任务收益'
  }
  constructor() {
    super(...arguments)
    this.state = {
      curPageNum: 1,
      pageSize: 10,
      loadAll: false,
      list: [],
    }
  }

  componentDidMount() {
    const {pageSize, curPageNum} = this.state
    Api.taskProfit({pageSize, curPageNum}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          loadAll: body.paging.last,
          list: body.array,
        })
      }
    })
  }

  onLoadHandler() {
    const {pageSize, loadAll, list} = this.state
    if (!loadAll) {
      let curPageNum = this.state.curPageNum + 1
      Api.taskProfit({pageSize, curPageNum}).then(data => {
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

  render() {
    const {loadAll, list} = this.state

    const content = list.map((item, index) => {
      return <View key={index} className='task-item'>
        <Image className='task-img' src={item.iconUrl} mode='widthFix' />
        <View className='task-content'>
          <View className='task-title'>
            {item.hot == 1 && <View className='font-icon hot'>热</View>}
            {item.hot == 2 && <View className='font-icon new'>新</View>}
            {`【${item.title}】${item.subTitle}`}
          </View>
          <View className='task-data'>
            <View className='data-detail'>点击量: <View className='data-num'>{item.hits}</View></View>
            <View className='data-detail'>有效数: <View className='data-num'>{item.visit}</View></View>
            <View className='data-detail'>分享数: <View className='data-num'>{item.share}</View></View>
          </View>
          <View className='act-task-state'>
            <Image className='task-icon' src={item.state == 1 ? doing : complete} mode='widthFix' />
            <View className={item.state == 1 ? 'state-desc' : 'state-desc state-desc_over'}>{item.state == 1 ? '进行中' : '已结束'}</View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='task-page'>
        <ScrollView className='scroll-container task-list'
          scrollY
          scrollLeft='0'
          scrollTop='0'
          scrollWithAnimation
          onScrollToLower={this.onLoadHandler.bind(this)}
        >
          {content}

          <LoadAll loadAll={loadAll} />
        </ScrollView>

      </View>
    )
  }
}

export default TaskProfit
