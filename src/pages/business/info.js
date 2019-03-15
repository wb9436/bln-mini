import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Input, Textarea} from '@tarojs/components'
import './info.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

import mustImg from '../../images/business/must.png'
import addImg from '../../images/public/add.png'
import loadingIcon from '../../images/public/loading.gif'
import checkTrue from '../../images/public/check-true.png'
import checkFalse from '../../images/public/check-false.png'


class BusinessApply extends Component {
  config = {
    navigationBarTitleText: '商家信息'
  }
  constructor() {
    super(...arguments)
    let windowWidth = Taro.getSystemInfoSync().windowWidth
    let scale = windowWidth / 375
    this.state = {
      loading: true,
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      scale: scale, //屏幕变化放缩倍数
      imgFile: '', //商家图片
      attachmentFile: '', //附件图片
      userId: Taro.getStorageSync('userId'), //商家编号
      name: Taro.getStorageSync('user').nickname, //商家名称
      address: Taro.getStorageSync('address'), //商家地址
      mobile: '', //联系人
      img: '', //商家图片
      attachment: '', //附件图片
      industry: '', //所属行业
      baState: 1, //是否参加商家联盟 1=默认加入
      state: -3, //商家状态：1=商家已被禁用；0=审核通过；-1=审核中；-2=审核被拒；-3=未提交审核
      linkman: '', //联系人
      baServicerUserId: '', //推广员
      baServicerName: '', //推广员昵称
      message: '', //审核结果描述
      btnMsg: '提交',
    }
  }

