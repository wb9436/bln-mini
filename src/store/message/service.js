import Request from '../../utils/request'

/*消息查询*/
export const getMsgList = data => Request({
  url: '/api/user/message/list',
  method: 'POST',
  need_sid: true,
  data
})

/*消息读取*/
export const readMsgDetail = data => Request({
  url: '/api/user/message/read',
  method: 'POST',
  need_sid: true,
  data
})

/*标记全部消息已读*/
export const signAllMsg = data => Request({
  url: '/api/user/message/readAll',
  method: 'POST',
  need_sid: true,
  data
})

/*删除消息*/
export const deleteMsg = data => Request({
  url: '/api/user/message/delete',
  method: 'POST',
  need_sid: true,
  data
})
