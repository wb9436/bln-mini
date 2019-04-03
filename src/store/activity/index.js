import Taro from '@tarojs/taro'
import * as Api from './service'

import RecommendIcon from '../../images/activity/recommend.png'

export default {
  namespace: 'activity',
  state: {
    scrollTop: 0,
    actTypes: [{name: '推荐', imgUrl: RecommendIcon, id: 1}],
    category: '推荐',
    activityList: [],
    loadAll: false,
    pageSize: 10,
    curPageNum: 1,
    sortType: 0, //排序：0=最新；1=酬金；4=热度
  },

  effects: {
    * loadActType(_, {call, put}) {
      const {code, body} = yield call(Api.activityCategorySearch)
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            actTypes: [{name: '推荐', imgUrl: RecommendIcon, id: 1}].concat(body)
          }
        })
      }
    },

    * refreshActivity(_, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          scrollTop: 0,
          activityList: [],
        }
      })
      let curPageNum = 1
      const {category, pageSize, sortType} = yield select(state => state.activity)
      let params = {curPageNum, pageSize, sortType}
      if (category !== '推荐') {
        params.category = category
      }
      const {code, body} = yield call(Api.activityListSortSearch, params)
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
      const {category, activityList, pageSize, curPageNum, loadAll, sortType} = yield select(state => state.activity)
      if (!loadAll) {
        let params = {pageSize, sortType}
        if (category !== '推荐') {
          params.category = category
        }
        params.curPageNum = curPageNum + 1
        const {code, body} = yield call(Api.activityListSortSearch, params)
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
