<script>
import {Validator} from 'vee-validate'
import {clockToMinute} from '@/lib/util'
export default {
  name: 'CustomRules',
  created() {
    this.__addCustomRules(this.$dir.rtl ? 'fa-ir' : '')
  },
  computed: {
    passwordConfig() {
      const self = this
      const passSetting = this.$store.state.$settings.identitySettings.password
      return {
        rule: {
          min: {
            value: +passSetting.requiredLength,
            text: self.$t('validations.password.min', {count: passSetting.requiredLength}),
            isMatch(value) {
              const regex = new RegExp(`^.{${this.value},}$`)
              return regex.test(value)
            }
          },
          max: {
            value: +passSetting.maxLength,
            text: self.$t('validations.password.max', {count: passSetting.maxLength}),
            isMatch(value) {
              const regex = new RegExp(`^.{0,${this.value + 1}}$`)
              return regex.test(value)
            }
          },
          nonAlphaNumeric: {
            value: passSetting.requireNonAlphaNumeric,
            text: self.$t('validations.password.nonAlphaNumeric'),
            isMatch(value) {
              const regex = new RegExp('[^A-Za-z0-9]')
              return regex.test(value)
            }
          },
          lowercase: {
            value: passSetting.requireLowercase,
            text: self.$t('validations.password.lowercase'),
            isMatch(value) {
              const regex = new RegExp('[a-z]')
              return regex.test(value)
            }
          },
          uppercase: {
            value: passSetting.requireUppercase,
            text: self.$t('validations.password.uppercase'),
            isMatch(value) {
              const regex = new RegExp('[A-Z]')
              return regex.test(value)
            }
          },
          digit: {
            value: passSetting.requireDigit,
            text: self.$t('validations.password.digit'),
            isMatch(value) {
              const regex = new RegExp('[0-9]')
              return regex.test(value)
            }
          },
          minUniqueChars: {
            value: passSetting.requiredUniqueChars,
            text: self.$t('validations.password.minUniqueChars', {count: passSetting.requiredUniqueChars}),
            isMatch(value) {
              const uniqeChars = String.prototype.concat(...new Set(value))
              const regex = new RegExp(`^.{${this.value},}$`)
              return regex.test(uniqeChars)
            }
          }
        },
        message(name) {
          const rulesText = Object.keys(this.rule)
            .filter((ruleKey) => this.rule[ruleKey].value)
            .map((ruleKey) => this.rule[ruleKey].text)
            .join('، ')
          return self.$t('validations.password.text', {name, rules: rulesText})
        },
        validate(value) {
          return Object.keys(this.rule)
            .filter((ruleKey) => this.rule[ruleKey].value)
            .every((ruleKey) => {
              return this.rule[ruleKey].isMatch(value)
            })
        }
      }
    }
  },
  methods: {
    __proceed(val, e) {
      let proceed = true
      if (!val) proceed = false
      if (Array.isArray(e)) {
        e.forEach((item) => {
          if (item == 'null') proceed = false
        })
      } else if (!e) proceed = false

      return proceed
    },
    __addCustomRules(locale) {
      Validator.extend('exact_length', {
        getMessage: (name, e) => {
          const length = e.length > 1 ? e.join(' یا ') : e[0]
          return this.$t('validations.exactLength', {name, length})
        },
        validate: (value, e) => {
          return e.some((i) => value.length == i)
        }
      })

      Validator.extend('min_date', {
        getMessage: (name, e) => {
          const min = new Date(`${e}Z`).toLocaleDateString(locale)
          return this.$t('validations.minDate', {name, min})
        },
        validate: (value, e) => {
          if (!this.__proceed(value, e)) return true
          const val = new Date(`${value}Z`)
          const min = new Date(`${e}Z`)

          if (isNaN(val.getTime()) || isNaN(min.getTime())) {
            return false
          }
          return val > min
        }
      })

      Validator.extend('date_less_than', {
        getMessage: (name, e) => {
          const min = new Date(`${e}Z`).toLocaleDateString(locale)
          return this.$t('validations.dateLessThan', {name, min})
        },
        validate: (value, e) => {
          if (!this.__proceed(value, e)) return true
          const val = new Date(`${value}Z`)
          const min = new Date(`${e}Z`)

          if (isNaN(val.getTime()) || isNaN(min.getTime())) {
            return false
          }
          return val >= min
        }
      })

      Validator.extend('max_date', {
        getMessage: (name, e) => {
          const min = new Date(`${e}Z`).toLocaleDateString(locale)
          return this.$t('validations.maxDate', {name, min})
        },
        validate: (value, e) => {
          if (!this.__proceed(value, e)) return true
          const val = new Date(`${value}Z`)
          const max = new Date(`${e}Z`)

          if (isNaN(val.getTime()) || isNaN(max.getTime())) {
            return false
          }
          return val < max
        }
      })

      Validator.extend('date_bigger_than', {
        getMessage: (name, e) => {
          const min = new Date(`${e}Z`).toLocaleDateString(locale)
          return this.$t('validations.dateBiggerThan', {name, min})
        },
        validate: (value, e) => {
          if (!this.__proceed(value, e)) return true
          const val = new Date(`${value}Z`)
          const max = new Date(`${e}Z`)

          if (isNaN(val.getTime()) || isNaN(max.getTime())) {
            return false
          }
          return val <= max
        }
      })

      this.$validator.extend('password', {
        getMessage: (name, ref) => this.passwordConfig.message(name, ref),
        validate: (value) => {
          return this.passwordConfig.validate(value)
        }
      })

      Validator.extend('between_date', {
        getMessage: (name, e) => {
          const min = new Date(`${e[0]}Z`).toLocaleString(locale).replace('،', ' ساعت')
          const max = new Date(`${e[1]}Z`).toLocaleString(locale).replace('،', ' ساعت')
          const infinite = new Date('2900-01-01T00:00:00Z')

          if (new Date(`${e[1]}Z`) > infinite) {
            return this.$t('validations.minDate', {name, min})
          }
          return this.$t('validations.betweenDate', {name, min, max})
        },
        validate: (value, e) => {
          if (!this.__proceed(value, e)) return true
          const val = new Date(`${value}Z`)
          const min = new Date(`${e[0]}Z`)
          const max = new Date(`${e[1]}Z`)

          if (isNaN(val.getTime()) || isNaN(max.getTime())) {
            alert(`${value}Z and ${e}Z are invalid date`)
            return false
          }
          return val >= min && val <= max
        }
      })

      Validator.extend('equal_amount', {
        getMessage: (name, e) => {
          const rate = this.$displayCurrency().rate
          let amount = e[0] / rate
          amount = amount.toLocaleString()
          const currency = this.$displayCurrency().name
          return this.$t('validations.equalAmount', {name, amount, currency})
        },
        validate: (value, e) => {
          if (this.$isEmpty(e[0])) return true

          return +e[0] === +value
        }
      })

      Validator.extend('min_amount', {
        getMessage: (name, e) => {
          const rate = this.$displayCurrency().rate
          let amount = e[0] / rate
          amount = amount.toLocaleString()
          const currency = this.$displayCurrency().name
          return this.$t('validations.minAmount', {name, min: amount, currency})
        },
        validate: (value, e) => {
          if (e[0] === null) return true
          return value >= e[0]
        }
      })

      Validator.extend('min_time', {
        getMessage: (name, ref) => this.$t('validations.minTime', {min: ref, name}),
        validate: (value, ref) => {
          ref = ref[0]
          if (ref && value) {
            let valueInMinutes = clockToMinute(value)
            let refInMinutes = clockToMinute(ref)
            return valueInMinutes > refInMinutes
          }
          return true
        }
      })

      Validator.extend('url_check', {
        getMessage: (name) => this.$t('validations.urlCheck', {name}),
        validate: (value) => {
          return (
            value.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/) !== null ||
            value.match(/^(\/[a-zA-Z-0-9-\u0621-\u064A\u0660-\u0669۰-۹_%آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی-]+)+$/gim) !==
              null
          )
        }
      })

      Validator.extend('url_public', {
        getMessage: (name) => this.$t('validations.urlFailed', {name}),
        validate: (value) => {
          return value.match(/^(https:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.(com){1}/) !== null
        }
      })

      Validator.extend('url_panel', {
        getMessage: (name) => this.$t('validations.urlFailed', {name}),
        validate: (value) => {
          return value.match(/^(https:\/\/)[a-zA-Z0-9\.\-]+\.(com){1}/) !== null
        }
      })

      Validator.extend('max_time', {
        getMessage: (name, ref) => this.$t('validations.maxTime', {max: ref, name}),
        validate: (value, ref) => {
          ref = ref[0]
          if (ref && value) {
            let valueInMinutes = clockToMinute(value)
            let refInMinutes = clockToMinute(ref)
            return valueInMinutes < refInMinutes
          }
          return true
        }
      })

      Validator.extend('between_time', {
        getMessage: (name, ref) => this.$t('validations.betweenTime', {min: ref[0], max: ref[1], name}),
        validate: (value, ref) => {
          const minRef = ref[0]
          const maxRef = ref[1]
          if (minRef && maxRef && value) {
            let valueInMinutes = clockToMinute(value)
            let refInMinutes = clockToMinute(ref)
            return valueInMinutes <= refInMinutes
          }
          return true
        }
      })

      Validator.extend('max_amount', {
        getMessage: (name, e) => {
          const rate = this.$displayCurrency().rate
          let amount = e[0] / rate
          amount = amount.toLocaleString()
          const currency = this.$displayCurrency().name
          return this.$t('validations.maxAmount', {name, max: amount, currency})
        },
        validate: (value, e) => {
          if (e[0] === null) return true
          return value <= e[0]
        }
      })

      Validator.extend('min_val', {
        getMessage: (name, e) => {
          let amount = e[0]
          amount = amount.toLocaleString()
          return this.$t('validations.minVal', {name, min: amount})
        },
        validate: (value, e) => {
          if (e[0] === null) return true
          return +value >= +e[0]
        }
      })

      Validator.extend('max_val', {
        getMessage: (name, e) => {
          let amount = e[0]
          amount = amount.toLocaleString()
          return this.$t('validations.maxVal', {name, max: amount})
        },
        validate: (value, e) => {
          if (e[0] === null) return true
          return +value <= +e[0]
        }
      })

      Validator.extend('Between', {
        getMessage: (name, e) => this.$t('validations.Between', {name, min: e[0], max: e[1]}),
        validate: (value, e) => {
          return Number(e[0]) <= value && Number(e[1]) >= value
        }
      })

      Validator.extend('excluded', {
        getMessage: (name, ref) => this.$t('validations.mustBeExclude', {ref: ref.join(', '), name}),
        validate: (value, ref) => {
          const target = ref.find((i) => i == value)
          return !target
        }
      })

      Validator.extend('mobile', {
        getMessage: (name) => this.$t('validations.isInvalid', {name}),
        validate: (value) => {
          const rule =
            (value.length === 11 && value.startsWith('09')) ||
            (value.length === 10 && value.startsWith('9')) ||
            (value.length === 14 && value.startsWith('0098')) ||
            (value.length === 13 && value.startsWith('+98'))

          if (rule) return true
          return false
        }
      })

      Validator.extend('min_decimal', {
        getMessage: (name, e) => this.$t('validations.minDecimal', {decimal: e, name}),
        validate: (value, e) => {
          if (!value) return true
          value = String(value)
          let n = value.split('.')

          if (n.length < 2) return false
          return n[1].length >= e[0]
        }
      })

      Validator.extend('max_character', {
        getMessage: (name, e) => this.$t('validations.max', {maxLength: e[0]}),
        validate: (value, e) => {
          return value.length <= e[0]
        }
      })

      Validator.extend('min_character', {
        getMessage: (name, e) => this.$t('validations.min', {minLength: e[0]}),
        validate: (value, e) => {
          return value.length >= e[0]
        }
      })

      Validator.extend('between_character', {
        getMessage: (name, e) => n + ' ' + this.$t('validations.betweenCharacter', {min: e[0], max: e[1]}),
        validate: (value, e) => {
          return +value.length <= +e[1] && +value.length >= +e[0]
        }
      })

      Validator.extend('unique_chars', {
        getMessage: (name, e) => this.$t('validations.uniqueChars', {uniqeChars: e[0], name}),
        validate: (value, e) => {
          var unique = ''
          for (var i = 0; i < value.length; i++) {
            if (unique.indexOf(value.charAt(i)) < 0) {
              unique += value.charAt(i)
            }
          }
          if (e[0]) return unique.length > e[0]
          else return true
        }
      })

      Validator.extend('bigger_than', {
        getMessage: (name, e) => this.$t('validations.biggerThan', {number: e, name}),
        validate: (value, e) => {
          return +e[0] < value
        }
      })

      Validator.extend('less_than', {
        getMessage: (name, e) => this.$t('validations.lessThan', {number: e, name}),
        validate: (value, e) => {
          return +e[0] > value
        }
      })

      Validator.extend('max_decimal', {
        getMessage: (name, e) => this.$t('validations.maxDecimal', {decimal: e, name}),
        validate: (value, e) => {
          if (e === false) {
            return true
          }
          let n = value.split('.')
          if (n.length < 2) return true
          return n[1].length <= e
        }
      })

      Validator.extend('duplicate', {
        getMessage: (name) =>  this.$t('validations.isDuplicate',{name}),
        validate: (value, e) => {
          const n = e.filter((i) => i == value)
          return n.length < 2
        }
      })

      Validator.extend('not_include_item', {
        getMessage: (name, e) => this.$t('validations.notIncludeItem',{name}),
        validate: (value, e) => {
          return !value.some((item) => e.includes(item))
        }
      })

      Validator.extend('national_id', {
        getMessage: (name) =>  this.$t('validations.notValid',{name}),
        validate: (value) => {
          const rule =
            !/^\d{10}$/.test(value) ||
            value == '0000000000' ||
            value == '1111111111' ||
            value == '2222222222' ||
            value == '3333333333' ||
            value == '4444444444' ||
            value == '5555555555' ||
            value == '6666666666' ||
            value == '7777777777' ||
            value == '8888888888' ||
            value == '9999999999'

          if (rule) return false
          const check = parseInt(value[9])
          let sum = 0
          let i
          for (i = 0; i < 9; ++i) {
            sum += parseInt(value[i]) * (10 - i)
          }
          sum %= 11
          return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11)
        }
      })

      Validator.extend('en_char', {
        getMessage: (name) =>  this.$t('validations.enChar',{name}),
        validate: (value) => {
          return value.match(/^[a-zA-Z]+[ a-zA-Z0-9]*$/) !== null
        }
      })

      Validator.extend('fa_char', {
        getMessage: (name) =>  this.$t('validations.faChar',{name}),
        validate: (value) => {
          return value.match(/^[\u0600-\u06FF\s]+$/) !== null
        }
      })

      Validator.extend('telephone', {
        getMessage: (name) => this.$t('validations.isInvalid', {name}),
        validate: (value) => {
          value = String(value)
          return value.match(/^\+?[0-9]{1,8}$/) !== null
        }
      })

      Validator.extend('phone_number', {
        getMessage: (name) =>  this.$t('validations.notValid',{name}),
        validate: (value) => {
          value = String(value)
          return value.match(/^[1-9]{1}[0-9]{7}$/) !== null
        }
      })

      Validator.extend('area_code', {
        getMessage: (name) => this.$t('validations.isInvalid', {name}),
        validate: (value) => {
          value = String(value)
          return value.match(/(^[0]{1}[1-9]{2}$)/) !== null
        }
      })

      Validator.extend('fax', {
        getMessage: (name) => this.$t('validations.isInvalid', {name}),
        validate: (value) => {
          value = String(value)
          return value.match(/^\+?[0-9]{1,11}$/) !== null
        }
      })

      Validator.extend('en_char_number', {
        getMessage: (name) =>  this.$t('validations.enNumChar',{name}),
        validate: (value) => {
          return value.match(/^[A-Za-z\d]+$/) !== null
        }
      })

      Validator.extend('zip_code', {
        getMessage: (name) =>  this.$t('validations.notValid',{name}),
        validate: (value) => {
          if (!value) return true
          return value.toString().match(/\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/) !== null
        }
      })

      Validator.extend('en_upper_char', {
        getMessage: (name) =>  this.$t('validations.enUpperChar',{name}),
        validate: (value) => {
          return value.match(/^[A-Z]+$/) !== null
        }
      })

      Validator.extend('uppercase', {
        getMessage: () => this.$t('validations.uppercase'),
        validate: (value) => {
          return value.match(/[A-Z]/g) !== null
        }
      })

      Validator.extend('map_required', {
        getMessage: (name) => this.$t('validations.required', {name}),
        validate: (value) => {
          if (typeof value === 'object') {
            return Boolean(value.lat && value.lng)
          }
          return false
        }
      })

      Validator.extend('middle_required', {
        getMessage: (name) => this.$t('validations.required', {name}),
        validate: (value) => {
          if (typeof value === 'object') {
            return Boolean(value.min && value.max)
          }
          return false
        }
      })

      Validator.extend('digit', {
        getMessage: (name) =>  this.$t('validations.digit',{name}),
        validate: (value) => {
          return value.match(/[0-9]/g) !== null
        }
      })

      Validator.extend('non_alpha_numeric', {
        getMessage: () => this.$t('validations.nonAlphaNumeric'),
        validate: (value) => {
          return value.match(/[^a-zA-Z\d\s:]/g) !== null
        }
      })

      Validator.extend('lowercase', {
        getMessage: () => this.$t('validations.lowercase'),
        validate: (value) => {
          return value.match(/[a-z]/g) !== null
        }
      })
    }
  }
}
</script>
