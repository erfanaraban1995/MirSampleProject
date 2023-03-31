import * as types from '@/store/types'
import {
  permissionsInfo,
  mobileDenormalize,
  isObject,
  randomNumber,
  isEmpty,
  pascalCase
} from '@/lib/util'
import Num2persian from 'num2persian'
import moment from 'moment-jalaali'

const msgOptions = {
  timeout: 3000,
  showProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  position: 'leftBottom',
  bodyMaxLength: 500,
  titleMaxLength: 100
}

const successMsgOptions = {
  timeout: 1000,
  showProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  position: 'leftBottom',
  bodyMaxLength: 500,
  titleMaxLength: 100
}

export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        $loadImage (img) {
          return this.$config.files.staticServerUrl + img
        },
        $fullName(userInfo) {
          if (!userInfo) return null
          return `${userInfo.firstName || ''} ${userInfo.lastName || ''}`
        },
        $mobile(item) {
          return mobileDenormalize(item)
        },
        $permissionsInfo(item) {
          return permissionsInfo(item)
        },
        $hasPermissions(p) {
          if (!p) return true
          else {
            const roles = this.$store.state.$account.roles
            if (!roles.length) return false
            const userAuthorities = roles
            return !!userAuthorities.find(i => i === p)
          }
      },
        $reset(callback) {
          this.$validator.pause()

          callback()
          return this.$validator.reset().then(() => {
            this.$validator.resume()
          })
        },
        $isEmpty(value) {
          return isEmpty(value)
        },
        $randomNumber(digits) {
          return randomNumber(digits)
        },
        $setBreadcrumb(items = []) {
          this.$store.commit(types.SET_BREADCRUMB, items)
        },
        $showSimple(body, title) {
          this.$snotify.warning(body, title, msgOptions)
        },
        $showSuccess(body, title) {
          this.$snotify.success(body, title, successMsgOptions)
        },
        $showError(body, title) {
          this.$snotify.error(body, title, msgOptions)
        },
        $showInfo(body, title) {
          this.$snotify.info(body, title, msgOptions)
        },
        $showWarning(body, title) {
          this.$snotify.warning(body, title, msgOptions)
        },
        $toJalali(date, format = 'jYYYY/jMM/jDD') {
          if (!date) return null
          return moment
            .utc(date, 'YYYY-MM-DDTHH:mm:ss.SSS')
            .tz(this.$config.geolocations.timeZone.text)
            .format(format)
        },
        $getText(value, items) {
          if (isEmpty(value)) return null
          const item = items.find((i) => i.value == value)
          return item && item.text
        },
        $showConfirm(id) {
          if (id) document.getElementById(`removeBtn-${id}`).blur()
          return new Promise((resolve, reject) => {
            let toast = this.$snotify.confirm(this.$t('shared.areYouSureToRemoveThisItem'), this.$t('shared.warning'), {
              backdrop: 0.5,
              position: 'centerCenter',
              buttons: [
                {
                  className: 'info text-white m-1 mt-3 mb-0',
                  text: this.$t('shared.yes'),
                  action: () => {
                    this.$snotify.remove(toast.id)
                    toast.on('hidden', () => (toast.config.backdrop = -1))
                    resolve()
                  }
                },
                {
                  className: 'danger-outline text-white m-1 mt-3 mb-0',
                  text: this.$t('shared.no'),
                  action: () => {
                    this.$snotify.remove(toast.id)
                    reject()
                  },
                  bold: true
                }
              ]
            })
          })
        },
        $confirm(
          msg = this.$t('shared.areYouSureToRemoveThisItem'),
          title = this.$t('shared.warning'),
          resolveButton = this.$t('shared.yes'),
          rejectButton = this.$t('shared.no')
        ) {
          const config = (resolve, reject) => {
            return {
              html: `<div><div><h4 class="text-danger">${title}</h4>${msg}</div></div>`,
              backdrop: 0.5,
              position: 'centerCenter',
              buttons: [
                {
                  className: 'info text-white m-1 mt-3 mb-0',
                  text: resolveButton,
                  action: (toast) => {
                    this.$snotify.remove(toast.id)
                    toast.on('hidden', () => (toast.config.backdrop = -1))
                    resolve(true)
                  }
                },
                {
                  className: 'danger-outline text-white m-1 mt-3 mb-0',
                  text: rejectButton,
                  action: (toast) => {
                    this.$snotify.remove(toast.id)
                    this.progressing = false

                    reject()
                  }
                }
              ]
            }
          }
          return new Promise((resolve, reject) => {
            this.$snotify.confirm(msg, title, config(resolve, reject))
          })
        },
        $saveConfirm(type) {
          return new Promise((resolve, reject) => {
            let btns = [
              {
                className: 'secondary',
                text: this.$t('shared.cancel'),
                action: () => {
                  this.$snotify.remove(toast.id)
                }
              },
              {
                className: 'danger',
                text: this.$t('shared.no'),
                action: () => {
                  this.$snotify.remove(toast.id)
                  reject()
                }
              },
              {
                className: 'success',
                text: this.$t('shared.save'),
                action: () => {
                  this.$snotify.remove(toast.id)
                  toast.on('hidden', () => (toast.config.backdrop = -1))
                  resolve()
                }
              }
            ]
            if (type === '2Btns') btns.shift()
            let toast = this.$snotify.confirm(this.$t('shared.doYouWantToSaveYourChanges'), this.$t('shared.warning'), {
              backdrop: 0.1,
              position: 'centerCenter',
              buttons: [...btns]
            })
          })
        },
        $getLocaleErrorMessage(err, prefix, errInfo) {
          const globalErrorCode = err.status
          const errorCode = err.data && (err.errorCode || err.data.errorCode || err.data[0].errorCode)
          const exceptionCode = err.data && err.data[0] && err.data[0].code

          if (err.status === 401 && err.data.details !== 'loginFailed') {
            const path = `/login?returnUrl=${this.$route.fullPath}`
            const isNotLoginPage = this.$route.path !== '/login'
            if (isNotLoginPage) {
              this.$router.push(path)
            }

            if (errorCode === 3004) return this.$t('account.accountLocked')
            else if (errorCode === 3000) return this.$t('account.accountSuspended')
            return this.$t('shared.unauthorized')
          }

          if (err.status === 403) {
            const path = `/login?returnUrl=${this.$route.fullPath}`
            const isNotLoginPage = this.$route.path !== '/login'
            if (isNotLoginPage) {
              this.$router.push(path)
            }
            return this.$t('errorCodes.SESSION_EXPIRED')
          }
          if (err.status === 500) {
            return this.$t('errorCodes.SERVER_ERROR')
          }
          if (prefix && this.$te(prefix + '.' + errorCode)) {
            return this.$t(prefix + '.' + errorCode, errInfo)
          }
          if (this.$te('errorCodes.' + errorCode)) {
            return this.$t('errorCodes.' + errorCode, errInfo)
          }
          if (this.$te('errorCodes.' + exceptionCode)) {
            return this.$t('errorCodes.' + exceptionCode, errInfo)
          }
          return this.$t('errorCodes.' + globalErrorCode, errInfo)
        },
        $validateAll(target = '#errors') {
          return this.$validator.validateAll().then((isValid) => {
            if (!isValid) {
              this.scrollToError(target)
            }
            return isValid
          })
        },
        $isObject(obj) {
          return isObject(obj)
        },
        $filter(search = this.search) {
          const filter = {}
          Object.keys(search).forEach((key) => {
            if (isObject(search[key])) {
              if ('not' in search[key]) {
                if (search[key].not) filter[`not${pascalCase(key)}`] = search[key].value
                else filter[key] = search[key].value
              }
              if (search[key].min) filter[`${key}Min`] = search[key].min
              if (search[key].max) filter[`${key}Max`] = search[key].max
            } else if (!this.$isEmpty(search[key])) {
              filter[key] = search[key]
            }
          })
          return filter
        },
        scrollToError(target = '#errors') {
          this.$nextTick(() => {
            const headerOffset = 60
            const errors = document.querySelector(target)
            if (errors) {
              const bodyPosition = errors.getBoundingClientRect().top
              const offsetPosition = bodyPosition + window.pageYOffset - headerOffset
              window.scrollTo({top: offsetPosition, behavior: 'smooth'})
            } else {
              alert('Errors Tag Not Found!!!!')
            }
          })
        },
        $toLetters(amount, currencyId = 'IRT') {
          if (!amount) return ''

          if (currencyId) {
            const currencyRate = this.$config.currency.rates[currencyId]
            amount = amount / currencyRate
          }
          const currency = this.$t(`currencies.${currencyId}`)
          return `${Num2persian(amount)} ${currency}`
        },
        $preSubmit(ref) {
          let validations = [this.$validateAll()]
          if (ref) {
            const refs = typeof ref === 'string' ? [ref] : ref
            refs.forEach((i) => {
              const arrayOfRefs = Array.isArray(this.$refs[i]) ? this.$refs[i] : [this.$refs[i]]
              arrayOfRefs.forEach((ch) => {
                if (ch) {
                  validations.push(ch.$validateAll())
                }
              })
            })
          }
          return Promise.all(validations).then((valid) => {
            const checkValidation = valid.every((isValid) => {
              return isValid
            })
            this.progressing = checkValidation
            return checkValidation
          })
        },
        $success(successMessage, path) {
          this.$showSuccess(this.$t(successMessage))
          this.progressing = false
          this.$goto(path)
        },
        $goto(path) {
          if (path) this.$router.push({path})
        },
        $fail(err, prefix, errInfo) {
          this.$showError(this.$getLocaleErrorMessage(err, prefix, errInfo))
          this.progressing = false
          return false
        },
        $baseCurrency() {
          return {
            id: 'IRR',
            name: this.$t(`currencies.IRR`),
            decimalPlaces: 0,
            rate: 1
          }
        },
        $displayCurrency() {
          return {
            id: 'IRR',
            name: this.$t(`currencies.IRR`),
            decimalPlaces: 0,
            rate: 1
          }
        },
        $currencies() {
          return [this.$baseCurrency(), this.$displayCurrency()]
        }
      }
    })
  }
}
