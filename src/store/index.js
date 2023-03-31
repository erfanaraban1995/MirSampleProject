import Vue from 'vue'
import Vuex from 'vuex'

import config from 'SrcConfig'

import actions from './actions'

import mutations from './mutations'

import createLogger from './plugins/logger'
// import devtool from './plugins/devtool'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    $account: null,
    $locale: config.locale,
    $uploadProgress: 0,
    $downloadProgress: 0,
    $offline: false,
    $settings: null,
    $breadcrumb: null,
    $loading: false
  },
  actions,
  mutations,
  strict: debug
  // plugins: debug ? [createLogger()] : []
  // plugins: debug ? [createLogger(), devtool] : []
})
