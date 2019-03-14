// import wx from 'weixin-js-sdk'
import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import PropTypes from 'prop-types'
import * as WxApi from './service'
import {noConsole} from '../../config/index'

class WxShare extends Component {
  static propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    imgUrl: PropTypes.string,
  }
  static defaultProps = {
    link: 'http://web.viplark.com/index.html#/pages/index/index?inviter=' + Taro.getStorageSync('userId'),
    title: '更多优惠尽在百灵鸟App',
    desc: '了解您身边的生活资讯信息，更有拼多多优惠券等你来拿！！！',
    imgUrl: 'https://upload.viplark.com/bln/logo.png',
  }

  constructor() {
    super(...arguments)
    this.state = {
      init: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {init} = this.state
    let oldValue = this.props.link
    let newValue = nextProps.link
    if (!init || newValue !== oldValue) {
      this.setState({
        init: true
      })
      if (!noConsole) {
        console.log(`init: ${init}; props: ${JSON.stringify(this.props)}; nextProps: ${JSON.stringify(nextProps)}`)
      }
      if (process.env.TARO_ENV === 'h5') {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('micromessenger') != -1) {
          let url = window.location.href.split('#')[0]

          WxApi.wxGzhShare({url}).then((res) => {
            const {code, body} = res
            if (code == 200) {
              const {link, title, desc, imgUrl} = nextProps

              window.wx.config({
                debug: false,
                appId: body.appId,
                timestamp: body.timestamp,
                nonceStr: body.nonceStr,
                signature: body.signature,
                jsApiList: [
                  'onMenuShareAppMessage',
                  // 'onMenuShareTimeline',
                  // 'onMenuShareQQ',
                  // 'onMenuShareWeibo',
                  // 'onMenuShareQZone'
                ]
              })
              window.wx.ready(() => {
                //分享给朋友
                window.wx.onMenuShareAppMessage({
                  title: title,
                  desc: desc,
                  link: link,
                  imgUrl: imgUrl,
                  success: function () {
                    // 用户确认分享后执行的回调函数
                  }
                })
              })
            }
          })
        }
      }
    }
  }

  componentWillUnmount() {
    this.setState({
      init: false
    })
  }

  render() {
    return (
      <View></View>
    )
  }
}

export default WxShare
