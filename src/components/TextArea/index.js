import Taro, {Component} from '@tarojs/taro'
import {View, Textarea, Image} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

import hide from '../../images/topic/hide.png'

class TextInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    isOpened: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
  }
  static defaultProps = {
    placeholder: '请输入内容',
    maxLength: 180,
    isOpened: false,
    onCancel: null,
    onConfirm: null,
  }

  constructor() {
    super(...arguments)
    this.state = {
      placeholder: '',
      maxLength: 0,
      isOpened: false,
      content: '',
      bottom: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      placeholder: nextProps.placeholder,
      maxLength: nextProps.maxLength,
      isOpened: nextProps.isOpened,
      content: '',
      bottom: false,
    })
  }

  onFocus() {
    this.setState({
      bottom: true,
    })
  }

  onInput(e) {
    this.setState({
      content: e.detail.value
    })
  }

  onCancel() {
    this.setState({
      isOpened: false,
      content: '',
    })
    this.props.onCancel(false)
  }

  onConfirm() {
    const {content} = this.state
    this.setState({
      isOpened: false,
      content: '',
    })
    this.props.onConfirm(content)
  }

  render() {
    const {bottom, placeholder, maxLength, isOpened, content} = this.state

    return (
      <View className={isOpened ? 'textarea-layout textarea-layout--active' : 'textarea-layout'}>
        <View className='textarea-layout__overlay' onClick={this.onCancel.bind(this)} />
        <View className='textarea-layout__container' style={bottom ? `margin-bottom:50px`:''}>
          <View className='layout-body'>
            <Textarea className='textarea-input' placeholder={placeholder}
              focus={isOpened}
              autoFocus={isOpened}
              fixed
              cursorSpacing={60}
              showConfirmBar
              maxlength={maxLength}
              value={content}
              onFocus={this.onFocus.bind(this)}
              onInput={this.onInput.bind(this)}
              onConfirm={this.onConfirm.bind(this)}
            >
            </Textarea>
            <View className='layout-btn'>
              <View className='cancel' onClick={this.onCancel.bind(this)}>
                <View className='hide-img'>
                  <Image mode='widthFix' src={hide} />
                </View>
              </View>
              <View className='confirm' onClick={this.onConfirm.bind(this)}>发送</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default TextInput
