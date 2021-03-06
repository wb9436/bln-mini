import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './index.scss'

import WxShare from '../../components/WxShare/index'
import LoadAll from '../../components/LoadAll/index'

import SortIcon from '../../images/activity/sortIcon.png'
import PopupIcon from '../../images/activity/popupIcon.png'
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
      loading: false,
      popup: false,
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

  onSortPopup() {
    const {popup} = this.state
    this.setState({popup: !popup})
  }

  onSortCheck(type) {
    this.setState({popup: false})
    const {sortType} = this.props
    if(type != sortType) {
      this.props.dispatch({
        type: 'activity/save',
        payload: {sortType: type}
      })
      this.props.dispatch({
        type: 'activity/refreshActivity'
      })
      this.refresh()
    }
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
    this.setState({popup: false})
    if (old !== category) {
      this.props.dispatch({
        type: 'activity/save',
        payload: {category, sortType: 0}
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
    this.setState({popup: false})

    let unionid = Taro.getStorageSync('unionid')
    if(!unionid || unionid.trim() === '') {
      unionid = Taro.getStorageSync('user').withdrawNo
    }
    Taro.navigateTo({
      // url: `/pages/activityDetail/index?type=0&title=${title}&actId=${actId}&imageUrl=${iconUrl}`
      // url: `/pages/activityDetail/detail?actId=${actId}`
      url: `/pages/activityDetail/task?type=0&title=${title}&actId=${actId}&userId=${Taro.getStorageSync('userId')}&imageUrl=${iconUrl}&unionid=${unionid}&lastPage=have`
    })
  }

  render() {
    const {windowHeight, loading, popup} = this.state
    const {category, actTypes, activityList, loadAll, sortType} = this.props

    const categoryContent = actTypes.map((item) => {
      return <View key={item.id} className='category-item' onClick={this.onActTypeChecked.bind(this, category, item.name)}>
        <Image className='category-icon' src={item.imgUrl} mode='widthFix' />
        <View className='category-title'>{item.name}</View>
      </View>
    })

    let actHeight = windowHeight

    const actContent = activityList.map((item, index) => {
      let title = (item.title && item.title.trim() !== '') ? `【${item.title}】${item.subTitle}` : `${item.subTitle}`
      return <View key={index} className='activity-item' onClick={this.onActivityClick.bind(this, item.actId, item.subTitle, item.iconUrl)}>
        <View className='activity-view'>
          <Image className='activity-logo' src={item.iconUrl} mode='scaleToFill' />
        </View>
        <View className='activity-content'>
          <View className='activity-title'>
            {item.hot == 1 && <View className='font-icon hot'> 热 </View>}
            {item.hot == 2 && <View className='font-icon new'> 新 </View>}
            {title}
          </View>
          <View className='activity-profit'>
            {(item.free == 0 && item.money > 0) ? `每增加一次阅读可获得${item.money}元` : ''}
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

        <View className='act-list' style={{height: `${actHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            // scrollTop={scrollTop}
            scrollWithAnimation
            onScrollToLower={this.onLoadHandler.bind(this)}
          >
            <View className='category-view'>
              {categoryContent}
            </View>

            <View className='category-desc'>
              <View className='category-name'>{category}</View>
              <Image className='category-sort' src={SortIcon} mode='widthFix' onClick={this.onSortPopup.bind(this)} />

              <View className={popup ? 'popup-view' : 'popup-view hidden'}>
                <Image className='popup-icon' src={PopupIcon} mode='widthFix' />
                <View className='sort-list'>
                  <View className={sortType == 0 ? 'sort-item-desc sort-item-border sort-item-checked' : 'sort-item-desc sort-item-border'} onClick={this.onSortCheck.bind(this, 0)}>最新</View>
                  <View className={sortType == 1 ? 'sort-item-desc sort-item-border sort-item-checked' : 'sort-item-desc sort-item-border'} onClick={this.onSortCheck.bind(this, 1)}>酬金</View>
                  <View className={sortType == 4 ? 'sort-item-desc sort-item-checked' : 'sort-item-desc'} onClick={this.onSortCheck.bind(this, 4)}>热度</View>
                </View>
              </View>
            </View>

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
