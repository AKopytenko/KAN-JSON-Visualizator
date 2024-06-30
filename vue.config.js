module.exports = {

    publicPath: process.env.NODE_ENV === 'production'
        ? '/demo/kjv'
        : '/',

    pages: {

        index: {

            entry: 'src/main.js',

            template: 'public/index.html',

            filename: 'index.html',

            title: 'KAN JSON Visualizator',

            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    // Отключаем создание файлов .map для сборки production
    productionSourceMap: process.env.NODE_ENV != 'production'
}
