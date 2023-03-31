<template>
  <component :is="tag" v-bind="$attrs" v-on="$listeners" ref="component">
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" />
    </template>
  </component>
</template>

<script>
import {pascalCase} from '@/lib/util'

export default {
  name: 'SearchWrapper',
  props: {type: {type: String, required: true}},
  components: {
    CitySearch: () => import('./CitySearch'),
    PackageSearch: () => import('./PackageSearch'),
    ProvinceSearch: () => import('./ProvinceSearch'),
    UserSearch: () => import('./UserSearch'),
    UnitSearch: () => import('./UnitSearch'),
    FoodSearch: () => import('./FoodSearch'),
    CategorySearch: () => import('./CategorySearch'),
    GiftCardTypeSearch: () => import('./GiftCardTypeSearch'),
  },
  computed: {
    tag() {
      return `${pascalCase(this.type)}Search`
    },
    componentInstance() {
      return this.$refs.component
    }
  },
  methods: {
    clear() {
      this.componentInstance.clear()
    },
    show() {
      this.componentInstance.show()
    },
    hide() {
      this.componentInstance.hide()
    },
    clearFilters() {
      this.componentInstance.clearFilters()
    },
    clearItems() {
      this.componentInstance.clearItems()
    },
    searching() {
      this.componentInstance.searching()
    },
    toggleItem(item) {
      this.componentInstance.toggleItem(item)
    },
    initialize(item) {
      this.componentInstance.initialize(item)
    }
  }
}
</script>