  componentDidMount() {
    Api.businessInfo().then(data => {
      const {code, body} = data
      if (code === 200) {
        let state = body.state
        let btnMsg = '提交'
        let message = ''
        if (state == -1 || state == -2) {
          btnMsg = '重新提交'
          if(state == -1) {
            message = '审核中'
          }
        } else if (state == 0 || state == 1) {
          btnMsg = '审核通过'
        }
        this.setState({
          loading: false,
          userId: body.userId,
          name: body.name,
          address: body.address,
          img: body.img,
          attachment: body.attachment,
          industry: body.industry,
          baState: body.baState,
          state: state,
          linkman: body.linkman,
          mobile: body.mobile,
          baServicerUserId: (body.baServicerUserId && body.baServicerUserId.toString() !== '0') ? body.baServicerUserId : '',
          baServicerName: body.baServicerName,
          message: body.message || message,
          btnMsg: btnMsg
        })
      }
    })
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onStateChange(baState) {
    this.setState({
      baState: baState
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

  onPushApply() {
    const {imgFile, attachmentFile, name, address, img, attachment, industry, baState, state, linkman, mobile, baServicerUserId} = this.state
    if(state == 1 || state == 0) {
      return false
    }
    if(!name || name.trim() === '') {
      this.showToast('请输入商家名称')
      return false
    }
    if(!linkman || linkman.trim() === '') {
      this.showToast('请输入联系人')
      return false
    }
    if (!Utils.isMobile(mobile)) {
      this.showToast('请输入正确的手机号')
      return false;
    }
    if (!Utils.isNumber(baServicerUserId)) {
      this.showToast('请输入正确的推广员ID')
      return false;
    }
    this.uploadImage({
      sid: Taro.getStorageSync('sid'),
      url: TOPIC_API + '/chat/tools/files/upload',
      mediaType: 1,
      path: [imgFile, attachmentFile],
      name,
      address,
      img,
      attachment,
      industry,
      baState,
      linkman,
      mobile,
      baServicerUserId,
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
                if (i == 0) {
                  data.img = body[0]
                } else if (i == 1) {
                  data.attachment = body[0]
                }
              } else {
                console.log('上传失败。。。')
              }
            }
          },
          complete: () => {
            i++
            if (i == path.length) { //当图片传完时，停止调用
              // console.log('执行完毕: 成功：' + success + ' 失败：' + fail + '; filePath: ' + JSON.stringify(filePath))
              this.onPutApplyBusiness(data)
            } else {//若图片还没有传完，则继续调用函数
              data.i = i
              this.uploadImage(data)
            }
          }
        })
      } else {
        i++
        if (i == path.length) {
          this.onPutApplyBusiness(data)
        } else {
          data.i = i
          this.uploadImage(data)
        }
      }
    } else {
      this.onPutApplyBusiness(data)
    }
  }

  onPutApplyBusiness = (data) => {
    Api.businessUpdate(data).then(res => {
      const {code} = res
      if (code == 200) {
        this.showToast('已提交审核')
        this.setState({
          state: -1,
          btnMsg: '重新提交',
          message: '审核中',
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
    const {loading, windowHeight, scale, imgFile, attachmentFile, userId, name, address, img, attachment, industry,
      baState, state, linkman, mobile, baServicerUserId, baServicerName, message, btnMsg} = this.state
    const btnHeight = 80 * scale
    const scrollHeight = windowHeight - btnHeight
    const disabled = (state == 1 || state == 0) ? true : false

    return (
      <View className='business-apply-page'>
        {!loading ?
          <View className='apply-scroll' style={{height: `${scrollHeight}px`}}>
            <ScrollView className='scroll-container'
              scrollY
              scrollWithAnimation
            >
              <View className='apply-item'>
                <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 会员编号：</View>
                <View className='item-input'>
                  <Input className='input-field' placeholderClass='input-placeholder' placeholder='会员编号' value={userId} disabled />
                </View>
              </View>

              <View className='apply-item'>
                <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 商家名称：</View>
                <View className='item-input'>
                  <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
                    placeholder='请输入商家名称' value={name} onInput={this.onInputHandler.bind(this, 'name')}
                  />
                </View>
              </View>

              <View className='apply-item apply-icon'>
                <View className='item-label'>商家图片：</View>
                <View className='item-input'>
                  {disabled ? <Image className='add-icon' src={img} mode='scaleToFill' /> :
                    <Image className='add-icon' src={imgFile || img || addImg} mode='scaleToFill'
                      onClick={this.onInputImgHandler.bind(this, 'imgFile')}
                    />
                  }
                </View>
              </View>

              <View className='apply-item apply-icon'>
                <View className='item-label'>所属行业：</View>
                <View className='item-input'>
                  <Textarea className='input-area' placeholderClass='textarea-placeholder' disabled={disabled}
                    placeholder='请输入相关描述' value={industry} onInput={this.onInputHandler.bind(this, 'industry')}
                  />
                </View>
              </View>

              <View className='apply-item'>
                <View className='item-label'>商家地址：</View>
                <View className='item-input'>
                  <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
                    placeholder='请输入商家地址' value={address} onInput={this.onInputHandler.bind(this, 'address')}
                  />
                </View>
              </View>

              <View className='apply-item apply-icon'>
                <View className='item-label'>营业执照：</View>
                <View className='item-input'>
                  {disabled ?
                    <Image className='add-icon' src={attachment} mode='scaleToFill' /> :
                    <Image className='add-icon' src={attachmentFile || attachment || addImg} mode='scaleToFill'
                      onClick={this.onInputImgHandler.bind(this, 'attachmentFile')}
                    />
                  }
                </View>
              </View>

              <View className='apply-item'>
                <View className='item-label'>加入商家联盟：</View>
                <View className='item-input'>
                  <View className={disabled ? 'item-desc' : 'hidden'}>
                    {baState == 0 ? '是' : ''}
                    {baState == 1 ? '否' : ''}
                  </View>
                  <View className={disabled ? 'hidden' : 'check-box'} onClick={this.onStateChange.bind(this, 1)}>
                    <Image className='checkbox-icon' src={baState == 1 ? checkTrue : checkFalse} mode='widthFix' />
                    <View className='check-desc'>加入商家</View>
                  </View>
                  <View className={disabled ? 'hidden' : 'check-box check-box_left'} onClick={this.onStateChange.bind(this, 0)}>
                    <Image className='checkbox-icon' src={baState == 0 ? checkTrue : checkFalse} mode='widthFix' />
                    <View className='check-desc'>加入广告</View>
                  </View>
                </View>
              </View>

              <View className='apply-item'>
                <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 联系人：</View>
                <View className='item-input'>
                  <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
                    placeholder='请输入联系人' value={linkman} onInput={this.onInputHandler.bind(this, 'linkman')}
                  />
                </View>
              </View>

              <View className='apply-item'>
                <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 联系电话：</View>
                <View className='item-input'>
                  <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
                    type='number' placeholder='请输入联系电话' value={mobile} onInput={this.onInputHandler.bind(this, 'mobile')}
                  />
                </View>
              </View>

              <View className='apply-item apply-service'>
                <View className='apply-left'>
                  <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 推广员ID：</View>
                  <View className='item-input'>
                    <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
                      type='number' placeholder='推广员ID' value={baServicerUserId} onInput={this.onInputHandler.bind(this, 'baServicerUserId')}
                    />
                  </View>
                </View>
                <View className='service-user'>{baServicerName}</View>
              </View>

            </ScrollView>
          </View> : ''
        }

        {(!loading && !disabled) ?
          <View className='btn-content' style={{height: `${btnHeight}px`}}>
            <View className='apply-btn' onClick={this.onPushApply.bind(this)}>
              {btnMsg}
            </View>
            {state != -3 ?
              <View className='apply-result'>{message}</View> : ''
            }
          </View> : ''
        }

        {loading ?
          <View className='data-loading'>
            <Image className='loading-icon' src={loadingIcon} mode='widthFix' />
          </View> : ''
        }

      </View>
    )
  }
}

export default BusinessApply
