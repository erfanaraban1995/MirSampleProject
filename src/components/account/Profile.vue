<template>
  <div class="animated fadeIn">
    <b-alert :show="errors.any()" id="errors" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{ err }}</li>
      </ul>
    </b-alert>
    <div v-if="confirmingMobile">
      <b-row class="justify-content-center">
        <b-col sm="8" md="7" lg="6" xl="5">
          <phone-number-verifier
            :mobile="model.user.mobile"
            :title="$t('account.enterCell')"
            :subtitle="$t('account.enterCell')"
            :buttonTitle="$t('account.enterCell')"
            @verifiedOtp="verifiedOtpMobile"
          />
        </b-col>
      </b-row>
    </div>

    <div v-else-if="confirmingEmail">
      <b-row class="justify-content-center">
        <b-col sm="8" md="7" lg="6" xl="5">
          <email-verifier
            :inputEmail="model.user.email"
            :title="$t('account.enterEmail')"
            :subtitle="$t('account.enterEmail')"
            :buttonTitle="$t('account.enterEmail')"
            @verifiedOtp="verifiedOtpEmail"
          />
        </b-col>
      </b-row>
    </div>

    <div v-else>
      <div v-if="initializing" class="text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2" />
      </div>
      <b-card v-else>
        <b-row>
          <b-col md="6">
            <b-form-group>
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

            <b-form-group>
              <b-input-group :prepend="$t('users.lastName')" class="required">
                <b-form-input
                  v-model="model.user.lastName"
                  dir="auto"
                  :name="$t('users.lastName')"
                  v-validate="'required'"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :class="requireMobile.required ? 'required' : ''" :prepend="$t('shared.mobile')">
                <b-form-input
                  ref="inputMobile"
                  :readonly="!editingMobile"
                  v-model="model.user.mobile"
                  dir="ltr"
                  v-numeric.mobile
                  :name="$t('shared.mobile')"
                  placeholder="912xxxxxxx"
                  v-validate="requireMobile"
                />
                <b-input-group-append>
                  <b-btn v-if="!editingMobile" variant="primary" @click="editMobile">
                    <font-awesome-icon icon="pen" fixed-width class="align-middle" />
                  </b-btn>
                  <b-btn @click="submitMobile" v-else :disabled="mobileChange" variant="success">
                    <font-awesome-icon icon="check" fixed-width class="align-middle" />
                  </b-btn>
                </b-input-group-append>

                <b-input-group-append>
                  <b-btn @click="goToconfirmPhone" v-if="!confirmMobile" variant="danger">
                    {{ $t('account.confirmMobile') }}
                  </b-btn>
                  <b-btn v-else disabled variant="success">
                    {{ $t('shared.confirmed') }}
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :prepend="$t('account.email')" :class="requireEmail.required ? 'required' : ''">
                <b-form-input
                  ref="inputEmail"
                  :readonly="!editingEmail"
                  v-model="model.user.email"
                  dir="ltr"
                  :name="$t('account.email')"
                  v-validate="requireEmail"
                />
                <b-input-group-append>
                  <b-btn v-if="!editingEmail" variant="primary" @click="editEmail">
                    <font-awesome-icon icon="pen" fixed-width class="align-middle" />
                  </b-btn>
                  <b-btn v-else :disabled="emailChange" variant="success" @click="submitEmail">
                    <font-awesome-icon icon="check" fixed-width class="align-middle" />
                  </b-btn>
                </b-input-group-append>

                <b-input-group-append>
                  <b-btn v-if="!confirmEmail" variant="danger" @click="goToconfirmEmail">
                    {{ $t('account.confirmEmail') }}
                  </b-btn>
                  <b-btn v-else disabled variant="success">
                    {{ $t('shared.confirmed') }}
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group class="mb-md-0">
              <c-switch
                v-model="model.user.twoFactorEnabled"
                variant="3d"
                color="primary"
                :text="$t('users.twoFactorEnabled')"
              />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group>
              <b-input-group class="required" :prepend="$t('users.gender')">
                <b-form-select
                  :name="$t('users.gender')"
                  v-model="model.profile.gender"
                  :options="$enums.genderOptions"
                  v-validate="'required'"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group :class="requireNationalId.required ? 'required' : ''">
              <b-input-group :prepend="$t('users.nationalId')">
                <b-form-input
                  v-model="model.user.nationalId"
                  dir="auto"
                  :name="$t('users.nationalId')"
                  v-validate="requireNationalId"
                />
              </b-input-group>
            </b-form-group>

            <p class="mb-2">{{ $t('users.birthdate') }} :</p>
            <b-row>
              <b-col md="4" class="mb-3">
                <b-input-group :prepend="$t('users.day')">
                  <b-form-input
                    class="text-center"
                    type="number"
                    v-model="model.profile.birthDay"
                    placeholder="1"
                    :name="$t('users.day')"
                    min="1"
                    :max="day"
                    v-validate="`min_value:1|max_value:${day}`"
                  />
                </b-input-group>
              </b-col>
              <b-col md="4" class="mb-3 mb-md-0">
                <b-input-group :prepend="$t('users.month')">
                  <b-form-input
                    class="text-center"
                    type="number"
                    v-model="model.profile.birthMonth"
                    placeholder="1"
                    :name="$t('users.month')"
                    min="1"
                    max="12"
                    v-validate="'min_value:1|max_value:${permantIds}'"
                  />
                </b-input-group>
              </b-col>
              <b-col md="4" class="mb-3 mb-md-0">
                <b-input-group :prepend="$t('users.years')">
                  <b-form-input
                    class="text-center"
                    type="number"
                    v-model="model.profile.birthYear"
                    :placeholder="year"
                    :name="$t('users.years')"
                    min="1300"
                    :max="year"
                    v-validate="`min_value:1300|max_value:${year}`"
                  />
                </b-input-group>
              </b-col>
            </b-row>
            <uploader
              class="mt-2"
              galleryId="image"
              :label="$t('shared.image')"
              v-model="model.profile.image"
              :name="$t('shared.image')"
            />
          </b-col>
        </b-row>
      </b-card>

      <b-card no-body footer-class="border-top-0 rounded" class="mb-3">
        <div slot="footer">
          <b-btn :disabled="progressing" @click.prevent="submit" variant="success">
            <font-awesome-icon icon="check" size="sm" class="me-1 align-middle" />
            {{ $t('shared.save') }}
          </b-btn>

          <back-btn />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import * as types from '@/store/types'
