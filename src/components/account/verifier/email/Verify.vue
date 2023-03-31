<template>
  <div>
    <b-alert :show="errors.any()" id="errors" variant="danger" class="px-4 my-2">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>
    
    <b-card class="p-4">
      <h1 class="d-flex h4">
        {{ $t('account.verifyEmail') }}
        <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="align-middle text-muted ms-auto" />
      </h1>
      <p class="text-muted">
        {{ $t('account.enterVerificationCodeEmail', {email}) }}
      </p>
      <b-form @submit.prevent="emitVerifyOtp">
        <b-input-group class="mb-3 required">
          <input
            ref="input"
            v-model="verifyCode"
            v-validate="'required|digits:6'"
            class="form-control text-center"
            :class="{ 'is-invalid': errors.has($t('account.verifyCode')) }"
            size="lg"
            dir="ltr"
            :name="$t('account.verifyCode')"
            placeholder="- - - - - -"
          >
        </b-input-group>
        <b-button
        :disabled="progressing"
        variant="primary"
        class="btn-block mb-3"
        @click="emitVerifyOtp()">
          {{ $t('account.verifyEmail') }}
        </b-button>
      </b-form>

      <b-row class="text-center">
        <b-col md="6" class="mb-2 mb-md-0">
          <span v-if="countdown > 0" class="text-primary">
            <span class="text-muted">{{ $t('account.resendOTP') }}</span>
            ({{ countdown }})
          </span>
          <b-link v-else @click="emitResendOtp()">
            {{ $t('account.resendOTP') }}
          </b-link>
        </b-col>
        <b-col md="6">
          <b-link v-if="changable" @click="emitChangeEmail()">
            {{ $t('account.editEmail') }}
          </b-link>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'LoginOtpVerify',
  props: {
    email: { type: String },
    progressing: { type: Boolean },
    changable: { type: Boolean, default: false }
  },
  data() {
    return {
      verifyCode: null,
      countdown: 60
    }
  },
  mounted() {
    this.$refs.input.focus()
    this.interval()
  },
  methods: {
    interval() {
      const intv = setInterval(() => {
        this.countdown--
        if (this.countdown === 0) {
          clearInterval(intv)
        }
      }, 1000)
    },
    emitResendOtp() {
      this.$emit('resendOtp', this.email)
      this.countdown = 60
      this.interval()
    },
    emitChangeEmail() {
      this.$emit('changeEmail')
    },
    emitVerifyOtp() {
      this.$validateAll().then(isValid => {
        if (isValid) {
          this.$emit('verifyOtp', this.email, this.verifyCode)
        }
      })
    }
  }
}
</script>
