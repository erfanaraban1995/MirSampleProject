<template>
  <search
    ref="searchProxy"
    :fields="fields"
    v-bind="$attrs"
    class="wide-md"
    v-on="listeners"
    :getApi="getApi"
    :getFilter="getFilter"
    text-field="fullName"
    :title="$t('shared.userSearch')"
  >
    <b-row>
      <b-col lg="4" class="mb-3">
        <b-input-group prepend="ID">
          <numeric-input autofocus no-separator v-model.trim="search.id" />
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.firstName')">
          <b-form-input v-model.trim="search.firstName"></b-form-input>
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.lastName')">
          <b-form-input v-model.trim="search.lastName"></b-form-input>
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.mobile')">
          <b-form-input v-model.trim="search.mobile" :name="$t('shared.mobile')" v-validate="'mobile'"></b-form-input>
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('account.email')">
          <b-form-input v-model.trim="search.email" :name="$t('account.email')" v-validate="'email'"></b-form-input>
        </b-input-group>
      </b-col>

      <b-col lg="4" class="mb-3">
        <b-input-group :prepend="$t('shared.nationalId')">
          <b-form-input
            v-model.trim="search.nationalId"
            :name="$t('users.nationalId')"
            v-validate="'national_id'"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>

    <template #selected-item-text="{item}">
      {{ getText(item) }}
    </template>

    <template #cell(id)="{item}"> {{ item.id }} </template>
    <template #cell(fullName)="{item}"> {{ item.firstName + ' ' + item.lastName }} </template>
  </search>
</template>

<script>
import baseMixin from './baseMixin'
import {UserDisplay, MobileDisplay} from '@/components/shared/display'

export default {
  name: 'UserSearch',
  mixins: [baseMixin(['user'])],
  components: {
    UserDisplay,
    MobileDisplay
  },
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
          key: 'fullName',
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
        mobile: null,
        firstName: null,
        lastName: null,
        email: null,
        nationalId: null
      }
    }
  },
  methods: {
    getText(item) {
      if (item.fullName) {
        return item.fullName
      } else {
        return item.firstName + ' ' + item.lastName
      }
    },
    getApi(filter) {
      return this.$api.users.getAllInfo(filter)
    }
  }
}
</script>
