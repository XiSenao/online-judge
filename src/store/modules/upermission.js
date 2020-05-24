import { asyncRoutes, constantRoutes } from '@/pages/oj/router/routes'
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
  routes: constantRoutes,
  addRoutes: [],
  availableRoutesName: [],
  sumRoutesPath: []
}

const getters = {
  routes: state => state.routes,
  addRoutes: state => state.addRoutes,
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
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      let routesPath = new Set()
      utils.serializationDFS(constantRoutes.concat(asyncRoutes), routesPath, 'path')
      routesPath = [ ...routesPath ]
      commit('SET_SUM_ROUTES_PATH', routesPath)
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
