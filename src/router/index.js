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
          name: 'roles',
          path: '/roles',
          component: () => import('@/components/quanxian/jueselist')
        },
        {
          name: 'rights',
          path: '/rights',
          component: () => import('@/components/quanxian/quanxianlist')
        },
        {
          name: 'goods',
          path: '/goods',
          component: () => import('@/components/shangpin/shangpinlist')
        },
        {
          name: 'params',
          path: '/params',
          component: () => import('@/components/shangpin/fenleiargs')
        },
        {
          name: 'categories',
          path: '/categories',
          component: () => import('@/components/shangpin/shangpinfenlei')
        },
        {
          name: 'orders',
          path: '/orders',
          component: () => import('@/components/dingdan/dingdan')
        },
        {
          name: 'reports',
          path: '/reports',
          component: () => import('@/components/data/data')
        }
      ]
    }
  ]
})
