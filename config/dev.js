module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    BASE_API: '"https://api.vipsunyou.com"',
    PDD_API: '"https://ddk.vipsunyou.com"',
    TOPIC_API: '"https://chat.vipsunyou.com"'
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
