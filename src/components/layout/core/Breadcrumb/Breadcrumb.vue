<template>
  <ol v-if="$store.state.$breadcrumb && $store.state.$breadcrumb.length" class="breadcrumb">
    <li class="breadcrumb-item" :key="index" v-for="(route, index) in routeRecords">
      <span class="active" v-if="isLast(route)">{{ getName(route) }}</span>
      <router-link v-else :to="getTo(route)">{{ getName(route) }}</router-link>
    </li>
  </ol>
  <ol v-else class="breadcrumb">
    <font-awesome-icon spin icon="circle-notch" class="text-info ms-5"/>
  </ol>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    getName (item) {
      if (item.name) return this.$t(`nav.${item.name}`)
      else if (item.label) return item.label
      else return null
    },
    getTo (item) {
      return item.path
    },
    isLast (route) {
      // return index === this.routeRecords.length - 1
      if (!route.path) return true
    }
  },
  computed: {
    routeRecords: function () {
      return this.$store.state.$breadcrumb
      // return this.list.filter((route, index) => {
      //   return (route.name || route.meta.label && (index == 0 || route.path !== this.$config.homeUrl))
      // })
      // .map(route => {
      //   if (route.path === '') route.path = this.$config.homeUrl
      //   return route
      // })
    }
  }
}
</script>
