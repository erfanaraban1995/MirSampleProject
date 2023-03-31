const path = require('path')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  lintOnSave: false,
  filenameHashing: true,
  runtimeCompiler: true,
  devServer: {
    port: 8081
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },
  configureWebpack: () => {
    const config = {
      plugins: [new MomentLocalesPlugin({localesToKeep: ['fa']})],
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
      }
    }

    if (process.env.NODE_ENV === 'product') {
      config.resolve = {
        alias: {
          SrcConfig: path.join(__dirname, 'config/product.js')
        }
      }
    } else {
      config.resolve = {
        alias: {
          SrcConfig: path.join(__dirname, 'config/development.js')
        }
      }
    }
    return config
  }
}
