<template>
  <div class="animated fadeIn">
    <div v-for="item in $store.state.$account.roles" :key="item">
      <div>
        {{ item }}
      </div>
    </div>
  </div>
</template>
