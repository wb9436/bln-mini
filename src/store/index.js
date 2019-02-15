import dva from './dva'

import activity from './activity/index'
import activityDetail from './activity/detail'
import user from './user/index'
import news from './news/index'
import pdd from './pdd/index'
import pddSearch from './pdd/search'

const models = [
  activity,
  activityDetail,
  user,
  news,
  pdd,
  pddSearch,
]

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
