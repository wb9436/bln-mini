import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Input, Switch} from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'
import 'taro-ui/dist/style/components/action-sheet.scss'
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
      baState: 1, //是否参加商家联盟 1=默认加入
      linkman: '', //联系人
      mobile: Taro.getStorageSync('user').mobile, //联系人
      baServicerUserId: '', //推广员
      actType: -1, //动作面板
      isBusiness: -2, //是否为商家 -2=未申请 -1=申请中 0=正常
      btnMsg: '提交',
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
    Api.businessInfo().then(res => {
      const {code, body} = res
      if (code === 200) {
        let isBusiness = -2
        let btnMsg = '提交'
        if (body.state === -1) {
          isBusiness = -1
          btnMsg = '审核中'
        } else if (body.state === 0) {
          isBusiness = 0
          btnMsg = '已审核通过'
        }
        this.setState({
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
          isBusiness: isBusiness,
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
    this.setState({address: address, actType: -1})
  }

  onStateChange(e) {
    let value = e.detail.value
    this.setState({
      baState: value === true ? 1 : 0
    })
  }

  onCheckIndustry(industry) {
    this.setState({industry: industry, actType: -1})
  }

  onPutApply() {
    const {name, address, img, attachment, industry, baState, linkman, mobile, baServicerUserId, isBusiness} = this.state
    if(isBusiness !== -2) {
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
    if (!mobile || mobile.trim() === '' || mobile.length != 11) {
      this.showToast('请输入正确的手机号')
      return false;
    }
    this.uploadImage({
      sid: Taro.getStorageSync('sid'),
      url: TOPIC_API + '/chat/tools/files/upload',
      mediaType: 1,
      path: [img, attachment],
      name,
      address,
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
    const {from} = this.state
    Api.businessUpdate(data).then(res => {
      const {code} = res
      if(code == 200) {
        this.showToast('申请成功')
        let delta = 1
        if (from === 'code') {
          delta = 2
        }
        Taro.navigateBack({
          delta: delta
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
    const {windowHeight, scale, userId, name, address, img, attachment, industry,
      industryList, baState, linkman, mobile, baServicerUserId, actType, isBusiness, btnMsg} = this.state
    const btnHeight = 80 * scale
    const scrollHeight = windowHeight - btnHeight
    const disabled = isBusiness === -2 ? false : true

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
              <View className='item-label'><Image className='must-icon' src={mustImg} /> 商家名称：</View>
              <View className='item-input'>
                <Input className='input-field' disabled={disabled} placeholder='请输入商家名称' value={name}
                  onInput={this.onInputHandler.bind(this, 'name')}
                />
              </View>
            </View>

            <View className='apply-item apply-icon'>
              <View className='item-label'>商家图片：</View>
              <View className='item-input'>
                {disabled ? '' :
                  <Image className='add-icon' src={img || addImg} mode='scaleToFill'
                    onClick={this.onInputImgHandler.bind(this, 'img')}
                  />
                }
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>所属行业：</View>
              <View className='item-input'>
                {disabled ?
                  <View className='item-desc'>{industry}</View> :
                  <View className='item-desc' onClick={this.onOpenAction.bind(this, 1)}>{industry}</View>
                }
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>商家地址：</View>
              <View className='item-input'>
                {disabled ?
                  <View className='item-desc'>{address}</View> :
                  <View className='item-desc' onClick={this.onOpenAction.bind(this, 2)}>{address}</View>
                }
              </View>
            </View>

            <View className='apply-item apply-icon'>
              <View className='item-label'>营业执照：</View>
              <View className='item-input'>
                {disabled ? '' :
                  <Image className='add-icon' src={attachment || addImg} mode='scaleToFill'
                    onClick={this.onInputImgHandler.bind(this, 'attachment')}
                  />
                }
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>加入商家联盟：</View>
              <View className='item-input'>
                {isBusiness !== -2 ? `${baState === 1 ? '是' : '否'}` : ''}
                {isBusiness === -2 ?
                  <Switch checked={baState === 1 ? true : false} type='switch' color='#EE735D' onChange={this.onStateChange.bind(this)} /> : ''
                }
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'><Image className='must-icon' src={mustImg} /> 联系人：</View>
              <View className='item-input'>
                <Input className='input-field' disabled={disabled} placeholder='请输入联系人' value={linkman}
                  onInput={this.onInputHandler.bind(this, 'linkman')}
                />
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'><Image className='must-icon' src={mustImg} /> 联系电话：</View>
              <View className='item-input'>
                <Input className='input-field' disabled={disabled} placeholder='请输入联系电话' value={mobile}
                  onInput={this.onInputHandler.bind(this, 'mobile')}
                />
              </View>
            </View>

            <View className='apply-item'>
              <View className='item-label'>推广员ID：</View>
              <View className='item-input'>
                <Input className='input-field' disabled={disabled} placeholder='推广员ID' value={baServicerUserId}
                  onInput={this.onInputHandler.bind(this, 'baServicerUserId')}
                />
              </View>
            </View>

          </ScrollView>
        </View>

        <View className='btn-content' style={{height: `${btnHeight}px`}}>
          <View className={isBusiness === -2 ? 'apply-btn' : 'apply-btn apply-ing'} onClick={this.onPutApply.bind(this)}>
            {btnMsg}
          </View>
        </View>

        {disabled ? '' :
          <AddressDialog isOpened={actType === 2 ? true : false} address={address} onCancel={this.onCloseAction.bind(this)}
            onConfirmAddress={this.onConfirmAddress.bind(this)}
          />
        }

        <AtActionSheet isOpened={actType === 1 ? true : false}
          onClose={this.onCloseAction.bind(this)}
          onCancel={this.onCloseAction.bind(this)}
          cancelText='取消'
        >
          {
            industryList.map((item, index) => {
              return <AtActionSheetItem key={index} onClick={this.onCheckIndustry.bind(this, item.name)}>
                {item.name}
              </AtActionSheetItem>
            })
          }
        </AtActionSheet>

      </View>
    )
  }
}

export default BusinessApply
