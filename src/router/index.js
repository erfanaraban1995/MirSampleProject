import Vue from 'vue'
import Router from 'vue-router'

import config from 'SrcConfig'

// Layout
const Layout = () => import(/* webpackChunkName: "account" */ '@/components/layout')

// Views
const Dashboard = () => import(/* webpackChunkName: "account" */ '@/components/dashboard')
const Login = () => import(/* webpackChunkName: "account" */ '@/components/account/login')
const Register = () => import(/* webpackChunkName: "account" */ '@/components/account/Register')
const ForgotPassword = () => import(/* webpackChunkName: "account" */ '@/components/account/ForgotPassword')
const ResetPassword = () => import(/* webpackChunkName: "account" */ '@/components/account/ResetPassword')
const Page404 = () => import(/* webpackChunkName: "account" */ '@/components/shared/Page404')

import account from './account'
Vue.use(Router)

export const options = {
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior(to, from) {
    if (to.path !== from.path || to.query['p'] !== from.query['p']) {
      return window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }
  },
  routes: [
    {
      name: 'root',
      path: '/',
      redirect: config.homeUrl,
      meta: {label: 'home'},
      component: Layout,
      children: [
        {
          name: 'login',
          path: 'login',
          component: Login,
          meta: {public: true, title: 'nav.login'}
        },
        account,
      ]
    },
    {
      name: 'catch-all',
      path: '*',
      component: Page404
    }
  ]
}

if (config.homeUrl == '/dashboard') {
  options.routes[0].children.push({
    name: 'dashboard',
    path: 'dashboard',
    meta: {label: 'dashboard', auth: true, title: 'nav.home'},
    component: Dashboard
  })
}

if (config.auth.registerIsEnabled) {
  options.routes[0].children.push(
    ...[
      {
        name: 'Register',
        path: 'register',
        component: Register,
        meta: {public: true}
      }
    ]
  )
}

if (config.auth.resetPasswordIsEnabled) {
  options.routes[0].children.push(
    ...[
      {
        name: 'ForgotPassword',
        path: 'forgot-password',
        component: ForgotPassword,
        meta: {public: true, title: 'nav.forgetPassword'}
      },
      {
        name: 'ResetPassword',
        path: 'reset-password',
        component: ResetPassword,
        meta: {public: true, title: 'nav.resetPassword'}
      }
    ]
  )
}

export default new Router(options)
