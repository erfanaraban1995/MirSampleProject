<template>
  <div class="card-header py-2 d-flex justify-content-between align-items-center">
    <div>
      {{ title ? title : $t('shared.search') }}
    </div>

    <div>
      <slot name="right"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFooter',
  props: {
    title: {type: String}
  }
}
</script>
