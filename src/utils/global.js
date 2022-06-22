/*
自定义全局组件
 */
import Vue from 'vue'
import api from './api/index'
import DTable from '../components/public/DTable.vue'
import ESelect from '../components/public/ESelect.vue'
import rules from './rules'
import ECharts from 'vue-echarts/components/ECharts'
import scroll from 'vue-seamless-scroll'
import 'echarts'

Vue.use(scroll, { componentName: 'scroll-seamless' })
const errorHandler = (error, vm) => {
  console.error(vm)
  console.error(error)
}

Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.el-select-dropdown__wrap')
    selectWrap.addEventListener('scroll', function () {
      let sign = 100
      const scrollDistance =
        this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})

Vue.config.errorHandler = errorHandler
export default {
  install (Vue) {
    // 添加组件
    Vue.component('DTable', DTable)
    Vue.component('v-chart', ECharts)
    Vue.component('ESelect', ESelect)
    // 添加过滤器
    Vue.filter('stringLengths', (v, length) => {
      if (v) {
        if (v.length < length) {
          return v
        } else {
          return v.substring(0, length) + '...'
        }
      }
    })
    Vue.filter('toJson', v => {
      if (v !== '' && v != null) {
        return JSON.parse(v)
      }
    })
    Vue.filter('dateFormat', v => {
      if (v !== '' && v != null) {
        let nowtime = new Date()
        nowtime.setTime(v)
        return nowtime.Format('yyyy-MM-dd hh:mm')
      }
    })
    Vue.prototype.$throw = error => errorHandler(error, this)
    Vue.prototype.$http = api
    Vue.prototype.$rules = {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
    Vue.prototype.$newrules = rules
  }
}
