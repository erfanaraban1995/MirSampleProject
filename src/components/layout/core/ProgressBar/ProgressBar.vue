<template>
  <div>
    <div
    v-if="progress"
    :style="{height: `${height}px`}"
    class="bar bg-light w-100 fixed-top"></div>
    <div
    :style="{width: `${progress}%`, height: `${height}px`}"
    class="bar bg-success fixed-top">
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  props: {
    height: {default: 3, type: Number}
  },
  computed: {
    progress () {
      return this.$uploadProgress || this.$downloadProgress
    },
    ...mapState(['$uploadProgress', '$downloadProgress'])
  },
}
</script>

<style lang="scss">
  .bar {
    opacity: .5;
    transition: width .3s;
  }
</style>
