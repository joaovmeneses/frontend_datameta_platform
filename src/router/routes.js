
export default [
  {
    path: '/',
    name: 'default',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/dashboards/default'),
  },
  {
    path: '/newSearch',
    name: 'newSearch',
    title:'test',
    meta: {
      authRequired: true,
      reload: true,
    },
    component: () => import('./views/search/form'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/account/login'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/account/register'),
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('./views/account/forgot-password'),
  },
  {
    path: '/file-manager',
    name: 'fileManager',
    component: () => import('./views/file-manager'),
  },
  {
    path: '/search/:id/calendar',
    name: 'calendar',
    component: () => import('./views/calendar/calendar'),
  },
  {
    path: '/search/:id/info',
    name: 'searchInfo',
    component: () => import('./views/bi/bi'),
  },
  {
    path: '/business-intelligence/',
    name: 'indexBi',
    component: () => import('./views/bi/index'),
  },
  {
    path: '/map/:id',
    name: 'map',
    component: () => import('./views/map/map'),
  },
  {
    path: '/logout',
    name: 'logout',
  },
  {
    path: '/404',
    name: '404',
    component: require('./views/utility/404').default,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
  
]
