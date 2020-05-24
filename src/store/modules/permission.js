import { asyncRoutes, constantRoutes } from '@/pages/admin/router.js'
import { ADMIN_TYPE } from '@/utils/constants'
import utils from '@/utils/utils'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  // 可达路由名
  availableRoutesName: [],
  // 全部路由名(区分 404 | 401 )
  sumRoutesPath: []
}

const getters = {
  availableRoutesName: state => state.availableRoutesName,
  sumRoutesPath: state => state.sumRoutesPath
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    let routesName = new Set()
    utils.serializationDFS(constantRoutes.concat(routes), routesName, 'name')
    console.log(constantRoutes)
    state.availableRoutesName = Array.from(routesName)	
  },
  SET_SUM_ROUTES_PATH: (state, payload) => {
    state.sumRoutesPath = payload
  }
}

const actions = {
  generateRoutes({ state, commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes(ADMIN_TYPE.SUPERADMIN)) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 首次重加载所有路由名
      let routesPath = new Set()
      utils.serializationDFS(constantRoutes.concat(asyncRoutes), routesPath, 'path')
      routesPath = [ ...routesPath ]
      commit('SET_SUM_ROUTES_PATH', routesPath)
      console.log(routesPath)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
