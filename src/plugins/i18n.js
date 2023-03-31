import config from 'SrcConfig'
import VueI18n from 'vue-i18n'
import Vue from 'vue'

Vue.use(VueI18n)

import i18nMessages from '../i18n'
export default new VueI18n({
  locale: config.locale,
  fallbackLocale: 'en',
  messages: i18nMessages
})
