<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <b-container>
      <b-row class="justify-content-center">
        <b-col xl="5" lg="7" md="9">
          <div v-if="user.email">
            <b-alert show variant="success" class="my-4">
              {{ $t('account.resetPasswordEmailSentTo', {email: user.email}) }}
            </b-alert>

            <div class="d-flex">
              <font-awesome-icon icon="thumbs-up" class="display-4 mx-2 text-moremuted" />
              <h5 class="p-3">
                <div class="mb-1">{{ $t('account.pleaseCheckYourInbox') }}</div>
                <small class="text-muted">{{ $t('account.andMaybeYourSpamFolder') }}</small>
              </h5>
            </div>
          </div>

          <div v-if="user.mobile">
            <b-alert show variant="success" class="my-4">
              {{ $t('account.otpSent', {number: this.user.mobile}) }}
            </b-alert>
          </div>

          <errors-display />

          <b-card class="mb-3 p-2">
            <h1 class="h4">
              {{ $t('account.resetPassword') }}
            </h1>

            <p class="text-muted">{{ $t('account.enterNewPassword') }}</p>

            <b-form-group>
              <b-input-group :prepend="$t('account.sentCode')" class="required">
                <input
                  ref="input"
                  v-model="model.code"
                  v-validate="'required|digits:6'"
                  class="form-control text-center"
                  size="lg"
                  dir="ltr"
                  :name="$t('account.sentCode')"
                  placeholder="- - - - - -"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group class="required">
              <b-input-group :prepend="$t('account.newPassword')">
                <b-form-input
                  v-model="model.newPassword"
                  :type="passType ? 'password' : 'text'"
                  dir="ltr"
                  :name="$t('account.newPassword')"
                  ref="pwdcfrm"
                  v-validate="'required'"
                />

                <b-input-group-append class="cursor-pointer" is-text @click="togglePassType()">
                  <font-awesome-icon icon="eye" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group class="required">
              <b-input-group :prepend="$t('account.reNewPassword')">
                <b-form-input
                  v-model="model.newPasswordConfirm"
                  :type="passConfirmType ? 'password' : 'text'"
                  dir="ltr"
                  :name="$t('account.reNewPassword')"
                  v-validate="'required|confirmed:pwdcfrm'"
                />

                <b-input-group-append class="cursor-pointer" is-text @click="togglePassConfirmType()">
                  <font-awesome-icon icon="eye" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-btn :disabled="progressing" @click="submit" variant="primary" class="btn-block mb-3">
              {{ $t('account.changePassword') }}
            </b-btn>
            <b-btn @click="emitReturn" size="sm" variant="link" class="btn-block">{{ $t('shared.return') }}</b-btn>


            <!-- <b-row class="text-center">
              <b-col class="">
                <span v-if="minutes >= 0" class="text-primary">
                  <span class="text-muted">{{ $t('account.resendOTP') }}</span>
                  <span>({{ minutes }}:{{ second }})</span>
                </span>
                <b-link v-else @click="emitResendOtp()">
                  {{ $t('account.resendOTP') }}
                </b-link>
              </b-col>
            </b-row> -->
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  props: {
    user: {type: Object},
    settingEmail: {type: Boolean}
  },
  data() {
    return {
      passType: true,
      passConfirmType: true,
      minutes: 4,
      second: 59,
      progressing: false,
      dis: true,
      model: {
        code: null,
        newPassword: '',
        newPasswordConfirm: null,
        username: this.user.username
      }
    }
  },
  mounted() {
    this.interval()
  },
  methods: {
    togglePassType() {
      this.passType = !this.passType
    },
    togglePassConfirmType() {
      this.passConfirmType = !this.passConfirmType
    },
    submit() {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          return this.$api.accountPub
            .resetPassword(this.model, true)
            .then(() => {
              this.$success('account.yourPasswordHasChanged', '/login')
            })
            .catch((err) => {
              this.$fail(err)
            })
        }
      })
    },
    emitReturn() {
      this.$emit('return')
    },
    interval() {
      const intv = setInterval(() => {
        this.second--
        if (this.second === -1 && this.minutes >= 0) {
          this.minutes--
          this.second = 59
        }
        if (this.minutes === -1) clearInterval(intv)
      }, 1000)
    },
    emitResendOtp() {
      if (this.user.email) {
        this.$emit('submitEmail')
        this.$success('account.resetPasswordEmailSentTo', {email: this.user.email})
      }
      if (this.user.mobile) {
        this.$emit('submitMobile')
        this.$success('account.otpSent', {number: this.user.mobile})
      }
      this.minutes = 4
      this.second = 59
      this.interval()
    }
  }
}
</script>
