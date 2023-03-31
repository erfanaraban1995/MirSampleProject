import Num2persian from 'num2persian'
import moment from 'moment-jalaali'
import 'moment-timezone'
import config from 'SrcConfig'
import store from '@/store'
/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find(list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key))
}

export function pascalCase(val) {
  return val[0].toUpperCase() + val.slice(1)
}

export function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}

export function isPromise(val) {
  return val && typeof val.then === 'function'
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

export function serialize(obj) {
  return Object.keys(obj)
    .reduce(function(a, k) {
      let val = obj[k]
      if (val !== null && typeof val === 'object') {
        val = JSON.stringify(val)
      }
      a.push(k + '=' + encodeURIComponent(val))
      return a
    }, [])
    .join('&')
}

export function isFunction(value) {
  if (!value) return false
  const isFunctionType = typeof value === 'function'
  const isFunctionPrototype = Object.prototype.toString.call(value) === '[object Function]'
  return isFunctionPrototype || isFunctionType || value instanceof Function
}

export function isEmpty(value) {
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  return value == null || value.length === 0
}

export function searchByFilter(items = [], filter = {}) {
  return items.filter((item) => {
    return Object.keys(filter).some((key) => {
      if (isEmpty(filter[key])) {
        return true
      } else if (isEmpty(item[key])) {
        return false
      } else {
        return String(item[key]).includes(String(filter[key]))
      }
    })
  })
}

export function humanize(time) {
  if (time === 0) return 0
  if (!time) return null

  return time
    .split(':')
    .slice(0, 2)
    .join(':')
}

export function randomNumber(digits = 8) {
  return Math.floor(Math.random() * Math.pow(10, digits) + 1)
}
export function mobileNormalize(mobile) {
  if (!mobile) return null
  else if (mobile.startsWith('+98')) {
    return mobile
  } else if (mobile.startsWith('0098')) {
    return `+${mobile.substr(2)}`
  } else if (mobile.startsWith('0')) {
    return `+98${mobile.substring(1)}`
  } else if (mobile.startsWith('9')) {
    return `+98${mobile}`
  } else return mobile
}

export function mobileDenormalize(mobile) {
  if (!mobile) return null
  else if (mobile.startsWith('+98')) {
    return `0${mobile.substr(3)}`
  } else if (mobile.startsWith('0098')) {
    return `0${mobile.substr(4)}`
  } else if (mobile.startsWith('0')) {
    return mobile
  } else if (mobile.startsWith('9')) {
    return `0${mobile}`
  } else return mobile
}

export function timeNormalize(hour) {
  if (!hour) return ''
  else if (hour.match(/^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$/)) {
    const h = hour.split(':')
    return h[0] + ':' + h[1]
  } else {
    return hour
  }
}

export function gotoDate(date, {offset = 0, endOfDay = false} = {}) {
  let m = moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSS')
  m = m.tz(config.geolocations.timeZone.text)
  if (endOfDay) {
    m = m.endOf('day')
  }
  m = m.add(offset, 'day').utc()
  return m.toISOString().replace('.000Z', '')
}

export function previousDay(date, day = -1) {
  let m = moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSS')
  m.add(5, 'h')
  m = m.tz(config.geolocations.timeZone.text)
  return m
    .add(day, 'day')
    .utc()
    .add(-5, 'h')
    .toISOString()
    .replace('.000Z', '')
}
export function nextDay(date, day = 1) {
  let m = moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSS')
  m.add(5, 'h')
  m = m.tz(config.geolocations.timeZone.text)
  return m
    .add(day, 'day')
    .utc()
    .add(-5, 'h')
    .toISOString()
    .replace('.000Z', '')
}

export function endOfDay(date) {
  return moment
    .utc(date)
    .tz(config.geolocations.timeZone.text)
    .endOf('day')
    .toISOString()
    .replace('Z', '')
}

export function setToday(options) {
  let m

  if (options) {
    m = moment()
      .tz(config.geolocations.timeZone.text)
      .startOf('day')
    if (options.endOfDay) {
      m = moment()
        .tz(config.geolocations.timeZone.text)
        .endOf('day')
    }
    if (options.offset) {
      m.add(options.offset, 'day')
    }
    return m.toISOString().replace('.000Z', '')
  } else {
    m = moment()
      .tz(config.geolocations.timeZone.text)
      .startOf('day')
    return m.toISOString().replace('.000Z', '')
  }
}

export function nowDateTime() {
  return moment()
    .toISOString()
    .replace('.000Z', '')
}

export function isAfterNow(date) {
  const now = moment.utc()
  const targetDate = moment.utc(date)
  return moment(targetDate).isAfter(now)
}

export function hasPermission(namespaces, permissions = store.state.$account && store.state.$account.permissions) {
  if (!permissions) return false

  let nss = namespaces
  if (!Array.isArray(namespaces)) {
    nss = [namespaces]
  }
  return nss.find((ns) => permissions.find((p) => p === ns || p.startsWith(ns + '.')))
}

export function convertNumbers2English(str) {
  if (!str) return null
  return str.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function(c) {
    return c.charCodeAt(0) & 0xf
  })
}

export function clockToMinute(clock) {
  let [hours, minutes] = clock.split(':')
  hours = convertNumbers2English(hours)
  minutes = convertNumbers2English(minutes)

  hours = isNaN(+hours) ? 0 : +hours
  minutes = isNaN(+minutes) ? 0 : +minutes
  const clockInMinutes = hours * 60 + minutes
  return clockInMinutes
}

export function numToPersian(amount, currencyId) {
  if (isEmpty(amount)) return ''
  else {
    if (currencyId) {
      return Num2persian(amount / config.currency.rates[currencyId])
    } else {
      return Num2persian(amount)
    }
  }
}

export function print(el = '#print_page') {
  const head = document.getElementsByTagName('head')[0].innerHTML
  const content = document.querySelector(el).innerHTML
  const mywindow = window.open('', '_blank')

  mywindow.document.write(`
    <html dir="rtl" lang="fa-ir"><head> ${head}
    <style>
    @page {
      @bottom-left {
        content: counter(page) ' of ' counter(pages);
      }
    }

    .border-0 th {
      border: none !important
    }

    table { page-break-inside:auto }
    tr    { page-break-inside:avoid; page-break-after:auto }
    thead { display:table-header-group }
    tfoot { display:table-footer-group }

    @media print {
      svg {
        display: none !important;
      }
    }
    </style>
  `)
  mywindow.document.write('</head><body class="bg-white" ><div class="p-2">')
  mywindow.document.write(content)
  mywindow.document.write('</div></body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/
  setTimeout(() => {
    mywindow.print()
  }, 1000)

  setTimeout(() => {
    mywindow.close()
  }, 1500)
}
