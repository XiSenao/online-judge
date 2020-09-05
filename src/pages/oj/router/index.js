import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './routes'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(_ => {})
}
const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ x: 0, y: 1 })
        }, 0)
      })
      // return { x: 0, y: 0 }
    }
  },
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
