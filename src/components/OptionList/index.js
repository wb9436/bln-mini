import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

/**
 * 商品类目列表
 */
class OptionList extends Component {
  static propTypes ={
    /** 类目选择 */
    onOptChecked: PropTypes.func,
  }
  static defaultProps = {
    onOptChecked: null,
  }
  constructor() {
    super(...arguments)
    this.state = {
      goodsOpts: [
        {optName: '推荐', optId: -1}, {optName: '美食', optId: 1}, {optName: '母婴', optId: 4}, {optName: '水果', optId: 13},
        {optName: '服饰', optId: 14}, {optName: '百货', optId: 15}, {optName: '美妆', optId: 16}, {optName: '家装', optId: 1917},
        {optName: '汽车', optId: 2048}, {optName: '手机', optId: 1543}, {optName: '内衣', optId: 1282}, {optName: '鞋包', optId: 1281},
        {optName: '运动', optId: 1451}, {optName: '电器', optId: 18}, {optName: '男装', optId: 743}, {optName: '家纺', optId: 818}
      ],
      optId: -1
    }
  }

  onOptChecked(itemId) {
    this.setState({
      optId: itemId
    })
    this.props.onOptChecked(itemId)
  }

  render() {
    const {goodsOpts, optId} = this.state
    const optContent = goodsOpts.map((item) => {
      return <View key={item.optId} className={optId == item.optId ?'opt-item opt-checked' : 'opt-item'} onClick={this.onOptChecked.bind(this, item.optId)}>
        {item.optName}
      </View>
    })

    return (
      <View className='opt-view'>
        <ScrollView scrollX className='opt-list' >
          {optContent}
        </ScrollView>
      </View>
    )
  }
}

export default OptionList
