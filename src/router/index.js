import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
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
        },
        {
          name: 'addgoods',
          path: '/addgoods',
          component: () => import('@/components/shangpin/addgoods')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === '/login') next()
  else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
