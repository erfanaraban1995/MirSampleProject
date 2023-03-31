import api from '@/api'

export default {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$api', {
      get () {
        return api(this.$store)
      }
    })
  }
}
