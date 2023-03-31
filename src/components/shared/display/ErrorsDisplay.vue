<template>
  <b-alert :show="show" id="errors" variant="danger" class="px-4">
    <ul class="m-0 px-1">
      <li v-if="$slots.first"><slot name="first"></slot></li>
      <li v-for="err in errorItems.all(form)" :key="err" v-html="err" />
      <template v-if="exteraErrors && exteraErrors.length">
        <li v-for="err in exteraErrors" :key="err" v-html="err" />
      </template>
      <li v-if="$slots.last"><slot name="last"></slot></li>
    </ul>
  </b-alert>
</template>

<script>
export default {
  name: 'ErrorsDisplay',
  props: {
    value: {type: Object, default: null},
    exteraErrors: {type: Object, default: null},
    form: {type: String, default: null}
  },
  computed: {
    errorItems() {
      return this.value || this.$parent.errors
    },
    show() {
      return this.errorItems.any(this.form) || (this.exteraErrors && this.exteraErrors.length)
    }
  }
}
</script>
