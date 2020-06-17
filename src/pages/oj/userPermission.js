import router from './router'
import store from '@/store'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
import { getToken } from '@/utils/uauth' 
import {sync} from 'vuex-router-sync'
import utils from '@/utils/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['notFound', 'notAuthority'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
	const hasToken = getToken()
	let roles = []
  if (hasToken) {
		// determine whether the user has obtained his permission roles through getInfo
		const hasRoles = store.getters['user/roles'] && store.getters['user/roles'].length > 0
		if (hasRoles) {
      if (store.getters['upermission/availableRoutesName'].concat(whiteList).includes(to.name)) {
        next()
      } else if (store.getters['upermission/sumRoutesPath'].some(res => utils.comparePath(res, to.path))) {
        next('/401')
      } else {
        next('/404')
      }
		} else {
			try {
				// get user info
				// note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
				await store.dispatch('user/getProfile')
				roles = store.getters['user/roles']
				// generate accessible routes map based on roles
				const accessRoutes = await store.dispatch('upermission/generateRoutes', roles)
				// dynamically add accessible routes
				router.addRoutes(accessRoutes)
				// hack method to ensure that addRoutes is complete
				// set the replace: true, so the navigation will not leave a history record
				next({ ...to, replace: true })
			} catch (_) {
				// remove all information and go to re-login
				await store.dispatch('user/clearStatus')
				store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
				NProgress.done()
				next({name: 'home'})
			}
    }
  } else {
		if (!store.getters['upermission/availableRoutesName'].length) {
			// 为未登录用户生成可用路由
			store.dispatch('upermission/generateRoutes', roles)
		}
		if (store.getters['upermission/availableRoutesName'].concat(whiteList).includes(to.name)) {
			// in the free login whitelist, go directly
			next()
		} else {
      // other pages that do not have permission to access are redirected to the 401/404 page.
      if (store.getters['upermission/sumRoutesPath'].some(res => utils.comparePath(res, to.path))) {
        next('/401')
      } else {
        next('/404')
      }
			NProgress.done()
		}
  }
})

sync(store, router)

router.afterEach(() => {
  NProgress.done()
})
