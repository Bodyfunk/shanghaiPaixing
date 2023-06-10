import { createWebHashHistory, createRouter } from 'vue-router'
import Layout from '../views/Layout.vue'



const routes = [
  {
    path: '',
    component: Layout,
    children: [{
      path: '/home',
      component: () => import('../views/index.vue'),
    }]
  },
  {
    path: '',
    component: Layout,
    children: [{
      path: '/monitor',
      component: () => import('../views/monitor/index.vue')
    }]
  },
  { path: '/login', component: () => import('../views/login.vue') },
  { path: '/register', component: () => import('../views/register.vue') }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router;
