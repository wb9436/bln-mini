import Request from '../../utils/request'

/*商家主页配置列表*/
export const businessConfig = data => Request({
  url: '/api/business/config/list',
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


/*商家订单*/
export const businessOrder = data => Request({
  url: '/api/ba/order/list',
  method: 'POST',
  need_sid: true,
  data
})

/*商家广告意向*/
export const businessAdvertIdea = data => Request({
  url: '/api/business/idea',
  method: 'POST',
  need_sid: true,
  data
})

/*推广员信息*/
export const agentInfo = data => Request({
  url: '/api/agent/info/get',
  method: 'POST',
  need_sid: true,
  data
})

/*推广员信息修改*/
export const agentUpdate = data => Request({
  url: '/api/agent/info/update',
  method: 'POST',
  need_sid: true,
  data
})

/*推广员商家列表*/
export const agentBusinessList = data => Request({
  url: '/api/agent/business/list',
  method: 'POST',
  need_sid: true,
  data
})

/*商家每日数据*/
export const businessDayData = data => Request({
  url: '/api/stat/ba/order/daily',
  method: 'POST',
  need_sid: true,
  data
})

/*商家每月数据*/
export const businessMonthData = data => Request({
  url: '/api/stat/ba/order/month',
  method: 'POST',
  need_sid: true,
  data
})





