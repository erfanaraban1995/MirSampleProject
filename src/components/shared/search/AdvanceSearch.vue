<template>
  <c-modal
    v-model="open"
    :title="title"
    :label="prepend"
    class="d-block"
    hide-footer
    size="xl"
    v-bind="$attrs"
    :disabled="disabled"
    :scrollable="$isEmpty(items)"
    @hidden="clearFilters"
    @show="emitShow"
  >
    <template #activator="{show, hide}">
      <input type="hidden" :value="selectedItems.map((item) => getText(item)).join(' - ')" />
      <slot name="activator" :show="show" :hide="hide">
        <b-input-group :size="size" :prepend="prepend" class="flex-nowrap">
          <div
            @click="show"
            class="form-control h-auto d-flex flex-wrap cursor-pointer"
            :class="{'cursor-pointer': !multiple, 'bg-disabled': disabled}"
            style="min-width: 125px"
          >
            <component
              :is="multiple ? 'b-badge' : 'div'"
              v-for="item in selectedItems"
              :key="getKey(item)"
              variant="light"
              class="flex-grow-1"
              :class="{'me-1 font-90': multiple}"
            >
              <slot name="selected-item-text" :item="item"> {{ getText(item) }} </slot>
              <font-awesome-icon
                v-if="multiple && !disabled"
                @click.stop="removeItem(item)"
                icon="times"
                class="cursor-pointer text-secondary align-middle ms-1"
              />
            </component>
          </div>

          <b-input-group-append v-if="multiple && !disabled" @click="show" class="cursor-pointer">
            <b-input-group-text>
              <font-awesome-icon :size="size == 'sm' ? null : size" icon="plus" class="text-success" />
            </b-input-group-text>
          </b-input-group-append>

          <b-input-group-append
            v-else-if="!$isEmpty(selectedItems) && !disabled"
            @click="clear()"
            class="cursor-pointer"
          >
            <b-input-group-text class="bg-white rounded-left-0">
              <font-awesome-icon :size="size == 'sm' ? null : size" icon="times" class="text-muted" />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </slot>
    </template>

    <template #default="{show, hide}">
      <errors-display :value="errors" />
      <div @keyup.enter="searching">
        <slot :hide="hide" :show="show"></slot>
      </div>

      <slot name="actions" :hide="hide" :show="show">
        <div class="d-flex align-items-center">
          <b-btn :disabled="progressing" variant="primary" @click.prevent="searching" class="me-auto">
            <font-awesome-icon
              :icon="progressing ? 'cog' : 'search'"
              size="sm"
              :spin="progressing"
              class="me-1 align-middle"
            />
            {{ $t('shared.search') }}
          </b-btn>

          <b-btn @click.prevent="hide" class="me-2" variant="danger" :disabled="progressing">
            {{ $t('shared.close') }}
          </b-btn>

          <b-btn :disabled="progressing" variant="white" @click.prevent="clearFilters">
            {{ $t('shared.removeFilter') }}
          </b-btn>
        </div>
      </slot>

      <hr />
      <div v-if="multiple" class="d-flex align-items-start">
        <slot name="selections" :items="selectedItems" :removeItem="removeItem">
          <div style="min-height: 45px" class="flex-grow-1">
            <b-badge
              v-for="item in selectedItems"
              :key="getKey(item)"
              variant="light"
              class="py-2 me-2 d-inline-block font-90 font-weight-normal mb-3"
            >
              <slot name="selected-item-text" :item="item">
                {{ getText(item) }}
              </slot>

              <slot name="item-icon" :item="item" :removeItem="removeItem">
                <font-awesome-icon
                  @click="removeItem(item)"
                  icon="times"
                  class="mr-2 text-secondary cursor-pointer"
                  :class="{'ml-1 align-middle': $dir.rtl, 'mr-1': $dir.ltr}"
                />
              </slot>
            </b-badge>
          </div>
        </slot>

        <b-btn v-if="!$isEmpty(selectedItems)" variant="danger" @click="clear" class="ms-auto" size="sm">
          {{ $t('shared.removeAll') }}
        </b-btn>
      </div>

      <slot name="result" :items="items" :isSelected="isSelected" :multiple="multiple" :toggleItem="toggleItem">
        <b-table
          class="mb-0 bg-white"
          striped
          hover
          bordered
          head-variant="bg-table"
          :busy.sync="progressing"
          :fields="fields"
          :items="items"
          stacked="lg"
          :empty-text="$t('shared.noRecords')"
          :empty-filtered-text="$t('shared.noMatchingRecords')"
          show-empty
        >
          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" :show="show" :hide="hide" />
          </template>

          <template #cell(actions)="props">
            <slot name="cell(actions)" v-bind="{...props, show, hide}">
              <div class="text-center">
                <b-btn
                  class="px-3"
                  size="sm"
                  :variant="multiple && isSelected(props.item) ? 'danger' : 'success'"
                  @click="toggleItem(props.item)"
                >
                  {{ multiple && isSelected(props.item) ? $t('shared.remove') : $t('shared.select') }}
                </b-btn>
              </div>
            </slot>
          </template>
        </b-table>
        <div v-if="isExpandable" class="d-flex justify-content-center">
          <b-btn :disabled="progressing" @click="expandResult" variant="outline-dark" class="mt-3 mb-0">
            {{ $t('shared.moreResult') }}
            <font-awesome-icon icon="chevron-down" class="align-middle" />
          </b-btn>
        </div>
      </slot>
    </template>
  </c-modal>
