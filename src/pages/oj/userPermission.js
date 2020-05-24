import router from './router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
import { getToken } from '@/utils/uauth' 
import {sync} from 'vuex-router-sync'
import utils from '@/utils/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'notFound', 'notAuthority'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
	const hasToken = getToken()
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
				let roles = store.getters['user/roles']
				// generate accessible routes map based on roles
				const accessRoutes = await store.dispatch('upermission/generateRoutes', roles)
				// dynamically add accessible routes
				router.addRoutes(accessRoutes)
				
				// hack method to ensure that addRoutes is complete
				// set the replace: true, so the navigation will not leave a history record
				// next(to.query)
				next({ ...to, replace: true })
			} catch (error) {
				// remove token and go to login page to re-login
				await store.dispatch('user/clearStatus')
				store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
				next(`/login?redirect=${to.path}`)
				NProgress.done()
			}
    }
  } else {
		if (!store.getters['upermission/availableRoutesName'].length) {
			store.dispatch('upermission/generateRoutes', [])
		}
		if (store.getters['upermission/availableRoutesName'].concat(whiteList).includes(to.name)) {
			// in the free login whitelist, go directly
			next()
		} else {
      // other pages that do not have permission to access are redirected to the login page.
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
