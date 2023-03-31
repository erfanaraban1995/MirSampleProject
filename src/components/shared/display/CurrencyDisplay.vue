<template>
  <span>
    <span v-if="!$isEmpty(value)">
      <span dir="ltr" :class="amountClass" class="line-through"> {{ amount }} </span>
      <span testid="currencylabel" v-if="!hideCurrency" class="ms-1" :class="currencyClass"> {{ getCurrency }} </span>
      <span v-if="!$isEmpty(value) && numToPersianLetter">
        <span class="text-muted"> ({{ getPersianAmount(value, `${$displayCurrency().id}`) }} {{ getCurrency }}) </span>
      </span>
    </span>
  </span>
</template>

<script>
import {numToPersian} from '@/lib/util'

export default {
  name: 'CurrencyDisplay',
  props: {
    value: {type: [Number, String], default: null},
    hideCurrency: {type: Boolean, default: false},
    numToPersianLetter: {type: Boolean, default: false},
    currencyClass: {type: [Object, String], default: null},
    amountClass: {type: [Object, String], default: null},
    round: {type: Boolean, default: false}
    // currency: {
    //   type: String,
    //   default() {
    //     return this.$root.$displayCurrency().id
    //   }
    // }
  },
  computed: {
    amount() {
      return this.toDisplayCurrency(this.value)
    },
    getCurrency() {
      if (this.hideCurrency) return null
      return this.$displayCurrency().name
    }
  },
  methods: {
    toDisplayCurrency(value) {
      if (this.$isEmpty(value)) return null

      const valueAsBaseCurrency = value * this.$baseCurrency().rate
      const rate = this.$displayCurrency().rate
      let targetValue = valueAsBaseCurrency / rate

      if (this.round) {
        targetValue = Math.round(targetValue)
      }
      return targetValue.toLocaleString()
    },
    getPersianAmount(amount, currencyId) {
      return numToPersian(amount, currencyId)
    }
  }
}
</script>
