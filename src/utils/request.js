import Taro from '@tarojs/taro'
import {noConsole} from '../config/index'

export default (options = {method: 'GET', data: {}, need_sid: false, no_toast: false, api_type: 'api'}) => {
  let baseUrl = BASE_API
  if (options.api_type && options.api_type === 'pdd') {
    baseUrl = PDD_API
  } else if (options.api_type && options.api_type === 'topic') {
    baseUrl = TOPIC_API
  }
  if (!options.data) {
    options.data = {}
  }
  let sid = Taro.getStorageSync('sid')
  if (options.need_sid && sid) {
    options.data.sid = sid
  }
  if (!noConsole) {
    console.log(`${new Date().toLocaleString()} 【 D=${baseUrl} 】【 M=${options.url} 】P=${JSON.stringify(options.data)}`)
  }
  return Taro.request({
    url: baseUrl + options.url,
    method: options.method.toUpperCase(),
    data: options.data,
    header: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    const {statusCode, data} = res
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`, res.data)
      }
      if (data.code != 200) {
        if (data.code == 10071 || data.code == 10072 || (!sid && options.need_sid)) {
          Taro.removeStorageSync('sid')
          Taro.removeStorageSync('address')
          Taro.removeStorageSync('user')

          if (!options.no_toast) {
            Taro.showToast({
              title: `登录失效，重新登录`,
              icon: 'none'
            })
          }
          Taro.redirectTo({
            url: '/pages/login/index'
          })
        } else {
          if (!options.no_toast) {
            Taro.showToast({
              title: `${data.msg}`,
              icon: 'none'
            })
          }
        }
      }
      return data
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
