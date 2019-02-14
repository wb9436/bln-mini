import Request from '../../utils/request'

/*H5小游戏列表*/
export const gameList = data => Request({
  url: '/api/h5game/list',
  method: 'POST',
  need_sid: true,
  data
})
