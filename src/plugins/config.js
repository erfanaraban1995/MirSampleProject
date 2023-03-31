import config from 'SrcConfig'

export default {
  install (Vue) {
    Vue.prototype.$config = config
  }
}
