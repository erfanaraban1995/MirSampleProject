<template>
  <span>
    <font-awesome-icon v-if="icon" icon="clock" :size="iconSize" class="me-1 align-middle" :class="iconClass" />

    <slot v-if="time"> {{ time }} </slot>
  </span>
</template>

<script>
export default {
  name: 'ClockDisplay',
  props: {
    value: {type: String, default: null},
    summary: {type: Boolean, default: true},
    icon: {type: Boolean, default: false},
    iconClass: {
      type: String,
      default: 'text-info'
    },
    iconSize: {
      type: String
    }
  },
  computed: {
    time() {
      if (typeof this.value === 'string') {
        return this.hummanize(this.value)
      }
      return null
    }
  },
  methods: {
    hummanize(time) {
      if (time === 0) return 0
      if (!time) return null
      if (this.summary) return +time.split(':00')[0]
      return time
        .split(':')
        .slice(0, 2)
        .join(':')
    }
  }
}
</script>
