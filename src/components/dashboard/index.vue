<template>
  <div></div>
</template>

<script>
export default {
  name: 'Dashboard',
  mounted() {
    this.setBreadcrumb()
  },
  methods: {
    setBreadcrumb() {
      this.$setBreadcrumb([])
      const breadcrumb = [{name: 'home', path: this.$config.homeUrl}, {name: 'dashboard'}]
      this.$setBreadcrumb(breadcrumb)
    }
  }
}
</script>
