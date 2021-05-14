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
    path: '/City',
    name: 'City',
    component: () => import('../views/City.vue')
  },
  {
    path: '/MyModel',
    name: 'MyModel',
    component: () => import('../views/MyModel.vue')
  },
  {
    path: '/UnBloom',
    name: 'UnBloom',
    component: () => import('../views/UnBloom.vue')
  },
  {
    path: '/NewBloom',
    name: 'NewBloom',
    component: () => import('../views/NewBloom.vue')
  },
  {
    path: '/Demo1',
    name: 'Demo1',
    component: () => import('../views/Demo1.vue')
  },
  {
    path: '/Line',
    name: 'Line',
    component: () => import('../views/Line.vue')
  },
  {
    path: '/Map',
    name: 'Map',
    component: () => import('../views/Map.vue')
  },
  {
    path: '/Bar',
    name: 'Bar',
    component: () => import('../views/Bar.vue')
  },
  {
    path: '/Shape',
    name: 'Shape',
    component: () => import('../views/Shape.vue')
  },
  {
    path: '/Texture',
    name: 'Texture',
    component: () => import('../views/Texture.vue')
  },
  {
    path: '/Out',
    name: 'Out',
    component: () => import('../views/Out.vue')
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
