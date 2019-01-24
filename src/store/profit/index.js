import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'profit',
  state: {
    userId: Taro.getStorageSync('user').userId,
    page: 1,
    pageSize: 10,
    loadAll: false,
    list: [],
  },

  effects: {
    * refreshDdkProfit(_, {call, put, select}) {
      let page = 1
      const {userId, list} = yield select(state => state.profit)

      const {code, body} = yield call(Api.pddProfit, {userId, page})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            page: page,
            loadAll: body.totalPage >= page ? true : false,
            orderList: list.concat(body.orderList),
          }
        })
      }
    },
    * loadDdkProfit(_, {call, put, select}) {
      const {loadAll, userId, page, list} = yield select(state => state.profit)
      if (!loadAll) {
        const {code, body} = yield call(Api.pddProfit, {userId, page: page + 1})
        if (code == 200) {
          let curPage = page + 1
          yield put({
            type: 'save',
            payload: {
              page: curPage,
              loadAll: body.totalPage >= curPage ? true : false,
              orderList: list.concat(body.orderList),
            }
          })
        }
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    }
  },


}

