import Taro, {Component} from '@tarojs/taro'
import {View, Input, ScrollView, Image} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './index.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

import popupIcon from '../../images/business/popup2.png'

class PromoterBusiness extends Component {
  config = {
    navigationBarTitleText: '推广员'
  }
  constructor() {
    super(...arguments)
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      businessList: [],
      pageSize: 20,
      curPageNum: 1,
      loadAll: false,
      input: '', //商家编号
      popup: false,
      top: 0,
      userId: '',
    }
  }

  componentDidMount() {
    const {curPageNum, pageSize} = this.state
    Api.agentBusinessList({curPageNum, pageSize}).then(data => {
      const {code, body} = data
      if (code == 200) {
        this.setState({
          businessList: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  onShowPopup(userId, e) {
    const {popup} = this.state
    let top = 0
    if (e && e.y) {
      top = e.y - 107
    }
    this.setState({
      popup: !popup,
      top: top,
      userId: userId,
    })
  }

  onInputHandler(e) {
    this.setState({
      input: e.detail.value
    })
  }

  onCleanInput() {
    this.setState({
      input: ''
    })
    const {curPageNum, pageSize} = this.state
    Api.agentBusinessList({curPageNum, pageSize}).then(data => {
      console.log(data)
      const {code, body} = data
      if (code == 200) {
        this.setState({
          businessList: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }

  onInputConfirm() {
    const {input, curPageNum, pageSize} = this.state
    if(Utils.isNumber(input)) {
      Api.agentBusinessList({curPageNum, pageSize, input}).then(data => {
        console.log(data)
        const {code, body} = data
        if (code == 200) {
          this.setState({
            businessList: body.array,
            loadAll: body.paging.last
          })
        }
      })
    }
  }

  onLookDayData() {
    const{userId} = this.state
    Taro.navigateTo({
      url: '/pages/promoter/day?userId=' + userId
    })
  }

  onLookMonthData() {
    const{userId} = this.state
    Taro.navigateTo({
      url: '/pages/promoter/month?userId=' + userId
    })
  }

  onLoadHandler() {
    const {curPageNum, pageSize, businessList, loadAll} = this.state
    if (!loadAll) {
      Api.agentBusinessList({curPageNum: curPageNum + 1, pageSize}).then(data => {
        const {code, body} = data
        if (code == 200) {
          this.setState({
            curPageNum: curPageNum + 1,
            businessList: businessList.concat(body.array),
            loadAll: body.paging.last
          })
        }
      })
    }
  }

  render() {
    const {windowHeight, businessList, input, popup, top} = this.state
    const headerHeight = 55
    const titleHeight = 30
    const scrollHeight = windowHeight - headerHeight - titleHeight
    const hasInput = (input && input.trim() !== '') ? true : false

    const businessContent = businessList.map((item, index) => {
      let stateDesc = ''
      if (item.state == -2) {
        stateDesc = '不通过'
      } else if (item.state == -1) {
        stateDesc = '待审核'
      } else if (item.state == 0 || item.state == 1) {
        stateDesc = '通过'
      }
      return <View key={index} className='list-item'>
        <View className='item-container item-container_content'>
          <View className='business-id'>{item.userId}</View>
          <View className='business-name'>{item.name}</View>
          <View className='business-baState'>{item.baState == 1 ? '是' : '否'}</View>
          <View className='business-state'>{stateDesc}</View>
          <View className='business-act' onClick={this.onShowPopup.bind(this, item.userId)}>
            <AtIcon value='chevron-down' color='#484848' size='16' />
          </View>
        </View>
      </View>
    })

    return (
      <View className='promoter-business-page' style={{height: `${windowHeight}px`}}>
        <View className='promoter-header' style={{height: `${headerHeight}px`}}>
          <View className='header-input'>
            <View className='header-center'>
              <AtIcon value='search' color='#B5B5B5' size='18' />
              <Input className='search-input' placeholder='输入商家编号' placeholderClass='input-placeholder'
                value={input} type='number' onInput={this.onInputHandler.bind(this)}
                onBlur={this.onInputConfirm.bind(this)} onConfirm={this.onInputConfirm.bind(this)}
              />
            </View>
            <View className='header-right' onClick={this.onCleanInput.bind(this)}>
              {hasInput ? <AtIcon value='close-circle' color='#B5B5B5' size='15' /> : ''}
            </View>
          </View>
        </View>
        <View className='list-title' style={{height: `${titleHeight}px`}}>
          <View className='item-container item-container_title'>
            <View className='business-id'>商家编号</View>
            <View className='business-name'>商家名称</View>
            <View className='business-baState'>加入商圈</View>
            <View className='business-state'>状态</View>
            <View className='business-act'>操作</View>
          </View>
        </View>

        <View className='list-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            {businessContent}
          </ScrollView>
        </View>

        {popup ?
          <View className={popup ? 'popup-layout popup-layout--active' : 'popup-layout'} onClick={this.onShowPopup.bind(this)}>
            <View className='business-popup' style={{top: `${top}px`}}>
              <Image className='popup-icon' src={popupIcon} mode='widthFix' />

              <View className='popup-content'>
                <View className='popup-item popup-item--border' onClick={this.onLookDayData.bind(this)}>每日数据</View>
                <View className='popup-item popup-item--border' onClick={this.onLookMonthData.bind(this)}>每月数据</View>
              </View>
            </View>
          </View> : ''
        }

      </View>
    )
  }
}

export default PromoterBusiness
