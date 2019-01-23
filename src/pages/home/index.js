import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import LoadAll from '../../components/LoadAll'

import shareBtn from '../../images/activity/share.png'
import refreshBtn from '../../images/public/refresh.png'

@connect(({activity, loading}) => ({
  ...activity,
  ...loading
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      windowHeight -= 53
    }
    this.state = {
      windowHeight: windowHeight,
      loading: false
    }
  }

  refresh() {
    this.setState({
      loading: true
    })
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 500)
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'activity/loadActType'
    })
    this.props.dispatch({
      type: 'activity/refreshActivity'
    })
    this.refresh()
  }

  onActTypeChecked(old, category) {
    if (old !== category) {
      this.props.dispatch({
        type: 'activity/save',
        payload: {category}
      })
      this.props.dispatch({
        type: 'activity/refreshActivity'
      })
      this.refresh()
    }
  }

  onRefreshHandler() {
    this.props.dispatch({
      type: 'activity/refreshActivity'
    })
    this.refresh()
  }

  onLoadHandler() {
    const {loadAll} = this.props
    if(!loadAll) {
      this.props.dispatch({
        type: 'activity/loadActivity'
      })
      this.refresh()
    }
  }

  render() {
    const {windowHeight, loading} = this.state
    const {category, actTypes, activityList, loadAll} = this.props
    const typeContent = actTypes.map((item, index) => {
      return <View key={index} className={category === item.name ? 'type-item checked' : 'type-item'}
        onClick={this.onActTypeChecked.bind(this, category, item.name)}
      >{item.name}</View>
    })

    let typeHeight = 39
    let actHeight = windowHeight - 40

    const actContent = activityList.map((item, index) => {
      return <View key={index} className='activity-item'>
        <View className='item-image'>
          <Image className='act-logo' src={item.iconUrl} mode='widthFix' />
        </View>
        <View className='item-content'>
          <View className='item-title'>{`【${item.title}】${item.subTitle}`}</View>
          <View className='item-desc'>
            {item.state != 2 ? `每增加一次阅读可获得${item.money}元` : ''}
          </View>
          <View className='item-data'>
            <View className='data-detail'>
              {item.hot == 1 && <View className='title-icon hot'> 热 </View>}
              {item.hot == 2 && <View className='title-icon new'> 新 </View>}
              100人阅读
            </View>
            <View className='share-btn'>
              <Image className='share-img' src={shareBtn} mode='widthFix' />
              <View className='share-msg'>立即分享</View>
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='home-page'>
        <View className='act-type' style={{height: `${typeHeight}px`}}>
          {typeContent}
        </View>
        <View className='act-list' style={{height: `${actHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollLeft='0'
            scrollTop='0'
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            {actContent}

            {loadAll && <LoadAll />}

          </ScrollView>

          <View className={loading ? 'refresh-btn loading' : 'refresh-btn'} onClick={this.onRefreshHandler.bind(this)}>
            <Image className='refresh-img' src={refreshBtn} mode='widthFix' />
          </View>

        </View>
      </View>
    )
  }
}

export default Home
