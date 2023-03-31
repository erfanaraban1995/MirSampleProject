  import isEqual from 'lodash/isEqual'
  import isEmpty from 'lodash/isEmpty'
  import differenceWith from 'lodash/differenceWith'

  const saveConfirm = (type) => ({
    beforeRouteLeave (to, from, next) {
      if (typeof(this.$orginal) === 'undefined' && typeof(this.$saving) === 'undefined') {
        alert('$saving and $orginal must be defined')
      }
      else {
        if (isEmpty(differenceWith(this.$orginal, this.$saving, isEqual)) ) {
          next()
        }
        else {
          this.$saveConfirm(type).then(() => {
            this.submit().then(() => next())
          }).catch(() => next())
        }
      }
    }
  })

  export {saveConfirm}