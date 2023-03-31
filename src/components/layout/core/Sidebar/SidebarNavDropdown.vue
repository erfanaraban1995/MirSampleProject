<template>
  <router-link tag="li" class="nav-item nav-dropdown" :to="url" disabled>
    <div class="nav-link nav-dropdown-toggle" @click="handleClick">
      <i :class="classIcon"><font-awesome-icon :icon="icon" /></i>
      {{$t(`nav.${name}`)}}
    </div>
    <ul class="nav-dropdown-items">
      <slot></slot>
    </ul>
  </router-link>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    classIcon () {
      return [
        'nav-icon'
      ]
    }
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      const gotoClose = e.target.parentElement.classList.contains('open')

      const brothers = [...e.target.parentElement.children] 
      brothers.forEach(brother => {
        brother.classList.remove('open')
      })
      
      const uncles = [...e.target.parentElement.parentElement.children]
      uncles.forEach(uncle => {
        uncle.classList.remove('open')
      })

      if (!gotoClose) e.target.parentElement.classList.add('open')
    }
  }
}
</script>

<style scoped lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
