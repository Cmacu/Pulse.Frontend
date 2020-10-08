import { RouteConfig, Route, NavigationGuard } from 'vue-router'
import auth from 'src/utils/auth'

type Next = Parameters<NavigationGuard>[2]

const routes: RouteConfig[] = [
  {
    path: '/public',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: 'leaderboard', component: () => import('pages/Leaderboard.vue') },
    ],
  },
  {
    path: '/logout',
    beforeEnter: (to, from, next) => {
      auth.logout(from.fullPath)
      return next('/auth/email')
    },
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      const isLoggedIn = await auth.isLoggedIn()
      if (isLoggedIn) {
        const redirectUrl = auth.getRedirectUrl()
        return next(redirectUrl)
      }
      if (!to.path.includes('email') && !to.query['email'])
        return next('/auth/email')
      next()
    },
    children: [
      {
        path: 'email',
        props: (route) => Object.assign({}, route.query),
        component: () => import('pages/Email.vue'),
      },
      {
        path: 'register',
        props: (route) => Object.assign({}, route.query),
        component: () => import('pages/Register.vue'),
      },
      {
        path: 'login',
        props: (route) => Object.assign({}, route.query),
        component: () => import('pages/Login.vue'),
      },
    ],
  },

  {
    path: '/games',
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      if (to.fullPath.includes('=demo')) return next()
      const isLoggedIn = await auth.isLoggedIn()
      if (!isLoggedIn) {
        auth.setRedirectUrl(to.fullPath)
        return next('/auth/login' + location.search)
      }
      next()
    },
    props: (route) => Object.assign({}, route.query),
    component: () => import('layouts/GameLayout.vue'),
    children: [
      {
        path: 'schotten2',
        component: () => import('src/games/Schotten2/Game.vue'),
      },
    ],
  },

  {
    path: '/',
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      const isLoggedIn = await auth.isLoggedIn()
      if (!isLoggedIn) {
        auth.setRedirectUrl(to.fullPath)
        return next('/auth/login' + location.search)
      }
      next()
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'profile',
        component: () => import('pages/Profile.vue'),
      },
      {
        path: 'profile/:id',
        props: true,
        component: () => import('pages/Profile.vue'),
      },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'leaderboard', component: () => import('pages/Leaderboard.vue') },
      { path: 'events', component: () => import('pages/Events.vue') },
    ],
  },
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('layouts/PublicLayout.vue'),
  children: [{ path: '', component: () => import('pages/Error404.vue') }],
})

export default routes
