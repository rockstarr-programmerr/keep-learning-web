import { Api } from '@/api'
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
    classrooms: []
  },

  mutations: {
    SET_CLASSROOMS (state, classrooms) {
      state.classrooms = classrooms
    },

    SET_PAGINATION (state, pagination) {
      state.pagination = pagination
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
    }
  }
}
