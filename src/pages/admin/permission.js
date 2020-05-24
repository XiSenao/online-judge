import router from './router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
import { getToken } from '@/utils/auth' 
import utils from '@/utils/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'notFound', 'notAuthority'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log('start')
  NProgress.start()

  const hasToken = getToken()
  console.log(hasToken)
  
  if (hasToken) {
    const hasRoles = store.getters['admin/roles'] && store.getters['admin/roles'].length > 0
    console.log(hasRoles)
    console.log(to)
    console.log(to.name)
    console.log(store.getters['permission/availableRoutesName'])
    console.log(store.getters['permission/sumRoutesPath'])
    if (hasRoles) {
      // 页面还未刷新
      if (store.getters['permission/availableRoutesName'].concat(whiteList).includes(to.name)) {
        console.log('A')
        // 有权限
        next()
      } else if (store.getters['permission/sumRoutesPath'].some(res => utils.comparePath(res, to.path))) {
        console.log('B')
        // 无权限
        next('/401')
      } else {
        console.log('C')
        // 无页面
        next('/404')
      }
    } else {
      try { // 页面刷新 重新获取roles(由于服务端权限管理模块未完善, 因此判断是通过username来进行权限判断)
        const roles = await store.dispatch('admin/checkAdmin')
        console.log(roles)
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
        next('/401')
      } else {
        next('/404')
      }
			NProgress.done()
		}
  }
})

router.afterEach(() => {
  NProgress.done()
})
