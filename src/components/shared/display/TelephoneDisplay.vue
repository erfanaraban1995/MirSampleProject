<template>
  <span v-if="value">
    <span :dir="$dir.rtl ? 'ltr' : 'rtl'">
      <span v-if="value.telephoneAreaCode">{{ value.telephoneAreaCode }} - </span>
      <span>{{ value.telephone }}</span>
    </span>
    <span class="ms-2" v-if="value.telephoneExtension">
      {{ $t('users.extension') }} - {{ value.telephoneExtension }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'telephoneDisplay',
  props: {
    value: {required: true, type: Object, default: () => {}}
  }
}
</script>
