// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// ?version=1.0.0
import './assets/less/style.less'
import './assets/js/inspinia'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import global from './utils/global'

import echarts from 'echarts'
import jsonpreitty from 'vue-json-pretty'

import router from './router'
import store from './store'
import 'lib-flexible'
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(global)
Vue.use(jsonpreitty)

// 不现实vue 命令行的tips
Vue.config.productionTip = false
require('../mock/mock')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<router-view/>'
})
