<template>
  <span>
    {{ $getText(toBoolean(value), $enums.booleanOptions) }}
  </span>
</template>

<script>

export default {
  name: 'BooleanDisplay',
  props: {
    value: {
      required: true
    }
  },
  methods: {
    toBoolean(value) {
      if (value === 'true') {
        return true
      }
      if (value === 'false') {
        return false
      }
      return Boolean(value)
    }
  }
}
</script>
