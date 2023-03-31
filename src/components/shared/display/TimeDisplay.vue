<template>
  <span v-if="startTime && endTime">
    <font-awesome-icon v-if="icon" icon="clock" :size="iconSize" class="me-1 align-middle" :class="iconClass" />

    <slot v-if="time" testid="time"> {{ time }} </slot>
    <template v-else>
      <slot> {{ startTime }} </slot>
      <slot name="divider"> {{ label }} </slot>
      <slot> {{ endTime }} </slot>
    </template>
  </span>
</template>

<script>
export default {
  name: 'TimeDisplay',
  props: {
    value: {type: [Object, String], default: null},
    start: {type: String, default: null},
    end: {type: String, default: null},
    label: {
      type: String,
      default: function() {
        return this.$t('shared.to')
      }
    },
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
    },
    startTime() {
      let startTime = this.start
      if (this.value) {
        startTime = this.value.startTime
      }
      return this.hummanize(startTime)
    },
    endTime() {
      let endTime = this.end
      if (this.value) {
        endTime = this.value.endTime
      }
      return this.hummanize(endTime)
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
