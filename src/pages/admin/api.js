import Vue from 'vue'
import axios from 'axios'
import utils from '@/utils/utils'
import router from './router'
import { getToken } from '@/utils/auth'
Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// axios.defaults.xsrfCookieName = 'csrftoken'
// 配置axios请求头, axios每次发起请求携带token,在Network中的headers看的到, 写多少个方法就执行多少个方法
// axios.interceptors.request.use(config => {  
//   if (!!getToken()) {
//     config.headers.common.token = getToken()  //Authorization  是请求头要求加上的字段
//   }
//   return config
// })

export default {
  // 登录
  login (username, password) {
    return ajax('login', 'post', {
      data: {
        username,
        password
      }
    })
  },
  logout () {
    return ajax('logout', 'post')
  },
  // 获取公告列表
  getAnnouncementList (offset, limit, paramData = null) {
    return ajax('admin/ancManager/ancInfoList', 'post', {
      data: {
        limit,
        offset,
        paramData
      }
    })
  },
  getAuthenticationType () {
    return ajax('admin/certManager/certTypeList', 'get', {})
  },
  addNewAuthenticationType (type) {
    return ajax('admin/certManager/save', 'post', {
      params: {
        type
      }
    })
  },
  exchangeAuthenticationTypeStatus (data) {
    return ajax('admin/certManager/update', 'post', {
      data
    })
  },
  // 删除公告
  deleteAnnouncement (id) {
    return ajax('admin/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  // 修改公告
  updateAnnouncement (data) {
    return ajax('admin/ancManager/update', 'post', {
      data
    })
  },
  // 添加公告
  createAnnouncement (data) {
    return ajax('admin/ancManager/save', 'post', {
      data
    })
  },
  // 获取用户列表
  getUserList (offset, limit, paramData = {}) {
    let data = {offset, limit, paramData}
    let URLTAIL = data.paramData ? 'searchResult' : 'userInfoList'
    return ajax(`admin/userManager/${URLTAIL}`, 'post', {
      data
    })
  },
  // 获取管理员列表
  getAdminList (offset, limit, paramData = {}) {
    let data = {offset, limit, paramData}
    let URLTAIL = data.paramData ? 'searchResult' : 'adminInfoList'
    return ajax(`admin/adminManager/${URLTAIL}`, 'post', {
      data
    })
  },
  resetPassword (username, role) {
    let funcName = role ? 'userManager' : 'adminManager'
    return ajax(`admin/${funcName}/password/update/${username}`, 'post', {})
  },
  exchangeAccountStatus (username, status, role) {
    let funcName = role ? 'userManager' : 'adminManager'
    return ajax(`admin/${funcName}/account/update/${username}`, 'post', {
      params: {
        status
      }
    })
  },
  addNewAccount (data, role) {
    let funcName = role === 'Admin' ? 'adminManager' : 'userManager'
    return ajax(`admin/${funcName}/save`, 'post', {
      data
    })
  },
  getContestAuthenticatedUserList (params, data) {
    return ajax('admin/contestManager/contestUserList', 'post', {
      params,
      data
    })
  },
  // 获取单个用户信息
  getUser (id) {
    return ajax('admin/user', 'get', {
      params: {
        id
      }
    })
  },
  // 编辑用户
  editUser (data) {
    return ajax('admin/user', 'put', {
      data
    })
  },
  deleteUsers (id) {
    return ajax('admin/user', 'delete', {
      params: {
        id
      }
    })
  },
  importUsers (users) {
    return ajax('admin/user', 'post', {
      data: {
        users
      }
    })
  },
  compileSpj (params) {
    return ajax('admin/problemManager/machine/compileSpj', 'post', {
      params
    })
  },
  generateUser (data) {
    // axios使用封装过后的请求设置请求头responseType:'blob'不生效, 推荐使用axios({})的方式, 不要使用如：axios.post()的方式
    return ajax('admin/userManager/generateUsers', 'post', {
      data,
      responseType: 'blob'
    })

  },
  getAuthenticatedUserList (offset, limit, paramData = null) {
    return ajax('admin/userManager/appliedCertificationList', 'post', {
      data: {
        offset,
        limit,
        paramData
      }
    })
  },
  exchangeAuthUser (params) {
    return ajax('admin/contestManager/contestUser/update', 'post', {
      params
    })
  },
  saveAuthenticationType (data) {
    return ajax('admin/certManager/save', 'post', {
      data
    })
  },
  updateTypeName (data) {
    return ajax('admin/certManager/update', 'post', {
      data
    })
  },
  exchangeAuthenticatedStatus (userId, status) {
    return ajax('admin/userManager/appliedCertification/update', 'post', {
      params: {
        userId,
        status
      }
    })
  },
  getSMTPConfig () {
    return ajax('admin/smtp', 'get')
  },
  createSMTPConfig (data) {
    return ajax('admin/smtp', 'post', {
      data
    })
  },
  editSMTPConfig (data) {
    return ajax('admin/smtp', 'put', {
      data
    })
  },
  testSMTPConfig (email) {
    return ajax('admin/smtp_test', 'post', {
      data: {
        email
      }
    })
  },
  getJudgeServer () {
    return ajax('admin/judgeManager/judgeMachineList', 'get')
  },
  getSpiderServer () {
    return ajax('admin/judgeManager/judgeSpiderList', 'get')
  },
  createJudgeServer (data) {
    return ajax('admin/judgeManager/judgeMachine/save', 'post', {
      data
    })
  },
  updateJudgeOrSpiderServer (params) {
    return ajax('admin/judgeManager/judgeStatus/update', 'post', {
      params
    })
  },
  createJudgeSpider (data) {
    return ajax('admin/judgeManager/judgeSpider/save', 'post', {
      data
    })
  },
  deleteJudgeServer (hostname) {
    return ajax('admin/judge_server', 'delete', {
      params: {
        hostname: hostname
      }
    })
  },
  getZipFile (problemId) {
    return ajax(`admin/problemManager/downloadFile?problemId=${problemId}`, 'get', {
      headers: {
        'Content-Type': 'application/zip'
      },
      responseType: "blob" // 文件流必须设置
    })
  },
  exchangeStatus (params) {
    return ajax('admin/problemManager/problemStatus/update', 'POST', {
      params
    })
  },
  uploadZipFile (data) {
    // data = `
    //   ----------------------------429943468189692401144069
    //   Content-Disposition: form-data; name="file"; filename="testcase.zip"

    //   ${data.file}
    //   ----------------------------429943468189692401144069
    //   Content-Disposition: form-data; name="spj"

    //   ${data.spj}
    //   ----------------------------429943468189692401144069
    //   Content-Disposition: form-data; name="problemId"

    //   ${data.problemId}
    //   ----------------------------429943468189692401144069--
    // `
    return ajax('admin/problemManager/uploadFile', 'post', {
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // 创建题目(停用)
  // 上传 .in & .out 文件
  // uploadInAndOutFile (data) {
  //   return axios({
  //     method: 'POST',
  //     url: 'admin/problemManager/uploadFile',
  //     token: store.state.user.token,
  //     data,
  //     'Content-Type': 'multipart/form-data'
  //   })
  // },
  // 上传特判文件(停用)
  // uploadSpecialJudgeFile (data) {
  //   return axios({
  //     method: 'POST',
  //     url: 'admin/problemManager/uploadSpj',
  //     token: store.state.user.token,
  //     data,
  //     'Content-Type': 'multipart/form-data'
  //   })
  // },
  // 上传函数型文件(停用)
  // uploadFQFile (data) {
  //   return axios({
  //     method: 'POST',
  //     url: 'admin/problemManager/uploadInsert',
  //     token: store.state.user.token,
  //     data,
  //     'Content-Type': 'multipart/form-data'
  //   })
  // },
  // (停用)
  getInvalidTestCaseList () {
    return ajax('admin/prune_test_case', 'get')
  },
  // (停用)
  pruneTestCase (id) {
    return ajax('admin/prune_test_case', 'delete', {
      params: {
        id
      }
    })
  },
  createContest (data) {
    return ajax('admin/contestManager/save', 'post', {
      data
    })
  },
  getContest (contestId) {
    return ajax('admin/contestManager/contestInfo', 'get', {
      params: {
        contestId
      }
    })
  },
  editContest (data) {
    return ajax('admin/contestManager/update', 'post', {
      data
    })
  },
  getContestList (offset, limit, paramData={}) {
    let data = {offset, limit, paramData}
    return ajax('admin/contestManager/contestList', 'post', {
      data
    })
  },
  getContestAnnouncementList (contestID) {
    return ajax('admin/contestManager/announcementList', 'get', {
      params: {
        contestId: contestID
      }
    })
  },
  getJudgeUniqueStyleLists () {
    return ajax('admin/judgeManager/uniqueJudgeMachineList', 'post')
  },
  getJudgeStyleLists () {
    return ajax('admin/judgeManager/judgeMachineList', 'get', {})
  },
  createSpiderProblem (data) {
    return ajax('admin/problemManager/spider/save', 'post', {
      data
    })
  },
  createContestAnnouncement (data) {
    let params = {
      contestId: data.contestId
    }
    delete data.contestId
    return ajax('admin/contestManager/announcement/save', 'post', {
      params,
      data
    })
  },
  deleteContestAnnouncement (id) {
    return ajax('admin/contest/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestAnnouncement (data) {
    let params = {
      contestId: data.contestId
    }
    delete data.contestId
    return ajax('admin/contestManager/announcement/update', 'post', {
      params,
      data
    })
  },
  getProblemTagList () {
    return ajax('admin/problemManager/tags', 'get')
  },
  compileSPJ (data) {
    return ajax('admin/compile_spj', 'post', {
      data
    })
  },
  createProblem (data) {
    return ajax('admin/problemManager/machine/save', 'post', {
      data
    })
  },
  getInOrOutFileLists () {
    return ajax()
  },
  editProblem (data) {
    return ajax('admin/problemManager/problemInfo/update', 'post', {
      data
    })
  },
  addNewTag (tagName) {
    return ajax('admin/problemManager/tag/save', 'post', {
      params: {
        tagName
      }
    })
  },
  deleteFiles (params) { 
    return ajax('admin/problemManager/file/remove', 'post', {
      params
    })
  },
  downloadFile (params) {
    // 注意content-type, 默认会进入catch, 因此需要改成后端返回
    return ajax('admin/problemManager/downloadFile', 'get', {
      params,
      headers: {
        'Content-Type': 'text/x-c++src' 
      }
    })
  },
  deleteProblem (id) {
    return ajax('admin/problem', 'delete', {
      params: {
        id
      }
    })
  },
  updateProblemStatus (params) {
    return ajax('admin/problemManager/problemStatus/update', 'post', {
      params
    })
  },
  getProblem (problemId) {
    return ajax('admin/problemManager/problemInfo', 'get', {
      params: {
        problemId
      }
    })
  },
  getProblemTags (problemId) {
    return ajax('admin/problemManager/problemInfo/tags', 'get', {
      params: {
        problemId
      }
    })
  },
  getInOrOutFileNameLists (problemId) {
    return ajax('admin/problemManager/files', 'get', {
      params: {
        problemId
      }
    })
  },
  getSpecialFileNameLists (problemId) {
    return ajax('admin/problemManager/spj', 'get', {
      params: {
        problemId
      }
    })
  },
  getFQFileNameLists (problemId) {
    return ajax('admin/problemManager/function', 'get', {
      params: {
        problemId
      }
    })
  },
  getProblemList (data) {
    data = utils.filterEmptyValue(data)
    let URLTAIL = data.paramData ? 'searchResult' : 'problemList'
    return ajax('admin/problemManager/' + URLTAIL, 'post', {
      data
    })
  },
  getContestProblemList (params) {
    params = utils.filterEmptyValue(params)
    let { contestId } = params
    return ajax('admin/contestManager/problemIdList', 'get', {
      params: {
        contestId
      }
    })
  },
  getContestProblem (problemId) {
    return ajax('admin/problemManager/problemInfo', 'get', {
      params: {
        problemId
      }
    })
  },
  changeContestStatus (contestId) {
    return ajax('admin/contestManager/block', 'post', {
      params: {
        contestId
      }
    })
  },
  createContestProblem (data) {
    return ajax('admin/problemManager/machine/save', 'post', {
      data
    })
  },
  editContestProblem (data) {
    return ajax('admin/problemManager/problemInfo/update', 'post', {
      data
    })
  },
  deleteContestProblem (id) {
    return ajax('admin/contest/problem', 'delete', {
      params: {
        id
      }
    })
  },
  makeContestProblemPublic (data) {
    return ajax('admin/contest_problem/make_public', 'post', {
      data
    })
  },
  addProblemFromPublic (data) {
    return ajax('admin/contest/add_problem_from_public', 'post', {
      data
    })
  },
  getReleaseNotes () {
    return ajax('admin/versions', 'get')
  },
  getDashboardInfo () {
    return ajax('admin/dashboard_info', 'get')
  },
  getSessions () {
    return ajax('sessions', 'get')
  },
  exportProblems (data) {
    return ajax('export_problem', 'post', {
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
  if (!!getToken()) {
    headers.token = getToken()
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
      if (res.data.status > 200) {
        if (res.data.status === 1001) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Execution error')
        } else if (res.data.status === 2001) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Question does not exist')
        } else if (res.data.status === 2003 || res.data.status === 2101) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('You do not have permission to access')
        } else if (res.data.status === 2004) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('please login again')
          router.push('/login')
        } else if (res.data.status === 2200) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('The problem is abnormal')
        } else if (res.data.status === 2202) {
          res.data.message ? Vue.prototype.$error(res.data.message) : Vue.prototype.$error('Question status is wrong')
        } else {
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
