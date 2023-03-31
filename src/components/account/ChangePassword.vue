<template>
  <b-row class="animated fadeIn justify-content-center">
    <b-col md="6" xl="5">
      <errors-display />

      <b-card :header="$t('account.changePassword')">
        <b-form-group v-if="havePassword">
          <b-input-group :prepend="$t('account.currentPassword')">
            <b-form-input dir="auto" v-model="model.currentPassword" :type="currentPassType ? 'password' : 'text'" />

            <b-input-group-append class="cursor-pointer" is-text @click="toggleCurrentPassType()">
              <font-awesome-icon icon="eye" />
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group :prepend="$t('account.newPassword')">
            <b-form-input
              dir="auto"
              v-model="model.newPassword"
              :type="passType ? 'password' : 'text'"
              ref="pwdcfrm"
              :name="$t('account.newPassword')"
              v-validate="'password'"
            />

            <b-input-group-append class="cursor-pointer" is-text @click="togglePassType()">
              <font-awesome-icon icon="eye" />
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group :prepend="$t('users.passwordConfirm')">
            <b-form-input
              dir="auto"
              v-model="model.newPasswordConfirm"
              :type="passConfirmType ? 'password' : 'text'"
              :name="$t('users.password')"
              v-validate="'confirmed:pwdcfrm'"
            />

            <b-input-group-append class="cursor-pointer" is-text @click="togglePassConfirmType()">
              <font-awesome-icon icon="eye" />
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-btn block class="ms-2" :disabled="progressing" @click.prevent="submit" variant="success">
          {{ $t('shared.save') }}
        </b-btn>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'change-password',
  data() {
    return {
      currentPassType: true,
      havePassword: null,
      passType: true,
      passConfirmType: true,
      progressing: false,
      model: {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
    }
  },
  created() {
    return this.$api.accountIdn
      .havePassword(true)
      .then((res) => {
        this.havePassword = res.havePassword
      })
      .catch((err) => {
        this.$fail(err)
      })
  },
  mounted() {
    this.setBreadcrumb()
  },
  methods: {
    togglePassType() {
      this.passType = !this.passType
    },
    toggleCurrentPassType() {
      this.currentPassType = !this.currentPassType
    },
    togglePassConfirmType() {
      this.passConfirmType = !this.passConfirmType
    },
    setBreadcrumb() {
      this.$setBreadcrumb([])
      const breadcrumb = [{name: 'home', path: this.$config.homeUrl}, {label: this.$t('nav.changePassword')}]
      this.$setBreadcrumb(breadcrumb)
    },
    submit() {
      this.$validateAll().then((isValid) => {
        if (isValid) {
          this.progressing = true
          return this.$api.accountIdn
            .changePassword(this.model, true)
            .then(() => {
              this.$success('account.yourPasswordHasChanged')
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
