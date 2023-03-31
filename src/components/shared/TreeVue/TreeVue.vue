<template>
  <b-card header-bg-variant="white" header-class="border-bottom-0" body-class="pt-0">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <span>{{ $t('shared.permissions') }}</span>
        <div>
          <font-awesome-icon icon="folder-open" @click="expandAll" class="ms-3 cursor-pointer text-secondary" />
          <font-awesome-icon icon="folder" @click="collapseAll" class="ms-3 cursor-pointer text-secondary" />
        </div>
      </div>
    </template>

    <hr class="mt-0" />
    <b-input v-model="term" @input="searchTerm" :placeholder="$t('shared.search')" class="mb-3" />
    <div ref="treeView"></div>
  </b-card>
</template>

<script>
import TreeView from './TreeView'
export default {
  name: 'TreeVue',
  props: {
    items: {type: Array, default: () => []},
    value: {type: [Array], default: () => []}
  },
  data() {
    return {
      term: null,
      treeView: null
    }
  },
  mounted() {
    const vm = this
    this.$nextTick(() => {
      this.treeView = new TreeView(this.items, {
        el: vm.$refs.treeView,
        inputAttrs: {placeholder: vm.$t('shared.search')},
        checkboxClass: 'custom-control custom-checkbox b-custom-control-lg',
        checkboxInputClass: 'custom-control-input',
        checkboxLabelClass: 'custom-control-label',
        getText(item) {
          const text = vm.getTextItem(item)
          if (!text) return item.name
          return `${text} <span class="text-muted font-90"> (${item.name}) </span>`
        },
        comparator(term, item) {
          const text = vm.getTextItem(item)
          const fullText = `${text || ''} ${item.name}`
          console.log(term, fullText)
          return fullText.toLowerCase().includes(term.toLowerCase())
        },
        getTerm(item) {
          return item.name
        },
        onChange(value) {
          vm.$emit('input', value)
        },
        value: vm.value
      })
    })
  },
  methods: {
    expandAll() {
      this.treeView.expandAll()
    },
    collapseAll() {
      this.treeView.collapseAll()
    },
    searchTerm() {
      this.treeView.debounceSearch(this.term)
    },
    getTextItem(item) {
      if (!this.$te(`permissions.${item.name}`)) return null
      const text = this.$t(`permissions.${item.name}`)
      if (typeof text === 'object') {
        return text.self
      }
      return text
    }
  }
}
</script>
