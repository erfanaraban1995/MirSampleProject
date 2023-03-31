<template>
  <CExport
    v-if="show"
    :fetch="fetch"
    :header="excelHeader"
    :subtitle="subtitle"
    :columns="columns"
    v-bind="$attrs"
    :fileName="fileName"
    @finished="afterFinish"
  >
    <b-btn id="dl-btn" :disabled="progressing" :size="size" variant="primary" class="ms-2">
      <font-awesome-icon
        v-if="!progressing"
        icon="download"
        size="sm"
        :class="{'align-middle ml-1': $dir.rtl, 'mr-1': $dir.ltr}"
      />
      <font-awesome-icon
        spin
        v-else
        icon="circle-notch"
        size="sm"
        :class="{'align-middle ml-1': $dir.rtl, 'mr-1': $dir.ltr}"
      />
      {{ $t('shared.excelExport') }}
    </b-btn>
  </CExport>
</template>

<script>
import moment from 'moment-jalaali'
import CExport from '@/components/shared/CExport'
export default {
  name: 'DownloadExcel',
  inheritAttrs: false,
  props: {
    header: {type: [String, Array]},
    getExcel: {type: Function},
    filter: {type: Object, default: () => ({})},
    columns: {type: Array, default: () => []},
    count: {type: [String, Number]},
    size: {type: String, default: 'sm'},
    progressing: {type: Boolean, required: true},
    name: {type: String, default: 'export_excel'}
  },
  components: {
    CExport
  },
  data() {
    return {
      now: null,
      fileName: null,
      subtitle: null
    }
  },
  computed: {
    show() {
      return this.count
    },
    excelHeader() {
      if (Array.isArray(this.header)) return this.header
      return `${this.$t(this.header)} - ${this.$t('shared.reportDate')}: ${this.date}`
    },
    date() {
      return moment().format('dddd jDD jMMMM jYYYY HH:mm:ss')
    }
  },
  methods: {
    createFileName() {
      const now = new Date().toLocaleString('fa-ir')
      return `${this.name}_${now}`
    },
    fetch(ctx) {
      return this.getExcel(ctx).then((res) => {
        this.subtitle = this.createSubtitle()
        this.fileName = this.createFileName()
        return res
      })
    },
    afterFinish() {
      this.$emit('finish')
    },
    createSubtitle() {
      const form = document.getElementById('search-form-body')
      if (!form) return null
      const wrapper = [...form.children[0].children]
      const conditions = wrapper.map((item) => {
        const labelTag = item.querySelector('.input-group-text, .custom-control-label')
        return {
          label: labelTag && labelTag.innerText,
          value: this.getValue(item)
        }
      })

      const finalText = conditions
        .filter((item) => item.value && item.label)
        .map((item) => `${item.label}: ${item.value}`)
        .join('\t\t')
      return finalText
    },
    getValue(item) {
      return [...item.querySelectorAll('input:not([filter="off"]), select:not([filter="off"])')]
        .map((tag) => {
          if (tag.nodeName === 'SELECT') {
            return [...tag.selectedOptions].map((option) => (option.value ? option.innerText : null)).join(' - ')
          } else if (tag.type === 'checkbox') {
            return tag.checked ? this.$t('shared.yes') : this.$t('shared.no')
          } else {
            return tag.value
          }
        })
        .filter(Boolean)
        .join(' | ')
    }
  }
}
</script>
