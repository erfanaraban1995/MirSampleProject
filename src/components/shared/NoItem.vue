<template>
  <div id="noItem" class="no-item-class">{{ title }}</div>
</template>

<script>
export default {
  name: 'NoItem',
  props: {
    title: {
      type: String,
      default: function() {
        return this.$t('shared.noRecords')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
