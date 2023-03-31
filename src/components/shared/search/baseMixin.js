import Search from './Search'
const searchComponentMethods = [
  'clear',
  'initialize',
  'show',
  'hide',
  'clearFilters',
  'searching',
  'toggleItem',
  'clearItems'
]

export default (fields = []) => {
  const mixin = {
    inheritAttrs: false,
    props: {
      options: {type: Object, default: () => ({})},
      extendData: {type: Object, default: () => ({})},
      defaultFilter: {type: Object, default: () => ({})},
      defaultInclude: {type: Array, default: () => []},
      extendFilter: {type: Object, default: () => ({})}
    },
    components: {
      Search
    },
    mounted() {
      this.initData()
      this.initFilters()
    },
    watch: {
      defaultFilter: {
        handler() {
          this.initFilters()
        },
        deep: true
      },
      extendData: {
        handler() {
          this.initData()
        },
        deep: true
      }
    },
    computed: {
      searchProxy() {
        return this.$refs.searchProxy
      },
      searchInstance() {
        return this.searchProxy.searchInstance
      },
      searchProInstance() {
        return this.searchProxy.searchProInstance
      },
      listeners() {
        return {
          ...this.$listeners,
          clearFilters: this.resetFilters
        }
      }
    },
    methods: {
      initFilters() {
        const defaultFilter = this.defaultFilter || {}
        this.search = {...this.search, ...defaultFilter}
      },
      initData() {
        Object.keys(this.extendData).forEach((key) => {
          this[key] = this.extendData[key]
        })
      },
      filter() {
        const filter = this.$filter()
        const extendFilter = this.extendFilter || {}
        const defaultInclude = this.defaultInclude || []
        const filterInclude = this.search.include || []
        const include = [...defaultInclude, ...filterInclude]
        return {...filter, ...extendFilter, include}
      },
      getFilter() {
        return this.filter()
      },
      ignorKey(key) {
        const isIncludeItem = key === 'include'
        const isDisabledField = this.disabledOptions[key]
        return isIncludeItem || isDisabledField
      },
      resetFilters() {
        for (const key in this.search) {
          if (this.ignorKey(key)) continue
          if (this.defaultFilter[key]) this.search[key] = this.defaultFilter[key]
          else if (this.$isObject(this.search[key])) {
            this.search[key].max = null
            this.search[key].min = null
          } else if (key.endsWith('Ids')) this.search[key] = []
          else this.search[key] = null
        }
      }
    }
  }

  const disabledOptions = {}

  fields.forEach((field) => {
    if (!field) return
    const upperField = field[0].toUpperCase() + field.slice(1)
    const fieldInfo = `${field}Info`
    const fieldSelect = `${field}Select`
    const currentField = `current${upperField}Id`
    const fieldId = `${field}Id`
    const fieldDisabled = `${field}Disabled`
    const isFieldDisabled = `is${upperField}Disabled`

    disabledOptions[fieldId] = isFieldDisabled

    mixin.props[fieldInfo] = {type: Object, default: null}
    mixin.props[fieldDisabled] = {type: Boolean, default: null}

    mixin.computed[currentField] = function() {
      const currentFieldInfo = this[fieldInfo] || this.options[fieldInfo]
      return currentFieldInfo && currentFieldInfo.id
    }

    mixin.computed[isFieldDisabled] = function() {
      if (this[fieldDisabled] === false) return false
      const currentFieldInfo = this[fieldInfo] || this.options[fieldInfo]
      const currentFieldDisabled = this[fieldDisabled] || this.options[fieldDisabled]
      return !!currentFieldInfo || !!currentFieldDisabled
    }

    mixin.watch[currentField] = function() {
      if (this.searchInstance.clearItems) {
        this.searchInstance.clearItems()
      }
    }

    mixin.methods[fieldSelect] = function() {
      const currentFieldInfo = this[fieldInfo] || this.options[fieldInfo]
      return Promise.resolve(currentFieldInfo)
    }
  })

  mixin.computed.disabledOptions = function() {
    Object.entries(disabledOptions).forEach(([key, value]) => {
      disabledOptions[key] = this[value]
    })
    return disabledOptions
  }

  searchComponentMethods.forEach((fn) => {
    mixin.methods[fn] = function(...arg) {
      return this.searchInstance[fn](...arg)
    }
  })

  return mixin
}
