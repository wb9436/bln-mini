import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Input} from '@tarojs/components'
import './apply.scss'

import AddressDialog from '../../components/Address'

import * as Api from '../../store/business/service'
import mustImg from '../../images/business/must.png'
import addImg from '../../images/topic/add.png'

class BusinessApply extends Component {
  config = {
    navigationBarTitleText: '基本信息'
  }
  constructor() {
    super(...arguments)
    let windowWidth = Taro.getSystemInfoSync().windowWidth
    let scale = windowWidth / 375
    this.state = {
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //屏幕变化放缩倍数
      from: 'index', //本页来源：index=商家首页，code=收款码
      userId: Taro.getStorageSync('userId'), //商家编号
      name: Taro.getStorageSync('user').nickname, //商家名称
      address: Taro.getStorageSync('address'), //商家地址
      img: '', //商家图片
      attachment: '', //附件图片
      industry: '', //所属行业
      industryList: [], //行业列表
      baState: 0, //是否参加商家联盟
      linkman: Taro.getStorageSync('user').nickname, //联系人
      mobile: Taro.getStorageSync('user').mobile, //联系人
      baServicerUserId: '', //推广员
      actType: -1, //动作面板
    }
  }

  componentDidMount() {
    const {from} = this.$router.params
    let industry = ''
    let industryList = []
    Api.industryList().then(res => {
      const {code, body} = res
      if (code == 200) {
        industryList = body
        industry = industryList.length > 0 ? industryList[0].name : ''
      }
      this.setState({from, industry, industryList})
    })
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onInputImgHandler(type) {
    Taro.chooseImage({
      count: 1
    }).then((data) => {
      if (data.tempFilePaths && data.tempFilePaths.length > 0) {
        this.setState({
          [type]: data.tempFilePaths[0]
        })
      }
    })
  }

  onOpenAction(actType) {
    console.log('点击动作面板：' + actType)
    this.setState({actType})
  }

  onCloseAction() {
    this.setState({actType: -1})
  }

  onConfirmAddress(address) {
    this.setState({address})
  }


  onBack() {
    const {from} = this.state
    let delta = 1
    if (from === 'code') {
      delta = 2
    }
    Taro.navigateBack({
      delta: delta
    })
  }


  render() {
    const {windowHeight, scale, userId, name, address, img, attachment, industry, baState, linkman, mobile, baServicerUserId, actType} = this.state
    const btnHeight = 80 * scale
    const scrollHeight = windowHeight - btnHeight
    const openAction = actType !== -1 ? true : false

    return (
      <View className='business-apply-page'>
        <View className='apply-scroll' style={{height: `${scrollHeight}px`}}>
          <ScrollView className='scroll-container'
            scrollY
            scrollWithAnimation
          >
            <View className='apply-item'>
              <View className='item-label'><Image className='must-icon' src={mustImg} /> 会员编号：</View>
              <View className='item-input'>
                <Input className='input-field' placeholder='会员编号' value={userId} disabled />
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>商家名称：</View>
              <View className='item-input'>
                <Input className='input-field' placeholder='商家名称' value={name}
                  onInput={this.onInputHandler.bind(this, 'name')}
                />
              </View>
            </View>

            <View className='apply-item apply-icon'>
              <View className='item-label'>商家图片：</View>
              <View className='item-input'>
                <Image className='add-icon' src={img || addImg} mode='scaleToFill' onClick={this.onInputImgHandler.bind(this, 'img')} />
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>所属行业：</View>
              <View className='item-input'> <View className='item-desc' onClick={this.onOpenAction.bind(this, 1)}>{industry}</View></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>商家地址：</View>
              <View className='item-input'> <View className='item-desc' onClick={this.onOpenAction.bind(this, 2)}>{address}</View></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>营业执照：</View>
              <View className='item-input'></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>加入商家联盟：</View>
              <View className='item-input'></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>联系人：</View>
              <View className='item-input'></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>联系电话：</View>
              <View className='item-input'></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>所属行业：</View>
              <View className='item-input'></View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>推广员：</View>
              <View className='item-input'></View>
            </View>

          </ScrollView>
        </View>

        <View className='btn-content' style={{height: `${btnHeight}px`}}>
          <View className='apply-btn'>提交</View>
        </View>

        <AddressDialog isOpened={openAction} address={address} onCancel={this.onCloseAction.bind(this)}
          onConfirmAddress={this.onConfirmAddress.bind(this)}
        />


      </View>
    )
  }
}

export default BusinessApply
