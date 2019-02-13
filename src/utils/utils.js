import Taro from '@tarojs/taro'
import CryptoJS from 'crypto-js'

export const windowHeight = tabPage => {
  let height = Taro.getSystemInfoSync().windowHeight
  if (tabPage && Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    height -= 50
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

/**MD5*/
export const md5 = data => {
  return CryptoJS.MD5(data).toString()
}
