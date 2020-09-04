import { RouteConfig, Route, NavigationGuard } from 'vue-router'
import auth from 'src/utils/auth'

type Next = Parameters<NavigationGuard>[2]

const routes: RouteConfig[] = [
  {
    path: '/games/',
    component: () => import('layouts/MatchLayout.vue'),
    children: [
      {
        path: 'schotten2/:matchId',
        props: true,
        component: () => import('src/games/Schotten2/Game.vue'),
      },
    ],
  },
  {
    path: '/login',
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      const isLoggedIn = await auth.isLoggedIn()
      if (isLoggedIn) {
        const redirectUrl = auth.getRedirectUrl()
        return next(redirectUrl)
      }
      next()
    },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'support', component: () => import('pages/Support.vue') },
    ],
  },
  {
    path: '/logout',
    beforeEnter: (to, from, next) => {
      auth.logout(from.fullPath)
      return next('/login')
    },
  },
  {
    path: '/',
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      const isLoggedIn = await auth.isLoggedIn()
      if (!isLoggedIn) {
        auth.setRedirectUrl(to.fullPath)
        return next('/login' + location.search)
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
      { path: 'ranking', component: () => import('pages/Ranking.vue') },
      { path: 'events', component: () => import('pages/Events.vue') },
    ],
  },
  {
    path: '/youtube',
    beforeEnter: () => {
      window.location.href =
        'https://www.youtube.com/channel/UCSuaz7dnb5oWFFbjQvqY-1A'
      return
    },
  },
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('layouts/AuthLayout.vue'),
  children: [{ path: '', component: () => import('pages/Error404.vue') }],
})

export default routes
