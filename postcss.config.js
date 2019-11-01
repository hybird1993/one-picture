module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 12,    // 根元素字体大小  html节点的font-size大小
      unitPrecision: 5,    // 转rem精确到小数点后多少位
      propList: ['*'],    // 可以从px更改为rem的属性  支持 * font  font-size line-height等
      selectorBlackList: [],   // str/reg   要忽略的选择器并保留为px
      replace: true,
      mediaQuery: false,   // 媒体查询内的px是否转换
      minPixelValue: 0    // 小于指定数值的px不转换
    }
  }
}
