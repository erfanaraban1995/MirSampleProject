<template>
  <div class="public">
    <change-locale id="cl"></change-locale>
    <router-view></router-view>
  </div>
</template>

<script>
import { ChangeLocale } from './core'
export default {
  name: 'pub',
  components: {
    ChangeLocale
  }
}
</script>

<style scoped>
  #cl{
    position: absolute;
    left:20px;
    top:20px;
    z-index:1
  }
</style>
