import Request from '../../utils/request'

export const sendRegCode = data => Request({
  url: '/api/user/sendRegCode',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

export const checkRegCode = data => Request({
  url: '/api/user/checkRegCode',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

export const mobileBindWeiXinLogin = data => Request({
  url: '/api/user/wxBind2',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

export const mobileBindWeiXinRegister = data => Request({
  url: '/api/user/reg',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

export const mobileLogin = data => Request({
  url: '/api/user/login',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

export const weiXinMiniLogin = data => Request({
  url: '/api/user/wxMiniLogin',
  method: 'POST',
  need_sid: false,
  no_toast: true,//是否需要弹窗
  data
})

