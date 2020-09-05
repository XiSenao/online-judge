import Logout from './user/Logout.vue'
import UserHome from './user/UserHome.vue'
import Home from './general/Home.vue'
import Announcements from './general/Announcements.vue'

// Grouping Components in the Same Chunk
const SubmissionList = () => import(/* webpackChunkName: "submission" */ '@oj/views/submission/SubmissionList.vue')
const SubmissionDetails = () => import(/* webpackChunkName: "submission" */ '@oj/views/submission/SubmissionDetails.vue')

const ACMRank = () => import(/* webpackChunkName: "userRank" */ '@oj/views/rank/ACMRank.vue')
const OIRank = () => import(/* webpackChunkName: "userRank" */ '@oj/views/rank/OIRank.vue')

const ApplyResetPassword = () => import(/* webpackChunkName: "password" */ '@oj/views/user/ApplyResetPassword.vue')
const ResetPassword = () => import(/* webpackChunkName: "password" */ '@oj/views/user/ResetPassword.vue')

const Problem = () => import(/* webpackChunkName: "problem" */ '@oj/views/problem/Problem.vue')
const ProblemList = () => import(/* webpackChunkName: "problem" */ '@oj/views/problem/ProblemList.vue')

const FAQ = () => import(/* webpackChunkName: "help" */ '@oj/views/help/FAQ.vue')
const About = () => import(/* webpackChunkName: "help" */ '@oj/views/help/About.vue')

const NotFound = () => import(/* webpackChunkName: "notice" */ '@/pages/oj/components/404.vue')
const NotAuthority = () => import(/* webpackChunkName: "notice" */ '@/pages/oj/components/401.vue')

export {
  Home, Announcements,
  Logout, UserHome,
  ProblemList, Problem,
  About, FAQ,
  ACMRank, OIRank,
  NotFound, NotAuthority,
  SubmissionList, SubmissionDetails,
  ApplyResetPassword, ResetPassword
}
/* 组件导出分为两类, 一类常用的直接导出，另一类诸如Login, Logout等用懒加载,懒加载不在此处导出
 *   在对应的route内加载
 *   见https://router.vuejs.org/en/advanced/lazy-loading.html
 */
