import Taro, {Component} from '@tarojs/taro'
import {ScrollView, View} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

import * as DistrictsUtils from '../../components/Address/areaInfo'

class AddressDialog extends Component {
  static propTypes = {
    isOpened: PropTypes.bool,
    address: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirmAddress: PropTypes.func,
  }
  static defaultProps = {
    isOpened: false,
    address: '上海市 上海市 浦东新区',
    onCancel: null,
    onConfirmAddress: null,
  }

  constructor() {
    super(...arguments)
    this.state = {
      init: false,
      pro: {
        district: [],
        ids: [],
        index: 0
      },
      city: {
        district: [],
        ids: [],
        index: 0
      },
      area: {
        district: [],
        ids: [],
        index: 0
      },
      proMove: false,
      cityMove: false,
      areaMove: false,
      _isOpened: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      _isOpened: nextProps.isOpened,
    })
    const {init} = this.state
    let address = this.props.address
    let newAddress = nextProps.address
    if (nextProps.isOpened) {
      if (!init || address !== newAddress) {
        let addArr = newAddress.split(/\s+/)

        let province = DistrictsUtils.province(addArr[0])
        let city = DistrictsUtils.city(addArr[1], province.ids[province.index])
        let area = DistrictsUtils.area(addArr[2], province.ids[province.index], city.ids[city.index])
        this.setState({
          init: true,
          pro: province,
          city: city,
          area: area
        })
      }
    }
  }

  onCancel() {
    this.setState({
      _isOpened: false
    })
    if(this.props.onCancel) {
      this.props.onCancel(false)
    }
  }

  onConfirm() {
    this.setState({
      _isOpened: false
    })
    const {pro, city, area} = this.state
    let address = `${pro.district[pro.index]} ` + `${city.district[city.index]} ` + `${area.district[area.index]}`
    this.props.onConfirmAddress(address)
  }

  onTouchMoveStartHandler(type) {
    if (type === 'pro') {
      this.setState({
        proMove: true,
        cityMove: false,
        areaMove: false,
      })
    } else if (type === 'city') {
      this.setState({
        proMove: false,
        cityMove: true,
        areaMove: false,
      })
    } else if (type === 'area') {
      this.setState({
        proMove: false,
        cityMove: false,
        areaMove: true,
      })
    }
  }

  onScroll(type, e) {
    const {proMove, cityMove, areaMove} = this.state
    let canScroll = false
    if (type === 'pro' && proMove) {
      canScroll = true
    } else if (type === 'city' && cityMove) {
      canScroll = true
    } else if (type === 'area' && areaMove) {
      canScroll = true
    }
    if (canScroll) {
      let top = e.detail.scrollTop
      let dis = top % 40;
      let target
      if (dis > 20) {//超过一半，向下滚
        target = top + (40 - dis)
      } else {//否则滚回去
        target = top - dis
      }
      let index = target / 40 //  当前选中的序号
      this.onAreaChange(type, index)
    }
  }

  onAreaChange(type, index) {
    const {pro, city, area} = this.state
    switch (type) {
      case 'pro': //省带动市区变化
        if (index != pro.index) {
          pro.index = index
          let id = pro.ids[index]
          let tempCity = DistrictsUtils.city(null, id)
          let tempArea = DistrictsUtils.area(null, id, tempCity.ids[tempCity.index])
          this.setState({
            pro: pro,
            city: tempCity,
            area: tempArea
          })
        }
        break
      case 'city'://市带动区变化
        if (index != city.index) {
          city.index = index
          let tempArea1 = DistrictsUtils.area(null, pro.ids[pro.index], index)
          this.setState({
            city: city,
            area: tempArea1,
          })
        }
        break
      case 'area':
        if (index != area.index) {
          area.index = index
          this.setState({area})
        }
        break
    }
  }

  render() {
    const {_isOpened, pro, city, area} = this.state
    let proTop = pro.index * 40
    let cityTop = city.index * 40
    let areaTop = area.index * 40

    const proContent = pro.district.map((item, index) => {
      return <View key={`proId-${index}`} id={`proId-${index}`} className='area-item'>{item}</View>
    })

    const cityContent = city.district.map((item, index) => {
      return <View key={`cityId-${index}`} id={`cityId-${index}`} className='area-item'>{item}</View>
    })

    const areaContent = area.district.map((item, index) => {
      return <View key={`areaId-${index}`} id={`areaId-${index}`} className='area-item'>{item}</View>
    })

    return (
      <View className={_isOpened ? 'address-layout address-layout--active' : 'address-layout'}>
        <View className='address-layout__overlay' onClick={this.onCancel.bind(this)} />
        <View className='address-layout__container'>
          <View className='layout-header'>
            <View className='cancel' onClick={this.onCancel.bind(this)}>取消</View>
            <View className='title'>选择任务地址</View>
            <View className='confirm' onClick={this.onConfirm.bind(this)}>确定</View>
          </View>
          <View className='layout-body'>
            <View className='address-scroller'>
              <View className='area-box'></View>

              <ScrollView className='area-container'
                scrollY
                scrollWithAnimation
                scrollTop={proTop}
                onScroll={this.onScroll.bind(this, 'pro')}
                onTouchStart={this.onTouchMoveStartHandler.bind(this, 'pro')}
              >
                <View className='area-list'>
                  {proContent}
                </View>
              </ScrollView>

              <ScrollView className='area-container'
                scrollY
                scrollWithAnimation
                scrollTop={cityTop}
                onScroll={this.onScroll.bind(this, 'city')}
                onTouchStart={this.onTouchMoveStartHandler.bind(this, 'city')}
              >
                <View className='area-list'>
                  {cityContent}
                </View>
              </ScrollView>

              <ScrollView className='area-container'
                scrollY
                scrollWithAnimation
                scrollTop={areaTop}
                onScroll={this.onScroll.bind(this, 'area')}
                onTouchStart={this.onTouchMoveStartHandler.bind(this, 'area')}
              >
                <View className='area-list'>
                  {areaContent}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default AddressDialog
