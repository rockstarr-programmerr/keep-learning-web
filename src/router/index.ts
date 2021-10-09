import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import LayoutNoAppbar from '../layouts/LayoutNoAppbar.vue'

import Home from '../views/Home.vue'
import Auth from '../views/auth/Auth.vue'
import Http404 from '../views/http/Http404.vue'
import ClassroomList from '../views/classroom/ClassroomList.vue'

import { prefixWith } from './utils'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      layout: LayoutNoAppbar
    }
  },
  ...prefixWith('/classrooms', [
    {
      path: '',
      name: 'ClassroomList',
      component: ClassroomList
    }
  ]),
  {
    path: '*',
    name: 'Http404',
    component: Http404
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
