<template>
  <span :class="{'d-inline-block': tag}">
    <slot v-if="!noActivator" name="activator" :show="show" :hide="hide" :attrs="tagAttrs">
      <component :is="tag" v-bind="tagAttrs" @click.stop="show">
        <font-awesome-icon v-if="icon" :icon="icon" class="me-1 align-middle" :class="iconClass" />
        {{ label }}
      </component>
    </slot>

    <b-modal v-model="open" v-bind="$attrs" @hide="hide" v-on="$listeners">
      <slot :open="open" :show="show" :hide="hide"></slot>

      <template #modal-footer>
        <slot name="actions" :submit="submit" :hide="hide">
          <b-row class="flex-grow-1">
            <b-col cols="6">
              <b-btn variant="primary" block class="text-nowrap" :disabled="progressing" @click="submit">
                {{ okText }}
              </b-btn>
            </b-col>

            <b-col cols="6">
              <b-btn variant="outline-danger" block class="text-nowrap" @click="emitCancel" :disabled="progressing">
                {{ cancelText }}
              </b-btn>
            </b-col>
          </b-row>
        </slot>
      </template>

      <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
        <slot :name="slot" v-bind="props" :show="show" :hide="hide" />
      </template>
    </b-modal>
  </span>
</template>

<script>
export default {
  name: 'CModal',
  props: {
    value: {type: Boolean, default: null},
    icon: {type: [Array, String]},
    iconClass: {type: [Object, String]},
    disabled: {type: Boolean, default: false},
    visible: {type: Boolean, default: false},
    noActivator: {type: Boolean, default: false},
    hideOnCancel: {type: Boolean, default: false},
    tag: {type: String, default: 'b-btn'},
    cancelText: {
      type: String,
      default: function() {
        return this.$t('shared.return')
      }
    },
    okText: {
      type: String,
      default: function() {
        return this.$t('shared.save')
      }
    },
    progressing: {type: Boolean, default: false},
    tagAttrs: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: null
    }
  },
  inheritAttrs: false,
  data() {
    return {
      open: this.value
    }
  },
  mounted() {
    if (this.visible) this.open = true
  },
  watch: {
    value(val) {
      this.open = val
    },
    open(val) {
      this.$emit('input', val)
      if (val) {
        this.$emit('show')
      }
    }
  },
  methods: {
    show() {
      if (this.disabled) {
        return
      }
      this.$emit('show')
      this.open = true
    },
    submit() {
      this.$emit('submit', {hide: this.hide, show: this.show})
    },
    emitCancel() {
      this.$emit('cancel', {hide: this.hide, show: this.show})
      this.hide()
    },
    hide() {
      this.$emit('hide')
      this.open = false
    }
  }
}
</script>
