<template>
  <div class="card-footer py-2 d-flex justify-content-between align-items-center">
    <div>
      <b-btn :disabled="progressing" size="sm" @click="filtering()" :class="$dir.rtl ? 'ml-2' : 'mr-2'">
        <font-awesome-icon icon="filter" size="sm" :class="{'align-middle ml-1': $dir.rtl, 'mr-1': $dir.ltr}" />
        {{ $t('shared.applyFilter') }}
      </b-btn>

      <slot name="right"> </slot>

      <span v-if="now" class="font-90">
        <span> {{ $t('shared.lastUpdate') }} : </span>
        <date-display class="d-sm-inline-block d-none" v-model="now" time icon seconds />
        <date-display class="d-sm-none d-inline-block" v-model="now" time />
      </span>
    </div>

    <div class="d-flex flex-nowrap">
      <slot name="left"></slot>

      <b-btn
        v-if="checkPermission(createPermission) && showCreated"
        size="sm"
        class="ms-2"
        variant="success"
        :to="createRoute"
      >
        <font-awesome-icon icon="plus" size="sm" :class="{'align-middle ml-1': $dir.rtl, 'mr-1': $dir.ltr}" />
        {{ $t('shared.add') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import {nowDateTime, hasPermission} from '@/lib/util'

export default {
  name: 'SearchFooter',
  props: {
    createPermission: {type: [String, Array], default: null},
    createRoute: {type: String, default: 'create'},
    showCreated: {type: Boolean, default: true},
    progressing: {type: Boolean, required: true}
  },
  data() {
    return {
      now: null
    }
  },
  methods: {
    filtering() {
      this.$emit('filtering')
    },
    refresh() {
      this.now = nowDateTime()
    },
    checkPermission(value) {
      if (!value) return true
      return hasPermission(value)
    }
  }
}
</script>
