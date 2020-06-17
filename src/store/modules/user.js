import types from '../types'
import api from '@oj/api'
import i18n from '@/i18n'
import { DEFAULT_AVATAR } from '@/utils/constants'
import utils from '@/utils/utils'
import { setToken, getToken, removeToken } from '@/utils/uauth'
import router, { resetRouter } from '@/pages/oj/router'

const state = {
  profile: {
    viewLanguage: 'en-US'
  },
  roles: [],
  token: null
}

const getters = {
  token: state => getToken(),
  profile: state => state.profile || {},
  roles: state => state.roles,
  isAuthenticated: (state, getters) => {
    return !!getters.profile.id
  }
}

const mutations = {
  [types.CHANGE_PROFILE] (state, {profile}) {
    state.profile = profile
    i18n.locale = profile.viewLanguage || 'en-US'
  },
  [types.CHANGE_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_IMGBUFFER] (state, imageBuffer) {
    state.profile ? state.profile.IMGBuffer = imageBuffer : ''
  },
  [types.SET_ROLES] (state, roles) {
    state.roles = roles
  }
}

const actions = {
  
  setIMGBuffer ({commit}, imageBuffer) {
    commit(types.SET_IMGBUFFER, imageBuffer)
  },

  setToken ({commit}, token) {
    commit(types.CHANGE_TOKEN, token)
  },

  login({ state, commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      Promise.race([utils.timeOut(), api.login(username, password)])
        .then(async res => {
          let token = res.headers.token
          dispatch('clearStatus')
          commit(types.CHANGE_TOKEN, token)
          setToken(token)
          await dispatch('getProfile')
          // 模拟权限管理
          commit(types.SET_ROLES, ['user'])
          resetRouter()
          // generate accessible routes map based on roles
          const accessRoutes = await dispatch('upermission/generateRoutes', state.roles, { root: true })
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          resolve()
        }).catch(_ => {
          reject(_)
        })
    })
  },

  logout ({dispatch}) {
    return new Promise((resolve, reject) => {
      api.logout().then(res => {
        dispatch('clearStatus')
        resolve()
      }).catch(_ => {
        reject(_)
      })
    })
  },

  getHeadImage ({ commit }, headPortrait) {
    return new Promise((resolve, reject) => {
      api.getHeadImageCopy(headPortrait).then(response => {
        let IMGBuffer = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        resolve(IMGBuffer)
      }).catch(_ => {
        reject(_)
      })
    })
  },

  getProfile ({state, commit, dispatch}, id) {
    return new Promise((resolve, reject) => {
      api.getUserInfo(id).then(async res => {
        res.data.data.headPortrait = res.data.data.headPortrait || DEFAULT_AVATAR
        if (res.data.data.headPortrait !== DEFAULT_AVATAR) {
          let IMGBuffer = await dispatch('getHeadImage', res.data.data.headPortrait)
          res.data.data.IMGBuffer = IMGBuffer
        }
        if (!(id && state.profile.id !== id)) {
          // 更新用户个人信息
          commit(types.CHANGE_PROFILE, {
            profile: res.data.data || {}
          })
          // 获取用户角色
          commit(types.SET_ROLES, ['user'])
        }
        resolve(res.data.data)
      }).catch(error => {
        if (!(id && state.profile.id !== id)) {
          // token失效删除先前的账户信息
          dispatch('clearStatus')
        }
        reject(error)
      })
    })
  },

  clearStatus ({ commit, dispatch }) {
    commit(types.CHANGE_TOKEN, null)
    commit(types.SET_ROLES, [])
    commit(types.CHANGE_PROFILE, {
      profile: {}
    })
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
