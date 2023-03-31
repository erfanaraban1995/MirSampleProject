<template>
  <div class="progress-backdrop d-flex justify-content-center align-items-center animated fadeIn">
    <b-spinner small type="grow" label="Spinning" variant="primary" class="spinner"></b-spinner>
    <b-spinner small type="grow" label="Spinning" variant="primary" class="spinner mx-2"></b-spinner>
    <b-spinner small type="grow" label="Spinning" variant="primary" class="spinner"></b-spinner>
  </div>
</template>

<script>
export default {
  name:'Loading'
}
</script>

<style lang="scss">
.progress-backdrop {
  background-color: rgba(255, 255, 255, 0.75);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1100;
  .spinner {
    width: 3rem;
    height: 3rem;
  }
}
</style>