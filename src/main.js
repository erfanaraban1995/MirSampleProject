// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'

import config from 'SrcConfig'

import PortalVue from 'portal-vue'
import BootstrapVue from 'bootstrap-vue'
import Config from './plugins/config'
import directives from './plugins/directives'
import i18n from './plugins/i18n'
import Api from './plugins/api'
import Enums from './plugins/enums'
import './plugins/global-components'
import Dir from './plugins/dir'
import Mixin from './plugins/global-mixin'
import Meta from 'vue-meta'
import Snotify from 'vue-snotify'
import VeeValidate from 'vee-validate'
import VueMask from 'v-mask'

Vue.use(PortalVue)
Vue.use(BootstrapVue)
Vue.use(directives)
Vue.use(Config)
Vue.use(Api)
Vue.use(Dir)
Vue.use(Enums)
Vue.use(Mixin)
Vue.use(VueMask)
Vue.use(Meta)
Vue.use(Snotify)
Vue.use(VueMask)
Vue.use(VeeValidate, {fieldsBagName: 'veeFields'})

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {fas as solid} from '@fortawesome/free-solid-svg-icons'

import {faCircle as farCircle} from '@fortawesome/free-regular-svg-icons'
library.add(farCircle)
library.add(solid)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// import ApiAdapter from '@/api'
import * as types from './store/types'
import store from './store'
import router from './router'
import {permissionsHaveNamespaces} from '@/lib/account'
import {get as getData} from '@/lib/local-storage'

// Set Account ----------------------------------------
let account = getData(types.ACCOUNT_COOKIE)
if (account) {
  store.commit(types.SET_ACCOUNT, account)
}
// ---------------------------------------------------

router.beforeEach((to, from, next) => {
  let promise = Promise.resolve()

  store.commit(types.SET_LOADING, true)

  promise.then(() => {
    let allowed = false

    const msgOptions = {
      timeout: 3000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      position: 'leftBottom',
      bodyMaxLength: 500,
      titleMaxLength: 100
    }

    if (!to.meta.auth) {
      allowed = true
    } else if (store.state.$account && store.state.$account.roles.length) {
      if (to.meta.auth === true) {
        allowed = true
      } else if (store.state.$account && permissionsHaveNamespaces(to.meta.auth, store.state.$account.permissions)) {
        allowed = true
      }
    }

    if (!allowed) {
      let path = '/login'
      if (to.path !== config.homeUrl) {
        Vue.prototype.$snotify.error(i18n.t('errorCodes.ACCESS_DENIED'), msgOptions)
      }
      next(path)
    } else {
      next()
    }
  })
})

router.afterEach(() => {
  store.commit(types.SET_LOADING, false)
})

/* eslint-disable no-new */

import App from './App'

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: {
    App
  },
  beforeCreate() {
    let locale = getData(types.LOCALE_COOKIE) || config.locale
    this.$store.commit(types.SET_LOCALE, {
      value: locale,
      validator: this.$validator,
      i18n: this.$i18n
    })
  }
})
