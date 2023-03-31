<template>
  <b-form-input
    dir="ltr"
    class="text-center"
    v-model="model"
    v-mask="pattern"
    :placeholder="placeholder"
    @focus="onFocus"
    @blur="formatOnBlur()"
    @keydown="formatter($event)"
    :state="inputState"
  />
</template>

<script>
export default {
  name: 'TimeEditor',
  props: {
    value: {type: [String], default: ''},
    placeholder: {type: [String], default: '12:45'},
    pattern: {type: [String], default: '##:##'},
    state: {type: Function, default: null},
    limit24: {type: Boolean, default: false}
  },
  data() {
    return {
      model: this.getDisplayModel(this.value)
    }
  },
  computed: {
    inputState() {
      return this.state && this.state(this.model)
    },
    patternInfo() {
      const info = {pattern: this.pattern}
      let [hours, minutes] = this.destructureTime(this.pattern)
      info.hoursLength = hours.length
      info.minutesLength = minutes.length
      return info
    }
  },
  watch: {
    value(val) {
      if (this.model !== this.getDisplayModel(val)) this.setModel(val)
    },
    model(val) {
      this.$nextTick(() => {
        this.model = this.getDisplayModel(val)
        this.$emit('input', this.model)
      })
    }
  },
  methods: {
    setModel(val) {
      this.model = this.getDisplayModel(val)
    },
    getDisplayModel(value) {
      if (!value) return ''
      let [hours, minutes] = this.destructureTime(value)

      if (this.limit24 && hours > 23) {
        hours = '23'
      }

      if (minutes) {
        const invalidMinutes = ['6', '7', '8', '9']
        const isMinuteInvalid = invalidMinutes.includes(minutes[0])
        if (isMinuteInvalid) {
          minutes = ''
        }
        return `${hours}:${minutes}`
      }

      const hasColon = value.includes(':')
      return hasColon ? `${hours}:` : String(hours)
    },
    destructureTime(model) {
      let [hours, minute] = model.split(':')
      hours = hours || ''
      minute = minute || ''
      return [hours, minute]
    },
    onFocus(event) {
      event.target.select()
    },
    getHoursFormmated(hours) {
      return ('000000' + hours).slice(-this.patternInfo.hoursLength)
    },
    getMinutesFormmated(minutes) {
      return ('000000' + minutes).slice(-this.patternInfo.minutesLength)
    },
    formatter(e) {
      if (e.key === ':' || e.key === '.') {
        let [hours, minutes] = this.destructureTime(this.model)
        if (!minutes) {
          hours = this.getHoursFormmated(hours)
          this.model = `${hours}:`
        }
      }
    },
    formatOnBlur() {
      if (!this.model) return
      let [hours, minutes] = this.destructureTime(this.model)
      hours = this.getHoursFormmated(hours)
      minutes = this.getMinutesFormmated(minutes)
      this.model = `${hours}:${minutes}`
    }
  }
}
</script>
