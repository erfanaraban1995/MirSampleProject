<template>
  <send
    v-if="sending || changingEmail"
    :title="title"
    :subtitle="subtitle"
    :buttonTitle="buttonTitle"
    :email="email"
    :progressing="progressing"
    @sendOtp="sendOtp"
  />
  <verify
    v-else
    :changable="changable"
    :email="email"
    :progressing="progressing"
    @resendOtp="sendOtp"
    @changeEmail="changeEmail"
    @verifyOtp="verifyOtp"
  />
</template>

<script>
import Verify from './Verify'
import Send from './Send'

export default {
  name: 'LoginOtpEmail',
  components: {
    Send,
    Verify
  },
  props: {
    title: {type: String},
    subtitle: {type: String},
    buttonTitle: {type: String},
    inputEmail: {type: String},
    changable: {type: Boolean}
  },
  data() {
    return {
      progressing: false,
      changingEmail: false,
      sending: true,
      email: null
    }
  },
  mounted() {
    if (this.inputEmail) {
      this.sending = false
      this.sendOtp(this.inputEmail)
    }
  },
  methods: {
    sendOtp(email) {
      this.progressing = true
      this.email = email
      return this.$api.accountPub
        .sendOtp(
          {
            email: email,
            sendViaSms: false,
            sendViaEmail: true
          },
          true
        )
        .then(() => {
          this.$success('account.otpSentEmail', {email})
          this.changingEmail = false
          this.sending = false
        })
        .catch((err) => {
          this.$fail(err)
        })
    },
    changeEmail() {
      this.changingEmail = true
    },
    verifyOtp(email, verifyCode) {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountPub
            .verifyOtp(
              {
                code: verifyCode,
                key: email
              },
              true
            )
            .then((user) => {
              this.progressing = false
              this.$emit('verifiedOtp', user)
            })
            .catch((err) => {
              this.progressing = false
              if (err.data.code === 'loginFailed') {
                this.$showError(this.$t('account.invalidOtp'))
              }
            })
        }
      })
    }
  }
}
</script>
