import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './payCode.scss'

import noneIcon from '../../images/business/none.png'

class PayCode extends Component {
  config = {
    navigationBarTitleText: '收款码'
  }
  constructor() {
    super(...arguments)
    this.state = {
      isBusiness: 0, //是否是商家
      businessId: 0, //商家ID
      hasIcon: false, //是否有收款码
      hasLoad: true, //是否加载
      loading: true,
    }
  }

  componentDidShow() {
    const {isBusiness, businessId} = this.$router.params
    if (isBusiness == 1) {
      this.setState({
        isBusiness: isBusiness,
        businessId: businessId,
      })
    }
  }

  onLoadImgError() {
    this.setState({
      loading: false,
      hasIcon: false,
      hasLoad: false
    })
  }

  onLoadImgSuccess() {
    this.setState({
      loading: false,
      hasIcon: true,
      hasLoad: false
    })
  }

  onPreviewImage(url) {
    let sourceUrl = [url]
    Taro.previewImage({
      current: url,
      urls: sourceUrl
    })
  }

  onCallMobile(mobile) {
    if(Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.makePhoneCall({
        phoneNumber: mobile
      })
    }
  }

  render() {
    const {businessId, hasIcon, hasLoad, loading} = this.state
    let url = 'https://api.vipsunyou.com/api/business/getQr?businessId=' + businessId

    return (
      <View className='pay-code-page'>
        {(loading || hasLoad || hasIcon) ?
          <View className='code-content'>
            <Image className='code-icon' src={url} onError={this.onLoadImgError.bind(this)}
              onLoad={this.onLoadImgSuccess.bind(this)} onClick={this.onPreviewImage.bind(this, url)}
            />
            <View className={loading ? 'hidden' : 'preview-desc'}>点击并保存图片到相册</View>
          </View> : ''
        }

        {(!hasIcon && !loading) ?
          <View className='code-none'>
            <Image className='none-icon' src={noneIcon} mode='widthFix' />
            <View className='none-desc'>暂无商家收款码，快去成为商家吧</View>
            <View className='node-customer'>
              <View className='customer-title'>客服电话</View>
              <View className='customer-mobile' onClick={this.onCallMobile.bind(this, '18017534850')}>18017534850</View>
            </View>
          </View> : ''
        }

      </View>
    )
  }
}

export default PayCode
