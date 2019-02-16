import * as Api from './service'

export default {
  namespace: 'cityTopic',
  state: {
    area: '',
    topicList: [],
    curPageNum: 1,
    pageSize: 10,
    loadAll: false,
  },

  effects: {
    * onInitData({payload}, {put}) {
      const {area} = payload
      yield put({
        type: 'save',
        payload: {
          area: area,
          topicList: [],
          curPageNum: 1,
          pageSize: 5,
          loadAll: false,
        }
      })
    },

    * onChangArea({payload}, {put}) {
      const {area} = payload
      yield put({
        type: 'save',
        payload: {
          area: area,
        }
      })
    },

    * onLoadTopicList(_, {call, put, select}) {
      const {area, curPageNum, pageSize, topicList} = yield select(state => state.cityTopic)
      const {code, body} = yield call(Api.topicList, {area, curPageNum, pageSize})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            topicList: topicList.concat(body.array),
            loadAll: body.paging.last
          }
        })
      }
    },

    * onLoadAttentionTopicList(_, {call, put, select}) {
      const {curPageNum, pageSize, topicList} = yield select(state => state.cityTopic)
      const {code, body} = yield call(Api.attentionTopicList, {curPageNum, pageSize})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            topicList: topicList.concat(body.array),
            loadAll: body.paging.last
          }
        })
      }
    },

    * onTopicPraise({payload}, {call, put, select}) {
      const {index, id, praise} = payload
      const {topicList} = yield select(state => state.cityTopic)
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
      const {topicList} = yield select(state => state.cityTopic)
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
      const {topicList} = yield select(state => state.cityTopic)
      const {code} = yield call(Api.deleteTopic, {id})
      if (code == 200) {
        topicList.splice(index, 1) //删除index位置一个元素
        yield put({
          type: 'save',
          payload: {
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
