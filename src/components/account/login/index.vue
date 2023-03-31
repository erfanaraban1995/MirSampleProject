<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <b-container>
      <b-alert :show="errors.any()" id="errors" variant="danger" class="px-4">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">{{ err }}</li>
        </ul>
      </b-alert>

      <div>
        <login-form @loggedIn="setAccount" @showLoginOtp="showLoginOtp" />
        <!-- <login-otp v-if="showOtp && setting.loginByOtp" @loggedIn="setAccount" /> -->
      </div>
      <!-- <div v-if="showOtp && setting.loginByOtp" class="text-center">
        <b-btn size="sm" variant="link" class="btn text-decoration-none" @click="showLoginForm">{{
          $t('shared.return')
        }}</b-btn>
      </div> -->
    </b-container>
  </div>
</template>

<script>
import * as types from '@/store/types'
import LoginOtp from './LoginOtp.vue'
import LoginForm from './LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginOtp,
    LoginForm
  },
  data() {
    return {
      otherService: false,
      showLogin: true,
      showOtp: false
      // setting: {
      //   loginByMobile: this.$store.state.$settings.identitySettings.signIn.loginByMobile,
      //   loginByEmail: this.$store.state.$settings.identitySettings.signIn.loginByEmail,
      //   loginByOtp: this.$store.state.$settings.identitySettings.signIn.loginByOtp
      // }
    }
  },
  methods: {
    setAccount(user) {
      this.$store.commit(types.SET_ACCOUNT, user)
      let returnUrl = this.$route.query.returnUrl || this.$config.homeUrl
      this.$router.replace(returnUrl)
    },
    showLoginOtp() {
      this.showOtp = true
      this.showLogin = false
    },
    showLoginForm() {
      this.showOtp = false
      this.showLogin = true
    }
  }
}
</script>
