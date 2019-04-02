import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'myTopic',
  state: {
    userId: '',
    attentionNum: 0, //关注数
    topicNum: 0, //我的话题数
    loadAll: false,
    topicList: [],
    curPageNum: 1,
    pageSize: 15,
  },

  effects: {
    * onInitData({payload}, {put}) {
      if(payload) {
        yield put({
          type: 'save',
          payload: {
            userId: payload.userId,
            attentionNum: 0, //关注数
            topicNum: 0, //我的话题数
            loadAll: false,
            topicList: [],
            curPageNum: 1,
            pageSize: 15,
          }
        })
      }
    },

    * onLoadTopicList(_, {call, put, select}) {
      const {userId, curPageNum, pageSize, topicList} = yield select(state => state.myTopic)
      let res = yield call(Api.topicList, {userId, curPageNum, pageSize})
      const {code, body} = res
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            attentionNum: res.attentionNum,
            topicNum: body.paging.totalRows,
            loadAll: body.paging.last,
            topicList: topicList.concat(body.array),
          }
        })
      }
    },

    * onTopicPraise({payload}, {call, put, select}) {
      const {index, id, praise} = payload
      const {topicList} = yield select(state => state.myTopic)
      const {code} = yield call(praise == 1 ? Api.topicUnPraise : Api.topicPraise, {id})
      if (code == 200) {
        topicList[index].praise = praise == 1 ? 0 : 1
        if (praise == 1) {
          topicList[index].praiseNum -= 1
        } else {
          topicList[index].praiseNum += 1
        }
        yield put({
          type: 'save',
          payload: {
            topicList: topicList,
          }
        })
      }
    },

    * onTopicAttention({payload}, {call, put, select}) {
      const {type, index, id, attention} = payload
      const {topicList} = yield select(state => state.myTopic)
      const {code} = yield call(attention == 1 ? Api.topicAttentionCancel : Api.topicAttentionAdd, {id})
      if (code == 200) {
        topicList[index].attention = attention == 1 ? 0 : 1
        if (type == 1 && attention == 1) { //关注列表, 取消关注移除元素
          topicList.splice(index, 1) //删除index位置一个元素
        }
        yield put({
          type: 'save',
          payload: {
            topicList: topicList,
          }
        })
      }
    },

    * onTopicDelete({payload}, {call, put, select}) {
      const {index, id} = payload
      const {topicList, topicNum} = yield select(state => state.myTopic)
      const {code} = yield call(Api.deleteTopic, {id})
      if (code == 200) {
        topicList.splice(index, 1) //删除index位置一个元素
        yield put({
          type: 'save',
          payload: {
            topicNum: topicNum -1,
            topicList: topicList,
          }
        })
      }
    },

    * onTopicReport({payload}, {call}) {
      const {id, reason} = payload
      const {code} = yield call(Api.reportTopic, {id, reason})
      if (code == 200) {
        console.log('已举报该话题...')
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    }
  }
}
