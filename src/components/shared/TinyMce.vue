<template>
  <div>
    <h6 v-if="title" class="tinymce-title" :class="titleClass">{{title}}</h6>
    <editor
    :disabled="disabled"
    :initial-value="value"
    :value="value"
    @input="emitInput"
    :init="tinymceConfig"
    />
    <b-modal
      ref="fmodal"
      size="xl"
      body-class="p-0"
      centered
      no-fade
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      lazy
      @hide="closeFileManager"
      :title="$t('fileManager.mediaGallery')"
    >
      <file-manager
        picker
        :doc-type="fileManager.docType"
        @pick="pick"
        @close="closeFileManager"
        :api="docsApi"
      />
    </b-modal>
  </div>
</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/themes/silver/theme';
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/searchreplace'
import 'tinymce/icons/default'

import Editor from '@tinymce/tinymce-vue'
import FileManager from './FileManager'

export default {
  name: 'tiny-mce',
  components: {
    Editor,
    FileManager
  },
  props: {
    docsApi: { type: Object, required: true },
    title: { type: String, default: undefined },
    titleClass: { type: String },
    value: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    resize: { type: Boolean, default: false },
    height: { type: Number, default: undefined },
    maxHeight: { type: Number, default: undefined },
    simple: { type: Boolean, default: false },
    cssUrl: { type: String, default: undefined }
  },
  data () {
    const language = this.$config.locale === 'fa' ? 'fa' : undefined

    const simple = false, full = true

    let toolbarItems = [
      {
        undo: full,
        redo: full
      },
      {
        bold: simple,
        italic: simple
      },
      {
        alignleft: simple,
        aligncenter: simple,
        alignright: simple,
        alignjustify: simple
      },
      {
        bullist: simple,
        numlist: simple
      },
      {
        table: full
      },
      {
        outdent: full,
        indent: full
      },
      {
        forecolor: full,
        backcolor: full
      },
      {
        image: full,
        media: full
      },
      {
        rtl: simple,
        ltr: simple
      },
      {
        searchreplace: full
      },
      {
        fullscreen: full,
        code: full
      }
    ]

    let toolbar = ''
    toolbarItems.forEach(group => {
      Object.keys(group).forEach(btn => {
        toolbar += (!this.simple || (this.simple && group[btn] === simple)) ? `${ btn } ` : ''
      });
      toolbar += ' | '
    });

    let content_css = [`/tinymce/content/default/content.css?v=${new Date().getTime()}`]
    if (this.cssUrl) content_css.push(`${this.cssUrl}?v=${new Date().getTime()}`)

    const vm = this

    return {
      tinymceConfig: {
        extended_valid_elements: '*[*]',
        skin_url: '/tinymce/ui/oxide',
        directionality : vm.$t('direction'),
        language_url: `/tinymce/langs/${language}.js`,
        language,
        content_css,
        plugins: ['paste', 'link', 'directionality', 'lists', 'advlist', 'autoresize', 'code', 'image', 'media', 'hr', 'fullscreen', 'table', 'wordcount', 'searchreplace'],
        menubar: vm.simple ? '' : 'edit view insert format tools table',
        toolbar,
        min_height: vm.height,
        max_height: vm.maxHeight,
        autoresize_bottom_margin: 30,
        resize: vm.resize,
        branding: false,
        table_default_attributes: { class: 'table' },
        table_default_styles: { },
        table_responsive_width: true,
        table_class_list: [
          {title: 'None', value: 'table'},
          {title: 'Striped Rows', value: 'table table-striped'},
          {title: 'Bordered', value: 'table table-bordered'},
          {title: 'Bordered Striped Rows', value: 'table table-bordered table-striped'},
          {title: 'Borderless', value: 'table table-borderless'},
          {title: 'Hoverable', value: 'table table-hover'},
          {title: 'Small', value: 'table table-sm'},
          {title: 'Small Striped Rows', value: 'table table-sm table-striped'},
          {title: 'Small Bordered', value: 'table table-sm table-bordered'},
          {title: 'Small Bordered Striped Rows', value: 'table table-sm table-bordered table-striped'},
          {title: 'Small Borderless', value: 'table table-sm table-borderless'},
          {title: 'Small Hoverable', value: 'table table-sm table-hover'}
        ],
        table_row_class_list: [
          {title: 'None', value: ''},
          {title: 'Primary', value: 'table-primary'},
          {title: 'Success', value: 'table-success'},
          {title: 'Danger', value: 'table-danger'},
          {title: 'Info', value: 'table-info'},
          {title: 'Warning', value: 'table-warning'},
          {title: 'Active', value: 'table-active'},
          {title: 'Secondary', value: 'table-secondary'},
          {title: 'Light', value: 'table-light'},
          {title: 'Dark', value: 'table-dark'}
        ],
        table_cell_class_list: [
          {title: 'None', value: ''},
          {title: 'Primary', value: 'table-primary'},
          {title: 'Success', value: 'table-success'},
          {title: 'Danger', value: 'table-danger'},
          {title: 'Info', value: 'table-info'},
          {title: 'Warning', value: 'table-warning'},
          {title: 'Active', value: 'table-active'},
          {title: 'Secondary', value: 'table-secondary'},
          {title: 'Light', value: 'table-light'},
          {title: 'Dark', value: 'table-dark'}
        ],
        file_picker_callback (callback, value, meta) {
          vm.fileManager.callback = callback
          vm.fileManager.value = value
          vm.fileManager.docType = meta.filetype.toUpperCase() // image | file | media

          vm.openFileManager()
        }
      },
      fileManager: {
        open: false,
        callback: null,
        docType: null,
        value: null
      }
    }
  },
  methods: {
    emitInput (val) {
      this.$emit('input', val)
    },
    pick (fileUrl, fileMeta) {
      this.fileManager.callback(fileUrl, fileMeta)
    },
    openFileManager () {
      this.fileManager.open = true
      this.$refs.fmodal.show()
    },
    closeFileManager () {
      this.fileManager.open = false
      this.$refs.fmodal.hide()
    }
  }
}
</script>
