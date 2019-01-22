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

