<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <!-- <b-link class="navbar-brand" :href="$config.websiteUrl" target="_blank">
        <img class="navbar-brand-full" src="/img/logo.svg" width="100" :alt="$t('branding.appName')" />
      </b-link> -->
      <SidebarToggler class="d-md-down-none" display="lg" />

      <!-- <h4 class="mb-0 align-self-center flex-grow-1 mx-3 text-center">
        {{ $t('branding.appTitle') }}
        <span v-if="$config.environment !== 'release'" class="text-muted font-weight-normal">
          (
          {{ $t(`config.${$config.environment}`) }}
          )
        </span>
      </h4> -->

      <b-navbar-nav class="me-4 ms-auto">
        <span class="small mx-1">
          <!-- <digital-clock blink /> -->
        </span>

        <!-- <span class="small">
          {{ time }}
        </span> -->
        <Account />
      </b-navbar-nav>
    </AppHeader>

    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main v-if="!initializing" class="main">
        <Breadcrumb :list="breadcrumbItems" />
        <div class="container-fluid px-3">
          <loading v-if="$store.state.$loading" />

          <router-view :key="localKey"></router-view>
        </div>
      </main>
    </div>
    <TheFooter class="d-flex justify-content-center">
      <div>
        <a href="https://regymi.com/" target="_blank">{{ $t('branding.appName') }}</a>
        <!-- <span class="mx-1">&copy; {{ new Date().getYear() + 1900 }}</span> -->
      </div>
      <change-locale class="ms-auto" />
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import Account from './Account'
import moment from 'moment-jalaali'
import DigitalClock from 'vue-digital-clock'
import Loading from './Loading'

import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  // Aside as AppAside,
  // AsideToggler,
  Footer as TheFooter,
  Breadcrumb,
  ChangeLocale
} from './core'

// import DefaultAside from './DefaultAside'
// import * as types from '@/store/types'

export default {
  name: 'full',
  components: {
    DigitalClock,
    Account,
    // AsideToggler,
    AppHeader,
    AppSidebar,
    // AppAside,
    TheFooter,
    Breadcrumb,
    ChangeLocale,
    // DefaultAside,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    Loading
  },
  data() {
    return {
      nav: nav.items,
      time: null,
      initializing: false,
      localKey: ''
    }
  },
  created() {
    this.setTime()
    // return this.$api.currencies
    //   .getAllInfo()
    //   .then((res) => {
    //     this.$config.currency.all = res.filter((i) => i.id === 'IRR' || i.id === 'IRT')
    //     this.initializing = false
    //   })
    //   .catch((err) => {
    //     this.initializing = false
    //     this.$fail(err)
    //   })
  },
  methods: {
    setTime() {
      if (this.$dir.rtl) {
        this.time = moment().format('dddd jDD jMMMM jYYYY')
      } else {
        this.time = moment().format('dddd DD MMMM YYYY')
      }
    }
  },
  watch: {
    '$store.state.$locale'(val) {
      this.localKey = val
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    breadcrumbItems() {
      return this.$route.matched
    }
  }
}
</script>
<style>
@media (max-width: 991.98px) {
  .app-header .navbar-brand {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -77.5px;
    display: none;
  }
}
</style>
