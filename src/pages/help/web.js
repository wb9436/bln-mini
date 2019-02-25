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
    const {id, userId} = this.$router.params
    let url = `https://api.vipsunyou.com/api/question/info?id=${id}&userId=${userId}`
    this.setState({url})
  }

  render() {
    const {url} = this.state

    return (
      <WebView className='web-view-page' src={url} />
    )
  }
}

export default WebViewPage
