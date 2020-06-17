import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './routes'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  // 手动捕获因接连访问同一个路由地址而发生的错误
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
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
