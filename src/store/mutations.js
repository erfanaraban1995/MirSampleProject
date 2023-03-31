import * as types from './types'
import VeeValidateFa from 'vee-validate/dist/locale/fa'
import moment from 'moment-jalaali'

import { set as setData, remove as removeData } from '@/lib/local-storage'


export default {
  [types.SET_LOCALE]: (state, {value, validator, i18n}) => {
    state.$locale = value
    if (value == 'fa') {
      moment.loadPersian({dialect: 'persian-modern'})
      if (validator) validator.localize('fa', VeeValidateFa)
    } else {
      if (validator) validator.localize(value)
    }
    i18n.locale = value
    moment.locale(value)
    setData(types.LOCALE_COOKIE, value)
  },

  [types.SET_ACCOUNT]: (state, value) => {
    state.$account = value
    setData(types.ACCOUNT_COOKIE, value)
  },

  [types.SET_REFRESHED_TOKEN]: (state, value) => {
    state.$account.accessToken = value.accessToken
    state.$account.ttl = value.ttl
    setData(types.ACCOUNT_COOKIE, state.$account)
  },

  [types.SET_UPDATE_PROFILE]: (state, value) => {
    state.$account.account = value
    setData(types.ACCOUNT_COOKIE, state.$account)
  },

  [types.LOGOUT]: state => {
    state.$account = null
    removeData(types.ACCOUNT_COOKIE)
  },

  [types.SET_UPLOAD_PROGRESS]: (state, value) => {
    state.$uploadProgress = value
  },

  [types.SET_DOWNLOAD_PROGRESS]: (state, value) => {
    state.$downloadProgress = value
  },

  [types.SET_OFFLINE]: (state, value) => {
    state.$offline = value
  },

  [types.SET_SETTINGS]: (state, value) => {
    state.$settings = value
  },
  [types.SET_LOADING]: (state, value) => {
    state.$loading = value
  },
  [types.SET_BREADCRUMB]: (state, value) => {
    state.$breadcrumb = value
  }
}
