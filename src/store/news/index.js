import * as Api from './service'

export default {
  namespace: 'news',
  state: {
    loadAll: false,
    pageSize: 15,
    curPageNum: 1,
    newsList: [],
    id: 0,
    title: '',
    imageUrl: '',
    content: '',
  },

  effects: {
    * initData(_, {put}) {
      yield put({
        type: 'save',
        payload: {
          id: 0,
          title: '',
          imageUrl: '',
          content: '',
        }
      })
    },

    * refreshNews(_, {call, put, select}) {
      const {curPageNum, pageSize} = yield select(state => state.news)
      const {code, body} = yield call(Api.newsList, {curPageNum, pageSize})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            newsList: body.array,
            loadAll: body.paging.last
          }
        })
      }
    },

    * loadNews(_, {call, put, select}) {
      const {curPageNum, pageSize, newsList, loadAll} = yield select(state => state.news)
      if (!loadAll) {
        let params = {pageSize}
        params.curPageNum = curPageNum + 1
        const {code, body} = yield call(Api.newsList, params)
        if (code == 200) {
          yield put({
            type: 'save',
            payload: {
              newsList: newsList.concat(body.array),
              loadAll: body.paging.last
            }
          })
        }
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }


}
