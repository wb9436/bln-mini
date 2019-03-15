import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import WxShare from '../../components/WxShare/index'
import LoadAll from '../../components/LoadAll/index'

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

  onActivityClick(actId, title, iconUrl) {
    Taro.navigateTo({
      url: `/pages/activityDetail/index?type=0&title=${title}&actId=${actId}&imageUrl=${iconUrl}`
      // url: `/pages/activityDetail/detail?actId=${actId}`
      // url: `/pages/activityDetail/task?type=0&title=${title}&actId=${actId}&userId=${Taro.getStorageSync('userId')}`
    })
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
      return <View key={index} className='activity-item' onClick={this.onActivityClick.bind(this, item.actId, item.subTitle, item.iconUrl)}>
        <View className='activity-view'>
          <Image className='activity-logo' src={item.iconUrl} mode='scaleToFill' />
        </View>
        <View className='activity-content'>
          <View className='activity-title'>
            {item.hot == 1 && <View className='font-icon hot'> 热 </View>}
            {item.hot == 2 && <View className='font-icon new'> 新 </View>}
            {`【${item.title}】${item.subTitle}`}
          </View>
          <View className='activity-profit'>
            {(item.free === 0 && item.money > 0) ? `每增加一次阅读可获得${item.money}元` : ''}
          </View>
          <View className='activity-data'>
            <View className='activity-hits'>
              {item.hits}人阅读
            </View>
            <View className={item.state == 1 ? 'activity-btn' : 'activity-btn activity-over'}>
              {item.state == 1 ? '立即分享' : '活动已结束'}
            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='home-page'>
        {process.env.TARO_ENV === 'h5' ? <WxShare /> : ''}

        <View className='act-type' style={{height: `${typeHeight}px`}}>
          {typeContent}
        </View>
        <View className='act-list' style={{height: `${actHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            // scrollTop={scrollTop}
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            {actContent}

            <LoadAll loadAll={loadAll} />
          </ScrollView>

          <Image className={loading ? 'refresh-btn loading' : 'refresh-btn'} src={refreshBtn}
            onClick={this.onRefreshHandler.bind(this)}
          />

        </View>
      </View>
    )
  }
}

export default Home
