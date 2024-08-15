'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '' // page title

// 如果您的端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac: sudo npm运行
// 您可以通过以下方法更改端口:
// 端口= 9527 npm运行开发或npm运行开发-端口= 9527
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * 如果您计划在子路径下部署站点，则需要设置publicPath，
     * 例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/,
     * 那么publicPath应该设置为“/bar/”。
     * 大多数情况下请使用“/”!！！
     * 细节:https://cli.vuejs.org/config/#publicpath
     */
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            // 配置跨域
            '/api': {
                target: process.env.VUE_APP_BASE_URL + process.env.VUE_APP_BASE_URL_ADMIN_PORT,
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        },
    },
    configureWebpack: {
        // 在webpack的名称字段中提供应用程序的标题，以便
        // 它可以在index.html访问，以注入正确的标题。
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        // 它可以提高第一屏的速度，建议打开预载
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                // 忽略runtime.js
                // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial'
            }
        ])

        // 页面多的时候会造成太多无意义的请求
        config.plugins.delete('prefetch')

        // SVG sprite载入器集
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // “runtime”必须与runtimeChunk名称相同。默认为“运行时”
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // 仅打包最初依赖的第三方
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // 将元素拆分到单个包中
                                priority: 20, // 权重需要大于libs和app，否则将被打包到libs或app中
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: resolve('src/components'), // 可以自定义您的规则
                                minChunks: 3, //  最小公约数
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    })
                    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
