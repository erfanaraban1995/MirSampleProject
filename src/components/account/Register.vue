<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <errors-display />

          <b-card class="p-3">
            <b-form-group v-if="setting.showMobile">
              <b-input-group :class="requireMobile.required ? 'required' : ''">
                <b-input-group-prepend is-text>
                  {{ $t('shared.mobile') }}
                </b-input-group-prepend>
                <mobile-input
                  v-model="model.user.mobile"
                  :name="$t('shared.mobile')"
                  placeholder="0912xxxxxxx"
                  v-validate="requireMobile"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :prepend="$t('users.password')">
                <b-form-input
                  v-model="model.password"
                  :type="passType ? 'password' : 'text'"
                  dir="ltr"
                  :name="$t('account.password')"
                  ref="pwdcfrm"
                  v-validate.continues="'password'"
                />

                <b-input-group-append class="cursor-pointer" is-text @click="togglePassType()">
                  <font-awesome-icon icon="eye" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :prepend="$t('users.passwordConfirm')">
                <b-form-input
                  v-model="model.passwordConfirm"
                  :type="passConfirmType ? 'password' : 'text'"
                  dir="ltr"
                  :name="$t('users.password')"
                  v-validate="'confirmed:pwdcfrm'"
                />

                <b-input-group-append class="cursor-pointer" is-text @click="togglePassConfirmType()">
                  <font-awesome-icon icon="eye" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showFirstName">
              <b-input-group :prepend="$t('users.firstName')" :class="requireFirstName.required ? 'required' : ''">
                <b-form-input
                  v-model="model.user.firstName"
                  dir="auto"
                  :name="$t('users.firstName')"
                  v-validate="requireFirstName"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showLastName" :class="requireLastName.required ? 'required' : ''">
              <b-input-group :prepend="$t('users.lastName')">
                <b-form-input
                  v-model="model.user.lastName"
                  dir="auto"
                  :name="$t('users.lastName')"
                  v-validate="requireLastName"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showEmail" :class="requireEmail.required ? 'required' : ''">
              <b-input-group :prepend="$t('account.email')">
                <b-form-input v-model="model.user.email" dir="ltr" :name="$t('account.email')" v-validate="requireEmail">
                </b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :prepend="$t('users.person')">
                <b-form-select :value="false" v-model="model.user.legal" :options="legalOptions" />
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="model.user.legal" :class="model.user.legal ? 'required' : ''">
              <b-input-group :prepend="$t('users.companyName')">
                <b-form-input
                  v-model="model.user.legalName"
                  :name="$t('users.companyName')"
                  v-validate="model.user.legal ? 'required' : null"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showGender">
              <b-input-group :prepend="$t('users.gender')" :class="requireGender.required ? 'required' : ''">
                <b-form-select
                  v-model="model.profile.gender"
                  :options="$enums.genderOptions"
                  :name="$t('users.gender')"
                  v-validate="requireGender"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showNationalId" :class="requireNationalId.required ? 'required' : ''">
              <b-input-group :prepend="$t('users.nationalId')">
                <b-form-input
                  v-model="model.user.nationalId"
                  dir="auto"
                  :name="$t('users.nationalId')"
                  v-validate="requireNationalId"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group v-if="setting.showBirthDate">
              <p class="mb-2 text-muted">{{ $t('users.birthdate') }} :</p>
              <b-row>
                <b-col md="4" class="mb-3 mb-md-0">
                  <b-input-group :prepend="$t('users.day')" :class="requireDay.required ? 'required' : ''">
                    <b-form-input
                      class="text-center"
                      type="number"
                      v-model="model.profile.birthDay"
                      placeholder="1"
                      :name="$t('users.day')"
                      :min="1"
                      :max="day"
                      v-validate="requireDay"
                    />
                  </b-input-group>
                </b-col>

                <b-col md="4" class="mb-3 mb-md-0">
                  <b-input-group :prepend="$t('users.month')" :class="requireMonth.required ? 'required' : ''">
                    <b-form-input
                      class="text-center"
                      type="number"
                      v-model="model.profile.birthMonth"
                      placeholder="1"
                      :name="$t('users.month')"
                      min="1"
                      max="12"
                      v-validate="requireMonth"
                    />
                  </b-input-group>
                </b-col>

                <b-col md="4" class="mb-3 mb-md-0">
                  <b-input-group :prepend="$t('users.years')" :class="requireYear.required ? 'required' : ''">
                    <b-form-input
                      class="text-center"
                      type="number"
                      v-model="model.profile.birthYear"
                      :placeholder="getYear"
                      :name="$t('users.years')"
                      min="1300"
                      :max="year"
                      v-validate="requireYear"
                    />
                  </b-input-group>
                </b-col>
              </b-row>
            </b-form-group>
            <b-btn variant="primary" block :disabled="progressing" @click="submit()">{{
              $t('account.register')
            }}</b-btn>
          </b-card>
          <b-button to="/login" size="sm" variant="link" class="btn-block mb-4">{{ $t('shared.return') }}</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import MobileInput from '@/components/shared/MobileInput'

