<template>
  <component v-if="showImage" :is="link ? 'a' : 'span'" :href="staticUrl" target="_blank">
    <b-img v-bind="imgAttrs" />
  </component>
</template>

<script>
import {thumbServerUrl} from '@/lib/path.js'

export default {
  name: 'Thumbnail',
  props: {
    path: String,
    alt: String,
    watermark: {type: Boolean, default: false},
    watermarkHorizontalAlign: {type: String, default: 'left'}, // left | right
    watermarkVerticalAlign: {type: String, default: 'bottom'}, // bottom | top
    watermarkMargin: {type: Number, default: 50},
    watermarkOpacity: {type: Number, default: 50}, // 0 to 100
    fitIn: {type: Boolean, default: false},
    width: {type: Number, default: 40},
    height: {type: Number, default: 40},
    link: {type: Boolean, default: false},
    fluidGrow: {type: Boolean, default: false},
    fluid: {type: Boolean, default: false},
    showNoImage: {type: Boolean, default: false},
    preload: {type: Boolean, default: false},
    horizontalAlign: String,
    verticalAlign: String,
    imgClass: {type: String}
  },
  computed: {
    showImage() {
      return this.showNoImage || this.path
    },
    imgAttrs() {
      const attrs = {
        src: this.getImageSrc(),
        alt: this.alt,
        class: this.imgClass
      }

      if (this.fluidGrow) {
        attrs.fluidGrow = true
      } else {
        attrs.fluid = true
      }

      if (!this.fitIn && this.width && this.height) {
        attrs.width = this.width
        attrs.height = this.height
      }
      return attrs
    },
    staticUrl() {
      if (this.path) return thumbServerUrl(this.path)
      else if (this.showNoImage) return this.$config.files.noImageUrl
      else return null
    },
    thumbUrl() {
      if (this.path) {
        const secs = [this.$config.files.thumbServerUrl]

        if (this.fitIn) secs.push('fit-in')
        if (this.width && this.height) secs.push(`${this.width}x${this.height}`)

        if (this.horizontalAlign && this.horizontalAlign !== 'center') secs.push(this.horizontalAlign)

        if (this.verticalAlign && this.verticalAlign !== 'middle') secs.push(this.verticalAlign)

        if (this.watermark) {
          const horizontalMargin =
            this.watermarkHorizontalAlign === 'left' ? this.watermarkMargin : -this.watermarkMargin
          const verticalMargin = this.watermarkVerticalAlign === 'top' ? this.watermarkMargin : -this.watermarkMargin
          secs.push(
            `filters:watermark(${this.$config.files.watermarkUrl}, ${horizontalMargin}, ${verticalMargin}, ${this.watermarkOpacity})`
          )
        }
        secs.push(`files/${this.path}`)
        // secs.push(`${this.$config.files.staticServer}/files/${this.path}`)

        return secs.join('/')
      } else if (this.showNoImage) {
        return `${this.$config.files.noImageUrl}`
      } else return null
    }
  },
  methods: {
    getImageSrc() {
      return this.staticUrl
      // if (this.$config.files.thumbsAreEnabled) {
      //   return this.thumbUrl
      // } else {
      //   return this.staticUrl
      // }
    },
    download() {
      const img = new Image()
      img.onload = () => {
        this.$emit('preloaded', {
          width: img.width,
          height: img.height
        })
      }
      img.src = this.getImageSrc()
    }
  }
}
</script>
