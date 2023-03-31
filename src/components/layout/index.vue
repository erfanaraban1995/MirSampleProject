<template>
  <page-500 v-if="$offline" :back="backFromOffline" :message="$t('shared.youAreOffline')"/>
  <div v-else>
    <progress-bar></progress-bar>
    <notifications></notifications>

    <pub v-if="isPublic"></pub>
    <cp v-else></cp>
  </div>
</template>

<script>
import * as types from '@/store/types'

import cp from './CP'
import pub from './Public'

import favicon from '@/../public/favicon'
import { ProgressBar, Notifications } from './core'
import Page500 from '@/components/shared/Page500'

import {mapState} from 'vuex'

export default {
  name: 'root',
  components: {
    cp,
    pub,
    ProgressBar,
    Notifications,
    Page500
  },
  metaInfo () {
    favicon.metas.forEach(m => {
      if (m.content === 'APP_TITLE')
        m.content = this.$t('branding.appName')
    })

    const path = this.$route.path 
    let title

    if (path.startsWith('/orders/info/') || path.startsWith('/parcels/info/')) {
      title = `${this.$t(this.$route.meta.title)}  ${this.$route.params.id}`
    } 
    else {
      title = this.$t(this.$route.meta.title)
    }
    return {
      title,
      titleTemplate: `%s | ${this.$t('branding.appName')}`,
      htmlAttrs: {
        dir: this.direction
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { hid: 'description', name: 'description', content: this.$t('branding.appTagline') },
        ...favicon.metas
      ],
      link: [
        ...favicon.links
      ]
    }
  },
  computed: {
    ...mapState(['$offline', '$account']),
    direction () {
      return this.$t('direction')
    },
    isPublic () {
      return this.$route.meta && this.$route.meta.public
    }
  },
  watch: {
    $account (val) {
      if (!val) {
        let path = '/login'
        if (this.$route.path !== this.$config.homeUrl && this.$route.path !== "/login") {
          path = `/login?returnUrl=${this.$route.path}`
        }
        this.$router.replace(path)
        .catch(() => {})
      }
    }
  },
  methods: {
    backFromOffline () {
      this.$store.commit(types.SET_OFFLINE, false)
    }
  }
}
</script>
