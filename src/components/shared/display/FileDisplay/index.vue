<template>
  <div class="file-display">
    <draggable class="items" :disabled="!isDraggable" v-bind="getSortableOptions()" v-model="model">
      <item
        v-for="item in model"
        :key="item"
        :value="item"
        :disabled="disabled"
        @remove="removeItem"
        :class="{'mb-3': multiple}"
      />
    </draggable>

    <!-- <image-lightbox v-if="lightbox" :value="imageIndex" :images="model" /> -->
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'FilesDisplay',
  components: {
    draggable: () => import('vuedraggable'),
    Item
  },
  props: {
    value: {type: Array, default: () => []},
    disabled: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    lightbox: {type: Boolean, default: true}
  },
  data() {
    return {
      imageIndex: null
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    isDraggable() {
      return this.model.length > 1 && !this.disabled
    }
  },
  methods: {
    getSortableOptions() {
      return {
        animation: 200
      }
    },
    openGallery(index) {
      if (this.lightbox) {
        this.imageIndex = index
      }
    },
    removeItem(item) {
      if (confirm(this.$t('forms.areYouSureToRemoveThisFile'))) {
        this.model = this.model.filter(f => f !== item)
      }
    }
  }
}
</script>
