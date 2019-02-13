import Request from '../../utils/request'

/*微信公众号分享*/
export const wxGzhShare = data => Request({
  url: '/api/weiXin/share',
  method: 'POST',
  need_sid: false,
  data
})

/*微信公众号卡卷*/
export const wxGzhCard = data => Request({
  url: '/api/weiXin/card',
  method: 'POST',
  need_sid: false,
  data
})
