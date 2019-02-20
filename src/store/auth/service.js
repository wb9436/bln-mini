import Request from '../../utils/request'
import Upload from '../../utils/upload'

/*认证结果查询*/
export const authResultGet = data => Request({
  url: '/api/user/realName/get',
  method: 'POST',
  need_sid: true,
  data
})

/*实名认证*/
export const userAuth = data => Request({
  url: '/api/user/realName/update',
  method: 'POST',
  need_sid: true,
  data
})

/*上传文件*/
export const uploadFile = data => Upload({
  url: '/chat/tools/files/upload',
  method: 'POST',
  data
})

