<template>
  <b-input-group :prepend="prepend" ref="cntr" :size="size" class="flex-nowrap w-100" v-outSideClick="hideResults">
    <div class="flex-grow-1 position-relative">
      <b-form-input
        :size="size"
        :dir="dir"
        :placeholder="placeholder"
        v-model="keyword"
        class="w-100"
        :class="{'bg-light': disabled, 'rounded-right-0 pl-5': $dir.rtl, 'rounded-left-0 pr-5': $dir.ltr}"
        :disabled="disabled"
        @focus="onFocus"
        @input="searchKeyword"
        autocomplete="off"
      />

      <div v-if="!disabled" class="h-100 d-flex align-items-center vertical-center">
        <font-awesome-icon
          v-if="!$isEmpty(value)"
          icon="times"
          :size="size == 'sm' ? null : size"
          class="me-2 text-moremuted cursor-pointer"
          @click="clearValue()"
        />

        <font-awesome-icon
          :icon="!showResults ? 'chevron-down' : 'chevron-up'"
          :size="size == 'sm' ? null : size"
          class="text-moremuted cursor-pointer"
          @click="toggleResults"
        />
      </div>
    </div>

    <b-list-group
      id="options"
      v-if="showResultsList"
      class="position-absolute autocomplete-result-position list-group-flush border rounded"
      :style="resultStyles"
    >
      <b-list-group-item v-if="progressing" class="py-1 px-2 text-muted text-center cursor-pointer">
        {{ $t('shared.searching') }} ...
      </b-list-group-item>

      <template v-else-if="results.length">
        <b-list-group-item
          class="py-1 px-2 cursor-pointer"
          action
          v-for="(item, index) in results"
          :key="getValue(item)"
          @click.prevent="selectItem(item)"
        >
          <slot name="item" :item="item">
            <b-row>
              <b-col v-if="item.image" cols="auto">
                <thumbnail testid="tumbnailtest" :path="item.image" :height="30" :width="30" />
              </b-col>

              <b-col :id="`item-text-${index}`" class="flex-grow-1">
                <slot name="item-text" :item="item">
                  {{ getText(item) }}
                  <slot v-if="item.altText && !noDetails" name="details" :item="item">
                    <span class="small text-muted"> ({{ getAltText(item) }}) </span>
                  </slot>
                </slot>
              </b-col>

              <b-col v-if="!noBadge && getValue(item)" cols="auto">
                <b-badge variant="secondary" class="pt-1 mx-1"> {{ getValue(item) }} </b-badge>
              </b-col>
            </b-row>
          </slot>
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

      <b-list-group-item v-else class="py-1 px-2 text-muted cursor-pointer">
        {{ $t('shared.noRecords') }}
      </b-list-group-item>
    </b-list-group>

    <template #append>
      <slot name="append"></slot>
    </template>
  </b-input-group>
</template>
<script>
import Thumbnail from '@/components/shared/Thumbnail'
import {isFunction} from '@/lib/util'

