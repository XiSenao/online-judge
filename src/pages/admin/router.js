import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, Conf, AuthenticatedUser, Contest, ContestList, Home, JudgeServer, Login,
  Problem, SpiderProblem, ProblemList, User, PruneTestCase, Dashboard, ProblemImportOrExport, error401, error404 } from './views'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  // 手动捕获因接连访问同一个路由地址而发送的错误
  return originalPush.call(this, location).catch(err => err)
}

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: '/conf',
        name: 'conf',
        component: Conf
      },
      {
        path: '/prune-test-case',
        name: 'prune-test-case',
        component: PruneTestCase
      },
      {
        path: '/problems',
        name: 'problem-list',
        component: ProblemList
      },
      {
        path: '/problem/create',
        name: 'create-problem',
        component: Problem
      },
      {
        path: '/spiderProblem/create',
        name: 'create-spider-problem',
        component: SpiderProblem
      },
      {
        path: '/problem/edit/:problemId',
        name: 'edit-problem',
        component: Problem
      },
      {
        path: '/problem/batch_ops',
        name: 'problem_batch_ops',
        component: ProblemImportOrExport
      },
      {
        path: '/spiderProblem/create',
        name: 'create-spiderProblem',
        component: SpiderProblem
      },
      {
        path: '/contest/create',
        name: 'create-contest',
        component: Contest
      },
      {
        path: '/contest',
        name: 'contest-list',
        component: ContestList
      },
      {
        path: '/contest/:contestId/edit',
        name: 'edit-contest',
        component: Contest
      },
      {
        path: '/contest/:contestId/announcement',
        name: 'contest-announcement',
        component: Announcement
      },
      {
        path: '/contest/authenticatedUser/:contestId',
        name: 'contest-authenticated-user',
        component: AuthenticatedUser
      },
      {
        path: '/contest/:contestData/problems',
        name: 'contest-problem-list',
        component: ProblemList
      },
      {
        path: '/contest/:contestData/problem/create',
        name: 'create-contest-problem',
        component: Problem
      },
      {
        path: '/contest/:contestData/spiderProblem/create',
        name: 'create-contest-spider-problem',
        component: SpiderProblem
      },
      {
        path: '/contest/:contestId/problem/:problemId/edit',
        name: 'edit-contest-problem',
        component: Problem
      }
    ]
  },
  {
    path: '/401',
    name: 'notAuthority',
    meta: {title: '401'},
    component: error401
  },
  {
    path: '/404',
    name: 'notFound',
    meta: {title: '404'},
    component: error404
  }
] 

export const asyncRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/announcement',
        name: 'announcement',
        meta: {
          roles: ['superadmin']
        },
        component: Announcement
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          roles: ['superadmin']
        },
        component: User
      },
      {
        path: '/authenticated-user',
        name: 'authenticated-user',
        meta: {
          roles: ['superadmin']
        },
        component: AuthenticatedUser
      },
      {
        path: '/judge-server',
        name: 'judge-server',
        component: JudgeServer
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher 
}

export default router