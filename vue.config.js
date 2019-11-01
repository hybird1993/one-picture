const CompressionPlugin = require("compression-webpack-plugin");
const UglifyPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // 基本路径
  publicPath:"./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
  outputDir: process.env.outputDir,  //打包时生成的生产环境构建文件的目录
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  assetsDir: 'public',  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  /*devServer: {
      proxy: 'http://localhost:8080'
  }*/

  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require('postcss-pxtorem')({
  //           rootValue: 16, // 换算的基数
  //           selectorBlackList: [], // 忽略转换正则匹配项
  //           propList: ['*'],
  //         }),
  //       ]
  //     }
  //   }
  // },

  configureWebpack: (config) => {   // 代码混淆
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimizer: [new UglifyPlugin({
            uglifyOptions: {
                warnings: false,
                compress: {
                  drop_console: true, 
                  drop_debugger: false,
                  pure_funcs: ['console.log'] 
                }
            }
         })]
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
    }
  },
  chainWebpack: config => {
    // 解决ie11兼容ES6
    config.entry('main').add('babel-polyfill')
    // 开启图片压缩
    // config.module.rule('images')
    // .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    // .use('image-webpack-loader')
    // .loader('image-webpack-loader')
    // .options({ bypassOnDebug: true })
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
  },
  transpileDependencies: [
    'biyi-admin', // 指定对第三方依赖包进行babel-polyfill处理
  ]
}