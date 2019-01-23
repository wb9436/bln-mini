import dva from './dva'

import activity from './activity/index'
import user from './user/index'

const models = [
  activity,
  user,
]

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