export default {
  name: 'AutoComplete',
  props: {
    value: {type: [String, Number, Object], default: null},
    prepend: String,
    dir: String,
    valueField: {type: [String, Function, Boolean], default: 'id'},
    textField: {type: [String, Function], default: 'name'},
    altTextField: {type: [String, Function], default: 'altText'},
    searchable: {type: Boolean, default: true},
    modelField: {
      type: [String, Boolean],
      default: function() {
        return this.valueField
      }
    },
    disabled: Boolean,
    extendFilter: {type: Object, default: () => ({})},
    size: {type: String, default: null},
    placeholder: null,
    debouce: {type: Number, default: 400},
    perPage: {type: Number, default: 30}, // limit results per page
    select: [Function, Object], // Promise : gets value and returns {value,text} object
    search: Function, // Promise : gets keyword and returns [{value,text}] array,
    default: Boolean, // active set default value in select Function
    noBadge: {type: Boolean, default: false},
    noDetails: {type: Boolean, default: false},
    top: {type: Boolean, default: false}
  },
  components: {
    Thumbnail
  },
  data() {
    return {
      progressing: false,
      keyword: null,
      showResults: false,
      choosing: false,
      isExpandable: true,
      page: 1,
      timer: null,
      selected: null,
      results: []
    }
  },
  mounted() {
    this.initialize()
  },
  computed: {
    showResultsList() {
      return this.searchable && !this.choosing && this.showResults
    },
    resultStyles() {
      const style = {}
      if (this.top) {
        style.top = 'unset'
        style.bottom = '106%'
      }
      return style
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.onClearValue()
      }
      if (!this.modelField) {
        this.initValue(val)
      }
    },
    keyword() {
      this.choosing = false
    },
    showResults(val) {
      if (!val) {
        this.results = []
      }
    }
  },
  methods: {
    onClearValue() {
      this.updateValue(null)
      this.emitClear()
    },
    getText(item) {
      if (!item) return null
      if (isFunction(this.textField)) return this.textField(item)
      else {
        const label = this.textField || 'name'
        return item[label]
      }
    },
    getAltText(item) {
      if (!item) return null
      const label = this.altTextField || 'altText'
      return item[label]
    },
    getValue(item) {
      if (!item) return null
      if (!this.valueField) return item
      return item[this.valueField]
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
    emitInitialize(item) {
      this.$emit('initialize', item)
    },
    emitClear() {
      this.$emit('clear')
    },
    emitChange(item) {
      this.$emit('change', item)
    },
    emitInput(value) {
      this.$emit('input', value)
    },
    emitSelect(item) {
      this.$emit('select', item)
    },
    updateValue(item) {
      const value = this.getModel(item)
      this.selected = item
      this.keyword = this.getText(item)
      this.emitInput(value)
      this.emitChange(item)
    },
    expandResult() {
      this.progressing = true
      this.page++
      const filters = {
        ...this.extendFilter,
        page: this.page,
        size: this.perPage,
        keyword: this.keyword
      }
      this.search(filters)
        .then((items) => {
          this.isExpandable = items.length >= this.perPage
          this.results.push(...items)
          this.showResults = true
        })
        .catch((err) => {
          this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
        })
        .finally(() => {
          this.progressing = false
        })
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
      if (!this.$isEmpty(this.value)) {
        this.emitInput(null)
      }
    },
    selectItem(item) {
      const value = this.getModel(item)
      if (value !== this.value) {
        this.choosing = true
        this.updateValue(item)
        this.emitSelect(item)
      }
      this.showResults = false
    },
    initValue(item) {
      this.selected = item
      this.keyword = this.getText(item)
      const value = this.getModel(item)
      if (value !== this.value) {
        this.$emit('input', value)
        this.emitChange(item)
      }
    },
    initialize(select = this.select) {
      if (!select) {
        return this.initValue(null)
      }
      const initialValue = isFunction(select) ? select() : select

      Promise.resolve(initialValue)
        .then((res) => {
          this.emitInitialize(res)
          this.initValue(res || null)
        })
        .catch((err) => {
          this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
          this.initValue(null)
        })
    },
    toggleResults() {
      if (this.disabled) return
      this.showResults = !this.showResults
      if (this.showResults) {
        this.progressing = true
        this.getResults(this.keyword)
      }
    },
    getResults(keyword) {
      this.page = 1
      const filters = {
        ...this.extendFilter,
        page: this.page,
        size: this.perPage,
        keyword
      }
      this.search(filters)
        .then((items) => {
          this.isExpandable = items.length >= this.perPage
          this.results = items
          this.showResults = true
        })
        .catch((err) => {
          this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
        })
        .finally(() => {
          this.progressing = false
        })
    },
    searchKeyword(keyword) {
      if (!keyword) {
        this.clear()
      }
      this.progressing = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getResults(keyword)
      }, this.debouce)
    },
    onFocus() {
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
