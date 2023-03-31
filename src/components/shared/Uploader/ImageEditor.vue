<template>
  <b-modal
    v-model="open"
    centered
    size="lg"
    hide-header
    no-close-on-backdrop
    body-class="p-2 image-editor"
    footer-class="p-2 d-block"
  >
    <vue-cropper v-if="src" ref="cropper" :src="src" :aspect-ratio="aspectRatio" :auto-crop-area="0.9" />

    <template v-slot:modal-footer>
      <b-row class="align-items-center">
        <b-col class="my-2 my-md-0">
          <b-btn v-for="btn in actionBtns" :key="btn.icon" size="sm" class="me-2" variant="link" v-on="btn.vOn">
            <font-awesome-icon :icon="btn.icon" size="lg" />
          </b-btn>
        </b-col>

        <b-col md="auto">
          <b-row no-gutters>
            <b-col order-md="2" md="6" class="mb-2 mb-md-0" :class="{'pl-md-2': $dir.ltr, 'pr-md-2': $dir.rtl}">
              <b-btn variant="success" block @click="submit">
                {{ $t('shared.save') }}
              </b-btn>
            </b-col>

            <b-col md="6">
              <b-btn @click="hide" block>
                {{ $t('shared.cancel') }}
              </b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
// Documents: https://github.com/Agontuk/vue-cropperjs
// Demo: https://agontuk.github.io/vue-cropperjs/
// Demo Code: https://github.com/Agontuk/vue-cropperjs/blob/master/example/src/App.vue
// Props: https://github.com/Agontuk/vue-cropperjs/blob/master/dist/VueCropper.js

import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import {getDataUrlFromFile, getMimeTypeExtension} from './images.js'

export default {
  name: 'ImageEditor',
  components: {
    VueCropper
  },
  props: {
    aspectRatio: {type: Number, default: 0}
  },
  data() {
    return {
      open: false,
      fileName: null,
      src: null,
      flip: {x: 1, y: 1},
      actionBtns: [
        {icon: 'search-plus', vOn: {click: this.zoomIn}},
        {icon: 'search-minus', vOn: {click: this.zoomOut}},
        {icon: 'redo-alt', vOn: {click: this.rotateRight}},
        {icon: 'undo-alt', vOn: {click: this.rotateLeft}},
        {icon: 'arrows-alt-v', vOn: {click: this.flipY}},
        {icon: 'arrows-alt-h', vOn: {click: this.flipX}}
      ]
    }
  },
  methods: {
    show(file) {
      this.fileName = null
      this.src = null
      getDataUrlFromFile(file).then(dataUrl => {
        this.fileName = file.name
        this.src = dataUrl
        this.open = true
      })
    },
    submit() {
      this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        blob.name = this.changeExtensionBasedOnMimeType(this.fileName, blob.type)
        this.$emit('change', blob)
        this.hide()
      })
    },
    changeExtensionBasedOnMimeType(fileName, mimeType) {
      const name = fileName
        .split('.')
        .slice(0, -1)
        .join('.')
      const ext = getMimeTypeExtension(mimeType)
      return `${name}.${ext}`
    },
    hide() {
      this.open = false
    },
    zoomIn() {
      this.$refs.cropper.relativeZoom(0.5)
    },
    zoomOut() {
      this.$refs.cropper.relativeZoom(-0.5)
    },
    rotateLeft() {
      this.$refs.cropper.rotate(-90)
    },
    rotateRight() {
      this.$refs.cropper.rotate(90)
    },
    flipX() {
      this.flip.x = -this.flip.x
      this.$refs.cropper.scaleX(this.flip.x)
    },
    flipY() {
      this.flip.y = -this.flip.y
      this.$refs.cropper.scaleY(this.flip.y)
    }
  }
}
</script>
