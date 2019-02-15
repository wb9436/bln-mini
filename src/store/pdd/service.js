import Request from '../../utils/request'

/*推荐商品查询*/
export const recommendSearch = data => Request({
  url: '/ddk/goods/search/recommond',
  method: 'POST',
  need_sid: true,
  api_type: 'pdd',
  data
})

/*类目商品查询*/
export const optSearch = data => Request({
  url: '/ddk/goods/search/optGoods',
  method: 'POST',
  need_sid: true,
  api_type: 'pdd',
  data
})

/*商品搜索*/
export const keywordsSearch = data => Request({
  url: '/ddk/goods/searchGoods',
  method: 'POST',
  need_sid: true,
  api_type: 'pdd',
  data
})

/*查询商品详情*/
export const detailSearch = data => Request({
  url: '/ddk/goods/detail',
  method: 'POST',
  api_type: 'pdd',
  data
})

/*查询推广信息*/
export const promotionData = data => Request({
  url: '/ddk/promotion/data',
  method: 'POST',
  api_type: 'pdd',
  data
})
