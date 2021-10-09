import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import LayoutNoAppbar from '../layouts/LayoutNoAppbar.vue'
import LayoutClassroomTeacher from '../layouts/LayoutClassroomTeacher.vue'

import Home from '../views/Home.vue'
import Auth from '../views/auth/Auth.vue'
import Http404 from '../views/http/Http404.vue'
import ClassroomList from '../views/classroom/ClassroomList.vue'
import ClassroomCreate from '../views/classroom/ClassroomCreate.vue'
import ClassroomOverview from '../views/classroom/ClassroomOverview.vue'
import ClassroomStudents from '../views/classroom/ClassroomStudents.vue'
import ClassroomExercisesReading from '../views/classroom/ClassroomExercisesReading.vue'
import ClassroomExercisesListening from '../views/classroom/ClassroomExercisesListening.vue'

import { castToNumber, prefixWith } from './utils'

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
    },
    {
      path: '/:pk/overview',
      name: 'ClassroomOverview',
      component: ClassroomOverview,
      props: castToNumber('pk'),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/students',
      name: 'ClassroomStudents',
      component: ClassroomStudents,
      props: castToNumber('pk'),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/reading-exercises',
      name: 'ClassroomExercisesReading',
      component: ClassroomExercisesReading,
      props: castToNumber('pk'),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/listening-exercises',
      name: 'ClassroomExercisesListening',
      component: ClassroomExercisesListening,
      props: castToNumber('pk'),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/new',
      name: 'ClassroomCreate',
      component: ClassroomCreate
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
