import * as Api from './service'

export default {
  namespace: 'pddDetail',
  state: {
    userId: '',
    goodsId: '',
    goodsName: '',
    soldQuantity: 0,
    groupPrice: 0,
    groupPromotePrice: 0,
    galleryUrls: [],
    couponDiscount: 0,
    couponRemainQuantity: 0,
    buyUrl: '',
    shareImageUrl: '',
    shareUrl: '',
    thumbnailUrl: '',
    promotionData: null,//拼多多推广数据
  },

  effects: {
    * detailSearch({payload}, {call, put}) {
      let userId = payload.userId
      let goodsId = payload.goodsId
      const {code, body} = yield call(Api.detailSearch, {goodsId, userId})
      if (code == 200) {
        yield put({
          type: 'save',
          payload: {
            userId: userId,
            goodsId: body.goodsDetail.goodsId,
            goodsName: body.goodsDetail.goodsName,
            soldQuantity: body.goodsDetail.soldQuantity,
            groupPrice: body.goodsDetail.groupPrice,
            groupPromotePrice: body.goodsDetail.groupPromotePrice,
            galleryUrls: body.goodsDetail.galleryUrls,
            couponDiscount: body.goodsDetail.couponDiscount,
            couponRemainQuantity: body.goodsDetail.couponRemainQuantity,
            buyUrl: body.goodsDetail.buyUrl,
            shareImageUrl: body.goodsDetail.shareImageUrl,
            shareUrl: body.goodsDetail.shareUrl,
            thumbnailUrl: body.goodsDetail.thumbnailUrl,
          }
        })
      }
    },

    * initPromotionData({payload}, {call, put}) {
      let userId = payload.userId
      let goodsId = payload.goodsId
      const {code, body} = yield call(Api.promotionData, {goodsId, userId})
      if(code == 200) {
        yield put({
          type: 'save',
          payload: {
            promotionData: body.promotionData
          }
        })
      }
    }

  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  }
}
