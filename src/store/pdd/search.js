import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'pddSearch',
  state: {
    loadAll: false,
    keyword: '',
    optId: -1,
    sortType: 0,
    goodsList: [],
    page: 1,
    totalPage: 0,
    showSort: false,
  },
  effects: {
    * initData(_, {put}) {
      yield put({
        type: 'save',
        payload: {
          loadAll: false,
          keyword: '',
          optId: -1,
          sortType: 0,
          goodsList: [],
          page: 1,
          totalPage: 0,
          showSort: false,
        }
      })
    },

    * keywordsSearch(_, {call, put, select}) {
      let userId = Taro.getStorageSync('userId')
      const {page, goodsList, keyword, sortType} = yield select(state => state.pddSearch);
      const {code, body} = yield call(Api.keywordsSearch, {page, userId, keyword, sortType})
      if (code == 200) {
        let showSort = false
        if (body.goodsList.length <= 0 && goodsList.length <= 0) {
          showSort = false
        } else {
          showSort = true
        }
        yield put({
          type: 'save',
          payload: {
            goodsList: goodsList.concat(body.goodsList),
            totalPage: body.totalPage,
            loadAll: page >= body.totalPage ? true : false,
            showSort: showSort
          }
        })
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
};
