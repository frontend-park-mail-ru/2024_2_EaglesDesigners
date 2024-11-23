const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack5-plugin");

module.exports = {
    entry: {
        index: './source/index.ts',
        csat: './source/csat.ts' // Добавляем новый входной файл
    },
    module: {
        rules: [
            { 
                test: /\.(js|ts)$/, 
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-typescript', { allowNamespaces: true }]
                        ],
                    }
                }]
            },
            { test: /\.(scss|css)$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
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
        filename: '[name]_bundle.js' // Используем имя входного файла
    },
    plugins: [
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, "./source/serviceWorker.ts"),
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', // Основной HTML файл
            chunks: ['index'], // Указываем, что этот HTML файл использует только основной вход
        }),
        new HtmlWebpackPlugin({
            template: './public/csat.html', // Шаблон для csat.html
            filename: 'csat.html', // Имя выходного HTML файла
            chunks: ['csat'], // Указываем, что этот HTML файл использует csat.ts
        })
    ],
    mode: 'development',

    devServer: {
        historyApiFallback: true,
        static: [
            path.resolve(__dirname, './dist'), 
            path.resolve(__dirname, './public'), 
            path.resolve(__dirname, './source'),
        ],
        compress: true,
        hot: true,
        port: 8001,
    }
}