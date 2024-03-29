import { defaultAlova } from './alova'
import qs from 'qs'

const models = ['catalog', 'post', 'essay']

const restful = {}

models.forEach((model) => {
  const upFristChatModelName = model.slice(0, 1).toUpperCase() + model.slice(1)
  restful[`get${upFristChatModelName}`] = (_id) => defaultAlova.Get(`/${model}/${_id}`)
  restful[`get${upFristChatModelName}s`] = (params) =>
    defaultAlova.Get(`/${model}?${qs.stringify(params)}`)
})

export default restful
