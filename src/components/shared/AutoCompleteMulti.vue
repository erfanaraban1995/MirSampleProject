<template>
  <b-input-group :prepend="prepend" :size="size" class="flex-nowrap position-relative" v-outSideClick="hideResults">
    <input type="hidden" :value="selected.map((item) => getText(item)).join(' - ')" />
    <div
      class="d-flex w-100 flex-wrap px-1 pb-1"
      :class="{
        'rounded-left pl-5': $dir.rtl,
        'rounded-right pr-5': $dir.ltr,
        'bg-light': disabled,
        'bg-white': !disabled
      }"
      style="border:1px solid #e4e7ea"
    >
      <div
        v-for="item in selected"
        :key="getValue(item)"
        class="small me-1 mt-1 padding-chips px-1 bg-light rounded d-flex flex-nowrap align-items-center border align-self-center"
      >
        <slot name="selected-item" :item="item" :items="selected" :remove="remove">
          <slot name="selected-item-text" :getText="getText" :item="item">
            {{ getText(item) }}
          </slot>

          <font-awesome-icon
            @click.prevent="remove(item)"
            size="sm"
            class="align-middle cursor-pointer text-muted ms-2"
            icon="times"
          />
        </slot>
      </div>

      <b-col align-self="stretch">
        <b-form-input
          :disabled="disabled"
          :class="{'bg-light': disabled}"
          class="border-0 p-0 h-100"
          :size="size == 'lg' ? 'md' : 'sm'"
          style="min-width:130px"
          :dir="dir"
          :placeholder="placeholder"
          v-model="keyword"
          @focus="inputFocus"
          @input="searchKeyword"
          @keyup.enter="emitEnter"
          autocomplete="off"
          filter="off"
          id="multi-auto-search-input"
        />
      </b-col>

      <div class="h-100 d-flex align-items-center vertical-center">
        <font-awesome-icon
          v-if="value && value.length"
          :size="size == 'sm' ? null : size"
          icon="times"
          class="me-2 text-moremuted cursor-pointer"
          @click="clearValue()"
        />

        <font-awesome-icon
          @click="toggleResults"
          :size="size == 'sm' ? null : size"
          class="text-moremuted cursor-pointer"
          :icon="!showResults ? 'chevron-down' : 'chevron-up'"
        />
      </div>
    </div>

    <b-list-group
      id="options"
      v-if="showResultsList"
      class="position-absolute autocomplete-result-position list-group-flush border rounded"
    >
      <b-list-group-item v-if="progressing" class="py-1 px-2 text-muted text-center cursor-pointer">
        {{ $t('shared.searching') }} ...
      </b-list-group-item>

      <template v-else-if="results.length">
        <b-list-group-item
          v-for="(item, index) in results"
          :key="item.value"
          class="p-1 text-nowrap outline-0"
          button
          @click.prevent="selectItem(item)"
        >
          <slot name="item" :item="item">
            <b-row>
              <b-col v-if="item.image" cols="auto">
                <thumbnail :path="item.image" :height="30" :width="40" />
              </b-col>

              <b-col :id="`item-text-${index}`">
                <slot name="item-text" :item="item">
                  {{ getText(item) }}
                  <slot v-if="item.altText && !noDetails" name="details" :item="item">
                    <span class="small text-muted"> ({{ getAltText(item) }}) </span>
                  </slot>
                </slot>
              </b-col>

              <b-col v-if="!noBadge && getValue(item)" cols="auto">
                <b-badge dir="ltr" variant="secondary" class="pt-1 mx-1">
                  <slot name="item-badge" :item="item">
                    {{ getValue(item) }}
                  </slot>
                </b-badge>
              </b-col>
            </b-row>
          </slot>

          <slot name="details" :item="item"></slot>
        </b-list-group-item>

        <b-list-group-item
          v-if="isExpandable"
          variant="success"
          class="py-1 px-2 text-center cursor-pointer"
          action
          @click="expandResult"
        >
          {{ $t('shared.moreResult') }}
        </b-list-group-item>
      </template>

      <b-list-group-item v-else class="p-1 text-muted">
        {{ $t('shared.noRecords') }}
      </b-list-group-item>
    </b-list-group>

    <b-input-group-append v-if="this.$slots.default" is-text>
      <slot></slot>
    </b-input-group-append>
  </b-input-group>
