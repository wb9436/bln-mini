import * as Api from './service'

export default {
  namespace: 'newsDetail',
  state: {
    //分享信息
    userId: 0,
    id: 0,
    title: '',
    imageUrl: '',
    content: '',
  },

  effects: {
    * initActivity(_, {put}) {
      yield put({
        type: 'save',
        payload: {
          //分享信息
          userId: 0,
          id: 0,
          title: '',
          imageUrl: '',
          content: '',
        }
      })
    },

    * loadNewsContent(_, {call, put, select}) {
      const {userId, id} = yield select(state => state.newsDetail)
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

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }

}
