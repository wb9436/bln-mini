import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'pdd',
  state: {
    loadAll: false,
    optId: -1,
    sortType: 0,
    goodsList: [],
    page: 1,
    totalPage: 0,
    showSort: false,
    bannerList: [],
  },
  effects: {
    * recommendSearch(_, {call, put, select}) {
      let userId = Taro.getStorageSync('userId')
      const {page, goodsList} = yield select(state => state.pdd);
      const {code, body} = yield call(Api.recommendSearch, {page, userId})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            goodsList: goodsList.concat(body.goodsList),
            totalPage: body.totalPage,
            loadAll: page >= body.totalPage ? true : false,
          }
        })
      }
    },

    * optSearch(_, {call, put, select}) {
      let userId = Taro.getStorageSync('user').userId
      const {page, optId, sortType, goodsList} = yield select(state => state.pdd);
      const {code, body} = yield call(Api.optSearch, {page, optId, sortType, userId})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            goodsList: goodsList.concat(body.goodsList),
            totalPage: body.totalPage,
            loadAll: page >= body.totalPage ? true : false,
          }
        })
      }
    },

    * loadPddBanner(_, {call, put}) {
      const {code, body} = yield call(Api.bannerList)
      if (code == 200) {
        for(let key in body){
          if(key == 5) {
            yield put({
              type: 'save',
              payload: {
                bannerList: body[key]
              }
            })
          }
        }
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
};
