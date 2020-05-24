// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  Home,
  Logout,
  NotFound,
  NotAuthority,
  OIRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome
} from '../views'

import * as Contest from '@oj/views/contest'
import * as Setting from '@oj/views/setting'

export const constantRoutes = [
  {
    name: 'home',
    path: '/',
    meta: {title: 'Home'},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: 'Logout'},
    component: Logout
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: 'Apply Reset Password'},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: 'Reset Password'},
    component: ResetPassword
  },
  {
    name: 'problem-list',
    path: '/problem',
    meta: {title: 'Problem List'},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: 'Problem Details'},
    component: Problem
  },
  {
    name: 'submission-list',
    path: '/status',
    meta: {title: 'Submission List'},
    component: SubmissionList
  },
  {
    name: 'contest-list',
    path: '/contest',
    meta: {title: 'Contest List'},
    component: Contest.ContestList
  },
  {
    name: 'acm-rank',
    path: '/acm-rank',
    meta: {title: 'ACM Rankings'},
    component: ACMRank
  },
  {
    name: 'oi-rank',
    path: '/oi-rank',
    meta: {title: 'OI Rankings'},
    component: OIRank
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: 'About'},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: 'FAQ'},
    component: FAQ
  },
  {
    path: '/404',
    name: 'notFound',
    meta: {title: '404'},
    component: NotFound
  },
  {
    path: '/401',
    name: 'notAuthority',
    meta: {title: '401'},
    component: NotAuthority
  }
] 

export const asyncRoutes = [
  {
    name: 'submission-details',
    path: '/status/:data',
    meta: {title: 'Submission Details', roles: ['user']},
    component: SubmissionDetails
  },
  {
    name: 'contest-details',
    path: '/contest/:contestID/',
    component: Contest.ContestDetails,
    meta: {title: 'Contest Details'},
    children: [
      {
        name: 'contest-submission-list',
        path: 'submissions',
        meta: { roles: ['user'] },
        component: SubmissionList
      },
      {
        name: 'contest-problem-list',
        path: 'problems',
        meta: { roles: ['user'] },
        component: Contest.ContestProblemList
      },
      {
        name: 'contest-problem-details',
        path: 'problem/:problemID/',
        meta: { roles: ['user'] },
        component: Problem
      },
      {
        name: 'contest-announcement-list',
        path: 'announcements',
        meta: { roles: ['user'] },
        component: Announcements
      },
      {
        name: 'contest-rank',
        path: 'rank',
        meta: { roles: ['user'] },
        component: Contest.ContestRank
      },
      {
        name: 'acm-helper',
        path: 'helper',
        meta: { roles: ['userAdmin'] },
        component: Contest.ACMContestHelper
      }
    ]
  },
  {
    name: 'user-massage',
    path: '/user/message',
    component: Announcements,
    meta: {title: 'My Message', roles: ['user']}
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {title: 'User Home', roles: ['user']}
  },
  {
    path: '/setting',
    component: Setting.Settings,
    children: [
      {
        name: 'default-setting',
        path: '',
        meta: {title: 'Default Settings', roles: ['user']},
        component: Setting.ProfileSetting
      },
      {
        name: 'profile-setting',
        path: 'profile',
        meta: {title: 'Profile Settings', roles: ['user']},
        component: Setting.ProfileSetting
      },
      {
        name: 'account-setting',
        path: 'account',
        meta: {title: 'Account Settings', roles: ['user']},
        component: Setting.AccountSetting
      },
      {
        name: 'security-setting',
        path: 'security',
        meta: {title: '404', roles: ['user']},
        component: NotFound
      },
      {
        name: 'certification-setting',
        path: 'certification',
        meta: {title: 'Certification Settings', roles: ['user']},
        component: Setting.CertificationSetting
      }
    ]
  }
]
