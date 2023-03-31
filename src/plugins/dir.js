export default {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$dir', {
      get () {
        if (this.$t('direction') === 'rtl') {
          return {
            rtl: true,
            ltr: false
          }
        } else {
          return {
            rtl: false,
            ltr: true
          }
        }
      }
    })
  }
}
