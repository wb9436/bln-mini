import Taro, {Component} from '@tarojs/taro'
import {View, Textarea, Image} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import './add.scss'

import * as Api from '../../store/topic/service'

import add from '../../images/topic/add.png'

class TopicAdd extends Component {
  config = {
    navigationBarTitleText: '发布话题'
  }

  constructor() {
    super(...arguments)
    this.state = {
      area: Taro.getStorageSync('topicAddress') || Taro.getStorageSync('address') || '上海市 上海市 浦东新区',
      nickname: Taro.getStorageSync('user').nickname,
      mediaType: 1,//0=纯文本,1=图片;2=视频
      sourceUrl: [],//存储资源地址
      content: '',//文本内容
      autoHeight: true,//自动增高
      clickAdd: false,
    }
  }

  onCancelAddTopic = () => {
    Taro.navigateBack()
  }

  onUpdateImage = (index) => {
    const {sourceUrl} = this.state
    Taro.chooseImage({
      count: 1
    }).then((data) => {
      sourceUrl[index] = data.tempFilePaths[0]
      this.setState({
        sourceUrl: sourceUrl
      })
    })
  }

  onRemoveImage = (index, e) => {
    const {sourceUrl} = this.state
    sourceUrl.splice(index, 1)
    this.setState({
      sourceUrl: sourceUrl
    })
    e.stopPropagation()
  }

  onUploadNewFile = () => {
    const {sourceUrl} = this.state
    Taro.chooseImage({
      count: (9 - sourceUrl.length) > 0 ? (9 - sourceUrl.length) : 0
    }).then((data) => {
      this.setState({
        sourceUrl: sourceUrl.concat(data.tempFilePaths)
      })
    }).catch(res => {
      console.log(res)
    })
  }

  onAddTopic = () => {
    const {area, clickAdd, content, mediaType, sourceUrl} = this.state
    if(clickAdd) return
    if ((!content || content.trim === '') && sourceUrl.length <= 0) {
      Taro.showToast({
        icon: 'none',
        title: '请输入分享内容'
      })
      return
    }
    this.setState({
      clickAdd: true
    })
    Taro.showToast({
      icon: 'loading',
      title: '正在发布',
      duration: 300000
    })
    let sid = Taro.getStorageSync('sid')
    let url = TOPIC_API + '/chat/tools/files/upload'
    this.uploadImage({
      sid: sid,
      url: url,
      area: area,
      mediaType: mediaType,
      path: sourceUrl,
      content: content
    })
  }

  uploadImage = (data) => {
    let path = data.path
    if (path && path.length > 0) {
      let i = data.i ? data.i : 0
      let success = data.success ? data.success : 0
      let fail = data.fail ? data.fail : 0
      let filePath = data.filePath ? data.filePath : []
      Taro.uploadFile({
        url: data.url,
        filePath: path[i],
        name: 'files',
        formData: {
          sid: data.sid,
          type: data.mediaType
        },
        success: (res) => {
          success++
          if (res.statusCode == 200) {
            const {code, body} = JSON.parse(res.data)
            if (code == 200) {
              filePath.push(body[0])
            } else {
              console.log(`上传失败: ${res.data}`)
            }
          }
        },
        fail: () => {
          fail++
          console.log('fail:' + i + "fail:" + fail)
        },
        complete: () => {
          i++
          if (i == path.length) { //当图片传完时，停止调用
            // console.log('执行完毕: 成功：' + success + ' 失败：' + fail + '; filePath: ' + JSON.stringify(filePath))
            this.onSaveTopic(data.area, data.mediaType, data.content, filePath)
          } else {//若图片还没有传完，则继续调用函数
            // console.log(`当前上传第${i}张图片`)
            data.i = i
            data.success = success
            data.fail = fail
            data.filePath = filePath
            this.uploadImage(data)
          }
        }
      })
    } else {
      this.onSaveTopic(data.area, data.mediaType, data.content, [])
    }
  }

  // 发布话题
  onSaveTopic(area, mediaType, content, filePath) {
    let type = 0
    let files = filePath.length > 0 ? filePath.toLocaleString() : ''
    if (filePath.length > 0) {
      type = mediaType
    }
    Api.addTopic({area, type, content, files}).then((data) => {
      Taro.hideToast()
      const {code, msg} = data
      if (code == 200) {
        Taro.reLaunch({
          url: '/pages/city/index'
        })
      } else {
        this.setState({
          clickAdd: false
        })
        let title = '发布失败'
        if (code == 9001) {
          title = msg
        }
        Taro.showToast({
          icon: 'none',
          title: title
        })
      }
    })
  }

  onInput(e) {
    this.setState({
      content: e.detail.value
    })
  }

  onLineChange = (e) => {
    if (e.detail.lineCount >= 10) {
      this.setState({
        autoHeight: false
      })
    }
  }

  render() {
    const {sourceUrl, autoHeight, nickname} = this.state

    return (
      <View className='topic-add-page'>
        <View className='nav-header'>
          <View className='cancel-btn' onClick={this.onCancelAddTopic}>取消</View>
          <View className='nav-title'>
            <View className='title-desc'>发话题</View>
            <View className='topic-author'>{nickname}</View>
          </View>
          <View className='send-btn' onClick={this.onAddTopic.bind(this)}>发布</View>
        </View>

        <View className='topic-content'>
          <Textarea className='topic-input' placeholder='分享新鲜事...' focus autoFocus
            maxlength='400'
            autoHeight={autoHeight}
            showConfirmBar
            onInput={this.onInput.bind(this)} onLinechange={this.onLineChange.bind(this)}
          />
        </View>

        <View className='topic-media'>
          <View className='topic-img-list'>
            {sourceUrl.map((item, index) => (
              <View key={index} className='topic-img-box'>
                <Image className='topic-img' src={item} mode='aspectFill' onClick={this.onUpdateImage.bind(this, index)} />

                <View className='remove-btn' onClick={this.onRemoveImage.bind(this, index)}>
                  <AtIcon value='close-circle' size={20} />
                </View>
              </View>
            ))}
            {/*图片最多上传9张*/}
            { sourceUrl.length < 9 ?
              <View className='topic-img-box'>
                <Image className='topic-img' src={add} mode='aspectFill' onClick={this.onUploadNewFile.bind(this)} />
              </View> : ''
            }
          </View>
        </View>

      </View>
    )
  }
}

export default TopicAdd
