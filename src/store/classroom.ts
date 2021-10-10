import { Api } from '@/api'
import { AddStudentReq, ClassroomCreateReq, RemoveStudentReq } from '@/interfaces/api/classroom'
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
    },

    ADD_STUDENT_TO_CURRENT_CLASSROOM (state, student) {
      if (state.currentClassroom !== undefined) {
        state.currentClassroom.students.push(student)
      }
    },

    REMOVE_STUDENT_TO_CURRENT_CLASSROOM (state, studentToRemove) {
      if (state.currentClassroom === undefined) return
      let index = 0
      for (const student of state.currentClassroom.students) {
        if (student.email === studentToRemove.email) break
        index++
      }
      state.currentClassroom.students.splice(index, 1)
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
    },

    async addStudents ({ state, commit }, payload: AddStudentReq[]): Promise<void> {
      if (state.currentClassroom === undefined) return
      await Api.classroom.addStudents(state.currentClassroom.pk, payload)
      payload.forEach(student => {
        commit('ADD_STUDENT_TO_CURRENT_CLASSROOM', student)
      })
    },

    async removeStudents ({ state, commit }, payload: RemoveStudentReq[]): Promise<void> {
      if (state.currentClassroom === undefined) return
      await Api.classroom.removeStudents(state.currentClassroom.pk, payload)
      payload.forEach(student => {
        commit('REMOVE_STUDENT_TO_CURRENT_CLASSROOM', student)
      })
    }
  }
}
