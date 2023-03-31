<template>
  <div class="pdatepicker d-flex const-width wide-lg" :class="{inline: inlineMode}" v-out-side-click="hideAndSubmit">
    <input :value="fullDateTime" type="hidden" />
    <b-input-group :prepend="label" :append="append" class="flex-grow-1 flex-nowrap" :size="size">
      <div
        class="d-flex align-items-center flex-nowrap px-2 form-control h-auto py-0"
        :class="[wrapperClass, disabled ? 'bg-light' : '']"
        @click="focus()"
      >
        <a
          v-if="!disabled && !noEmpty && formatedChosenDate"
          href="#"
          @click.prevent="empty"
          :class="{empty: true, small: size === 'sm'}"
        >
          <font-awesome-icon class="text-muted" icon="times-circle" />
        </a>
        <span v-if="showWeekDay && day" class="px-2 text-nowrap" :class="day.class">{{ day.name }}</span>

        <b-form-input
          filter="off"
          autocomplete="off"
          :id="uniqeId"
          @keyup.enter="setDate()"
          @focus="onFocus($event)"
          @input="emitChanging()"
          v-model="formatedChosenDate"
          :class="[inputClass, warnClass, day && day.class, {'text-info': changing}, disabled ? 'bg-light' : '']"
          :name="name"
          :size="size"
          class="border-0 "
          :placeholder="placeholder"
          :disabled="disabled"
        />

        <span v-if="showFromNow && fromNow" class="ml-4 pl-1 text-nowrap text-truncate" :class="day && day.class">
          {{ getText(fromNow) }}
          <template v-if="fromNow.isFuture">
            {{ $t('shared.future') }}
          </template>
        </span>
      </div>

      <b-input-group-append>
        <b-form-timepicker
          v-if="time"
          v-model="clock"
          locale="fa"
          :label-close-button="$t('shared.close')"
          :label-no-time-selected="$t('forms.noTimeSelected')"
          close-button-variant="danger"
          :hour12="false"
          :size="size"
          show-seconds
          :placeholder="this.$t('shared.clock')"
          style="flex-basis:150px"
        />
      </b-input-group-append>
    </b-input-group>

    <transition :name="openTransitionAnimation">
      <div
        v-if="isDialogOpen"
        @click.stop
        class="dialog"
        :style="top ? `bottom:100%;${dialogStyle}` : `top:100%;${dialogStyle}`"
        :class="{dropup: dialogDropup, reverse: dialogReverse}"
      >
        <transition name="fade">
          <b-card
            v-if="isDayView"
            body-class="p-0"
            class="day-view m-0 border-0 shadow"
            header-class="p-0 border-0"
            :header-bg-variant="variant"
            footer-class="p-0"
          >
            <div class="dialog-month" slot="header">
              <div class="cal-toggle d-flex p-1" v-if="toggleEnabled">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{'text-right': $dir.rtl, 'text-left': $dir.ltr}">
                  <small>{{ $t(`forms.${cal}Cal`) }}</small>
                </div>
                <b-btn size="sm" variant="outline-secondary" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark" />
                </b-btn>
              </div>

              <div class="preMonth" @click="preMonthClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-left' : 'chevron-right'" />
              </div>
              <div class="monthName" @click="goToMonthSelect">{{ displayingMonth }} {{ numToStr(displayingYear) }}</div>
              <div class="nextMonth" @click="nextMonthClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-right' : 'chevron-left'" />
              </div>
            </div>

            <div class="dialog-days d-flex flex-wrap w-100 mb-2">
              <div :class="`day-box day-name mb-2 bg-${variant}`" v-for="dayName in dayNames" :key="dayName">
                {{ dayName }}
              </div>

              <div class="day-box empty-box" v-for="n in firstDayOfMonth" :key="'f' + n"></div>

              <div
                v-for="n in daysInMonth"
                :key="n"
                class="day-box"
                :class="{'disabled-day': !isDateInRange(n), 'chosen-day': ifDayBoxIsChosenDay(n)}"
                @click="dayClicked(n)"
              >
                <span
                  class="hover-effect"
                  :class="[
                    ifDayIsFriday(n) && ifDayBoxIsChosenDay(n)
                      ? 'bg-danger'
                      : ifDayBoxIsChosenDay(n)
                      ? `bg-${variant}`
                      : 'bg-light'
                  ]"
                ></span>
                <span
                  class="num"
                  :class="[ifDayBoxIsChosenDay(n) ? 'text-white' : ifDayIsFriday(n) ? 'text-danger' : null]"
                >
                  {{ numToStr(n) }}
                </span>
              </div>
            </div>

            <b-card-footer class="d-flex bg-white">
              <b-btn size="sm" variant="success" @click="emitToday">
                {{ $t('shared.today') }}
              </b-btn>

              <div class="flex-grow-1"></div>

              <b-btn size="sm" variant="secondary" @click="isDialogOpen = false">
                {{ $t('shared.close') }}
              </b-btn>
            </b-card-footer>
          </b-card>
        </transition>

        <transition name="fade">
          <b-card
            v-if="isMonthView"
            body-class="p-0"
            class="month-view m-0 border-0 shadow"
            header-class="p-0 border-0"
            :header-bg-variant="variant"
            footer-class="p-0"
          >
            <div class="dialog-year" slot="header">
              <div class="cal-toggle d-flex p-1" v-if="toggleEnabled">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{'text-right': $dir.rtl, 'text-left': $dir.ltr}">
                  <small>{{ $t(`forms.${cal}Cal`) }}</small>
                </div>
                <b-btn size="sm" variant="outline-secondary" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark" />
                </b-btn>
              </div>
              <div class="preYear" @click="preYearClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-left' : 'chevron-right'" />
              </div>
              <div class="cyear" @click="goToYearSelect">{{ numToStr(displayingYear) }}</div>
              <div class="nextYear" @click="nextYearClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-right' : 'chevron-left'" />
              </div>
            </div>

            <div class="dialog-months">
              <div
                v-for="(n, i) in monthNames"
                :key="i"
                class="month-box"
                :class="{'chosen-month': ifMonthBoxChosenMonth(i)}"
                @click="monthClicked(i)"
              >
                <span class="hover-effect" :class="ifMonthBoxChosenMonth(i) ? `bg-${variant}` : 'bg-light'"></span>
                <span class="num" :class="{'text-white': ifMonthBoxChosenMonth(i)}">
                  {{ n }}
                </span>
              </div>
            </div>
          </b-card>
        </transition>

        <transition name="fade">
          <b-card
            v-if="isYearView"
            body-class="p-0"
            class="year-view m-0 border-0 shadow"
            header-class="p-0 border-0"
            :header-bg-variant="variant"
            footer-class="p-0"
          >
            <div class="dialog-year" slot="header">
              <div class="cal-toggle d-flex p-1" v-if="toggleEnabled">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{'text-right': $dir.rtl, 'text-left': $dir.ltr}">
                  <small>{{ $t(`forms.${cal}Cal`) }}</small>
                </div>
                <b-btn size="sm" variant="outline-secondary" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark" />
                </b-btn>
              </div>
            </div>
            <div
              class="year-box"
              v-for="n in cMaximumYear - cMinimumYear + 1"
              :key="n"
              :id="'year-' + (n + cMinimumYear - 1)"
              :class="{'chosen-year': ifYearBoxChosenYear(n + cMinimumYear - 1)}"
              @click="yearClicked(n + cMinimumYear - 1)"
            >
              <span
                class="hover-effect"
                :class="ifYearBoxChosenYear(n + cMinimumYear - 1) ? `bg-${variant}` : 'bg-light'"
              >
              </span>
              <span class="num" :class="{'text-white': ifYearBoxChosenYear(n + cMinimumYear - 1)}">
                {{ numToStr(n + cMinimumYear - 1) }}
              </span>
            </div>
          </b-card>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment-jalaali'
