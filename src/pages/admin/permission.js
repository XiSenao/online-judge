import router from './router'
import store from '@/store'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
import { getToken } from '@/utils/auth' 
import utils from '@/utils/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'notFound', 'notAuthority'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  const hasToken = getToken()
  
  if (hasToken) {
    const hasRoles = store.getters['admin/roles'] && store.getters['admin/roles'].length > 0
    if (hasRoles) {
      // 页面还未刷新
      if (store.getters['permission/availableRoutesName'].concat(whiteList).includes(to.name)) {
        next()
      } else if (store.getters['permission/sumRoutesPath'].some(res => utils.comparePath(res, to.path))) {
        // 用户访问无权限页面
        next({ path: '/401', replace: true})
      } else {
        next({ path: '/404', replace: true})
      }
    } else {
      try { // 页面刷新 重新获取roles(由于服务端权限管理模块未完善, 因此权限是通过请求特定的接口来进行确认的
        const roles = await store.dispatch('admin/checkAdmin')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
      } catch (_) {
        // token失效
        await store.dispatch('admin/resetToken')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
			// in the free login whitelist, go directly
			next()
		} else {
      // other pages that do not have permission to access are redirected to the login page.
      if (store.getters['permission/sumRoutesPath'].some(res => utils.comparePath(res, to.path))) {
        next({ path: '/401', replace: true})
      } else {
        next({ path: '/404', replace: true})
      }
			NProgress.done()
		}
  }
})

router.afterEach(() => {
  NProgress.done()
})
