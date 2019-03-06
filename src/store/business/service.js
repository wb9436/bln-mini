import Request from '../../utils/request'

/*套餐包列表*/
export const mealPackageList = data => Request({
  url: '/api/meal/package/list',
  method: 'POST',
  need_sid: true,
  data
})

/*套餐列表*/
export const mealList = data => Request({
  url: '/api/meal/list',
  method: 'POST',
  need_sid: true,
  data
})

/*商家信息*/
export const businessInfo = data => Request({
  url: '/api/business/info/get',
  method: 'POST',
  need_sid: true,
  data
})

/*收款码*/
export const payCode = data => Request({
  url: '/api/business/getQr',
  method: 'GET',
  data
})

/*行业列表*/
export const industryList = data => Request({
  url: '/api/business/industry/list',
  method: 'POST',
  need_sid: true,
  data
})

/*商家信息修改*/
export const businessUpdate = data => Request({
  url: '/api/business/info/update',
  method: 'POST',
  need_sid: true,
  data
})

/*商家推广订单*/
export const businessActList = data => Request({
  url: '/api/business/activity',
  method: 'POST',
  need_sid: true,
  data
})



