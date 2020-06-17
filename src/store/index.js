import Vue from 'vue'
import Vuex from 'vuex'
import types from './types'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const rootState = {
  website: {},
  modalStatus: {
    mode: 'login', // or 'register',
    visible: false
  },
  identity: null
}

const rootGetters = {
  'website' (state) {
    return state.website
  },
  'modalStatus' (state) {
    return state.modalStatus
  }
}

const rootMutations = {
  [types.UPDATE_WEBSITE_CONF] (state, payload) {
    state.website = payload.websiteConfig
  },
  [types.CHANGE_MODAL_STATUS] (state, {mode, visible}) {
    if (mode !== undefined) {
      state.modalStatus.mode = mode
    }
    if (visible !== undefined) {
      state.modalStatus.visible = visible
    }
  },
  changeIdentity (state, payload) {
    state.identity = payload
  }
}

const rootActions = {
  getWebsiteConfig ({commit}) {
    // api.getWebsiteConf().then(res => {
    //   commit(types.UPDATE_WEBSITE_CONF, {
    //     websiteConfig: res.data.data
    //   })
    // })
  },
  changeModalStatus ({commit}, payload) {
    commit(types.CHANGE_MODAL_STATUS, payload)
  },
  changeDomTitle ({commit, state}, payload) {
    if (payload && payload.title) {
      window.document.title = 'QDOJ' + ' | ' + payload.title
    } 
  }
}

// // https://webpack.js.org/guides/dependency-management/#requirecontext
// 将./modules文件夹下面的.js文件请求到文件上下文
// 第一个参数不能是变量
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default new Vuex.Store({
  modules,
  state: rootState,
  getters: rootGetters,
  mutations: rootMutations,
  actions: rootActions,
  // 严格模式, 是否能在mutation外修改state值, true为不能修改，false则为可以修改
  // strict: debug
})

export { types }
