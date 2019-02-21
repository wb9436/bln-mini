import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import PropTypes from 'prop-types'
import {AtIcon} from 'taro-ui'
import './index.scss'

/**
 * 排序列表
 */
class SortList extends Component {
  static propTypes ={
    /** 排序选择 */
    onSortChecked: PropTypes.func,
  }
  static defaultProps = {
    onSortChecked: null,
  }
  constructor() {
    super(...arguments)
    this.state = {
      sortTypes: [
        {typeId: 0, name: '综合排序', types: []},
        {typeId: 1, name: '佣金比例', types: [{type: 1, icon: 'chevron-up', desc: '升序'},{type: 2, icon: 'chevron-down', desc: '降序'}]},
        {typeId: 2, name: '价格', types: [{type: 3, icon: 'chevron-up', desc: '升序'},{type: 4, icon: 'chevron-down', desc: '降序'}]},
        {typeId: 3, name: '销量', types: [{type: 5, icon: 'chevron-up', desc: '升序'},{type: 6, icon: 'chevron-down', desc: '降序'}]}
      ],
      typeId: 0,
      sortType: 0
    }
  }

  onSortChecked(typeIdDef) {
    var isChange = false
    var sortTypeDef = 0
    const {typeId, sortType} = this.state
    if (typeId == typeIdDef && typeIdDef != 0) {
      isChange = true
      if (typeIdDef == 1) {
        sortTypeDef = sortType == 1 ? 2 : 1
      } else if (typeIdDef == 2) {
        sortTypeDef = sortType == 3 ? 4 : 3
      } else if (typeIdDef == 3) {
        sortTypeDef = sortType == 5 ? 6 : 5
      }
    } else if (typeId !== typeIdDef) {
      isChange = true
      if (typeIdDef == 0) {
        sortTypeDef = 0
      } else if (typeIdDef == 1) {
        sortTypeDef = 2
      } else if (typeIdDef == 2) {
        sortTypeDef = 4
      } else if (typeIdDef == 3) {
        sortTypeDef = 6
      }
    }
    if(isChange){
      this.setState({
        typeId: typeIdDef,
        sortType: sortTypeDef
      })
      this.props.onSortChecked(sortTypeDef)
    }
  }

  render() {
    const { sortTypes, typeId, sortType } = this.state
    const sortContent = sortTypes.map((item) => {
      return <View key={item.typeId} className='sort-item' onClick={this.onSortChecked.bind(this, item.typeId)}>
        <View className={item.typeId == typeId ? 'sort-name sort-checked' : 'sort-name'}>
          {item.name}
        </View>
        {item.types.length > 0 ?
          <View className='sort-icon'>
            {item.types.map(sort => {
              return <AtIcon key={sort.type} size='15' color={sort.type == sortType ? '#EE735D' : ''} value={sort.icon} />
            })}
          </View> : ''
        }
      </View>
    })

    return (
      <View className='sort-view'>
        {sortContent}
      </View>
    )
  }
}

export default SortList
