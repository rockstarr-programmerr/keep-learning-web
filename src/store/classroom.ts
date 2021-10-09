import { Api } from '@/api'
import { ClassroomCreateReq } from '@/interfaces/api/classroom'
import { PaginatedRes } from '@/interfaces/api/common'
import { Classroom } from '@/interfaces/classroom'
import { Module } from 'vuex'
import { RootState } from './index'

declare interface ClassroomState {
  classrooms: Classroom[],
  currentClassroom?: Classroom,
  pagination?: PaginatedRes
}

export const classroom: Module<ClassroomState, RootState> = {
  namespaced: true,

  state: {
    classrooms: [],
    currentClassroom: undefined,
    pagination: undefined
  },

  mutations: {
    SET_CLASSROOMS (state, classrooms) {
      state.classrooms = classrooms
    },

    SET_PAGINATION (state, pagination) {
      state.pagination = pagination
    },

    SET_CURRENT_CLASSROOM (state, classroom) {
      state.currentClassroom = classroom
    },

    ADD_CLASSROOM (state, classroom) {
      state.classrooms.splice(0, 0, classroom)
    }
  },

  actions: {
    async list ({ commit }): Promise<void> {
      const data = await Api.classroom.list()
      const classrooms = data.results
      const pagination: PaginatedRes = { ...data }
      delete pagination.results
      commit('SET_CLASSROOMS', classrooms)
      commit('SET_PAGINATION', pagination)
    },

    async detail ({ commit }, pk: Classroom['pk']) {
      const data = await Api.classroom.detail(pk)
      commit('SET_CURRENT_CLASSROOM', data)
    },

    async create ({ commit }, payload: ClassroomCreateReq): Promise<Classroom['pk']> {
      const data = await Api.classroom.create(payload)
      commit('ADD_CLASSROOM', data)
      return data.pk
    }
  }
}
