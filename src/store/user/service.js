import Request from '../../utils/request'

/*用户手机号登录*/
export const userMobileLogin = data => Request({
  url: '/api/user/login/mobile',
  method: 'POST',
  need_sid: false,
  data
})

/*获取用户信息*/
export const getUserDataBySid = data => Request({
  url: '/api/user/getUserBySid',
  method: 'POST',
  need_sid: true,
  data
})

/*获取用户信息Sid*/
export const getUserInfoBySid = data => Request({
  url: '/api/user/getUserInfoBySid',
  method: 'POST',
  need_sid: true,
  data
})

/*修改密码-获取验证码*/
export const sendForgetCode = data => Request({
  url: '/api/user/forget/sendCode',
  method: 'POST',
  need_sid: false,
  data
})

/*修改密码*/
export const updatePwd = data => Request({
  url: '/api/user/modifyPwd',
  method: 'POST',
  need_sid: false,
  data
})

/*用户注册-获取验证码*/
export const sendRegisterCode = data => Request({
  url: '/api/user/reg/sendCode',
  method: 'POST',
  need_sid: false,
  data
})

/*用户注册-获取用户所在地区*/
export const toMobileRegister = data => Request({
  url: '/api/user/reg/toRegister',
  method: 'POST',
  need_sid: false,
  data
})

/*手机号注册*/
export const mobileRegister = data => Request({
  url: '/api/user/reg/mobile',
  method: 'POST',
  need_sid: false,
  data
})

/*获取用户数据Sid*/
export const getMineData = data => Request({
  url: '/api/user/mine',
  method: 'POST',
  need_sid: true,
  data
})

/*修改用户信息*/
export const updateUserInfo = data => Request({
  url: '/api/user/updateInfo',
  method: 'POST',
  need_sid: true,
  data
})

export const userSignToday = data => Request({
  url: '/api/user/sign/today',
  method: 'POST',
  need_sid: true,
  data
})

