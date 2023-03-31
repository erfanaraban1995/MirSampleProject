<template>
  <span v-if="value" >
    <span :dir="$dir.rtl ? 'ltr' : 'rtl'">
      <span v-if="value.faxAreaCode">{{ value.faxAreaCode }} - </span>
      <span>{{ value.fax }}</span>
    </span>
    <span class="ms-2" v-if="value.faxExtension">
      {{ $t('users.extension') }} - {{ value.faxExtension }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'faxDisplay',
  props: {
    value: {required: true, type: Object, default: () => {}}
  }
}
</script>
