import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image, Text, Picker, Input} from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem} from 'taro-ui'
import './index.scss'

import AddressDialog from '../../components/Address/index'
import * as Api from '../../store/user/service'

import maleIcon from '../../images/public/male.png'
import femaleIcon from '../../images/public/female.png'
import moreBtn from '../../images/public/moreBtn.png'

class UserInfo extends Component {
  config = {
    navigationBarTitleText: '我的资料'
  }

  constructor() {
    super(...arguments)
    this.state = {
      address: '',
      avatar: '',
      birthday: '',
      education: '',
      hobby: '',
      income: '',
      mobile: '',
      nickname: '',
      sex: '',
      signature: '',
      social: '',
      userId: '',
      work: '',
      isOpened: false,
      actGroup: '',
      actType: '',
      actionList: [
        {title: '性别', desc: '帅哥', type: 'sex', value: '1'},
        {title: '性别', desc: '美女', type: 'sex', value: '2'},
        {title: '学历', desc: '初中及以下', type: 'education', value: '初中及以下'},
        {title: '学历', desc: '高中', type: 'education', value: '高中'},
        {title: '学历', desc: '大专', type: 'education', value: '大专'},
        {title: '学历', desc: '本科', type: 'education', value: '本科'},
        {title: '学历', desc: '本科及以上', type: 'education', value: '本科及以上'},
        {title: '岗位', desc: '学生', type: 'work', value: '学生'},
        {title: '岗位', desc: '公务员', type: 'work', value: '公务员'},
        {title: '岗位', desc: '个体户', type: 'work', value: '个体户'},
        {title: '岗位', desc: '企业职员', type: 'work', value: '企业职员'},
        {title: '岗位', desc: '企业管理', type: 'work', value: '企业管理'},
        {title: '岗位', desc: '私营企业主', type: 'work', value: '私营企业主'},
        {title: '岗位', desc: '其他', type: 'work', value: '其他'},
        {title: '收入', desc: '2000以下', type: 'income', value: '2000以下'},
        {title: '收入', desc: '2000-5000元', type: 'income', value: '2000-5000元'},
        {title: '收入', desc: '5000-10000元', type: 'income', value: '5000-10000元'},
        {title: '收入', desc: '1万元以上', type: 'income', value: '1万元以上'},
      ],
      hobbyList: [
        {title: '美食', checked: false},{title: '旅游', checked: false},{title: '汽车', checked: false},
        {title: '摄影', checked: false},{title: '音乐', checked: false},{title: '电影', checked: false},
        {title: '游戏', checked: false},{title: '数码', checked: false},{title: '交友', checked: false},
        {title: '阅读', checked: false},{title: '运动', checked: false},{title: '棋牌', checked: false},
        {title: '教育', checked: false},{title: '母婴', checked: false},{title: '时尚', checked: false},
        {title: '美容', checked: false},{title: '养生', checked: false},{title: '公益', checked: false},
        {title: '理财', checked: false},{title: '收藏', checked: false},
      ],
      socialList: [
        {title: '农业', checked: false},{title: '工业', checked: false},{title: '白领', checked: false},
        {title: '学生', checked: false},{title: '政府', checked: false},{title: '法律', checked: false},
        {title: '金融', checked: false},{title: '医院', checked: false},{title: '其他', checked: false}
      ],
    }
  }

  componentDidMount() {
    let hobby = ''
    let social = ''
    Api.getUserInfoBySid().then(data => {
      const {code, body} = data
      if (code == 200) {
        hobby = body.hobby
        social = body.social
        this.setState({
          address: body.address,
          avatar: body.avatar,
          birthday: body.birthday,
          education: body.education,
          hobby: hobby,
          income: body.income,
          mobile: body.mobile,
          nickname: body.nickname,
          sex: body.sex.toString() || '0',
          signature: body.signature,
          social: social,
          userId: body.userId,
          work: body.work,
        })
        this.onInitHobbyList(hobby)
        this.onInitSocialList(social)
      }
    })
  }

