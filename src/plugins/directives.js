import {convertNumbers2English} from '@/lib/util'

export default {
  install(Vue) {
    Vue.directive('outSideClick', {
      bind: function(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          // here I check that click was outside the el and his children
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind: function(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    })
    Vue.directive('numeric', {
      bind(el, binding, vnode) {
        if(binding.value && binding.value.disable) return
        el.setAttribute('dir', 'ltr')
        const {modifiers} = binding
        let regex
        if (modifiers.mobile) regex = /[^\d\+]/g
        else if (modifiers.special) regex = /[^\d./-]/g
        else regex = /[^\d]/g
        let value = String(el.value)
        value = convertNumbers2English(value)
        value = value && value.replace(regex, '')
        if (el.value !== value) {
          el.value = value
          const e = new Event('change', {bubbles: true, cancelable: true})
          el.dispatchEvent(e)
        }
      },
      componentUpdated(el, binding, vnode) {
        if(binding.value && binding.value.disable) return
        const {modifiers} = binding
        let regex
        if (modifiers.mobile) regex = /[^\d\+]/g
        else if (modifiers.special) regex = /[^\d./-]/g
        else regex = /[^\d]/g
        let value = String(el.value)
        value = convertNumbers2English(value)
        value = value && value.replace(regex, '')
        if (el.value !== value) {
          el.value = value
          const e = new Event('change', {bubbles: true, cancelable: true})
          el.dispatchEvent(e)
        }
      }
    })

    Vue.directive('alphabetic', {
      bind(el, binding, vnode) {
        const regex = /[\p{N}]/gu
        const handler = function(e) {
          let value = String(el.value)
          if (value) {
            value = value.replace(regex, '')
            e.target.value = value
            vnode.elm.dispatchEvent(new CustomEvent('change'))
          }
        }
        el.addEventListener('input', handler)
      }
    })
  }
}
