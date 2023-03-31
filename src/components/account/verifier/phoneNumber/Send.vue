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
        {{ title }}
        <font-awesome-icon
          v-if="progressing"
          icon="cog"
          spin
          class="align-middle text-muted ms-auto"
        />
      </h1>
      <p class="text-muted">
        {{ subtitle }}
      </p>
      <b-form @submit.prevent="sendOtp">
        <b-input-group class="mb-3 required">
          <input
            ref="input"
            v-model.lazy="inputNumber"
            v-numeric.mobile
            v-validate="'required|mobile'"
            class="form-control"
            dir="ltr"
            :name="$t('account.phoneNumber')"
            placeholder="0912xxxxxxx"
          />
        </b-input-group>
        <b-button type="submit" :disabled="progressing" variant="primary" class="btn-block">
          {{ buttonTitle }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'LoginOtpSend',
  props: {
    title: {type: String},
    subtitle: {type: String},
    buttonTitle: {type: String},
    number: {type: String},
    prefix: {type: String},
    progressing: {type: Boolean}
  },
  data() {
    return {
      inputNumber: this.number
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    sendOtp() {
      this.$validateAll().then(isValid => {
        if (isValid) {
          this.$emit('sendOtp', this.inputNumber)
        }
      })
    }
  }
}
</script>
