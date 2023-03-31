<template>
  <router-view></router-view>
</template>

<script>
import CustomRules from '@/mixins/CustomRules'
export default {
  name: 'app',
  mixins: [CustomRules]
}
</script>

<style lang="scss">
// Import vazir Font
@import '~vazir-font/dist/font-face.css';
// Import Main styles for this application
@import 'assets/scss/style';
</style>
