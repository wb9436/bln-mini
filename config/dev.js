module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    BASE_API: '"https://api.viplark.com"',
    PDD_API: '"https://ddk.viplark.com"',
    TOPIC_API: '"https://chat.viplark.com"'
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
