import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'activityDetail',
  state: {
    //分享信息
    userId: 0,
    type: 0,//类型: 0=点阅活动;1=段子
    actId: 0,
    title: '',
    link: '',
    desc: '',
    imageUrl: '',
    //活动详情
    refreshTime: new Date().getTime(),
    hits: 0,//阅读量
    praise: 0,//点赞
    praiseState: 0,//点赞状态
    state: 0,//是否点赞:1=已点赞;0=未点赞
    content: '',
    //任务信息
    unionid: '',
    slideTimes: 0,//滑动次数
    readTime: 0,//阅读时间(单位秒),
    scrollTop: 0,//滑动距离
    scrollHeight: 0,//滑块内容高度
    screenHeight: Taro.getSystemInfoSync().windowHeight,//屏幕高度
    openTime: 0,
    sendStatus: false,//任务发送状态
    openid: '',
    sessionKey: '',
    //活动广告
    isAd: false,
    isImage: false,
    isVideo: false,
    picUrl: '',
    videoUrl: '',
    accessUrl: '',
    adTitle: '',
    subTitle: '',
    btnTitle: '',
    id: 0,
    actList: [],
  },

  effects: {
    * initActivity(_, {put}) {
      yield put({
        type: 'save',
        payload: {
          //分享信息
          userId: 0,
          type: 0,//类型: 0=点阅活动;1=段子
          actId: 0,
          title: '',
          link: '',
          desc: '',
          imageUrl: '',
          //活动详情
          refreshTime: new Date().getTime(),
          hits: 0,//阅读量
          praise: 0,//点赞
          praiseState: 0,//点赞状态
          state: 0,//是否点赞:1=已点赞;0=未点赞
          content: '',
          //任务信息
          unionid: '',
          slideTimes: 0,//滑动次数
          readTime: 0,//阅读时间(单位秒),
          scrollTop: 0,//滑动距离
          scrollHeight: 0,//滑块内容高度
          screenHeight: Taro.getSystemInfoSync().windowHeight,//屏幕高度
          openTime: 0,
          sendStatus: false,//任务发送状态
          openid: '',
          sessionKey: '',
          //活动广告
          isAd: false,
          isImage: false,
          isVideo: false,
          picUrl: '',
          videoUrl: '',
          accessUrl: '',
          adTitle: '',
          subTitle: '',
          btnTitle: '',
          id: 0,
          actList: [],
        }
      })
    },

    * loadActivityData(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activityDetail)
      let res = yield call(Api.activityContent, {userId, id: actId})
      if (res && res.code == 200) {
        yield put({
          type: 'save',
          payload: {
            content: res.body.description
          }
        })
      }
      res = yield call(Api.activityBrief, {userId, actId})
      if (res) {
        let ruleDto = res.body.ruleDto
        if (ruleDto) {
          yield put({
            type: 'save',
            payload: {
              refreshTime: res.body.refreshTime,
              hits: res.body.hits,//阅读量
              praise: res.body.praise,//点赞
              state: res.body.state,//是否点赞:1=已点赞;0=未点赞
              slideTimes: ruleDto.slideTimes,
              readTime: ruleDto.readTime,
              title: res.body.subTitle
            }
          })
        }
      }
    },

    * loadActivityContent(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activityDetail)
      const res = yield call(Api.activityContent, {userId, id: actId})
      if (res && res.code == 200) {
        yield put({
          type: 'save',
          payload: {
            content: res.body.description
          }
        })
      }
    },

    * loadActivityBrief(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activityDetail)
      const {code, body} = yield call(Api.activityBrief, {userId, actId})
      if (code == 200) {
        let ruleDto = body.ruleDto
        if (ruleDto) {
          yield put({
            type: 'save',
            payload: {
              slideTimes: ruleDto.slideTimes,
              readTime: ruleDto.readTime,
              title: body.subTitle
            }
          })
        }
      }
    },

    * loadNewsContent(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activityDetail)
      let id = actId
      const {code, body} = yield call(Api.newsContent, {userId, id})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            content: body.content
          }
        })
      }
    },

    * getWeiXinOpenid({payload}, {call, put}) {
      const {code} = payload
      const data = yield call(Api.getOpenid, {code})
      if (data.code == 200) {
        yield put({
          type: 'save',
          payload: {
            openid: data.body.openid,
            sessionKey: data.body.session_key,
            unionid: data.body.openid
          }
        })
        if(data.body.unionid) {
          Taro.setStorageSync('unionid', data.body.openid)
        }
      }
    },

    * getDecryptData({payload}, {call, put, select}) {
      const {sessionKey} = yield select(state => state.activityDetail)
      const {encryptedData, iv} = payload
      const {code, body} = yield call(Api.getDecryptData, {sessionKey, encryptedData, iv})
      if (code == 200 && body) {
        yield put({
          type: 'save',
          payload: {
            unionid: body.unionId,
          }
        })
        if(body.unionid) {
          Taro.setStorageSync('unionid', body.unionid)
        }
      }
    },

    * activityEffect(_, {call, put, select}) {
      const {actId, unionid} = yield select(state => state.activityDetail)
      const {code} = yield call(Api.activityEffect, {actId, unionid})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            sendStatus: true
          }
        })
      }
    },

    * activityPraise(_, {call, put, select}) {
      const {userId, actId, unionid, praise, praiseState} = yield select(state => state.activityDetail)
      if (praiseState == 0) {
        const {code} = yield call(Api.activityPraise, {userId, actId, unionid})
        if (code == 200) {
          yield put({
            type: 'save',
            payload: {
              praise: praise + 1,
              praiseState: 1
            }
          })
        }
      }
    },

    * loadAdData(_, {call, put, select}) {
      const {userId} = yield select(state => state.activityDetail)
      const {code, body} = yield call(Api.activityAd, {userId})
      if (code == 200 && body.accessUrl) {
        yield put({
          type: 'save',
          payload: {
            isAd: true,
            isImage: body.type == 1 ? true : false,
            isVideo: body.type == 2 ? true : false,
            picUrl: body.picUrl,
            videoUrl: body.videoUrl,
            accessUrl: body.accessUrl,
            adTitle: body.title,
            subTitle: body.subTitle,
            btnTitle: body.button,
            id: body.id,
          }
        })
      }
    },

    * loadActAdData(_, {call, put, select}) {
      const {userId} = yield select(state => state.activityDetail)
      let num = 5//活动推荐
      const {code, body} = yield call(Api.activityActAd, {userId, num})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            actList: body
          }
        })
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }

}
