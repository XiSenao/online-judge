import { ADMIN_TYPE, USER_NORMAL_INFO } from '@/utils/constants'
import api from '@/pages/admin/api'
import userApi from '@/pages/oj/api'
import { setToken, getToken, removeToken, setAccount, getAccount, removeAccount } from '@/utils/auth'
import router, { resetRouter } from '@/pages/admin/router'

const state = {
	token: getToken(), // getToken只会调用一次, token不会随着getToken()的变化而变化
	account: getAccount(),
	roles: [],
	user: {}
}

const getters = {
	user: (state, getters) => {
		if (state.token && getters.isSuperAdminRole) {
			return USER_NORMAL_INFO.SUPERADMIN
		} else if (state.token) {
			return USER_NORMAL_INFO.ADMIN
		} 
		return USER_NORMAL_INFO.ANONYMOUS
	},
	account: state => state.account,
	token: state => state.token,
	roles: state => state.roles,
	isSuperAdminRole: (state, getters) => {
		return getters.account === ADMIN_TYPE.SUPERADMIN 
	},
	hasProblemPermission: (state, getters) => {
		return !!getters.token
	}
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_ACCOUNT: (state, account) => {
		state.account = account
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	}
}

const actions = {

	checkAdmin ({ getters, commit, dispatch }, username) {
		return new Promise((resolve, reject) => {
			userApi.getUserInfo(null, true).then(async res => {
				// 普通用户"成功登录"
				await dispatch('resetToken')
				reject()
			}).catch(_ => {
				// 管理员用户成功登录
				if (!!username) {
					commit('SET_ACCOUNT', username)
					console.log(username)
					setAccount(username)
				}
				let roles = []
				if (getters.isSuperAdminRole) {
					roles.push(ADMIN_TYPE.SUPERADMIN)
				}
				roles.push(ADMIN_TYPE.ADMIN)
				console.log(roles)
				commit('SET_ROLES', roles)
				resolve(roles) 
			})
		})
	},

	login ({ commit, dispatch, getters }, userInfo) {
		const { username, password } = userInfo
		return new Promise((resolve, reject) => {
			api.login(username, password).then(async res => {
				const token = res.headers.token
				dispatch('resetToken')
				setToken(token)
				commit('SET_TOKEN', token)
				// 判断是否是管理员
				const roles = await dispatch('checkAdmin', username)
				resetRouter()
				// generate accessible routes map based on roles
				const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

				// dynamically add accessible routes
				router.addRoutes(accessRoutes)
				
				resolve()
			}).catch(_ => {
				console.log(_)
				reject(_)
			})
		})
	},

	logout ({ dispatch }) {
		return new Promise((resolve, reject) => {
			api.logout().then(_ => {
				resetRouter()
				dispatch('resetToken')
				dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
			}).catch(_ => {
				reject(_)
			})
		})
	},

	resetToken ({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			commit('SET_ACCOUNT', '')
			commit('SET_ROLES', [])
			removeToken()
			removeAccount()
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
  