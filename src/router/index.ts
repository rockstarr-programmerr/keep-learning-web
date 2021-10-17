import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import LayoutNoAppbar from '../layouts/LayoutNoAppbar.vue'
import LayoutClassroomTeacher from '../layouts/LayoutClassroomTeacher.vue'
import LayoutClassroomStudent from '../layouts/LayoutClassroomStudent.vue'

import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import NewPassword from '../views/auth/NewPassword.vue'
import Http404 from '../views/http/Http404.vue'

import MyInfo from '../views/account/MyInfo.vue'
import ProfileUpdate from '../views/account/ProfileUpdate.vue'
import ChangePassword from '../views/account/ChangePassword.vue'

import ClassroomList from '../views/classroom/ClassroomList.vue'
import ClassroomCreate from '../views/classroom/ClassroomCreate.vue'
import ClassroomUpdate from '../views/classroom/ClassroomUpdate.vue'
import ClassroomOverview from '../views/classroom/ClassroomOverview.vue'
import ClassroomOverviewStudentReport from '../views/classroom/ClassroomOverviewStudentReport.vue'
import ClassroomStudents from '../views/classroom/ClassroomStudents.vue'
import ClassroomExercisesReading from '../views/classroom/ClassroomExercisesReading.vue'
import ClassroomExercisesListening from '../views/classroom/ClassroomExercisesListening.vue'

import ReadingExerciseList from '../views/reading-exercise/ReadingExerciseList.vue'
import ReadingExerciseDetail from '../views/reading-exercise/ReadingExerciseDetail.vue'
import ReadingExerciseCreate from '../views/reading-exercise/ReadingExerciseCreate.vue'
import ReadingExerciseUpdate from '../views/reading-exercise/ReadingExerciseUpdate.vue'
import ReadingExerciseEditAnswers from '../views/reading-exercise/ReadingExerciseEditAnswers.vue'
import ReadingExerciseSubmit from '../views/classroom/ReadingExerciseSubmit.vue'
import ReadingExerciseSubmitResult from '../views/classroom/ReadingExerciseSubmitResult.vue'

import { castToNumber, prefixWith } from './utils'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: LayoutNoAppbar
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      layout: LayoutNoAppbar
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      layout: LayoutNoAppbar
    }
  },
  {
    path: '/new-password',
    name: 'NewPassword',
    component: NewPassword,
    meta: {
      layout: LayoutNoAppbar
    }
  },
  ...prefixWith('/account', [
    {
      path: '',
      name: 'MyInfo',
      component: MyInfo
    },
    {
      path: '/edit',
      name: 'ProfileUpdate',
      component: ProfileUpdate
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword
    }
  ]),
  ...prefixWith('/classrooms', [
    {
      path: '',
      name: 'ClassroomList',
      component: ClassroomList
    },
    {
      path: '/new',
      name: 'ClassroomCreate',
      component: ClassroomCreate
    },
    {
      path: '/:pk/edit',
      name: 'ClassroomUpdate',
      component: ClassroomUpdate,
      props: castToNumber(['pk'])
    },
    {
      path: '/:pk/overview',
      name: 'ClassroomOverview',
      component: ClassroomOverview,
      props: castToNumber(['pk']),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/overview/:studentPk',
      name: 'ClassroomOverviewStudentReport',
      component: ClassroomOverviewStudentReport,
      props: castToNumber(['pk', 'studentPk']),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/students',
      name: 'ClassroomStudents',
      component: ClassroomStudents,
      props: castToNumber(['pk']),
      meta: {
        teacherLayout: LayoutClassroomTeacher
      }
    },
    {
      path: '/:pk/reading-exercises',
      name: 'ClassroomExercisesReading',
      component: ClassroomExercisesReading,
      props: castToNumber(['pk']),
      meta: {
        teacherLayout: LayoutClassroomTeacher,
        studentLayout: LayoutClassroomStudent
      }
    },
    {
      path: '/:pk/reading-exercises/:exercisePk/submit',
      name: 'ReadingExerciseSubmit',
      component: ReadingExerciseSubmit,
      props: castToNumber(['pk', 'exercisePk'])
    },
    {
      path: '/:pk/reading-exercises/:exercisePk/result/:studentPk',
      name: 'ReadingExerciseSubmitResult',
      component: ReadingExerciseSubmitResult,
      props: castToNumber(['pk', 'exercisePk', 'studentPk'])
    },
    {
      path: '/:pk/listening-exercises',
      name: 'ClassroomExercisesListening',
      component: ClassroomExercisesListening,
      props: castToNumber(['pk']),
      meta: {
        teacherLayout: LayoutClassroomTeacher,
        studentLayout: LayoutClassroomStudent
      }
    }
  ]),
  ...prefixWith('/reading-exercises', [
    {
      path: '',
      name: 'ReadingExerciseList',
      component: ReadingExerciseList
    },
    {
      path: '/new',
      name: 'ReadingExerciseCreate',
      component: ReadingExerciseCreate
    },
    {
      path: '/:pk/update',
      name: 'ReadingExerciseUpdate',
      component: ReadingExerciseUpdate,
      props: castToNumber(['pk'])
    },
    {
      path: '/:pk/edit-answers',
      name: 'ReadingExerciseEditAnswers',
      component: ReadingExerciseEditAnswers,
      props: castToNumber(['pk'])
    },
    {
      path: '/:pk',
      name: 'ReadingExerciseDetail',
      component: ReadingExerciseDetail,
      props: castToNumber(['pk'])
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

export const noAuthenRoutes = [
  'Login',
  'Register',
  'ResetPassword',
  'NewPassword'
]
