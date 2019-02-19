import Taro from '@tarojs/taro'
import * as Api from './service'

export default {
  namespace: 'topicComment',
  state: {
    sid: Taro.getStorageSync('sid'),
    id: null,
    topic: {
      id: null,
      avatar: '',
      nickname: '',
      attention: 0,
      myself: 0,
      content: '',
      type: 0,
      sourceUrl: [],
      shareNum: 0,
      commentNum: 0,
      praise: 0,
      praiseNum: 0,
      createTime: null,
    },
    commentList: [],
    curPageNum: 1,
    pageSize: 10,
    loadAll: false,
  },

  effects: {
    * onInitData({payload}, {put}) {
      const {id} = payload
      yield put({
        type: 'save',
        payload: {
          id: id,
          topic: {
            id: null,
            avatar: '',
            nickname: '',
            attention: 0,
            myself: 0,
            content: '',
            type: 0,
            sourceUrl: [],
            shareNum: 0,
            commentNum: 0,
            hitNum: 0,
            praise: 0,
            praiseNum: 0,
            createTime: null,
          },
          commentList: [],
          curPageNum: 1,
          pageSize: 10,
          loadAll: false,
        }
      })
    },

    * onLoadTopicDetail(_, {call, put, select}) {
      const {id, sid} = yield select(state => state.topicComment)
      const {code, body} = yield call(Api.topicDetail, {id, sid})
      if(code == 200 && body) {
        let content = body.content
        if(Taro.getEnv() === Taro.ENV_TYPE.WEB) {
          content = `<p>${body.content}</p>`
          let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
          content = content.replace(reg, (url) => {
            return  `<a href='${url}' target='_blank'>🔗网页链接</a>`
          })
        }

        yield put({
          type: 'save',
          payload: {
            id: id,
            topic: {
              id: body.id,
              avatar: body.avatar,
              nickname: body.nickname,
              attention: body.attention,
              myself: body.myself,
              content: content,
              type: body.type,
              sourceUrl: body.sourceUrl,
              shareNum: body.shareNum,
              commentNum: body.commentNum,
              hitNum: body.hitNum,
              praise: body.praise,
              praiseNum: body.praiseNum,
              createTime: body.createTime,
            }
          }
        })
      }
    },

    * onReLoadComment(_, {call, put, select}) {
      const {id, sid, pageSize} = yield select(state => state.topicComment)
      const {code, body} = yield call(Api.topicDetail, {id, sid})
      if(code == 200 && body) {
        yield put({
          type: 'save',
          payload: {
            id: id,
            topic: {
              id: body.id,
              avatar: body.avatar,
              nickname: body.nickname,
              attention: body.attention,
              myself: body.myself,
              content: body.content,
              type: body.type,
              sourceUrl: body.sourceUrl,
              shareNum: body.shareNum,
              commentNum: body.commentNum,
              hitNum: body.hitNum,
              praise: body.praise,
              createTime: body.createTime,
            }
          }
        })
      }
      let curPageNum = 1
      let result = yield call(Api.topicCommentList, {id, curPageNum, pageSize})
      if(result.code == 200) {
        yield put({
          type: 'save',
          payload: {
            curPageNum: curPageNum,
            commentList: result.body.array,
            loadAll: result.body.paging.last
          }
        })
      }
    },

    * onInitCommentList(_, {call, put, select}) {
      const {id, sid, pageSize} = yield select(state => state.topicComment)
      let curPageNum = 1
      const {code, body} = yield call(Api.topicCommentList, {id, sid, curPageNum, pageSize})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            commentList: body.array,
            loadAll: body.paging.last,
            curPageNum: curPageNum
          }
        })
      }
    },

    * onLoadCommentList(_, {call, put, select}) {
      const {id, sid, curPageNum, pageSize, commentList} = yield select(state => state.topicComment)
      const {code, body} = yield call(Api.topicCommentList, {id, sid, curPageNum, pageSize})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            commentList: commentList.concat(body.array),
            loadAll: body.paging.last
          }
        })
      }
    },

    * onCommentPraise({payload}, {call, put, select}) {
      const {index, id, praise} = payload
      const {commentList} = yield select(state => state.topicComment)
      const {code} = yield call(praise == 1 ? Api.commentUnPraise : Api.commentPraise, {id})
      if(code == 200) {
        commentList[index].praise = praise == 1 ? 0 : 1
        if (praise == 1) {
          commentList[index].praiseNum -= 1
        } else {
          commentList[index].praiseNum += 1
        }
        yield put({
          type: 'save',
          payload: {
            commentList: commentList,
          }
        })
      }
    },

    * onCommentDelete({payload}, {call, put, select}) {
      const {index, id} = payload
      const {topic, commentList} = yield select(state => state.topicComment)
      const {code} = yield call(Api.deleteComment, {id})
      if (code == 200) {
        topic.commentNum -= 1
        commentList.splice(index, 1)
        yield put({
          type: 'save',
          payload: {
            topic: topic,
            commentList: commentList,
          }
        })
      }
    },

    * onTopicAttention(_, {call, put, select}) {
      const {topic} = yield select(state => state.topicComment)
      const {id, attention} = topic
      const {code} = yield call(attention == 1 ? Api.topicAttentionCancel : Api.topicAttentionAdd, {id})
      if(code == 200) {
        topic.attention = attention == 1 ? 0 : 1
        yield put({
          type: 'save',
          payload: {
            topic: topic
          }
        })
      }
    },

    * onTopicPraise(_, {call, put, select}) {
      const {topic} = yield select(state => state.topicComment)
      const {id, praise} = topic
      console.log(`id: ${id}; praise: ${praise}`)
      const {code} = yield call(praise == 1 ? Api.topicUnPraise : Api.topicPraise, {id})
      if(code == 200) {
        topic.praise = praise == 1 ? 0 : 1
        if (praise == 1) {
          topic.praiseNum -= 1
        } else {
          topic.praiseNum += 1
        }
        yield put({
          type: 'save',
          payload: {
            topic: topic
          }
        })
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    }
  }




}
