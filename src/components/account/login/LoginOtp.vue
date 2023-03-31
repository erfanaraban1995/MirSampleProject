<template>
  <b-row class="justify-content-center">
    <b-col sm="8" md="7" lg="6" xl="5">
      <phone-number-verifier
      changable
      :title="title"
      :subtitle="$t('account.enterCell')"
      :buttonTitle="title"
      @verifiedOtp="emitLoggedIn" />
    </b-col>
  </b-row>
</template>

<script>
import PhoneNumberVerifier from '@/components/account/verifier/phoneNumber'
  
export default {
  name: 'LoginOtp',
  components: {
    PhoneNumberVerifier
  },
  computed: {
    title () {
      let value = ''
      if (this.$store.state.$settings.identitySettings.signIn.loginByOtp) 
        value += this.$t('account.login')
      if (this.$store.state.$settings.identitySettings.signIn.loginByOtp && this.$store.state.$settings.identitySettings.registration.registerByOtp)
        value += ' / '
      if (this.$store.state.$settings.identitySettings.registration.registerByOtp) 
        value += this.$t('account.register')

      return value
    }
  },
  methods: {
    emitLoggedIn (user) {
      if (user.permissions.length) {
        this.$emit('loggedIn', user)
      } else {
        this.$showError(this.$t('account.userIsNotAdmin'))
      }
    }
  }
}
</script>
