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

/*用户排行榜*/
export const userRankList = data => Request({
  url: '/api/user/rank',
  method: 'POST',
  need_sid: true,
  data
})


/*用户好友列表*/
export const userFriends = data => Request({
  url: '/api/user/friends',
  method: 'POST',
  need_sid: true,
  data
})

/*问题列表*/
export const questionList = data => Request({
  url: '/api/question/list',
  method: 'POST',
  need_sid: true,
  data
})

/*红包列表*/
export const awardList = data => Request({
  url: '/api/user/award/awardList',
  method: 'POST',
  need_sid: true,
  data
})

/*红包领取*/
export const awardReceive = data => Request({
  url: '/api/user/award/receiveAward',
  method: 'POST',
  need_sid: true,
  data
})


