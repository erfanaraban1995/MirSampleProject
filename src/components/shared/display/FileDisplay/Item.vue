<template>
  <div class="item dimensions">
    <thumbnail v-if="isImage" :path="value" :width="100" :height="100" fit-in fluid link class="image" />

    <b-link v-else target="_blank" :href="staticUrl()" class="file">
      {{ getExtension }}
    </b-link>

    <b-btn size="sm" v-if="!disabled" class="remove-btn" variant="link" @click="remove">
      <font-awesome-icon icon="times" class="align-middle" />
    </b-btn>
  </div>
</template>

<script>
import Thumbnail from '../../Thumbnail'
import {staticServerUrl} from '@/lib/path'

export default {
  name: 'Item',
  components: {
    Thumbnail
  },
  props: {
    value: {type: String, required: true},
    disabled: {type: Boolean, default: false}
  },
  data() {
    return {
      imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'webp']
    }
  },
  computed: {
    isImage() {
      return this.imageExtensions.includes(this.getExtension.toLowerCase())
    },
    getExtension() {
      return this.value
        .toUpperCase()
        .split('.')
        .pop()
    }
  },
  methods: {
    staticUrl() {
      return staticServerUrl(this.value)
    },
    remove() {
      this.$emit('remove', this.value)
    }
  }
}
</script>
