const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
        use: {
          loader: 'handlebars-loader',
          options: {
            helperDirs: path.join(__dirname, "helpers"),
            precompileOptions: {
              knownHelpersOnly: false,
            },
          },
        },
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css', '.hbs'],
    plugins: [new TsconfigPathsPlugin()]
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