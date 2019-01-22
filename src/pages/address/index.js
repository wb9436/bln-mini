import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Button} from '@tarojs/components'
import './index.scss'

import * as DistrictUtils from '../../components/Address/areaInfo'

class DistrictTest extends Component {
  config = {
    navigationBarTitleText: '地址测试'
  }

  constructor() {
    super(...arguments)
    this.state = {
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
    }
  }

  componentWillMount() {
    let address = '上海市 上海市 浦东新区'
    let addArr = address.split(/\s+/)

    let province = DistrictUtils.province(addArr[0])
    let city = DistrictUtils.city(addArr[1], province.ids[province.index])
    let area = DistrictUtils.area(addArr[2], province.ids[province.index], city.ids[city.index])
    this.setState({
      pro: province,
      city: city,
      area: area
    })
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

  onConfirmAddress() {
    const {pro, city, area} = this.state
    let address = `${pro.district[pro.index]} ` + `${city.district[city.index]} ` + `${area.district[area.index]}`
    console.log(`当前选择地区为: ${address}`)
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
      console.log(`执行了... ${type}: proMove=${proMove}, cityMove=${cityMove}, areaMove=${areaMove}`)
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
          let tempCity = DistrictUtils.city(null, id)
          let tempArea = DistrictUtils.area(null, id, tempCity.ids[tempCity.index])
          console.log(`pro: ${JSON.stringify(pro)}; city: ${JSON.stringify(tempCity)}; area: ${JSON.stringify(tempArea)}`)
          this.setState({
            pro: pro,
            city: tempCity,
            area: tempArea,
          })
        }
        break
      case 'city'://市带动区变化
        if (index != city.index) {
          city.index = index
          let tempArea1 = DistrictUtils.area(null, pro.ids[pro.index], index)
          console.log(`city: ${JSON.stringify(city)}; area: ${JSON.stringify(tempArea1)}`)
          this.setState({
            city: city,
            area: tempArea1,
          })
        }
        break
      case 'area':
        if (index != area.index) {
          area.index = index
          console.log(`area: ${JSON.stringify(area)}`)
          this.setState({
            area: area,
          })
        }
        break
    }
  }

  render() {
    const {pro, city, area} = this.state
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
      <View className='scroll-container'>
        <View className='address-scroller'>
          <View className='area-box'></View>

          <ScrollView className='area-container'
            scrollY
            scrollWithAnimation
            scrollTop={proTop}
            // scrollIntoView={`proId-${pro.index}`}
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
            // scrollIntoView={`cityId-${city.index}`}
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
            // scrollIntoView={`areaId-${area.index}`}
            onScroll={this.onScroll.bind(this, 'area')}
            onTouchStart={this.onTouchMoveStartHandler.bind(this, 'area')}
          >
            <View className='area-list'>
              {areaContent}
            </View>
          </ScrollView>
        </View>

        <Button onClick={this.onConfirmAddress.bind(this)}>确认地址</Button>

      </View>
    )
  }
}

export default DistrictTest
