<template>
  <span @click="exportExcel">
    <slot></slot>
  </span>
</template>

<script>
import {utils, writeFile} from 'xlsx'
export default {
  name: 'CExport',
  props: {
    columns: {type: Array, default: () => []},
    fetch: {type: Function, default: null},
    header: {type: String, default: null},
    subtitle: {type: String, default: null},
    html: {type: Boolean, default: null},
    fileName: {type: String, default: 'excel'},
    sheetName: {type: String, default: 'SheetName'},
    fileType: {type: String, default: 'xlsx', validator: (val) => ['xlsx', 'xls'].includes(val)}
  },
  computed: {
    fileNameWithExtension() {
      return `${this.fileName}.${this.fileType}`
    }
  },
  methods: {
    htmlToExcel(html) {
      const workbook = utils.table_to_book(html, {raw: false})
      workbook.Workbook = {
        ...(workbook.Workbook || {}),
        Views: [{RTL: true}]
      }

      writeFile(workbook, this.fileNameWithExtension)
    },

    checkColumns(columns) {
      const availableColumns = columns.filter((item) => !item.hide)
      const sortableColumns = availableColumns.every((item) => item.sortOrder)
        ? this.makeSort(availableColumns)
        : availableColumns
      return sortableColumns
    },

    jsonToExcel(dataItems) {
      const sortableColumns = this.checkColumns(this.columns)
      const excelHeader = sortableColumns.map((item) => item.title)

      if (this.$isEmpty(excelHeader)) {
        console.warn('Invalid columns!')
        return
      }

      const excelRows = [excelHeader]

      if (this.subtitle) {
        excelRows.unshift([this.subtitle])
      }
      if (this.header) {
        excelRows.unshift([this.header])
      }

      // prepare data for excel
      dataItems.map((row) => {
        const rowItem = []
        sortableColumns.map((column) => {
          const field = column.field
          const value = this.getNestedValue(row, field)
          if (column.formatter && typeof column.formatter === 'function') {
            rowItem.push(column.formatter(value))
          } else {
            rowItem.push(value)
          }
        })
        excelRows.push(rowItem)
      })

      const workbook = {Workbook: {Views: [{RTL: true}]}, Sheets: {}, SheetNames: []}
      const workSheet = utils.aoa_to_sheet(excelRows)

      if (this.header) {
        const mergeTitle = {s: {r: 0, c: 0}, e: {r: 0, c: excelHeader.length - 1}}
        if (!workSheet['!merges']) workSheet['!merges'] = []
        workSheet['!merges'].push(mergeTitle)
      }

      if (this.subtitle) {
        const mergeSubtitle = {s: {r: 1, c: 0}, e: {r: 1, c: excelHeader.length - 1}}
        if (!workSheet['!merges']) workSheet['!merges'] = []
        workSheet['!merges'].push(mergeSubtitle)
      }

      utils.book_append_sheet(workbook, workSheet, this.sheetName)
      writeFile(workbook, this.fileNameWithExtension)
    },
    makeSort(columns) {
      return columns.sort((a, b) => {
        return a.sortOrder - b.sortOrder
      })
    },

    async exportExcel() {
      if (!this.fetch) return
      const dataItems = await this.fetch()
      if (this.$isEmpty(dataItems)) {
        console.warn('Empty data!')
        return
      }

      if (this.html) {
        this.htmlToExcel(dataItems)
      } else {
        this.jsonToExcel(dataItems)
      }

      this.$emit('finished')
    },
    getNestedValue(object, path) {
      if (this.$isEmpty(path)) return object

      const keys = path.split('.')
      for (const key of keys) {
        if (this.$isEmpty(object)) break

        if (key in object) {
          object = object[key]
        } else {
          object = null
          break
        }
      }
      return object
    }
  }
}
</script>
