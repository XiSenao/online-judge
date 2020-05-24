import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './routes'
import {sync} from 'vuex-router-sync'
import store from '@/store'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  // 手动捕获因接连访问同一个路由地址而发送的错误
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () => new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher 
}

// // 全局身份确认
// router.beforeEach((to, from, next) => {
//   Vue.prototype.$Loading.start()
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!storage.get(STORAGE_KEY.AUTHED)) {
//       Vue.prototype.$error('Please login first')
//       store.commit(types.CHANGE_MODAL_STATUS, {mode: 'login', visible: true})
//       next({
//         name: 'home'
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

// router.afterEach((to, from, next) => {
//   Vue.prototype.$Loading.finish()
// })
console.log(store)
// 使得在router中可以使用store
// sync(store, router)

export default router
