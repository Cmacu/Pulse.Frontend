import { RouteConfig, Route, NavigationGuard } from 'vue-router'
import auth from 'src/utils/auth'

type Next = Parameters<NavigationGuard>[2]

const routes: RouteConfig[] = [
  {
    path: 'logout',
    beforeEnter: (to, from, next) => {
      auth.logout(from.fullPath)
      return next('/public/login')
    },
  },
  {
    path: '/public',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/Login.vue'),
        beforeEnter: async (to: Route, from: Route, next: Next) => {
          const isLoggedIn = await auth.isLoggedIn()
          if (isLoggedIn) {
            const redirectUrl = auth.getRedirectUrl()
            return next(redirectUrl)
          }
          next()
        },
      },
      { path: 'support', component: () => import('pages/Support.vue') },
    ],
  },

  {
    path: '/games',
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
    path: '/',
    beforeEnter: async (to: Route, from: Route, next: Next) => {
      const isLoggedIn = await auth.isLoggedIn()
      if (!isLoggedIn) {
        auth.setRedirectUrl(to.fullPath)
        return next('/public/login' + location.search)
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
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('layouts/PublicLayout.vue'),
  children: [{ path: '', component: () => import('pages/Error404.vue') }],
})

export default routes
