import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from '@tarojs/redux'
import './index.scss'
import * as Utils from '../../utils/utils'

import WxShare from '../../components/WxShare/index'
import OptList from '../../components/OptionList/index'
import SortList from '../../components/SortList/index'

@connect(({pdd}) => ({
  ...pdd,
}))
class Pdd extends Component {
  config = {
    navigationBarTitleText: '拼多多'
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'pdd/save',
      payload: {
        loadAll: false,
        page: 1,
        optId: -1,
        showSort: false,
      }
    })
    this.props.dispatch({
      type: 'pdd/recommendSearch',
    })
    this.props.dispatch({
      type: 'pdd/loadPddBanner',
    })
  }

  onOptChecked(value) {
    const {optId} = this.props
    if (value != optId) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          loadAll: false,
          optId: value,
          page: 1,
          showSort: value != -1 ? true : false,
          goodsList: [],
        }
      })
      if(value == -1) {
        this.props.dispatch({
          type: 'pdd/recommendSearch'
        })
      }else{
        this.props.dispatch({
          type: 'pdd/optSearch'
        })
      }
    }
  }

  onSortChecked(value) {
    const {sortType} = this.props
    if (value != sortType) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          loadAll: false,
          page: 1,
          sortType: value,
          goodsList: [],
        }
      })
      this.props.dispatch({
        type: 'pdd/optSearch'
      })
    }
  }

  appendNextPageList() {
    const {optId, page, loadAll} = this.props
    if (!loadAll) {
      this.props.dispatch({
        type: 'pdd/save',
        payload: {
          page: page + 1
        }
      })
      if(optId == -1) {
        this.props.dispatch({
          type: 'pdd/recommendSearch'
        })
      }else{
        this.props.dispatch({
          type: 'pdd/optSearch'
        })
      }
    }
  }

  onSearchGoods() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  render() {
    let windowHeight = Utils.windowHeight(false)
    const {goodsList, loadAll, showSort} = this.props
    // const bannerSize = bannerList.length > 0 ? true : false

    let height = Utils.windowHeight(false) - 90
    if(showSort) {
      height -= 35
    }

    return (
      <View className='pdd'>
        {/*微信分享*/}
        {Taro.getEnv() === Taro.ENV_TYPE.WEB && <WxShare />}

        <View className='search'>
          <View className='banner banner-top'>
            <View className='search-btn' onClick={this.onSearchGoods.bind(this)}>
              <View className='search-input'>
                <View className='search-icon'>
                  <AtIcon value='search' color='#B5B5B5' size='20' />
                </View>
                <View className='search-value'>搜索</View>
              </View>
            </View>
          </View>
          <OptList onOptChecked={this.onOptChecked.bind(this)} />
        </View>
        <View className='goods goods-top'>
          {showSort && <SortList onSortChecked={this.onSortChecked.bind(this)} />}

          <ScrollView className='content'
            scrollY
            scrollWithAnimation
            style={{height: `${height}px`}}
            onScrollToLower={this.appendNextPageList.bind(this)}
          >

          </ScrollView>
        </View>

      </View>
    )
  }
}

export default Pdd
