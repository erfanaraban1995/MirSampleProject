<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <img class="d-block mx-auto mb-4" src="/img/500.png" />
          <div class="clearfix"
          :class="{'text-center': !code}"
          >
            <h1 v-if="code" class="float-left display-3 mr-4">{{code}}</h1>
            <p class="h4 mb-3 font-weight-bold">{{pageMessage}}</p>
            <b-button v-if="back" @click="back" size="sm" variant="primary">
              <font-awesome-icon icon="undo" class="align-middle mx-1" />
              {{$t('shared.try')}}
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page500',
  props: {
    title: {default: null},
    message: {default: null},
    back: {type: Function, default: null},
    code: {type: String, default: null}
  },
  computed: {
    pageTitle () {
      return this.title || this.$t('shared.oopsWeHaveAProblem')
    },
    pageMessage () {
      return this.message || this.$t('shared.thePageYouAreLookingForIsTemporaryUnavailable')
    }
  }
}
</script>
