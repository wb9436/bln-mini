import {Taro, Component} from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import 'index.scss'

export default class ActionSheet extends Component {
  static defaultProps = {
    title: '',
    cancelText: '',
    isOpened: false,
  }
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    isOpened: PropTypes.bool,
    cancelText: PropTypes.string,
  }
  constructor (props) {
    super(...arguments)
    const { isOpened } = props

    this.state = {
      _isOpened: isOpened
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      })

      !isOpened && this.handleClose()
    }
  }

  handleClose = () => {
      this.props.onClose()
  }

  handleCancel = () => {
    this.close()
    return this.props.onCancel()
  }

  close = () => {
    this.setState(
      {
        _isOpened: false
      },
      this.handleClose
    )
  }

  handleTouchMove = e => {
    e.stopPropagation()
    e.preventDefault()
  }

  render () {
    const {title, cancelText} = this.props
    const {_isOpened} = this.state

    return (
      <View className={_isOpened ? 'at-action-sheet at-action-sheet--active' : 'at-action-sheet'} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className='at-action-sheet__overlay' />
        <View className='at-action-sheet__container'>
          {title && <View className='at-action-sheet__header'>{title}</View>}
          <View className='at-action-sheet__body'>{this.props.children}</View>
          {cancelText && (
            <View onClick={this.handleClick} className='at-action-sheet__footer'>
              {cancelText}
            </View>
          )}
        </View>
      </View>
    )
  }
}


