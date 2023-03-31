import extend from './extend'

let config = {
  locale: 'en',
  environment: 'development',
  auth: {
    resetPasswordIsEnabled: true,
  },
  files: {
    staticServer: 'regymi.com/files/',
    thumbsAreEnabled: true,
    thumbServer: '192.168.7.10:801/unsafe',
    noImageUrl: 'http://localhost:8080/img/no-image.png',
    watermarkUrl: 'http://localhost:8080/img/watermark.png'
  },
  rootUserName: '0000',
  apiServer: 'api.regymi.com', //erfan
  ssl: true
}

config = extend(config)
export default config
