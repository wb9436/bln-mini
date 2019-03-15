import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'

import * as Api from '../../store/business/service'

class PromoterBusiness extends Component {
  config = {
    navigationBarTitleText: '推广员'
  }
  constructor() {
    super(...arguments)
    this.state = {
      businessList: [],
      pageSize: 20,
      curPageNum: 1,
      loadAll: false,
    }
  }

  componentDidMount() {
    const {curPageNum, pageSize} = this.state
    Api.agentBusinessList({curPageNum, pageSize}).then(data => {
      console.log(data)
      const {code, body} = data
      if (code == 200) {
        this.setState({
          businessList: body.array,
          loadAll: body.paging.last
        })
      }
    })
  }


  render() {
    return (
      <View className='promoter-business-page'>
        BusinessPromoter
      </View>
    )
  }
}

export default PromoterBusiness
