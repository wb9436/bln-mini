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
    if (isBusiness == 1 && isBusiness == 1) {
      this.setState({
        isBusiness: isBusiness,
        businessId: businessId,
      })
    }
    this.onLoading()
  }

  onLoading = () => {
    this.timerId = setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 100)
  }

  onLoadImgError() {
    this.setState({
      hasIcon: false,
      hasLoad: false
    })
  }

  onLoadImgSuccess() {
    this.setState({
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

  onApplyBusiness() {
    const {isBusiness} = this.state
    let url = ''
    if (isBusiness === 1) { //是否是商家
      url = '/pages/business/info'
    } else {
      url = '/pages/business/apply?from=code'
    }
    Taro.navigateTo({
      url: url
    })
  }

  render() {
    const {businessId, hasIcon, hasLoad, loading} = this.state
    let url = 'https://api.vipsunyou.com/api/business/getQr?businessId=' + businessId

    return (
      <View className='pay-code-page'>
        {(hasLoad || hasIcon || loading) ?
          <View className='code-content'>
            <Image className='code-icon' src={url} onError={this.onLoadImgError.bind(this)}
              onLoad={this.onLoadImgSuccess.bind(this)} onClick={this.onPreviewImage.bind(this, url)}
            />
            <View className='preview-desc'>点击并保存图片到相册</View>
          </View> : ''
        }

        {!hasIcon ?
          <View className='code-none'>
            <Image className='none-icon' src={noneIcon} mode='widthFix' />
            <View className='none-desc'>暂无收款码，快去成为商家吧</View>
            <View className='apply-btn' onClick={this.onApplyBusiness.bind(this)}>申请商家</View>
          </View> : ''
        }

      </View>
    )
  }
}

export default PayCode
