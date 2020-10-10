import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import i18n from '@/i18n'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import Clipboard from 'clipboard'

import filters from '@/utils/filters'
import router from './router'
import VueAnalytics from 'vue-analytics'
import katex from '@/plugins/katex'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Panel from './components/Panel.vue'
import IconBtn from './components/btn/IconBtn.vue'
import Save from './components/btn/Save.vue'
import Cancel from './components/btn/Cancel.vue'
import VueWorker from 'vue-worker'
import './style.less'
import './permission'
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.component(IconBtn.name, IconBtn)
Vue.component(Panel.name, Panel)
Vue.component(Save.name, Save)
Vue.component(Cancel.name, Cancel)

if (process.env.NODE_ENV === 'development') {
  Vue.use(VueWorker)
  Vue.use(iView)
  Vue.use(Element, { locale })
  Vue.use(katex)
  Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
  })
} else {
  Vue.use(VueAnalytics, {
    id: process.env.GA,
    disableScriptLoader: true,
    router,
    autoTracking: {
      pageviewOnLoad: false
    }
  })
}

Vue.prototype.Clipboard = Clipboard

Vue.prototype.$error = (msg) => {
  Vue.prototype.$message({ 'message': msg, 'type': 'error' })
}

Vue.prototype.$warning = (msg) => {
  Vue.prototype.$message({ 'message': msg, 'type': 'warning' })
}

Vue.prototype.$success = (msg) => {
  if (!msg) {
    Vue.prototype.$message({ 'message': 'Succeeded', 'type': 'success' })
  } else {
    Vue.prototype.$message({ 'message': msg, 'type': 'success' })
  }
}

new Vue(Vue.util.extend({ router, store, i18n }, App)).$mount('#app')
