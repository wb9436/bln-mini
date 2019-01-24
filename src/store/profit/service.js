import Request from '../../utils/request'

/*每日收益*/
export const dayProfit = data => Request({
  url: '/api/stat/user/dailyEarn',
  method: 'POST',
  need_sid: true,
  data
})

/*任务收益*/
export const taskProfit = data => Request({
  url: '/api/activity/myActivity',
  method: 'POST',
  need_sid: true,
  data
})

/*拼多多*/
export const pddProfit = data => Request({
  url: '/ddk/order/search',
  method: 'POST',
  need_sid: true,
  api_type: 'pdd',
  data
})

/*提现记录*/
export const cashRecord = data => Request({
  url: '/api/withdraw/getLogBySid',
  method: 'POST',
  need_sid: true,
  data
})

/*账户明细-余额变更记录*/
export const accountLog = data => Request({
  url: '/api/user/account/log',
  method: 'POST',
  need_sid: true,
  data
})




