<template>
  <search
    ref="searchProxy"
    :fields="fields"
    v-bind="$attrs"
    class="wide-md"
    v-on="listeners"
    :getApi="getApi"
    :getFilter="getFilter"
    title="جستجوی شهر"
  >
    <b-row class="align-items-center">
      <b-col cols="12" md="auto" class="mb-3 flex-grow-1">
        <b-input-group prepend="ID">
          <numeric-input autofocus local-string v-model="search.id" />
        </b-input-group>
      </b-col>

      <b-col cols="12" md="auto" class="mb-3 flex-grow-1">
        <auto-complete
          :prepend="$t('shared.province')"
          :search="$provinces"
          :select="provinceSelect"
          :disabled="isProvinceDisabled"
          v-model="search.provinceId"
          :extend-filter="{countryId: 1}"
        />
      </b-col>

      <b-col cols="12" md="auto" class="mb-3 flex-grow-1">
        <b-input-group :prepend="$t('shared.city')">
          <b-form-input v-model="search.name" :name="$t('shared.city')" />
        </b-input-group>
      </b-col>
    </b-row>

    <template #cell(city)="{item}"> {{ showText(item) }} </template>
    <template #item-text="{item}"> {{ showText(item) }} </template>
    <template #selected-item-text="{item}"> {{ showText(item) }} </template>
  </search>
</template>

<script>
import baseMixin from './baseMixin'
import getAllInfo from '@/mixins/getAllInfo'

export default {
  name: 'CitySearch',
  mixins: [getAllInfo(['$provinces']), baseMixin(['province', 'city'])],
  props: {
    defaultInclude: {type: Array, default: () => ['province.country']}
  },
  data() {
    return {
      fields: [
        {key: 'id', label: this.$t('shared.id'), thStyle: 'width: 100px'},
        {key: 'city', label: this.$t('shared.city')},
        {key: 'actions', label: this.$t('shared.actions'), thStyle: 'width: 150px'}
      ],
      search: {
        countryId: null,
        provinceId: null,
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
    showText(item) {
      return item.name
    },
    getApi(filter) {
      return this.$api.cities.getAllInfo(filter)
    }
  }
}
</script>
