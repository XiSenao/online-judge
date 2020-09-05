import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, AuthenticatedUser, Contest, ContestList, Home, JudgeServer, Login,
  Problem, SpiderProblem, ProblemList, User, Dashboard, Redirect, Error401, Error404 } from './views'
Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    meta: { title: 'Login' },
    hidden: true
  },
  {
    path: '/redirect',
    component: Home,
    hidden: true,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        component: Redirect,
        name: 'Redirect'
      }
    ]
  },
  {
    path: '/',
    component: Home,
    redirect: '/dashboard',
    meta: { title: 'Dashboard', icon: 'el-icon-fa-dashboard' },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: { title: 'Dashboard' }
      }
    ]
  },
  {
    path: '/problem',
    component: Home,
    redirect: '/problem/problem_list',
    name: 'Problem',
    meta: { title: 'Problem', icon: 'el-icon-fa-bars' },
    children: [
      {
        path: 'problem_list',
        component: ProblemList,
        name: 'ProblemList',
        meta: { title: 'Problem List' }
      },
      {
        path: 'machine/problem_create',
        component: Problem,
        name: 'CreateMachineProblem',
        meta: { title: 'Create Machine Problem' }
      },
      {
        path: 'machine/spider_create',
        component: SpiderProblem,
        name: 'CreateSpiderProblem',
        meta: { title: 'Create Spider Problem' }
      },
      {
        path: 'edit/:problemId',
        component: Problem,
        name: 'EditProblem',
        meta: { title: 'Edit Problem' },
        hidden: true
      }
    ]
  },
  {
    path: '/contest',
    component: Home,
    redirect: '/contest/contest_list',
    name: 'Contest',
    meta: { title: 'Contest', icon: 'el-icon-fa-trophy' },
    children: [
      {
        path: 'contest_list',
        component: ContestList,
        name: 'ContestList',
        meta: { title: 'Contest List' }
      },
      {
        path: 'create',
        component: Contest,
        name: 'CreateContest',
        meta: { title: 'Create Contest' }
      },
      {
        path: ':contestId/edit',
        component: Contest,
        name: 'EditContest',
        meta: { title: 'Edit Contest' },
        hidden: true
      },
      {
        path: ':contestId/announcement',
        component: Announcement,
        name: 'ContestAnnouncement',
        meta: { title: 'Contest Announcement' },
        hidden: true
      },
      {
        path: 'authenticatedUser/:contestId',
        component: Announcement,
        name: 'ContestAuthenticatedUser',
        meta: { title: 'Contest Authenticated User' },
        hidden: true
      },
      {
        path: ':contestData/problems',
        component: ProblemList,
        name: 'ContestProblemList',
        meta: { title: 'Contest Problem List' },
        hidden: true
      },
      {
        path: ':contestData/problem/create',
        component: ProblemList,
        name: 'CreateContestProblem',
        meta: { title: 'Create Contest Problem' },
        hidden: true
      },
      {
        path: ':contestData/spiderProblem/create',
        component: SpiderProblem,
        name: 'CreateContestSpiderProblem',
        meta: { title: 'Create Contest Spider Problem' },
        hidden: true
      },
      {
        path: ':contestId/problem/:problemId/edit',
        component: Problem,
        name: 'EditContestProblem',
        meta: { title: 'Edit Contest Problem' },
        hidden: true
      }
    ]
  },
  {
    path: '/401',
    component: Error401,
    name: 'NotAuthority',
    meta: { title: 'Not Authority' },
    hidden: true
  },
  {
    path: '/404',
    component: Error404,
    name: 'NotFound',
    meta: { title: 'Not Found' },
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/general',
    redirect: '/general/user',
    component: Home,
    meta: { title: 'General', icon: 'el-icon-menu' },
    children: [
      {
        path: 'user',
        component: User,
        name: 'User',
        meta: { title: 'User', roles: ['superadmin'] }
      },
      {
        path: 'announcement',
        component: Announcement,
        name: 'Announcement',
        meta: { title: 'Announcement', roles: ['superadmin'] }
      },
      {
        path: 'authenticated-user',
        component: AuthenticatedUser,
        name: 'AuthenticatedUser',
        meta: { title: 'Authenticated User', roles: ['superadmin'] }
      },
      {
        path: 'judge-server',
        component: JudgeServer,
        name: 'JudgeServer',
        meta: { title: 'Judge Server' }
      }
    ]
  }
]

const createRouter = () => new VueRouter({
  base: '/admin/',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
