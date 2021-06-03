const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  publicPath: '',
  pages: {
    popup: {
      entry: 'src/pages/popup/main.js',
      template: 'public/index.html',
      filename: 'popup.html',
      title: '书签同步助手',
      chunks: ['chunk-vendors', 'chunk-common', 'popup']  // 'chunk-vendors', 'chunk-common' 是公用资源文件
    },
    options: {
      entry: 'src/pages/options/main.js',
      template: 'public/index.html',
      filename: 'options.html',
      title: '书签同步助手配置页',
      chunks: ['chunk-vendors', 'chunk-common', 'options']
    }
  }
}
