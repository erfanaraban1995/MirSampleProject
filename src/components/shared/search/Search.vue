<template>
  <component ref="search" :is="componentTag" v-bind="attrs" v-on="$listeners" :disabled="disabled">
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" />
    </template>

    <template v-if="pro" #append>
      <advance-search
        ref="proSearch"
        v-bind="attrs"
        :search="getItems"
        @select="selectItem"
        @fetchEnd="selectSingleResult"
        @clearFilters="$emit('clearFilters')"
      >
        <template #activator="{show}">
          <b-btn class="ms-2" variant="light" :disabled="disabled" @click="show">
            <font-awesome-icon icon="search" class="align-middle mx-1" />
          </b-btn>
        </template>

        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </advance-search>
    </template>
  </component>
</template>

<script>
import AdvanceSearch from '@/components/shared/search/AdvanceSearch'
import {searchByFilter} from '@/lib/util'

export default {
  name: 'SearchProxy',
  inheritAttrs: false,
  components: {
    AdvanceSearch
  },
  props: {
    searchKey: {type: String, default: 'name'},
    pro: {type: Boolean, default: false},
    simple: {type: Boolean, default: false},
    cacheKey: {type: [String, Number], default: null},
    autoSelect: {type: Boolean, default: true},
    multiple: {type: Boolean, default: false},
    getApi: {type: Function, default: null},
    getFilter: {type: Function, default: null},
    fetch: {type: Function, default: null},
    disabled: {type: Boolean, default: false}
  },
  data() {
    return {
      cachedResults: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.cacheKey) {
        this.cacheResults()
      } else {
        this.cachedResults = []
      }
    })
  },
  watch: {
    cacheKey(val) {
      this.$nextTick(() => {
        this.searchInstance.clear()
        if (val) {
          this.cacheResults()
        } else {
          this.cachedResults = []
        }
      })
    }
  },
  created() {
    this.$validator = this.$parent.$validator
  },
  computed: {
    searchInstance() {
      return this.$refs.search
    },
    searchProInstance() {
      return this.$refs.proSearch
    },
    isSimple() {
      return this.pro || this.simple
    },
    attrs() {
      const attrs = {...this.$attrs}
      if (this.pro) {
        attrs.search = this.getItemsPro
      } else {
        attrs.search = this.getItems
      }
      attrs.multiple = this.multiple
      attrs.ref = 'search'
      return attrs
    },
    componentTag() {
      if (this.isSimple && !this.multiple) {
        return 'auto-complete'
      } else if (this.isSimple && this.multiple) {
        return 'auto-complete-multi'
      } else {
        return 'advance-search'
      }
    }
  },
  methods: {
    cacheResults() {
      this.getItems(this.getFilter())
        .then((res) => {
          this.cachedResults = res
        })
        .then(() => {
          if (this.autoSelect && this.cachedResults.length === 1 && this.$isEmpty(this.$attrs.value)) {
            this.searchInstance.initialize(this.cachedResults[0])
          }
        })
    },
    getItems(filter = {}) {
      filter = {...filter, ...this.getFilter()}
      if (this.fetch) return this.fetch(filter)
      return this.getApi(filter)
    },
    getItemsPro(filter = {}) {
      if (this.pro) {
        const clientFilter = {[this.searchKey]: filter.keyword, id: filter.keyword}
        return Promise.resolve(searchByFilter(this.cachedResults, clientFilter))
      } else return this.getItems(filter)
    },
    selectSingleResult(results) {
      if (!this.isSimple && results.length === 1) {
        this.selectItem(results[0])
        this.hide()
      }
    },
    selectItem(item) {
      this.searchInstance.selectItem(item)
    }
  }
}
</script>
