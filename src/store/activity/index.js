import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'activity',
  state: {
    actTypes: [{name: '推荐', id: 1}],
    category: '推荐',
    activityList: [],
    loadAll: false,
    pageSize: 10,
    curPageNum: 1,
    //活动详情
    userId: 0,
    type: 0,//类型: 0=点阅活动;1=段子
    actId: 0,
    title: '',
    content: '',
    link: '',
    desc: '',
    imageUrl: '',
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
  },

  effects: {
    * loadActType(_, {call, put}) {
      const {code, body} = yield call(Api.activityCategorySearch)
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            actTypes: [{name: '推荐', id: 1}].concat(body)
          }
        })
      }
    },

    * refreshActivity(_, {call, put, select}) {
      let curPageNum = 1
      const {category, pageSize} = yield select(state => state.activity)
      let params = {curPageNum, pageSize}
      if (category !== '推荐') {
        params.category = category
      }
      const {code, body} = yield call(Api.activityListSearch, params)
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            activityList: body.array,
            loadAll: body.paging.last,
            curPageNum: curPageNum
          }
        })
      }
    },

    * loadActivity(_, {call, put, select}) {
      const {category, activityList, pageSize, curPageNum, loadAll} = yield select(state => state.activity)
      if (!loadAll) {
        let params = {pageSize}
        if (category !== '推荐') {
          params.category = category
        }
        params.curPageNum = curPageNum + 1
        const {code, body} = yield call(Api.activityListSearch, params)
        if (code == 200) {
          yield put({
            type: 'save',
            payload: {
              activityList: activityList.concat(body.array),
              loadAll: body.paging.last,
              curPageNum: curPageNum + 1
            }
          })
        }
      }
    },

    * initActivity(_, {put}) {
      yield put({
        type: 'save',
        payload: {
          userId: 0,
          type: 0,//类型: 0=点阅活动;1=段子
          actId: 0,
          title: '',
          content: '',
          link: '',
          desc: '',
          imageUrl: '',
          unionid: '',
          slideTimes: 0,//滑动次数
          readTime: 0,//阅读时间(单位秒),
          scrollTop: 0,//滑动距离
          scrollHeight: Taro.getSystemInfoSync().windowHeight,//屏幕高度
          openTime: 0,
          sendStatus: false,//任务发送状态
          openid: '',
          sessionKey: '',
        }
      })
    },

    * loadActivityContent(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activity)
      const {code, body} = yield call(Api.activityContent, {userId, id: actId})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            content: body.description
          }
        })
      }
    },

    * loadActivityBrief(_, {call, put, select}) {
      const {userId, actId} = yield select(state => state.activity)
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
      const {sessionKey} = yield select(state => state.activity)
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
      const {actId, unionid} = yield select(state => state.activity)
      const {code} = yield call(Api.activityEffect, {actId, unionid})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            sendStatus: true
          }
        })
      }
    }
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }

}
