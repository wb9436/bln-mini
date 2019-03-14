import Taro, {Component} from '@tarojs/taro'
import {Image, Input, Textarea, View} from '@tarojs/components'
import './advertApply.scss'

import * as Api from '../../store/business/service'
import * as Utils from '../../utils/utils'

import mustImg from '../../images/business/must.png'

class AdvertApply extends Component {
  config = {
    navigationBarTitleText: '投放广告'
  }
  constructor() {
    super(...arguments)
    this.state = {
      mobile: '',
      address: '',
      industry: '',
      budget: '',
      remark: '',
      status: 0, //提交状态: 0=未提交， 1=已提交
    }
  }

  onInputHandler(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  onPushApply() {
    const {mobile, address, industry, budget, remark, status} = this.state
    if (status == 1) {
      return false
    }
    if (!Utils.isMobile(mobile)) {
      this.showToast('请输入正确的手机号')
      return false
    }
    if (!address || address.trim() === '') {
      this.showToast('请输入所在地区')
      return false
    }
    if (!industry || industry.trim() === '') {
      this.showToast('请输入所属行业')
      return false
    }
    Api.businessAdvertIdea({mobile, address, industry, budget, remark}).then(data => {
      const {code} = data
      if (code == 200) {
        this.setState({
          status: 1
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
    const {mobile, address, industry, budget, remark, status} = this.state
    let disabled = status == 1 ? true : false

    return (
      <View className='advert-apply-page'>

        <View className='apply-item'>
          <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 联系电话：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              type='number' placeholder='请输入联系电话' value={mobile} onInput={this.onInputHandler.bind(this, 'mobile')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 所在地区：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              placeholder='请输入所在地区' value={address} onInput={this.onInputHandler.bind(this, 'address')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'><Image className={disabled ? 'hidden' : 'must-icon'} src={mustImg} mode='widthFix' /> 所属行业：</View>
          <View className='item-input'>
            <Textarea className='input-area' placeholderClass='textarea-placeholder' disabled={disabled}
              placeholder='请输入相关描述' value={industry} onInput={this.onInputHandler.bind(this, 'industry')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>推广预算：</View>
          <View className='item-input'>
            <Input className='input-field' placeholderClass='input-placeholder' disabled={disabled}
              type='number' placeholder='预算只能为数字 最多10位数' value={budget} onInput={this.onInputHandler.bind(this, 'budget')}
            />
          </View>
        </View>

        <View className='apply-item'>
          <View className='item-label'>备注信息：</View>
          <View className='item-input'>
            <Textarea className='input-area' placeholderClass='textarea-placeholder' disabled={disabled}
              placeholder='备注信息' value={remark} onInput={this.onInputHandler.bind(this, 'remark')}
            />
          </View>
        </View>

        <View className={disabled ? 'apply-btn bg-disabled' : 'apply-btn'} onClick={this.onPushApply.bind(this)}>提交</View>

        {disabled ?
          <View className='apply-desc'>运营人员将在一个工作日内电话联系您</View> : ''
        }

      </View>
    )
  }
}

export default AdvertApply
