<template>
  <search
    ref="searchProxy"
    :fields="fields"
    v-bind="$attrs"
    class="wide-md"
    v-on="listeners"
    :getApi="getApi"
    :getFilter="getFilter"
    :title="$t('nav.foods')"
  >
    <b-row>
      <b-col lg="4" class="mb-3">
        <b-input-group prepend="ID">
          <numeric-input focus no-separator v-model.trim="search.id" />
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.name')">
          <b-form-input v-model.trim="search.title" />
        </b-input-group>
      </b-col>
    </b-row>
    <template #cell(name)="{item}"> {{ item.title }} </template>
    <template #item-text="{item}"> {{ item.title }} </template>
    <template #selected-item-text="{item}"> {{ item.title }} </template>
  </search>
</template>

<script>
import baseMixin from './baseMixin'

export default {
  name: 'unitSearch',
  mixins: [baseMixin()],
  data() {
    return {
      fields: [
        {
          key: 'id',
          label: 'ID',
          thStyle: 'width:75px'
        },
        {
          key: 'name',
          label: this.$t('shared.name')
        },
        {
          key: 'actions',
          label: this.$t('shared.actions'),
          thStyle: 'width:250px'
        }
      ],
      search: {
        id: null,
        title: null
      }
    }
  },
  methods: {
    getApi(filter) {
      return this.$api.foods.getAllInfo(filter)
    }
  }
}
</script>
