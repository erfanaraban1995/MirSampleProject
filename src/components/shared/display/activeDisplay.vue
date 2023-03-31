<template>
  <font-awesome-icon :icon="value ? 'check' : 'times'" :class="value ? 'text-success' : 'text-danger'"/>
</template>

<script>
export default {
  name: 'activeDisplay',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
