<template>
  <span>
    <slot name="activator" :open="open">
      <b-btn :id="`popover-${uniqueId}`" variant="link">
        <font-awesome-icon :icon="icon" :class="iconClass" :size="size" />
      </b-btn>
    </slot>

    <b-popover
      :show.sync="open"
      :target="`popover-${uniqueId}`"
      :triggers="triggers"
      v-bind="$attrs"
      :placement="placement"
    >
      <template #title>
        <slot name="header"> {{ title }} </slot>
      </template>
      <slot :open="open"></slot>
    </b-popover>
  </span>
</template>

<script>
export default {
  name: 'CTooltip',
  inheritAttrs: false,
  props: {
    title: {type: String, default: null},
    size: {type: String, default: 'lg'},
    icon: {type: String, default: 'info-circle'},
    iconClass: {type: [String, Object, Array], default: 'text-primary'},
    placement: {type: String, default: 'right'},
    disabled: {type: Boolean, default: false},
    triggers: {type: [String, Array], default: 'hover'}
  },
  data() {
    return {
      uniqueId: Math.floor(Math.random() * 9999 + 1),
      open: false
    }
  }
}
</script>
