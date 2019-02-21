import Taro from '@tarojs/taro'
import {noConsole} from '../config/index'

export default (options = {method: 'GET', data: {}}) => {
  let baseUrl = TOPIC_API
  if (!options.data) {
    options.data = {}
  }
  return Taro.uploadFile({
    url: baseUrl + options.url,
    filePath: options.data.filePath,
    name: 'files',
    formData: {
      sid: Taro.getStorageSync('sid'),
      type: options.data.mediaType
    }
  }).then((res) => {
    const {statusCode, data} = res
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`, res.data)
      }
      return JSON.parse(data)
    } else {
      return {
        code: 201,
        msg: `网络请求错误，状态码${statusCode}`
      }
    }
  }).catch(() => {
    return {
      code: 201,
      msg: `服务器请求异常`
    }
  })
}
