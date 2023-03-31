<template>
  <b-card id="footer-card" no-body :class="{sticky}" class="bg-light d-flex flex-row p-3">
    <slot name="extra-actions"></slot>
    <b-btn
      id="footer-submit-button"
      v-if="!noSubmit"
      :disabled="progressing"
      @click.prevent="submit"
      variant="success"
      class="me-auto"
    >
      <template v-if="!submitText">
        <template v-if="edit">
          <font-awesome-icon id="check-icon" icon="check" size="sm" class="me-1 align-middle" />
          {{ $t('shared.save') }}
        </template>

        <template v-else>
          <font-awesome-icon id="plus-icon" icon="plus" size="sm" class="me-1 align-middle" />
          {{ $t('shared.add') }}
        </template>
      </template>
      
      <template v-else>
        {{ submitText }}
      </template>
    </b-btn>

    <back-btn id="back-btn" v-if="!noBack" :to="backUrl" class="ms-auto" />
  </b-card>
</template>

<script>
export default {
  name: 'PageFooter',
  props: {
    progressing: {type: Boolean},
    noSubmit: {type: Boolean, default: false},
    noBack: {type: Boolean, default: false},
    edit: {type: Boolean, default: false},
    backUrl: {type: String, default: null},
    sticky: {type: Boolean, default: false},
    submitText: {
      type: String,
      default: ''
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  bottom: 0;
}
</style>
