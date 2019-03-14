import Taro, {Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'

class WebViewPage extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      url: ''
    }
  }

  componentDidMount() {
    const {title} = this.$router.params
    Taro.setNavigationBarTitle({title: decodeURI(title)})

    this.setState({
      url: Taro.getStorageSync('WebUrl')
    })
  }

  render() {
    const {url} = this.state

    return (
      <WebView  src={url} />
    )
  }
}

export default WebViewPage
