<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div>
            <img class="d-block mx-auto mb-4" src="/img/404.png" />
          </div>
          <div>
            <h1 class="display-3 text-center font-weight-bold">404</h1>
            <p class="text-muted text-center">{{$t('shared.thePageYouAreLookingForWasNotFound')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