import EditForm from './EditForm'
import PhoneNumberVerifier from '@/components/account/verifier/phoneNumber'
import EmailVerifier from '@/components/account/verifier/email'
import {mobileNormalize} from '@/lib/util'
import {mobileDenormalize} from '@/lib/util'

export default {
  name: 'Profile',
  mixins: [EditForm],
  components: {
    PhoneNumberVerifier,
    EmailVerifier
  },
  data() {
    return {
      mobile: null,
      email: null,
      editingEmail: false,
      confirmingEmail: false,
      editingMobile: false,
      confirmingMobile: false,
      mobileChange: true,
      emailChange: true,
      confirmMobile: false,
      confirmEmail: false
    }
  },
  watch: {
    'model.user.mobile'(val) {
      if (val != this.mobile) {
        this.mobileChange = false
      } else {
        this.mobileChange = true
      }
    },
    'model.user.email'(val) {
      if (val != this.email) {
        this.emailChange = false
      } else {
        this.emailChange = true
      }
    }
  },
  mounted() {
    this.setBreadcrumb()
    this.getModel()
      .then(() => {
        this.initializing = false
      })
      .catch(() => {
        this.$goto(`/dashboard`)
      })
  },
  computed: {
    requireFirstName() {
      return {required: this.$store.state.$settings.identitySettings.profile.requireFirstName}
    },
    requireNationalId() {
      return {
        required: this.$store.state.$settings.identitySettings.profile.requireNationalId,
        national_id: this.model.user.nationalId
      }
    },
    requireEmail() {
      return {
        required: this.$store.state.$settings.identitySettings.profile.requireEmail,
        email: true
      }
    },
    requireMobile() {
      return {
        required: this.$store.state.$settings.identitySettings.profile.requireMobile,
        mobile: true
      }
    }
  },
  methods: {
    setBreadcrumb() {
      this.$setBreadcrumb([])
      const breadcrumb = [{name: 'home', path: this.$config.homeUrl}, {label: this.$t('nav.profile')}]
      this.$setBreadcrumb(breadcrumb)
    },
    getModel() {
      return this.$api.accountIdn.getProfile().then((res) => {
        this.model = res
        this.email = this.model.user.email
        this.confirmMobile = this.model.user.mobileConfirmed
        this.confirmEmail = this.model.user.emailConfirmed
        this.model.user.mobile = mobileDenormalize(this.model.user.mobile)
        this.mobile = this.model.user.mobile
        this.email = this.model.user.email
        delete this.model.user.id
      })
    },
    submit() {
      this.$preSubmit().then((proceed) => {
        if (proceed) {
          this.model.user.mobile = mobileDenormalize(this.model.user.mobile)
          return this.$api.accountIdn
            .setProfile(this.model, true)
            .then((res) => {
              this.$store.commit(types.SET_UPDATE_PROFILE, res.user)
              return this.$success('users.userUpdated')
            })
            .catch((err) => this.$fail(err))
        }
      })
    },
    editEmail() {
      this.editingEmail = true
      this.$refs.inputEmail.focus()
    },
    editMobile() {
      this.$refs.inputMobile.focus()
      this.editingMobile = true
    },
    submitEmail() {
      this.$validator.validate(this.$t('account.email')).then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountIdn
            .changeEmail({input: this.model.user.email}, true)
            .then(() => {
              this.editingEmail = false
              this.confirmEmail = false
              this.$success('account.yourEmailHasChanged')
            })
            .catch((err) => {
              this.$fail(err)
              this.editingEmail = false
              this.model.user.email = this.email
            })
        }
      })
    },
    submitMobile() {
      this.$validator.validate(this.$t('shared.mobile')).then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountIdn
            .changeMobile({input: mobileNormalize(this.model.user.mobile)}, true)
            .then(() => {
              
              this.editingMobile = false
              this.confirmMobile = false
              this.$success('account.yourPhoneNumberHasConfirmed')
            })
            .catch((err) => {
              this.$fail(err)
              this.editingMobile = false
              this.model.user.mobile = this.mobile
            })
        }
      })
    },
    verifiedOtpMobile(user) {
      if (this.model.user.mobile && this.model.user.mobile.startsWith('+')) {
        this.model.user.mobile = user.account.mobile.slice(3)
      }
      this.mobile = this.model.user.mobile
      this.confirmingMobile = false
      this.mobileChange = true
      this.confirmMobile = true
      this.$success('account.yourPhoneNumberHasConfirmed')
    },
    verifiedOtpEmail(user) {
      this.model.user.email = user.account.email
      this.email = user.account.email
      this.confirmingEmail = false
      this.emailChange = true
      this.confirmEmail = true
      this.$success('account.yourEmailHasConfirmed')
    },
    goToconfirmPhone() {
      this.confirmingMobile = true
    },
    goToconfirmEmail() {
      this.confirmingEmail = true
    }
  }
}
</script>