  onInitHobbyList = (hobby) => {
    if (hobby && hobby.trim() !== '') {
      const {hobbyList} = this.state
      hobbyList.map((item) => {
        if (hobby.indexOf(item.title) != -1) {
          item.checked = true
        }
      })
      this.setState({hobbyList})
    }
  }

  onInitSocialList = (social) => {
    if (social && social.trim() !== '') {
      const {socialList} = this.state
      socialList.map((item) => {
        if (social.indexOf(item.title) != -1) {
          item.checked = true
        }
      })
      this.setState({socialList})
    }
  }

  onOpenAction = (actType) => {
    let actGroup = ''
    if (actType === 'address') {
      actGroup = 'address'
    } else if (actType === 'hobby') {
      actGroup = 'hobby'
    } else if (actType === 'social') {
      actGroup = 'social'
    } else if (actType === 'signature') {
      actGroup = 'signature'
    } else {
      actGroup = 'group'
    }
    this.setState({actType: actType, actGroup: actGroup, isOpened: true})
  }

  onCloseAction = () => {
    this.setState({actType: '', actGroup: '', isOpened: false})
  }

  onStopPropagation = (e) => {
    e.stopPropagation()
  }

  /*修改生日*/
  onBirthdayChange(e) {
    this.onCloseAction()
    this.onUpdateUserInfo('birthday', e.detail.value)
  }

  /*修改任务地址*/
  onConfirmAddress(address) {
    this.onCloseAction()
    this.onUpdateUserInfo('address', address)
  }

  /*修改性别、学历、岗位、收入*/
  onActionChange(type, value) {
    this.onCloseAction()
    this.onUpdateUserInfo(type, value)
  }

  /*选择爱好*/
  onHobbyCheck(index, checked) {
    const {hobbyList} = this.state
    hobbyList[index].checked = !checked
    this.setState({hobbyList})
  }

  /*选择社交圈子*/
  onSocialCheck(index, checked) {
    const {socialList} = this.state
    socialList[index].checked = !checked
    this.setState({socialList})
  }

  /*修改爱好*/
  onConfirmHobby() {
    this.onCloseAction()
    const {hobbyList} = this.state
    let hobbyArr = []
    hobbyList.map(item => {
      if (item.checked) {
        hobbyArr.push(item.title)
      }
    })
    this.onUpdateUserInfo('hobby', hobbyArr.toLocaleString())
  }

  /*修改社交圈子*/
  onConfirmSocial() {
    this.onCloseAction()
    const {socialList} = this.state
    let socialArr = []
    socialList.map(item => {
      if (item.checked) {
        socialArr.push(item.title)
      }
    })
    this.onUpdateUserInfo('social', socialArr.toLocaleString())
  }

  onInputHandler(e) {
    this.setState({
      signature: e.detail.value
    })
  }

  onConfirmInput() {
    this.onCloseAction()
    const {signature} = this.state
    this.onUpdateUserInfo('signature', signature)
  }

  onUpdateUserInfo = (type, value) => {
    const param = {[type]: value}
    Api.updateUserInfo(param).then(data => {
      if (data.code == 200) {
        if (type === 'address') {
          Taro.setStorageSync('address', value)
        }
        Taro.showToast({title: '已保存', icon: 'none', mask: true})
        this.setState({
          [type]: value
        })
      }
    })
  }

