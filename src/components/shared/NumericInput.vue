<template>
  <b-input
    v-model="model"
    v-bind="$attrs"
    v-on="$listeners"
    :dir="dir"
    :autocomplete="autocomplete"
    v-b-popover.hover.top="popoverConfig"
  />
</template>

<script>
import {convertNumbers2English, numToPersian} from '@/lib/util'

export default {
  name: 'NumericInput',
  inheritAttrs: false,
  props: {
    value: {type: [Number, String]},
    toLetter: {type: Boolean, default: false},
    decimal: {type: Boolean, default: true},
    decimalPlaces: {type: Number, default: 7},
    restricted: {type: Boolean, default: false},
    noSeparator: {type: Boolean, default: false},
    negative: Boolean,
    dir: {type: String, default: 'ltr'},
    autocomplete: {type: String, default: 'off'}
  },
  data() {
    return {
      model: this.getDisplayNumber(this.value)
    }
  },
  watch: {
    model(val, oldVal) {
      if (this.symbolEntered(val, oldVal)) return
      let number = this.getDisplayNumber(val)

      if (val !== number) {
        this.$nextTick(() => {
          this.model = this.getDisplayNumber(val)
        })
      }

      if (number) {
        number = +number.replace(/,/g, '')
      }
      this.$emit('input', number)
    },
    value(val) {
      if (this.model !== this.getDisplayNumber(val)) this.setModel(val)
    },
    decimalPlaces() {
      this.model = this.getDisplayNumber(this.model)
    }
  },
  computed: {
    popoverConfig() {
      if (!this.toLetter) return ''
      else return this.persianAmount(this.model)
    }
  },
  methods: {
    regex() {
      const digits = 17
      const full = new RegExp(`[-]?([0-9]{0,${digits})}([.][0-9]{0,${this.decimalPlaces}})?`)
      const negativeable = /[-]?[0-9]+/
      const floatable = new RegExp(`([0-9]{0,${digits}})([.][0-9]{0,${this.decimalPlaces}})?`)
      const simple = new RegExp(`([0-9]{0,${digits}})`)

      const decimal = this.decimal && this.decimalPlaces > 0
      if (this.negative && decimal) {
        return full
      }
      if (this.negative) {
        return negativeable
      }
      if (decimal) {
        return floatable
      }
      return simple
    },
    symbolEntered(val, oldVal) {
      val = val && val.replace(/,/g, '')
      oldVal = oldVal && oldVal.replace(/,/g, '')
      const decimal = this.decimal && this.decimalPlaces > 0
      const firstStateRegex = /^\-?\d+$/ // check current model has point or not
      const secondStateRegex = /^\-?\d+\.$/ // check the next input is point or not
      const decimalEntered = decimal && firstStateRegex.test(oldVal) && secondStateRegex.test(val)

      const negativeRegex = /^\-$/
      const negativeEntered = this.negative && negativeRegex.test(val)

      return decimalEntered || negativeEntered
    },
    getDisplayNumber(number) {
      if (number === null) {
        return null
      }
      number = String(number)
      number = number && number.replace(/,/g, '')
      if (!number) return null

      number = convertNumbers2English(number)
      const matched = number.match(this.regex())

      if (!matched) return null
      number = matched[0]

      number = this.convertLocalString(number)
      return number
    },
    convertLocalString(val) {
      if (!val || val === null) return null
      val = +val
      if (this.restricted) {
        val = this.restrictValue(val)
      }
      if (this.noSeparator) {
        return val.toString()
      }
      return val.toLocaleString('en-GB', {maximumFractionDigits: this.decimalPlaces})
    },
    restrictValue(val) {
      const value = val.toString().split('.')
      let int = value[0]
      let dec = value[1]
      if (int && int.length >= 9) int = int.slice(0, 9)
      if (dec) return +int.concat('.', dec)
      else return +int
    },
    setModel(num) {
      this.model = this.getDisplayNumber(num)
    },
    persianAmount(amount, currencyId) {
      return numToPersian(amount, currencyId)
    }
  }
}
</script>
