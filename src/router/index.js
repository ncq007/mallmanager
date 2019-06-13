import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/components/login/login.vue')
    },
    {
      name: 'home',
      path: '/',
      component: () => import('@/components/home/home'),
      children: [
        {
          name: 'users',
          path: '/users',
          component: () => import('@/components/users/users')
        },
        {
          name: 'role',
          path: '/role',
          component: () => import('@/components/quanxian/jueselist')
        },
        {
          name: 'rights',
          path: '/rights',
          component: () => import('@/components/quanxian/quanxianlist')
        },
        {
          name: 'shangpinlist',
          path: '/shangpinlist',
          component: () => import('@/components/shangpin/shangpinlist')
        },
        {
          name: 'fenleiargs',
          path: '/fenleiargs',
          component: () => import('@/components/shangpin/fenleiargs')
        },
        {
          name: 'shangpinfenlei',
          path: '/shangpinfenlei',
          component: () => import('@/components/shangpin/shangpinfenlei')
        },
        {
          name: 'dingdan',
          path: '/dingdan',
          component: () => import('@/components/dingdan/dingdan')
        },
        {
          name: 'data',
          path: '/data',
          component: () => import('@/components/data/data')
        }
      ]
    }
  ]
})