  render() {
    const {address, avatar, birthday, education, hobby, income, mobile, nickname, sex, signature, social,
      userId, work, isOpened, actGroup, actType, actionList, hobbyList, socialList} = this.state

    const actContent = actionList.map((item, index) => {
      return <AtActionSheetItem key={index} className={actType === item.type ? '' : 'hidden'}
        onClick={this.onActionChange.bind(this, item.type, item.value)}
      >
        {item.desc}
      </AtActionSheetItem>
    })

    const hobbyContent = hobbyList.map((item, index) => {
      return <View key={index} className={item.checked ? 'checkbox-item checkbox-item_checked' : 'checkbox-item'}
        onClick={this.onHobbyCheck.bind(this, index, item.checked)}
      >{item.title}</View>
    })

    const socialContent = socialList.map((item, index) => {
      return <View key={index} className={item.checked ? 'checkbox-item checkbox-item_checked' : 'checkbox-item'}
        onClick={this.onSocialCheck.bind(this, index, item.checked)}
      >{item.title}</View>
    })

    return (
      <View className='user-page'>
        <ScrollView className='scroll-container' scrollY scrollWithAnimation >
          <View className='user-info'>
            <View className='info-title'>头像</View>
            <View className='info-content'>
              <Image className='info-avatar' src={avatar} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>昵称</View>
            <View className='info-content'><Text className='info-text'>{nickname}</Text></View>
          </View>
          <View className='user-info'>
            <View className='info-title'>UID</View>
            <View className='info-content'><Text className='info-text'>{userId}</Text></View>
          </View>
          <View className='user-info'>
            <View className='info-title'>手机</View>
            <View className='info-content'><Text className='info-text'>{mobile}</Text></View>
          </View>

          <View className='user-info'>
            <View className='info-title'>性别</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'sex')}>
              <Image className='sex-icon' src={sex === '2' ? femaleIcon : maleIcon} mode='widthFix' />
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>生日</View>
            <View className='info-content'>
              <Text className='info-text'>
                <Picker mode='date' onChange={this.onBirthdayChange.bind(this)}>{birthday}</Picker>
              </Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>任务地址</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'address')}>
              <Text className='info-text'>{address}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>我的学历</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'education')}>
              <Text className='info-text'>{education}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>工作岗位</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'work')}>
              <Text className='info-text'>{work}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>月收入</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'income')}>
              <Text className='info-text'>{income}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>兴趣爱好</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'hobby')}>
              <Text className='info-text'>{hobby}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>社交圈子</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'social')}>
              <Text className='info-text'>{social}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
          <View className='user-info'>
            <View className='info-title'>我的签名</View>
            <View className='info-content' onClick={this.onOpenAction.bind(this, 'signature')}>
              <Text className='info-text'>{signature}</Text>
              <Image className='more-icon' src={moreBtn} mode='widthFix' />
            </View>
          </View>
        </ScrollView>

        <AddressDialog isOpened={isOpened && actGroup === 'address'} address={address}
          onCancel={this.onCloseAction.bind(this)} onConfirmAddress={this.onConfirmAddress.bind(this)}
        />

        <AtActionSheet isOpened={isOpened && actGroup === 'group'} onCancel={this.onCloseAction.bind(this)} cancelText='取消'>
          {actContent}
        </AtActionSheet>

        <View className={(isOpened && actGroup === 'hobby') ? 'float-layout float-layout--active' : 'float-layout'} onClick={this.onCloseAction.bind(this)}>
          <View className='float-layout__overlay'></View>
          <View className='float-layout__container'>
            <View className='checkbox-content' onClick={this.onStopPropagation.bind(this)}>
              <View className='checkbox-list'>
                {hobbyContent}
              </View>
              <View className='btn-container'>
                <View className='checkbox-btn' onClick={this.onConfirmHobby.bind(this)}>保存</View>
              </View>
            </View>
          </View>
        </View>

        <View className={(isOpened && actGroup === 'social') ? 'float-layout float-layout--active' : 'float-layout'} onClick={this.onCloseAction.bind(this)}>
          <View className='float-layout__overlay'></View>
          <View className='float-layout__container'>
            <View className='checkbox-content' onClick={this.onStopPropagation.bind(this)}>
              <View className='checkbox-list'>
                {socialContent}
              </View>
              <View className='btn-container'>
                <View className='checkbox-btn' onClick={this.onConfirmSocial.bind(this)}>保存</View>
              </View>
            </View>
          </View>
        </View>

        <View className={(isOpened && actGroup === 'signature') ? 'float-layout float-layout--active' : 'float-layout'} onClick={this.onCloseAction.bind(this)}>
          <View className='float-layout__overlay'></View>
          <View className='float-layout__container' onClick={this.onStopPropagation.bind(this)}>
            <View className='signature-content'>
              <Input className='signature-input' value={signature} placeholder='输入个性签名' placeholderClass='input-placeholder' onInput={this.onInputHandler.bind(this)} />
              <View className='signature-btn' onClick={this.onConfirmInput.bind(this)}>确定</View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

export default UserInfo
