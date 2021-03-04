import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Three',
    name: 'Three',
    component: () => import(/* webpackChunkName: "about" */ '../views/Three.vue')
  },
  {
    path: '/Model',
    name: 'Model',
    component: () => import(/* webpackChunkName: "about" */ '../views/Model.vue')
  },
  {
    path: '/MyModel',
    name: 'MyModel',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyModel.vue')
  },
  {
    path: '/Async',
    name: 'Async',
    component: () => import(/* webpackChunkName: "about" */ '../views/Async.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
