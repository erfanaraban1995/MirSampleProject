<template>
  <div class="middle-input wide-xl">
    <b-input-group :size="size" :prepend="prepend" :append="getAppend" class="flex-nowrap">
      <b-input-group-append>
        <b-input-group-text class="bg-white" :class="{'border-left-0': $dir.rtl, 'border-right-0': $dir.ltr}">
          {{ getFirstLabel }}
        </b-input-group-text>
      </b-input-group-append>

      <data-picker
        v-if="date"
        v-model="model.min"
        :time="time"
        :disabled="disabledFirst"
        @input="setMaxDate"
        class="flex-grow-1 no-wide"
        wrapper-class="rounded-0"
        :size="size"
      />

      <b-form-select v-else-if="select" v-model="model.min" :options="selectOption" />

      <numeric-input
        v-else
        :no-separator="noSeperator"
        :negative="negative"
        v-model="model.min"
        :disabled="disabledFirst"
        class="rounded-0 flex-grow-1"
      />

      <b-input-group-append>
        <b-input-group-text class="bg-white" :class="{'border-left-0': $dir.rtl, 'border-right-0': $dir.ltr}">
          {{ getSecondLabel }}
        </b-input-group-text>
      </b-input-group-append>

      <data-picker
        v-if="date"
        end-of-day
        v-model="model.max"
        :time="time"
        class="flex-grow-1 no-wide"
        dialogStyle="left: 0"
        :wrapper-class="{'rounded-right-0': $dir.rtl, 'rounded-left-0': $dir.ltr}"
        :size="size"
        :disabled="disabledSecond"
      />

      <b-form-select v-else-if="select" v-model="model.max" :options="selectOption" />

      <numeric-input
        v-else
        :no-separator="noSeperator"
        :negative="negative"
        v-model="model.max"
        class="flex-grow-1"
        :disabled="disabledSecond"
      />
    </b-input-group>
  </div>
</template>

<script>
import DataPicker from '@/components/shared/DatePicker'
import {endOfDay} from '@/lib/util'

export default {
  components: {
    DataPicker
  },
  props: {
    date: {type: Boolean, default: false},
    select: {type: Boolean, default: false},
    numeric: {type: Boolean, default: false},
    currency: {type: Boolean, default: false},
    disabledSecond: {type: Boolean, default: false},
    disabledFirst: {type: Boolean, default: false},
    value: {type: Object},
    selectOption: {
      type: Array,
      default: function() {
        return []
      }
    },
    negative: {type: Boolean, default: false},
    prepend: String,
    append: {type: String},
    secondLabel: {type: String},
    firstLabel: {type: String},
    size: String,
    time: Boolean,
    percent: Boolean,
    defaultMax: {type: Boolean, default: false},
    noSeperator: Boolean
  },
  data() {
    return {
      model: this.value
    }
  },
  $_veeValidate: {
    // fetch the current value from the innerValue defined in the component data.
    rejectsFalse: true,
    name() {
      return this.prepend
    },
    value: function() {
      return this.value.min
    }
  },
  watch: {
    model: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  computed: {
    getFirstLabel() {
      return this.firstLabel || this.$t('shared.from')
    },
    getSecondLabel() {
      return this.secondLabel || this.$t('shared.to')
    },
    getAppend() {
      if (this.currency) {
        return this.currency && (this.append || this.$displayCurrency().name)
      }
      if (this.percent) {
        return this.percent && (this.append || this.$t('shared.percent'))
      } else return this.append
    }
  },
  methods: {
    setMaxDate(val) {
      if (val && this.defaultMax) this.model.max = endOfDay(val)
    }
  }
}
</script>
