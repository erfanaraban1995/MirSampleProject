<template>
  <search
    ref="searchProxy"
    :fields="fields"
    v-bind="$attrs"
    class="wide-md"
    v-on="listeners"
    :getApi="getApi"
    :getFilter="getFilter"
    text-field="name"
    :title="$t('shared.giftCardTypeSearch')"
  >
    <b-row>
      <b-col lg="4" class="mb-3">
        <b-input-group prepend="ID">
          <numeric-input autofocus no-separator v-model.trim="search.id" />
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.name')">
          <b-form-input v-model.trim="search.name"></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>

    <template #selected-item-text="{item}">
      {{ item.name }}
    </template>

    <template #cell(id)="{item}"> {{ item.id }} </template>
  </search>
</template>

<script>
import baseMixin from './baseMixin'

export default {
  name: 'UserSearch',
  mixins: [baseMixin(['user'])],
  props: {
    defaultInclude: {type: Array, default: () => []}
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
          key: 'name',
          label: this.$t('shared.name')
        },
        {
          key: 'actions',
          label: this.$t('shared.actions'),
          thStyle: 'width: 150px'
        }
      ],
      search: {
        id: null,
        name: null,
      }
    }
  },
  methods: {
    getApi(filter) {
      return this.$api.giftCardTypes.getAllInfo(filter)
    }
  }
}
</script>
