<template>
  <div dir="ltr" class="animated fadeIn text-left">
    <div class=" p-2 mb-3 border border-dark bg-white" v-for="(item, index) in routes" :key="index">
      <b-label labelclass="border border-danger" label="Url">
        <span v-if="item.path"> /{{ item.path }} </span>
      </b-label>

      <route-item :name="`${index}`" :value="item" :key="`${index}`"/>
    </div>
  </div>
</template>

<script>
import {options} from '@/router'
import RouteItem from './RouteItem'

export default {
  name: 'Routes',
  components:{
    RouteItem
  },
  data() {
    return {
      routes: null
    }
  },
  mounted() {
    this.checkOpttions()
    this.setBreadcrumb()
  },
  methods: {
    setBreadcrumb() {
      this.$setBreadcrumb([])
      const breadcrumb = [{name: 'home', path: this.$config.homeUrl}, {name: 'routes'}]
      this.$setBreadcrumb(breadcrumb)
    },
    checkOpttions() {
      this.routes = options.routes[0].children
    }
  }
}
</script>
