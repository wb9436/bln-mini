import dva from './dva'

import activity from './activity/index'
import activityDetail from './activity/detail'
import user from './user/index'

const models = [
  activity,
  activityDetail,
  user,
]

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
