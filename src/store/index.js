import dva from './dva'

import activity from './activity/index'
import activityDetail from './activity/detail'
import user from './user/index'
import news from './news/index'
import pdd from './pdd/index'
import pddSearch from './pdd/search'
import pddDetail from './pdd/detail'
import cityTopic from './topic/index'
import topicComment from './topic/comment'

const models = [
  activity,
  activityDetail,
  user,
  news,
  pdd,
  pddSearch,
  pddDetail,
  cityTopic,
  topicComment,
]

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
