<template>
  <span>
    <span v-if="value && relative" id="relative-time">
      <font-awesome-icon
        v-if="icon"
        icon="calendar-alt"
        :size="iconSize"
        :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
      />
      {{ relativeTime }}
    </span>

    <span v-else-if="value && humanize" id="humanized-time">
      <font-awesome-icon
        v-if="icon"
        icon="calendar-alt"
        :size="iconSize"
        :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
      />
      {{ humanizedTime }}
    </span>

    <span v-else-if="value" id="date">
      <template v-if="isFinity">
        <template v-if="date">
          <font-awesome-icon
            v-if="icon"
            icon="calendar-alt"
            :size="iconSize"
            :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
          />
          <span id="get-day" v-if="dayName" class="me-1"> {{ getDayName }} </span>
          {{ dateV }}
        </template>

        <span v-if="time">
          <font-awesome-icon
            v-if="icon"
            icon="clock"
            :size="iconSize"
            :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
          />
          <span v-else>-</span>
          <span v-if="seconds" id="time-vs"> {{ timeVS }} </span>
          <span v-else id="time-v"> {{ timeV }} </span>
        </span>
      </template>
      <font-awesome-icon v-else icon="infinity" id="icon-infinity" class="align-middle text-muted" />
    </span>

    <template v-if="startEnd">
      -
      <time-display :value="startEnd" />
    </template>
  </span>
</template>

<script>
import moment from 'moment-jalaali'
import 'moment-timezone'

export default {
  name: 'DateDisplay',
  props: {
    value: {type: String},
    startEnd: {type: Object, default: null},
    relative: {type: Boolean, default: false},
    humanize: {type: Boolean, default: false},
    dayName: {type: Boolean, default: false},
    seconds: {type: Boolean, default: false},
    date: {type: Boolean, default: true},
    time: {type: Boolean, default: false},
    // timeV: {type: Boolean, default: true },
    icon: {type: Boolean, default: false},
    dateFormat: {type: String, default: 'YYYY/M/D'},
    timeFormat: {type: String, default: 'HH:mm'},
    timeFormatsecond: {type: String, default: 'HH:mm:ss'},
    iconClass: {type: String, default: 'text-info'},
    iconSize: {type: String},
    mode: {type: String, default: 'date'} // accepted values : epoch | date
  },
  computed: {
    isFinity() {
      return this.value !== '2999-01-01T00:00:00'
    },
    dateFormatV() {
      if (this.$store.state.$locale === 'fa') {
        return this.dateFormat.replace(/Y+|M+|D+/g, (m) => `j${m}`)
      } else {
        return this.dateFormat
      }
    },
    getDayName() {
      if (this.value) {
        return this.moment.tz(this.$config.geolocations.timeZone.text).format('dddd')
      } else {
        return null
      }
    },
    moment() {
      if (!this.value) return null
      if (this.mode === 'epoch') return moment(Number(this.value))
      else return moment.utc(this.value, 'YYYY-MM-DDTHH:mm:ss.SSS')
    },
    dateV() {
      if (this.value) {
        return this.moment.tz(this.$config.geolocations.timeZone.text).format(this.dateFormatV)
      }
    },
    timeV() {
      if (this.value) {
        return this.moment.format(this.timeFormat)
      }
    },
    timeVS() {
      if (this.value) {
        return this.moment.format(this.timeFormatsecond)
      }
    },
    relativeTime() {
      return this.moment.fromNow()
    },
    humanizedTime() {
      if (this.time) {
        return this.moment.calendar()
      } else {
        return this.moment.calendar(null, {
          sameDay: `[${this.$t('forms.today')}]`,
          nextDay: `[${this.$t('forms.tomorrow')}]`,
          nextWeek: 'dddd',
          lastDay: `[${this.$t('forms.yesterday')}]`,
          lastWeek: this.$t('forms.lastWeekDay'),
          sameElse: this.dateFormatV
        })
      }
    }
  }
}
</script>
