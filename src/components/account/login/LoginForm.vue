<template>
  <b-row class="justify-content-center">
    <b-col
      v-if="!otpLogin"
      :sm="$config.auth.registerIsEnabled ? '12' : '8'"
      :md="$config.auth.registerIsEnabled ? '11' : '7'"
      :lg="$config.auth.registerIsEnabled ? '10' : '6'"
      :xl="$config.auth.registerIsEnabled ? '9' : '5'"
    >
      <b-alert :show="errors.any()" id="errors" variant="danger" class="px-4 my-2">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">
            {{ err }}
          </li>
        </ul>
      </b-alert>

      <div class="mb-0" :class="{'card-group': $config.auth.registerIsEnabled}">
        <div class="card p-4">
          <div class="card-body">
            <b-form @submit.prevent="submit">
              <h1 class="mb-3">
                {{ $t('account.login') }}
              </h1>

              <b-input-group class="mb-3 required">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="mobile" />
                </b-input-group-prepend>
                <mobile-input
                  v-model="model.username"
                  v-validate="'required|mobile'"
                  :class="{'right-place': $dir.rtl}"
                  :name="$t('account.mobile')"
                  autocomplete="mobile"
                  :placeholder="$t('account.mobile')"
                />
              </b-input-group>

              <b-input-group class="mb-3 required">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="key" fixed-width />
                </b-input-group-prepend>
                <b-form-input
                  v-model="model.password"
                  dir="auto"
                  :type="passType ? 'password' : 'text'"
                  v-validate="'required'"
                  :class="{'right-place': $dir.rtl}"
                  :name="$t('account.password')"
                  autocomplete="current-password"
                  :placeholder="$t('account.password')"
                />

                <b-input-group-append class="cursor-pointer" is-text @click="togglePassType()">
                  <font-awesome-icon icon="eye" fixed-width />
                </b-input-group-append>
              </b-input-group>

              <button type="submit" :disabled="progressing" class="btn btn-primary btn-block px-4">
                {{ $t('account.login') }}
              </button>


              <b-btn to="/forgot-password" size="sm" variant="link" block class="mt-2">
                {{ $t('account.haveYouForgotPassword') }}
              </b-btn>
            </b-form>
          </div>
        </div>

      </div>
    </b-col>
  </b-row>
</template>

<script>
import phoneNumberVerifier from '@/components/account/verifier/phoneNumber/Verify'
import MobileInput from '@/components/shared/MobileInput.vue'

export default {
  name: 'LoginFormEmail',
  components: {
    phoneNumberVerifier,
    MobileInput
  },
  data() {
    return {
      passType: true,
      otpLogin: false,
      progressing: false,
      model: {
        username: null,
        password: null
      }
      // setting: {
      //   loginByMobile: this.$store.state.$settings.identitySettings.signIn.loginByMobile,
      //   loginByEmail: this.$store.state.$settings.identitySettings.signIn.loginByEmail,
      //   loginByOtp: this.$store.state.$settings.identitySettings.signIn.loginByOtp
      // }
    }
  },
  methods: {
    togglePassType() {
      this.passType = !this.passType
    },
    submit() {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountPub
            .login(this.model, true)
            .then((user) => {
              if (user.accessToken) {
                if (user.roles.length) {
                  this.$emit('loggedIn', user)
                } else {
                  this.$showError(this.$t('account.userIsNotAdmin'))
                }
                this.progressing = false
              } else {
                this.otpLogin = true
              }
            })
            .catch((err) => {
              this.$fail(err)
            })
        }
      })
    },

    showLoginOtp() {
      this.$emit('showLoginOtp', this.setting.loginByOtp)
    }
  }
}
</script>

<style scoped>
.right-place::placeholder {
  text-align: right;
}
</style>
