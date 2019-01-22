import dva from './dva'


const models = []

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})

const store = dvaApp.getStore()

export default store
