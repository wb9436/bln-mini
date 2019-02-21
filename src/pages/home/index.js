import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import WxShare from '../../components/WxShare/index'
import LoadAll from '../../components/LoadAll/index'

import shareBtn from '../../images/activity/share.png'
import overtimeBtn from '../../images/activity/overtime.png'
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
    // this.props.dispatch({
    //   type: 'activity/save',
    //   payload: {activityList: []}
    // })
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
      // url: `/pages/activityDetail/task?type=0&title=${title}&actId=${actId}&userId=${Taro.getStorageSync('userId')}`
    })
  }

  render() {
    const {windowHeight, loading} = this.state
    const {category, actTypes, activityList, loadAll, scrollTop} = this.props
    const typeContent = actTypes.map((item, index) => {
      return <View key={index} className={category === item.name ? 'type-item checked' : 'type-item'}
        onClick={this.onActTypeChecked.bind(this, category, item.name)}
      >{item.name}</View>
    })

    let typeHeight = 39
    let actHeight = windowHeight - 40

    const actContent = activityList.map((item, index) => {
      return <View key={index} className='activity-item' onClick={this.onActivityClick.bind(this, item.actId, item.subTitle, item.iconUrl)}>
        <View className='item-image'>
          <Image className='act-logo' src={item.iconUrl} mode='scaleToFill' />
        </View>
        <View className='item-content'>
          <View className='item-title'>{`【${item.title}】${item.subTitle}`}</View>
          <View className='item-desc'>
            {item.state != 2 && item.money > 0 ? `每增加一次阅读可获得${item.money}元` : ''}
          </View>
          <View className='item-data'>
            <View className='data-detail'>
              {item.hot == 1 && <View className='title-icon hot'> 热 </View>}
              {item.hot == 2 && <View className='title-icon new'> 新 </View>}
              {item.hits}人阅读
            </View>
            <View className='share-btn' style={{backgroundImage: `url(${item.state == 1 ? shareBtn : overtimeBtn})`}}>
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
            scrollTop={scrollTop}
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            {actContent}

            <LoadAll loadAll={loadAll} />
          </ScrollView>

          <View className={loading ? 'refresh-btn loading' : 'refresh-btn'}
            style={{backgroundImage: `url(${refreshBtn})`}} onClick={this.onRefreshHandler.bind(this)}
          >
          </View>

        </View>
      </View>
    )
  }
}

export default Home
