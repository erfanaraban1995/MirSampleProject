<template>
  <div>
    <slot name="label">
      <p v-if="label" class="mb-3" :class="labelClass">{{ label }}</p>
    </slot>

    <b-alert class="mb-3" variant="danger" :show="!$isEmpty(uploadErrors)">
      <ul class="m-0 px-1">
        <li v-for="error in uploadErrors" :key="error">{{ error }}</li>
      </ul>
    </b-alert>

    <files-display
      v-if="!$isEmpty(filePaths)"
      :disabled="disabled"
      :multiple="multiple"
      :lightbox="lightbox"
      v-model="filePaths"
      @input="emitInput"
    />

    <div v-if="!disabled && (multiple || !filePaths.length)">
      <input
        class="d-none"
        ref="input"
        type="file"
        name="file"
        :multiple="multiple && !editor"
        :accept="extensions"
        :disabled="uploading"
        @change="onChangeInputFile"
      />

      <b-btn :variant="uploading ? 'success' : 'light'" @click="openBrowse" size="sm">
        <font-awesome-icon :icon="uploading ? 'cog' : 'cloud-upload-alt'" :spin="uploading" class="align-middle me-1" />

        {{ uploading ? $t('forms.uploading') : $t('forms.chooseFile') }}
      </b-btn>

      <b-progress v-if="progress" :value="progress" class="mt-2" height="5px" animated />
    </div>

    <image-editor v-if="editor" ref="imageEditor" :aspect-ratio="aspectRatio" @change="editorChanged" />
  </div>
</template>

<script>
import {scaleImage} from './images.js'

export default {
  name: 'Uploader',
  components: {
    ImageEditor: () => import('./ImageEditor'),
    FilesDisplay: () => import('../display/FileDisplay')
  },
  props: {
    value: {type: String},
    upload: {type: Function, default: null},
    uploadMaxSize: {type: Number, default: 1073741824}, // 1073741824 bytes = (1 Gig)
    autoScale: {type: Number, default: null}, // pixels
    multiple: {type: Boolean, default: false},
    image: {type: Boolean, default: false}, // File Extension
    doc: {type: Boolean, default: false}, // File Extension
    zip: {type: Boolean, default: false}, // File Extension
    excel: {type: Boolean, default: false}, // File Extension
    accept: {type: String, default: null},
    max: {type: [Number, Boolean], default: false}, // maximum count of uploadable items // set false to unlimited
    disabled: {type: Boolean, default: false},
    editor: {type: Boolean, default: false},
    aspectRatio: {type: Number, default: 0},
    lightbox: {type: Boolean, default: true},
    labelClass: {type: [Array, String, Object], default: null},
    label: {
      type: String,
      default: function() {
        if (this.multiple) return this.$t('shared.images')
        else return this.$t('shared.image')
      }
    }
  },
  data() {
    return {
      progress: 0,
      filePaths: [],
      uploadErrors: [],
      extension: {
        image: ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'webp'],
        zip: ['zip', 'rar'],
        doc: ['doc', 'docx', 'txt', 'pdf'],
        excel: ['xls', 'xlsx']
      }
    }
  },
  computed: {
    uploading() {
      return this.progress > 0
    },
    extensions() {
      if (this.accept) return this.accept
      const extensions = Object.keys(this.extension).reduce((total, key) => {
        // if props in enable
        if (this[key]) {
          total.push(...this.extension[key])
        }
        return total
      }, [])

      // if extensions is empty set image extensions as default
      if (this.$isEmpty(extensions)) {
        extensions.push(...this.extension.image)
      }
      return extensions.map(ext => `.${ext}`).join(',')
    }
  },
  watch: {
    value: function(val) {
      if (val) {
        this.filePaths = val.split(',')
      } else {
        this.uploadErrors = []
        this.filePaths = []
      }
    },
    accept(newVal, oldVal) {
      if (newVal !== oldVal) this.validateAllFiles()
    }
  },
  mounted() {
    if (this.value) {
      this.filePaths = this.value.split(',')
    }

    this.validateAllFiles()
  },
  methods: {
    onChangeInputFile(e) {
      this.uploadErrors = []
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      const filesCount = files.length + this.filePaths.length
      if (this.max && filesCount > this.max) {
        this.uploadErrors.push(this.$t('forms.FilesNumberExceedsTheLimit', {max: this.max}))
        return
      }

      // Validate Size And Extention Of Files
      for (const file of files) {
        this.validateFileExtention(file.name)
        this.validateFileSize(file)
      }
      if (!this.$isEmpty(this.uploadErrors)) {
        return
      }

      let promise = Promise.resolve(files)
      // Auto Scale File
      if (this.autoScale) {
        promise = this.autoScaleFiles(files)
      }
      promise.then(items => {
        if (this.editor && this.isImage(items[0].name)) this.openEditor(items[0])
        else this.uploadFiles(items)
      })
    },
    uploadReq(files) {
      if (this.upload) {
        return this.upload(files, this.onProgress)
      } else {
        return this.$api.files.upload(files, this.onProgress)
      }
    },
    uploadFiles(files) {
      this.progress = 0.1
      return this.uploadReq(files)
        .then(res => {
          if (!this.$isEmpty(res)) {
            this.filePaths.push(res)
          }
          this.emitInput()
        })
        .catch(err => {
          this.uploadErrors.push(this.$getLocaleErrorMessage(err))
        })
        .finally(() => {
          this.progress = 0
          this.cleanInput()
        })
    },
    autoScaleFiles(files) {
      const scales = []
      for (const file of files) {
        if (file.type.match(/image.*/)) {
          scales.push(scaleImage(file, this.autoScale))
        } else {
          scales.push(file)
        }
      }
      return Promise.all(scales)
    },
    validateAllFiles() {
      if (this.$isEmpty(this.value)) {
        this.uploadErrors = []
        return
      }

      this.value.split(',').forEach(file => {
        this.validateFileExtention(file)
      })
    },
    validateFileExtention(file) {
      if (this.extensions.includes('*')) {
        return
      }
      const extension = this.getExtension(file)
      const invalidExtension = !this.extensions.toLowerCase().includes(extension)

      if (invalidExtension) {
        const errorMessage = this.$t('forms.fileExtensionNotAccepted', {fileName: extension, accepted: this.extensions})
        this.uploadErrors.push(errorMessage)
      }
    },
    validateFileSize(file) {
      if (file.size > this.uploadMaxSize) {
        const maxSizeInMB = Math.floor(this.uploadMaxSize / 1024)
        const errorMessage = this.$t('forms.file_max_size_exceeded', {fileName: file.name, maxSize: maxSizeInMB})

        this.uploadErrors.push(errorMessage)
      }
    },
    getExtension(file) {
      return file
        .split('.')
        .pop()
        .toLowerCase()
    },
    isImage(file) {
      return this.extension.image.includes(this.getExtension(file))
    },
    openBrowse() {
      this.$refs.input.click()
    },
    emitInput() {
      const value = this.$isEmpty(this.filePaths) ? null : this.filePaths.toString()
      this.$emit('input', value)
    },
    cleanInput() {
      if (this.$refs.input) this.$refs.input.value = ''
    },
    onProgress(e) {
      this.progress = parseInt((e.loaded * 100) / e.total)
      this.$emit('progress', this.progress)
    },
    openEditor(file) {
      this.$refs.imageEditor.show(file)
    },
    editorChanged(file) {
      this.uploadFiles([file])
    }
  }
}
</script>
