module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    BASE_API: '"https://api.viplark.com"',
    PDD_API: '"https://ddk.vipsunyou.com"',
    TOPIC_API: '"https://chat.viplark.com"'
  },
  weapp: {},
  h5: {
    devServer: {
      host: '127.0.0.1',
      port: 10086,
      https: false,
      disableHostCheck: true
    }
  }
}
