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
    component: () => import('../views/Three.vue')
  },
  {
    path: '/Model',
    name: 'Model',
    component: () => import('../views/Model.vue')
  },
  {
    path: '/MyModel',
    name: 'MyModel',
    component: () => import('../views/MyModel.vue')
  },
  {
    path: '/Demo1',
    name: 'Demo1',
    component: () => import('../views/Demo1.vue')
  },
  {
    path: '/Map',
    name: 'Map',
    component: () => import('../views/Map.vue')
  },
  {
    path: '/Shape',
    name: 'Shape',
    component: () => import('../views/Shape.vue')
  },
  {
    path: '/Demo2',
    name: 'Demo2',
    component: () => import('../views/Demo2.vue')
  },
  {
    path: '/Async',
    name: 'Async',
    component: () => import('../views/Async.vue')
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
