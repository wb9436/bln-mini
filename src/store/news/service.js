import Request from '../../utils/request'

/*新闻列表*/
export const newsList = data => Request({
  url: '/api/news/list',
  method: 'POST',
  need_sid: true,
  data
})

/*段子新闻内容详情*/
export const newsContent = data => Request({
  url: '/api/news/content',
  method: 'POST',
  need_sid: false,
  data
})
