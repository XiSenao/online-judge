import Vue from 'vue'
import store from '@/store'
import axios from 'axios'
import { getToken as getUserToken } from '@/utils/uauth' 
import { getToken as getAdminToken} from '@/utils/auth'
Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// axios.defaults.xsrfCookieName = 'csrftoken'
// 原本以为api.js是智能的, 谁发起就先使用谁的拦截器, 没想到后来发现都是从user -> admin, 因此要想实现管理员和用户同时登录就不能使用拦截器(无法了解是谁发起的)
// axios.interceptors.request.use(config => {    // 配置axios请求头，axios每次发起请求携带token，在Network中的headers看的到
//   if (!!getToken()) {
//     config.headers.common.token = getToken()  // Authorization  是请求头要求加上的字段
//   }
//   return config
// })

export default {
  // 无效接口
  getWebsiteConf (params) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },
  getAnnouncementList (offset, limit, check) {
    let data = {
      limit,
      offset,
      paramData: null
    }
    let funcURL = check ? 'user/messages' : 'anc/ancInfoList'
    return ajax(funcURL, 'post', {
      data
    })
  },
  hasReadMessage (msgId) {
    return ajax(`user/message/update/${msgId}`, 'get')
  },
  login (username, password) {
    return ajax('login', 'post', {
      data: {
        username,
        password
      }
    })
  },
  checkUsernameOrEmail (username, email) {
    return ajax('check_username_or_email', 'post', {
      data: {
        username,
        email
      }
    })
  },
  // 注册
  register (data) {
    return ajax('user/register', 'post', {
      data
    })
  },
  logout () {
    return ajax('logout', 'post')
  },
  getHeadImageCopy (headImageName) {
    // 不能将responseType放在headers中
    return ajax(`user/head/${headImageName}`, 'get', {
      responseType: 'arraybuffer'
    })
  },
  uploadHead (data) {
    return ajax('user/uploadHead', 'post', {
      data
    })
  },
  getCaptcha () {
    return ajax('captcha', 'get')
  },
  getSolvedProblems (id) {
    return ajax('user/solvedProblems', 'get', {
      params: {
        id
      }
    })
  },
  getNotSolvedProblems (id) {
    return ajax('user/notSolvedProblems', 'get', {
      params: {
        id
      }
    })
  },
  getUserInfo (id, checkAdmin) {
    return ajax('user/userInfo', 'get', {
      params: {
        id
      },
      checkAdmin
    })
  },
  updateProfile (userInfoModel) {
    return ajax('user/userInfo/update', 'post', {
      data: userInfoModel
    })
  },
  updateCertification (userCertificationModel) {
    return ajax('user/userCertification/update', 'post', {
      data: userCertificationModel
    })
  },
  freshDisplayID (userID) {
    return ajax('profile/fresh_display_id', 'get', {
      params: {
        user_id: userID
      }
    })
  },
  twoFactorAuth (method, data) {
    return ajax('two_factor_auth', method, {
      data
    })
  },
  tfaRequiredCheck (username) {
    return ajax('tfa_required', 'post', {
      data: {
        username
      }
    })
  },
  getSessions () {
    return ajax('sessions', 'get')
  },
  deleteSession (sessionKey) {
    return ajax('sessions', 'delete', {
      params: {
        session_key: sessionKey
      }
    })
  },
  applyResetPassword (data) {
    return ajax('apply_reset_password', 'post', {
      data
    })
  },
  resetPassword (data) {
    return ajax('reset_password', 'post', {
      data
    })
  },
  changePassword (data) {
    return ajax('user/userPwd/update', 'post', {
      params: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }
    })
  },
  changeEmail (data) {
    return ajax('user/userEmail/update', 'post', {
      params: {
        oldEmail: data.oldEmail,
        newEmail: data.newEmail
      }
    })
  },
  applyCertification (data) {
    return ajax('user/userCertification/save', 'post', {
      data
    })
  },
  getOwnCertType () {
    return ajax('user/userCertification', 'get')
  },
  getCertTypeList () {
    return ajax('user/userCertification/certTypeList', 'get')
  },
  getProblemTagList () {
    return ajax('problem/tags', 'get')
  },
  getProblemList (data) {
    return ajax('problem/conditionalProblemList', 'post', {
      data
    })
  },
  getProblem (ID) {
    let {problemID} = ID
    return ajax(`problem/problemInfo/${problemID}`, 'get')
  },
  getContestList (data) {
    return ajax('contest/conditionalContestList', 'post', {
      data
    })
  },
  getContestLists (offset, limit, paramData = null) {
    return ajax('contest/contestList', 'post', {
      data: {
        limit,
        offset,
        paramData
      }
    })
  },
  getContest (id) {
    return ajax(`contest/contestInfo/${id}`, 'get')
  },
  getContestAccess (contestID) {
    return ajax('contest/access', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  checkContestPassword (contestID, password) {
    return ajax(`contest/contestInfo/${contestID}/signUp`, 'post', {
      params: { 
        password
      }
    })
  },
  getContestAnnouncementList (contestId) {
    return ajax(`contest/contestInfo/${contestId}/announcements`, 'get')
  },
  getContestProblem (params) {
    return ajax(`contest/contestInfo/${params.contestID}/problemInfo/${params.problemID}`, 'get')
  },
  getContestProblemList (contestId) {
    return ajax(`contest/contestInfo/${contestId}/problemList`, 'get')
  },
  submitContestCode (data) {
    let contestId = data.contestId
    delete data.contestId
    return ajax(`contest/contestInfo/${contestId}/submit`, 'post', {
      data
    })
  },
  submitCode (data) {
    return ajax('problem/submit', 'post', {
      data
    })
  },
  getSubmissionList (data) {
    return ajax('status/conditionalStatusList', 'post', {
      data
    })
  },
  getContestSubmissionList (data) {
    let contestId = data.contestId
    delete data.contestId
    return ajax(`contest/contestInfo/${contestId}/statusList`, 'post', {
      data
    })
  },
  getSubmission (problemId, submitId) {
    return ajax('status/msg', 'get', {
      params: {
        submitId,
        problemId
      }
    })
  },
  submissionExists (problemID) {
    return ajax('submission_exists', 'get', {
      params: {
        problem_id: problemID
      }
    })
  },
  submissionRejudge (id) {
    return ajax('admin/submission/rejudge', 'get', {
      params: {
        id
      }
    })
  },
  updateSubmission (data) {
    return ajax('submission', 'put', {
      data
    })
  },
  getUserRank (offset, limit, type, paramData = null) {
    let data = {
      offset,
      limit,
      paramData
    }
    let funName = type === 'ACM' ? 'ac' : 'rating'
    return ajax(`rank/${funName}`, 'post', {
      data
    })
  },
  getContestRank (data) {
    let { contestId } = data
    delete data.contestId
    return ajax(`contest/contestInfo/${contestId}/rank`, 'post', {
      data
    })
  },
  getACMACInfo (params) {
    return ajax('admin/contest/acm_helper', 'get', {
      params
    })
  },
  updateACInfoCheckedStatus (data) {
    return ajax('admin/contest/acm_helper', 'put', {
      data
    })
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @param header The header token to carry
 * @param responseType The type of data returned by the server
 * @returns {Promise}
 */
function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}, headers = {}, responseType = {}} = options
  } else {
    params = data = headers = responseType = {}
  }
  // todo: 由于角色是由前端生成并控制的, 因此若想解决耦合, 必须使后端实现权限控制
  if (options && options.checkAdmin) {
    if (!!getAdminToken()) {
      headers.token = getAdminToken()
    }
  } else {
    if (!!getUserToken()) {
      headers.token = getUserToken()
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data,
      headers,
      responseType
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.status > 200) {
        if (res.request.responseURL.indexOf('user/userInfo') !== -1) {
        } else if (res.data.status === 1001) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Execution error')
        } else if (res.data.status === 2001) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Question does not exist')
        } else if (res.data.status === 2003 || res.status === 2101) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('You do not have permission to access')
        } else if (res.data.status === 2004) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('please login again')
          store.dispatch('user/clearStatus')
          store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
        } else if (res.data.status === 2200) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('The problem is abnormal')
        } else if (res.data.status === 2202) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Question status is wrong')
        } else if (res.data.status !== 3002) { // 用户端登录新增超时机制, 因此将显示信息释放
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Error')
        }
        reject(res)
      }
      resolve(res)
    }, res => {
      // API请求异常，一般为Server error 或 network error
      Vue.prototype.$error('Server error Or Network error')
      reject(res)
    })
  })
}
