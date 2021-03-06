import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/auth/service'
import * as Utils from '../../utils/utils'
import cardImg from '../../images/auth/auth-card.png'

class IdAuth extends Component {
  config = {
    navigationBarTitleText: '实名认证'
  }
  constructor() {
    super(...arguments)
    this.state = {
      isChange: false, //是否手动更改图片
      imgUrl: '', //身份证图片地址
      realName: '', //真实姓名
      idNumber: '', //身份证号
      rejectReason: '', //拒绝理由
      authState: 2, //状态: 0=认证中, 1=已认证, -1=拒绝, 2=未认证
    }
  }

  componentDidMount() {
    Api.authResultGet().then(res => {
      const {code, body} = res
      if (code == 200) {
        if (body && body.idNumber && body.idNumber.toString().trim() != '') {
          this.setState({
            isChange: false,
            imgUrl: body.imgUrl,
            realName: body.realName,
            idNumber: body.idNumber,
            rejectReason: body.rejectReason,
            authState: body.state,
          })
        }
      }
    })
  }

  onCheckCardImg() {
    const {authState} = this.state
    if(authState == -1 || authState == 2) {
      Taro.chooseImage({
        count: 1
      }).then((data) => {
        this.setState({
          isChange: true,
          imgUrl: data.tempFilePaths[0]
        })
      })
    }
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onUserAuth() {
    const {isChange, imgUrl, realName, idNumber, authState} = this.state
    if (authState == -1 || authState == 2) {
      if (!realName || realName.trim() === '') {
        Taro.showToast({
          title: '请输入真实姓名',
          icon: 'none',
          mask: true,
        })
        return false
      }
      if (!Utils.isIdCard(idNumber)) {
        Taro.showToast({
          title: '请输入正确的身份证号',
          icon: 'none',
          mask: true,
        })
        return false
      }
      if (!imgUrl || imgUrl.trim() === '') {
        Taro.showToast({
          title: '请选择手持身份证照',
          icon: 'none',
          mask: true,
        })
        return false
      }
      if (isChange) {
        let that = this
        let mediaType = 1
        let filePath = imgUrl
        Api.uploadFile({mediaType, filePath}).then(res => {
          const {code, body} = res
          if (code == 200) {
            filePath = body[0]
            that.onSubmitAuth(realName, idNumber, filePath)
          }
        })
      } else {
        this.onSubmitAuth(realName, idNumber, imgUrl)
      }
    }
  }

  onSubmitAuth(realName, idNumber, imgUrl) {
    Api.userAuth({realName, idNumber, imgUrl}).then(data => {
      if (data.code == 200) {
        Taro.showToast({
          title: '已提交审核',
          icon: 'success',
          mask: true,
        })
        this.setState({
          authState: 0
        })
      }
    })
  }

  render() {
    const {imgUrl, realName, idNumber, rejectReason, authState} = this.state
    let disabled = false
    if (authState == 0 || authState == 1) {
      disabled = true
    }

    return (
      <View className='auth-page'>

        <View className='auth-item'>
          <View className='auth-name'>真实姓名：</View>
          <Input className='input-box'
            value={realName}
            disabled={disabled}
            placeholderClass='placeholder'
            maxLength={18}
            onInput={this.onInputHandler.bind(this, 'realName')}
          />
        </View>

        <View className='auth-item'>
          <View className='auth-name'>身份证号：</View>
          <Input className='input-box'
            value={idNumber}
            disabled={disabled}
            placeholderClass='placeholder'
            maxLength={18}
            onInput={this.onInputHandler.bind(this, 'idNumber')}
          />
        </View>

        <View className='auth-img'>
          <View className='auth-desc'>手持身份证照</View>
          <Image className='auth-card' src={imgUrl || cardImg} mode='widthFix' onClick={this.onCheckCardImg.bind(this)} />
          <View className='auth-result'>
            {authState == -1 ? `认证失败：${rejectReason}` : ''}
            {authState == 0 ? '正在审核' : ''}
          </View>
        </View>

        {authState == 1 ?
          <View className='auth-success'>实名认证审核成功</View> : ''
        }

        {authState == 1 ? '' :
          <View className={disabled ? 'auth-submit auth-disabled' : 'auth-submit'} onClick={this.onUserAuth.bind(this)}>提交</View>
        }

      </View>
    )
  }
}

export default IdAuth
