const VueLoader = require('vue-loader/lib/plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    devServer: {
        index: 'index.html'
    },
    plugins: [
        VueLoader()
    ]
}
