const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack5-plugin");

module.exports = {
  entry: './source/index.ts',
  module: {
    rules: [
      { test: /\.(js|ts)$/, use: [{
        loader: 'babel-loader',
        options: {
          presets: [
              ['@babel/preset-typescript', { allowNamespaces: true }]
          ],
        }
      }]
      },
      { test: /\.(scss|css)$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      { 
        test: /\.(handlebars|hbs)$/, 
        loader: 'handlebars-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css', '.hbs'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "./source/serviceWorker.ts"),
    }),
    new HtmlWebpackPlugin({
        template: './public/index.html',
    })
  ],
  mode: 'development',

  devServer: {
    historyApiFallback: true,
    static:[
      path.resolve(__dirname, './dist'), path.resolve(__dirname, './public'),
    ],
    compress: true,
    hot: true,
    port: 8001,
  }
}