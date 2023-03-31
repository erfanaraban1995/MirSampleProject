<template>
  <b-pagination
    class="mt-3 mb-2"
    v-model="pageNumber"
    :total-rows="rows"
    :per-page="size"
    @change="pageClicked"
  ></b-pagination>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    rows: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      pageNumber: this.page
    }
  },
  methods: {
    pageClicked(page) {
      this.$emit('on-page-clicked', page)
    }
  }
}
</script>
