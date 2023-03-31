<template>
  <search
    ref="searchProxy"
    :fields="fields"
    v-bind="$attrs"
    class="wide-md"
    v-on="listeners"
    :getApi="getApi"
    :getFilter="getFilter"
    title="جستجوی استان"
  >
    <b-row class="align-items-center">
      <b-col cols="12" md="auto" class="mb-3 flex-grow-1">
        <b-input-group prepend="ID">
          <numeric-input autofocus no-separator v-model="search.id" />
        </b-input-group>
      </b-col>

      <b-col cols="12" md="auto" class="mb-3 flex-grow-1">
        <b-input-group :prepend="$t('shared.name')">
          <b-form-input v-model="search.name" :name="$t('shared.name')" />
        </b-input-group>
      </b-col>
    </b-row>

    <template #item-text="{item}"> {{ item.name }} </template>
    <template #selected-item-text="{item}"> {{ item.name }} </template>
    <template #cell(province)="{item}"> {{ item.name }} </template>
  </search>
</template>

<script>
import baseMixin from './baseMixin'
import getAllInfo from '@/mixins/getAllInfo'

export default {
  name: 'ProvinceSearch',
  mixins: [baseMixin(['province']), getAllInfo(['$provinces'])],
  props: {
    defaultInclude: {type: Array, default: () => ['country']}
  },
  data() {
    return {
      fields: [
        {
          key: 'id',
          label: this.$t('shared.id'),
          thStyle: 'width: 100px'
        },
        {
          key: 'province',
          label: this.$t('shared.name')
        },
        {
          key: 'actions',
          label: this.$t('shared.actions'),
          thStyle: 'width: 150px'
        }
      ],
      search: {
        countryId: null,
        id: null,
        name: null
      }
    }
  },
  methods: {
    getFilter() {
      const filter = this.filter()
      filter.countryId = this.$config.geolocations.defaultCountry.id
      return filter
    },
    getApi(filter) {
      return this.$provinces(filter)
    }
  }
}
</script>
