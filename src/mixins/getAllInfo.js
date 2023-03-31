import * as api from '@/lib/api-info'

const infoApi = (functions = []) => {
  const mixin = {
    methods: {}
  }
  if(!Array.isArray(functions)) {
    functions = [functions]
  }
  
  functions.forEach(fn => {
    mixin.methods[fn] = api[fn]
  })
  return mixin
}

export default infoApi
