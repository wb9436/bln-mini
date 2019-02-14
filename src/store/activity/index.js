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

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }

}
