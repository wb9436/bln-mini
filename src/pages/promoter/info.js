import Taro, {Component} from '@tarojs/taro'
import {View, Input, Image} from '@tarojs/components'
import './info.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

import addImg from '../../images/public/add.png'
import checkTrue from '../../images/public/check-true.png'
import checkFalse from '../../images/public/check-false.png'

class PromoterInfo extends Component {
  config = {
    navigationBarTitleText: '推广员'
  }

  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('user').userId,
      name: '',
      sex: '男',
      mobile: '',
      idNumber: '',
      state: 0, //推广员状态：-3未申请 -2=未通过 -1=申请中 0=启用 1=停用
      idImgUrl: '',
      idImgFileUrl: '',
      message: '',
      isPromoter: false,
    }
  }

  componentDidMount() {
    Api.agentInfo().then(data => {
      console.log(data)
      const {code, body} = data
      if (code == 200) {
        let isPromoter =  (body.state == 0 || body.state == 1) ? true : false
        this.setState({
          userId: body.userId,
          name: body.name,
          sex: body.sex || '男',
          mobile: body.mobile,
          idNumber: body.idNumber,
          state: body.state, //推广员状态：-3未申请 -2=未通过 -1=申请中 0=启用 1=停用
          idImgUrl: body.idImgUrl,
          message: body.message,
          isPromoter: isPromoter,
        })
      }
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

  onCheckSex(sex) {
    this.setState({sex})
  }

  onPushApply() {
    const {name, sex, mobile, idNumber, state, idImgUrl, idImgFileUrl} = this.state
    if (state == 1 || state == 0) {
      return false
    }
    if (!name || name.trim() === '') {
      this.showToast('请输入姓名')
      return false
    }
    if (!Utils.isMobile(mobile)) {
      this.showToast('请输入正确的手机号')
      return false;
    }
    if (!Utils.isIdCard(idNumber)) {
      this.showToast('请输入正确的身份证号')
      return false;
    }
    if ((!idImgUrl || idImgUrl.toString().trim() === '') && (!idImgFileUrl || idImgFileUrl.toString().trim() === '')) {
      this.showToast('请上传身份证照片')
      return false;
    }
    this.uploadImage({
      sid: Taro.getStorageSync('sid'),
      url: TOPIC_API + '/chat/tools/files/upload',
      mediaType: 1,
      path: [idImgFileUrl],
      name,
      sex,
      mobile,
      idNumber,
      idImgUrl: idImgUrl
    })
  }

  uploadImage = (data) => {
    let path = data.path
    if (path && path.length > 0) {
      let i = data.i ? data.i : 0
      if(path[i] && path[i].trim() !== '') {
        Taro.uploadFile({
          url: data.url,
          filePath: path[i],
          name: 'files',
          formData: {
            sid: data.sid,
            type: data.mediaType
          },
          success: (res) => {
            if (res.statusCode == 200) {
              const {code, body} = JSON.parse(res.data)
              if (code == 200) {
                data.idImgUrl = body[0]
              } else {
                console.log('上传失败。。。')
              }
            }
          },
          complete: () => {
            i++
            if (i == path.length) { //当图片传完时，停止调用
              // console.log('执行完毕: 成功：' + success + ' 失败：' + fail + '; filePath: ' + JSON.stringify(filePath))
              this.onPutApplyUpdate(data)
            } else {//若图片还没有传完，则继续调用函数
              data.i = i
              this.uploadImage(data)
            }
          }
        })
      } else {
        i++
        if (i == path.length) {
          this.onPutApplyUpdate(data)
        } else {
          data.i = i
          this.uploadImage(data)
        }
      }
    } else {
      this.onPutApplyUpdate(data)
    }
  }

  onPutApplyUpdate = (data) => {
    Api.agentUpdate(data).then(result => {
      console.log(result)
      const {code} = result
      if(code == 200) {
        this.setState({
          state: -1
        })
      }
    })
  }


  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      mask: true,
    })
  }


  render() {
    const {userId, name, sex, mobile, idNumber, state, idImgUrl, idImgFileUrl, message, isPromoter} = this.state
    const disabled = isPromoter
    let stateMsg = ''
    if (state == -2) {
      stateMsg = '审核被拒'
    } else if (state == -1) {
      stateMsg = '审核中'
    } else if (state == 0) {
      stateMsg = '审核通过'
    } else if (state == 1) {
      stateMsg = '已停用'
    }

    return (
      <View className='promoter-info-page'>

        <View className='apply-item'>
          <View className='item-label'>会员编号：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' placeholder='会员编号' value={userId} disabled />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>姓名：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              placeholder='请输入姓名' value={name} onInput={this.onInputHandler.bind(this, 'name')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>性别：</View>
          <View className='item-input'>
            <View className={disabled ? 'item-desc' : 'hidden'}>{sex}</View>
            <View className={disabled ? 'hidden' : 'check-box'} onClick={this.onCheckSex.bind(this, '男')}>
              <Image className='checkbox-icon' src={sex === '男' ? checkTrue : checkFalse} mode='widthFix' />
              <View className='check-desc'>男</View>
            </View>
            <View className={disabled ? 'hidden' : 'check-box check-box_left'} onClick={this.onCheckSex.bind(this, '女')}>
              <Image className='checkbox-icon' src={sex === '女' ? checkTrue : checkFalse} mode='widthFix' />
              <View className='check-desc'>女</View>
            </View>
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>手机号：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              placeholder='请输入手机号' value={mobile} onInput={this.onInputHandler.bind(this, 'mobile')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>身份证：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              placeholder='请输入身份证编号' value={idNumber} onInput={this.onInputHandler.bind(this, 'idNumber')}
            />
          </View>
        </View>

        {(stateMsg && stateMsg.trim() !== '') ?
          <View className='apply-item'>
            <View className='item-label'>状态：</View>
            <View className='item-input'>
              <View className='item-desc'>{stateMsg}</View>
            </View>
          </View> : ''
        }

        <View className='apply-item apply-icon'>
          <View className='item-label'>身份证上传：</View>
          <View className='item-input'>
            {disabled ?
              <Image className='add-icon' src={idImgUrl} mode='scaleToFill' /> :
              <Image className='add-icon' src={idImgFileUrl || idImgUrl || addImg} mode='scaleToFill'
                onClick={this.onInputImgHandler.bind(this, 'idImgFileUrl')}
              />
            }
          </View>
        </View>

        {!disabled ?
          <View className='btn-content'>
            <View className='apply-btn' onClick={this.onPushApply.bind(this)}>
              提交
            </View>
            {state != -3 ?
              <View className='apply-result'>{message}</View> : ''
            }
          </View> : ''
        }

      </View>
    )
  }
}

export default PromoterInfo