</template>

<script>
import {isFunction} from '@/lib/util'
import isEqual from 'lodash/isEqual'
export default {
  name: 'AdvanceSearch',
  inheritAttrs: false,
  props: {
    value: {type: [Array, Object, Number], default: null},
    size: {type: String, default: null},
    prepend: {type: String, default: null},
    fields: {type: Array, default: () => []},
    valueField: {type: [String, Function, Boolean], default: 'id'},
    textField: {type: [String, Function], default: 'name'},
    select: {type: [Function, Object, Array], default: null},
    search: {type: Function, default: null},
    pageSize: {type: Number, default: 30},
    disabled: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    autoSelect: {type: Boolean, default: true},
    title: {
      type: String,
      default: function() {
        return this.prepend
      }
    }
  },
  data() {
    return {
      progressing: false,
      open: false,
      items: [],
      selectedItems: [],
      isExpandable: false,
      page: 1
    }
  },
  watch: {
    selectedItems: {
      handler(items) {
        const newModel = this.multiple ? items : items[0]
        const value = items.map((item) => this.getValue(item))
        const newValue = this.multiple ? value : value[0]
        if (this.isChanging(newValue)) {
          this.$emit('update', newModel)
          this.$emit('input', newValue)
          this.emitChange(newModel)
        }
      },
      deep: true
    },
    value: {
      handler(val) {
        if (this.$isEmpty(val)) this.clear()
      },
      deep: true
    }
  },
  created() {
    this.$validator = this.$parent.$validator
  },
  mounted() {
    this.initialize()
  },
  methods: {
    isChanging(newValue) {
      if (this.multiple) {
        return !isEqual(new Set(newValue), new Set(this.value))
      } else {
        return newValue !== this.value
      }
    },
    expandResult() {
      this.$validator.validateAll('searchForm').then((isValid) => {
        if (isValid) {
          this.progressing = true
          this.page++
          const filters = {
            page: this.page,
            size: this.pageSize
          }
          this.search(filters)
            .then((res) => {
              this.isExpandable = res.length >= this.pageSize
              this.items.push(...res)
            })
            .catch((err) => {
              this.$showError('advanced-search : ' + this.$getLocaleErrorMessage(err, 'shared'))
            })
            .finally(() => {
              this.progressing = false
            })
        }
      })
    },
    initialize(select = this.select) {
      if (!select) return
      const initialValue = isFunction(select) ? select() : select

      Promise.resolve(initialValue).then((res) => {
        this.emitInitialize(res)
        if (!res) return
        if (!this.multiple) {
          res = [res]
        }
        this.selectedItems = res.filter((i) => this.getValue(i))
      })
    },
    show() {
      this.open = true
    },
    hide() {
      this.open = false
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
    getKey(item) {
      return `${this.getText(item)}-${this.getValue(item)}`
    },
    clearFilters() {
      this.page = 1
      this.isExpandable = false
      this.items = []
      this.$emit('clearFilters')
    },

    clearItems() {
      this.items = []
      this.$emit('clearItems')
    },
    emitShow() {
      this.$emit('show')
    },
    emitKeyup() {
      this.$emit('keyup')
    },
    emitInitialize(item) {
      this.$emit('initialize', item)
    },
    emitRemove(item) {
      this.$emit('remove', item)
    },
    emitClear() {
      this.$emit('clear')
    },
    emitSelect(item) {
      this.$emit('select', item)
    },
    isSelected(item) {
      return !!this.selectedItems.find((i) => this.getValue(i) == this.getValue(item))
    },
    toggleItem(item) {
      if (!item) return
      const isSelected = this.isSelected(item)

      if (this.multiple) {
        if (isSelected) {
          this.removeItem(item)
        } else {
          const items = [...this.selectedItems]
          items.push(item)
          this.selectedItems = items
          this.emitSelect(item)
        }
      } else {
        this.selectedItems = [item]
        this.emitSelect(item)
        this.hide()
      }
    },
    removeItem(item) {
      this.selectedItems = this.selectedItems.filter((i) => this.getValue(i) !== this.getValue(item))
      this.emitRemove(item)
    },
    emitChange(items) {
      this.$emit('change', items)
    },
    emitFetchEnd(items) {
      this.$emit('fetchEnd', items)
    },
    searching() {
      this.$validator.validateAll('searchForm').then((isValid) => {
        if (isValid) {
          this.progressing = true
          const filter = {
            size: this.pageSize,
            page: this.page
          }
          this.search(filter)
            .then((res) => {
              this.emitFetchEnd(res)
              this.items = res
              this.isExpandable = this.items.length >= this.pageSize
              // if (this.autoSelect && res.length === 1) this.toggleItem(res[0])
              return res
            })
            .catch((err) => {
              this.$showError('advance-search : ' + this.$getLocaleErrorMessage(err))
              this.selectedItems = []
            })
            .finally(() => {
              this.progressing = false
            })
        }
      })
    },
    clear() {
      if (this.$isEmpty(this.selectedItems)) return
      this.selectedItems = []
      this.emitClear()
    }
  }
}
</script>
