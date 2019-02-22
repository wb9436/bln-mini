import Taro, {Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'
import './index.scss'

class WebViewPage extends Component {
  config = {
    navigationBarTitleText: '帮助中心'
  }

  constructor() {
    super(...arguments)
    this.state = {
      url: '',
    }
  }

  componentDidMount() {
    let url = this.$router.params.url
    if (url) {
      url = decodeURIComponent(url)
    }
    this.setState({url})
  }

  render() {
    const {url} = this.state

    return (
      <WebView src={url} />
    )
  }
}

export default WebViewPage
