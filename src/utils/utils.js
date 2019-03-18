import Taro from '@tarojs/taro'
import * as Constant from '../config/index'
import CryptoJS from 'crypto-js'
// import WeiXinUtils from 'weixin-js-sdk'

export const windowHeight = tabPage => {
  let height = Taro.getSystemInfoSync().windowHeight
  if (tabPage && Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    height -= 53
  }
  return height
}

/*金额(分)格式化*/
export const formatPrice = price => {
  if (Number.isNaN(price)) {
    return 0;
  }
  if (price < 1) {
    return 0;
  }
  let f = Math.round(price) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/*两位小数*/
export const formatPricePoint = x => {
  let f = parseFloat(x);
  if (Number.isNaN(f) || f == 0) {
    return 0;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*格式化时间*/
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

/*格式化时间*/
export const formatSimpleTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/*格式化时间*/
export const formatSimpleTimeMonth = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('-')
}

/*判断是否为今天*/
export const isTodayDay = date => {
  if (!date) {
    return false
  }
  let dateStr = formatSimpleTime(date)
  let today = formatSimpleTime(new Date())
  if (dateStr === today) {
    return true
  } else {
    return false
  }
}

export const accountLogType = data => {
  let desc = ''
  if(!Number.isNaN(data)) {
    switch (data) {
      case 0:
        desc = '新注册用户'
        break;
      case 1:
        desc = '佣金'
        break;
      case 2:
        desc = '提现'
        break;
      case 3:
        desc = '其他'
        break;
    }
  }
  return desc
}

/**推广订单结算状态*/
export const ddkOrderState = data => {
  let desc = ''
  if(!Number.isNaN(data)) {
    switch (data) {
      case -1:
        desc = '未支付'
        break;
      case 0:
        desc = '不可提现'
        break;
      case 1:
        desc = '已支付'
        break;
      case 2:
        desc = '已结算'
        break;
    }
  }
  return desc
}

/*显示距现在时间*/
export const timeDesc = time => {
  let desc = ''
  if(Number.isNaN(time)) {
    return desc
  }
  let diff = parseInt(new Date().getTime() / 1000) - time
  if (diff <= 0) {
    desc = '刚刚'
  } else {
    let month = parseInt(diff / 3600 / 24 / 30)
    if (month > 0) {
      desc = `${month}月前`
    } else {
      let day = parseInt(diff / 3600 / 24)
      if (day > 0) {
        desc = `${day}天前`
      } else {
        let hour = parseInt(diff / 3600)
        if (hour > 0) {
          desc = `${hour}小时前`
        } else {
          let minute = parseInt(diff / 60)
          if (minute > 0) {
            desc = `${minute}分钟前`
          } else {
            desc = `${diff}秒前`
          }
        }
      }
    }
  }
  return desc
}

/**MD5*/
export const md5 = data => {
  return CryptoJS.MD5(data).toString()
}

export const previewImage = (current, urls) => {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    window.wx.previewImage({
      current: current,
      urls: urls
    })
  } else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    Taro.previewImage({
      current: current,
      urls: urls
    })
  }
}

export const isWeiXin = () => {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') != -1) {
      return true
    } else {
      return false
    }
  }
  return false
}

export const isIdCard = (idCard) => {
  if (!idCard || (idCard.toString().length != 18 && idCard.toString().length != 15)) {
    return false
  }
  idCard = idCard.toString()
  const reg = /^(\d{6})(19|20)(\d{2})(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])(\d{3})(\d|X|x)?$/
  if (reg.test(idCard)) {
    return true
  }
  return false
}


export const isMobile = (mobile) => {
  if (!mobile || mobile.toString().length != 11) {
    return false
  }
  mobile = mobile.toString()
  const reg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/
  if (reg.test(mobile)) {
    return true
  }
  return false
}


export const isNumber = (val) => {
  if (!val) {
    return false
  }
  const reg = /^\d+$/
  if (reg.test(val)) {
    return true
  }
  return false
}

export const getVersionNo = () => {
  let versionNo = Constant.versionNo
  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    versionNo = 'WeApp:' + versionNo
  }
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    versionNo = 'Web:' + versionNo
  }
  return versionNo
}

export const getFrom = () => {
  let from = ''
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    from = 'web'
  } else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    from = 'mini'
  }
  return from
}
