<template>
  <b-card id="table-footer-card" no-body v-if="total" class="mb-3 px-2 pt-2 d-flex d-print-none" bg-variant="light">
    <b-row class="align-items-center justify-content-start">
      <b-col v-if="total > perPage" class="mb-2 d-flex flex-row pl-sm-0" md="6">
        <b-pagination
          class="mb-0"
          :class="{'mr-0': $dir.rtl, 'ml-2': $dir.ltr}"
          :total-rows="total"
          v-model="page"
          :per-page="perPage"
        >
        </b-pagination>

        <b-input-group class="ms-1 flex-nowrap" style="max-width: 90px; min-width: 85px">
          <b-form-input v-model="targetPage" id="target-page" @keyup.enter="goTo()" />
          <b-input-group-append>
            <b-btn variant="info" @click="goTo()">
              <font-awesome-icon id="arrow-icon" :icon="$dir.rtl ? 'arrow-left' : 'arrow-right'" class="align-middle" />
            </b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-col>

      <b-col
        cols="6"
        sm="auto"
        class="text-dark  mr-lg-0 text-center mb-2"
        :class="{'mr-md-5': $dir.rtl, 'ml-md-5': $dir.ltr}"
      >
        <h6 class="d-inline-block font-lg text- mb-0" id="from-to">{{ from }} - {{ to }}</h6>
        <span> {{ $t('shared.from') }} </span>
        <h6 class="d-inline-block font-lg text- mb-0">{{ total }}</h6>
        <span> {{ $t('shared.item') }} </span>
      </b-col>

      <b-col cols="12" sm="auto" class="mb-2 " :class="{'mr-auto': $dir.rtl, 'ml-auto': $dir.ltr}">
        <div class="d-flex align-items-center">
          <div class="px-2 text-dark text-nowrap">{{ $t('shared.show') }} :</div>
          <b-form-select id="select-size" v-model="size" :options="sizeOptions" class="border-0" />
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'TableFooter',
  props: {
    total: {type: [Number, String], required: true},
    perPage: {type: [Number, String], required: true},
    currentPage: {type: [Number, String], required: true}
  },
  data() {
    return {
      sizeOptions: [10, 20, 50, 100],
      targetPage: null
    }
  },
  computed: {
    page: {
      get() {
        return this.currentPage
      },
      set(val) {
        if (this.checkPagination(this.perPage)) val = 1
        this.$emit('update:currentPage', val)
      }
    },
    size: {
      get() {
        return this.perPage
      },
      set(val) {
        if (this.checkPagination(val)) this.page = 1
        this.$emit('update:perPage', val)
      }
    },
    isLastPage() {
      return this.perPage * this.currentPage >= this.total
    },
    from() {
      return (this.currentPage - 1) * this.perPage + 1
    },
    to() {
      if (this.isLastPage) {
        return this.total
      }
      return this.perPage * this.currentPage
    }
  },
  methods: {
    goTo() {
      if (this.targetPage && !isNaN(this.targetPage)) {
        this.page = this.targetPage
      }
      this.targetPage = null
    },
    checkPagination(perPage) {
      let to
      let from
      if (perPage * this.currentPage >= this.total) {
        to = this.total
      } else {
        to = perPage * this.currentPage
      }
      from = (this.currentPage - 1) * perPage + 1
      return from > to
    }
  }
}
</script>
