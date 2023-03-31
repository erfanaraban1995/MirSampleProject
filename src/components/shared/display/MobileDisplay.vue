<template>
  <span> {{ mobile }} </span>
</template>

<script>
import {mobileDenormalize} from '@/lib/util'

export default {
  name: 'MobileDisplay',
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    mobile() {
      return mobileDenormalize(this.value)
    }
  }
}
</script>
