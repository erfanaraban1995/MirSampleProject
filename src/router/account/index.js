const Profile = () => import(/* webpackChunkName: "account" */ '@/components/account/Profile')
const ChangePassword = () => import(/* webpackChunkName: "account" */'@/components/account/ChangePassword')

export default {
  name: 'account',
  path: 'account',
  redirect: '/account/profile',
  meta: {label: 'account', auth: true},
  component: {
    render (c) { return c('router-view') }
  },
  children: [
    {
      path: 'profile',
      meta: {label: 'profile', auth: true, title: "title.account"},
      component: Profile
    },
    {
      path: 'password',
      meta: {label: 'changePassword', auth: true, title: "title.password"},
      component: ChangePassword
    }
  ]
}
