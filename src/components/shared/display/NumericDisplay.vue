<template>
  <span v-if="number">
    <font-awesome-icon id="infinity-icon" v-if="isInfinity" icon="infinity" class="text-muted align-middle" />
    <span v-else>
      <span dir="ltr" :class="valueClass">{{ number }}</span>
      <span v-if="suffix" :class="suffixClass"> {{ suffix }}</span>
    </span>
    <span v-if="toLetter" class="text-muted"> ({{ numToLetter(number) }})</span>
  </span>
</template>

<script>
import {numToPersian} from '@/lib/util'

export default {
  name: 'NumericDisplay',
  props: {
    value: {type: [Number, String], default: null},
    valueClass: {type: [Object, String], default: null},
    suffix: {type: String, default: null},
    suffixClass: {type: [Object, String], default: null},
    separated: {type: Boolean, default: true},
    toLetter: {type: Boolean, default: false}
  },
  computed: {
    number() {
      const num = +this.value
      if (!this.separated) return num
      else if (!isNaN(num)) return num.toLocaleString()
      else return null
    },
    isInfinity() {
      return +this.value === 2147483647
    }
  },
  methods: {
    numToLetter(number) {
      return numToPersian(number)
    }
  }
}
</script>
