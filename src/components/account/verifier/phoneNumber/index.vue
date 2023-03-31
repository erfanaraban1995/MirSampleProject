<template>
  <send
  v-if="sending || changingNumber"
  :title="title"
  :subtitle="subtitle"
  :buttonTitle="buttonTitle"
  :prefix="prefix"
  :number="number"
  :progressing="progressing"
  @sendOtp="sendOtp" />
  <verify
  v-else
  :changable="changable"
  :prefix="prefix"
  :number="number"
  :progressing="progressing"
  @resendOtp="sendOtp"
  @changeNumber="changeNumber"
  @verifyOtp="verifyOtp" />
</template>

<script>
import Verify from './Verify'
import Send from './Send'

export default {
  name: 'LoginOtp',
  components: {
    Send,
    Verify
  },
  props: {
    title: { type: String },
    subtitle: { type: String },
    buttonTitle: { type: String },
    mobile: { type: String },
    changable: { type: Boolean }
  },
  data() {
    return {
      progressing: false,
      changingNumber: false,
      sending: true,
      prefix: '98',
      number: null
    }
  },
  mounted () {
    if (this.mobile) {
      this.sending = false
      this.sendOtp(this.mobile)
    }
  },
  methods: {
    sendOtp (number) {
      this.progressing = true
      this.number = number
      return this.$api.accountPub.sendOtp({
        mobile: number,
        sendViaSms: true,
        sendViaEmail: false
      }, true)
      .then(() => {
        this.$success('account.otpSent', { number })
        this.changingNumber = false
        this.sending = false
      })
      .catch(err => {
        this.$fail(err)
      })
    },
    changeNumber() {
      this.changingNumber = true
    },
    verifyOtp (number, verifyCode) {
      this.$validateAll().then(isValid => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountPub.verifyOtp({
            code: verifyCode,
            key: number
          }, true)
          .then(user => {
            this.progressing = false
            this.$emit('verifiedOtp', user)
          })
          .catch(err => {
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
