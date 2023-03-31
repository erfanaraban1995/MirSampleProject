<template>
  <div>
    <b-form-select
      size="sm"
      v-model="locale"
      :select-size="1"
      :options="locales" />
  </div>
</template>

<script>
import * as types from '@/store/types'

const labels = {
  en: 'En',
  fa: 'فا'
}

export default {
  name: 'change-locale',
  data () {
    return {
      locales: Object.keys(this.$i18n.messages).map(l => {
        return {
          value: l,
          text: labels[l]
        }
      })
    }
  },
  computed: {
    locale: {
      get () {
        return this.$store.state.$locale
      },
      set (value) {
        this.$store.commit(types.SET_LOCALE, {
          value,
          validator: this.$validator,
          i18n: this.$i18n
        })
      }
    }
  }
}
</script>
