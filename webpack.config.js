const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './source/index.ts',
  module: {
    rules: [
      { test: /\.(js|ts)$/, use: 'babel-loader'},
      { test: /\.(scss|css)$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      { test: /\.(handlebars|hbs)$/, use: 'handlebars-loader' },
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'source'),
    },
    extensions: ['.ts', '.js', '.scss', '.css', '.hbs']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
    })
  ],
  mode: 'development'
}