</template>
<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'AutoCompleteMulti',
  props: {
    value: {type: Array, default: () => []},
    valueField: {type: String, default: 'id'},
    textField: {type: String, default: 'name'},
    modelField: {
      type: [String, Boolean],
      default: function() {
        return this.valueField
      }
    },
    prepend: String,
    dir: String,
    extendFilter: Object,
    disabled: {type: Boolean, default: false},
    searchable: {type: Boolean, default: true},
    size: String,
    debouce: {type: Number, default: 400},
    perPage: {type: Number, default: 30}, // limit results perPage
    default: Boolean,
    taggable: Boolean,
    select: Function, // Promise : gets [value] array and returns [{value,text}] array
    search: Function, // Promise : gets keyword and returns [{value,text}] array,
    noBadge: {type: Boolean, default: false},
    noDetails: {type: Boolean, default: false},
    placeholder: {
      type: String,
      default: function() {
        return this.$t('shared.search')
      }
    }
  },
  data() {
    return {
      progressing: false,
      choosing: false,
      isExpandable: true,
      page: 1,
      keyword: null,
      selected: [],
      results: [],
      showResults: false,
      timer: null
    }
  },
  components: {
    Thumbnail
  },
  mounted() {
    this.initialize()
  },
  watch: {
    value(val, oldValue) {
      if (this.$isEmpty(val) && !this.$isEmpty(oldValue)) {
        this.emitClear()
        this.update([])
      }
    },
    showResultsList(val) {
      if (!val) {
        this.results = []
      }
    }
  },
  computed: {
    showResultsList() {
      return this.searchable && !this.choosing && this.showResults
    }
  },
  methods: {
    expandResult() {
      this.page++
      const filters = {
        ...this.extendFilter,
        ...this.extendFilter,
        keyword: this.keyword,
        page: this.page,
        size: this.perPage
      }
      this.search(filters)
        .then((items) => {
          this.isExpandable = items.length >= this.perPage
          const results = items.filter((item) => !this.isSelected(item))
          this.results.push(...results)
          this.showResults = true
        })
        .catch((err) => {
          this.$showError('auto-complete-multi : ' + this.$getLocaleErrorMessage(err, 'shared'))
        })
        .finally(() => {
          this.progressing = false
        })
    },
    emitChange(items) {
      this.$emit('change', items)
    },
    emitEnter() {
      const keyword = this.keyword
      if (this.taggable && keyword) {
        const items = keyword.split(',').map((i) => ({
          name: i.trim(),
          id: i.trim()
        }))

        items.forEach((item) => {
          this.selectItem(item)
        })
      }
    },
    getText(item) {
      if (!item) return null
      if (!this.textField) {
        return item.name
      }
      if (typeof this.textField === 'string') {
        return item[this.textField]
      }
      return this.textField(item)
    },
    getAltText(item) {
      if (!item) return null
      const label = this.altTextField || 'altText'
      return item[label]
    },
    getValue(item) {
      if (!item) return null
      if (!this.valueField) {
        return item.id
      }
      if (typeof this.valueField === 'string') {
        return item[this.valueField]
      }
      return this.valueField(item)
    },
    getModel(item) {
      if (!item) return null
      if (!this.modelField) {
        return item
      }
      if (typeof this.modelField === 'string') {
        return item[this.modelField]
      }
      return this.modelField(item)
    },
    hideResults() {
      this.showResults = false
    },
    clearValue() {
      if (!this.disabled) {
        this.clear()
      }
    },
    clear() {
      if (!this.$isEmpty(this.selected)) {
        this.$emit('input', [])
        this.hideResults()
      }
    },
    emitClear() {
      this.$emit('clear')
    },
    toggleResults() {
      if (!this.disabled) {
        this.showResults = !this.showResults
        if (this.showResults) {
          this.progressing = true
          this.choosing = false
          this.searchKeyword(this.keyword)
        }
      }
    },
    selectItem(item) {
      this.choosing = true
      if (!this.isSelected(item)) {
        this.emitSelect(item)
        this.selected.push(item)
        this.emitInput(this.selected)
        this.hideResults()
        this.keyword = ''
      }
    },
    isSelected(item) {
      return this.selected.find((i) => this.getValue(i) === this.getValue(item))
    },
    remove(item) {
      this.emitRemove(item)
      const items = this.selected.filter((i) => this.getValue(i) !== this.getValue(item))
      this.update(items)
    },
    emitRemove(item) {
      this.$emit('remove', item)
    },
    emitInput(selected) {
      this.emitChange(selected)
      const items = selected.map((item) => this.getModel(item))
      this.$emit('input', items)
    },
    update(items) {
      items = items || []
      this.selected = items
      this.emitInput(items)
    },
    emitInitialize(items) {
      this.$emit('initialize', items)
    },
    emitSelect(item) {
      this.$emit('select', item)
    },
    initialize() {
      if (!this.select) return
      return this.select(this.value)
        .then((res) => {
          this.emitInitialize(res)
          this.update(res || null)
        })
        .catch((err) => {
          this.$showError('auto-complete-multi : ' + this.$getLocaleErrorMessage(err, 'shared'))
          this.selected = []
        })
    },
    getResults(keyword) {
      this.page = 1
      const filters = {
        ...this.extendFilter,
        keyword,
        page: this.page,
        size: this.perPage
      }
      this.search(filters)
        .then((items) => {
          this.isExpandable = items.length >= this.perPage
          this.results = items.filter((item) => !this.isSelected(item))
          this.showResults = true
        })
        .catch((err) => {
          this.$showError('auto-complete-multi : ' + this.$getLocaleErrorMessage(err, 'shared'))
        })
        .finally(() => {
          this.progressing = false
        })
    },
    searchKeyword(keyword) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getResults(keyword)
      }, this.debouce)
    },
    inputFocus() {
      if (!this.showResultsList) {
        this.choosing = false
        this.showResults = true
        this.progressing = true
        this.getResults(this.keyword)
      }
    }
  }
}
</script>
