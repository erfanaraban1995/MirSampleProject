<template>
  <div v-if="isExternalLink">
    <a :href="url" :class="classList">
      <i :class="classIcon"><font-awesome-icon :icon="icon" /></i>
      {{$t(`nav.${name}`)}}
      <b-badge pill v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
      <b-badge pill v-if="count" :variant="badge.variant">{{count}}</b-badge>
    </a>
  </div>
  <div v-else>
    <router-link :to="url" :class="classList" class="d-flex flex-row">
      <i :class="classIcon"><font-awesome-icon :icon="icon" /></i>
      {{$t(`nav.${name}`)}}
      <b-badge pill v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
      <b-badge pill v-if="count" :variant="badge.variant">{{count}}</b-badge>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'sidebar-nav-link',
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    badge: {
      type: Object,
      default: () => {}
    },
    variant: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      count: null
    }
  },
  computed: {
    classList () {
      return [
        'nav-link',
        this.linkVariant,
        ...this.itemClasses
      ]
    },
    classIcon () {
      return [
        'nav-icon'
      ]
    },
    linkVariant () {
      return this.variant ? `nav-link-${this.variant}` : ''
    },
    itemClasses () {
      return this.classes ? this.classes.split(' ') : []
    },
    isExternalLink () {
      if (this.url.substring(0, 4) === 'http') {
        return true
      } else {
        return false
      }
    }
  },
  watch:{
    $route () {
      if (this.badge && this.badge.countModel) {
        this.getCount()
      }
    }
  },
  mounted () {
    if (this.badge && this.badge.countModel) {
      this.getCount()
    }
  },
  methods: {
    getCount () {
      return this.$api[this.badge.countModel].count(this.badge.filter).then(res => {
        this.count = res
      })
    }
  }
}
</script>
