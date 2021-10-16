import { Api } from '@/api'
import { AddReadingExercisesReq, AddStudentReq, ClassroomCreateReq, ClassroomUpdateReq, RemoveReadingExercisesReq, RemoveStudentReq } from '@/interfaces/api/classroom'
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

    EDIT_CLASSROOM (state, classroom) {
      let index = 0
      for (const c of state.classrooms) {
        if (c.pk === classroom.pk) break
        index++
      }
      state.classrooms.splice(index, 1, classroom)
    },

    REMOVE_CLASSROOM (state, pkDeleted) {
      state.classrooms = state.classrooms.filter(classroom => classroom.pk !== pkDeleted)
    },

    ADD_STUDENT_TO_CURRENT_CLASSROOM (state, student) {
      if (state.currentClassroom !== undefined) {
        state.currentClassroom.students.push(student)
      }
    },

    REMOVE_STUDENT_FROM_CURRENT_CLASSROOM (state, studentToRemove) {
      if (state.currentClassroom === undefined) return
      let index = 0
      for (const student of state.currentClassroom.students) {
        if (student.email === studentToRemove.email) break
        index++
      }
      state.currentClassroom.students.splice(index, 1)
    },

    ADD_READING_EXERCISES_TO_CURRENT_CLASSROOM (state, exercise) {
      if (state.currentClassroom !== undefined) {
        const existingPks = state.currentClassroom.reading_exercises.map(exercise => exercise.pk)
        if (!existingPks.includes(exercise.pk)) {
          state.currentClassroom.reading_exercises.push({
            pk: exercise.pk,
            identifier: exercise.identifier
          })
        }
      }
    },

    REMOVE_READING_EXERCISES_FROM_CURRENT_CLASSROOM (state, pkToRemove) {
      if (state.currentClassroom === undefined) return
      let index = 0
      for (const exercise of state.currentClassroom.reading_exercises) {
        if (exercise.pk === pkToRemove) break
        index++
      }
      state.currentClassroom.reading_exercises.splice(index, 1)
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

    async update (
      { commit },
      { pk, payload }: { pk: Classroom['pk'], payload: ClassroomUpdateReq }
    ): Promise<void> {
      const data = await Api.classroom.update(pk, payload)
      commit('EDIT_CLASSROOM', data)
    },

    async delete ({ commit }, pk: Classroom['pk']): Promise<void> {
      await Api.classroom.delete(pk)
      commit('REMOVE_CLASSROOM', pk)
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
        commit('REMOVE_STUDENT_FROM_CURRENT_CLASSROOM', student)
      })
    },

    async addReadingExercises (
      { state, commit },
      { classroomPk, payload }: { classroomPk?: number; payload: AddReadingExercisesReq[] }
    ): Promise<void> {
      let pk

      if (classroomPk !== undefined) {
        pk = classroomPk
      } else if (state.currentClassroom !== undefined) {
        pk = state.currentClassroom.pk
      }

      if (pk === undefined) return

      console.log(payload)
      await Api.classroom.addReadingExercises(pk, payload)
      payload.forEach(exercise => {
        commit('ADD_READING_EXERCISES_TO_CURRENT_CLASSROOM', exercise)
      })
    },

    async removeReadingExercises ({ state, commit }, payload: RemoveReadingExercisesReq[]): Promise<void> {
      if (state.currentClassroom === undefined) return
      await Api.classroom.removeReadingExercises(state.currentClassroom.pk, payload)
      payload.forEach(exercise => {
        commit('REMOVE_READING_EXERCISES_FROM_CURRENT_CLASSROOM', exercise.pk)
      })
    }
  }
}
