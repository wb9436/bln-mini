import Request from '../../utils/request'

/*活动分类列表查询查询*/
export const activityCategorySearch = data => Request({
  url: '/api/activity/category/get',
  method: 'POST',
  need_sid: false,
  data
})

/*活动列表查询*/
export const activityListSearch = data => Request({
  url: '/api/activity/list/new',
  method: 'POST',
  need_sid: true,
  data
})

/*活动内容详情*/
export const activityContent = data => Request({
  url: '/api/activity/content',
  method: 'POST',
  need_sid: false,
  data
})

/*段子新闻内容详情*/
export const newsContent = data => Request({
  url: '/api/news/content',
  method: 'POST',
  need_sid: false,
  data
})

/*活动简介*/
export const activityBrief = data => Request({
  url: '/api/activity/getSimpleById',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*记录活动参与情况*/
export const recordActivity = data => Request({
  url: '/api/activity/record',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*完成活动任务*/
export const activityEffect = data => Request({
  url: '/api/activity/takeEffect',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*活动点赞*/
export const activityPraise = data => Request({
  url: '/api/activity/like',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*完成活动任务*/
export const getOpenid = data => Request({
  url: '/api/web/getOpenid',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*小程序数据解密*/
export const getDecryptData = data => Request({
  url: '/api/web/getDecryptData',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*活动广告*/
export const activityAd = data => Request({
  url: '/api/activity/footAdv/randomOne',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

/*活动详情活动广告*/
export const activityActAd = data => Request({
  url: '/api/activity/random',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

