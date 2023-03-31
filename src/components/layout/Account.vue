<template>
  <font-awesome-icon icon="cog" spin v-if="!$store.state.$account" />
  <AppHeaderDropdown v-else :right="$dir.ltr">
    <template slot="header">
      <!-- <font-awesome-icon icon="user-circle" size="lg" class="mx-1" /> -->
      <span class="small text-dark">
        {{ $store.state.$account.fullName }}
      </span>
    </template>
    <template slot="dropdown">
      <!-- <b-dropdown-header tag="div" class="text-center bg-primary"
        ><strong>{{ $t('account.account') }}</strong></b-dropdown-header
      > -->
      <!-- <b-dropdown-item to="/account/profile">
        <i><font-awesome-icon icon="user"/></i>
        {{ $t('account.profile') }}
      </b-dropdown-item>
      <b-dropdown-item to="/account/password">
        <i><font-awesome-icon icon="key"/></i>
        {{ $t('account.changePassword') }}
      </b-dropdown-item> -->
      <b-dropdown-item @click="logout">
        <i><font-awesome-icon icon="power-off" class="text-danger align-middle"/></i>
        {{ $t('account.logout') }}
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import * as types from '@/store/types'
import {HeaderDropdown as AppHeaderDropdown} from './core'

export default {
  name: 'account',
  components: {
    AppHeaderDropdown
  },
  methods: {
    logout() {
      if (!this.progressing) {
        return this.$api.accountIdn
          .logout()
          .then(() => {
            this.$router.push('/login')
            this.$store.commit(types.LOGOUT)
          })
          .catch((err) => this.$faild(err))
      }
    }
  }
}
</script>
