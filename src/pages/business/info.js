import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Switch} from '@tarojs/components'
import './info.scss'

import * as Api from '../../store/business/service'
import logo from '../../images/public/logo.png'

class BusinessInfo extends Component {
  config = {
    navigationBarTitleText: '基本信息'
  }
  constructor() {
    super(...arguments)
    let windowWidth = Taro.getSystemInfoSync().windowWidth
    let scale = windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      from: 'index', //本页来源：index=商家首页，code=收款码
      userId: Taro.getStorageSync('userId'), //商家编号
      name: Taro.getStorageSync('user').nickname, //商家名称
      address: Taro.getStorageSync('address'), //商家地址
      img: '', //商家图片
      attachment: '', //附件图片
      industry: '', //所属行业
      baState: 0, //是否参加商家联盟
      linkman: '', //联系人
      mobile: Taro.getStorageSync('user').mobile, //联系人
      baServicerUserId: '', //推广员
    }
  }

  componentDidMount() {
    const {from} = this.$router.params
    Api.businessInfo().then(res => {
      const {code, body} = res
      if (code === 200) {
        this.setState({
          from: from,
          businessId: body.businessId,
          userId: body.userId,
          name: body.name,
          address: body.address,
          img: body.img,
          attachment: body.attachment,
          industry: body.industry,
          baState: body.baState,
          linkman: body.linkman,
          mobile: body.mobile,
          baServicerUserId: body.baServicerUserId,
        })
      }
    })
  }


  render() {
    const {windowHeight, userId, name, address, img, attachment, industry, baState, linkman, mobile, baServicerUserId} = this.state

    return (
      <View className='business-info-page'>
        <View className='info-scroll' style={{height: `${windowHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
            <View className='info-item'>
              <View className='item-label'>会员编号</View>
              <View className='item-content'>
                <View className='item-field'>{userId}</View>
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>商家名称</View>
              <View className='item-content'>
                <View className='item-field'>{name}</View>
              </View>
            </View>

            <View className='info-item info-icon'>
              <View className='item-label'>商家图片</View>
              <View className='item-content'>
                <Image className='item-icon' src={img || logo} mode='widthFix' />
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>商家名称</View>
              <View className='item-content'>
                <View className='item-field'>{industry}</View>
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>商家地址</View>
              <View className='item-content'>
                <View className='item-field'>{address}</View>
              </View>
            </View>

            <View className='info-item info-icon'>
              <View className='item-label'>营业执照</View>
              <View className='item-content'>
                {attachment && <Image className='item-icon' src={attachment || logo} mode='widthFix' />}
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>加入商家联盟</View>
              <View className='item-content'>
                {baState === 1 && <View className='item-field'>是</View>}
                {baState === 0 && <Switch checked={false} type='switch' color='#EE735D' />}
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>联系人</View>
              <View className='item-content'>
                <View className='item-field'>{linkman}</View>
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>联系电话</View>
              <View className='item-content'>
                <View className='item-field'>{mobile}</View>
              </View>
            </View>

            <View className='info-item'>
              <View className='item-label'>推广员ID</View>
              <View className='item-content'>
                <View className='item-field'>{baServicerUserId}</View>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    )
  }
}

export default BusinessInfo
