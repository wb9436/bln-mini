import dva from './dva'

import activity from './activity/index'

const models = [
  activity,

]

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
