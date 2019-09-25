import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import x2js from "x2js";
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$x2js = new x2js();
console.log(Vue.prototype.$x2js);
Vue.use(ElementUI)
new Vue({
    render: h => h(App),
}).$mount('#app')