export default {
  name: 'Register',
  components: {
    MobileInput
  },
  data() {
    return {
      passType: true,
      passConfirmType: true,
      progressing: false,
      model: {
        user: {
          firstName: null,
          lastName: null,
          email: null,
          mobile: null,
          legal: false,
          legalName: null,
          nationalId: null
        },
        profile: {
          gender: null,
          image: null,
          birthDay: null,
          birthMonth: null,
          birthYear: null
        },
        password: '',
        passwordConfirm: null
      },
      setting: {
        showFirstName: this.$store.state.$settings.identitySettings.registration.showFirstName,
        showLastName: this.$store.state.$settings.identitySettings.registration.showLastName,
        showEmail: this.$store.state.$settings.identitySettings.registration.showEmail,
        showMobile: this.$store.state.$settings.identitySettings.registration.showMobile,
        showNationalId: this.$store.state.$settings.identitySettings.registration.showNationalId,
        showEconomicCode: this.$store.state.$settings.identitySettings.registration.showEconomicCode,
        showBirthDate: this.$store.state.$settings.identitySettings.registration.showBirthDate,
        showGender: this.$store.state.$settings.identitySettings.registration.showGender,
        showReferrerMobile: this.$store.state.$settings.identitySettings.registration.showReferrerMobile
      }
    }
  },
  computed: {
    requireFirstName() {
      return {required: this.$store.state.$settings.identitySettings.registration.requireFirstName}
    },
    requireLastName() {
      return {required: this.$store.state.$settings.identitySettings.registration.requireLastName}
    },
    requireEmail() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireEmail,
        email: true
      }
    },
    requireDay() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireBirthDate,
        min_value: '1',
        max_value: this.day
      }
    },
    requireMonth() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireBirthDate,
        min_value: '1',
        max_value: '12'
      }
    },
    requireYear() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireBirthDate,
        min_value: '1300',
        max_value: this.year
      }
    },
    requireEconomicCode() {
      return {required: this.$store.state.$settings.identitySettings.registration.requireEconomicCode}
    },
    requireGender() {
      return {required: this.$store.state.$settings.identitySettings.registration.requireGender}
    },
    requireMobile() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireMobile,
        mobile: true
      }
    },
    requireNationalId() {
      return {
        required: this.$store.state.$settings.identitySettings.registration.requireNationalId,
        national_id: this.model.user.nationalId
      }
    },
    requireReferrerMobile() {
      return {required: this.$store.state.$settings.identitySettings.registration.requireReferrerMobile}
    },
    year() {
      const now = new Date()
      return String(now.getFullYear() - 621)
    },
    day() {
      return this.model.profile.birthMonth > 6 ? '30' : '31'
    },
    legalOptions() {
      return this.$enums.legalOptions.filter((item) => item.value !== null)
    }
  },
  watch: {
    'model.user.legal'() {
      this.model.user.legalName = null
    }
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
          this.progressing = true
          return this.$api.accountPub
            .register(this.model, true)
            .then(() => {
              this.$success('account.registerSuccessful', '/')
            })
            .catch((err) => {
              this.$fail(err)
            })
        }
      })
    }
  }
}
</script>
