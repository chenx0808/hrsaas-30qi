import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Comments from '@/components/index'
Vue.use(Comments)

import print from 'vue-print-nb'
Vue.use(print)
import i18n from '@/utils/lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 时间过滤器
import * as filters from '@/filters/index.js'
// 所有的过滤器 进行全局注册
for (const key in filters) {
  Vue.filter(key, filters[key])
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 一次性注册所有指令
import * as directives from '@/directives/index'

// console.log(directives)

for (const key in directives) {
  // 注册指令
  Vue.directive(key, directives[key])
}
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
