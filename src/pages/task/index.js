import Taro, {Component} from '@tarojs/taro'
import {View, Image, Button} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/user/service'
import * as Utils from '../../utils/utils'

import discCircular from '../../images/public/disc-circular.png'
import emptyCircular from '../../images/public/empty-circular.png'
import blnShare from '../../images/public/bln_share.png'

class Task extends Component {
  config = {
    navigationBarTitleText: '日常任务'
  }
  constructor() {
    super(...arguments)
    this.state = {
      taskList: [
        {type: 'sign', title: '签到', desc: '每日签到可获得5阅点', award: 5, btn_no: '去签到', btn_yes: '已签到'},
        {type: 'invite', title: '邀请好友', desc: '每成功邀请1位好友可获得10阅点', award: 10, btn_no: '去邀请', btn_yes: '已邀请'},
        {type: 'actOne', title: '完成同城活动1次', desc: '分享同城活动至微信群、朋友圈并产生1次有效阅读，可获得10阅点', award: 10, btn_no: '去完成', btn_yes: '已完成'},
        {type: 'actThird', title: '完成同城活动3次', desc: '分享同城活动至微信群、朋友圈并产生3次有效阅读，可获得20阅点', award: 20, btn_no: '去完成', btn_yes: '已完成'},
        {type: 'business', title: '完成商家活动1次', desc: '分享商家活动至微信群、朋友圈并完成1次购买，可获得50阅点', award: 50, btn_no: '去完成', btn_yes: '已完成'},
      ],
      sign: 0,
      invite: 0,
      actOne: 0,
      actThird: 0,
      business: 0,
    }
  }

  componentDidMount() {
    const {signTime} = this.$router.params
    let sign = 0
    if (!signTime) {
      sign = 0
    } else {
      let isToday = Utils.isTodayDay(new Date(Number.parseInt(signTime)))
      if(isToday) {
        sign = 1
      }
    }
    this.setState({
      sign: sign
    })
  }

  onShareAppMessage() {
    return {
      title: '了解您身边的生活资讯信息，更有拼多多优惠券等你来拿！！！',
      imageUrl: blnShare,
      path: '/pages/home/index?inviter=' + Taro.getStorageSync('userId')
    }
  }

  onCompleteTask(type, state) {
    if(state) {
      return false
    }
    switch (type) {
      case 'sign':
        this.toSign()
        break;
      case 'invite':
        this.toInvite()
        break;
      case 'actOne':
        this.toActOne()
        break;
      case 'actThird':
        this.toActThird()
        break;
      case 'business':
        this.toBusiness()
        break;
    }
  }

  toSign() {
    Api.userSignToday().then(data => {
      const {code} = data
      if(code == 200) {
        Taro.showToast({
          title: '签到成功'
        })
        this.setState({
          sign: 1
        })
      }
    })
  }

  toInvite() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.showToast({
        icon: 'none',
        title: '点击微信右上角，选择分享好友!!!',
        duration: 2000,
      })
    } else {
      this.onShareAppMessage()
    }
  }

  toActOne() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
  }
  toActThird() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
  }

  toBusiness() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.reLaunch({
        url: '/pages/home/index'
      })
    } else {
      Taro.redirectTo({
        url: '/pages/home/index'
      })
    }
  }

  render() {
    const {taskList} = this.state

    const taskContent = taskList.map((item, index) => {
      let taskState = this.state[item.type] == 1 ? true : false
      return <View key={index} className='task-item'>
        <View className='task-state'>
          <View className='upper-line'></View>
          <Image className='task-sign' src={taskState == true ? discCircular : emptyCircular} mode='widthFix' />
          <View className='lower-line'></View>
        </View>
        <View className='task-content'>
          <View className='task-award'>
            <View className='task-title'>{item.title}</View>
            <View className='award-desc'>
              +{item.award}
            </View>
          </View>
          <View className='task-desc'>
            <View className='desc'>{item.desc}</View>
            <View className='task-btn'>

              {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && item.type === 'invite' &&
                <Button className={taskState ? 'btn_start btn_end' : 'btn_start'} plain openType='share'
                  onClick={this.onCompleteTask.bind(this, item.type, taskState)}
                >
                {taskState == true ? item.btn_yes : item.btn_no}
                </Button>
              }

              {(Taro.getEnv() !== Taro.ENV_TYPE.WEAPP || item.type !== 'invite') &&
                <View className={taskState ? 'btn_start btn_end' : 'btn_start'}
                  onClick={this.onCompleteTask.bind(this, item.type, taskState)}
                >
                  {taskState == true ? item.btn_yes : item.btn_no}
                </View>
              }

            </View>
          </View>
        </View>
      </View>
    })

    return (
      <View className='task-page'>

        {taskContent}

      </View>
    )
  }
}

export default Task
