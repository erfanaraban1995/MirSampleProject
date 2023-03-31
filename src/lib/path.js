import config from 'SrcConfig'

export function staticServerUrl(src) {
  return `${config.files.staticServerUrl}${src}`
}

export function thumbServerUrl(src) {
  return `${config.files.thumbServerUrl}/files/${src}`
}
