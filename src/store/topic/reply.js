import * as Api from './service'

export default {
  namespace: 'topicReply',
  state: {
    id: '',
    comment: {
      id: '',
      nickname: '',
      userId: 100180,
      myself: 0,
      avatar: '',
      content: '',
      createTime: new Date().getTime(),
      lastReplyNickname: null,
      praise: 0,
      praiseNum: 0,
      replyNum: 0,
      topicId: '',
      updateTime: new Date().getTime(),
    },
    replyList: [],
    curPageNum: 1,
    pageSize: 10,
    loadAll: false,
  },

  effects: {
    * onInitData({payload}, {put}) {
      const {id, comment} = payload
      yield put({
        type: 'save',
        payload: {
          id: id,
          comment: {
            id: comment.id,
            nickname: comment.nickname,
            userId: comment.userId,
            myself: comment.myself,
            avatar: comment.avatar,
            content: comment.content,
            createTime: comment.createTime,
            lastReplyNickname: comment.lastReplyNickname,
            praise: comment.praise,
            praiseNum: comment.praiseNum,
            replyNum: comment.replyNum,
            topicId: comment.topicId,
            updateTime: comment.updateTime,
          },
          replyList: [],
          curPageNum: 1,
          pageSize: 10,
          loadAll: false,
        }
      })
    },

    * onReloadReplyList(_, {call, put, select}) {
      const {id, pageSize} = yield select(state => state.topicReply)
      let curPageNum = 1
      const {code, body} = yield call(Api.replyList, {id, curPageNum, pageSize})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            replyList: body.array,
            curPageNum: 1,
            loadAll: body.paging.last
          }
        })
      }
    },

    * onLoadReplyList(_, {call, put, select}) {
      const {id, curPageNum, pageSize, replyList} = yield select(state => state.topicReply)
      const {code, body} = yield call(Api.replyList, {id, curPageNum, pageSize})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            replyList: replyList.concat(body.array),
            loadAll: body.paging.last
          }
        })
      }
    },

    * onCommentPraise(_, {call, put, select}) {
      const {id, comment} = yield select(state => state.topicReply)
      let praise = comment.praise
      const {code} = yield call(praise == 1 ? Api.commentUnPraise : Api.commentPraise, {id})
      if(code == 200) {
        comment.praise = praise == 1 ? 0 : 1
        yield put({
          type: 'save',
          payload: {
            comment: comment
          }
        })
      }
    },

    * onReplayPraise({payload}, {call, put, select}) {
      const {id, index, praise} = payload
      const {replyList} = yield select(state => state.topicReply)
      const {code} = yield call(praise == 1 ? Api.unPraiseReply : Api.praiseReply, {id})
      if(code == 200) {
        replyList[index].praise = praise == 1 ? 0 : 1
        if (praise == 1) {
          replyList[index].praiseNum -= 1
        } else {
          replyList[index].praiseNum += 1
        }
        yield put({
          type: 'save',
          payload: {
            replyList: replyList,
          }
        })
      }
    },

    * onReplyDelete({payload}, {call, put, select}) {
      const {index, id} = payload
      const {replyList} = yield select(state => state.topicReply)
      const {code} = yield call(Api.deleteReply, {id})
      if (code == 200) {
        replyList.splice(index, 1)
        yield put({
          type: 'save',
          payload: {
            replyList: replyList,
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
