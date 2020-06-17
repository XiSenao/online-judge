import moment from 'moment'
import types from '../types'
import api from '@oj/api'
import { CONTEST_STATUS, USER_TYPE, CONTEST_TYPE } from '@/utils/constants'
import utils from '@/utils/utils'
const state = {
  now: moment(),
  access: false,
  rankLimit: 30,
  forceUpdate: false,
  currentServerTime: '',
  contest: {
    created_by: {},
    contest_type: CONTEST_TYPE.PUBLIC
  },
  contestProblems: [],
  itemVisible: {
    menu: true,
    chart: true,
    realName: false
  }
}

const getters = {
  contestLoaded: (state) => {
    return !!state.contest.status
  },
  // 当前contest的状态
  contestStatus: (state, getters) => {
    // if (!getters.contestLoaded) return null
    let startTime = moment(state.contest.startTime)
    let endTime = moment(state.contest.endTime)
    let now = moment(state.currentServerTime)

    if (startTime > now) {
      return CONTEST_STATUS.NOT_START
    } else if (endTime < now) {
      return CONTEST_STATUS.ENDED
    } else {
      return CONTEST_STATUS.UNDERWAY
    }
  },
  // 当前比赛类型
  contestRuleType: (state) => {
    return state.contest.rankModel || null
  },
  // 当前比赛所有者
  isContestAdmin: (state, getters, _, rootGetters) => {
    return rootGetters.isAuthenticated && state.contest.creator === rootGetters['user/profile'].id
  },
  // 禁用当前比赛菜单(有权限 + 开放进行中 + 通过)
  contestMenuDisabled: (state, getters) => {
    if (getters.isContestAdmin) return false
    if (CONTEST_STATUS.NOT_START === getters.contestStatus) {
      return true
    }
    return !state.contest.permission
  },
  // OI实时比赛(ACM + 已结束 + 设置实时 + 有权限)
  OIContestRealTimePermission: (state, getters, _, rootGetters) => {
    if (getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true
    }
    return state.contest.realtimeRank === 1 || getters.isContestAdmin
  },
  // 禁止提交比赛题目(比赛结束 + 未开始(管理员可以) + 未登录)
  problemSubmitDisabled: (state, getters, _, rootGetters) => {
    if (getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true
    } else if (getters.contestStatus === CONTEST_STATUS.NOT_START) {
      return !getters.isContestAdmin
    }
    if (rootGetters['user/isAuthenticated']) {
      return !state.contest.permission
    } 
    return !rootGetters['user/isAuthenticated']
  },
  // 显示输入密码框(非公开 + 未拿到许可 + 非管理员)
  passwordFormVisible: (state, getters) => {
    if (state.contest.signUpRule === '密码') {
      return !state.contest.permission || !state.access
    }
    return false
  },
  // 比赛开始时间
  contestStartTime: (state) => {
    return moment(state.contest.startTime)
  },
  // 比赛结束时间
  contestEndTime: (state) => {
    return moment(state.contest.endTime)
  },
  // 比赛状态显示
  countdown: (state, getters) => {
    let now = state.currentServerTime
    if (getters.contestStatus === CONTEST_STATUS.NOT_START) {
      let duration = moment.duration(getters.contestStartTime.diff(now, 'seconds'), 'seconds')
      // time is too long
      if (duration.weeks() > 0) {
        return 'Start At ' + duration.humanize()
      }
      let texts = [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
      return '-' + texts.join(':')
    } else if (getters.contestStatus === CONTEST_STATUS.UNDERWAY) {
      let duration = moment.duration(getters.contestEndTime.diff(now, 'seconds'), 'seconds')
      let texts = [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
      return '-' + texts.join(':')
    } else {
      return 'Ended'
    }
  }
}

const mutations = {
  // 更改当前比赛
  [types.CHANGE_CONTEST] (state, payload) {
    state.contest = payload.contest
  },
  // 更改比赛显示规则
  [types.CHANGE_CONTEST_ITEM_VISIBLE] (state, payload) {
    state.itemVisible = {...state.itemVisible, ...payload}
  },
  // 更改rank强制更新
  [types.CHANGE_RANK_FORCE_UPDATE] (state, payload) {
    state.forceUpdate = payload.value
  },
  // 更换比赛问题集
  [types.CHANGE_CONTEST_PROBLEMS] (state, problemSet) {
    state.contestProblems = problemSet.contestProblems
  },
  // 
  [types.CHANGE_CONTEST_RANK_LIMIT] (state, payload) {
    state.rankLimit = payload.rankLimit
  },
  // 更改比赛相关许可
  [types.CONTEST_ACCESS] (state, access) {
    state.access = access
  },
  // 初始化比赛所有信息
  [types.CLEAR_CONTEST] (state) {
    state.contest = {created_by: {}}
    state.contestProblems = []
    state.access = false
    state.itemVisible = {
      menu: true,
      chart: true,
      realName: false
    }
    state.forceUpdate = false
  },
  // 时间 + 1
  [types.NOW_ADD_1S] (state) {
    let now = state.currentServerTime
    state.currentServerTime = moment(now).add(1, 's')
  },
  setServerTime (state, payload) {
    state.currentServerTime = payload
  },
}

const actions = {
  // 获取当前比赛信息
  getContest ({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api.getContest(rootState.route.params.contestID).then((res) => {
        resolve(res)  
        let contest = res.data.data
        commit('setServerTime', utils.formatDate(new Date(res.headers.date)))
        commit(types.CHANGE_CONTEST, {contest: contest})
        if (contest.signUpRule !== '公开') {
          commit(types.CONTEST_ACCESS, {access: res.data.data.permission})
        }
      }, err => {
        reject(err)
      })
    })
  },
  // 获取当前比赛的问题集
  getContestProblems ({commit, rootState}) {
    return new Promise((resolve, reject) => {
      api.getContestProblemList(rootState.route.params.contestID).then(res => {
        res.data.data.sort((a, b) => {
          if (a.id === b.id) {
            return 0
          } else if (a.id > b.id) {
            return 1
          }
          return -1
        })
        commit(types.CHANGE_CONTEST_PROBLEMS, {contestProblems: res.data.data})
        resolve(res)
      }, () => {
        commit(types.CHANGE_CONTEST_PROBLEMS, {contestProblems: []})
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