import 'moment-timezone'

export default {
  name: 'DatePicker',
  props: {
    endOfDay: {type: Boolean, default: false}, // time mode : start Or locale ; defualt => utc
    top: {type: Boolean, default: false}, // position Of dialog: top of input , under of input
    mode: {type: String, default: 'date'}, // accepted values : epoch | date
    dialogStyle: String,
    noEmpty: {type: Boolean, default: false},
    humanize: {type: Boolean, default: false},
    warn: {type: Boolean, default: false},
    dialogDropup: {default: false, type: Boolean},
    dialogReverse: {default: false, type: Boolean},
    time: {default: false, type: Boolean},
    inputClass: {default: null},
    variant: {type: String, default: 'primary'},
    wrapperClass: {default: null},
    label: {type: String},
    append: {type: String},
    size: {type: String},
    placeholder: {type: String},
    minimumYear: {default: 1922, type: Number},
    maximumYear: {default: 3500, type: Number},
    disableDatesBeforeToday: {default: false, type: Boolean},
    disableDatesAfterToday: {default: false, type: Boolean},
    availableDateStart: {type: String},
    availableDateEnd: {type: String},
    setTimeToday: {type: Boolean, default: false},
    value: {default: ''},
    name: {default: '', type: String},
    showFromNow: {type: Boolean, default: true},
    showWeekDay: {type: Boolean, default: true},
    fridayVariant: {type: String, default: 'danger'},
    initialView: {
      default: 'day',
      type: String,
      validator(value) {
        return value === 'day' || value === 'month'
      }
    },
    inlineMode: {default: false, type: Boolean},
    disabled: {type: Boolean, default: false},
    formatDate: {
      default: 'YYYY/MM/DD',
      type: String,
      validator(value) {
        const elements = value.split('/')
        if (elements.length !== 3) return false
        if (elements[0] !== 'YYYY' && elements[0] !== 'YY') return false
        if (elements[1] !== 'M' && elements[1] !== 'MM' && elements[1] !== 'MMM') return false
        if (elements[2] !== 'D' && elements[2] !== 'DD') return false
        return true
      }
    },
    openTransitionAnimation: {default: 'slide-fade', type: String}
  },
  data() {
    return {
      changing: false,
      cal: null,
      availableDates: false,
      isDialogOpen: false,
      isDayView: true,
      isMonthView: false,
      isYearView: false,
      dayNames: [],
      monthNames: [],
      dayInThisMonth: 1,
      firstDayOfMonth: 0,
      daysInMonth: 30,
      displayingMonthNum: 1,
      displayingMonth: '',
      displayingYear: 2018,
      dayOfWeek: 0,
      formatedChosenDate: '',
      chosenSecond: this.endOfDay ? 59 : null,
      chosenMinute: this.endOfDay ? 59 : null,
      chosenHour: this.endOfDay ? 23 : null,
      chosenDay: 1,
      chosenMonth: 0,
      chosenYear: 2018,
      startAvailableDateV: moment([1922]),
      endAvailableDateV: moment([3500]).endOf('year'),
      hours: [],
      minutes: []
    }
  },
  computed: {
    fullDateTime() {
      if (!this.value) return null
      const format = this.isJ ? 'jYYYY/jM/jD HH:mm:ss' : 'YYYY/M/D HH:mm:ss'
      return moment
        .utc(this.value)
        .tz(this.$config.geolocations.timeZone.text)
        .format(format)
    },
    uniqeId() {
      return `date-picker-${Math.random() * 9999 + 1}`
    },
    fromNow() {
      if (!this.value) return null
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)
      const now = moment().startOf('day')
      return {
        isFuture: m.diff(now, 'days') > 0,
        text: m.from(now)
      }
    },
    day() {
      if (!this.value) return null
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)
      return {
        class: +m.format('d') === 5 ? `text-${this.fridayVariant}` : '',
        name: m.format('dddd')
      }
    },
    clock: {
      get() {
        if (this.value) {
          return `${this.chosenHour}:${this.chosenMinute}:${this.chosenSecond}`
        }
        return null
      },
      set(val) {
        let time = val.split(':')
        this.chosenHour = +time[0]
        this.chosenMinute = +time[1]
        this.chosenSecond = +time[2]
      }
    },
    warnClass() {
      let value = null
      const m = this.value ? moment.utc(this.value, 'YYYY-MM-DDTHH:mm:ss.SSS') : null

      if (m && this.warn) {
        const today = moment().startOf('day')

        if (m.isBefore(today.subtract(1, 'days'))) value = 'dp-danger blink'
        else if (m.isSameOrBefore(today)) value = 'dp-danger'
        else if (m.isSameOrBefore(today.add(1, 'day'))) value = 'dp-warning'
      }
      return value
    },
    toggleEnabled() {
      return this.$config.calendars.length > 1
    },
    chosenDayDynamicStyle() {
      return {
        background: this.chosenDayColor
      }
    },
    isJ() {
      return this.cal === 'jalali'
    },
    cMinimumYear() {
      const m = moment([this.minimumYear])
      const y = this.isJ ? m.jYear() : m.year()
      const a = this.isJ ? this.startAvailableDateV.jYear() : this.startAvailableDateV.year()
      return a > y ? a : y
    },
    cMaximumYear() {
      const m = moment([this.maximumYear])
      const y = this.isJ ? m.jYear() : m.year()
      const a = this.isJ ? this.endAvailableDateV.jYear() : this.endAvailableDateV.year()
      return a < y ? a : y
    }
  },
  watch: {
    formatedChosenDate(val) {
      if (!val) this.$emit('input', null)
    },
    value: function(value, oldValue) {
      if (value !== oldValue) {
        this.inputChanged(value, true)
      }
    },
    availableDateStart() {
      this.availableDate()
    },
    availableDateEnd() {
      this.availableDate()
    },
    chosenHour: function() {
      if (this.inputCheck(this.value)) {
        this.dayClicked(this.chosenDay)
      }
    },
    chosenMinute: function() {
      if (this.inputCheck(this.value)) {
        this.dayClicked(this.chosenDay)
      }
    },
    chosenSecond: function() {
      if (this.inputCheck(this.value)) {
        this.dayClicked(this.chosenDay)
      }
    }
  },
  mounted() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(i)
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push(i)
    }

    this.availableDate()
    const today = moment()
      .tz(this.$config.geolocations.timeZone.text)
      .startOf('day')
      .utc()

    if (this.disableDatesBeforeToday) {
      this.availableDates = true

      if (this.startAvailableDateV.isBefore(today)) {
        this.startAvailableDateV = today
      }
    }

    if (this.disableDatesAfterToday) {
      this.availableDates = true

      if (this.endAvailableDateV.isSameOrAfter(today)) {
        this.endAvailableDateV = today
      }
    }

    this.cal = this.$config.defaultCalendar
    this.init()

    if (this.inlineMode) {
      this.openDialog()
    }

    if (!this.inlineMode) {
      document.documentElement.addEventListener('click', this.onExit, false)
    }
  },
  beforeDestroy: function() {
    if (!this.inlineMode) {
      document.documentElement.removeEventListener('click', this.onExit, false)
    }
  },
  methods: {
    hideAndSubmit() {
      this.setDate()
    },
    getText(fromNow) {
      if (fromNow.isFuture) {
        let text = fromNow.text
        return text.substring(3)
      } else if (fromNow.text == 'چند ثانیه پیش') return this.$t('forms.today')
      return fromNow.text
    },
    focus() {
      if (this.disabled) return
      const input = document.getElementById(this.uniqeId)
      input.focus()
      this.inputClicked()
    },
    emitChanging() {
      this.changing = true
    },
    setDate() {
      const date = this.formatedChosenDate
      if (date.split('/').length === 3) {
        const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
        let [year, month, day] = date.split('/')
        year = +year
        month = +month
        day = +day
        if (month < 1) month = 1
        if (month > 12) month = 12

        if (year < this.cMinimumYear) year = this.cMinimumYear
        if (year > this.cMaximumYear) year = this.cMaximumYear

        const daysInMonth = this.isJ
          ? moment.jDaysInMonth(year, month - 1)
          : moment(`${year}/${month}`, 'YYYY/M').daysInMonth()
        if (day < 1) day = 1
        if (day > daysInMonth) day = daysInMonth

        this.chosenYear = year
        this.chosenMonth = month - 1
        this.chosenDay = day

        const m = moment(`${year}/${month}/${day}`, format)
        if (m.isValid()) {
          this.updateInput()
        }
        this.isDialogOpen = false
        this.changing = false
      }
    },
    availableDate() {
      if (this.availableDateStart || this.availableDateEnd) {
        const availableDateStart = this.availableDateStart || new Date(1922, 0, 1).toISOString()
        const availableDateEnd = this.availableDateEnd || new Date(3500, 11, 31).toISOString()
        this.availableDates = true

        this.startAvailableDateV = moment.utc(availableDateStart, 'YYYY-MM-DDTHH:mm:ss.SSS')

        this.endAvailableDateV = moment.utc(availableDateEnd, 'YYYY-MM-DDTHH:mm:ss.SSS')
      }
    },
    toggleCalendar() {
      if (this.cal === 'jalali') this.cal = 'gregorian'
      else this.cal = 'jalali'

      this.openDialog()
      this.init(true)
    },
    init(dontUpdateInput) {
      const locale = this.isJ ? 'fa' : 'en'
      moment.locale(locale)

      this.dayNames = moment.weekdaysMin()
      if (this.isJ) {
        this.dayNames.splice(0, 0, this.dayNames[6])
        this.dayNames.splice(7, 1)
      }

      this.monthNames = this.isJ ? moment.localeData()._jMonths : moment.months()

      if (this.inputCheck(this.value)) {
        this.inputChanged(this.value, dontUpdateInput)
      } else if (this.isTodayInRange()) {
        this.goToToday()
      } else {
        // const m = this.startAvailableDateV
        // const year = (this.isJ) ? m.jYear() : m.year()
        // const month = (this.isJ) ? m.jMonth() : m.month()
        this.goToToday()
      }
    },
    empty() {
      this.emitInput(null)
      this.formatedChosenDate = ''
      this.chosenYear = 0
      this.chosenMonth = 0
      this.chosenDay = 0
      this.chosenHour = this.endOfDay ? 23 : null
      this.chosenMinute = this.endOfDay ? 59 : null
      this.chosenSecond = this.endOfDay ? 59 : null

      if (this.isTodayInRange()) {
        this.goToToday()
      }
    },
    inputClicked() {
      if (!this.isDialogOpen) {
        this.openDialog()
      } else {
        this.closeDialog()
      }
    },
    openDialog() {
      if (this.isDialogOpen) return
      this.isDialogOpen = true
      if (this.initialView === 'day') {
        this.isDayView = true
        this.isMonthView = false
        this.isYearView = false
      } else if (this.initialView === 'month') {
        this.isDayView = false
        this.isMonthView = true
        this.isYearView = false
      } else {
        this.isDayView = false
        this.isMonthView = false
        this.isYearView = true
      }
      this.$emit('opened', this.value)
    },
    closeDialog() {
      if (!this.inlineMode) {
        this.isDialogOpen = false
        this.isDayView = false
        this.isMonthView = false
        this.isYearView = false
        this.$emit('closed', this.value)
      }
    },
    isDateInRange(day) {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.displayingYear}/${this.displayingMonthNum + 1}/${day}`, format)
      return m.isBetween(this.startAvailableDateV, this.endAvailableDateV, null, '[]')
    },
    isTodayInRange() {
      if (!this.availableDates) return true
      const m = moment()
      return m.isBetween(this.startAvailableDateV, this.endAvailableDateV, null, '[]')
    },
    inputCheck(value) {
      let m
      if (this.mode === 'epoch') {
        if (!value || isNaN(value)) return false
        m = moment.utc(value)
      } else {
        if (!value || !value.length) return false
        m = moment.utc(value, 'YYYY-MM-DDTHH:mm:ss.SSS')
      }

      if (m.isValid()) {
        const year = this.isJ ? m.jYear() : m.year()
        if (year < this.cMinimumYear || year > this.cMaximumYear) return false
        return true
      }
      return false
    },
    inputChanged(value, dontUpdateInput) {
      if (this.inputCheck(value)) {
        let m
        if (this.mode === 'epoch') {
          m = moment.utc(Number(value))
        } else {
          m = moment.utc(value, 'YYYY-MM-DDTHH:mm:ss.SSS')
        }
        m = m.tz(this.$config.geolocations.timeZone.text)

        this.chosenHour = m.hour()
        this.chosenMinute = m.minute()
        this.chosenSecond = m.second()

        const year = this.isJ ? m.jYear() : m.year()
        const month = this.isJ ? m.jMonth() : m.month()
        const date = this.isJ ? m.jDate() : m.date()

        this.goToMonth(year, month)
        this.dayClicked(date, dontUpdateInput)
      } else {
        this.empty()
      }
    },
    ifDayBoxIsChosenDay(day) {
      return (
        this.chosenYear === this.displayingYear &&
        this.chosenMonth === this.displayingMonthNum &&
        this.chosenDay === day
      )
    },
    ifDayIsFriday(day) {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.displayingYear}/${this.displayingMonthNum + 1}/${day}`, format)
      return m.weekday() === 6
    },
    ifMonthBoxChosenMonth(month) {
      return this.chosenYear === this.displayingYear && this.chosenMonth === month
    },
    ifYearBoxChosenYear(year) {
      return this.chosenYear === year
    },
    onFocus(event) {
      event.target.select()
    },
    goToToday() {
      const m = moment()
      this.goToDate(m)
    },
    goToYesterday() {
      const m = moment().subtract(1, 'd')
      this.goToDate(m)
    },
    goToDate(m) {
      const year = this.isJ ? m.jYear() : m.year()
      const month = this.isJ ? m.jMonth() : m.month()
      const date = this.isJ ? m.jDate() : m.date()

      this.chosenYear = year
      this.chosenMonth = month
      this.chosenDay = date

      this.goToMonth(this.chosenYear, this.chosenMonth)
    },
    goToMonth(year, month) {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${year}/${month + 1}/1`, format)
      const daysInMonth = this.isJ ? moment.jDaysInMonth(year, month) : m.daysInMonth()

      let d = m.day()
      if (this.isJ) {
        d = (d + 1) % 7
      }

      this.firstDayOfMonth = d
      this.daysInMonth = daysInMonth
      this.displayingMonthNum = month

      const yearch = this.displayingYear !== year
      const monthch = this.displayingMonth !== this.monthNames[month]

      this.displayingYear = year
      this.displayingMonth = this.monthNames[month]

      if (monthch) this.$emit('monthChanged', this.value)
      if (yearch) this.$emit('yearChanged', this.value)
    },
    preMonthClicked() {
      let newMonth = this.displayingMonthNum - 1
      let newYear = this.displayingYear
      if (newMonth < 0) {
        if (newYear - 1 >= this.cMinimumYear) {
          newMonth = 11
          newYear--
        } else {
          newMonth = 0
        }
      }
      this.goToMonth(newYear, newMonth)
    },
    nextMonthClicked() {
      let newMonth = this.displayingMonthNum + 1
      let newYear = this.displayingYear
      if (newMonth > 11) {
        if (newYear + 1 <= this.cMaximumYear) {
          newMonth = 0
          newYear++
        } else {
          newMonth = 11
        }
      }
      this.goToMonth(newYear, newMonth)
    },
    dayClicked(day, dontUpdateInput) {
      if (this.availableDates && !this.isDateInRange(day)) {
        return
      }

      this.chosenDay = day
      this.chosenMonth = this.displayingMonthNum
      this.chosenYear = this.displayingYear

      if (!dontUpdateInput) {
        this.updateInput()
        this.closeDialog()
      } else if (this.humanize) {
        const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
        const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)
        this.formatedChosenDate = this.getHumanizedFormat(m, format)
      } else {
        this.formatedChosenDate = this.toFormatDate(this.chosenYear, this.chosenMonth + 1, this.chosenDay)
      }
    },
    getHumanizedFormat(m, format) {
      return m.calendar(null, {
        sameDay: `[${this.$t('forms.today')}]`,
        nextDay: `[${this.$t('forms.tomorrow')}]`,
        nextWeek: 'dddd',
        lastDay: `[${this.$t('forms.yesterday')}]`,
        lastWeek: this.$t('forms.lastWeekDay'),
        sameElse: format
      })
    },
    monthClicked(month) {
      this.displayingMonthNum = month
      this.isMonthView = false
      this.isYearView = false
      this.isDayView = true
      this.goToMonth(this.displayingYear, this.displayingMonthNum)
    },
    yearClicked(year) {
      this.displayingYear = year
      this.isMonthView = true
      this.isYearView = false
      this.isDayView = false
      this.goToMonthSelect()
    },
    goToYearSelect() {
      this.isMonthView = false
      this.isDayView = false
      this.isYearView = true
      this.$nextTick(function() {
        const target = this.$el.querySelector('#year-' + this.displayingYear)
        target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop
      })
    },
    updateInput() {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)
      if (this.humanize) {
        this.formatedChosenDate = this.getHumanizedFormat(m, format)
      } else {
        const formated = this.toFormatDate(this.chosenYear, this.chosenMonth + 1, this.chosenDay)
        this.formatedChosenDate = formated
      }

      m.hour(this.chosenHour)
      m.minute(this.chosenMinute)
      m.second(this.chosenSecond)

      this.emitInput(m.utc())
    },
    numToStr(num) {
      return '' + num
    },
    nextYearClicked() {
      if (this.displayingYear + 1 <= this.cMaximumYear) {
        this.displayingYear++
        this.$emit('yearChanged', this.value)
      }
    },
    preYearClicked() {
      if (this.displayingYear - 1 >= this.cMinimumYear) {
        this.displayingYear--
        this.$emit('yearChanged', this.value)
      }
    },
    goToMonthSelect() {
      this.isDayView = false
      this.isMonthView = true
      this.chosenMonth = this.displayingMonthNum
      this.$emit('monthChanged', this.value)
    },
    toFormatDate(year, month, day) {
      const elements = this.formatDate.split('/')
      const outYear = '' + elements[0] === 'YYYY' ? year : year - 1300
      let outMonth = ''
      if (elements[1] === 'M') outMonth = month
      else if (elements[1] === 'MM') {
        if (month < 10) outMonth = '0' + month
        else outMonth = month
      } else if (elements[1] === 'MMM') outMonth = this.monthNames[month - 1]
      const outDay = elements[2] === 'DD' && day < 10 ? '0' + day : day
      return outYear + '/' + outMonth + '/' + outDay
    },
    onExit(ev) {
      if (!this.$el.contains(ev.target)) this.closeDialog()
    },
    replaceAllArray(str, find, replace) {
      let replacedStr = str
      for (let i = 0; i < find.length; i++) {
        replacedStr = replacedStr.split(find[i]).join(replace[i])
      }
      return replacedStr
    },
    emitToday() {
      const m = moment()
        .tz(this.$config.geolocations.timeZone.text)
        .startOf('day')
      m.millisecond(0)
      this.emitInput(m)
    },
    emitInput(m) {
      let val
      if (this.mode === 'epoch') val = m && Number(m.unix() * 1000)
      else val = m && m.toISOString().replace('.000Z', '')

      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$dialog-width: 273px;
$box-width: 39px;
$month_box_width: 91px;
$font-size: 14px;

.form-control:focus {
  box-shadow: none;
}
.const-width {
  input {
    max-width: 110px;
  }
}
.pdatepicker {
  position: relative;
  .time-picker {
    max-width: 160px;
    direction: ltr;
    .input-group-text {
      border-width: 1px 0;
    }
    .form-control {
      border-radius: 0 !important;
    }
  }
  .empty {
    position: absolute;
    z-index: 3;
    cursor: pointer;
    display: block;
    top: 9px;
    right: 9px;
    *[dir='rtl'] & {
      right: auto;
      left: 9px;
    }
    &.small {
      top: 7px;
    }
  }
  input {
    background: #fff;
  }
  .dialog {
    position: absolute;

    z-index: 1010;
    &.dropup {
      top: auto;
      bottom: 100%;
    }
    &.reverse {
      right: 0;
      *[dir='rtl'] & {
        left: 0;
        right: auto;
      }
    }
    width: $dialog-width + 8;
    span {
      font-size: $font-size;
    }
    .endofweek,
    .endofseason {
      padding: 0px;
      margin: 0px;
      width: 0px;
      height: 0px;
    }
    .day-view {
      text-align: left;
      *[dir='rtl'] & {
        text-align: right;
      }
      .dialog-month {
        width: 100%;
        div {
          display: inline-block;
          text-align: center;
          padding: 10px 0;
          cursor: pointer;
          font-size: $font-size;
        }
        .nextMonth {
          float: left;
          *[dir='rtl'] & {
            float: right;
          }
          width: 10%;
          &:hover {
            background-color: rgba(256, 256, 256, 0.1);
          }
        }
        .preMonth {
          float: left;
          *[dir='rtl'] & {
            float: right;
          }
          width: 10%;
          &:hover {
            background-color: rgba(256, 256, 256, 0.1);
          }
        }
        .monthName {
          float: left;
          *[dir='rtl'] & {
            float: right;
          }
          width: 80%;
          &:hover {
            background-color: rgba(256, 256, 256, 0.1);
          }
        }
      }
      .dialog-week {
        width: 100%;
      }
      .day-box {
        width: 14.285714285714%;
        height: $box-width;
        line-height: $box-width;
        display: inline-block;
        text-align: center;
        padding: 0;
        cursor: pointer;
        vertical-align: middle;
        position: relative;
        .hover-effect {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          transition: transform 150ms ease-out;
          z-index: 1;
          transform: scale(0);
        }
        .num {
          z-index: 2;
          position: relative;
        }
        &:hover {
          .hover-effect {
            transform: scale(1);
          }
        }
        &.disabled-day {
          background-color: #e3e3e3;
          cursor: default;
          .hover-effect {
            display: none !important;
          }
        }
        &.chosen-day {
          .hover-effect {
            transform: scale(1) !important;
          }
        }
      }
      .day-name {
        &:hover {
          cursor: default;
        }
      }
      .empty-box {
        cursor: default;
      }
    }
    .month-view {
      text-align: center;
      .dialog-year {
        width: 100%;
        div {
          display: inline-block;
          text-align: center;
          padding: 10px 0;
          cursor: pointer;
          font-size: $font-size;
        }
        .nextYear {
          float: right;
          width: 10%;
        }
        .preYear {
          float: right;
          width: 10%;
        }
        .cyear {
          float: right;
          width: 80%;
        }
      }
      .month-box {
        width: 33.3333333%;
        line-height: $box-width;
        display: inline-block;
        text-align: center;
        padding: 0 5px;
        cursor: pointer;
        font-size: $font-size;
        position: relative;
        .hover-effect {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          transition: transform 150ms ease-out;
          z-index: 1;
          transform: scale(0);
          z-index: 1;
        }
        .num {
          position: relative;
          z-index: 2;
        }
        &:hover {
          .hover-effect {
            transform: scale(1);
          }
        }
        &.chosen-month {
          .hover-effect {
            transform: scale(1) !important;
          }
        }
      }
    }
    .year-view {
      width: 100%;
      height: 250px;
      overflow: scroll;
      overflow-x: hidden;
      .year-box {
        display: inline-block;
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
        font-size: $font-size;
        width: 25%;
        position: relative;
        .hover-effect {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          transition: transform 150ms ease-out;
          z-index: 1;
          transform: scale(0);
          z-index: 1;
        }
        .num {
          position: relative;
          z-index: 2;
        }
        &:hover {
          .hover-effect {
            transform: scale(1);
          }
        }
        &.chosen-year {
          .hover-effect {
            transform: scale(1) !important;
          }
        }
      }
    }
  }
  &.inline {
    display: inline-block;
    .dialog {
      position: static;
    }
  }
}

/*** Animations ***/
/** Scale Fade **/
.fade-enter-active {
  transition: all 300ms ease-out;
}
.fade-leave-active {
  transition: all 300ms ease-out;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
  position: absolute;
  top: 0px;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
/** Slide Fade **/
.slide-fade-enter-active {
  transition: all 300ms ease-out;
}
.slide-fade-leave-active {
  transition: all 300ms ease-out;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave {
  transform: translateY(0px);
  opacity: 1;
}
//-------------------------------
.dp-danger {
  background: #ffe2e2 !important;
  color: #5b0000 !important;
  border-color: #d89797;
}

.dp-warning {
  background: #fffad8 !important;
  color: #895f0d !important;
  border-color: #d8be8c;
}
</style>
