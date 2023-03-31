<template>
  <span :class="{'d-block': block}">
    <span v-if="label" testid="label" class="text-muted me-1 text-nowrap" :class="labelClass"> {{ label }} : </span>
    <slot> </slot>
  </span>
</template>

<script>
export default {
  name: 'BLabel',
  props: {
    label: {type: [String, Boolean], default: null},
    labelClass: {type: [String, Object], default: null},
    block: {type: Boolean, default: false}
  }
}
</script>
