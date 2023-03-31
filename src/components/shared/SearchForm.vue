<template>
  <b-card body-class="p-0" :footer-class="{'border-0': !expanded}" header-class="p-0">
    <b-card-header class="d-flex justify-content-between align-items-center cursor-pointer" @click="toggleExpand">
      {{ title }}
      <span>
        <font-awesome-icon
          v-if="expanded"
          testid="chevron-up"
          icon="chevron-up"
          size="lg"
          class="align-middle m-1 text-info"
        />
        <font-awesome-icon
          v-else
          icon="chevron-down"
          testid="chevron-down"
          size="lg"
          class="align-middle m-1 text-info"
        />
      </span>
    </b-card-header>

    <b-collapse v-model="expanded">
      <b-card-body testid="form-wrapper" class="p-2 search-form">
        <b-alert v-if="errors.any('form')" show id="errors" variant="danger" class="px-4 mb-2">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all('form')" :key="err.id">{{ err }}</li>
          </ul>
        </b-alert>

        <b-form id="search-form-body" @keydown.enter.prevent="filtering()">
          <slot></slot>
        </b-form>
      </b-card-body>
    </b-collapse>

    <template #footer>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-nowrap align-items-center">
          <b-btn :disabled="progressing" size="sm" @click="filtering()" :class="$dir.rtl ? 'ml-2' : 'mr-2'">
            <font-awesome-icon icon="filter" size="sm" :class="{'align-middle ml-1': $dir.rtl, 'mr-1': $dir.ltr}" />
            {{ $t('shared.applyFilter') }}
          </b-btn>

          <slot name="actions-right"></slot>
        </div>

        <div class="d-flex flex-nowrap align-items-center">
          <slot name="actions-left"></slot>
        </div>
      </div>
    </template>
  </b-card>
</template>

<script>
import {nowDateTime} from '@/lib/util'

export default {
  name: 'SearchForm',
  props: {
    validate: Function,
    autoClose: {type: Boolean, required: false},
    title: {
      type: String,
      default() {
        return this.$t('shared.search')
      }
    }
  },
  data() {
    return {
      lastUpdate: null,
      expanded: true
    }
  },
  created() {
    this.$validator = this.$parent.$validator
  },
  computed: {
    progressing() {
      return this.$parent.progressing
    }
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    },
    filtering() {
      this.$validator.validateAll('form').then((isValid) => {
        if (isValid) {
          this.lastUpdate = nowDateTime()
          if (this.autoClose) {
            this.expanded = false
          }
          this.$emit('filtering')
        }
      })
    },
    refresh() {
      this.lastUpdate = nowDateTime()
    }
  }
}
</script>
