const path = require('path');

module.exports = {
    port: 9011,
    root: 'dist',
    stat: false,
    webpack: {
        console: true,
        publicPath: '/',
        output: {
            './index.html': {
                entry: './src/app'
            }
        },
        alias: {
            model: './src/js/model/',
            js: './src/js/',
            components: './src/components/'
        },
        global: {
            Utils: [
                path.resolve(__dirname, 'src/js/common/utils'),
                'default'
            ],
            Manba: 'manba',
            HeyUI: 'heyui',
            Model: 'js-model',
            G: 'hey-global',
            log: 'hey-log',
            R: [
                path.resolve(__dirname, 'src/js/common/request'),
                'default'
            ]
        },
        devServer: {
            proxy: {
                // 此处应该配置为开发服务器的后台地址
                // '/oa': {
                // target: 'http://192.168.1.53:8085',
                // // pathRewrite: {'^/oa': ''},
                // // changeOrigin: true,
                // // secure: true
                // }
                '/oa': {
                    target: 'https://oa.zzhykw.com',
                    // pathRewrite: { '^/oa': '' },
                    // changeOrigin: true,
                    // secure: true
                }
            },
            historyApiFallback: true
        },
        globalVars: './src/css/var.less',
        externals: {}
    },
    copy: ['static/images/*', 'call/*', './baidu_verify_7O2vpVMzwg.html']
};
