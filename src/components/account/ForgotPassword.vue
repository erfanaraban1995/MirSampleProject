<template>
  <div v-if="resetpass">
    <div>
      <div class="app flex-row align-items-center animated fadeIn">
        <b-container>
          <b-row class="justify-content-center">
            <b-col xl="5" lg="7" md="9">
              <b-alert :show="errors.any()" id="errors" variant="danger" class="px-4">
                <ul class="m-0 px-1">
                  <li v-for="err in errors.all()" :key="err">{{ err }}</li>
                </ul>
              </b-alert>

              <b-card class="px-4 pt-4">
                <div>
                  <h1 class="h4">
                    {{ $t('account.forgotPassword') }}
                  </h1>

                  <p class="text-muted">{{ $t('account.enterCell') }}</p>
                  <b-form-group>
                    <b-input-group :class="requireMobile.required ? 'required' : ''">
                      <mobile-input
                        v-model="model.username"
                        @keyup.enter="submitMobile"
                        dir="ltr"
                        class="btn-block mb-3 mb-md-0"
                        :name="$t('shared.mobile')"
                        v-validate="requireMobile"
                      />
                    </b-input-group>
                  </b-form-group>

                  <b-btn
                    @click.prevent="submitMobile"
                    :disabled="progressing"
                    variant="primary"
                    class="btn-block mb-3 mb-md-2"
                  >
                    {{ $t('account.rememberPassword') }}
                  </b-btn>
                  <b-btn to="/login" size="sm" variant="link" class="btn-block">{{ $t('shared.return') }}</b-btn>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
  <reset-password
    v-else
    :settingEmail="setting.loginByEmail"
    @submitEmail="submitEmail"
    @submitMobile="submitMobile"
    :user="{username: model.username}"
    @return="reset"
  />
</template>

<script>
import ResetPassword from './ResetPassword'
import MobileInput from '@/components/shared/MobileInput'
import {mobileDenormalize} from '@/lib/util'

export default {
  name: 'ForgotPassword',
  components: {
    ResetPassword,
    MobileInput
  },
  data() {
    return {
      progressing: false,
      error: null,
      resetpass: true,
      model: {
        username: null,
      },
      setting: {
        loginByMobile: true,
        loginByEmail: false
      }
    }
  },
  computed: {
    requireEmail() {
      return {
        required: true,
        email: true
      }
    },
    requireMobile() {
      return {
        required: true,
        mobile: true
      }
    }
  },
  methods: {
    resetByEmail() {
      this.setting.loginByEmail = true
      this.setting.loginByMobile = false
    },
    resetByMobile() {
      this.setting.loginByEmail = false
      this.setting.loginByMobile = true
    },
    submitEmail() {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountPub
            .forgotPassword(this.model, true)
            .then(() => {
              this.progressing = false
              this.resetpass = false
            })
            .catch((err) => {
              this.$fail(err)
            })
        }
      })
    },
    submitMobile() {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          this.progressing = true
          this.$api.accountPub
            .forgotPassword(this.model, true)
            .then(() => {
              this.progressing = false
              this.resetpass = false
              this.model.mobile = mobileDenormalize(this.model.mobile)
            })
            .catch((err) => {
              this.$fail(err)
            })
        }
      })
    },
    reset() {
      this.resetpass = true
    }
  }
}
</script>
