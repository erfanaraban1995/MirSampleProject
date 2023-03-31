<template>
  <div class="ms-4">
    <b-row v-for="(item, index) in value.children" :key="index">
      <b-col>
        <b-label class="mb-2" label="URL">
          <span v-if="item.path"> /{{ item.path }} </span>
        </b-label>
      </b-col>

      <b-col>
        <b-label v-if="item.meta && item.meta.auth && item.meta.auth.length" class="mx-3" label="PERMISSION">
          <span v-for="(permission, index) in item.meta.auth" :key="index"> {{ permission }} </span>
        </b-label>
      </b-col>

      <b-col>
        <b-label v-if="item.meta && item.meta.title" class="mx-3" label="TITLE">
          <span> {{ $t(item.meta.title) }} </span>
        </b-label>
      </b-col>

      <b-col v-if="hasChildren" cols="12">
        <route-item :value="item" :Key="index" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RouteItems from './RouteItem'
export default {
  name: 'RouteItem',
  components: {
    RouteItems
  },
  props: {
    value: {type: Object, required: true}
  },
  computed: {
    hasChildren() {
      const {children} = this.value
      return children && children.length > 0
    }
  }
}
</script>
