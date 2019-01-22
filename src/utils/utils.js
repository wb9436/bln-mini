import Taro from '@tarojs/taro'

export const windowHeight = tabPage => {
  let height = Taro.getSystemInfoSync().windowHeight
  if (tabPage && Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    height -= 50
  }
  return height
}


