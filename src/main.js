// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import App from './App'
import router from './router'
import http from '@/plugins/http.js'
import moment from 'moment'
import Mybread from '@/components/common/mybread.vue'

Vue.use(ElementUI)
Vue.use(http)
Vue.component(Mybread.name, Mybread)

Vue.config.productionTip = false

// 全局过滤器，格式化日期

Vue.filter('format_data', (v, formatString) => {
  return moment(v).format(formatString)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
