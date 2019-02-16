import Request from '../../utils/request'

/*话题列表*/
export const topicList = data => Request({
  url: '/chat/topic/list',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*关注话题列表*/
export const attentionTopicList = data => Request({
  url: '/chat/topic/attention/list',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*话题点赞*/
export const topicPraise = data => Request({
  url: '/chat/topic/praise',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*话题取消点赞*/
export const topicUnPraise = data => Request({
  url: '/chat/topic/unPraise',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*话题关注*/
export const topicAttentionAdd = data => Request({
  url: '/chat/topic/attention/add',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*话题取消关注*/
export const topicAttentionCancel = data => Request({
  url: '/chat/topic/attention/cancel',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*发布话题*/
export const addTopic = data => Request({
  url: '/chat/topic/add',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*删除话题*/
export const deleteTopic = data => Request({
  url: '/chat/topic/delete',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})

/*举报话题*/
export const reportTopic = data => Request({
  url: '/chat/topic/report',
  method: 'POST',
  need_sid: true,
  no_toast: true,
  api_type: 'topic',
  data
})
