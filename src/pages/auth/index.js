import Taro, {Component} from '@tarojs/taro'
import {View, Image, Input} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/auth/service'
import cardImg from '../../images/auth/auth-card.png'

class IdAuth extends Component {
  config = {
    navigationBarTitleText: '实名认证'
  }
  constructor() {
    super(...arguments)
    this.state = {
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
    const {imgUrl, realName, idNumber, authState} = this.state
    if (authState == -1 || authState == 2) {
      let isIDCard = /^(\d{6})(19|20)(\d{2})(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])(\d{3})(\d|X|x)?$/
      if(!realName || realName.trim() === '') {
        Taro.showToast({
          title: '请输入真实姓名',
          icon: 'none',
          mask: true,
        })
      }
      if(!idNumber || idNumber.trim() === '') {
        Taro.showToast({
          title: '请输入身份证号',
          icon: 'none',
          mask: true,
        })
      }
      if(!isIDCard.test(idNumber)) {
        Taro.showToast({
          title: '请输入正确的身份证号',
          icon: 'none',
          mask: true,
        })
      }
      let that = this
      let mediaType = 1
      let filePath = imgUrl
      Api.uploadFile({mediaType, filePath}).then(res => {
        const {code, body} = res
        if (code == 200) {
          filePath = body[0]
          Api.userAuth({realName, idNumber, imgUrl: filePath}).then(data => {
            if (data.code == 200) {
              that.setState({
                authState: 0
              })
            }
          })
        }
      })
    }
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

        <View className={disabled ? 'auth-submit auth-disabled' : 'auth-submit'} onClick={this.onUserAuth.bind(this)}>提交</View>

      </View>
    )
  }
}

export default IdAuth
