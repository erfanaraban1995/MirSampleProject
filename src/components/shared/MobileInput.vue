<template>
  <b-form-input v-model="mobile" dir="ltr" v-numeric.mobile v-bind="$attrs" />
</template>

<script>
import {mobileNormalize, mobileDenormalize} from '@/lib/util'

export default {
  name: 'MobileInput',
  props: {
    value: {type: [String, Number], default: null},
    noNormalize: {type: Boolean, default: false}
  },
  inheritAttrs: false,
  computed: {
    mobile: {
      get() {
        let value = this.value
        if (!this.noNormalize) {
          value = mobileDenormalize(value)
        }
        return value
      },
      
      set(val) {
        if (!this.noNormalize) {
          val = mobileNormalize(val)
        }
        this.$emit('input', val)
      }
    }
  }
}
</script>
