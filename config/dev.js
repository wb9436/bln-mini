module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    BASE_API: '"https://test.viplark.com"',
    PDD_API: '"https://test.viplark.com"',
    TOPIC_API: '"https://test.viplark.com"',
    WX_WEB: '"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14f256ba4fe122d3&redirect_uri=http://api.viplark.com/api/user/wxH5Login&response_type=code&scope=snsapi_userinfo&state=a#wechat_redirect5"'
  },
  weapp: {},
  h5: {
    devServer: {
      host: '192.168.1.166',
      port: 10086,
      https: false,
      disableHostCheck: true
    }
  }
}
