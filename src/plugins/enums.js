import enums from '@/lib/enums'

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$enums', {
      get() {
        return enums
      }
    })
  }
}
