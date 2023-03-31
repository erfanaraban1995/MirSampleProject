<template>
  <b-card body-class="py-2" class="mb-3" header-class="p-2">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <span class="required-input"> {{ label }} </span>

        <b-btn v-if="sampleUrl" :href="sampleUrl" id="sample-btn" class="text-decoration-none" size="sm" variant="link">
          {{ $t('shared.downloadSampleFile') }}
          <font-awesome-icon icon="cloud-download-alt" />
        </b-btn>
      </div>
    </template>

    <b-form-file :id="uniqueId" class="d-none" v-model="model" :accept="accept" />

    <div v-if="!model" class="flex-between-center">
      <span id="select-file" class="text-muted"> {{ $t('shared.selectYourFile') }} </span>

      <label class="btn btn-sm btn-secondary cursor-pointer mb-0 " :for="uniqueId">
        {{ $t('forms.chooseFile') }}
      </label>
    </div>

    <div v-else class="flex-between-center">
      <div class="text-muted">
        <font-awesome-icon icon="file-excel" class="align-middle text-info" size="lg" />
        <span id="exel-name" class="mx-1"> {{ model.name }} </span>
      </div>

      <b-btn id="delete-file" variant="outline-danger" size="sm" @click="remove">
        {{ $t('shared.delete') }}
      </b-btn>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'FileEditor',
  props: {
    value: {type: [Object, File]},
    sampleUrl: String,
    label: {
      type: String,
      default: function() {
        return this.$t('shared.excelFile')
      }
    },
    accept: {type: String, default: '.xls,.xlsx'}
  },
  data() {
    const uniqueId = `file-editor-${Math.floor(Math.random() * 99999)}`
    return {
      uniqueId
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    remove() {
      this.model = null
    }
  }
}
</script>
