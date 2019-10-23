const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  // 基本路径
  publicPath:"./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
  outputDir:"dist",  //打包时生成的生产环境构建文件的目录
  assetsDir: 'public',  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  /*devServer: {
      proxy: 'http://localhost:8080'
  }*/
  // chainWebpack: config => {
  //   // 解决ie11兼容ES6
  //   config.entry('main').add('babel-polyfill')
  //   // 开启图片压缩
  //   config.module.rule('images')
  //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  //   .use('image-webpack-loader')
  //   .loader('image-webpack-loader')
  //   .options({ bypassOnDebug: true })
  //   // 开启js、css压缩
  //   if (process.env.NODE_ENV === 'production') {
  //     config.plugin('compressionPlugin')
  //     .use(new CompressionPlugin({
  //       test:/\.js$|\.html$|.\css/, // 匹配文件名
  //       threshold: 10240, // 对超过10k的数据压缩
  //       deleteOriginalAssets: false // 不删除源文件
  //     }))
  //   }
  // },
  // transpileDependencies: [
  //   'biyi-admin', // 指定对第三方依赖包进行babel-polyfill处理
  // ]
}