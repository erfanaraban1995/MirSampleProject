<template>
  <b-btn
    :disabled="!show"
    :to="to"
    v-bind="$attrs"
    @click.prevent="back"
    variant="secondary"
    id="back-btn"
    :class="{'float-left': $dir.rtl, 'float-right': $dir.ltr}"
  >
    <font-awesome-icon
      id="redo-icon"
      icon="redo"
      size="sm"
      class="me-1 align-middle"
    />
    {{ $t('shared.return') }}
  </b-btn>
</template>

<script>
export default {
  name: 'BackRouter',
  inheritAttrs: false,
  props: {
    to: {type: String, default: null}
  },
  computed: {
    show() {
      return window.history.length > 1 || this.to
    }
  },
  methods: {
    back() {
      if (this.to) {
        this.$router.push(this.to)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
