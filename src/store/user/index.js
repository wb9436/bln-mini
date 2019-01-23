import * as Api from './service'

export default {
  namespace: 'user',
  state: {
    sid: '',
    address: '',
    isAuth: '',
    userData: {
      userId: 0,
      mobile: '',
      nickname: '',
      avatar: '',
      marketId: '',
      isAgent: 0,
      wxGzhOpenid: null,
    },
    userAccount: {
      credits: 0, //信用积分
      amount: null,//总收益
      point: 0,//阅点
      growthValue: 0,//成长值
      money: null,//余额
    },
    userSign: {
      signTime: null,//签到时间
      countSign: 0,//累计签到次数
      count: 0,//连续签到次数
    }
  },

  effects: {
    * setMineData(_, {call, put}) {
      const {code, body} = yield call(Api.getMineData)
      if (code == 200) {
        if (body.account && body.user) {
          yield put({
            type: 'save',
            payload: {
              isAuth: body.isAuth,
              userData: {
                userId: body.user.userId,
                mobile: body.user.mobile,
                nickname: body.user.nickname,
                avatar: body.user.avatar,
                marketId: body.user.marketId,
                isAgent: body.user.isAgent,
                wxGzhOpenid: body.user.wxGzhOpenid,
              },
              userAccount: {
                credits: body.account.credits,
                amount: body.account.amount,
                point: body.account.point,
                growthValue: body.account.growthValue,
                money: body.account.money,
              }
            }
          })
        }
        if (body.userSign) {
          yield put({
            type: 'save',
            payload: {
              userSign: {
                signTime: body.userSign.signTime,
                countSign: body.userSign.countSign,
                count: body.userSign.count,
              }
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

