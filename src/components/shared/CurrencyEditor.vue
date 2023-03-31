<template>
  <b-input-group
    id="edit-currency-input-group"
    v-b-popover.hover.top="popoverConfig"
    :append="append"
    :prepend="prepend"
    :size="size"
  >
    <numeric-input
      testid='numeric-input'
      v-model="amount"
      :decimal="percent"
      :decimalPlaces="decimalPlaces"
      :class="inputClass"
      v-bind="$attrs"
    />
  </b-input-group>
</template>

<script>
import {numToPersian} from '@/lib/util'

export default {
  name: 'CurrencyEditor',
  inheritAttrs: false,
  props: {
    value: {type: Number, default: null},
    hideCurrency: {type: Boolean, default: false},
    numeric: {type: Boolean, default: false},
    toLetter: {type: Boolean, default: false},
    percent: {type: Boolean, default: false},
    inputClass: {type: [String, Object, Array]},
    prepend: String,
    size: String,
    currency: {
      type: String,
      default() {
        return this.$root.$displayCurrency().id
      }
    },
    append: {
      type: String,
      default: function() {
        if (this.hideCurrency) return null
        return this.$root.$displayCurrency().name
      }
    }
  },
  computed: {
    amount: {
      get() {
        return this.toTargetCurrency(this.value)
      },
      set(val) {
        val = this.toBaseCurrency(val)
        this.$emit('input', val)
      }
    },
    decimalPlaces() {
      const currency = this.$currencies().find((item) => item.id === this.currency)
      if (!currency) return 7
      return currency.decimalPlaces
    },
    popoverConfig() {
      if (!this.toLetter || !this.amount) return ''
      else {
        const toLetterAmount = this.persianAmount(this.amount, this.currency)
        const currencyText = this.$t(`currencies.${this.currency}`)
        return toLetterAmount + ' ' + currencyText
      }
    }
  },
  methods: {
    toTargetCurrency(value) {
      if (this.numeric || this.percent) return value
      if (this.$isEmpty(value)) return null
      const rate = this.$currencies().find((currency) => currency.id === this.currency).rate
      return value / rate
    },
    toBaseCurrency(value) {
      if (this.numeric || this.percent) return value
      if (this.$isEmpty(value)) return null
      const rate = this.$currencies().find((currency) => currency.id === this.currency).rate
      return value * rate
    },
    persianAmount(amount, currencyId) {
      return numToPersian(amount, currencyId)
    }
  }
}
</script>
